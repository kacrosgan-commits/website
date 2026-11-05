/**
 * Homepage WebGL scene: the hero's lobby photo with depth.
 *
 * One fixed canvas behind the content, drawn by one renderer. It repaints the lobby photo with a
 * hand-built depth map, so pointer and scroll move near and far parts of the room by different
 * amounts. It is mapped to the live <img> box, so it matches the static image pixel for pixel and
 * replaces it with a crossfade once the hero's intro has finished.
 *
 * Everything here is an enhancement. The static <img> stays the first paint; if WebGL is
 * missing or the context is lost, the page drops back to it.
 */
import {
  CanvasTexture,
  Color,
  LinearFilter,
  LinearMipmapLinearFilter,
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
  type Material,
} from "three";
import { canMountVortex } from "./vortex-gate";

/* Measurements of the lobby photo, in source pixels. */
const SRC_W = 1813;
const SRC_H = 868;
/* The bright LED band of the halo pendant, so the depth map can place it. */
const HALO = { x: 1537, y: 249, a: 146, b: 30.5 };
const HALO_DEPTH = 0.6;
const FOCUS = 0.5;
const MAX_DPR = 1.5;

type Disposable = { dispose: () => void };

let active: (() => void) | null = null;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function mountVortexScene(): void {
  if (active || !canMountVortex()) return;
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const photo = hero?.querySelector<HTMLImageElement>(".photo-hero-img");
  const frame = hero?.querySelector<HTMLElement>(".photo-hero");
  if (!hero || !photo || !frame) return;
  void start(hero, frame, photo);
}

