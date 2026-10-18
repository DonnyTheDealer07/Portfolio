
import { useLayoutEffect, useRef } from "react";
import type { PointerEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import gsap from "gsap";

import ObsidianCore from "../../components/ObsidianCore/ObsidianCore";

import "./Hero.css";

type HeroProps = {
  ready: boolean;
  sequenceActive: boolean;
  replayKey: number;
};

export default function Hero({
  ready,
  sequenceActive,
  replayKey,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const coreWrapperRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const core = coreWrapperRef.current;
    const veil = veilRef.current;

    if (!hero || !core || !veil) return;

    const targets = Array.from(
      hero.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

      return;
    }

    const context = gsap.context(() => {
      // Prepare every element before the browser paints.
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

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // The darkness begins lifting as the panels open.
      timeline.to(
        veil,
        {
          autoAlpha: 0,
          duration: 1.4,
          ease: "power2.inOut",
        },
        0.05
      );

      // The Obsidian Core appears first.
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

      // Identity strip appears quietly.
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

      // Headline reveals line by line.
      const headline = targets.slice(1, 4);

      timeline.to(
        headline,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.05,
          stagger: 0.16,
        },
        0.72
      );

      // Description, buttons and footer follow.
      const supportingContent = targets.slice(4);

      timeline.to(
        supportingContent,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.95,
          stagger: 0.13,
        },
        1.1
      );
    }, hero);

    return () => {
      context.revert();
    };
  }, [ready, replayKey]);

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
    <section
      id="home"
      ref={heroRef}
      className="hero hero-obsidian hero-refined"
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
            <span
              data-reveal
              style={{ opacity: 0 }}
            >
              I BUILD
            </span>
          </span>

          <span className="hero-title-mask">
            <span
              data-reveal
              style={{ opacity: 0 }}
            >
              DIGITAL
            </span>
          </span>

          <span className="hero-title-mask">
            <span
              className="hero-title-accent"
              data-reveal
              style={{ opacity: 0 }}
            >
              EXPERIENCES.
            </span>
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
          <a
            className="hero-primary"
            href="#work"
          >
            EXPLORE MY WORK
            <ArrowUpRight size={17} />
          </a>

          <a
            className="hero-secondary"
            href="#contact"
          >
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
