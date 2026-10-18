
import {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import type {
  PointerEvent,
  RefObject,
} from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";

import ObsidianCore from "../../components/ObsidianCore/ObsidianCore";

import "./Hero.css";
import "./HeroCosmos.css";

type HeroProps = {
  ready: boolean;
  sequenceActive: boolean;
  replayKey: number;
};

type PointerPosition = {
  x: number;
  y: number;
  inside: boolean;
};

const CRIMSON_WORD = "EXPERIENCES.";

function CrimsonStarfield({
  active,
  pointerRef,
}: {
  active: boolean;
  pointerRef: RefObject<PointerPosition>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const coarsePointer = window.matchMedia(
      "(pointer: coarse)"
    ).matches;

    type Star = {
      x: number;
      y: number;
      radius: number;
      depth: number;
      phase: number;
      speed: number;
      alpha: number;
    };

    type Trail = {
      x: number;
      y: number;
      life: number;
      radius: number;
    };

    let stars: Star[] = [];
    let trails: Trail[] = [];

    let width = 1;
    let height = 1;
    let frame = 0;
    let lastTime = 0;
    let previousPointerX = -1000;
    let previousPointerY = -1000;
    let visible = true;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();

      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);

      const ratio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);

      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(
        250,
        Math.max(75, Math.floor((width * height) / 5600))
      );

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.35 + Math.random() * 1.3,
        depth: 0.25 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.85,
        alpha: 0.16 + Math.random() * 0.58,
      }));

      trails = [];
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const onVisibilityChange = () => {
      visible = !document.hidden;
      lastTime = 0;
    };

    document.addEventListener(
      "visibilitychange",
      onVisibilityChange
    );

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);

      if (!visible) return;

      const dt = lastTime
        ? Math.min((time - lastTime) / 16.667, 2)
        : 1;

      lastTime = time;

      context.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;

      const offsetX =
        pointer.inside && !coarsePointer
          ? (pointer.x - 0.5) * 17
          : 0;

      const offsetY =
        pointer.inside && !coarsePointer
          ? (pointer.y - 0.5) * 17
          : 0;

      for (const star of stars) {
        const twinkle = reducedMotion
          ? 0.8
          : 0.65 +
            0.35 *
              Math.sin(
                time * 0.001 * star.speed + star.phase
              );

        const x = star.x + offsetX * star.depth;
        const y = star.y + offsetY * star.depth;
        const alpha = star.alpha * twinkle;

        context.beginPath();
        context.arc(
          x,
          y,
          star.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle = `rgba(255,48,79,${alpha})`;
        context.fill();

        if (star.radius > 1.05) {
          context.beginPath();
          context.arc(
            x,
            y,
            star.radius * 3,
            0,
            Math.PI * 2
          );

          context.fillStyle = `rgba(255,48,79,${
            alpha * 0.075
          })`;

          context.fill();
        }
      }

      if (
        active &&
        pointer.inside &&
        !reducedMotion &&
        !coarsePointer
      ) {
        const x = pointer.x * width;
        const y = pointer.y * height;

        const distance = Math.hypot(
          x - previousPointerX,
          y - previousPointerY
        );

        if (distance > 7) {
          trails.push({
            x,
            y,
            life: 1,
            radius: 1 + Math.random() * 1.7,
          });

          previousPointerX = x;
          previousPointerY = y;
        }
      }

      if (!reducedMotion) {
        for (
          let index = trails.length - 1;
          index >= 0;
          index--
        ) {
          const particle = trails[index];

          particle.life -= 0.035 * dt;

          if (particle.life <= 0) {
            trails.splice(index, 1);
            continue;
          }

          context.beginPath();
          context.arc(
            particle.x,
            particle.y,
            particle.radius * particle.life,
            0,
            Math.PI * 2
          );

          context.fillStyle = `rgba(255,48,79,${
            particle.life * 0.55
          })`;

          context.shadowColor = "#ff304f";
          context.shadowBlur = 10 * particle.life;
          context.fill();
          context.shadowBlur = 0;
        }

        if (trails.length > 32) {
          trails.splice(0, trails.length - 32);
        }
      }
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();

      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );
    };
  }, [active, pointerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="hero-cosmos-starfield"
      aria-hidden="true"
    />
  );
}

