import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Quaternion,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type Material,
  type Texture,
} from "three";

type Pointer = { x: number; y: number };

interface Rig {
  group: Group;
  tick: (time: number, pointer: Pointer, scroll: number) => void;
}

const mounted = new WeakSet<HTMLElement>();

export function mountHeroStages(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-hero-stage]").forEach((stage) => {
    if (stage.dataset.engine === "css") return;
    if (mounted.has(stage)) return;
    mounted.add(stage);
    void start(stage);
  });
}

async function start(stage: HTMLElement): Promise<void> {
  const canvas = stage.querySelector("canvas");
  if (!canvas) return;

  const sceneName = stage.dataset.heroStage || "editorial";
  const labels = (stage.dataset.labels || "")
    .split("|")
    .map((label) => label.trim())
    .filter(Boolean);
  const plates = (stage.dataset.plates || "")
    .split("|")
    .map((plate) => plate.trim())
    .filter(Boolean);
  const quiet = stage.dataset.quiet === "true";
  const low = () => stage.clientWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !low(),
      powerPreference: "high-performance",
    });
  } catch {
    return;
  }
  if (!renderer.getContext()) {
    renderer.dispose();
    return;
  }

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color(0x000000), 0);
  renderer.toneMappingExposure = quiet ? 0.92 : 1.05;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 40);
  camera.position.set(0.15, 0.72, 7.5);

  const disposables: Array<{ dispose: () => void }> = [];
  const track = <T extends { dispose: () => void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  scene.add(new AmbientLight(0xc4b5fd, quiet ? 0.42 : 0.55));
  const key = new DirectionalLight(0xfff8ff, quiet ? 1.7 : 2.35);
  key.position.set(-3.4, 4.8, 5.2);
  scene.add(key);
  const rim = new DirectionalLight(0x8b5cf6, quiet ? 0.55 : 0.95);
  rim.position.set(4.2, 1.4, -2.2);
  scene.add(rim);
  const fill = new DirectionalLight(0xede9fe, 0.38);
  fill.position.set(0.4, -0.6, 4.5);
  scene.add(fill);

  if (!low()) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 16;
    key.shadow.camera.left = -5;
    key.shadow.camera.right = 5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    key.shadow.bias = -0.001;
    const ground = new Mesh(track(new PlaneGeometry(12, 8)), track(new ShadowMaterial({ opacity: 0.28 })));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.28;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  let alive = true;
  const rig = buildRig(sceneName, labels, plates, track, low(), () => alive);
  const initial = scenePlacement(sceneName, stage.clientWidth < 768, quiet);
  rig.group.position.set(initial.x, initial.y, 0);
  rig.group.scale.setScalar(initial.scale);
  scene.add(rig.group);

  const pointer: Pointer = { x: 0, y: 0 };
  const smooth: Pointer = { x: 0, y: 0 };
  let inView = false;
  let running = false;
  let frame = 0;
  let last = 0;
  const minDelta = () => (low() ? 1000 / 24 : 1000 / 48);

  const resize = () => {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (width < 2 || height < 2) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low() ? 1 : 1.25));
    renderer.setSize(width, height, false);
  };

  const host = (stage.closest("section, article, header") ?? stage) as HTMLElement;
  const onMove = (event: Event) => {
    if (!(event instanceof PointerEvent)) return;
    const rect = host.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const scrollOf = () => {
    const rect = stage.getBoundingClientRect();
    const span = rect.height + window.innerHeight;
    if (span <= 0) return 0;
    return Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span));
  };

  const paint = (now: number) => {
    frame = 0;
    if (!alive || !running || document.hidden) return;
    if (now - last >= minDelta()) {
      last = now;
      const time = now / 1000;
      smooth.x += (pointer.x - smooth.x) * 0.06;
      smooth.y += (pointer.y - smooth.y) * 0.06;
      const spot = scenePlacement(sceneName, stage.clientWidth < 768, quiet);
      rig.group.position.x += (spot.x - rig.group.position.x) * 0.08;
      rig.group.position.y += (spot.y - rig.group.position.y) * 0.08;
      rig.group.scale.setScalar(spot.scale);
      rig.tick(time, smooth, scrollOf());
      try {
        renderer.render(scene, camera);
      } catch {
        stop();
        return;
      }
      if (!stage.classList.contains("is-live")) stage.classList.add("is-live");
    }
    frame = requestAnimationFrame(paint);
  };

  const play = () => {
    if (!alive || running || document.hidden) return;
    running = true;
    frame = requestAnimationFrame(paint);
  };

  const pause = () => {
    running = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      if (inView) play();
      else pause();
    },
    { threshold: 0.02 },
  );

  const onVisibility = () => {
    if (document.hidden || !inView) pause();
    else play();
  };

  const stop = () => {
    if (!alive) return;
    alive = false;
    pause();
    observer.disconnect();
    resizeObserver.disconnect();
    host.removeEventListener("pointermove", onMove);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", stop);
    scene.traverse((child) => {
      const mesh = child as Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const material = mesh.material as Material | Material[] | undefined;
      if (Array.isArray(material)) material.forEach((item) => item.dispose());
      else material?.dispose();
    });
    disposables.forEach((item) => item.dispose());
    renderer.dispose();
    stage.classList.remove("is-live");
  };

  const resizeObserver = new ResizeObserver(() => resize());
  resize();
  resizeObserver.observe(stage);
  observer.observe(stage);
  host.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", stop);
  canvas.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      stop();
    },
    { once: true },
  );
}

