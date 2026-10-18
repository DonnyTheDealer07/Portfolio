
import { useEffect, useRef } from "react";
import "./AboutAtmosphere.css";

type Mode = "network" | "singularity";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  radius: number;
};

export default function AboutAtmosphere({
  mode,
}: {
  mode: Mode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", {
      alpha: true,
    });
    if (!context) return;

    const ctx = context;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const host = canvas.parentElement;
    if (!host) return;

    let width = 1;
    let height = 1;
    let frame = 0;
    let raf = 0;
    let visible = true;
    let particles: Particle[] = [];

    const pointer = {
      x: -10000,
      y: -10000,
    };

    function resize() {
      const rect = host!.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      const ratio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count =
        mode === "network"
          ? Math.min(
              100,
              Math.max(
                40,
                Math.round(
                  (width * height) / 17000
                )
              )
            )
          : 145;

      particles = Array.from(
        { length: count },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          phase: Math.random() * Math.PI * 2,
          radius: Math.random() * 1.5 + 0.5,
        })
      );

      draw();
    }

    function drawNetwork() {
      const maxDistance = Math.min(
        165,
        width * 0.17
      );

      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        const a = particles[i];

        if (!reduced) {
          a.x += a.vx;
          a.y += a.vy;

          if (a.x < 0 || a.x > width) {
            a.vx *= -1;
          }

          if (a.y < 0 || a.y > height) {
            a.vy *= -1;
          }
        }

        const dx = a.x - pointer.x;
        const dy = a.y - pointer.y;
        const dist = Math.hypot(dx, dy);

        if (
          dist < 160 &&
          dist > 0 &&
          !reduced
        ) {
          a.x += (dx / dist) * 0.65;
          a.y += (dy / dist) * 0.65;
        }

        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const b = particles[j];

          const d = Math.hypot(
            a.x - b.x,
            a.y - b.y
          );

          if (d < maxDistance) {
            ctx.strokeStyle =
              `rgba(255,48,79,${(1 - d / maxDistance) * 0.22})`;

            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle =
          `rgba(255,72,103,${0.32 + Math.sin(frame * 0.015 + a.phase) * 0.13})`;

        ctx.beginPath();
        ctx.arc(
          a.x,
          a.y,
          a.radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    function drawSingularity() {
      const cx = width * 0.52;
      const cy = height * 0.49;
      const base =
        Math.min(width, height) * 0.19;

      const glow = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        base * 2.6
      );

      glow.addColorStop(
        0,
        "rgba(255,48,79,0.23)"
      );
      glow.addColorStop(
        0.3,
        "rgba(190,18,54,0.13)"
      );
      glow.addColorStop(
        1,
        "rgba(190,18,54,0)"
      );

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (
        let ring = 0;
        ring < 4;
        ring++
      ) {
        ctx.beginPath();

        ctx.ellipse(
          cx,
          cy,
          base * (1 + ring * 0.33),
          base * (0.38 + ring * 0.15),
          -0.3,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle =
          `rgba(255,48,79,${0.19 - ring * 0.032})`;

        ctx.lineWidth =
          ring === 0 ? 1.4 : 0.75;

        ctx.stroke();
      }

      particles.forEach((p, i) => {
        const t =
          p.phase +
          (reduced
            ? 0
            : frame *
              (0.0018 +
                (i % 5) * 0.00022));

        const r =
          base *
          (0.75 + (i % 9) * 0.105);

        const x =
          cx + Math.cos(t) * r;
        const y =
          cy + Math.sin(t) * r * 0.47;

        ctx.fillStyle =
          `rgba(255,${48 + (i % 4) * 15},${79 + (i % 4) * 10},${0.3 + (i % 5) * 0.12})`;

        ctx.beginPath();
        ctx.arc(
          x,
          y,
          p.radius * 0.85,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      const pulse = reduced
        ? 1
        : 1 +
          Math.sin(frame * 0.028) * 0.12;

      const core = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        base * 0.25 * pulse
      );

      core.addColorStop(
        0,
        "rgba(255,185,193,0.95)"
      );
      core.addColorStop(
        0.12,
        "rgba(255,48,79,0.8)"
      );
      core.addColorStop(
        0.55,
        "rgba(255,48,79,0.2)"
      );
      core.addColorStop(
        1,
        "rgba(255,48,79,0)"
      );

      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(
        cx,
        cy,
        base * 0.25 * pulse,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      if (mode === "network") {
        drawNetwork();
      } else {
        drawSingularity();
      }
    }

    function tick() {
      if (!visible) return;

      frame++;
      draw();

      raf = requestAnimationFrame(tick);
    }

    const onPointer = (
      event: PointerEvent
    ) => {
      const rect =
        host!.getBoundingClientRect();

      pointer.x =
        event.clientX - rect.left;
      pointer.y =
        event.clientY - rect.top;
    };

    const onLeave = () => {
      pointer.x = -10000;
      pointer.y = -10000;
    };

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          cancelAnimationFrame(raf);

          if (visible && !reduced) {
            raf =
              requestAnimationFrame(tick);
          } else if (visible) {
            draw();
          }
        },
        {
          threshold: 0.01,
        }
      );

    const resizeObserver =
      new ResizeObserver(resize);

    resizeObserver.observe(host);
    observer.observe(host);

    host.addEventListener(
      "pointermove",
      onPointer
    );
    host.addEventListener(
      "pointerleave",
      onLeave
    );

    resize();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();

      host.removeEventListener(
        "pointermove",
        onPointer
      );
      host.removeEventListener(
        "pointerleave",
        onLeave
      );
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      className={`about-atmosphere about-atmosphere-${mode}`}
      aria-hidden="true"
    />
  );
}
