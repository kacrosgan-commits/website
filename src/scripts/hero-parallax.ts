/** Pointer tilt for the CSS 3D fallback. Stops once a WebGL scene takes over. */
export function mountHeroParallax(): void {
  const stages = [...document.querySelectorAll<HTMLElement>("[data-hero-stage]")];
  if (!stages.length) return;

  let clientX = window.innerWidth / 2;
  let clientY = window.innerHeight / 2;
  let frame = 0;
  let stopped = false;

  const apply = () => {
    frame = 0;
    if (stopped || document.hidden) return;
    let again = false;
    for (const stage of stages) {
      if (stage.classList.contains("is-live")) continue;
      const world = stage.querySelector<HTMLElement>(".stage-world");
      if (!world) continue;
      const rect = stage.getBoundingClientRect();
      if (rect.width < 2 || rect.bottom < 0 || rect.top > window.innerHeight) continue;
      const nx = (clientX - rect.left) / rect.width - 0.5;
      const ny = (clientY - rect.top) / rect.height - 0.5;
      const previous = world.dataset.tilt ?? "0,0";
      const [ox, oy] = previous.split(",").map((value) => Number(value) || 0);
      const tx = ox + (nx - ox) * 0.08;
      const ty = oy + (ny - oy) * 0.08;
      world.dataset.tilt = `${tx},${ty}`;
      world.style.transform = `rotateX(${(-ty * 5).toFixed(2)}deg) rotateY(${(tx * 7).toFixed(2)}deg)`;
      if (Math.abs(nx - tx) > 0.012 || Math.abs(ny - ty) > 0.012) again = true;
    }
    if (again) frame = requestAnimationFrame(apply);
  };

  const onMove = (event: PointerEvent) => {
    if (stopped) return;
    clientX = event.clientX;
    clientY = event.clientY;
    if (!frame) frame = requestAnimationFrame(apply);
  };

  const onHide = () => {
    if (!document.hidden || !frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const stop = () => {
    stopped = true;
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("visibilitychange", onHide);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", stop, { once: true });
}