function scenePlacement(sceneName: string, narrow: boolean, quiet: boolean): { x: number; y: number; scale: number } {
  if (narrow) return { x: 0.2, y: -0.95, scale: 0.7 };
  if (sceneName === "workspace") return { x: 1.7, y: 0.2, scale: 1.2 };
  if (sceneName === "pipeline") return { x: 2.35, y: -0.15, scale: 0.7 };
  if (quiet) return { x: 2.15, y: -0.2, scale: 0.64 };
  return { x: 2.55, y: -0.55, scale: 0.72 };
}

function buildRig(
  sceneName: string,
  labels: string[],
  plates: string[],
  track: <T extends { dispose: () => void }>(item: T) => T,
  low: boolean,
  isAlive: () => boolean,
): Rig {
  if (sceneName === "workspace") return workspaceRig(track, low);
  if (sceneName === "pipeline") return pipelineRig(labels, track, low);
  if (sceneName === "showcase" || sceneName === "study") return showcaseRig(sceneName, labels, plates, track, low, isAlive);
  if (sceneName === "collaboration" || sceneName === "profile") return clusterRig(sceneName, labels, track, low);
  if (sceneName === "communication") return messageRig(labels, track, low);
  return moduleRig(labels, track, low);
}

function edgeMaterial(track: <T extends { dispose: () => void }>(item: T) => T): MeshStandardMaterial {
  return track(
    new MeshStandardMaterial({
      color: 0x241833,
      roughness: 0.38,
      metalness: 0.46,
      emissive: 0x2a1458,
      emissiveIntensity: 0.16,
    }),
  );
}

function faceMaterial(track: <T extends { dispose: () => void }>(item: T) => T, texture: Texture): MeshStandardMaterial {
  return track(
    new MeshStandardMaterial({
      color: 0xffffff,
      map: texture,
      roughness: 0.46,
      metalness: 0.12,
      emissive: 0x2a1848,
      emissiveIntensity: 0.45,
    }),
  );
}

function panel(
  width: number,
  height: number,
  texture: Texture,
  track: <T extends { dispose: () => void }>(item: T) => T,
  low: boolean,
): Mesh {
  const edge = edgeMaterial(track);
  const face = faceMaterial(track, texture);
  const mesh = new Mesh(track(new BoxGeometry(width, height, 0.045)), [edge, edge, edge, edge, face, edge]);
  if (!low) mesh.castShadow = true;
  return mesh;
}

function labelTexture(title: string, track: <T extends { dispose: () => void }>(item: T) => T): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const context = canvas.getContext("2d");
  if (!context) {
    const texture = track(new CanvasTexture(canvas));
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }
  context.fillStyle = "#161022";
  context.fillRect(0, 0, 512, 320);
  context.fillStyle = "rgba(221, 214, 254, 0.7)";
  context.fillRect(0, 0, 512, 4);
  context.fillStyle = "#f5f3ff";
  context.font = "600 28px Inter, sans-serif";
  context.fillText(title.toUpperCase().slice(0, 18), 36, 78);
  context.fillStyle = "rgba(248, 247, 255, 0.28)";
  context.fillRect(36, 118, 340, 16);
  context.fillRect(36, 152, 260, 16);
  context.fillRect(36, 186, 300, 16);
  context.fillStyle = "rgba(139, 92, 246, 0.45)";
  context.fillRect(36, 236, 92, 8);
  const texture = track(new CanvasTexture(canvas));
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function beamBetween(
  from: Vector3,
  to: Vector3,
  track: <T extends { dispose: () => void }>(item: T) => T,
): Mesh {
  const direction = new Vector3().subVectors(to, from);
  const length = Math.max(direction.length(), 0.001);
  const mesh = new Mesh(
    track(new BoxGeometry(length, 0.012, 0.012)),
    track(
      new MeshStandardMaterial({
        color: 0xc4b5fd,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.35,
        roughness: 0.3,
        metalness: 0.2,
      }),
    ),
  );
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0), direction.normalize()));
  return mesh;
}

