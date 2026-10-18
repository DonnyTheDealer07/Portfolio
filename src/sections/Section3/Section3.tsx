
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowUpRight,
  Code2,
  Database,
  Layers3,
  Sparkles,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CertificateVault from "./CertificateVault";
import "./Section3.css";
import "./Section3Adjustments.css";

gsap.registerPlugin(ScrollTrigger);

type Technology = {
  name: string;
  category: string;
  number: string;
};

const technologies: Technology[] = [
  { name: "React", category: "FRONTEND", number: "01" },
  { name: "TypeScript", category: "LANGUAGE", number: "02" },
  { name: "JavaScript", category: "LANGUAGE", number: "03" },
  { name: "Node.js", category: "BACKEND", number: "04" },
  { name: "Express", category: "BACKEND", number: "05" },
  { name: "Three.js", category: "CREATIVE", number: "06" },
  { name: "GSAP", category: "ANIMATION", number: "07" },
  { name: "CSS", category: "STYLESHEET", number: "08" },
  { name: "REST APIs", category: "INTEGRATION", number: "09" },
  { name: "Git", category: "WORKFLOW", number: "10" },
  { name: "Vercel", category: "DEPLOYMENT", number: "11" },
  { name: "Responsive UI", category: "DESIGN", number: "12" },
];

