/**
 * Scroll and pointer choreography for the redesigned pages. No dependencies.
 *
 * Every effect here is an enhancement over content that is already visible:
 * nothing is hidden until this script arms it, and each effect is armed only
 * when the visitor has not asked for reduced motion.
 */
import { canMountLiquid, hasHardwareWebgl } from "./vortex-gate";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

/** People wall: answers the visitor's own action, so it stays on with reduced motion too. */
function mountPeople() {
  document.querySelectorAll<HTMLElement>("[data-people]").forEach((wall) => {
    const portraits = wall.querySelectorAll<HTMLElement>(".people-portrait");
    const rows = wall.querySelectorAll<HTMLElement>("[data-person]");
    let current = 0;
    let layer = 1;

    const show = (index: number) => {
      if (index === current) return;
      portraits[current]?.classList.remove("is-active");
      rows[current]?.classList.remove("is-active");
      const next = portraits[index];
      if (next) next.style.zIndex = String(++layer);
      next?.classList.add("is-active");
      rows[index]?.classList.add("is-active");
      current = index;
    };

    rows.forEach((row, index) => {
      row.addEventListener("pointerenter", () => show(index));
      row.addEventListener("focus", () => show(index));
    });
  });
}

/** A soft light that follows the pointer across a row of bays. */
function mountSpotlight() {
  if (!window.matchMedia("(hover: hover)").matches) return;
  document.querySelectorAll<HTMLElement>("[data-spotlight] > *").forEach((bay) => {
    bay.addEventListener("pointermove", (event) => {
      const rect = bay.getBoundingClientRect();
      bay.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      bay.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

/**
 * Selected work, 1024 px and up: the section pins and the six projects move sideways while the
 * visitor scrolls down. The rail is as tall as the track is wide, so one pixel of scroll moves the
 * track one pixel. Only the track's transform and the progress bar's scale change per frame.
 *
 * Below 1024 px, with reduced motion, without JavaScript, or where the cards would not fit the
 * screen height (short laptops, enlarged text), the section stays a normal vertical list.
 */
function mountWorkGallery() {
  const section = document.querySelector<HTMLElement>("[data-work]");
  const rail = section?.querySelector<HTMLElement>("[data-work-rail]");
  const pin = rail?.querySelector<HTMLElement>(".work-pin");
  const track = rail?.querySelector<HTMLElement>("[data-work-track]");
  const frame = track?.parentElement;
  const bar = pin?.querySelector<HTMLElement>(".work-progress");
  if (!section || !rail || !pin || !track || !frame || !bar) return;

  const wide = window.matchMedia("(min-width: 64rem)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector<HTMLElement>("[data-header]");
  const cards = [...track.querySelectorAll<HTMLElement>(".portfolio-card")];
  let armed = false;
  let distance = 0;
  /* Layout that failed the fit check, so resize observers do not retry it in a loop. It includes
     the list's own size, so a web font arriving (which changes the text) earns a fresh try. */
  let refused = "";

  const layoutKey = () =>
    `${window.innerWidth}x${window.innerHeight}@${getComputedStyle(document.documentElement).fontSize}/${track.offsetWidth}x${track.offsetHeight}`;

  const progress = () => (distance > 0 ? clamp(-rail.getBoundingClientRect().top / distance) : 0);

  const apply = () => {
    if (!armed) return;
    const p = progress();
    track.style.setProperty("--work-x", `${(-p * distance).toFixed(2)}px`);
    section.style.setProperty("--work-p", p.toFixed(4));
  };

  /* The screen height is what the pin leaves after the header, the progress bar and the tallest
     card text. Card width follows the screen height and text height follows the width, so settle
     it in a few passes. */
  const sizeCards = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const pinStyle = getComputedStyle(pin);
    const inner = pin.clientHeight - parseFloat(pinStyle.paddingTop) - parseFloat(pinStyle.paddingBottom);
    const barBlock = bar.offsetHeight + parseFloat(getComputedStyle(bar).marginTop);
    const chrome = cards[0]?.querySelector<HTMLElement>(".browser-bar")?.offsetHeight ?? 2.1 * rem;
    const max = Math.min(34 * rem, (window.innerWidth * 0.62 * 9) / 16);
    let size = Math.min(max, parseFloat(getComputedStyle(pin).getPropertyValue("--img-h")) || max);
    for (let pass = 0; pass < 4; pass += 1) {
      pin.style.setProperty("--img-h", `${size.toFixed(1)}px`);
      const text = Math.max(...cards.map((card) => card.querySelector<HTMLElement>(".project-body")?.offsetHeight ?? 0));
      const next = Math.min(max, Math.floor(inner - barBlock - chrome - text - 2));
      if (Math.abs(next - size) < 1) break;
      size = next;
    }
    pin.style.setProperty("--img-h", `${Math.max(size, 1).toFixed(1)}px`);
  };

  const measure = () => {
    section.style.setProperty("--header-h", `${Math.ceil(header?.getBoundingClientRect().height ?? 88)}px`);
    sizeCards();
    distance = Math.max(0, Math.ceil(track.scrollWidth - frame.clientWidth));
    rail.style.setProperty("--rail-h", `${pin.offsetHeight + distance}px`);
  };

  /* Every card, text included, must sit between the header and the progress bar, and a website
     screen must stay large enough to read as one (9rem tall). */
  const fits = () => {
    if (distance <= 0) return false;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    if (parseFloat(pin.style.getPropertyValue("--img-h")) < 9 * rem) return false;
    const pinBox = pin.getBoundingClientRect();
    const top = pinBox.top + (header?.getBoundingClientRect().height ?? 0);
    const bottom = bar.getBoundingClientRect().top;
    return cards.every((card) => {
      const box = card.getBoundingClientRect();
      return box.top >= top - 1 && box.bottom <= bottom + 1;
    });
  };

  const disarm = () => {
    armed = false;
    section.classList.remove("is-horizontal");
    for (const name of ["--header-h", "--work-p"]) section.style.removeProperty(name);
    rail.style.removeProperty("--rail-h");
    pin.style.removeProperty("--img-h");
    track.style.removeProperty("--work-x");
  };

  const arm = () => {
    /* The cards' own rise-in is off while they move sideways; never leave one waiting, and never
       measure one mid-rise. */
    track.querySelectorAll(".await-reveal").forEach((node) => {
      node.classList.add("is-in");
      node.classList.remove("await-reveal");
    });
    section.classList.add("is-horizontal");
    measure();
    if (!fits()) {
      disarm();
      refused = layoutKey();
      return;
    }
    refused = "";
    armed = true;
    apply();
  };

  const evaluate = () => {
    const wanted = wide.matches && !reduced.matches;
    if (!wanted) {
      if (armed) disarm();
      return;
    }
    if (armed) {
      measure();
      if (!fits()) {
        disarm();
        refused = layoutKey();
      } else apply();
      return;
    }
    if (refused !== layoutKey()) arm();
  };

  let pending = false;
  const scheduleEvaluate = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      evaluate();
    });
  };

  /* Keyboard: a focused card is brought fully into view by scrolling the page to the point where
     the track shows it. The pin uses overflow: clip, so the browser cannot scroll it sideways. */
  const reveal = (card: HTMLElement) => {
    if (!armed || distance <= 0) return;
    const shift = progress() * distance;
    const left = card.offsetLeft - shift;
    const width = card.offsetWidth;
    const room = frame.clientWidth;
    let target = shift;
    if (left < 0) target = card.offsetLeft;
    else if (left + width > room) target = card.offsetLeft + width - room;
    target = Math.min(distance, Math.max(0, target));
    const y = window.scrollY + rail.getBoundingClientRect().top + target;
    if (Math.abs(window.scrollY - y) > 0.5) window.scrollTo({ top: y, behavior: "instant" });
    apply();
  };

  section.addEventListener("focusin", (event) => {
    const card = (event.target as Element | null)?.closest<HTMLElement>(".portfolio-card");
    if (!card || !armed) return;
    reveal(card);
    requestAnimationFrame(() => reveal(card));
  });

  /* Straight from the scroll event, which runs before animation frames: anything that measures the
     cards in its own frame (the liquid image canvas) sees the track already in place. */
  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", scheduleEvaluate, { passive: true });
  wide.addEventListener("change", scheduleEvaluate);
  reduced.addEventListener("change", scheduleEvaluate);
  if ("ResizeObserver" in window) new ResizeObserver(scheduleEvaluate).observe(track);
  document.fonts?.ready.then(scheduleEvaluate).catch(() => {});
  evaluate();
}

/**
 * Background blend: while the work section covers the middle of the screen the page colour eases
 * to ivory, and back to dark once it leaves. The CSS times the text colour against the background
 * so it reads at every scroll position.
 */
function mountTone() {
  const work = document.querySelector<HTMLElement>(".lux-work");
  if (!work || !("IntersectionObserver" in window)) return;
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let switching = 0;
  const setTone = (paper: boolean) => {
    if (paper === (root.dataset.tone === "paper")) return;
    root.classList.add("tone-switching");
    window.clearTimeout(switching);
    switching = window.setTimeout(() => root.classList.remove("tone-switching"), 760);
    if (paper) root.dataset.tone = "paper";
    else delete root.dataset.tone;
  };
  const line = new IntersectionObserver(
    ([entry]) => setTone(Boolean(entry?.isIntersecting)),
    { rootMargin: "-49.5% 0px -49.5% 0px" },
  );
  const sync = () => {
    if (reduced.matches) {
      line.disconnect();
      root.classList.remove("tone-armed", "tone-switching");
      delete root.dataset.tone;
      return;
    }
    if (!root.classList.contains("tone-armed")) {
      root.classList.add("tone-armed", "tone-instant");
      /* Two frames: the observer's first answer lands before the transitions come back. */
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("tone-instant")));
    }
    line.observe(work);
  };
  reduced.addEventListener("change", sync);
  sync();
}

