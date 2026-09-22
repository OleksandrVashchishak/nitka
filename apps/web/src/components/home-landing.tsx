"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuthStore } from "@/lib/auth-store";
import { getHomePath } from "@/lib/routes";
import { MobileAppSection } from "@/components/landing/mobile-app-section";
import { Prefooter } from "@/components/landing/prefooter/Prefooter";
import { useHomeSmoothScroll } from "@/components/landing/smooth-scroll";
import "@/app/hero-artboard.css";
import "@/app/landing-rest.css";

gsap.registerPlugin(ScrollTrigger);

const DARK_ROWS = [
  {
    photo: "/landing/compare-1.jpg",
    beforeTitle: "Таблиці excel",
    beforeText: <>“треба зробити”<br /> списки в телеграмі і в нотатках</>,
    afterTitle: "Спільний чекліст",
    afterText:
      "і дашборд із миттєвим синхроном для двох з будь якого девайсу",
  },
  {
    photo: "/landing/compare-2.jpg",
    beforeTitle: "Обдзвони, напиши",
    beforeText: <>100 гостей<br /> “ти не знаєш, чи буде він з +1?”<br /> “а ти вніс того свого дядька в список?”</>,
    afterTitle: "Список гостей і дизайн запрошень",
    afterText:
      "та автоматична відправка сайту-запрошення з кнопкою “Ми будемо” і підрахунком гостей",
  },
];

const LIGHT_ROWS = [
  {
    photo: "/landing/compare-3.jpg",
    beforeTitle: "Завдатки і плутанина",
    beforeText: <>в гривні та валюті<br /> «куди поділися 1000$ з бюджету?»</>,
    afterTitle: "Прозорий трекінг витрат,",
    afterText: "авансів та кошторисів у будь-якій валюті",
  },
  {
    photo: "/landing/compare-1.jpg",
    beforeTitle: "Перемалюй схеми столів",
    beforeText: "На серветці за день до весілля",
    afterTitle: "Конструктор розсадки",
    afterText: "прив’язаний до списку гостей та їх “Буду-не буду”",
  },
  {
    photo: "/landing/compare-2.jpg",
    beforeTitle: "Дизайнер за всі гроші світу",
    beforeText: <>"Для запрошень, посадкової карти, іменних табличок, правки за $50 в день перед весіллям,<br /> бо “тьотя Віра не прийде”</>,
    afterTitle: "Готові дизайни",
    afterText:
      "Макети посадкових карт, друкованих запрошень та іншої поліграфії в два кліки",
  },
];

const FEATURES = [
  {
    n: "01",
    title: "Планування",
    img: "/landing/feat-1.jpg",
    points: [
      {
        title: "Персоналізований чекліст та таймлайн",
        text: "Персоналізуйте наш розумний список задач із дедлайнами і просто відмічайте зроблене.",
      },
      {
        title: "План весільного дня",
        text: "Розпишіть ранок нареченої, виїзну церемонію та перший танець по хвилинах.",
      },
    ],
  },
  {
    n: "02",
    title: "Гості, запрошення та зв’язок",
    img: "/landing/feat-2.jpg",
    points: [
      {
        title: "Конструктор сайтів-запрошень",
        text: "Зберіть красивий електронний сайт за 10 хвилин. Додайте локацію, дрес-код, таймлайн дня та важливі деталі для гостей.",
      },
      {
        title: "Розумний список гостей",
        text: "Гості підтверджують присутність і система сама враховує +1, дітей, сім’ї, та навіть статус релокації чи служби, а також нагадуйте гостям про дату, збирайте відповіді та надсилайте важливі апдейти в один клік через Telegram або Viber.",
      },
    ],
  },
  {
    n: "03",
    title: "Фінанси та окупність",
    img: "/landing/feat-3.jpg",
    points: [
      {
        title: "Бюджет без сюрпризів",
        text: "Фіксуйте заплановані та фактичні витрати. Враховуйте аванси, фіксуйте залишки підрядникам та перемикайтеся між UAH / USD.",
      },
      {
        title: "Аналітика окупності",
        text: "Забронюйте час для підрахунку після свята. Внесіть подарунки у будь-якій валюті та дізнайтеся реальний фінансовий результат вашого весілля.",
      },
    ],
  },
  {
    n: "04",
    title: "Візуалізація та Print Studio",
    img: "/landing/feat-4.jpg",
    points: [
      {
        title: "Конструктор розсадки",
        text: "Розставляйте круглі та прямокутні столи, перетягуйте гостей мишкою та бачте, хто ще залишився без місця.",
      },
      {
        title: "Друк за один клік",
        text: "Генеруйте готові до друку PDF-файли з дизайнерською картою посадки, іменними картками для столів та друкованими запрошеннями. Занесіть файл у найближчу поліграфію — і все готово.",
      },
    ],
  },
];