function place(mesh: Mesh, x: number, y: number, z: number, rotY: number): void {
  mesh.position.set(x, y, z);
  mesh.rotation.y = rotY;
  mesh.userData.baseY = y;
  mesh.userData.phase = x + z;
}

function moduleRig(
  labels: string[],
  track: <T extends { dispose: () => void }>(item: T) => T,
  low: boolean,
): Rig {
  const names = labels.length ? labels.slice(0, 5) : ["Frontend", "API", "Cloud", "Mobile", "AI"];
  const group = new Group();
  const meshes: Mesh[] = [];
  names.forEach((name, index) => {
    const count = names.length;
    const t = count === 1 ? 0.5 : index / (count - 1);
    const angle = (t - 0.5) * 1.05;
    const mesh = panel(1.42, 0.92, labelTexture(name, track), track, low);
    place(mesh, Math.sin(angle) * 1.85, (index % 2 === 0 ? 0.38 : -0.42) + (0.5 - t) * 0.1, Math.cos(angle) * 0.35, -angle * 0.7);
    meshes.push(mesh);
    group.add(mesh);
  });
  const hub = meshes[Math.min(1, meshes.length - 1)];
  const links = meshes
    .filter((mesh) => mesh !== hub && hub)
    .map((mesh) => {
      const link = beamBetween(hub.position, mesh.position, track);
      group.add(link);
      return link;
    });
  const pulse = new Mesh(
    track(new BoxGeometry(0.08, 0.08, 0.08)),
    track(new MeshStandardMaterial({ color: 0xede9fe, emissive: 0xc4b5fd, emissiveIntensity: 0.6, roughness: 0.2 })),
  );
  group.add(pulse);
  return {
    group,
    tick: (time, pointer) => {
      meshes.forEach((mesh) => {
        mesh.position.y = mesh.userData.baseY + Math.sin(time * 0.55 + mesh.userData.phase) * 0.04;
      });
      if (hub && links.length) {
        const along = (Math.sin(time * 0.7) * 0.5 + 0.5);
        const target = meshes.find((mesh) => mesh !== hub) ?? hub;
        pulse.position.lerpVectors(hub.position, target.position, along);
      }
      aim(group, pointer);
    },
  };
}

function pipelineRig(
  labels: string[],
  track: <T extends { dispose: () => void }>(item: T) => T,
  low: boolean,
): Rig {
  const names = labels.length ? labels.slice(0, 6) : ["Discover", "Plan", "Design", "Develop", "Test", "Improve"];
  const group = new Group();
  const meshes: Mesh[] = [];
  names.forEach((name, index) => {
    const t = names.length === 1 ? 0 : index / (names.length - 1);
    const mesh = panel(1.15, 0.72, labelTexture(name, track), track, low);
    mesh.scale.setScalar(1 - t * 0.28);
    place(mesh, -1.85 + t * 3.7, 0.62 - t * 1.05, 0.7 - t * 1.5, -0.18);
    meshes.push(mesh);
    group.add(mesh);
    if (index > 0) group.add(beamBetween(meshes[index - 1].position, mesh.position, track));
  });
  const pulse = new Mesh(
    track(new BoxGeometry(0.09, 0.09, 0.09)),
    track(new MeshStandardMaterial({ color: 0xffffff, emissive: 0xddd6fe, emissiveIntensity: 0.7, roughness: 0.2 })),
  );
  group.add(pulse);
  return {
    group,
    tick: (time, pointer, scroll) => {
      const span = Math.max(meshes.length - 1, 1);
      const travel = (time * 0.18 + scroll * 0.65) % 1;
      const cursor = travel * span;
      const index = Math.min(meshes.length - 2, Math.floor(cursor));
      const local = cursor - index;
      if (meshes[index] && meshes[index + 1]) pulse.position.lerpVectors(meshes[index].position, meshes[index + 1].position, local);
      aim(group, pointer, 0.1);
    },
  };
}