/** Wrap each word of a heading so it can rise through its own line. Offscreen headings only. */
function splitTitles() {
  document.querySelectorAll<HTMLElement>(".await-reveal .section-title").forEach((title) => {
    let index = 0;
    const walk = (node: Node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
          return;
        }
        if (child.nodeType !== Node.TEXT_NODE || !child.textContent?.trim()) return;
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (!part.trim()) {
            fragment.append(" ");
            return;
          }
          const mask = document.createElement("span");
          const word = document.createElement("span");
          mask.className = "w";
          word.style.setProperty("--i", String(index++));
          word.textContent = part;
          mask.append(word);
          fragment.append(mask);
        });
        child.replaceWith(fragment);
      });
    };
    walk(title);
  });
}

/** Split a paragraph into words that light up as it is read. Once lit, a word stays lit. */
function prepareScrubWords(element: HTMLElement) {
  const text = element.textContent ?? "";
  element.textContent = "";
  const words: HTMLElement[] = [];
  text
    .trim()
    .split(/\s+/)
    .forEach((part, index) => {
      if (index > 0) element.append(" ");
      const word = document.createElement("span");
      word.className = "sw";
      word.textContent = part;
      element.append(word);
      words.push(word);
    });
  element.classList.add("is-armed");
  return words;
}

