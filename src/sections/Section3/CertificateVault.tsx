
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CertificateVault.css";

gsap.registerPlugin(ScrollTrigger);

type Certificate = {
  id: number;
  image: string;
  label: string;
};

const certificates: Certificate[] = [
  { id: 1, image: "/certificates/cv1.jpg", label: "Certificate 01" },
  { id: 2, image: "/certificates/cv2.jpg", label: "Certificate 02" },
  { id: 3, image: "/certificates/cv3.jpg", label: "Certificate 03" },
  { id: 4, image: "/certificates/cv4.jpeg", label: "Certificate 04" },
  { id: 5, image: "/certificates/cv5.jpeg", label: "Certificate 05" },
  { id: 6, image: "/certificates/cv6.jpeg", label: "Certificate 06" },
];

const VERIFIED = "VERIFIED.";

function MagneticVerified() {
  const wordRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const handleMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    pointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;

      const word = wordRef.current;
      if (!word) return;

      const letters = word.querySelectorAll<HTMLElement>(
        ".vault-magnetic-letter"
      );

      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();

        const currentX =
          Number(gsap.getProperty(letter, "x")) || 0;
        const currentY =
          Number(gsap.getProperty(letter, "y")) || 0;

        const centerX = rect.left + rect.width / 2 - currentX;
        const centerY = rect.top + rect.height / 2 - currentY;

        const distance = Math.hypot(
          pointerRef.current.x - centerX,
          pointerRef.current.y - centerY
        );

        const influence = Math.max(0, 1 - distance / 155);
        const direction = Math.max(
          -1,
          Math.min(
            1,
            (pointerRef.current.x - centerX) / 155
          )
        );

        gsap.to(letter, {
          x: direction * influence * 7,
          y: -influence * 13,
          rotation: -direction * influence * 4,
          scaleX: 1 + influence * 0.055,
          scaleY: 1 + influence * 0.085,
          textShadow:
            influence > 0.04
              ? `0 0 ${Math.round(influence * 30)}px rgba(255,48,79,${influence * 0.75})`
              : "0 0 0px rgba(255,48,79,0)",
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });
  };

  const reset = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const letters = wordRef.current?.querySelectorAll(
      ".vault-magnetic-letter"
    );

    if (!letters) return;

    gsap.to(letters, {
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      textShadow: "0 0 0px rgba(255,48,79,0)",
      duration: 0.75,
      stagger: 0.025,
      ease: "elastic.out(1, 0.6)",
      overwrite: "auto",
    });
  };

  useEffect(() => {
    const word = wordRef.current;
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      if (word) {
        gsap.killTweensOf(
          word.querySelectorAll(".vault-magnetic-letter")
        );
      }
    };
  }, []);

  return (
    <em
      ref={wordRef}
      className="vault-magnetic-word"
      aria-label={VERIFIED}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {Array.from(VERIFIED).map((letter, index) => (
        <span
          className="vault-magnetic-letter"
          aria-hidden="true"
          key={`${letter}-${index}`}
        >
          {letter}
        </span>
      ))}
    </em>
  );
}

