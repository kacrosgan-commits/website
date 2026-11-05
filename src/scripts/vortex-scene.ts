/**
 * Homepage WebGL scene: one fixed canvas behind the content, drawn by one renderer.
 *
 * Pass 1 paints the lobby photo with a hand-built depth map, so pointer and scroll move near
 * and far parts of the room by different amounts. It is mapped to the live <img> box, so it
 * matches the static image pixel for pixel and can replace it with a crossfade.
 * Pass 2 paints a polished gold ring that starts on the halo pendant in the photo and flies
 * through the camera as the visitor scrolls out of the hero. It then reappears at three more
 * anchors: large and turning beside the specialties list, framing the active portrait in the
 * people section, and settling around the closing headline. The closing section's photo is
 * drawn here too, with its overlay, so the ring can sit between the photo and the text.
 *
 * Text stays readable: every ring shader is multiplied by a mask computed in the shader from
 * uniforms. The ring may only show inside the hero, and drops to a few percent inside a
 * feathered box around each line of text over it. No textures are uploaded per frame.
 *
 * Everything here is an enhancement. The static <img> stays the first paint; if WebGL is
 * missing or the context is lost, the page drops back to it.
 */
import {
  BoxGeometry,
  CanvasTexture,
  Color,
  CustomBlending,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  NoColorSpace,
  OneFactor,
  OneMinusSrcAlphaFactor,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TorusGeometry,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer,
  BackSide,
  type Material,
} from "three";
import { canMountVortex } from "./vortex-gate";

/* Measurements of the lobby photo, in source pixels. */
const SRC_W = 1813;
const SRC_H = 868;
/* The bright LED band of the pendant: centre and semi-axes. */
const HALO = { x: 1537, y: 249, a: 146, b: 30.5 };
/* Depth the photo shader reads for the pendant, so the ring stays locked to it while the room moves. */
const HALO_DEPTH = 0.6;
const FOCUS = 0.5;
const FOV = 30;
const REST_DISTANCE = 10;
const MAX_DPR = 1.5;
/* Text the ring may pass behind, and how dark it gets there. */
const TEXT_SELECTOR = [
  "[data-hero] .eyebrow",
  "[data-hero] .photo-hero-title .w",
  "[data-hero] .lede",
  "[data-hero] .btn",
  ".site-header .logo-lockup",
  ".site-header .nav-link",
  ".site-header .btn",
].join(", ");
/* Text near each of the other anchors. The header becomes one box once it has a background. */
const ANCHOR_TEXT = {
  specialties: ".lux-specialties .lux-split-head, .lux-specialties .spec-row",
  people: ".lux-people .section-head-row > div, .lux-people .section-head-row .btn, .lux-people .people-row",
  cta: ".lux-cta-title .w, .lux-cta-text, .lux-cta-actions .btn",
} as const;
const MAX_TEXT_BOXES = 24;

type Disposable = { dispose: () => void };

let active: (() => void) | null = null;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/* GLSL shared by every ring shader: how much of the ring may show at this pixel. */
const MASK_GLSL = /* glsl */ `
  uniform vec4 uAllow;
  uniform vec4 uText[${MAX_TEXT_BOXES}];
  uniform float uTextCount;
  uniform float uMaskDpr;
  uniform float uMaskBufH;
  float vxMask() {
    vec2 p = vec2(gl_FragCoord.x, uMaskBufH - gl_FragCoord.y) / uMaskDpr;
    float allow = step(uAllow.x, p.x) * step(p.x, uAllow.x + uAllow.z)
      * smoothstep(uAllow.y, uAllow.y + 80.0, p.y)
      * (1.0 - smoothstep(uAllow.y + uAllow.w - 80.0, uAllow.y + uAllow.w, p.y));
    float text = 0.0;
    for (int i = 0; i < ${MAX_TEXT_BOXES}; i++) {
      if (float(i) >= uTextCount) break;
      vec4 box = uText[i];
      vec2 d = abs(p - box.xy - box.zw * 0.5) - box.zw * 0.5;
      float outside = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
      text = max(text, 1.0 - smoothstep(6.0, 30.0, outside));
    }
    return allow * (1.0 - 0.97 * text);
  }
`;

