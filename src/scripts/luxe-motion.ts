/**
 * Scroll and pointer choreography for the redesigned pages. No dependencies.
 *
 * Every effect here is an enhancement over content that is already visible:
 * nothing is hidden until this script arms it, and each effect is armed only
 * when the visitor has not asked for reduced motion.
 */

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

mountPeople();
mountSpotlight();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  splitTitles();
  mountScroll();
}
