import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LANDING_PIN_IDS } from "@/components/landing/landing-pin-ids";

gsap.registerPlugin(ScrollTrigger);

/** Peak Y offset for a card — taller cards get a slightly stronger arc */
function amplitudeFor(card: HTMLElement): number {
  const h = card.offsetHeight || 120;
  return Math.round(100 + h * 0.45);
}

/**
 * Parabola peaking at viewport center: y = (1 - t²) * amp * dir
 * t ∈ [-1, 1] from left→right edge of viewport.
 */
function applyOrbit(
  cards: HTMLElement[],
  ySetters: Array<ReturnType<typeof gsap.quickSetter>>,
  rotSetters: Array<ReturnType<typeof gsap.quickSetter>>,
  dirs: number[],
  amps: number[],
): void {
  const vw = window.innerWidth;
  const mid = vw * 0.5;
  const half = mid || 1;

  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const t = Math.max(-1.25, Math.min(1.25, (cx - mid) / half));
    const arc = (1 - t * t) * amps[i] * dirs[i];
    ySetters[i](arc);
    rotSetters[i](t * 4.5 * dirs[i]);
  }
}

export function setupPrefooterOrbit(opts: {
  section: HTMLElement;
  track: HTMLElement;
  cards: HTMLElement[];
}): () => void {
  const { section, track, cards } = opts;
  if (!cards.length) return () => undefined;

  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);

  const ctx = gsap.context(() => {
    const content = section.querySelector<HTMLElement>(".prefooter__content");
    const dirs = cards.map((card) => {
      const raw = Number(card.dataset.orbit);
      return raw === -1 ? -1 : 1;
    });
    const amps = cards.map((card) => amplitudeFor(card));
    const ySetters = cards.map((card) => gsap.quickSetter(card, "y", "px"));
    const rotSetters = cards.map((card) =>
      gsap.quickSetter(card, "rotation", "deg"),
    );

    const refreshAmps = () => {
      for (let i = 0; i < cards.length; i++) {
        amps[i] = amplitudeFor(cards[i]);
      }
    };

    gsap.set(cards, { force3D: true, y: 0, rotation: 0 });
    // Own the CSS translate(-50%, -50%) so runway y doesn't un-center the title
    if (content) {
      gsap.set(content, {
        xPercent: -50,
        yPercent: -50,
        y: 28,
        opacity: 0.65,
        force3D: true,
      });
    }

    // Fully off-screen right → fully off-screen left; pin holds until exit
    const startX = () => Math.round(window.innerWidth);
    const endX = () => -Math.round(track.scrollWidth + window.innerWidth * 0.08);
    const travel = () => startX() - endX();

    gsap.set(track, { force3D: true, x: startX(), opacity: 1 });

    const syncOrbit = () =>
      applyOrbit(cards, ySetters, rotSetters, dirs, amps);

    // Soft runway: settle title before pin locks (photos stay off-screen)
    if (content) {
      gsap.to(content, {
        y: 0,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top top",
          scrub: 1.2,
        },
      });
    }

    gsap.fromTo(
      track,
      { x: () => startX() },
      {
        x: () => endX(),
        ease: "none",
        scrollTrigger: {
          id: LANDING_PIN_IDS[1],
          trigger: section,
          start: "top top",
          // Slightly longer than travel so the dense mid-pass lingers
          end: () => `+=${Math.round(travel() * 1.35)}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          onUpdate: syncOrbit,
          onRefresh: () => {
            refreshAmps();
            syncOrbit();
          },
        },
      },
    );

    requestAnimationFrame(() => {
      refreshAmps();
      syncOrbit();
      ScrollTrigger.refresh();
    });
  }, section);

  return () => {
    window.removeEventListener("load", onLoad);
    ctx.revert();
  };
}