/* Additive light that keeps the canvas alpha valid: colour adds, alpha tracks brightness. */
const GLOW_BLEND = {
  blending: CustomBlending,
  blendSrc: OneFactor,
  blendDst: OneFactor,
  blendSrcAlpha: OneFactor,
  blendDstAlpha: OneMinusSrcAlphaFactor,
  transparent: true,
  depthWrite: false,
} as const;

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
      antialias: true,
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

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.setClearColor(new Color(0x000000), 0);
  renderer.autoClear = false;

  const disposables: Disposable[] = [];
  const track = <T extends Disposable>(item: T): T => {
    disposables.push(item);
    return item;
  };

  /* Mask: the hero box and up to MAX_TEXT_BOXES line boxes, as uniforms */
  const maskUniforms: MaskUniforms = {
    uAllow: { value: new Vector4(0, 0, 0, 0) },
    uText: { value: Array.from({ length: MAX_TEXT_BOXES }, () => new Vector4()) },
    uTextCount: { value: 0 },
    uMaskDpr: { value: 1 },
    uMaskBufH: { value: 1 },
  };
  const header = document.querySelector<HTMLElement>(".site-header");
  const textCache = new Map<string, HTMLElement[]>();
  const textFor = (anchor: AnchorId): HTMLElement[] => {
    if (anchor === "hero") {
      if (!textCache.has(anchor)) textCache.set(anchor, [...document.querySelectorAll<HTMLElement>(TEXT_SELECTOR)]);
      return textCache.get(anchor)!;
    }
    /* Looked up when first needed: the closing headline is split into words after load. */
    if (!textCache.has(anchor)) {
      const nodes = [...document.querySelectorAll<HTMLElement>(ANCHOR_TEXT[anchor])];
      if (anchor === "cta" && !nodes.some((node) => node.classList.contains("w"))) {
        const title = document.querySelector<HTMLElement>(".lux-cta-title");
        if (title) nodes.unshift(title);
      }
      textCache.set(anchor, header ? [header, ...nodes] : nodes);
    }
    return textCache.get(anchor)!;
  };
  let textKey = "";
  let textAge = 0;

  const updateMask = (anchor: AnchorId, allowBox: DOMRect) => {
    maskUniforms.uAllow.value.set(allowBox.left, allowBox.top, allowBox.width, allowBox.height);
    /* Text only moves with scroll or layout, so re-read it then, and now and again for late layout. */
    const key = `${anchor}|${window.scrollY}|${width}|${height}`;
    textAge += 1;
    if (key === textKey && textAge < 30) return;
    textKey = key;
    textAge = 0;
    const lines: DOMRect[] = [];
    for (const node of textFor(anchor)) {
      const box = node.getBoundingClientRect();
      if (box.width < 1 || box.bottom < -40 || box.top > height + 40) continue;
      /* Words of the heading on one line become one box. */
      const line = lines.find((other) => Math.abs(other.top - box.top) < 4 && Math.abs(other.height - box.height) < 4 && box.left - other.right < 40);
      if (line) {
        const right = Math.max(line.right, box.right);
        line.x = Math.min(line.x, box.x);
        line.width = right - line.x;
      } else {
        lines.push(DOMRect.fromRect(box));
      }
    }
    const count = Math.min(lines.length, MAX_TEXT_BOXES);
    for (let i = 0; i < count; i += 1) {
      const line = lines[i]!;
      maskUniforms.uText.value[i]!.set(line.x, line.y, line.width, line.height);
    }
    maskUniforms.uTextCount.value = count;
  };

  const masked = <T extends Material>(material: T): T => {
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, maskUniforms);
      shader.fragmentShader = MASK_GLSL + shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        "#include <dithering_fragment>\n  gl_FragColor.a *= vxMask();",
      );
    };
    material.customProgramCacheKey = () => "vx-mask";
    return material;
  };

  /* Pass 1: the lobby photo with depth */
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

  const photoUniformsFor = (overlay: number) => ({
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
    uOverlay: { value: overlay },
  });
  const photoScene = new Scene();
  const quadGeometry = track(new PlaneGeometry(2, 2));
  const photoUniforms = photoUniformsFor(0);
  const photoQuad = new Mesh(quadGeometry, track(photoMaterial(photoUniforms)));
  photoQuad.frustumCulled = false;
  photoQuad.visible = false;
  photoScene.add(photoQuad);
  /* The closing section shows the same lobby photo: draw it here, with its overlay. */
  const ctaSection = document.querySelector<HTMLElement>(".lux-cta");
  const ctaArt = ctaSection?.querySelector<HTMLImageElement>(".cta-art") ?? null;
  const ctaRing = ctaSection?.querySelector<SVGElement>(".cta-ring") ?? null;
  const ctaUniforms = photoUniformsFor(1);
  const ctaQuad = new Mesh(quadGeometry, track(photoMaterial(ctaUniforms)));
  ctaQuad.frustumCulled = false;
  ctaQuad.visible = false;
  photoScene.add(ctaQuad);
  const flatCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const specialties = document.querySelector<HTMLElement>(".lux-specialties");
  const people = document.querySelector<HTMLElement>(".lux-people");
  const peopleStage = people?.querySelector<HTMLElement>(".people-stage") ?? null;

  /* Pass 2: the gold ring */
  const scene = new Scene();
  const pmrem = track(new PMREMGenerator(renderer));
  const envScene = buildEnvironment();
  const envTarget = track(pmrem.fromScene(envScene, 0.015));
  scene.environment = envTarget.texture;
  envScene.traverse((child) => disposeMesh(child as Mesh));

  const camera = new PerspectiveCamera(FOV, 1, 0.05, 60);

  const key = new DirectionalLight(0xfff1dc, 1.4);
  key.position.set(-4, 6, 6);
  scene.add(key);
  const under = new DirectionalLight(0xffc37a, 0.9);
  under.position.set(0, -6, 2);
  scene.add(under);

  const gold = track(
    masked(
      new MeshPhysicalMaterial({
        color: new Color(1.0, 0.766, 0.336),
        metalness: 1,
        roughness: 0.07,
        clearcoat: 0.6,
        clearcoatRoughness: 0.04,
        envMapIntensity: 1.6,
        emissive: new Color(1.0, 0.62, 0.28),
        emissiveIntensity: 0.03,
        transparent: true,
      }),
    ),
  );
  const ledMaterial = track(
    masked(new MeshBasicMaterial({ color: new Color(1.0, 0.82, 0.58).multiplyScalar(2.4), transparent: true, toneMapped: false })),
  );
  const beadMaterial = track(
    masked(
      new MeshPhysicalMaterial({
        color: new Color(1.0, 0.78, 0.45),
        metalness: 1,
        roughness: 0.1,
        clearcoat: 1,
        envMapIntensity: 2.2,
        emissive: new Color(1.0, 0.68, 0.36),
        emissiveIntensity: 0.22,
        transparent: true,
      }),
    ),
  );

  const ring = new Group();
  const band = new Mesh(track(new TorusGeometry(1, 0.034, 48, 480)), gold);
  ring.add(band);
  /* The lit channel under the housing, like the pendant in the photo */
  const led = new Mesh(track(new TorusGeometry(0.985, 0.011, 16, 480)), ledMaterial);
  led.position.z = 0.02;
  ring.add(led);
  /* Light thrown into the air around the band, in the ring's own plane */
  const haloMaterial = track(ringGlowMaterial(maskUniforms));
  const halo = new Mesh(track(new PlaneGeometry(3, 3)), haloMaterial);
  halo.renderOrder = 2;
  ring.add(halo);
  const bead = new Mesh(track(new SphereGeometry(0.036, 32, 16)), beadMaterial);
  ring.add(bead);
  scene.add(ring);
  const beadGlowMaterial = track(pointGlowMaterial(maskUniforms));
  const beadGlow = new Mesh(track(new PlaneGeometry(1, 1)), beadGlowMaterial);
  beadGlow.renderOrder = 3;
  scene.add(beadGlow);


  /* State */
  let alive = true;
  let running = false;
  let raf = 0;
  let last = 0;
  let lastDraw = 0;
  let lastInput = 0;
  let lastScroll = -1;
  let live = false;
  let liveAt = 0;
  let objectPosition = new Vector2(0.92, 0.5);
  let ctaObjectPosition = new Vector2(1, 0.4);
  const pointer = new Vector2(0, 0);
  const pointerSmooth = new Vector2(0, 0);
  let scrollSmooth = scrollProgress(hero);
  let width = 1;
  let height = 1;
  const beadWorld = new Vector3();
  /* Where the ring is between anchors: it glides from one to the next instead of jumping. */
  const held = { position: new Vector3(), quaternion: new Quaternion(), scale: 1, presence: 0, anchor: "hero" as AnchorId };
  const placed = { position: new Vector3(), quaternion: new Quaternion() };
  const flags = { people: false, cta: false };

  const objectPositionOf = (element: Element | null, fallback: Vector2) => {
    if (!element) return fallback;
    const [x, y] = getComputedStyle(element).objectPosition.split(" ");
    return new Vector2(parseFloat(x ?? "50") / 100, parseFloat(y ?? "50") / 100);
  };

  const resize = () => {
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const buffer = renderer.getDrawingBufferSize(new Vector2());
    const dpr = renderer.getPixelRatio();
    maskUniforms.uMaskBufH.value = buffer.y;
    maskUniforms.uMaskDpr.value = dpr;
    textKey = "";
    for (const uniforms of [photoUniforms, ctaUniforms]) {
      uniforms.uBufH.value = buffer.y;
      uniforms.uDpr.value = dpr;
    }
    objectPosition = objectPositionOf(photo, new Vector2(0.92, 0.5));
    ctaObjectPosition = objectPositionOf(ctaArt, new Vector2(1, 0.4));
  };

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    pointer.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
    lastInput = performance.now();
  };

  const tan = Math.tan((FOV * Math.PI) / 360);
  const worldPerPixel = (distance: number) => (2 * distance * tan) / height;
  const pose = (x: number, y: number, distance: number, size: number, pitch: number, yaw: number, roll: number) => {
    const at = Math.max(distance, 0.001);
    ring.position.set((x - width / 2) * worldPerPixel(at), -(y - height / 2) * worldPerPixel(at), -distance);
    ring.scale.setScalar(size);
    /* Face the view ray first, so the ellipse keeps its shape wherever it lands on screen. */
    ring.lookAt(camera.position);
    ring.rotateX(pitch);
    ring.rotateY(yaw);
    ring.rotateZ(roll);
  };

  /* Size and centre the ring so its projection lands on a target circle or ellipse on screen,
     correcting for perspective, which makes the near half of a tilted ring larger. */
  const fit = (cx: number, cy: number, halfWidth: number, distance: number, pitch: number) => {
    let x = cx;
    let y = cy;
    let size = halfWidth * worldPerPixel(distance);
    for (let pass = 0; pass < 2; pass += 1) {
      pose(x, y, distance, size, pitch, 0, 0);
      const box = projectedBox(ring, camera, width, height);
      x += cx - box.cx;
      y += cy - box.cy;
      size *= halfWidth / Math.max(box.halfWidth, 1);
    }
    return { x, y, size };
  };

  /* How present a section is: rises as it scrolls in, falls as it scrolls out. */
  const focusOf = (box: DOMRect, exits = true) => {
    const enter = smooth(0, 1, (height - box.top) / (height * 0.55));
    const leave = exits ? smooth(0, 1, box.bottom / (height * 0.55)) : 1;
    return Math.min(enter, leave);
  };

  const setFlag = (name: "people" | "cta", on: boolean) => {
    if (flags[name] === on) return;
    flags[name] = on;
    document.documentElement.classList.toggle(`vx-${name}`, on);
  };

  const drawPhoto = (quad: Mesh, clip: DOMRect) => {
    const left = Math.max(0, clip.left);
    const top = Math.max(0, clip.top);
    const right = Math.min(width, clip.right);
    const bottom = Math.min(height, clip.bottom);
    if (right - left < 1 || bottom - top < 1) return;
    renderer.setScissor(left, height - bottom, right - left, bottom - top);
    quad.visible = true;
    renderer.render(photoScene, flatCamera);
    quad.visible = false;
  };

  const render = (now: number) => {
    raf = 0;
    if (!alive || !running) return;
    /* Half rate once nothing has moved for a while: the bead still orbits, the battery is spared. */
    if (window.scrollY !== lastScroll) {
      lastScroll = window.scrollY;
      lastInput = now;
    }
    const settled = live && now - lastInput > 1500 && now - liveAt > 2500;
    if (settled && now - lastDraw < 30) {
      raf = requestAnimationFrame(render);
      return;
    }
    lastDraw = now;
    const dt = Math.min(0.1, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    const time = now / 1000;

    pointerSmooth.lerp(pointer, 1 - Math.exp(-dt * 3.2));
    scrollSmooth = mix(scrollSmooth, scrollProgress(hero), 1 - Math.exp(-dt * 7));
    const sp = scrollSmooth;

    /* Where the photo sits right now. The quad follows the real <img> so the two match exactly. */
    const imgBox = photo.getBoundingClientRect();
    const clipBox = frame.getBoundingClientRect();
    const scale = Math.max(imgBox.width / SRC_W, imgBox.height / SRC_H);
    const shiftX = (imgBox.width - SRC_W * scale) * objectPosition.x;
    const shiftY = (imgBox.height - SRC_H * scale) * objectPosition.y;

    /* Depth parallax ramps in after the crossfade, so the swap itself is invisible. */
    const ramp = live ? smooth(0, 1600, now - liveAt) : 0;
    const offset = photoUniforms.uOff.value.set(pointerSmooth.x * 0.0065, pointerSmooth.y * 0.0045 + sp * 0.014).multiplyScalar(ramp);
    photoUniforms.uImg.value.set(imgBox.left, imgBox.top, imgBox.width, imgBox.height);
    photoUniforms.uClip.value.set(clipBox.left, clipBox.top, clipBox.width, clipBox.height);
    photoUniforms.uObj.value.copy(objectPosition);

    const ctaBox = ctaSection?.getBoundingClientRect() ?? null;
    if (ctaBox && ctaArt) {
      const artBox = ctaArt.getBoundingClientRect();
      ctaUniforms.uImg.value.set(artBox.left, artBox.top, artBox.width, artBox.height);
      ctaUniforms.uClip.value.set(ctaBox.left, ctaBox.top, ctaBox.width, ctaBox.height);
      ctaUniforms.uObj.value.copy(ctaObjectPosition);
      ctaUniforms.uOff.value.set(pointerSmooth.x * 0.004, pointerSmooth.y * 0.003);
    }

    /* Hero: rest on the pendant, lift off, turn to face the visitor, pass through the camera. */
    const haloX = imgBox.left + shiftX + HALO.x * scale - offset.x * (HALO_DEPTH - FOCUS) * SRC_W * scale;
    const haloY = imgBox.top + shiftY + HALO.y * scale - offset.y * (HALO_DEPTH - FOCUS) * SRC_H * scale;
    const tilt = Math.acos(HALO.b / HALO.a);
    const travel = clamp(sp / 0.7);
    const distance = REST_DISTANCE * Math.pow(1 - travel, 2.2) - 0.6 * travel;
    const heroPresence = (1 - smooth(0.5, 0.7, sp)) * smooth(0.25, 1.4, distance);

    let presence = 0;
    let glow = 0.32;
    let anchor: AnchorId = "hero";
    let allowBox: DOMRect = clipBox;

    if (heroPresence > 0.002 && distance > 0.05) {
      const rest = fit(haloX, haloY, HALO.a * scale, REST_DISTANCE, tilt);
      const toCenter = easeOut(clamp(sp / 0.45));
      const face = easeInOut(clamp(sp / 0.5));
      /* No lean while it rests on the pendant, so it stays locked to the photo; it leans once it lifts off. */
      const lean = ramp * smooth(0.02, 0.15, sp);
      /* The open side of the hero: the copy's gradient keeps the left dark. */
      pose(
        mix(rest.x, width * 0.66, toCenter),
        mix(rest.y, height * 0.45, toCenter),
        distance,
        mix(rest.size, HALO.a * scale * worldPerPixel(REST_DISTANCE), toCenter),
        mix(tilt, 0.08, face) + pointerSmooth.y * 0.05 * lean,
        pointerSmooth.x * 0.09 * lean + Math.sin(time * 0.35) * 0.012 * lean,
        mix(0, -0.14, face),
      );
      presence = heroPresence;
      glow = 0.42 * smooth(0.8, 4, distance);
      held.position.copy(ring.position);
      held.quaternion.copy(ring.quaternion);
      held.scale = ring.scale.x;
      held.presence = presence;
      held.anchor = "hero";
    } else {
      /* The other anchors: the one most on screen wins, and the ring glides toward its pose. */
      const candidates: Array<{ id: AnchorId; box: DOMRect; focus: number }> = [];
      if (specialties) {
        const box = specialties.getBoundingClientRect();
        candidates.push({ id: "specialties", box, focus: focusOf(box) });
      }
      if (people && peopleStage && peopleStage.offsetWidth > 0) {
        const box = people.getBoundingClientRect();
        candidates.push({ id: "people", box, focus: focusOf(box) });
      }
      if (ctaBox && ctaRing) candidates.push({ id: "cta", box: ctaBox, focus: focusOf(ctaBox, false) * smooth(0, 1, ctaBox.bottom / (height * 0.5)) });
      const best = candidates.reduce<(typeof candidates)[number] | null>((top, item) => (!top || item.focus > top.focus ? item : top), null);

      if (best && best.focus > 0.002) {
        anchor = best.id;
        allowBox = best.box;
        /* Further back and smaller while its section is only arriving. */
        const depth = mix(2.4, 1, easeOut(best.focus));
        if (best.id === "specialties") {
          const along = clamp((height - best.box.top) / (best.box.height + height));
          const radius = height * 0.5;
          /* In the lower-left corner, below the pinned heading: it rises in with the section,
             holds while the heading is pinned, and leaves with the section's bottom edge. */
          const cy = Math.min(Math.max(height * 0.98, best.box.top + height * 0.95), best.box.bottom + height * 0.3);
          /* Turning slowly, but never edge-on: seen edge-on it reads as a line along the screen edge. */
          const turn = 0.62 + 0.38 * Math.sin(time * 0.16 + along * 2.4);
          pose(width * -0.02, cy, 6 * depth, radius * worldPerPixel(6), 0.42, turn, 0.12);
        } else if (best.id === "people" && peopleStage) {
          const stage = peopleStage.getBoundingClientRect();
          const target = fit(stage.left + stage.width / 2, stage.top + stage.height / 2, stage.width * 0.498, 7, 0);
          pose(target.x, target.y, 7 * depth, target.size, pointerSmooth.y * 0.1, pointerSmooth.x * 0.13 + Math.sin(time * 0.3) * 0.02, 0);
        } else if (best.id === "cta" && ctaRing) {
          const circle = ctaRing.getBoundingClientRect();
          const pitch = 0.2 + Math.sin(time * 0.25) * 0.04;
          const target = fit(circle.left + circle.width / 2, circle.top + circle.height / 2, circle.width * 0.495, 8, pitch);
          pose(target.x, target.y, 8 * depth, target.size, pitch, pointerSmooth.x * 0.08 + Math.sin(time * 0.17) * 0.05, 0);
        }
        placed.position.copy(ring.position);
        placed.quaternion.copy(ring.quaternion);
        /* Arriving from nothing: start where it is aimed. Otherwise glide. */
        if (held.presence < 0.03 || (held.anchor === "hero" && held.presence < 0.2)) {
          held.position.copy(placed.position);
          held.quaternion.copy(placed.quaternion);
          held.scale = ring.scale.x;
        } else {
          const follow = 1 - Math.exp(-dt * 5);
          held.position.lerp(placed.position, follow);
          held.quaternion.slerp(placed.quaternion, follow);
          held.scale = mix(held.scale, ring.scale.x, follow);
        }
        held.anchor = best.id;
        held.presence = mix(held.presence, best.focus, 1 - Math.exp(-dt * 6));
      } else {
        held.presence = mix(held.presence, 0, 1 - Math.exp(-dt * 6));
        anchor = held.anchor === "hero" ? "specialties" : held.anchor;
        allowBox = (anchor === "people" ? people : anchor === "cta" ? ctaSection : specialties)?.getBoundingClientRect() ?? clipBox;
      }
      ring.position.copy(held.position);
      ring.quaternion.copy(held.quaternion);
      ring.scale.setScalar(held.scale);
      presence = held.presence;
    }

    setFlag("people", held.anchor === "people" && held.presence > 0.55 && heroPresence <= 0.002);
    setFlag("cta", held.anchor === "cta" && held.presence > 0.55 && heroPresence <= 0.002);
    updateMask(anchor, allowBox);

    const showRing = presence > 0.002;
    ring.visible = showRing;
    beadGlow.visible = showRing;
    if (showRing) {
      gold.opacity = presence;
      ledMaterial.opacity = presence;
      beadMaterial.opacity = presence;
      haloMaterial.uniforms.uIntensity.value = glow * presence;
      const beadAngle = time * 0.42;
      bead.position.set(Math.cos(beadAngle), Math.sin(beadAngle), 0);
      ring.updateMatrixWorld(true);
      bead.getWorldPosition(beadWorld);
      beadGlow.position.copy(beadWorld);
      beadGlow.scale.setScalar(ring.scale.x * 0.32);
      beadGlowMaterial.uniforms.uIntensity.value = 0.65 * presence;
    }

    try {
      renderer.clear();
      renderer.setScissorTest(true);
      drawPhoto(photoQuad, clipBox);
      if (ctaBox && ctaArt) drawPhoto(ctaQuad, ctaBox);
      renderer.setScissorTest(false);
      renderer.clearDepth();
      if (showRing) renderer.render(scene, camera);
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

  const onScreen = new Set<Element>();
  const play = () => {
    if (!alive || running || document.hidden || onScreen.size === 0) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(render);
  };

  const pause = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  /* Draw only while one of the sections the scene uses is on screen. */
  const visibility = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      if (onScreen.size > 0) {
        play();
        return;
      }
      pause();
      /* The canvas keeps showing its last frame, so leave it empty rather than stale. */
      renderer.clear();
    },
    { rootMargin: "15% 0px 15% 0px" },
  );

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
    document.documentElement.classList.remove("vx-live", "vx-people", "vx-cta");
    for (const root of [scene, photoScene]) root.traverse((child) => disposeMesh(child as Mesh));
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
  renderer.compile(photoScene, flatCamera);
  await Promise.all(frame.getAnimations().map((animation) => animation.finished.catch(() => undefined)));
  if (!alive) return;
  for (const section of [hero, specialties, people, ctaSection]) if (section) visibility.observe(section);
}