async function start(hero: HTMLElement, frame: HTMLElement, photo: HTMLImageElement): Promise<void> {
  try {
    await photo.decode();
  } catch {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "vx-scene";
  canvas.setAttribute("aria-hidden", "true");

  let renderer: WebGLRenderer;
  try {
    /* failIfMajorPerformanceCaveat: no context where WebGL would be rendered in software, so
       machines without a usable GPU keep the static design instead of burning the CPU. */
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    return;
  }
  if (!renderer.getContext() || softwareRenderer(renderer.getContext())) {
    renderer.dispose();
    return;
  }

  const glow = document.querySelector(".page-glow");
  document.body.insertBefore(canvas, glow ? glow.nextSibling : document.body.firstChild);

  renderer.setClearColor(new Color(0x000000), 0);

  const disposables: Disposable[] = [];
  const track = <T extends Disposable>(item: T): T => {
    disposables.push(item);
    return item;
  };

  /* Kept as raw sRGB and written out unconverted, so it is filtered in the same space as the
     browser scales the <img>. Filtering in linear light would brighten fine detail by a few percent. */
  const photoTexture = track(new Texture(photo));
  photoTexture.colorSpace = NoColorSpace;
  photoTexture.minFilter = LinearMipmapLinearFilter;
  photoTexture.magFilter = LinearFilter;
  photoTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  photoTexture.needsUpdate = true;
  const depthTexture = track(new CanvasTexture(buildDepthMap()));
  depthTexture.colorSpace = NoColorSpace;
  depthTexture.minFilter = LinearFilter;
  depthTexture.magFilter = LinearFilter;

  const uniforms = {
    uPhoto: { value: photoTexture },
    uDepth: { value: depthTexture },
    uImg: { value: new Vector4(0, 0, 1, 1) },
    uClip: { value: new Vector4(0, 0, 1, 1) },
    uObj: { value: new Vector2(0.92, 0.5) },
    uSrc: { value: new Vector2(SRC_W, SRC_H) },
    uOff: { value: new Vector2(0, 0) },
    uFocus: { value: FOCUS },
    uDpr: { value: 1 },
    uBufH: { value: 1 },
  };
  const scene = new Scene();
  const quad = new Mesh(track(new PlaneGeometry(2, 2)), track(photoMaterial(uniforms)));
  quad.frustumCulled = false;
  scene.add(quad);
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  /* State */
  let alive = true;
  let running = false;
  let heroVisible = false;
  let raf = 0;
  let last = 0;
  let lastDraw = 0;
  let lastInput = 0;
  let lastScroll = -1;
  let live = false;
  let liveAt = 0;
  let width = 1;
  let height = 1;
  let objectPosition = new Vector2(0.92, 0.5);
  const pointer = new Vector2(0, 0);
  const pointerSmooth = new Vector2(0, 0);
  let scrollSmooth = scrollProgress(hero);

  const resize = () => {
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(width, height, false);
    const buffer = renderer.getDrawingBufferSize(new Vector2());
    uniforms.uBufH.value = buffer.y;
    uniforms.uDpr.value = renderer.getPixelRatio();
    const [x = "92%", y = "50%"] = getComputedStyle(photo).objectPosition.split(" ");
    objectPosition = new Vector2(parseFloat(x) / 100, parseFloat(y) / 100);
  };

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointer.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
    lastInput = performance.now();
  };

  const render = (now: number) => {
    raf = 0;
    if (!alive || !running) return;
    if (window.scrollY !== lastScroll) {
      lastScroll = window.scrollY;
      lastInput = now;
    }
    /* Nothing moves once the pointer and scroll have settled and the parallax has eased in, so stop drawing. */
    const settled = live && now - lastInput > 1500 && now - liveAt > 2500 && pointerSmooth.distanceTo(pointer) < 0.001;
    if (settled && now - lastDraw < 250) {
      raf = requestAnimationFrame(render);
      return;
    }
    lastDraw = now;
    const dt = Math.min(0.1, last ? (now - last) / 1000 : 1 / 60);
    last = now;

    pointerSmooth.lerp(pointer, 1 - Math.exp(-dt * 3.2));
    scrollSmooth = mix(scrollSmooth, scrollProgress(hero), 1 - Math.exp(-dt * 7));

    /* Where the photo sits right now. The quad follows the real <img> so the two match exactly. */
    const imgBox = photo.getBoundingClientRect();
    const clipBox = frame.getBoundingClientRect();
    /* Depth parallax ramps in after the crossfade, so the swap itself is invisible. */
    const ramp = live ? smooth(0, 1600, now - liveAt) : 0;
    uniforms.uOff.value.set(pointerSmooth.x * 0.0065, pointerSmooth.y * 0.0045 + scrollSmooth * 0.014).multiplyScalar(ramp);
    uniforms.uImg.value.set(imgBox.left, imgBox.top, imgBox.width, imgBox.height);
    uniforms.uClip.value.set(clipBox.left, clipBox.top, clipBox.width, clipBox.height);
    uniforms.uObj.value.copy(objectPosition);

    try {
      renderer.render(scene, camera);
    } catch {
      stop();
      return;
    }

    if (!live) {
      live = true;
      liveAt = now;
      document.documentElement.classList.add("vx-live");
    }
    raf = requestAnimationFrame(render);
  };

  const play = () => {
    if (!alive || running || document.hidden || !heroVisible) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(render);
  };

  const pause = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  /* Draw only while the hero is on screen. */
  const visibility = new IntersectionObserver(([entry]) => {
    heroVisible = Boolean(entry?.isIntersecting);
    if (heroVisible) {
      play();
      return;
    }
    pause();
    /* The canvas keeps showing its last frame, so leave it empty rather than stale. */
    renderer.clear();
  });

  const onVisibility = () => (document.hidden ? pause() : play());
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wide = window.matchMedia("(min-width: 64rem)");
  const onMediaChange = () => {
    if (reduced.matches || !wide.matches) stop();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
  };

  const stop = () => {
    if (!alive) return;
    alive = false;
    pause();
    visibility.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", stop);
    reduced.removeEventListener("change", onMediaChange);
    wide.removeEventListener("change", onMediaChange);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    document.documentElement.classList.remove("vx-live");
    scene.traverse((child) => disposeMesh(child as Mesh));
    disposables.forEach((item) => item.dispose());
    renderer.dispose();
    canvas.remove();
    active = null;
  };
  active = stop;

  const resizeObserver = new ResizeObserver(resize);
  resize();
  resizeObserver.observe(canvas);
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", stop);
  reduced.addEventListener("change", onMediaChange);
  wide.addEventListener("change", onMediaChange);
  canvas.addEventListener("webglcontextlost", onContextLost);

  /* Compile now, then wait for the iris intro so the swap never shows inside it. */
  renderer.compile(scene, camera);
  await Promise.all(frame.getAnimations().map((animation) => animation.finished.catch(() => undefined)));
  if (!alive) return;
  visibility.observe(hero);
}

/** Some browsers render WebGL in software without flagging a performance caveat. */
function softwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}

/** 0 with the hero fully on screen, 1 once it has scrolled away. */
function scrollProgress(hero: HTMLElement): number {
  return clamp(window.scrollY / Math.max(hero.offsetHeight, 1));
}

function disposeMesh(mesh: Mesh): void {
  mesh.geometry?.dispose();
  const material = mesh.material as Material | Material[] | undefined;
  if (Array.isArray(material)) material.forEach((item) => item.dispose());
  else material?.dispose();
}

function photoMaterial(uniforms: Record<string, { value: unknown }>): ShaderMaterial {
  return new ShaderMaterial({
    uniforms,
    depthTest: false,
    depthWrite: false,
    vertexShader: /* glsl */ `
      void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uPhoto;
      uniform sampler2D uDepth;
      uniform vec4 uImg;
      uniform vec4 uClip;
      uniform vec2 uObj;
      uniform vec2 uSrc;
      uniform vec2 uOff;
      uniform float uFocus;
      uniform float uDpr;
      uniform float uBufH;
      void main() {
        vec2 css = vec2(gl_FragCoord.x, uBufH - gl_FragCoord.y) / uDpr;
        if (css.x < uClip.x || css.y < uClip.y || css.x > uClip.x + uClip.z || css.y > uClip.y + uClip.w) discard;
        float s = max(uImg.z / uSrc.x, uImg.w / uSrc.y);
        vec2 shift = (uImg.zw - uSrc * s) * uObj;
        vec2 uv = (css - uImg.xy - shift) / s / uSrc;
        float depth = texture2D(uDepth, vec2(uv.x, 1.0 - uv.y)).r;
        uv = clamp(uv + uOff * (depth - uFocus), vec2(0.0005), vec2(0.9995));
        gl_FragColor = vec4(texture2D(uPhoto, vec2(uv.x, 1.0 - uv.y)).rgb, 1.0);
      }
    `,
  });
}

