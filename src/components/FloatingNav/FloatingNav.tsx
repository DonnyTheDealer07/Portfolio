
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  X,
} from "lucide-react";
import gsap from "gsap";
import "./FloatingNav.css";

const navigation = [
  { number: "01", label: "HOME", hash: "home" },
  { number: "02", label: "ABOUT", hash: "about" },
  { number: "03", label: "EXPERTISE", hash: "skills" },
  { number: "04", label: "PROJECTS", hash: "work" },
  { number: "05", label: "EXPERIENCE", hash: "experience" },
  { number: "06", label: "CONTACT", hash: "contact" },
];

type Props = {
  hidden?: boolean;
  onReplay?: () => void;
};

export default function FloatingNav({
  hidden = false,
  onReplay,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 65);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const overlay = overlayRef.current;
      if (!overlay) return;

      const focusable = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        )
      );

      if (buttonRef.current) {
        focusable.unshift(buttonRef.current);
      }

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

    window.addEventListener("keydown", onKeyDown);
    buttonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      buttonRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    timelineRef.current?.kill();

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      gsap.set(overlay, {
        autoAlpha: open ? 1 : 0,
        yPercent: 0,
      });
      return;
    }

    if (open) {
      gsap.set(overlay, {
        autoAlpha: 1,
        yPercent: -100,
      });

      gsap.set(".cinematic-menu-link", {
        y: 65,
        opacity: 0,
      });

      gsap.set(".cinematic-menu-meta", {
        y: 18,
        opacity: 0,
      });

      timelineRef.current = gsap
        .timeline()
        .to(overlay, {
          yPercent: 0,
          duration: 0.75,
          ease: "power4.inOut",
        })
        .to(
          ".cinematic-menu-link",
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.065,
            ease: "power3.out",
          },
          "-=0.25"
        )
        .to(
          ".cinematic-menu-meta",
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.55"
        );
    } else {
      timelineRef.current = gsap
        .timeline()
        .to(overlay, {
          yPercent: -100,
          duration: 0.65,
          ease: "power4.inOut",
        })
        .set(overlay, {
          autoAlpha: 0,
        });
    }

    return () => {
      timelineRef.current?.kill();
    };
  }, [open]);

  const navigateTo = (hash: string) => {
    setOpen(false);

    if (location.pathname === "/") {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  };

  if (hidden) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`cinematic-menu-toggle ${
          open ? "is-open" : ""
        } ${scrolled ? "is-scrolled" : ""}`}
        aria-label={open ? "Close menu" : "Open menu"}
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
          <span className="cinematic-menu-bars">
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
        aria-label="Main navigation"
        aria-hidden={!open}
        style={{
          visibility: "hidden",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="cinematic-menu-background">
          <div className="cinematic-menu-orbit orbit-one" />
          <div className="cinematic-menu-orbit orbit-two" />
          <div className="cinematic-menu-orbit orbit-three" />
        </div>

        <div className="cinematic-menu-top cinematic-menu-meta">
          <span className="cinematic-menu-brand">
            CORNÉ CARELSE<span>.</span>
          </span>
          <span className="cinematic-menu-top-label">
            SELECT YOUR DESTINATION
          </span>
        </div>

        <div className="cinematic-menu-body">
          <div className="cinematic-menu-left">
            <span className="cinematic-menu-caption cinematic-menu-meta">
              NAVIGATION / INDEX
            </span>

            <nav aria-label="Portfolio sections">
              {navigation.map((item) => (
                <Link
                  key={item.hash}
                  to={`/#${item.hash}`}
                  className="cinematic-menu-link"
                  tabIndex={open ? 0 : -1}
                  onClick={() => navigateTo(item.hash)}
                >
                  <span className="cinematic-menu-link-number">
                    {item.number}
                  </span>

                  <span className="cinematic-menu-link-label">
                    {item.label}
                  </span>

                  <ArrowUpRight
                    className="cinematic-menu-link-arrow"
                    size={25}
                    strokeWidth={1.4}
                  />
                </Link>
              ))}
            </nav>
          </div>

          <div className="cinematic-menu-right cinematic-menu-meta">
            <span className="cinematic-menu-side-label">
              MORE THAN A PORTFOLIO
            </span>

            <div className="cinematic-menu-side-line" />

            <p>
              AN EXPERIENCE
              <br />
              <span>BY DESIGN.</span>
            </p>

            <span className="cinematic-menu-side-caption">
              DEVELOPED WITH REACT, THREE.JS & GSAP
            </span>

            {onReplay && location.pathname === "/" && (
              <button
                type="button"
                className="cinematic-menu-replay"
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  setOpen(false);
                  window.setTimeout(onReplay, 450);
                }}
              >
                <RotateCcw size={17} />
                REPLAY CINEMATIC INTRO
              </button>
            )}
          </div>
        </div>

        <div className="cinematic-menu-footer cinematic-menu-meta">
          <span>© {new Date().getFullYear()} CORNÉ CARELSE</span>

          <span className="cinematic-menu-footer-middle">
            SOUTH AFRICA / AVAILABLE WORLDWIDE
          </span>

          <a
            href="mailto:codingcorne@gmail.com"
            tabIndex={open ? 0 : -1}
          >
            LET'S BUILD SOMETHING
            <ArrowDownRight size={16} />
          </a>
        </div>
      </div>
    </>
  );
}