function mountScroll() {
  const updaters = new Map<Element, () => void>();
  const active = new Set<() => void>();
  let queued = false;

  const flush = () => {
    queued = false;
    active.forEach((update) => update());
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(flush);
  };

  const visibility = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const update = updaters.get(entry.target);
        if (!update) return;
        if (entry.isIntersecting) {
          active.add(update);
          update();
        } else {
          active.delete(update);
        }
      });
    },
    { rootMargin: "10% 0px 10% 0px" },
  );

  const track = (element: Element, update: () => void) => {
    updaters.set(element, update);
    visibility.observe(element);
    update();
  };

  // Hero: the lobby drifts and the copy lifts away as the page leaves it.
  document.querySelectorAll<HTMLElement>("[data-hero]").forEach((hero) => {
    track(hero, () => {
      const progress = clamp(window.scrollY / Math.max(hero.offsetHeight, 1));
      hero.style.setProperty("--hero-p", progress.toFixed(4));
    });
  });

  // Film: a framed plate opens to the full width as it arrives.
  document.querySelectorAll<HTMLElement>("[data-aperture]").forEach((section) => {
    section.style.setProperty("--ap", "0");
    track(section, () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = clamp((viewport - rect.top) / (viewport * 0.8));
      section.style.setProperty("--ap", easeOut(progress).toFixed(4));
    });
  });

  // Statement paragraph: words light up from the first to the last while it crosses the screen.
  document.querySelectorAll<HTMLElement>("[data-scrub-words]").forEach((paragraph) => {
    const words = prepareScrubWords(paragraph);
    let lit = 0;
    track(paragraph, () => {
      const rect = paragraph.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = clamp((viewport * 0.92 - rect.top) / (viewport * 0.5));
      const target = Math.ceil(progress * words.length);
      for (; lit < target; lit += 1) words[lit]?.classList.add("is-lit");
    });
  });

  // Process: the line fills and each stage lights as it is reached.
  document.querySelectorAll<HTMLElement>("[data-process-progress]").forEach((list) => {
    const steps = [...list.querySelectorAll<HTMLElement>(".process-step")];
    list.classList.add("is-armed");
    list.style.setProperty("--progress", "0");
    track(list, () => {
      const rect = list.getBoundingClientRect();
      const viewport = window.innerHeight;
      const wide = window.matchMedia("(min-width: 80rem)").matches;
      const progress = wide
        ? clamp((viewport * 0.9 - rect.top) / (viewport * 0.55))
        : clamp((viewport * 0.72 - rect.top) / Math.max(rect.height, 1));
      list.style.setProperty("--progress", progress.toFixed(4));
      steps.forEach((step, index) => {
        step.classList.toggle("is-lit", progress >= (index + 0.05) / steps.length);
      });
    });
  });

  // Specialties: the row crossing the middle of the screen takes the light.
  document.querySelectorAll<HTMLElement>("[data-current-rows]").forEach((list) => {
    const rows = [...list.children];
    list.classList.add("is-armed");
    const center = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("is-current", entry.isIntersecting));
      },
      { rootMargin: "-46% 0px -46% 0px" },
    );
    rows.forEach((row) => center.observe(row));
  });

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue, { passive: true });
}