/**
 * Approximate depth of the lobby, 0 far to 1 near, drawn in source pixels at a quarter scale.
 * A corridor field around the vanishing point covers the floor, ceiling and walls; shapes on
 * top add the reception wall, desk, plants and the pendant. It is blurred so nothing tears.
 */
function buildDepthMap(): HTMLCanvasElement {
  const k = 0.25;
  const w = Math.round(SRC_W * k);
  const h = Math.round(SRC_H * k);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext("2d");
  if (!context) return canvas;

  const image = context.createImageData(w, h);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const dx = (x / k - 1040) / 1050;
      const dy = (y / k - 430) / 470;
      const field = Math.min(1, Math.hypot(dx * 0.9, dy * 1.15));
      const value = Math.round((0.12 + 0.8 * field * field * (3 - 2 * field)) * 255);
      const i = (y * w + x) * 4;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = value;
      image.data[i + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  context.scale(k, k);

  const gray = (value: number) => {
    const c = Math.round(value * 255);
    return `rgb(${c},${c},${c})`;
  };
  const poly = (points: number[][], value: number) => {
    context.fillStyle = gray(value);
    context.beginPath();
    points.forEach(([px, py], index) => (index ? context.lineTo(px!, py!) : context.moveTo(px!, py!)));
    context.closePath();
    context.fill();
  };

  /* Slatted reception wall, nearer toward the right edge */
  const wall = context.createLinearGradient(1290, 0, 1813, 0);
  wall.addColorStop(0, gray(0.46));
  wall.addColorStop(1, gray(0.64));
  context.fillStyle = wall;
  context.fillRect(1290, 80, 523, 470);
  /* Lounge and back wall at the end of the corridor */
  poly([[1035, 380], [1290, 380], [1290, 600], [1035, 600]], 0.24);
  /* Glass meeting room */
  poly([[605, 160], [1030, 300], [1030, 640], [605, 690]], 0.36);
  /* Reception desk */
  poly([[1372, 518], [1800, 520], [1795, 700], [1500, 692], [1378, 650]], 0.74);
  /* Centre tree and pot */
  context.fillStyle = gray(0.6);
  context.beginPath();
  context.ellipse(1318, 420, 92, 118, 0, 0, Math.PI * 2);
  context.fill();
  poly([[1286, 532], [1346, 532], [1342, 622], [1290, 622]], 0.62);
  /* Left plant in the foreground */
  poly([[0, 250], [230, 300], [220, 560], [170, 820], [30, 820], [0, 700]], 0.95);
  /* Floor reaching the camera */
  const floor = context.createLinearGradient(0, 640, 0, SRC_H);
  floor.addColorStop(0, "rgba(255,255,255,0)");
  floor.addColorStop(1, gray(1));
  context.fillStyle = floor;
  context.fillRect(0, 640, SRC_W, SRC_H - 640);
  /* The halo pendant */
  context.strokeStyle = gray(HALO_DEPTH);
  context.lineWidth = 22;
  context.beginPath();
  context.ellipse(HALO.x, HALO.y, HALO.a, HALO.b, 0, 0, Math.PI * 2);
  context.stroke();

  context.setTransform(1, 0, 0, 1, 0, 0);
  boxBlur(context, w, h, 3, 3);
  return canvas;
}

function boxBlur(context: CanvasRenderingContext2D, w: number, h: number, radius: number, passes: number): void {
  const image = context.getImageData(0, 0, w, h);
  let src = new Float32Array(w * h);
  for (let i = 0; i < w * h; i += 1) src[i] = image.data[i * 4]!;
  let dst = new Float32Array(w * h);
  const span = radius * 2 + 1;
  for (let pass = 0; pass < passes; pass += 1) {
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let sum = 0;
        for (let o = -radius; o <= radius; o += 1) sum += src[y * w + clamp(x + o, 0, w - 1)]!;
        dst[y * w + x] = sum / span;
      }
    }
    [src, dst] = [dst, src];
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        let sum = 0;
        for (let o = -radius; o <= radius; o += 1) sum += src[clamp(y + o, 0, h - 1) * w + x]!;
        dst[y * w + x] = sum / span;
      }
    }
    [src, dst] = [dst, src];
  }
  for (let i = 0; i < w * h; i += 1) {
    const value = Math.round(src[i]!);
    image.data[i * 4] = image.data[i * 4 + 1] = image.data[i * 4 + 2] = value;
  }
  context.putImageData(image, 0, 0);
}
