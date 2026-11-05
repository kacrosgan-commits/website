/**
 * Where the homepage WebGL effects may run. Kept apart from the scenes so checking it never
 * pulls three.js into the page's first bundle.
 *
 * Reduced motion, machines with four cores or fewer and machines without a usable GPU keep the
 * static design. Each effect adds its own conditions on top of these.
 */
function canRunWebglEffects(): boolean {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && (navigator.hardwareConcurrency ?? 8) > 4;
}

/** The hero depth scene: wide screens with the lobby photo. */
export function canMountVortex(): boolean {
  return (
    canRunWebglEffects() &&
    window.matchMedia("(min-width: 64rem)").matches &&
    Boolean(document.querySelector("[data-hero] .photo-hero-img"))
  );
}

/** The project-image ripple: a mouse or trackpad that can hover, over a page that has project images. */
export function canMountLiquid(): boolean {
  return (
    canRunWebglEffects() &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    Boolean(document.querySelector("[data-liquid] .shot-frame img"))
  );
}

/** A real GPU behind WebGL 2: not missing, not flagged as slow, not a software renderer. */
export function hasHardwareWebgl(): boolean {
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
  } catch {
    return false;
  }
  if (!gl) return false;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}