function showcaseRig(
  sceneName: string,
  labels: string[],
  plates: string[],
  track: <T extends { dispose: () => void }>(item: T) => T,
  low: boolean,
  isAlive: () => boolean,
): Rig {
  const group = new Group();
  const fan =
    sceneName === "study"
      ? [
          { x: 0.15, y: 0.05, z: 0.45, rot: -0.08, w: 1.85, h: 1.2 },
          { x: -0.85, y: 0.28, z: -0.15, rot: 0.42, w: 1.15, h: 0.78 },
          { x: 1.05, y: -0.22, z: -0.05, rot: -0.4, w: 1.05, h: 0.72 },
        ]
      : [
          { x: -1.05, y: 0.08, z: 0.05, rot: 0.4, w: 1.35, h: 0.9 },
          { x: 0.15, y: 0.16, z: 0.5, rot: 0.02, w: 1.6, h: 1.05 },
          { x: 1.2, y: -0.08, z: 0.02, rot: -0.38, w: 1.3, h: 0.88 },
        ];
  const count = sceneName === "study" ? Math.min(fan.length, Math.max(plates.length, 1)) : fan.length;
  const meshes: Mesh[] = [];
  fan.slice(0, count).forEach((spot, index) => {
    const name = labels[index] || (index === 0 ? "Product" : "Interface");
    const mesh = panel(spot.w, spot.h, labelTexture(name, track), track, low);
    place(mesh, spot.x, spot.y, spot.z, spot.rot);
    meshes.push(mesh);
    group.add(mesh);
    const source = plates[index];
    if (!source) return;
    const image = new Image();
    image.onload = () => {
      if (!isAlive()) return;
      const texture = framedTexture(image, track);
      const materials = mesh.material as MeshStandardMaterial[];
      const face = materials[4];
      if (face.map) face.map.dispose();
      face.map = texture;
      face.needsUpdate = true;
    };
    image.src = source;
  });
  return {
    group,
    tick: (time, pointer, scroll) => {
      meshes.forEach((mesh) => {
        mesh.position.y = mesh.userData.baseY + Math.sin(time * 0.4 + mesh.userData.phase) * 0.03;
      });
      group.position.z = (scroll - 0.45) * 0.18;
      aim(group, pointer, 0.14);
    },
  };
}

function framedTexture(image: HTMLImageElement, track: <T extends { dispose: () => void }>(item: T) => T): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const context = canvas.getContext("2d");
  const texture = track(new CanvasTexture(canvas));
  texture.colorSpace = SRGBColorSpace;
  if (!context) return texture;
  context.fillStyle = "#100c1c";
  context.fillRect(0, 0, 512, 320);
  context.fillStyle = "rgba(221, 214, 254, 0.55)";
  context.fillRect(0, 0, 512, 4);
  const areaW = 512;
  const areaH = 304;
  const scale = Math.min(areaW / image.naturalWidth, areaH / image.naturalHeight);
  const dw = image.naturalWidth * scale;
  const dh = image.naturalHeight * scale;
  context.drawImage(image, (512 - dw) / 2, 8 + (areaH - dh) / 2, dw, dh);
  texture.needsUpdate = true;
  return texture;
}

function clusterRig(
  sceneName: string,
  labels: string[],
  track: <T extends { dispose: () => void }>(item: T) => T,
  low: boolean,
): Rig {
  const names = (labels.length ? labels : sceneName === "profile" ? ["Role", "Practice"] : ["Design", "Engineering", "Delivery", "Quality"]).slice(
    0,
    sceneName === "profile" ? 2 : 4,
  );
  const spots =
    names.length <= 2
      ? [
          { x: -0.55, y: 0.22, z: 0.25, rot: 0.28 },
          { x: 0.7, y: -0.12, z: -0.05, rot: -0.32 },
        ]
      : [
          { x: -1.25, y: 0.38, z: 0.3, rot: 0.36 },
          { x: 1.2, y: 0.48, z: 0.05, rot: -0.4 },
          { x: -0.45, y: -0.55, z: 0.4, rot: 0.18 },
          { x: 0.75, y: -0.32, z: -0.15, rot: -0.22 },
        ];
  const group = new Group();
  const meshes = names.map((name, index) => {
    const spot = spots[index] ?? spots[0];
    const mesh = panel(1.28, 0.84, labelTexture(name, track), track, low);
    place(mesh, spot.x, spot.y, spot.z, spot.rot);
    group.add(mesh);
    return mesh;
  });
  for (let index = 1; index < meshes.length; index += 1) {
    group.add(beamBetween(meshes[index - 1].position, meshes[index].position, track));
  }
  return {
    group,
    tick: (time, pointer) => {
      meshes.forEach((mesh) => {
        mesh.position.y = mesh.userData.baseY + Math.sin(time * 0.45 + mesh.userData.phase) * 0.028;
      });
      aim(group, pointer, 0.1);
    },
  };
}

