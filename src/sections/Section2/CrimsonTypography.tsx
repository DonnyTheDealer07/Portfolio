
import { useRef } from "react";
import gsap from "gsap";
import "./CrimsonTypography.css";

export type CrimsonEffect =
  | "glitch"
  | "assemble"
  | "focus"
  | "wave";

type CrimsonTypographyProps = {
  text: string;
  effect: CrimsonEffect;
  className?: string;
};

export default function CrimsonTypography({
  text,
  effect,
  className = "",
}: CrimsonTypographyProps) {
  const rootRef = useRef<HTMLElement>(null);

  const handleEnter = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    if (
      window.matchMedia("(hover: none)").matches
    ) {
      return;
    }

    gsap.to(event.currentTarget, {
      y: -12,
      rotate: gsap.utils.random(-9, 9),
      scale: 1.13,
      textShadow: "0 0 24px rgba(255,48,79,.65)",
      duration: 0.35,
      ease: "back.out(2)",
      overwrite: "auto",
    });
  };

  const handleLeave = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    gsap.to(event.currentTarget, {
      y: 0,
      x: 0,
      rotate: 0,
      scale: 1,
      textShadow: "0 0 0px rgba(255,48,79,0)",
      duration: 0.55,
      ease: "elastic.out(1,0.55)",
      overwrite: "auto",
    });
  };

  return (
    <span
      ref={rootRef}
      className={`crimson-type crimson-${effect} ${className}`}
      data-crimson-effect={effect}
      aria-label={text}
    >
      {effect === "glitch" && (
        <>
          <span
            className="crimson-glitch-ghost crimson-glitch-ghost-a"
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="crimson-glitch-ghost crimson-glitch-ghost-b"
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}

      <span
        className="crimson-letters"
        aria-hidden="true"
      >
        {Array.from(text).map((character, index) => (
          <span
            key={`${index}-${character}`}
            className="crimson-letter-shell"
          >
            <span
              className="crimson-letter"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              {character === " " ? "\u00a0" : character}
            </span>
          </span>
        ))}
      </span>

      {effect === "wave" && (
        <span
          className="crimson-light-sweep"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
