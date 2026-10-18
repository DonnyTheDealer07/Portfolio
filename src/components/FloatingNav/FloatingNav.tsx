
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  MouseEvent as ReactMouseEvent,
  FocusEvent as ReactFocusEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  FolderKanban,
  House,
  RotateCcw,
  Send,
  UserRound,
  X,
} from "lucide-react";
import gsap from "gsap";
import "./FloatingNav.css";

type Props = {
  hidden?: boolean;
  onReplay?: () => void;
};

type NavItem = {
  number: string;
  label: string;
  hash: string;
  headline: string;
  accent: string;
  description: string;
  icon: typeof House;
};

const navigation: NavItem[] = [
  {
    number: "01",
    label: "HOME",
    hash: "home",
    headline: "THE FIRST",
    accent: "IMPRESSION.",
    description:
      "Return to the cinematic introduction. Where the experience begins.",
    icon: House,
  },
  {
    number: "02",
    label: "ABOUT",
    hash: "about",
    headline: "BEYOND",
    accent: "THE CODE.",
    description:
      "Discover the person, mindset and ambition behind the work.",
    icon: UserRound,
  },
  {
    number: "03",
    label: "EXPERTISE",
    hash: "skills",
    headline: "BUILT WITH",
    accent: "INTENT.",
    description:
      "Explore my technical skills, development tools and certifications.",
    icon: Code2,
  },
  {
    number: "04",
    label: "PROJECTS",
    hash: "work",
    headline: "PROOF IN",
    accent: "THE WORK.",
    description:
      "Explore real applications I've designed and developed.",
    icon: FolderKanban,
  },
  {
    number: "05",
    label: "EXPERIENCE",
    hash: "experience",
    headline: "THE ROAD",
    accent: "SO FAR.",
    description:
      "Follow my professional experience and continued development.",
    icon: BriefcaseBusiness,
  },
  {
    number: "06",
    label: "CONTACT",
    hash: "contact",
    headline: "YOUR NEXT",
    accent: "DEVELOPER.",
    description:
      "Let's discuss remote React and Frontend Developer opportunities.",
    icon: Send,
  },
];

const EXIT_DURATION = 0.8;

function prefersReducedMotion() {
  return window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
}

