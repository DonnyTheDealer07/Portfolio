import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  CSSProperties,
  PointerEvent,
} from "react";

import "./CyberPortrait.css";

const HUMAN_IMAGE =
  "/Serious Curly-Haired Man in Hoodie.png";

const CYBER_IMAGE = "/Cyber.png";

const SCRAMBLE_CHARS = "01X#%<>/+-_";

const ONLINE_MESSAGE = "NEURAL LINK ESTABLISHED";
const OFFLINE_MESSAGE = "HUMAN // MACHINE";

type Position = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function CyberPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const scrambleTimerRef = useRef<number | null>(null);

  const pointerRef = useRef<Position>({
    x: 50,
    y: 48,
  });

  const [position, setPosition] = useState<Position>({
    x: 50,
    y: 48,
  });

  const [hovered, setHovered] = useState(false);
  const [locked, setLocked] = useState(false);
  const [cyberLoaded, setCyberLoaded] = useState(false);
  const [cyberError, setCyberError] = useState(false);
  const [statusText, setStatusText] = useState(
    OFFLINE_MESSAGE
  );
  const [scanning, setScanning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const active = hovered || locked;
  const transformed = active && cyberLoaded;

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const updatePosition = useCallback(() => {
    setPosition({ ...pointerRef.current });
    frameRef.current = null;
  }, []);

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (event.pointerType === "touch") return;

    const element = containerRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    pointerRef.current = {
      x: clamp(
        ((event.clientX - rect.left) / rect.width) * 100,
        0,
        100
      ),
      y: clamp(
        ((event.clientY - rect.top) / rect.height) * 100,
        0,
        100
      ),
    };

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(updatePosition);
    }

    setHovered(true);
  };

  const handlePointerLeave = () => {
    setHovered(false);
  };

  const toggleTransformation = () => {
    setLocked((previous) => !previous);
  };

  useEffect(() => {
    if (scrambleTimerRef.current !== null) {
      clearInterval(scrambleTimerRef.current);
      scrambleTimerRef.current = null;
    }

    const target = transformed
      ? ONLINE_MESSAGE
      : OFFLINE_MESSAGE;

    if (reducedMotion) {
      setStatusText(target);
      return;
    }

    let iteration = 0;

    scrambleTimerRef.current = window.setInterval(() => {
      const result = target
        .split("")
        .map((character, index) => {
          if (character === " ") return " ";
          if (index < iteration) return character;

          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
        })
        .join("");

      setStatusText(result);
      iteration += 0.8;

      if (iteration >= target.length) {
        setStatusText(target);

        if (scrambleTimerRef.current !== null) {
          clearInterval(scrambleTimerRef.current);
          scrambleTimerRef.current = null;
        }
      }
    }, 28);

    return () => {
      if (scrambleTimerRef.current !== null) {
        clearInterval(scrambleTimerRef.current);
        scrambleTimerRef.current = null;
      }
    };
  }, [transformed, reducedMotion]);

  useEffect(() => {
    if (!transformed || reducedMotion) {
      setScanning(false);
      return;
    }

    setScanning(false);

    const start = window.setTimeout(() => {
      setScanning(true);
    }, 20);

    const end = window.setTimeout(() => {
      setScanning(false);
    }, 850);

    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [transformed, reducedMotion]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const eyeX = 58;
  const eyeY = 48;

  const distance = Math.hypot(
    position.x - eyeX,
    position.y - eyeY
  );

  const eyeActive =
    transformed && (locked || distance < 23);

  const variables = {
    "--reveal-x": `${position.x}%`,
    "--reveal-y": `${position.y}%`,
    "--eye-x": `${eyeX}%`,
    "--eye-y": `${eyeY}%`,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={[
        "cyber-portrait",
        active ? "cyber-portrait--active" : "",
        locked ? "cyber-portrait--locked" : "",
        scanning ? "cyber-portrait--scanning" : "",
        eyeActive ? "cyber-portrait--eye-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={variables}
      onPointerMove={handlePointerMove}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") {
          setHovered(true);
        }
      }}
      onPointerLeave={handlePointerLeave}
      onClick={toggleTransformation}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleTransformation();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={locked}
      aria-label="Toggle cybernetic portrait transformation"
    >
      {/* PURE BLACK BACKGROUND */}
      <div className="cyber-portrait__background" />

      {/* HUMAN PORTRAIT */}
      <div className="cyber-portrait__image-layer">
        <img
          src={HUMAN_IMAGE}
          alt="Corné Carelse"
          className="cyber-portrait__image cyber-portrait__human"
          draggable={false}
        />
      </div>

      {/* CYBERNETIC REVEAL */}
      <div className="cyber-portrait__reveal">
        <div className="cyber-portrait__image-layer">
          <img
            src={CYBER_IMAGE}
            alt=""
            aria-hidden="true"
            className="cyber-portrait__image cyber-portrait__machine"
            draggable={false}
            onLoad={() => {
              setCyberLoaded(true);
              setCyberError(false);
            }}
            onError={() => {
              setCyberLoaded(false);
              setCyberError(true);
            }}
          />
        </div>

        <div className="cyber-portrait__cyber-glow" />
      </div>

      {/* CYBERNETIC EYE */}
      <div
        className="cyber-portrait__eye-glow"
        aria-hidden="true"
      />

      {/* SCANNING BEAM */}
      <div
        className="cyber-portrait__scanner"
        aria-hidden="true"
      />

      {/* REACTIVE HUD */}
      <div
        className="cyber-portrait__hud"
        aria-hidden="true"
      >
        <span className="cyber-portrait__hud-ring cyber-portrait__hud-ring--one" />
        <span className="cyber-portrait__hud-ring cyber-portrait__hud-ring--two" />
        <span className="cyber-portrait__hud-crosshair" />

        <span className="cyber-portrait__hud-coordinate">
          X {position.x.toFixed(0).padStart(3, "0")}
          {" / "}
          Y {position.y.toFixed(0).padStart(3, "0")}
        </span>

        <span className="cyber-portrait__hud-label">
          SYS // 07
        </span>
      </div>

      <div className="cyber-portrait__vignette" />

      {/* SMALL STATUS TEXT ONLY */}
      <div className="cyber-portrait__status">
        <span
          className={`cyber-portrait__status-dot ${
            transformed ? "is-active" : ""
          }`}
        />

        <span>
          {cyberError
            ? "CYBERNETIC IMAGE MISSING"
            : statusText}
        </span>
      </div>

      {/* MOBILE INSTRUCTION */}
      <span className="cyber-portrait__mobile-hint">
        TAP TO TRANSFORM
      </span>
    </div>
  );
}