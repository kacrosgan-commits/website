/**
 * Where the homepage WebGL scene may run. Kept apart from the scene so checking it never
 * pulls three.js into the page's first bundle.
 *
 * Reduced motion, narrow screens, machines with four cores or fewer and machines without a
 * usable GPU keep the static design.
 */
export function canMountVortex(): boolean {
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(min-width: 64rem)").matches &&
    (navigator.hardwareConcurrency ?? 8) > 4 &&
    Boolean(document.querySelector("[data-hero] .photo-hero-img"))
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
