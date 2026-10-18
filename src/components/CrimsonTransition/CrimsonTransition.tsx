
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./CrimsonTransition.css";

type Props = {
  onReveal: () => void;
  onComplete: () => void;
};

export default function CrimsonTransition({
  onReveal,
  onComplete,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onReveal, onComplete });

  callbacks.current = { onReveal, onComplete };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduce) {
      callbacks.current.onReveal();
      callbacks.current.onComplete();
      return;
    }

    const dot = root.querySelector(".transition-dot");
    const line = root.querySelector(".transition-line");
    const top = root.querySelector(".transition-top");
    const bottom = root.querySelector(".transition-bottom");
    const label = root.querySelector(".transition-label");

    const timeline = gsap.timeline({
      onComplete: () => {
        callbacks.current.onComplete();
      },
    });

    timeline
      // 1. Crimson dot appears.
      .fromTo(
        dot,
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.24,
          ease: "back.out(2)",
        }
      )

      // 2. Dot expands.
      .to(
        dot,
        {
          scale: 2.4,
          duration: 0.18,
          ease: "power2.in",
        },
        "+=0.15"
      )

      // 3. Crimson line expands.
      .fromTo(
        line,
        {
          scaleX: 0,
          opacity: 0,
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.72,
          ease: "power4.inOut",
        },
        "-=0.12"
      )

      .to(
        dot,
        {
          opacity: 0,
          duration: 0.15,
        },
        "<"
      )

      // 4. ENTERING PORTFOLIO appears.
      .fromTo(
        label,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.28"
      )

      // Give the message a moment to be read.
      .to(
        {},
        {
          duration: 0.45,
        }
      )

      // 5. ENTERING PORTFOLIO fades away.
      .to(label, {
        opacity: 0,
        y: -8,
        duration: 0.3,
        ease: "power2.inOut",
      })

      // 6. Black panels open.
      .addLabel("split")

      .to(
        top,
        {
          yPercent: -101,
          duration: 1.3,
          ease: "power3.inOut",
        },
        "split"
      )

      .to(
        bottom,
        {
          yPercent: 101,
          duration: 1.3,
          ease: "power3.inOut",
        },
        "split"
      )

      .to(
        line,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "split+=0.2"
      )

      // 7. Start hero animation once panels are open.
      .add(
        () => {
          callbacks.current.onReveal();
        },
        "split+=1.3"
      )

      // Finish the transition.
      .set(root, {
        pointerEvents: "none",
      });

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="crimson-transition"
      aria-hidden="true"
    >
      <div className="transition-top" />
      <div className="transition-bottom" />
      <div className="transition-dot" />
      <div className="transition-line" />

      <div className="transition-label">
        ENTERING PORTFOLIO
      </div>
    </div>
  );
}
