
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import CinematicIntro from "./components/CinematicIntro/ccinematicIntro";
import CrimsonTransition from "./components/CrimsonTransition/CrimsonTransition";
import FloatingNav from "./components/FloatingNav/FloatingNav";
import Hero from "./sections/Hero/Hero.tsx";
import PortfolioSections from "./sections/PortfolioSections/PortfolioSections";
import ProjectPage from "./pages/ProjectPage/ProjectPage";

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

function scrollToTopImmediately() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [introMode, setIntroMode] =
    useState<IntroMode>(getInitialIntroMode);

  const [transitioning, setTransitioning] =
    useState(false);

  const [heroReady, setHeroReady] = useState(
    () => getInitialIntroMode() === null
  );

  const [replayKey, setReplayKey] = useState(0);

  const sequenceActive =
    isHome && (introMode !== null || transitioning);

  useLayoutEffect(() => {
    const previousRestoration =
      window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";

    if (isHome) {
      scrollToTopImmediately();
    }

    return () => {
      window.history.scrollRestoration =
        previousRestoration;
    };
  }, [isHome]);

  useEffect(() => {
    if (!isHome || sequenceActive || !location.hash) {
      return;
    }

    const id = location.hash.slice(1);

    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [isHome, location.hash, sequenceActive]);

  useEffect(() => {
    if (!sequenceActive) return;

    scrollToTopImmediately();

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sequenceActive]);

  const finishIntro = useCallback(() => {
    scrollToTopImmediately();

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
    scrollToTopImmediately();
    setHeroReady(true);
  }, []);

  const completeTransition = useCallback(() => {
    scrollToTopImmediately();
    setHeroReady(true);
    setTransitioning(false);
  }, []);

  const replayIntro = useCallback(() => {
    scrollToTopImmediately();

    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + window.location.search
      );
    }

    setHeroReady(false);
    setTransitioning(false);
    setReplayKey((key) => key + 1);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    setIntroMode(reduced ? "reduced" : "full");
  }, []);

  return (
    <>
      {sequenceActive && (
        <div
          className="cinematic-blackout"
          aria-hidden="true"
        />
      )}

      {isHome && introMode !== null && (
        <CinematicIntro
          key={replayKey}
          mode={introMode}
          onComplete={finishIntro}
        />
      )}

      {isHome && transitioning && (
        <CrimsonTransition
          key={replayKey}
          onReveal={revealHero}
          onComplete={completeTransition}
        />
      )}

      <FloatingNav
        hidden={sequenceActive}
        onReplay={isHome ? replayIntro : undefined}
      />

      <Routes>
        <Route
          path="/"
          element={
            <main
              className={`portfolio ${
                sequenceActive && !heroReady
                  ? "portfolio-waiting"
                  : ""
              }`}
            >
              <Hero
                ready={heroReady}
                sequenceActive={sequenceActive}
                replayKey={replayKey}
              />

              <PortfolioSections />
            </main>
          }
        />

        <Route
          path="/projects/:slug"
          element={<ProjectPage />}
        />

        <Route
          path="*"
          element={<ProjectPage />}
        />
      </Routes>
    </>
  );
}

export default App;