function KineticLabel({ label }: { label: string }) {
  return (
    <span
      className="cinematic-menu-link-label"
      aria-label={label}
    >
      {Array.from(label).map((letter, index) => (
        <span
          key={`${index}-${letter}`}
          className="cinematic-menu-letter-wrap"
          aria-hidden="true"
        >
          <span className="cinematic-menu-letter">
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function FloatingNav({
  hidden = false,
  onReplay,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [tracker, setTracker] = useState({
    top: 0,
    height: 0,
    visible: false,
  });

  const overlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const replayTimerRef = useRef<number | null>(null);

  const initializedRef = useRef(false);
  const previousOpenRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = navigation[activeIndex];
  const ActiveIcon = activeItem.icon;

  const updateTracker = useCallback((index: number) => {
    const nav = navRef.current;

    if (!nav) return;

    const item = nav.querySelector<HTMLElement>(
      `[data-menu-index="${index}"]`
    );

    if (!item) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    setTracker({
      top: itemRect.top - navRect.top,
      height: itemRect.height,
      visible: true,
    });
  }, []);

  const activateItem = useCallback(
    (index: number) => {
      setActiveIndex(index);
      updateTracker(index);
    },
    [updateTracker]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 65);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (hidden) {
      setOpen(false);
    }
  }, [hidden]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  /*
   * CINEMATIC OPEN / FADE-OUT
   *
   * OPEN:
   *   Two black panels slide into place.
   *   Navigation items reveal in sequence.
   *
   * CLOSE:
   *   Content fades first.
   *   Entire overlay fades to transparent.
   *   Underlying section remains unchanged.
   */

  useEffect(() => {
    const overlay = overlayRef.current;

    if (!overlay) return;

    timelineRef.current?.kill();

    const panels = overlay.querySelectorAll(
      ".cinematic-menu-panel"
    );

    const reveals = overlay.querySelectorAll(
      ".cinematic-menu-reveal"
    );

    const links = overlay.querySelectorAll(
      ".cinematic-menu-link"
    );

    const background = overlay.querySelector(
      ".cinematic-menu-background"
    );

    const reducedMotion = prefersReducedMotion();

    if (reducedMotion) {
      gsap.set(overlay, {
        autoAlpha: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
      });

      gsap.set(panels, {
        xPercent: 0,
      });

      gsap.set([...reveals, ...links], {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
      });

      if (background) {
        gsap.set(background, {
          autoAlpha: 1,
        });
      }

      initializedRef.current = true;
      previousOpenRef.current = open;

      return;
    }

    if (open) {
      gsap.set(overlay, {
        autoAlpha: 1,
        opacity: 1,
        pointerEvents: "auto",
      });

      gsap.set(panels[0], {
        xPercent: -105,
      });

      gsap.set(panels[1], {
        xPercent: 105,
      });

      gsap.set(links, {
        autoAlpha: 0,
        y: 45,
        rotateX: -10,
      });

      gsap.set(reveals, {
        autoAlpha: 0,
        y: 20,
      });

      if (background) {
        gsap.set(background, {
          autoAlpha: 0,
        });
      }

      timelineRef.current = gsap
        .timeline()
        .to(panels, {
          xPercent: 0,
          duration: 0.8,
          ease: "power4.inOut",
        })
        .to(
          background,
          {
            autoAlpha: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          links,
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.055,
            ease: "power3.out",
          },
          "-=0.35"
        )
        .to(
          reveals,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.035,
            ease: "power3.out",
          },
          "-=0.5"
        );

      initializedRef.current = true;
      previousOpenRef.current = true;

      return;
    }

    if (!initializedRef.current) {
      gsap.set(overlay, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

      initializedRef.current = true;
      previousOpenRef.current = false;

      return;
    }

    if (!previousOpenRef.current) {
      return;
    }

    /*
     * CLOSE:
     * Fade navigation and radar, then dissolve
     * the whole overlay.
     *
     * No panel sliding on exit.
     */

    timelineRef.current = gsap
      .timeline({
        onComplete: () => {
          gsap.set(overlay, {
            autoAlpha: 0,
            pointerEvents: "none",
          });
        },
      })
      .to(
        [...links, ...reveals],
        {
          autoAlpha: 0,
          y: -12,
          duration: 0.25,
          ease: "power2.inOut",
          stagger: 0.008,
        },
        0
      )
      .to(
        background,
        {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.inOut",
        },
        0
      )
      .to(
        overlay,
        {
          opacity: 0,
          duration: EXIT_DURATION,
          ease: "power2.inOut",
        },
        0
      )
      .set(overlay, {
        autoAlpha: 0,
        pointerEvents: "none",
      });

    previousOpenRef.current = false;
  }, [open]);

  /*
   * LOCK BACKGROUND SCROLL WHILE MENU IS OPEN.
   *
   * When closing, wait for the fade to finish
   * before restoring page scrolling.
   */

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const overlay = overlayRef.current;
      const toggle = toggleRef.current;

      if (!overlay || !toggle) return;

      const focusable = [
        toggle,
        ...Array.from(
          overlay.querySelectorAll<HTMLElement>(
            'a[href]:not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"])'
          )
        ),
      ].filter((element) => element.getClientRects().length > 0);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    const focusTimer = window.setTimeout(() => {
      toggleRef.current?.focus({
        preventScroll: true,
      });
    }, prefersReducedMotion() ? 0 : 250);

    const resizeObserver = new ResizeObserver(() => {
      updateTracker(activeIndex);
    });

    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    updateTracker(activeIndex);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.clearTimeout(focusTimer);
      resizeObserver.disconnect();

      const restoreDelay = prefersReducedMotion()
        ? 0
        : EXIT_DURATION * 1000;

      window.setTimeout(() => {
        document.body.style.overflow =
          previousBodyOverflow;

        document.documentElement.style.overflow =
          previousHtmlOverflow;
      }, restoreDelay);
    };
  }, [open, activeIndex, updateTracker]);

  /*
   * PREVIEW TRANSITION
   */

  useEffect(() => {
    if (!open || prefersReducedMotion()) return;

    const preview = overlayRef.current?.querySelector(
      ".cinematic-menu-preview-content"
    );

    if (!preview) return;

    gsap.fromTo(
      preview,
      {
        autoAlpha: 0.55,
        y: 13,
        filter: "blur(4px)",
      },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.38,
        ease: "power3.out",
        overwrite: "auto",
      }
    );
  }, [activeIndex, open]);

  /*
   * CLEANUP
   */

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();

      if (navigationTimerRef.current !== null) {
        window.clearTimeout(
          navigationTimerRef.current
        );
      }

      if (replayTimerRef.current !== null) {
        window.clearTimeout(
          replayTimerRef.current
        );
      }
    };
  }, []);

  /*
   * NAVIGATION
   */

  const navigateTo = (hash: string) => {
    setOpen(false);

    if (navigationTimerRef.current !== null) {
      window.clearTimeout(
        navigationTimerRef.current
      );
    }

    const delay = prefersReducedMotion()
      ? 0
      : EXIT_DURATION * 1000 + 50;

    navigationTimerRef.current = window.setTimeout(
      () => {
        if (location.pathname !== "/") {
          navigate(`/#${hash}`);
          return;
        }

        const target = document.getElementById(hash);

        if (target) {
          target.scrollIntoView({
            behavior: prefersReducedMotion()
              ? "instant"
              : "smooth",
            block: "start",
          });

          window.history.replaceState(
            window.history.state,
            "",
            `/#${hash}`
          );
        }
      },
      delay
    );
  };

  const replayIntro = () => {
    if (!onReplay) return;

    setOpen(false);

    if (replayTimerRef.current !== null) {
      window.clearTimeout(
        replayTimerRef.current
      );
    }

    replayTimerRef.current = window.setTimeout(
      onReplay,
      prefersReducedMotion()
        ? 0
        : EXIT_DURATION * 1000 + 50
    );
  };

  /*
   * MAGNETIC ARROWS
   */

  const handleArrowMove = (
    event: ReactMouseEvent<HTMLAnchorElement>
  ) => {
    if (
      prefersReducedMotion() ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const arrow = event.currentTarget.querySelector(
      ".cinematic-menu-link-arrow"
    );

    if (!arrow) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    gsap.to(arrow, {
      x:
        (event.clientX -
          rect.left -
          rect.width / 2) *
        0.035,
      y:
        (event.clientY -
          rect.top -
          rect.height / 2) *
        0.12,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const resetArrow = (
    event: ReactMouseEvent<HTMLAnchorElement>
  ) => {
    const arrow = event.currentTarget.querySelector(
      ".cinematic-menu-link-arrow"
    );

    if (!arrow) return;

    gsap.to(arrow, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleNavFocus = (
    event: ReactFocusEvent<HTMLAnchorElement>,
    index: number
  ) => {
    if (event.currentTarget.matches(":focus-visible")) {
      activateItem(index);
    }
  };

  if (hidden) return null;

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={`cinematic-menu-toggle ${
          open ? "is-open" : ""
        } ${scrolled ? "is-scrolled" : ""}`}
        aria-label={
          open ? "Close menu" : "Open menu"
        }
        aria-expanded={open}
        aria-controls="cinematic-menu-overlay"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="cinematic-menu-toggle-text">
          {open ? "CLOSE" : "MENU"}
        </span>

        {open ? (
          <X size={21} strokeWidth={1.6} />
        ) : (
          <span
            className="cinematic-menu-bars"
            aria-hidden="true"
          >
            <span />
            <span />
          </span>
        )}
      </button>

      <div
        ref={overlayRef}
        id="cinematic-menu-overlay"
        className="cinematic-menu-overlay"
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label="Portfolio navigation"
        aria-hidden={!open}
        inert={!open}
        style={{
          visibility: "hidden",
          pointerEvents: open
            ? "auto"
            : "none",
        }}
      >
        <div className="cinematic-menu-panel cinematic-menu-panel-left" />
        <div className="cinematic-menu-panel cinematic-menu-panel-right" />

        <div
          className="cinematic-menu-background"
          aria-hidden="true"
        >
          <div className="cinematic-menu-radar">
            <div className="cinematic-menu-orbit orbit-one">
              <span className="cinematic-menu-orbit-particle" />
            </div>

            <div className="cinematic-menu-orbit orbit-two">
              <span className="cinematic-menu-orbit-particle" />
            </div>

            <div className="cinematic-menu-orbit orbit-three">
              <span className="cinematic-menu-orbit-particle" />
            </div>

            <div className="cinematic-menu-radar-core" />
          </div>
        </div>

        <div className="cinematic-menu-shell">
          <header className="cinematic-menu-top cinematic-menu-reveal">
            <span className="cinematic-menu-brand">
              CORNÉ CARELSE<span>.</span>
            </span>

            <span className="cinematic-menu-top-label">
              SELECT YOUR DESTINATION
            </span>
          </header>

          <div className="cinematic-menu-body">
            <div className="cinematic-menu-left">
              <span className="cinematic-menu-caption cinematic-menu-reveal">
                NAVIGATION / INDEX
              </span>

              <nav
                ref={navRef}
                aria-label="Portfolio sections"
                className="cinematic-menu-nav"
              >
                <div
                  className={`cinematic-menu-tracker ${
                    tracker.visible
                      ? "is-visible"
                      : ""
                  }`}
                  style={{
                    top: tracker.top,
                    height: tracker.height,
                  }}
                  aria-hidden="true"
                />

                {navigation.map((item, index) => (
                  <a
                    key={item.hash}
                    href={`/#${item.hash}`}
                    data-menu-index={index}
                    className={`cinematic-menu-link ${
                      activeIndex === index
                        ? "is-active"
                        : ""
                    }`}
                    tabIndex={open ? 0 : -1}
                    onClick={(event) => {
                      event.preventDefault();
                      navigateTo(item.hash);
                    }}
                    onMouseEnter={() =>
                      activateItem(index)
                    }
                    onMouseMove={handleArrowMove}
                    onMouseLeave={resetArrow}
                    onFocus={(event) =>
                      handleNavFocus(event, index)
                    }
                  >
                    <span className="cinematic-menu-link-number">
                      {item.number}
                    </span>

                    <KineticLabel label={item.label} />

                    <ArrowUpRight
                      className="cinematic-menu-link-arrow"
                      size={25}
                      strokeWidth={1.4}
                    />
                  </a>
                ))}
              </nav>
            </div>

            <aside className="cinematic-menu-right">
              <div className="cinematic-menu-preview-top cinematic-menu-reveal">
                <span>
                  MORE THAN A PORTFOLIO
                </span>

                <span>
                  {activeItem.number} / 06
                </span>
              </div>

              <div className="cinematic-menu-preview-stage">
                <div
                  className="cinematic-menu-ghost-position"
                  aria-hidden="true"
                >
                  <span
                    key={activeItem.number}
                    className="cinematic-menu-ghost-number"
                  >
                    {activeItem.number}
                  </span>
                </div>

                <div className="cinematic-menu-preview-content">
                  <div className="cinematic-menu-preview-icon">
                    <ActiveIcon
                      size={25}
                      strokeWidth={1.4}
                    />
                  </div>

                  <div className="cinematic-menu-side-line" />

                  <p className="cinematic-menu-preview-title">
                    {activeItem.headline}
                    <br />
                    <span>
                      {activeItem.accent}
                    </span>
                  </p>

                  <span className="cinematic-menu-side-caption">
                    {activeItem.description}
                  </span>
                </div>
              </div>

              <div className="cinematic-menu-preview-progress cinematic-menu-reveal">
                <span
                  style={{
                    width: `${
                      ((activeIndex + 1) / 6) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div className="cinematic-menu-shortcuts cinematic-menu-reveal">
                <span className="cinematic-menu-shortcuts-caption">
                  QUICK ACCESS
                </span>

                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() =>
                    navigateTo("work")
                  }
                >
                  VIEW PROJECTS
                  <ArrowUpRight size={16} />
                </button>

                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() =>
                    navigateTo("contact")
                  }
                >
                  LET'S TALK
                  <ArrowUpRight size={16} />
                </button>
              </div>

              {onReplay &&
                location.pathname === "/" && (
                  <button
                    type="button"
                    className="cinematic-menu-replay cinematic-menu-reveal"
                    tabIndex={open ? 0 : -1}
                    onClick={replayIntro}
                  >
                    <RotateCcw size={17} />
                    REPLAY CINEMATIC INTRO
                  </button>
                )}
            </aside>
          </div>

          <footer className="cinematic-menu-footer cinematic-menu-reveal">
            <span>
              © {new Date().getFullYear()} CORNÉ
              CARELSE
            </span>

            <span className="cinematic-menu-footer-middle">
              SOUTH AFRICA / OPEN TO REMOTE
              ROLES
            </span>

            <a
              href="mailto:codingcorne@gmail.com"
              tabIndex={open ? 0 : -1}
            >
              DISCUSS AN OPPORTUNITY
              <ArrowDownRight size={16} />
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