export default function CertificateVault() {
  const vaultRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const next = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % certificates.length
    );
  }, []);

  const previous = useCallback(() => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + certificates.length) % certificates.length
    );
  }, []);

  const close = useCallback(() => {
    setActiveIndex(null);
    requestAnimationFrame(() => previousFocusRef.current?.focus());
  }, []);

  const open = (index: number) => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setActiveIndex(index);
  };

  useEffect(() => {
    const vault = vaultRef.current;
    if (!vault) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: vault,
          start: "top 80%",
          once: true,
        },
      });

      timeline
        .fromTo(
          ".vault-divider",
          { autoAlpha: 0, scaleX: 0 },
          {
            autoAlpha: 1,
            scaleX: 1,
            duration: 1.05,
            ease: "power3.inOut",
          }
        )
        .fromTo(
          ".vault-eyebrow",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.45"
        )
        .fromTo(
          ".vault-title",
          { autoAlpha: 0, y: 65, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .fromTo(
          ".vault-description",
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.5"
        );

      gsap.fromTo(
        ".vault-card",
        { autoAlpha: 0, y: 70, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".vault-grid",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, vault);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const modal = modalRef.current;
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href]'
        )
      ).filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) {
        event.preventDefault();
        modal.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (
        event.shiftKey &&
        (current === first || !modal.contains(current))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (current === last || !modal.contains(current))
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, close, next, previous]);

  const active =
    activeIndex === null ? null : certificates[activeIndex];

  const modal =
    active && activeIndex !== null ? (
      <div
        ref={modalRef}
        className="vault-modal vault-modal-cinematic"
        role="dialog"
        aria-modal="true"
        aria-label={`${active.label} viewer`}
        tabIndex={-1}
        style={{ position: "fixed", inset: 0, zIndex: 2147483647 }}
      >
        <div
          className="vault-modal-backdrop"
          onClick={close}
          aria-hidden="true"
        />

        <div className="vault-modal-header">
          <div>
            <span>VERIFIED ARCHIVE</span>
            <strong>{active.label}</strong>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="vault-close"
            onClick={close}
            aria-label="Close certificate viewer"
          >
            <X size={25} />
          </button>
        </div>

        <div className="vault-modal-content">
          <button
            type="button"
            className="vault-navigation vault-navigation-prev"
            onClick={previous}
            aria-label="Previous certificate"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="vault-modal-image-frame">
            <img
              key={active.image}
              src={active.image}
              alt={active.label}
              className="vault-modal-image"
            />
          </div>

          <button
            type="button"
            className="vault-navigation vault-navigation-next"
            onClick={next}
            aria-label="Next certificate"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="vault-modal-footer">
          <div className="vault-modal-count">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <span>/</span>
            <span>{String(certificates.length).padStart(2, "0")}</span>
          </div>

          <div className="vault-modal-actions">
            <button
              type="button"
              className="vault-mobile-nav"
              onClick={previous}
              aria-label="Previous certificate"
            >
              <ArrowLeft size={18} />
            </button>

            <a
              href={active.image}
              target="_blank"
              rel="noopener noreferrer"
              className="vault-original-link"
            >
              VIEW ORIGINAL
              <ExternalLink size={16} />
            </a>

            <button
              type="button"
              className="vault-mobile-nav"
              onClick={next}
              aria-label="Next certificate"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <span className="vault-keyboard-hint">
            ← → NAVIGATE / ESC CLOSE
          </span>
        </div>
      </div>
    ) : null;

  return (
    <div className="certificate-vault" ref={vaultRef}>
      <div className="vault-divider">
        <span />
        <Award size={21} />
        <span />
      </div>

      <div className="vault-heading">
        <div className="vault-heading-copy">
          <p className="vault-eyebrow">
            03.2 / CREDENTIALS VAULT
          </p>

          <h3 className="vault-title">
            KNOWLEDGE.
            <br />
            <MagneticVerified />
          </h3>

          <p className="vault-description">
            A collection of certificates documenting my learning
            and development journey. Select any certificate to
            inspect it in full detail.
          </p>
        </div>

        <div className="vault-heading-aside">
          <span>ARCHIVE / 2026</span>
          <strong>06</strong>
          <span>DOCUMENTS ON FILE</span>
        </div>
      </div>

      <div className="vault-grid">
        {certificates.map((certificate, index) => (
          <button
            type="button"
            className="vault-card"
            key={certificate.id}
            onClick={() => open(index)}
            aria-label={`View ${certificate.label}`}
          >
            <div className="vault-card-image">
              <img
                src={certificate.image}
                alt={certificate.label}
                loading="lazy"
              />
              <div className="vault-card-shine" />
              <div className="vault-card-open">
                <ArrowUpRight size={25} />
              </div>
            </div>

            <div className="vault-card-details">
              <div>
                <span className="vault-card-index">
                  DOCUMENT /{" "}
                  {String(certificate.id).padStart(2, "0")}
                </span>
                <strong>{certificate.label}</strong>
              </div>
              <ArrowUpRight size={18} />
            </div>
          </button>
        ))}
      </div>

      <div className="vault-bottom">
        <span>
          <span className="vault-status-dot" />
          ALL DOCUMENTS AVAILABLE
        </span>

        <span>
          CLICK TO INSPECT
          <ArrowRight size={16} />
        </span>
      </div>

      {modal && createPortal(modal, document.body)}
    </div>
  );
}
