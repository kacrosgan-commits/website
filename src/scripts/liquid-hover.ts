/**
 * Project images: a restrained liquid ripple with a slight colour shift that follows the pointer.
 *
 * One fixed canvas, drawn by one renderer, is placed over whichever project image the pointer is
 * on. Every frame it re-measures that image, so it stays on it while the horizontal gallery moves.
 * The real <img> stays underneath; the canvas fades in over an identical copy of it, so the swap is
 * invisible, and fades out again when the pointer leaves.
 *
 * Loaded by luxe-motion.ts on the first hover over a project image, and only where canMountLiquid()
 * and hasHardwareWebgl() pass. Everyone else keeps the CSS image scale on hover.
 */
import {
  LinearFilter,
  Mesh,
  NoColorSpace,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector4,
  WebGLRenderer,
} from "three";
import { canMountLiquid } from "./vortex-gate";

const FRAME_SELECTOR = "[data-liquid] .shot-frame";
const MAX_DPR = 2;

let mounted = false;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function mountLiquidHover(first?: PointerEvent): void {
  if (mounted || !canMountLiquid()) return;

  const canvas = document.createElement("canvas");
  canvas.className = "liquid-canvas";
  canvas.setAttribute("aria-hidden", "true");

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: false, antialias: false, failIfMajorPerformanceCaveat: true, powerPreference: "default" });
  } catch {
    return;
  }
  mounted = true;
  document.body.append(canvas);
  document.documentElement.classList.add("liquid-on");

  const textures = new Map<HTMLImageElement, Texture>();
  const uniforms = {
    uTex: { value: null as Texture | null },
    uSize: { value: new Vector2(1, 1) },
    uBox: { value: new Vector4(0, 0, 1, 1) },
    uNat: { value: new Vector2(1, 1) },
    uObj: { value: new Vector2(0.5, 0) },
    uFit: { value: 0 },
    uMouse: { value: new Vector2(0, 0) },
    uStrength: { value: 0 },
    uShift: { value: 0 },
    uTime: { value: 0 },
  };
  const geometry = new PlaneGeometry(2, 2);
  const material = rippleMaterial(uniforms);
  const scene = new Scene();
  const quad = new Mesh(geometry, material);
  quad.frustumCulled = false;
  scene.add(quad);
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  /* State */
  let alive = true;
  let raf = 0;
  let last = 0;
  let card: HTMLElement | null = null;
  let img: HTMLImageElement | null = null;
  let clip: HTMLElement | null = null;
  let hovering = false;
  let width = 0;
  let height = 0;
  let strength = 0;
  let shift = 0;
  const pointer = { x: -1, y: -1, has: false };
  const mouse = new Vector2(0, 0);
  const smooth = new Vector2(0, 0);

  const textureFor = (image: HTMLImageElement): Texture | null => {
    if (!image.complete || image.naturalWidth === 0) return null;
    let texture = textures.get(image);
    if (!texture) {
      texture = new Texture(image);
      /* Raw sRGB in and out, like the browser's own drawing of the <img>. */
      texture.colorSpace = NoColorSpace;
      texture.flipY = false;
      texture.generateMipmaps = false;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.needsUpdate = true;
      textures.set(image, texture);
    }
    return texture;
  };

  /* The element whose box the canvas covers: the screen for website frames (it clips the image),
     the artwork itself for phone panels. */
  const clipFor = (frame: HTMLElement, image: HTMLImageElement) =>
    frame.classList.contains("shot-frame-web") ? (frame.querySelector<HTMLElement>(".shot-screen") ?? image) : image;

  const setTarget = (frame: HTMLElement | null) => {
    const image = frame?.querySelector<HTMLImageElement>("img") ?? null;
    if (image && image === img) {
      hovering = true;
      return;
    }
    /* Leaving the current image: it eases out first, and render() then picks up whatever is
       under the pointer. */
    if (img) {
      hovering = false;
      return;
    }
    if (!frame || !image) return;
    const texture = textureFor(image);
    if (!texture) return;
    img = image;
    clip = clipFor(frame, image);
    card = frame.closest<HTMLElement>(".portfolio-card");
    hovering = true;
    uniforms.uTex.value = texture;
    uniforms.uNat.value.set(image.naturalWidth, image.naturalHeight);
    const style = getComputedStyle(image);
    const [x = "50%", y = "50%"] = style.objectPosition.split(" ");
    uniforms.uObj.value.set(parseFloat(x) / 100, parseFloat(y) / 100);
    uniforms.uFit.value = style.objectFit === "contain" ? 1 : 0;
    const frameStyle = getComputedStyle(frame);
    canvas.style.borderRadius =
      clip === image ? style.borderRadius : `0 0 ${frameStyle.borderBottomRightRadius} ${frameStyle.borderBottomLeftRadius}`;
    card?.classList.add("is-liquid");
    smooth.copy(mouse);
  };

  const frameAt = (x: number, y: number) =>
    (document.elementFromPoint(x, y)?.closest<HTMLElement>(FRAME_SELECTOR) ?? null);

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.has = true;
    setTarget((event.target as Element | null)?.closest?.<HTMLElement>(FRAME_SELECTOR) ?? null);
    wake();
  };

  /* The pointer can sit still while the page (or the gallery) moves an image under it. */
  const onScroll = () => {
    if (!pointer.has) return;
    setTarget(frameAt(pointer.x, pointer.y));
    wake();
  };

  const onLeaveWindow = () => {
    pointer.has = false;
    hovering = false;
    wake();
  };

  const resize = (w: number, h: number) => {
    if (w === width && h === height) return;
    width = w;
    height = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(w, h, false);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    uniforms.uSize.value.set(w, h);
  };

  const render = (now: number) => {
    raf = 0;
    if (!alive) return;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;

    strength += ((hovering ? 1 : 0) - strength) * (1 - Math.exp(-dt * (hovering ? 5 : 7)));
    if (!img || !clip || (!hovering && strength < 0.002)) {
      strength = 0;
      canvas.classList.remove("is-on");
      card?.classList.remove("is-liquid");
      card = null;
      img = null;
      clip = null;
      last = 0;
      /* A pointer that moved onto another image while this one eased out. */
      if (pointer.has) {
        const next = frameAt(pointer.x, pointer.y);
        if (next) {
          setTarget(next);
          raf = requestAnimationFrame(render);
        }
      }
      return;
    }

    const box = clip.getBoundingClientRect();
    const imgBox = img.getBoundingClientRect();
    const w = Math.max(1, Math.round(box.width));
    const h = Math.max(1, Math.round(box.height));
    resize(w, h);
    canvas.style.transform = `translate3d(${box.left}px, ${box.top}px, 0)`;
    /* The image box inside the canvas. The CSS hover scale is off while the canvas is on. */
    uniforms.uBox.value.set(imgBox.left - box.left, imgBox.top - box.top, imgBox.width, imgBox.height);

    if (pointer.has) mouse.set(pointer.x - box.left, pointer.y - box.top);
    const before = smooth.clone();
    smooth.lerp(mouse, 1 - Math.exp(-dt * 9));
    const speed = before.distanceTo(smooth) / Math.max(dt, 0.001) / Math.max(w, 1);
    shift += (clamp(speed * 0.6) - shift) * (1 - Math.exp(-dt * 6));

    uniforms.uMouse.value.copy(smooth);
    uniforms.uStrength.value = strength;
    uniforms.uShift.value = shift;
    uniforms.uTime.value = now / 1000;

    try {
      renderer.render(scene, camera);
    } catch {
      teardown();
      return;
    }
    canvas.classList.add("is-on");
    raf = requestAnimationFrame(render);
  };

  const wake = () => {
    if (!alive || raf || (!hovering && strength < 0.002)) return;
    last = 0;
    raf = requestAnimationFrame(render);
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    teardown();
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const onMediaChange = () => {
    if (reduced.matches || !fine.matches) teardown();
  };
  /* Hidden before a View Transition captures the page, so the image morph never carries it. */
  const onPageSwap = () => canvas.classList.remove("is-on");

  const teardown = () => {
    if (!alive) return;
    alive = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    document.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pagehide", teardown);
    window.removeEventListener("pageswap", onPageSwap);
    reduced.removeEventListener("change", onMediaChange);
    fine.removeEventListener("change", onMediaChange);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    card?.classList.remove("is-liquid");
    document.documentElement.classList.remove("liquid-on");
    textures.forEach((texture) => texture.dispose());
    textures.clear();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
    mounted = false;
  };

  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeaveWindow);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pagehide", teardown);
  window.addEventListener("pageswap", onPageSwap);
  reduced.addEventListener("change", onMediaChange);
  fine.addEventListener("change", onMediaChange);
  canvas.addEventListener("webglcontextlost", onContextLost);

  renderer.compile(scene, camera);
  if (first) onPointerMove(first);
}

