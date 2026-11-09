
import { useLayoutEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import "./Hero.css";

type HeroProps = {
  ready: boolean;
  sequenceActive: boolean;
  replayKey: number;
};

const WORD = "EXPERIENCES.";

export default function Hero({
  ready,
  sequenceActive,
  replayKey,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const hoverRef = useRef<gsap.core.Timeline | null>(null);
  const introDone = useRef(false);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const intro = hero.querySelectorAll<HTMLElement>(
        "[data-hero-reveal]"
      );

      const letters = hero.querySelectorAll<HTMLElement>(
        ".hero-experience-letter"
      );

      const underline = hero.querySelector<HTMLElement>(
        ".hero-experience-underline"
      );

      introDone.current = false;

      if (!ready || sequenceActive) {
        gsap.set(intro, { autoAlpha: 0, y: 20 });
        gsap.set(letters, { autoAlpha: 0, yPercent: 100 });
        gsap.set(underline, { scaleX: 0 });
        return;
      }

      if (reducedMotion) {
        gsap.set(intro, { autoAlpha: 1, y: 0 });
        gsap.set(letters, { autoAlpha: 1, yPercent: 0 });
        gsap.set(underline, { scaleX: 1 });
        introDone.current = true;
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          introDone.current = true;
        },
      });

      tl.fromTo(
        intro,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
        }
      );

      tl.fromTo(
        letters,
        { autoAlpha: 0, yPercent: 100 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.9,
          stagger: 0.045,
          ease: "expo.out",
        },
        0.3
      );

      tl.fromTo(
        underline,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.7,
          ease: "power3.inOut",
        },
        1
      );
    }, hero);

    return () => {
      introDone.current = false;
      hoverRef.current?.kill();
      ctx.revert();
    };
  }, [ready, sequenceActive, replayKey]);

  const bounceExperience = () => {
    if (!ready || sequenceActive || !introDone.current) {
      return;
    }

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const word = wordRef.current;
    if (!word) return;

    const letters = word.querySelectorAll<HTMLElement>(
      ".hero-experience-letter"
    );

    hoverRef.current?.kill();

    gsap.set(letters, { y: 0, scaleY: 1 });

    const tl = gsap.timeline();

    tl.to(letters, {
      y: -20,
      scaleY: 1.1,
      duration: 0.25,
      stagger: 0.045,
      ease: "power2.out",
    });

    tl.to(
      letters,
      {
        y: 0,
        scaleY: 1,
        duration: 0.65,
        stagger: 0.045,
        ease: "bounce.out",
      },
      0.18
    );

    hoverRef.current = tl;
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="hero hero-cinematic"
    >
      <div className="hero-cinematic-bg" aria-hidden="true" />
      <div className="hero-cinematic-shade" aria-hidden="true" />

      <div className="hero-cinematic-inner">
        <div
          className="hero-cinematic-identity"
          data-hero-reveal
        >
          <span>CORNÉ CARELSE</span>
          <span className="hero-identity-slash">/</span>
          <span className="hero-role">REACT DEVELOPER</span>
        </div>

        <div className="hero-cinematic-content">
          <h1 className="hero-cinematic-title">
            <span className="hero-title-row">
              <span data-hero-reveal>I BUILD</span>
            </span>

            <span className="hero-title-row">
              <span data-hero-reveal>DIGITAL</span>
            </span>

            <span className="hero-title-row hero-experience-row">
              <span
                ref={wordRef}
                className="hero-experience-word"
                aria-label={WORD}
                onMouseEnter={bounceExperience}
              >
                {Array.from(WORD).map((letter, index) => (
                  <span
                    className="hero-experience-letter"
                    aria-hidden="true"
                    key={index}
                  >
                    {letter}
                  </span>
                ))}
              </span>

              <span
                className="hero-experience-underline"
                aria-hidden="true"
              />
            </span>
          </h1>

          <p
            className="hero-cinematic-description"
            data-hero-reveal
          >
            I turn ambitious ideas into fast, expressive,
            and unforgettable web experiences.
          </p>

          <div
            className="hero-cinematic-actions"
            data-hero-reveal
          >
            <a
              href="#projects"
              className="hero-cinematic-primary"
            >
              EXPLORE MY WORK
              <ArrowUpRight size={19} />
            </a>

            <a
              href="#contact"
              className="hero-cinematic-secondary"
            >
              LET&apos;S TALK
              <ArrowUpRight size={19} />
            </a>
          </div>
        </div>

        <div
          className="hero-cinematic-footer"
          data-hero-reveal
        >
          <a
            href="#projects"
            className="hero-cinematic-scroll"
          >
            SCROLL TO EXPLORE
            <ArrowDownRight size={19} />
          </a>

          <span className="hero-cinematic-location">
            SOUTH AFRICA / AVAILABLE WORLDWIDE
          </span>
        </div>
      </div>
    </section>
  );
}