const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Liquid project images: three.js loads only when a mouse first moves onto a project image, and
 * only where the shared WebGL gate passes. Everyone else keeps the CSS image scale.
 */
function mountLiquidIntent() {
  if (!document.querySelector("[data-liquid]")) return;
  let state: "idle" | "loading" | "done" = "idle";
  const intent = (event: PointerEvent) => {
    if (state !== "idle" || event.pointerType !== "mouse") return;
    if (!(event.target as Element | null)?.closest?.("[data-liquid] .shot-frame")) return;
    if (!canMountLiquid() || !hasHardwareWebgl()) {
      state = "done";
      return;
    }
    state = "loading";
    import("./liquid-hover.ts")
      .then((liquid) => {
        liquid.mountLiquidHover(event);
        state = "done";
      })
      .catch(() => {
        state = "done";
      });
  };
  document.addEventListener("pointerover", intent, { passive: true });
  /* The effect disposes itself on pagehide; a page restored from the back/forward cache can mount it again. */
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) state = "idle";
  });
}

/** A small "View" label that follows a mouse over project images. Pointer devices only. */
function mountViewCursor() {
  if (!finePointer() || reducedMotion() || !document.querySelector("[data-liquid]")) return;
  const label = document.createElement("div");
  label.className = "view-cursor";
  label.setAttribute("aria-hidden", "true");
  label.textContent = "View";
  document.body.append(label);
  document.documentElement.classList.add("view-cursor-on");

  const target = { x: 0, y: 0 };
  const shown = { x: 0, y: 0 };
  let over = false;
  let has = false;
  let raf = 0;

  const draw = () => {
    raf = 0;
    shown.x += (target.x - shown.x) * 0.32;
    shown.y += (target.y - shown.y) * 0.32;
    label.style.transform = `translate3d(${shown.x.toFixed(1)}px, ${shown.y.toFixed(1)}px, 0)`;
    if (Math.abs(target.x - shown.x) > 0.3 || Math.abs(target.y - shown.y) > 0.3) raf = requestAnimationFrame(draw);
  };
  const setOver = (next: boolean) => {
    if (next === over) return;
    over = next;
    label.classList.toggle("is-on", over);
  };
  const isImage = (node: Element | null) => Boolean(node?.closest?.("[data-liquid] .shot-frame"));

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!has || !over) {
        shown.x = target.x;
        shown.y = target.y;
      }
      has = true;
      setOver(isImage(event.target as Element | null));
      if (!raf) raf = requestAnimationFrame(draw);
    },
    { passive: true },
  );
  /* The gallery can move an image out from under a still pointer. */
  window.addEventListener(
    "scroll",
    () => {
      if (has) setOver(isImage(document.elementFromPoint(target.x, target.y)));
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => setOver(false));
  window.addEventListener("pagehide", () => setOver(false));
}