function AnimatedCrimsonWord({
  wordRef,
  onPointerMove,
  onPointerLeave,
}: {
  wordRef: RefObject<HTMLSpanElement | null>;
  onPointerMove: (
    event: PointerEvent<HTMLSpanElement>
  ) => void;
  onPointerLeave: () => void;
}) {
  return (
    <span
      ref={wordRef}
      className="hero-title-accent hero-crimson-word"
      aria-label={CRIMSON_WORD}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <span
        className="hero-crimson-letters"
        aria-hidden="true"
      >
        {Array.from(CRIMSON_WORD).map(
          (letter, index) => (
            <span
              className="hero-crimson-letter-wrap"
              key={`${letter}-${index}`}
            >
              <span
                className="hero-crimson-letter"
                data-crimson-letter
              >
                {letter}
              </span>
            </span>
          )
        )}
      </span>

      <span
        className="hero-crimson-sweep"
        aria-hidden="true"
      />
    </span>
  );
}

export default function Hero({
  ready,
  sequenceActive,
  replayKey,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const coreWrapperRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const crimsonWordRef = useRef<HTMLSpanElement>(null);

  const wordActiveRef = useRef(false);
  const wordHoverRef = useRef(false);

  const pointerRef = useRef<PointerPosition>({
    x: 0.5,
    y: 0.5,
    inside: false,
  });

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const core = coreWrapperRef.current;
    const veil = veilRef.current;
    const word = crimsonWordRef.current;

    if (!hero || !core || !veil || !word) return;

    const targets = Array.from(
      hero.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    const letters = Array.from(
      word.querySelectorAll<HTMLElement>(
        "[data-crimson-letter]"
      )
    );

    const sweep = word.querySelector<HTMLElement>(
      ".hero-crimson-sweep"
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    wordActiveRef.current = false;

    gsap.killTweensOf([
      ...targets,
      ...letters,
      core,
      veil,
      word,
      sweep,
    ]);

    if (!ready) {
      gsap.set(targets, {
        autoAlpha: 0,
        y: 36,
      });

      gsap.set(core, {
        autoAlpha: 0,
      });

      gsap.set(veil, {
        autoAlpha: 1,
      });

      gsap.set(word, {
        autoAlpha: 0,
      });

      gsap.set(letters, {
        yPercent: 115,
        rotateX: -75,
        opacity: 0,
      });

      return;
    }

    if (reducedMotion) {
      gsap.set(targets, {
        autoAlpha: 1,
        y: 0,
        clearProps: "filter",
      });

      gsap.set(core, {
        autoAlpha: 1,
        clearProps: "filter,scale,rotation",
      });

      gsap.set(veil, {
        autoAlpha: 0,
      });

      gsap.set(word, {
        autoAlpha: 1,
      });

      gsap.set(letters, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        clearProps: "filter",
      });

      if (sweep) {
        gsap.set(sweep, {
          autoAlpha: 0,
        });
      }

      wordActiveRef.current = true;
      return;
    }

    const context = gsap.context(() => {
      gsap.set(targets, {
        autoAlpha: 0,
        y: 36,
        filter: "blur(7px)",
      });

      gsap.set(core, {
        autoAlpha: 0,
        filter: "brightness(0.25) blur(12px)",
      });

      gsap.set(veil, {
        autoAlpha: 1,
      });

      gsap.set(word, {
        autoAlpha: 0,
      });

      gsap.set(letters, {
        yPercent: 115,
        rotateX: -75,
        skewX: -10,
        scaleY: 1.3,
        opacity: 0,
        filter: "blur(10px)",
        transformOrigin: "50% 100%",
      });

      if (sweep) {
        gsap.set(sweep, {
          autoAlpha: 0,
          xPercent: -130,
        });
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Original cinematic hero reveal.
      timeline.to(
        veil,
        {
          autoAlpha: 0,
          duration: 1.4,
          ease: "power2.inOut",
        },
        0.05
      );

      timeline.to(
        core,
        {
          autoAlpha: 1,
          filter: "brightness(1) blur(0px)",
          duration: 1.65,
          ease: "power2.out",
        },
        0.2
      );

      if (targets[0]) {
        timeline.to(
          targets[0],
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.85,
          },
          0.55
        );
      }

      // "I BUILD" and "DIGITAL" reveal first.
      timeline.to(
        targets.slice(1, 3),
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.05,
          stagger: 0.16,
        },
        0.72
      );

      // Reveal the crimson word container.
      timeline.set(
        word,
        {
          autoAlpha: 1,
        },
        1.25
      );

      // Each letter rises, de-blurs and straightens.
      timeline.to(
        letters,
        {
          yPercent: 0,
          rotateX: 0,
          skewX: 0,
          scaleY: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.95,
          stagger: 0.065,
          ease: "back.out(1.25)",
        },
        1.3
      );

      // Micro-distortion settles.
      timeline.fromTo(
        letters,
        {
          scaleX: 1.045,
        },
        {
          scaleX: 1,
          duration: 0.32,
          stagger: 0.035,
          ease: "power2.out",
        },
        1.95
      );

      // Crimson light sweep.
      if (sweep) {
        timeline.to(
          sweep,
          {
            autoAlpha: 1,
            duration: 0.1,
          },
          2.05
        );

        timeline.fromTo(
          sweep,
          {
            xPercent: -130,
          },
          {
            xPercent: 140,
            duration: 0.95,
            ease: "power2.inOut",
          },
          2.05
        );

        timeline.to(
          sweep,
          {
            autoAlpha: 0,
            duration: 0.25,
          },
          2.75
        );
      }

      timeline.to(
        targets.slice(3),
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.13,
        },
        2.0
      );

      timeline.call(
        () => {
          wordActiveRef.current = true;
        },
        [],
        2.75
      );
    }, hero);

    return () => {
      wordActiveRef.current = false;
      context.revert();
    };
  }, [ready, replayKey]);

  // Subtle mouse interaction with individual letters.
  const handleWordPointerMove = (
    event: PointerEvent<HTMLSpanElement>
  ) => {
    if (
      !wordActiveRef.current ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const word = crimsonWordRef.current;
    if (!word) return;

    wordHoverRef.current = true;

    const letters = Array.from(
      word.querySelectorAll<HTMLElement>(
        "[data-crimson-letter]"
      )
    );

    for (const letter of letters) {
      const bounds = letter.getBoundingClientRect();

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const distance = Math.hypot(
        event.clientX - centerX,
        event.clientY - centerY
      );

      const influence = Math.max(
        0,
        1 - distance / 135
      );

      gsap.to(letter, {
        y: -influence * 11,
        rotation: influence * -2,
        scale: 1 + influence * 0.055,
        textShadow:
          influence > 0.05
            ? `0 0 ${Math.round(
                influence * 25
              )}px rgba(255,48,79,${
                influence * 0.65
              })`
            : "0 0 0px rgba(255,48,79,0)",
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const resetWordLetters = () => {
    if (!wordHoverRef.current) return;

    wordHoverRef.current = false;

    const word = crimsonWordRef.current;
    if (!word) return;

    const letters = word.querySelectorAll(
      "[data-crimson-letter]"
    );

    gsap.to(letters, {
      y: 0,
      rotation: 0,
      scale: 1,
      textShadow: "0 0 0px rgba(255,48,79,0)",
      duration: 0.65,
      stagger: 0.025,
      ease: "elastic.out(1, 0.6)",
      overwrite: "auto",
    });
  };

  const moveSpotlight = (
    event: PointerEvent<HTMLElement>
  ) => {
    const bounds =
      event.currentTarget.getBoundingClientRect();

    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    pointerRef.current.x = Math.min(
      1,
      Math.max(0, x / bounds.width)
    );

    pointerRef.current.y = Math.min(
      1,
      Math.max(0, y / bounds.height)
    );

    pointerRef.current.inside = true;

    event.currentTarget.style.setProperty(
      "--mouse-x",
      `${x}px`
    );

    event.currentTarget.style.setProperty(
      "--mouse-y",
      `${y}px`
    );
  };

  const resetPointer = () => {
    pointerRef.current.inside = false;
    pointerRef.current.x = 0.5;
    pointerRef.current.y = 0.5;
    resetWordLetters();
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero hero-obsidian hero-refined hero-cosmos"
      onPointerMove={moveSpotlight}
      onPointerLeave={resetPointer}
    >
      <CrimsonStarfield
        active={ready && !sequenceActive}
        pointerRef={pointerRef}
      />

      <div className="hero-glow" aria-hidden="true" />

      <div
        className="hero-spotlight"
        aria-hidden="true"
      />

      <div
        className="hero-ambient-lines"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>

      <div
        ref={coreWrapperRef}
        className="hero-obsidian-stage"
        style={{ opacity: 0 }}
      >
        <ObsidianCore
          active={ready && !sequenceActive}
          pointerRef={pointerRef}
        />
      </div>

      <div
        className="hero-obsidian-vignette"
        aria-hidden="true"
      />

      <div
        ref={veilRef}
        className="hero-reveal-veil"
        aria-hidden="true"
        style={{ opacity: 1 }}
      />

      <div className="hero-content">
        <div
          className="hero-identity"
          data-reveal
          style={{ opacity: 0 }}
        >
          <span className="hero-identity-index">
            01 / INTRODUCTION
          </span>

          <span className="hero-identity-rule" />

          <span className="hero-identity-name">
            CORNÉ CARELSE
          </span>

          <span className="hero-identity-divider">
            /
          </span>

          <span className="hero-identity-role">
            REACT DEVELOPER
          </span>
        </div>

        <h1 className="hero-title">
          <span className="hero-title-mask">
            <span data-reveal style={{ opacity: 0 }}>
              I BUILD
            </span>
          </span>

          <span className="hero-title-mask">
            <span data-reveal style={{ opacity: 0 }}>
              DIGITAL
            </span>
          </span>

          <span className="hero-title-mask">
            <AnimatedCrimsonWord
              wordRef={crimsonWordRef}
              onPointerMove={handleWordPointerMove}
              onPointerLeave={resetWordLetters}
            />
          </span>
        </h1>

        <p
          className="hero-description"
          data-reveal
          style={{ opacity: 0 }}
        >
          I turn ambitious ideas into fast, expressive,
          and unforgettable web experiences.
        </p>

        <div
          className="hero-ctas"
          data-reveal
          style={{ opacity: 0 }}
        >
          <a className="hero-primary" href="#work">
            EXPLORE MY WORK
            <ArrowUpRight size={17} />
          </a>

          <a className="hero-secondary" href="#contact">
            LET'S TALK
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div
          className="hero-bottom"
          data-reveal
          style={{ opacity: 0 }}
        >
          <span className="hero-scroll">
            SCROLL TO EXPLORE
            <ArrowDownRight size={18} />
          </span>

          <span className="hero-location">
            SOUTH AFRICA / AVAILABLE WORLDWIDE
          </span>
        </div>
      </div>

      <div
        className="hero-side-label"
        aria-hidden="true"
      >
        DESIGN / DEVELOPMENT / INTERACTION
      </div>
    </section>
  );
}