function AnimatedWord({
  text,
  crimson = false,
}: {
  text: string;
  crimson?: boolean;
}) {
  const wordRef = useRef<HTMLSpanElement>(null);
  const activatedRef = useRef(false);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const word = wordRef.current;
    if (!word || !crimson) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const letters = Array.from(
      word.querySelectorAll<HTMLElement>(".arsenal-letter")
    );

    const updateLetters = () => {
      pointerFrameRef.current = null;

      if (!activatedRef.current || reducedMotion.matches) {
        return;
      }

      const { x, y } = pointerRef.current;

      letters.forEach((letter) => {
        const bounds = letter.getBoundingClientRect();

        // Use the element's original position rather than
        // its already-transformed position to avoid jitter.
        const currentX = Number(
          gsap.getProperty(letter, "x")
        ) || 0;

        const currentY = Number(
          gsap.getProperty(letter, "y")
        ) || 0;

        const centerX =
          bounds.left + bounds.width / 2 - currentX;

        const centerY =
          bounds.top + bounds.height / 2 - currentY;

        const distance = Math.hypot(
          x - centerX,
          y - centerY
        );

        const influence = Math.max(
          0,
          1 - distance / 155
        );

        const direction =
          Math.max(-1, Math.min(1, (x - centerX) / 155));

        gsap.to(letter, {
          x: direction * influence * 7,
          y: -influence * 13,
          rotation: -direction * influence * 4,
          scaleX: 1 + influence * 0.055,
          scaleY: 1 + influence * 0.085,
          textShadow:
            influence > 0.04
              ? `0 0 ${Math.round(
                  influence * 30
                )}px rgba(255,48,79,${
                  influence * 0.75
                })`
              : "0 0 0px rgba(255,48,79,0)",
          duration: 0.32,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    const onMove = (event: PointerEvent) => {
      if (
        event.pointerType === "touch" ||
        reducedMotion.matches ||
        !activatedRef.current
      ) {
        return;
      }

      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;

      if (pointerFrameRef.current === null) {
        pointerFrameRef.current =
          requestAnimationFrame(updateLetters);
      }
    };

    const reset = () => {
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
        pointerFrameRef.current = null;
      }

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

    // The existing GSAP scroll entrance is allowed to
    // finish before magnetic mouse interaction begins.
    const observer = new MutationObserver(() => {
      const visible = letters.every((letter) => {
        const opacity = Number(
          gsap.getProperty(letter, "opacity")
        );
        return opacity > 0.98;
      });

      if (visible) {
        activatedRef.current = true;
        observer.disconnect();
      }
    });

    // ScrollTrigger controls the actual entrance.
    // This activation check is scheduled after it.
    const activationTrigger = ScrollTrigger.create({
      trigger: word,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.delayedCall(1.5, () => {
          activatedRef.current = true;
        });
      },
    });

    word.addEventListener("pointermove", onMove);
    word.addEventListener("pointerleave", reset);

    return () => {
      activationTrigger.kill();
      observer.disconnect();

      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
      }

      word.removeEventListener("pointermove", onMove);
      word.removeEventListener("pointerleave", reset);

      gsap.killTweensOf(letters);
    };
  }, [crimson]);

  return (
    <span
      ref={wordRef}
      className={`arsenal-animated-word ${
        crimson ? "arsenal-animated-word-crimson" : ""
      }`}
      aria-label={text}
    >
      {Array.from(text).map((letter, index) => (
        <span
          className="arsenal-letter"
          aria-hidden="true"
          key={`${letter}-${index}`}
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </span>
  );
}

function TechCore() {
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const core = coreRef.current;
    if (!core) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) return;

    const context = gsap.context(() => {
      const shell = core.querySelector(".tech-core-shell");
      const rings = gsap.utils.toArray<HTMLElement>(
        ".tech-core-ring"
      );
      const dots = gsap.utils.toArray<HTMLElement>(
        ".tech-core-dot"
      );
      const labels = gsap.utils.toArray<HTMLElement>(
        ".tech-core-label"
      );
      const center = core.querySelector(".tech-core-center");
      const aura = core.querySelector(".tech-core-aura");

      const activation = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      activation
        .fromTo(
          shell,
          { autoAlpha: 0, scale: 0.55, rotation: -35 },
          {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 1.3,
          }
        )
        .fromTo(
          rings,
          { autoAlpha: 0, scale: 0.55 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.15,
            stagger: 0.12,
          },
          0.2
        )
        .fromTo(
          center,
          { autoAlpha: 0, scale: 0.5 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.8)",
          },
          0.55
        )
        .fromTo(
          aura,
          { opacity: 0, scale: 0.6 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.4,
          },
          0.5
        )
        .fromTo(
          dots,
          { autoAlpha: 0, scale: 0 },
          {
            autoAlpha: 1,
            scale: 1,
            stagger: 0.12,
            duration: 0.4,
          },
          0.85
        )
        .fromTo(
          labels,
          { autoAlpha: 0, y: 15 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.55,
          },
          1.05
        )
        .to(
          center,
          {
            scale: 1.12,
            duration: 0.25,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          1.2
        );

      activation.eventCallback("onComplete", () => {
        gsap.to(".tech-core-ring-one", {
          rotation: 360,
          duration: 38,
          repeat: -1,
          ease: "none",
        });

        gsap.to(".tech-core-ring-two", {
          rotation: -360,
          duration: 30,
          repeat: -1,
          ease: "none",
        });

        gsap.to(".tech-core-ring-three", {
          rotation: 360,
          duration: 52,
          repeat: -1,
          ease: "none",
        });

        gsap.to(center, {
          scale: 1.055,
          duration: 2.7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });

      ScrollTrigger.create({
        trigger: core,
        start: "top 85%",
        once: true,
        onEnter: () => activation.play(),
      });
    }, core);

    return () => context.revert();
  }, []);

  return (
    <div className="tech-core" ref={coreRef} aria-hidden="true">
      <div className="tech-core-grid" />

      <div className="tech-core-shell">
        <div className="tech-core-aura" />

        <div className="tech-core-ring tech-core-ring-one">
          <span className="tech-core-dot dot-a" />
          <span className="tech-core-dot dot-b" />
        </div>

        <div className="tech-core-ring tech-core-ring-two">
          <span className="tech-core-dot dot-c" />
        </div>

        <div className="tech-core-ring tech-core-ring-three" />

        <div className="tech-core-center">
          <div className="tech-core-center-inner">
            <Code2 size={38} strokeWidth={1.3} />
            <strong>DEV</strong>
            <span>CORE ACTIVE</span>
          </div>
        </div>

        <span className="tech-core-label tech-label-react">
          REACT
        </span>
        <span className="tech-core-label tech-label-node">
          NODE.JS
        </span>
        <span className="tech-core-label tech-label-gsap">
          GSAP
        </span>
        <span className="tech-core-label tech-label-three">
          THREE.JS
        </span>
      </div>
    </div>
  );
}

function SkillCard({
  technology,
}: {
  technology: Technology;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches ||
      event.pointerType === "touch"
    ) {
      return;
    }

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--pointer-x", `${x}px`);
    card.style.setProperty("--pointer-y", `${y}px`);

    const rotateY = (x / rect.width - 0.5) * 7;
    const rotateX = (0.5 - y / rect.height) * 7;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const onPointerLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "";
    }
  };

  return (
    <div
      ref={cardRef}
      className="arsenal-card"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="arsenal-card-light" />
      <div className="arsenal-card-scan" />
      <div className="arsenal-card-activation" />

      <div className="arsenal-card-top">
        <span>{technology.number}</span>
        <span>{technology.category}</span>
      </div>

      <div className="arsenal-card-bottom">
        <strong>{technology.name}</strong>
        <ArrowUpRight size={20} />
      </div>
    </div>
  );
}

export default function Section3() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activatedCount, setActivatedCount] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      setActivatedCount(technologies.length);
      return;
    }

    const context = gsap.context(() => {
      const whiteLetters = gsap.utils.toArray<HTMLElement>(
        ".arsenal-animated-word:not(.arsenal-animated-word-crimson) .arsenal-letter"
      );

      const redLetters = gsap.utils.toArray<HTMLElement>(
        ".arsenal-animated-word-crimson .arsenal-letter"
      );

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: ".arsenal-intro",
          start: "top 80%",
          once: true,
        },
      });

      intro
        .fromTo(
          whiteLetters,
          {
            autoAlpha: 0,
            yPercent: 115,
            rotateX: -75,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            duration: 0.85,
            stagger: 0.035,
            ease: "power4.out",
          }
        )
        .fromTo(
          redLetters,
          {
            autoAlpha: 0,
            yPercent: 125,
            rotateX: -80,
            filter: "blur(10px)",
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.055,
            ease: "power4.out",
          },
          "-=0.3"
        )
        .fromTo(
          ".arsenal-title-sweep",
          { xPercent: -120, opacity: 0 },
          {
            xPercent: 160,
            opacity: 1,
            duration: 0.85,
            ease: "power2.inOut",
          },
          "-=0.45"
        );

      const cards = gsap.utils.toArray<HTMLElement>(
        ".arsenal-card"
      );

      const count = { value: 0 };

      const cardsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".arsenal-grid",
          start: "top 83%",
          once: true,
        },
      });

      cardsTimeline
        .fromTo(
          cards,
          {
            autoAlpha: 0,
            y: 55,
            scale: 0.96,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.58,
            stagger: 0.105,
            ease: "power3.out",
            onStart: () => setActivatedCount(0),
          }
        )
        .to(
          count,
          {
            value: technologies.length,
            duration: 1.75,
            ease: "none",
            onUpdate: () => {
              setActivatedCount(
                Math.min(
                  technologies.length,
                  Math.floor(count.value)
                )
              );
            },
          },
          0
        );

      cards.forEach((card, index) => {
        cardsTimeline
          .fromTo(
            card.querySelector(".arsenal-card-activation"),
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.12,
              yoyo: true,
              repeat: 1,
              ease: "none",
            },
            index * 0.105 + 0.12
          )
          .fromTo(
            card.querySelector(".arsenal-card-scan"),
            { yPercent: -100, opacity: 0 },
            {
              yPercent: 250,
              opacity: 0.8,
              duration: 0.5,
              ease: "power2.in",
            },
            index * 0.105 + 0.08
          );
      });

      cardsTimeline.call(
        () => setActivatedCount(technologies.length),
        undefined,
        1.85
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="portfolio-section skills-section"
    >
      <div className="section-heading" data-section-reveal>
        <span className="section-number">
          03 / EXPERTISE
        </span>
        <span className="section-rule" />
      </div>

      <div className="arsenal-intro">
        <div className="arsenal-intro-copy">
          <p className="section-overline" data-section-reveal>
            MY TOOLKIT
          </p>

          <h2 className="section-display arsenal-kinetic-title">
            <span className="arsenal-title-line">
              <AnimatedWord text="BUILT WITH" />
            </span>

            <span className="arsenal-title-line arsenal-title-red">
              <AnimatedWord text="INTENT." crimson />
              <span className="arsenal-title-sweep" />
            </span>
          </h2>

          <p className="section-intro" data-section-reveal>
            The technologies behind the experiences.
            From scalable applications to immersive
            interfaces, every tool serves a purpose.
          </p>

          <div
            className="arsenal-capabilities"
            data-section-reveal
          >
            <span>
              <Layers3 size={17} />
              FRONTEND
            </span>

            <span>
              <Database size={17} />
              BACKEND
            </span>

            <span>
              <Sparkles size={17} />
              CREATIVE
            </span>
          </div>
        </div>

        <TechCore />
      </div>

      <div className="arsenal-grid-heading">
        <span>
          <Zap size={16} />
          ACTIVE TECHNOLOGIES
        </span>

        <span className="arsenal-live-counter">
          <strong>
            {String(activatedCount).padStart(2, "0")}
          </strong>
          <span> / 12 MODULES</span>
        </span>
      </div>

      <div className="arsenal-grid">
        {technologies.map((technology) => (
          <SkillCard
            key={technology.number}
            technology={technology}
          />
        ))}
      </div>

      <CertificateVault />
    </section>
  );
}
