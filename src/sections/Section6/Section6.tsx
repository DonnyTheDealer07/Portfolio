
import { useEffect, useRef } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import {
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Code2,
  Mail,
  MapPin,
  MessageCircle,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Section6.css";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "codingcorne@gmail.com";
const GITHUB = "https://github.com/DonnyTheDealer07";
const LINKEDIN =
  "https://www.linkedin.com/in/corne-carelse-b56966366/";
const WHATSAPP = "https://wa.me/27767539269";

const EMAIL_LINK =
  `mailto:${EMAIL}?subject=${encodeURIComponent(
    "React / Frontend Developer Opportunity"
  )}&body=${encodeURIComponent(
    "Hi Corné,\n\nI came across your portfolio and would like to discuss a development opportunity with you.\n\n"
  )}`;

const WHATSAPP_LINK =
  `${WHATSAPP}?text=${encodeURIComponent(
    "Hi Corné! I came across your portfolio and would like to discuss a React / Frontend Developer opportunity."
  )}`;

type ContactMethod = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  external: boolean;
};

function GitHubIcon({ size = 25 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297a12 12 0 0 0-3.793 23.386c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.333-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.53 11.53 0 0 1 6.006 0c2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.806 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z" />
    </svg>
  );
}

function LinkedInIcon({ size = 25 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function SplitHeadline({ text }: { text: string }) {
  return (
    <span className="s6-split" aria-label={text}>
      {Array.from(text).map((character, index) => (
        <span
          className="s6-letter-mask"
          key={`${index}-${character}`}
          aria-hidden="true"
        >
          <span className="s6-letter">
            {character === " " ? "\u00A0" : character}
          </span>
        </span>
      ))}
    </span>
  );
}

function AvailabilityStatus() {
  return (
    <div className="s6-availability">
      <span className="s6-availability-orb" aria-hidden="true">
        <span />
      </span>

      <div className="s6-availability-copy">
        <span className="s6-availability-label">
          OPEN TO OPPORTUNITIES
        </span>
        <span className="s6-availability-detail">
          REMOTE · REACT / FRONTEND
        </span>
      </div>

      <span className="s6-availability-bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}

function MagneticHireButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const handleMove = (
    event: ReactMouseEvent<HTMLAnchorElement>
  ) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const button = buttonRef.current;
    const inner = innerRef.current;

    if (!button || !inner) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * 0.14,
      y: y * 0.14,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(inner, {
      x: x * 0.09,
      y: y * 0.09,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleLeave = () => {
    if (!buttonRef.current || !innerRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });

    gsap.to(innerRef.current, {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });
  };

  return (
    <a
      ref={buttonRef}
      className="s6-hire-button"
      href={EMAIL_LINK}
      aria-label="Contact Corné about a developer opportunity"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className="s6-hire-ring s6-hire-ring-outer" />
      <span className="s6-hire-ring s6-hire-ring-middle" />
      <span className="s6-hire-pulse s6-hire-pulse-one" />
      <span className="s6-hire-pulse s6-hire-pulse-two" />

      <span className="s6-hire-inner" ref={innerRef}>
        <ArrowUpRight
          className="s6-hire-arrow"
          size={35}
          strokeWidth={1.2}
        />

        <span className="s6-hire-title">
          LET'S
          <br />
          TALK.
        </span>

        <span className="s6-hire-subtitle">
          CONTACT FOR AN INTERVIEW
        </span>
      </span>

      <span className="s6-hire-particle s6-hire-particle-one" />
      <span className="s6-hire-particle s6-hire-particle-two" />
    </a>
  );
}

function ConnectionNetwork() {
  return (
    <div className="s6-network" aria-hidden="true">
      <svg
        viewBox="0 0 1000 430"
        preserveAspectRatio="none"
        className="s6-network-svg"
      >
        <defs>
          <linearGradient id="s6-network-gradient">
            <stop offset="0%" stopColor="#ff304f" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff304f" stopOpacity=".85" />
            <stop offset="100%" stopColor="#ff304f" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          className="s6-network-path"
          d="M500 20 C500 120 150 90 150 230"
        />
        <path
          className="s6-network-path"
          d="M500 20 C500 120 380 100 380 230"
        />
        <path
          className="s6-network-path"
          d="M500 20 C500 120 620 100 620 230"
        />
        <path
          className="s6-network-path"
          d="M500 20 C500 120 850 90 850 230"
        />

        <path
          className="s6-network-flow"
          d="M500 20 C500 120 150 90 150 230"
        />
        <path
          className="s6-network-flow s6-network-flow-delay-1"
          d="M500 20 C500 120 380 100 380 230"
        />
        <path
          className="s6-network-flow s6-network-flow-delay-2"
          d="M500 20 C500 120 620 100 620 230"
        />
        <path
          className="s6-network-flow s6-network-flow-delay-3"
          d="M500 20 C500 120 850 90 850 230"
        />

        {[150, 380, 620, 850].map((x) => (
          <g key={x}>
            <circle
              className="s6-network-node-glow"
              cx={x}
              cy="230"
              r="9"
            />
            <circle
              className="s6-network-node"
              cx={x}
              cy="230"
              r="3"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function ContactCard({
  method,
  onHover,
}: {
  method: ContactMethod;
  onHover: (id: string | null) => void;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMove = (
    event: ReactMouseEvent<HTMLAnchorElement>
  ) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    card.style.setProperty(
      "--card-mouse-x",
      `${event.clientX - rect.left}px`
    );

    card.style.setProperty(
      "--card-mouse-y",
      `${event.clientY - rect.top}px`
    );
  };

  return (
    <a
      ref={cardRef}
      className={`s6-contact-card s6-contact-card--${method.id}`}
      href={method.href}
      target={method.external ? "_blank" : undefined}
      rel={method.external ? "noopener noreferrer" : undefined}
      onMouseMove={handleMove}
      onMouseEnter={() => onHover(method.id)}
      onMouseLeave={() => onHover(null)}
    >
      <span className="s6-card-spotlight" aria-hidden="true" />
      <span className="s6-card-scan" aria-hidden="true" />

      <span className="s6-card-content">
        <span className="s6-card-icon">{method.icon}</span>

        <span className="s6-card-copy">
          <span className="s6-card-eyebrow">
            {method.eyebrow}
          </span>

          <span className="s6-card-title">
            {method.title}
          </span>

          <span className="s6-card-description">
            {method.description}
          </span>
        </span>

        <span className="s6-card-arrow">
          <ArrowUpRight size={23} strokeWidth={1.5} />
        </span>
      </span>

      <span className="s6-card-bottom-line" aria-hidden="true" />
    </a>
  );
}

export default function Section6() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [activeContact, setActiveContact] =
    useRef<{ value: string | null }>({ value: null }).current
      ? [null, () => {}] as [
          string | null,
          (value: string | null) => void,
        ]
      : [null, () => {}] as [
          string | null,
          (value: string | null) => void,
        ];

  const methods: ContactMethod[] = [
    {
      id: "linkedin",
      eyebrow: "PROFESSIONAL PROFILE",
      title: "LINKEDIN",
      description: "Connect with me professionally",
      href: LINKEDIN,
      icon: <LinkedInIcon />,
      external: true,
    },
    {
      id: "whatsapp",
      eyebrow: "DIRECT MESSAGE",
      title: "WHATSAPP",
      description: "+27 76 753 9269",
      href: WHATSAPP_LINK,
      icon: <MessageCircle size={25} strokeWidth={1.6} />,
      external: true,
    },
    {
      id: "email",
      eyebrow: "RECRUITMENT & INTERVIEWS",
      title: "EMAIL ME",
      description: EMAIL,
      href: EMAIL_LINK,
      icon: <Mail size={25} strokeWidth={1.6} />,
      external: false,
    },
    {
      id: "github",
      eyebrow: "SOURCE CODE & PROJECTS",
      title: "GITHUB",
      description: "Explore my repositories",
      href: GITHUB,
      icon: <GitHubIcon />,
      external: true,
    },
  ];

  const handleMouseMove = (
    event: ReactMouseEvent<HTMLElement>
  ) => {
    const section = sectionRef.current;
    const glow = glowRef.current;

    if (!section || !glow) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const rect = section.getBoundingClientRect();

    gsap.to(glow, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      duration: 1,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleBackToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      // 01 — CRIMSON IGNITION
      const ignition = gsap.timeline({
        scrollTrigger: {
          trigger: ".s6-main",
          start: "top 80%",
          once: true,
        },
      });

      ignition
        .fromTo(
          ".s6-ignition-beam",
          {
            scaleX: 0,
            autoAlpha: 0,
          },
          {
            scaleX: 1,
            autoAlpha: 1,
            duration: 1.15,
            ease: "power4.inOut",
          }
        )
        .fromTo(
          ".s6-ignition-flash",
          {
            autoAlpha: 0,
            scale: 0.5,
          },
          {
            autoAlpha: 0.8,
            scale: 1.4,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.25"
        )
        .to(
          ".s6-ignition-flash",
          {
            autoAlpha: 0,
            scale: 2,
            duration: 0.8,
          },
          "-=0.05"
        )
        .to(
          ".s6-ignition-beam",
          {
            autoAlpha: 0.2,
            duration: 0.8,
          },
          "-=0.7"
        );

      // 02 — STATUS + TOPLINE
      gsap.fromTo(
        ".s6-topline, .s6-availability",
        {
          autoAlpha: 0,
          y: 28,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".s6-main",
            start: "top 75%",
            once: true,
          },
        }
      );

      // 03 — EXPLOSIVE HEADLINE
      const headingTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".s6-hero-heading",
          start: "top 88%",
          once: true,
        },
      });

      headingTimeline
        .fromTo(
          ".s6-heading-row-white .s6-letter",
          {
            yPercent: 130,
            rotateX: -70,
            rotateZ: -8,
            autoAlpha: 0,
          },
          {
            yPercent: 0,
            rotateX: 0,
            rotateZ: 0,
            autoAlpha: 1,
            duration: 1.15,
            stagger: 0.045,
            ease: "power4.out",
          }
        )
        .fromTo(
          ".s6-heading-row-red .s6-letter",
          {
            yPercent: 150,
            rotateX: -85,
            rotateZ: 10,
            autoAlpha: 0,
          },
          {
            yPercent: 0,
            rotateX: 0,
            rotateZ: 0,
            autoAlpha: 1,
            duration: 1.25,
            stagger: 0.035,
            ease: "back.out(1.15)",
          },
          "-=0.65"
        )
        .fromTo(
          ".s6-heading-light-sweep",
          { xPercent: -110, autoAlpha: 0 },
          {
            xPercent: 110,
            autoAlpha: 1,
            duration: 1.25,
            ease: "power2.inOut",
          },
          "-=0.7"
        )
        .set(".s6-heading-light-sweep", {
          autoAlpha: 0,
        });

      // 04 — CRIMSON UNDERLINE
      gsap.fromTo(
        ".s6-heading-rule-fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ".s6-hero-heading",
            start: "top 72%",
            once: true,
          },
        }
      );

      // 05 — DESCRIPTION AND ROLES
      gsap.fromTo(
        ".s6-description, .s6-role-chip, .s6-scroll-note",
        {
          autoAlpha: 0,
          y: 30,
          filter: "blur(8px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".s6-description",
            start: "top 88%",
            once: true,
          },
        }
      );

      // 06 — MAGNETIC BUTTON REVEAL
      gsap.fromTo(
        ".s6-hire-button",
        {
          autoAlpha: 0,
          scale: 0.4,
          rotate: -45,
        },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 1.6,
          ease: "back.out(1.35)",
          scrollTrigger: {
            trigger: ".s6-cta",
            start: "top 85%",
            once: true,
          },
        }
      );

      // 07 — CONNECT INTRO
      gsap.fromTo(
        ".s6-connect-eyebrow, .s6-connect-title, .s6-connect-description",
        {
          autoAlpha: 0,
          y: 35,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".s6-connect",
            start: "top 75%",
            once: true,
          },
        }
      );

      // 08 — NETWORK DRAWING
      gsap.fromTo(
        ".s6-network-path",
        {
          strokeDasharray: 1100,
          strokeDashoffset: 1100,
        },
        {
          strokeDashoffset: 0,
          duration: 1.8,
          stagger: 0.15,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".s6-network",
            start: "top 85%",
            once: true,
          },
        }
      );

      // 09 — CONTACT CARD REVEALS
      gsap.fromTo(
        ".s6-contact-card",
        {
          autoAlpha: 0,
          y: 70,
          rotateX: -12,
          filter: "blur(10px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.13,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".s6-contact-grid",
            start: "top 88%",
            once: true,
          },
        }
      );

      // 10 — SIGNATURE REVEAL
      const signatureTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".s6-signature",
          start: "top 85%",
          once: true,
        },
      });

      signatureTimeline
        .fromTo(
          ".s6-signature-outline",
          {
            autoAlpha: 0,
            yPercent: 90,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.2,
            ease: "power4.out",
          }
        )
        .fromTo(
          ".s6-signature-fill",
          {
            clipPath: "inset(0% 100% 0% 0%)",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.8,
            ease: "power3.inOut",
          },
          "-=0.4"
        )
        .fromTo(
          ".s6-signature-sweep",
          {
            xPercent: -110,
            autoAlpha: 0,
          },
          {
            xPercent: 110,
            autoAlpha: 1,
            duration: 1.4,
            ease: "power2.inOut",
          },
          "-=1.55"
        )
        .set(".s6-signature-sweep", {
          autoAlpha: 0,
        })
        .fromTo(
          ".s6-signature-line-fill",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
          },
          "-=0.8"
        );

      // 11 — CINEMATIC SHUTDOWN
      gsap.fromTo(
        ".s6-shutdown-overlay",
        {
          opacity: 0,
        },
        {
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: ".s6-signature",
            start: "top 55%",
            end: "bottom 75%",
            scrub: 1,
          },
        }
      );

      // 12 — FOOTER
      gsap.fromTo(
        ".s6-footer",
        {
          autoAlpha: 0,
          y: 35,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".s6-footer",
            start: "top 94%",
            once: true,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="portfolio-section s6-section"
      onMouseMove={handleMouseMove}
      data-active-contact={activeContact ?? ""}
    >
      {/* CINEMATIC ATMOSPHERE */}
      <div
        ref={glowRef}
        className="s6-cursor-glow"
        aria-hidden="true"
      />

      <div className="s6-grid-background" aria-hidden="true" />
      <div className="s6-ambient-orb s6-ambient-orb-one" />
      <div className="s6-ambient-orb s6-ambient-orb-two" />

      <div className="s6-ignition-flash" aria-hidden="true" />

      {/* MAIN */}
      <div className="s6-main">
        <div className="s6-ignition-track">
          <span className="s6-ignition-beam" />
        </div>

        <div className="s6-topline">
          <span>06 / CONTACT</span>
          <span className="s6-topline-rule" />
          <span>THE NEXT OPPORTUNITY</span>
        </div>

        <div className="s6-main-layout">
          <div className="s6-copy">
            <AvailabilityStatus />

            <h2 className="s6-hero-heading">
              <span className="s6-heading-row s6-heading-row-white">
                <SplitHeadline text="YOUR NEXT" />
              </span>

              <span className="s6-heading-row s6-heading-row-red">
                <SplitHeadline text="DEVELOPER." />
                <span className="s6-heading-light-sweep" />
              </span>
            </h2>

            <div className="s6-heading-rule">
              <span className="s6-heading-rule-fill" />
            </div>

            <p className="s6-description">
              Looking for a React or Frontend Developer who
              cares about the details? I'm ready to bring
              creativity, technical skills, and dedication
              to a team building exceptional digital
              experiences.
            </p>

            <div className="s6-role-list">
              <span className="s6-role-chip">
                <Check size={14} />
                REACT DEVELOPER
              </span>

              <span className="s6-role-chip">
                <Check size={14} />
                FRONTEND DEVELOPER
              </span>

              <span className="s6-role-chip">
                <Check size={14} />
                REMOTE
              </span>
            </div>

            <div className="s6-scroll-note">
              <span>THE NEXT CHAPTER STARTS HERE</span>
              <ArrowDownRight size={19} />
            </div>
          </div>

          <div className="s6-cta">
            <div className="s6-cta-topline">
              <span>YOUR NEXT HIRE?</span>
              <span>LET'S TALK ↗</span>
            </div>

            <MagneticHireButton />

            <div className="s6-cta-footer">
              <span className="s6-cta-footer-dot" />
              AVAILABLE FOR INTERVIEWS
            </div>
          </div>
        </div>
      </div>

      {/* CONNECT */}
      <div className="s6-connect">
        <div className="s6-connect-header">
          <div>
            <div className="s6-connect-eyebrow">
              <Sparkles size={15} />
              DIRECT CONNECTION
            </div>

            <h3 className="s6-connect-title">
              LET'S <span>CONNECT.</span>
            </h3>
          </div>

          <p className="s6-connect-description">
            Interested in discussing a remote React or
            Frontend Developer position? Reach out through
            whichever platform works best for you.
          </p>
        </div>

        <ConnectionNetwork />

        <div className="s6-contact-grid">
          {methods.map((method) => (
            <ContactCard
              key={method.id}
              method={method}
              onHover={setActiveContact}
            />
          ))}
        </div>

        <div className="s6-location-bar">
          <span>
            <MapPin size={15} />
            SOUTH AFRICA
          </span>

          <span>
            <span className="s6-location-dot" />
            OPEN TO REMOTE OPPORTUNITIES
          </span>

          <span>
            <Code2 size={15} />
            REACT / FRONTEND
          </span>
        </div>
      </div>

      {/* SIGNATURE FINALE */}
      <div className="s6-signature">
        <div className="s6-shutdown-overlay" aria-hidden="true" />

        <div className="s6-signature-topline">
          <span>THE FINAL FRAME.</span>
          <span>THE NEXT CHAPTER BEGINS.</span>
        </div>

        <div className="s6-signature-stage">
          <div className="s6-signature-outline">
            CORNÉ CARELSE<span>.</span>
          </div>

          <div className="s6-signature-fill" aria-hidden="true">
            CORNÉ CARELSE<span>.</span>
          </div>

          <div className="s6-signature-sweep" aria-hidden="true" />
        </div>

        <div className="s6-signature-line">
          <span className="s6-signature-line-fill" />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="s6-footer">
        <div className="s6-footer-identity">
          <span className="s6-footer-logo">CC.</span>

          <div>
            <span className="s6-footer-name">
              CORNÉ CARELSE
            </span>
            <span className="s6-footer-role">
              REACT / FRONTEND DEVELOPER
            </span>
          </div>
        </div>

        <div className="s6-footer-meta">
          <span>© {new Date().getFullYear()} CORNÉ CARELSE</span>
          <span>BUILT WITH INTENTION.</span>
        </div>

        <button
          type="button"
          className="s6-back-to-top"
          onClick={handleBackToTop}
        >
          BACK TO TOP
          <ArrowUp size={18} />
        </button>
      </footer>

      <div className="s6-final-message">
        <span>THE END IS JUST THE BEGINNING.</span>
        <MoveUpRight size={13} />
      </div>
    </section>
  );
}