const FOOT_PRODUCT = [
  { href: "/vesilnyy-plan", label: "Чеклісти" },
  { href: "/spysok-gostey", label: "Список гостей" },
  { href: "/vesilnyy-byudzhet", label: "Бюджет" },
  { href: "/zaprosinnya", label: "Запрошення" },
  { href: "/rozsadka-gostey", label: "Розсадка" },
  { href: "/plan-dnya-vesillya", label: "План дня" },
] as const;

function FeaturesStack() {
  return (
    <section className="fata-features">
      {FEATURES.map((feature, i) => (
        <article
          key={feature.n}
          className="fata-feature"
          style={{
            zIndex: i + 1,
            top: `calc(var(--fata-header-h) + ${i} * var(--fata-feature-stack-h))`,
          }}
        >
          <div className="fata-shell fata-feature-inner">
            <div className="fata-feature-head">
              <p className="fata-feature-n">{feature.n}</p>
              <h3>{feature.title}</h3>
            </div>
            <div className="fata-feature-main">
              <div className="fata-feature-panel">
                <div className="fata-feature-panel-inner">
                  {feature.points.map((point) => (
                    <p key={point.title} className="fata-feature-point">
                      <strong>{point.title}</strong>
                      <span>{point.text}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="fata-feature-img">
                <Image
                  src={feature.img}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 100vw, 390px"
                />
              </div>
            </div>
          </div>
        </article>
      ))}
      {/* White lid under title stack — stays above prefooter during handoff */}
      <div
        className="fata-features-end"
        style={{
          top: `calc(var(--fata-header-h) + ${FEATURES.length} * var(--fata-feature-stack-h))`,
        }}
        aria-hidden
      />
      <div className="fata-features-runway" aria-hidden />
    </section>
  );
}

function Scribble() {
  return (
    <svg
      className="fata-scribble"
      viewBox="0 0 420 140"
      fill="none"
      aria-hidden
    >
      <path
        className="fata-scribble-path"
        d="M48 78c-18-28 38-58 118-64 86-6 168 8 198 38 28 28 8 54-48 64-62 12-168 16-228-2-42-12-52-38-28-52 18-10 62-4 96 6"
        pathLength={1}
        stroke="#FF4200"
        strokeWidth={3.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossOut() {
  return (
    <svg
      className="fata-x"
      width={193}
      height={172}
      viewBox="0 0 193 172"
      fill="none"
      aria-hidden
    >
      <path
        className="fata-x-a"
        d="M192.976 4.25879C189.316 5.41789 186.171 7.78296 183.033 9.95297C173.32 17.0054 164.409 25.0982 155.689 33.3184C155.686 33.3213 155.677 33.3303 155.674 33.3333C139.858 49.376 124.483 65.8345 109.352 82.5191C100.55 92.2442 91.8532 102.049 83.3244 112.016C69.3854 128.276 56.1045 145.071 43.5959 162.418C41.3453 165.521 39.1109 168.633 36.8779 171.748C39.2179 168.712 41.554 165.676 43.9 162.646C56.9435 145.702 70.5497 129.241 84.6598 113.172C93.2936 103.322 102.04 93.5784 110.835 83.8616C125.952 67.1913 141.149 50.5871 156.615 34.2449L156.6 34.2598C165.131 25.8821 173.803 17.5868 183.259 10.2584C186.318 7.99828 189.369 5.54116 192.976 4.25879Z"
        fill="#FF4200"
      />
      <path
        className="fata-x-b"
        d="M0 0C2.91712 2.1584 5.78231 4.45246 8.66188 6.67789C14.4616 11.191 20.3051 15.7311 26.1432 20.251C46.243 35.8157 66.4991 51.3148 86.8013 66.6638C102.033 78.1815 117.297 89.6138 132.604 101.014C143.234 109.026 154.071 116.669 164.316 125.045C164.677 125.356 165.039 125.667 165.401 125.977C168.179 128.347 170.981 130.683 173.783 133.021C171.068 130.582 168.348 128.15 165.653 125.692C165.301 125.371 164.95 125.049 164.6 124.727C154.578 115.977 143.966 108.077 133.483 99.8571C118.394 88.1649 103.24 76.5866 88.0075 65.0685C67.7044 49.7189 47.2522 34.4785 26.761 19.4318C20.8094 15.062 14.8361 10.6937 8.89024 6.37417C5.93849 4.2446 2.9965 2.05127 0 0Z"
        fill="#FF4200"
      />
    </svg>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    function onChange() {
      setReduced(mq.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** 0 idle → 1 before → 2 crossed → 3 after → 4 circled */
function useCompareScrollStage(reduced: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStage(4);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let raf = 0;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Slightly early, but not as aggressive as the last nudge.
      const start = vh * 1.08;
      const end = vh * 0.34;
      const focus = rect.top + Math.min(rect.height * 0.22, 64);
      const raw = (start - focus) / (start - end);
      const p = Math.min(1, Math.max(0, raw));

      let next = 0;
      if (p >= 0.02) next = 1;
      if (p >= 0.14) next = 2;
      if (p >= 0.3) next = 3;
      if (p >= 0.48) next = 4;
      setStage((prev) => (prev === next ? prev : next));
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return { ref, stage };
}

function useRevealOnScroll<T extends HTMLElement = HTMLElement>(
  reduced: boolean,
  opts?: { rootMargin?: string; minRatio?: number },
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const rootMargin = opts?.rootMargin ?? "8% 0px 0px 0px";
  const minRatio = opts?.minRatio ?? 0.06;

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting && entry.intersectionRatio > minRatio);
      },
      { threshold: [0, 0.06, 0.15, 0.3, 0.45], rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, rootMargin, minRatio]);

  return { ref, visible };
}

function RevealPhoto({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>(reduced);

  return (
    <div
      ref={ref}
      className={[className, "fata-reveal-photo", visible ? "is-in" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

function RevealCompareIntro({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const { ref, visible } = useRevealOnScroll<HTMLParagraphElement>(reduced, {
    // Start later so the rise is seen in-frame, not below the fold.
    rootMargin: "0px 0px -12% 0px",
    minRatio: 0.2,
  });

  return (
    <p
      ref={ref}
      className={["fata-compare-intro", "fata-reveal-text", visible ? "is-in" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}

function ComparePair({
  row,
}: {
  row: {
    beforeTitle: string;
    beforeText: ReactNode;
    afterTitle: string;
    afterText: ReactNode;
  };
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, stage } = useCompareScrollStage(reduced);

  return (
    <div
      ref={ref}
      className={[
        "fata-compare-pair",
        stage >= 1 ? "is-before-in" : "",
        stage >= 2 ? "is-crossed" : "",
        stage >= 3 ? "is-after-in" : "",
        stage >= 4 ? "is-circled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="fata-compare-cell fata-compare-cell--before">
        <CrossOut />
        <p className="fata-kicker">Було</p>
        <h3 className="fata-compare-title">{row.beforeTitle}</h3>
        <p className="fata-compare-copy">{row.beforeText}</p>
      </div>
      <div className="fata-compare-rule" />
      <div className="fata-compare-cell fata-compare-cell--after">
        <Scribble />
        <p className="fata-kicker">Стало</p>
        <h3 className="fata-compare-title">{row.afterTitle}</h3>
        <p className="fata-compare-copy">{row.afterText}</p>
      </div>
    </div>
  );
}

function FataLogo({
  className = "fata-logo",
  src = "/landing/logo.svg",
}: {
  className?: string;
  src?: string;
}) {
  return (
    <Link href="/" className={className} aria-label="fata.studio">
      <img src={src} alt="fata.studio" width={154} height={32} />
    </Link>
  );
}

function HeroCta({ className }: { className: string }) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const loggedIn = Boolean(hydrated && user);

  return (
    <Link
      href={loggedIn && user ? getHomePath(user.role) : "/register"}
      className={className}
    >
      {loggedIn ? "Кабінет" : "Розпочати"}
    </Link>
  );
}

function HeroArtboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const photoMediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const tagline = section.querySelector(".fata-tagline");
          const titleYou = section.querySelector(".fata-title-you");
          const titleFill = section.querySelector(".fata-title-fill");
          const titleSans = section.querySelector(".fata-title-sans");
          const desc = section.querySelector(".fata-desc");
          const cta = section.querySelector(".fata-cta");
          const text = textRef.current;
          const photo = photoRef.current;
          const photoMedia = photoMediaRef.current;
          if (
            !tagline ||
            !titleYou ||
            !titleFill ||
            !titleSans ||
            !desc ||
            !cta ||
            !text ||
            !photo ||
            !photoMedia
          ) {
            return;
          }

          const textBits = [tagline, titleYou, titleFill, titleSans, desc, cta];

          gsap.set(textBits, { opacity: 0, y: 36 });
          gsap.set(photoMedia, {
            opacity: 0,
            x: 72,
            scale: 1.06,
            transformOrigin: "50% 60%",
            force3D: true,
          });
          gsap.set(text, { x: 0, force3D: true });
          gsap.set(photo, { x: 0, force3D: true });

          const enter = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => section.classList.add("is-ready"),
          });

          enter
            .to(tagline, { opacity: 1, y: 0, duration: 0.7 })
            .to(titleYou, { opacity: 1, y: 0, duration: 0.75 }, "-=0.45")
            .to(
              titleFill,
              { opacity: 1, y: 0, duration: 0.85, ease: "power2.out" },
              "-=0.55",
            )
            .to(titleSans, { opacity: 1, y: 0, duration: 0.75 }, "-=0.55")
            .to(desc, { opacity: 1, y: 0, duration: 0.7 }, "-=0.45")
            .to(cta, { opacity: 1, y: 0, duration: 0.65 }, "-=0.5")
            .to(
              photoMedia,
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 1.15,
                ease: "power3.out",
              },
              0.28,
            );

          const scrollOut = {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.55,
            invalidateOnRefresh: true,
          };

          gsap.to(text, {
            x: () => Math.round(Math.min(window.innerWidth * 0.18, 220)),
            ease: "none",
            scrollTrigger: scrollOut,
          });

          gsap.to(photo, {
            x: () => Math.round(photo.offsetWidth * 1.2 + 96),
            ease: "none",
            scrollTrigger: { ...scrollOut },
          });

          const onLoad = () => ScrollTrigger.refresh();
          window.addEventListener("load", onLoad);
          return () => window.removeEventListener("load", onLoad);
        },
      );

      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const kicker = section.querySelector(".fata-m-kicker");
          const title = section.querySelector(".fata-m-title");
          const desc = section.querySelector(".fata-m-desc");
          const photo = section.querySelector(".fata-m-photo");
          const cta = section.querySelector(".fata-m-cta");
          if (!kicker || !title || !desc || !photo || !cta) return;

          const bits = [kicker, title, desc, photo, cta];
          gsap.set(bits, { opacity: 0, y: 28 });

          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              onComplete: () => section.classList.add("is-ready"),
            })
            .to(kicker, { opacity: 1, y: 0, duration: 0.65 })
            .to(title, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4")
            .to(desc, { opacity: 1, y: 0, duration: 0.65 }, "-=0.45")
            .to(photo, { opacity: 1, y: 0, duration: 0.85 }, "-=0.4")
            .to(cta, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5");
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        section.classList.add("is-ready");
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="fata-hero">
      <div className="fata-hero-stage hidden min-[1024px]:block">
        <div className="fata-hero-board">
          <div className="fata-hero-main">
            <div ref={textRef} className="fata-hero-main-text">
              <p className="fata-tagline">
                Єдина платформа <em>для всіх весільних завдань</em>
              </p>
              <h1 className="fata-title">
                <span className="fata-title-serif">
                  <span className="fata-title-you">Ваше</span>{" "}
                  <span className="fata-title-fill">ВЕСІЛЛЯ</span>
                </span>
                <span className="fata-title-sans">починається тут</span>
              </h1>
              <p className="fata-desc">
                Плануйте бюджет, запрошуйте гостей, малюйте розсадку, ведіть списки
                справ, контролюйте таймлайни — усе вдвох, в одному місці і без
                зайвого стресу.
              </p>
              <Link href="/register" className="fata-cta">
                Розпочати
              </Link>
            </div>
            <div ref={photoRef} className="fata-photo">
              <div ref={photoMediaRef} className="fata-photo-media">
                <Image
                  src="/landing/hero-photo.jpg"
                  alt="Сукня нареченої"
                  fill
                  priority
                  sizes="555px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fata-hero-mobile min-[1024px]:!hidden">
        <div className="fata-m-main">
          <p className="fata-m-kicker">
            Єдина платформа <em>для всіх весільних завдань</em>
          </p>
          <h1 className="fata-m-title">
            <span className="fata-m-top">
              <span className="fata-m-you">Ваше</span>
              <span className="fata-m-fill">ВЕСІЛЛЯ</span>
            </span>
            <span className="fata-m-sans">починається тут</span>
          </h1>
          <p className="fata-m-desc">
            Плануйте бюджет, запрошуйте гостей, малюйте розсадку, ведіть списки
            справ, контролюйте таймлайни — усе вдвох, в одному місці і без
            зайвого стресу.
          </p>
          <div className="fata-m-photo">
            <Image
              src="/landing/hero-photo.jpg"
              alt="Сукня нареченої"
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 555px"
              priority
            />
          </div>
          <HeroCta className="fata-m-cta" />
        </div>
      </div>
    </section>
  );
}

export function HomeLanding() {
  useHomeSmoothScroll();

  return (
    <div className="fata-page">
      <HeroArtboard />

      <section className="fata-sec2">
        <div className="fata-sec2-photos">
          <RevealPhoto>
            <Image src="/landing/compare-1.jpg" alt="" fill sizes="42vw" />
          </RevealPhoto>

          <RevealPhoto>
            <Image src="/landing/compare-2.jpg" alt="" fill sizes="42vw" />
          </RevealPhoto>

          <RevealPhoto>
            <Image src="/landing/compare-2.jpg" alt="" fill sizes="42vw" />
          </RevealPhoto>
        </div>
        <div className="fata-sec2-body">
          <div className="fata-sec2-body-wrap">
            <RevealCompareIntro>
              Ми змінюємо хаос і нерви на упорядковану спокійну організацію
              весілля:
            </RevealCompareIntro>
            <div className="fata-sec2-pairs">
              {DARK_ROWS.map((row) => (
                <ComparePair key={row.afterTitle} row={row} />
              ))}
            </div>
          </div>
        </div>
        <div className="fata-sec2-body is-light">
          <div className="fata-sec2-body-wrap">
            <div className="fata-sec2-pairs">
              {LIGHT_ROWS.slice(0, 2).map((row) => (
                <ComparePair key={row.afterTitle} row={row} />
              ))}
            </div>
            <RevealPhoto className="fata-sec2-breakphoto">
              <Image
                src="/landing/compare-2.jpg"
                alt=""
                fill
                sizes="100vw"
              />
            </RevealPhoto>
            <div className="fata-sec2-pairs is-last">
              {LIGHT_ROWS.slice(2).map((row) => (
                <ComparePair key={row.afterTitle} row={row} />
              ))}
            </div>
          </div>
        </div>
      </section>


      <MobileAppSection />

      <FeaturesStack />

      <Prefooter />

      <footer className="fata-foot">
        <div className="fata-shell fata-foot-inner">
          <div className="fata-foot-top">
            <div className="fata-foot-brand">
              <FataLogo src="/landing/logo-foot.svg" />
              <p>Сучасний інструмент для планування весілля</p>
            </div>
            <div>
              <h4>Продукт</h4>
              {FOOT_PRODUCT.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <h4>Компанія</h4>
              <Link href="/content">Про нас</Link>
              <Link href="/content">Ідеї</Link>
              <Link href="/content">Контакти</Link>
            </div>
            <div>
              <h4>Підтримка</h4>
              <Link href="/content">Допомога</Link>
              <Link href="/content">Умови використання</Link>
              <Link href="/content">Політика конфіденційності</Link>
              <Link href="/content">Зворотний зв’язок</Link>
            </div>
          </div>
          <div className="fata-foot-line" />
          <div className="fata-foot-bottom">
            <span>© 2026 fata.studio. Усі права захищені.</span>
            <span className="fata-foot-social">
              <a href="https://instagram.com" aria-label="Instagram">
                <img src="/landing/cloud/ig.svg" alt="" width={20} height={20} />
              </a>
              <a href="https://facebook.com" aria-label="Facebook">
                <img src="/landing/cloud/fb.svg" alt="" width={20} height={20} />
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