function rippleMaterial(uniforms: Record<string, { value: unknown }>): ShaderMaterial {
  return new ShaderMaterial({
    uniforms,
    depthTest: false,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTex;
      uniform vec2 uSize;
      uniform vec4 uBox;
      uniform vec2 uNat;
      uniform vec2 uObj;
      uniform float uFit;
      uniform vec2 uMouse;
      uniform float uStrength;
      uniform float uShift;
      uniform float uTime;
      varying vec2 vUv;

      /* CSS pixels in the image box -> texture coordinates, honouring object-fit and object-position. */
      vec2 toUv(vec2 p) {
        float s = uFit < 0.5 ? max(uBox.z / uNat.x, uBox.w / uNat.y) : min(uBox.z / uNat.x, uBox.w / uNat.y);
        vec2 offset = (uBox.zw - uNat * s) * uObj;
        return clamp((p - offset) / s / uNat, vec2(0.0), vec2(1.0));
      }

      void main() {
        vec2 css = vec2(vUv.x, 1.0 - vUv.y) * uSize;
        /* A slight zoom toward the pointer, the WebGL stand-in for the CSS hover scale. */
        css = uMouse + (css - uMouse) / (1.0 + 0.035 * uStrength);

        vec2 d = css - uMouse;
        float dist = length(d);
        vec2 dir = dist > 0.001 ? d / dist : vec2(0.0);
        float reach = 0.42 * max(uSize.x, uSize.y);
        /* Calm at the pointer itself (no pinch where the direction is undefined), strongest a short
           way out, fading with distance. */
        float falloff = exp(-dist / reach) * smoothstep(0.0, 36.0, dist);
        /* Rings travelling outward from the pointer, a few pixels deep at most. */
        float wave = sin(dist * 0.055 - uTime * 4.2);
        vec2 offset = dir * wave * falloff * uStrength * 4.5;
        vec2 p = css + offset - uBox.xy;

        /* Colour shift: red and blue pulled apart along the ripple, more while the pointer moves. */
        vec2 split = dir * falloff * uStrength * (0.6 + 2.4 * uShift);
        float r = texture2D(uTex, toUv(p + split)).r;
        float g = texture2D(uTex, toUv(p)).g;
        float b = texture2D(uTex, toUv(p - split)).b;
        gl_FragColor = vec4(r, g, b, 1.0);
      }
    `,
  });
}