/** Some browsers render WebGL in software without flagging a performance caveat. */
function softwareRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): boolean {
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}

const probe = new Vector3();

/** Screen-space bounding box of the ring's centre line, in CSS pixels. */
function projectedBox(ring: Group, camera: PerspectiveCamera, width: number, height: number) {
  ring.updateMatrixWorld(true);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < 48; i += 1) {
    const angle = (i / 48) * Math.PI * 2;
    probe.set(Math.cos(angle), Math.sin(angle), 0).applyMatrix4(ring.matrixWorld).project(camera);
    const x = ((probe.x + 1) / 2) * width;
    const y = ((1 - probe.y) / 2) * height;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, halfWidth: (maxX - minX) / 2 };
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

type AnchorId = "hero" | "specialties" | "people" | "cta";

type MaskUniforms = {
  uAllow: { value: Vector4 };
  uText: { value: Vector4[] };
  uTextCount: { value: number };
  uMaskDpr: { value: number };
  uMaskBufH: { value: number };
};

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
      uniform float uOverlay;
      const vec3 INK = vec3(9.0, 7.0, 19.0) / 255.0;
      void main() {
        vec2 css = vec2(gl_FragCoord.x, uBufH - gl_FragCoord.y) / uDpr;
        if (css.x < uClip.x || css.y < uClip.y || css.x > uClip.x + uClip.z || css.y > uClip.y + uClip.w) discard;
        float s = max(uImg.z / uSrc.x, uImg.w / uSrc.y);
        vec2 shift = (uImg.zw - uSrc * s) * uObj;
        vec2 uv = (css - uImg.xy - shift) / s / uSrc;
        float depth = texture2D(uDepth, vec2(uv.x, 1.0 - uv.y)).r;
        uv = clamp(uv + uOff * (depth - uFocus), vec2(0.0005), vec2(0.9995));
        vec3 color = texture2D(uPhoto, vec2(uv.x, 1.0 - uv.y)).rgb;
        if (uOverlay > 0.5) {
          /* The closing section's CSS overlay, reproduced: ink fading in at the top and bottom
             edges, under a radial ink veil that is darkest behind the headline. */
          vec2 q = css - uClip.xy;
          float t = q.y / uClip.w;
          color = mix(color, INK, clamp(max(1.0 - t / 0.18, (t - 0.82) / 0.18), 0.0, 1.0));
          float r = length(q - uClip.zw * 0.5) / length(uClip.zw * 0.5);
          float veil = r < 0.42 ? mix(0.92, 0.84, r / 0.42) : mix(0.84, 0.7, clamp((r - 0.42) / 0.58, 0.0, 1.0));
          color = mix(color, INK, veil);
        }
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

function ringGlowMaterial(mask: MaskUniforms): ShaderMaterial {
  return new ShaderMaterial({
    ...GLOW_BLEND,
    uniforms: {
      ...mask,
      uColor: { value: new Color(1.0, 0.68, 0.36) },
      uIntensity: { value: 0.42 },
      uWidth: { value: 0.022 },
    },
    side: DoubleSide,
    toneMapped: false,
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() {
        vP = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      ${MASK_GLSL}
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uWidth;
      varying vec2 vP;
      void main() {
        float d = length(vP) - 1.0;
        float core = exp(-(d * d) / (uWidth * uWidth));
        float soft = exp(-(d * d) / (uWidth * uWidth * 6.0)) * 0.18;
        float edge = 1.0 - smoothstep(1.2, 1.5, length(vP));
        gl_FragColor = vec4(uColor * (core + soft) * uIntensity * edge * vxMask(), 1.0);
        #include <colorspace_fragment>
        gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));
      }
    `,
  });
}

function pointGlowMaterial(mask: MaskUniforms): ShaderMaterial {
  return new ShaderMaterial({
    ...GLOW_BLEND,
    uniforms: { ...mask, uIntensity: { value: 0.65 }, uColor: { value: new Color(1.0, 0.72, 0.42) } },
    toneMapped: false,
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main() {
        vP = position.xy * 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      ${MASK_GLSL}
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec2 vP;
      void main() {
        float r = length(vP);
        float light = exp(-r * r * 9.0) + exp(-r * r * 60.0) * 0.8;
        light *= 1.0 - smoothstep(0.8, 1.0, r);
        gl_FragColor = vec4(uColor * light * uIntensity * vxMask(), 1.0);
        #include <colorspace_fragment>
        gl_FragColor.a = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));
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

/**
 * A small HDR room for the metal to reflect, modelled on the lobby: dark walls tinted violet
 * like the art, a warm ring light overhead, LED strips like the reception wall, a softbox for a
 * crisp highlight, the desk LED and the polished floor below. Rendered once into an env map.
 */
function buildEnvironment(): Scene {
  const env = new Scene();
  const shellGeometry = new SphereGeometry(20, 48, 24);
  const colors: number[] = [];
  const position = shellGeometry.getAttribute("position");
  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i) / 20;
    const x = position.getX(i) / 20;
    const violet = smooth(0.2, 1, -x) * smooth(-0.6, 0.3, y);
    colors.push(0.012 + 0.05 * violet + 0.02 * smooth(0, -1, y), 0.01 + 0.012 * violet + 0.014 * smooth(0, -1, y), 0.02 + 0.11 * violet);
  }
  shellGeometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  env.add(new Mesh(shellGeometry, new MeshBasicMaterial({ side: BackSide, vertexColors: true })));

  const emit = (r: number, g: number, b: number) => new MeshBasicMaterial({ color: new Color(r, g, b), side: DoubleSide });

  const ringLight = new Mesh(new TorusGeometry(5, 0.22, 12, 96), emit(9, 6.2, 3.4));
  ringLight.position.set(0, 7, -1);
  ringLight.rotation.x = Math.PI / 2;
  env.add(ringLight);

  for (let i = 0; i < 7; i += 1) {
    const strip = new Mesh(new BoxGeometry(0.12, 12, 0.12), emit(5, 3.3, 1.6));
    strip.position.set(10, 0, -6 + i * 2);
    env.add(strip);
  }

  /* Ceiling downlights like the lobby's: small, very bright, they sparkle along the band. */
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const spot = new Mesh(new SphereGeometry(0.16, 12, 8), emit(26, 21, 15));
      spot.position.set(-10 + col * 4 + (row % 2) * 2, 8, -8 + row * 6);
      env.add(spot);
    }
  }
  /* A long softbox behind and above the camera puts a highlight along the top of the band. */
  const front = new Mesh(new PlaneGeometry(16, 1.6), emit(6, 5.2, 4.2));
  front.position.set(0, 4.5, 11);
  front.lookAt(0, 0, 0);
  env.add(front);
  const softbox = new Mesh(new PlaneGeometry(7, 3), emit(7, 6.4, 5.6));
  softbox.position.set(-7, 6, 8);
  softbox.lookAt(0, 0, 0);
  env.add(softbox);

  const art = new Mesh(new PlaneGeometry(6, 3.5), emit(0.5, 0.25, 1.15));
  art.position.set(-4, 1.5, -12);
  art.lookAt(0, 0, 0);
  env.add(art);

  const desk = new Mesh(new BoxGeometry(14, 0.25, 0.25), emit(6, 3.8, 1.8));
  desk.position.set(2, -4.5, 6);
  env.add(desk);
  const glowFloor = new Mesh(new PlaneGeometry(16, 8), emit(0.9, 0.6, 0.32));
  glowFloor.position.set(0, -5.9, 5);
  glowFloor.rotation.x = -Math.PI / 2;
  env.add(glowFloor);
  const floor = new Mesh(new PlaneGeometry(30, 30), emit(0.22, 0.15, 0.09));
  floor.position.y = -6;
  floor.rotation.x = -Math.PI / 2;
  env.add(floor);

  return env;
}