function messageRig(labels: string[], track: <T extends { dispose: () => void }>(item: T) => T, low: boolean): Rig {
  const names = (labels.length ? labels : ["Brief", "Reply", "Next step"]).slice(0, 3);
  const spots = [
    { x: -1.35, y: 0.22, z: 0.45, rot: 0.32 },
    { x: 0.1, y: 0.5, z: 0.1, rot: -0.04 },
    { x: 1.3, y: -0.18, z: -0.2, rot: -0.36 },
  ];
  const group = new Group();
  const meshes = names.map((name, index) => {
    const spot = spots[index] ?? spots[0];
    const mesh = panel(1.38, 0.86, labelTexture(name, track), track, low);
    place(mesh, spot.x, spot.y, spot.z, spot.rot);
    group.add(mesh);
    return mesh;
  });
  for (let index = 1; index < meshes.length; index += 1) group.add(beamBetween(meshes[index - 1].position, meshes[index].position, track));
  const chips = [0, 1].map(() => {
    const chip = new Mesh(
      track(new BoxGeometry(0.07, 0.07, 0.07)),
      track(new MeshStandardMaterial({ color: 0xf5f3ff, emissive: 0xddd6fe, emissiveIntensity: 0.55, roughness: 0.25 })),
    );
    group.add(chip);
    return chip;
  });
  return {
    group,
    tick: (time, pointer) => {
      meshes.forEach((mesh) => {
        mesh.position.y = mesh.userData.baseY + Math.sin(time * 0.5 + mesh.userData.phase) * 0.03;
      });
      chips.forEach((chip, index) => {
        const from = meshes[index];
        const to = meshes[index + 1];
        if (!from || !to) return;
        const along = (Math.sin(time * 0.8 + index) * 0.5 + 0.5);
        chip.position.lerpVectors(from.position, to.position, along);
      });
      aim(group, pointer);
    },
  };
}

function workspaceRig(track: <T extends { dispose: () => void }>(item: T) => T, low: boolean): Rig {
  const group = new Group();
  const wall = track(new MeshStandardMaterial({ color: 0x2a2144, roughness: 0.78, metalness: 0.08, emissive: 0x1a1030, emissiveIntensity: 0.35 }));
  const floor = new Mesh(track(new BoxGeometry(6.4, 0.08, 4.4)), track(new MeshStandardMaterial({ color: 0x1c1630, roughness: 0.62, metalness: 0.22 })));
  floor.position.y = -1.2;
  const back = new Mesh(track(new BoxGeometry(6.4, 2.7, 0.08)), wall);
  back.position.set(0, 0.15, -2);
  const side = new Mesh(track(new BoxGeometry(0.08, 2.7, 4.4)), wall);
  side.position.set(-3.15, 0.15, 0);
  const desk = new Mesh(
    track(new BoxGeometry(2.5, 0.08, 1.1)),
    track(new MeshStandardMaterial({ color: 0x2c2344, roughness: 0.42, metalness: 0.28 })),
  );
  desk.position.set(0.4, -0.72, 0.2);
  const stand = new Mesh(track(new BoxGeometry(0.07, 0.38, 0.07)), edgeMaterial(track));
  stand.position.set(0.25, -0.48, 0.02);
  const screen = panel(1.62, 0.96, labelTexture("Review", track), track, low);
  screen.position.set(0.25, 0.08, -0.05);
  screen.rotation.x = -0.06;
  const notes = panel(0.72, 0.5, labelTexture("Notes", track), track, low);
  notes.position.set(1.15, -0.64, 0.48);
  notes.rotation.x = -1.05;
  notes.rotation.z = -0.15;
  for (const mesh of [floor, back, side, desk, stand, screen, notes]) {
    if (!low && mesh !== floor) mesh.castShadow = true;
    group.add(mesh);
  }
  return {
    group,
    tick: (_time, pointer) => aim(group, pointer, 0.08),
  };
}

function aim(group: Group, pointer: Pointer, amount = 0.12): void {
  group.rotation.y += (pointer.x * amount - group.rotation.y) * 0.08;
  group.rotation.x += (pointer.y * -amount * 0.45 - group.rotation.x) * 0.08;
}