/**
 * Primary and outline buttons lean toward the mouse, 8 px at most. Only while the pointer is on the
 * button, and always toward it, so the button never slides out from under the pointer.
 */
function mountMagnetic() {
  if (!finePointer() || reducedMotion()) return;
  const MAX = 8;
  document.querySelectorAll<HTMLElement>(".btn-primary, .btn-outline").forEach((button) => {
    let dx = 0;
    let dy = 0;
    button.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const box = button.getBoundingClientRect();
      const cx = box.left - dx + box.width / 2;
      const cy = box.top - dy + box.height / 2;
      dx = Math.max(-MAX, Math.min(MAX, (event.clientX - cx) * 0.22));
      dy = Math.max(-MAX, Math.min(MAX, (event.clientY - cy) * 0.3));
      button.style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`;
    });
    button.addEventListener("pointerleave", () => {
      dx = 0;
      dy = 0;
      button.style.translate = "";
    });
  });
}

/**
 * Gold labels decode once as they arrive: random glyphs settle into the real text, left to
 * right, within 600 ms. The real text stays in the element (transparent) for screen readers and
 * keeps its width; the glyphs are an aria-hidden overlay.
 */
function mountDecode() {
  const targets = [...document.querySelectorAll<HTMLElement>("[data-hero] .eyebrow, .home-flow .eyebrow")];
  if (!targets.length || !("IntersectionObserver" in window)) return;
  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWER = "abcdefghijklmnopqrstuvwxyz";
  const OTHER = "0123456789#%&*+/<>";
  const DURATION = 600;
  const glyph = (char: string) => {
    const set = char >= "A" && char <= "Z" ? UPPER : char >= "a" && char <= "z" ? LOWER : OTHER;
    return set[Math.floor(Math.random() * set.length)]!;
  };

  const decode = (host: HTMLElement) => {
    if (host.childElementCount > 0 || !host.textContent?.trim()) return;
    const text = host.textContent;
    const chars = [...text];
    const real = document.createElement("span");
    real.className = "decode";
    real.textContent = text;
    const mask = document.createElement("span");
    mask.className = "decode-mask";
    mask.setAttribute("aria-hidden", "true");
    real.append(mask);
    host.replaceChildren(real);
    const start = performance.now();
    let lastSwap = 0;
    const step = (now: number) => {
      const t = (now - start) / DURATION;
      if (t >= 1 || reducedMotion()) {
        host.replaceChildren(text);
        return;
      }
      if (now - lastSwap > 45) {
        lastSwap = now;
        mask.textContent = chars
          .map((char, index) => {
            if (!char.trim()) return char;
            const settle = 0.2 + 0.8 * (index / Math.max(chars.length - 1, 1));
            return t >= settle ? char : glyph(char);
          })
          .join("");
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* A label that fades in on its own (the hero's) decodes when its fade starts. */
  const whenVisible = (host: HTMLElement) => {
    let wait = 0;
    for (const animation of host.getAnimations()) {
      const delay = Number(animation.effect?.getTiming().delay ?? 0);
      const current = Number(animation.currentTime ?? 0);
      wait = Math.max(wait, delay - current);
    }
    if (wait > 0) window.setTimeout(() => decode(host), wait);
    else decode(host);
  };

  const seen = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        seen.unobserve(entry.target);
        whenVisible(entry.target as HTMLElement);
      });
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((target) => seen.observe(target));
}

mountPeople();
mountSpotlight();
mountWorkGallery();
mountTone();
mountLiquidIntent();
mountViewCursor();
mountMagnetic();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  splitTitles();
  mountScroll();
  mountDecode();
}
