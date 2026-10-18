
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { PointerEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import gsap from "gsap";
import CinematicIntro from "./components/CinematicIntro/ccinematicIntro";
import CrimsonTransition from "./components/CrimsonTransition/CrimsonTransition";

type IntroMode = "full" | "reduced" | null;

const ALWAYS_PLAY_INTRO_IN_DEV = true;
const SEEN_KEY = "corne-portfolio-intro-seen";

function getInitialIntroMode(): IntroMode {
  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (ALWAYS_PLAY_INTRO_IN_DEV && import.meta.env.DEV) {
    return reduced ? "reduced" : "full";
  }

  try {
    if (sessionStorage.getItem(SEEN_KEY) === "true") {
      return null;
    }
  } catch {
    return reduced ? "reduced" : "full";
  }

  return reduced ? "reduced" : "full";
}

function App() {
  const [introMode, setIntroMode] =
    useState<IntroMode>(getInitialIntroMode);

  const [transitioning, setTransitioning] =
    useState(false);

  const [heroReady, setHeroReady] =
    useState(false);

  const [replayKey, setReplayKey] =
    useState(0);

  const heroRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false);

  const sequenceActive =
    introMode !== null || transitioning;

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "true");
    } catch {
      // Session storage is optional.
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      setIntroMode(null);
      setTransitioning(false);
      setHeroReady(true);
      return;
    }

    setTransitioning(true);
    setIntroMode(null);
  }, []);

  const revealHero = useCallback(() => {
    setHeroReady(true);
  }, []);

  const completeTransition = useCallback(() => {
    setHeroReady(true);
    setTransitioning(false);
  }, []);

  const replayIntro = useCallback(() => {
    hasAnimatedRef.current = false;

    setHeroReady(false);
    setTransitioning(false);
    setReplayKey((key) => key + 1);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setIntroMode(reduced ? "reduced" : "full");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    if (!sequenceActive) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sequenceActive]);

  useEffect(() => {
    if (!sequenceActive && !heroReady) {
      setHeroReady(true);
    }
  }, [sequenceActive, heroReady]);

  useEffect(() => {
    if (!heroReady || hasAnimatedRef.current) {
      return;
    }

    const hero = heroRef.current;
    const header = headerRef.current;

    if (!hero || !header) return;

    hasAnimatedRef.current = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targets = [
      header,
      ...Array.from(
        hero.querySelectorAll<HTMLElement>("[data-reveal]")
      ),
    ];

    if (reduced) {
      gsap.set(targets, {
        opacity: 1,
        y: 0,
        clearProps: "filter",
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: 65,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.13,
          ease: "power3.out",
          clearProps: "filter,transform,opacity",
        }
      );
    });

    return () => ctx.revert();
  }, [heroReady]);

  const moveSpotlight = (
    event: PointerEvent<HTMLElement>
  ) => {
    const bounds =
      event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty(
      "--mouse-x",
      `${event.clientX - bounds.left}px`
    );

    event.currentTarget.style.setProperty(
      "--mouse-y",
      `${event.clientY - bounds.top}px`
    );
  };

  return (
    <>
      {sequenceActive && (
        <div
          className="cinematic-blackout"
          aria-hidden="true"
        />
      )}

      {introMode !== null && (
        <CinematicIntro
          key={replayKey}
          mode={introMode}
          onComplete={finishIntro}
        />
      )}

      {transitioning && (
        <CrimsonTransition
          key={replayKey}
          onReveal={revealHero}
          onComplete={completeTransition}
        />
      )}

      <main
        className={`portfolio ${
          sequenceActive && !heroReady
            ? "portfolio-waiting"
            : ""
        }`}
      >
        <header
          ref={headerRef}
          className="site-header"
        >
          <a
            href="#home"
            className="site-logo"
            aria-label="Corné Carelse home"
          >
            C<span>.</span>
          </a>

          <nav
            className="site-nav"
            aria-label="Main navigation"
          >
            <a href="#home">HOME</a>
            <a href="#work">PROJECTS</a>
            <a href="#contact">CONTACT</a>
          </nav>

          <div className="header-actions">
            <div className="header-status">
              <span className="status-dot" />
              AVAILABLE FOR OPPORTUNITIES
            </div>

            <button
              className="header-replay"
              type="button"
              onClick={replayIntro}
              aria-label="Replay cinematic introduction"
            >
              <RotateCcw size={15} />
              <span>REPLAY INTRO</span>
            </button>

            <a
              className="header-contact"
              href="#contact"
            >
              LET'S TALK
              <ArrowUpRight size={15} />
            </a>
          </div>
        </header>

        <section
          id="home"
          ref={heroRef}
          className="hero"
          onPointerMove={moveSpotlight}
        >
          <div
            className="hero-glow"
            aria-hidden="true"
          />

          <div
            className="hero-spotlight"
            aria-hidden="true"
          />

          <div
            className="hero-art"
            aria-hidden="true"
          >
            <div className="hero-art-ring" />
            <div className="hero-art-core" />
          </div>

          <div className="hero-content">
            <p
              className="hero-overline"
              data-reveal
            >
              <span className="hero-index">
                01 / INTRODUCTION
              </span>

              <span className="hero-line" />

              REACT DEVELOPER
            </p>

            <h1 className="hero-title">
              <span className="hero-title-mask">
                <span data-reveal>
                  I BUILD
                </span>
              </span>

              <span className="hero-title-mask">
                <span data-reveal>
                  DIGITAL
                </span>
              </span>

              <span className="hero-title-mask">
                <span
                  className="hero-title-accent"
                  data-reveal
                >
                  EXPERIENCES.
                </span>
              </span>
            </h1>

            <p
              className="hero-description"
              data-reveal
            >
              I'm Corné Carelse, a React developer
              crafting high-performance, interactive
              experiences for the modern web.
            </p>

            <div
              className="hero-ctas"
              data-reveal
            >
              <a
                className="hero-primary"
                href="#work"
              >
                VIEW MY WORK
                <ArrowUpRight size={17} />
              </a>

              <a
                className="hero-secondary"
                href="#contact"
              >
                GET IN TOUCH
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div
              className="hero-bottom"
              data-reveal
            >
              <span className="hero-scroll">
                SCROLL TO EXPLORE
                <ArrowDownRight size={18} />
              </span>

              <span>
                SOUTH AFRICA / 2026
              </span>
            </div>
          </div>
        </section>

        <section
          className="next-section"
          id="work"
        >
          <span className="section-kicker">
            02 / SELECTED WORK
          </span>

          <h2>
            SELECTED <span>PROJECTS.</span>
          </h2>

          <p>
            My projects are coming into focus.
            The next phase will bring these case
            studies to life.
          </p>
        </section>

        <section
          className="next-section contact-section"
          id="contact"
        >
          <span className="section-kicker">
            03 / CONTACT
          </span>

          <h2>
            LET'S BUILD <span>TOGETHER.</span>
          </h2>

          <p>
            Interested in collaborating?
            Let's connect.
          </p>
        </section>
      </main>
    </>
  );
}

export default App;
