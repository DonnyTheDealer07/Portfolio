
import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import "./cinematicIntro.css";

type Props = {
  mode: "full" | "reduced";
  onComplete: () => void;
};

type TextParticles = {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  positions: Float32Array;
  origins: Float32Array;
  velocities: Float32Array;
};

const NAME = "CORNÉ CARELSE";
const SUBTITLE = "REACT DEVELOPER";

const fogVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fogFragment = `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uExplosion;
  uniform vec2 uResolution;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(19.1, 7.3);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    float t = uTime * 0.085;

    float outward = 1.0 + uExplosion * 0.8;
    vec2 smokeUV = p / outward;

    vec2 warp = vec2(
      fbm(smokeUV * 1.7 + vec2(t, -t * 0.45)),
      fbm(smokeUV * 1.7 + vec2(-t * 0.6, t))
    );

    vec2 flow = smokeUV + (warp - 0.5) * 0.48;

    float largeCloud = fbm(
      flow * 2.7 + vec2(-t * 0.4, t * 0.7)
    );

    float details = fbm(
      flow * 6.0 + warp * 1.5 + vec2(t * 0.5, -t)
    );

    float wisps = fbm(
      flow * 10.0 + vec2(-t * 0.8, t * 0.3)
    );

    float cloud =
      largeCloud * 0.7 +
      details * 0.24 +
      wisps * 0.06;

    float density = smoothstep(0.34, 0.69, cloud);

    float center = exp(
      -dot(
        p * vec2(0.9, 1.4),
        p * vec2(0.9, 1.4)
      ) * 1.5
    );

    float lowerMist = exp(
      -pow((p.y + 0.18) * 2.4, 2.0)
    );

    float coverage = max(
      center * 0.8,
      lowerMist * 0.65
    );

    density *= coverage;
    density *= 1.0 - smoothstep(
      0.15,
      1.25,
      length(p)
    );

    vec3 darkRed = vec3(0.14, 0.008, 0.025);
    vec3 crimson = vec3(0.68, 0.035, 0.12);
    vec3 highlight = vec3(1.0, 0.18, 0.24);

    float brightness = smoothstep(
      0.42,
      0.8,
      cloud
    );

    vec3 color = mix(
      darkRed,
      crimson,
      brightness
    );

    color = mix(
      color,
      highlight,
      pow(brightness, 4.0) * 0.45
    );

    float pulse =
      0.9 + sin(uTime * 0.55) * 0.1;

    float burst =
      1.0 + uExplosion * 0.65;

    float alpha =
      density * 1.85 * pulse * burst * uOpacity;

    gl_FragColor = vec4(
      color,
      clamp(alpha, 0.0, 0.92)
    );
  }
`;

function makeTextParticles(
  element: HTMLElement,
  camera: THREE.PerspectiveCamera
): TextParticles {
  const rect = element.getBoundingClientRect();

  const scale = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  const canvas = document.createElement("canvas");

  canvas.width = Math.max(
    1,
    Math.ceil(rect.width * scale)
  );

  canvas.height = Math.max(
    1,
    Math.ceil(rect.height * scale)
  );

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!ctx) {
    throw new Error("Canvas 2D unavailable");
  }

  const style = getComputedStyle(element);
  const fontSize = parseFloat(style.fontSize);
  const letterSpacing =
    parseFloat(style.letterSpacing) || 0;

  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
  ctx.letterSpacing = `${letterSpacing}px`;

  ctx.fillText(
    NAME,
    rect.width / 2,
    rect.height / 2,
    rect.width
  );

  const pixels = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const samples: [number, number][] = [];

  const step =
    window.innerWidth < 768 ? 3 : 4;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const alpha =
        pixels.data[
          (y * canvas.width + x) * 4 + 3
        ];

      if (
        alpha > 110 &&
        Math.random() > 0.12
      ) {
        samples.push([
          x / scale,
          y / scale,
        ]);
      }
    }
  }

  const count = samples.length;

  const positions = new Float32Array(
    count * 3
  );

  const origins = new Float32Array(
    count * 3
  );

  const velocities = new Float32Array(
    count * 3
  );

  const colors = new Float32Array(
    count * 3
  );

  const height =
    2 *
    Math.tan(
      THREE.MathUtils.degToRad(camera.fov) / 2
    ) *
    camera.position.z;

  const unit =
    height / window.innerHeight;

  const crimson = new THREE.Color("#ff304f");
  const hotCrimson = new THREE.Color("#ff6577");
  const deepRed = new THREE.Color("#a81932");
  const white = new THREE.Color("#fff1f2");

  for (let i = 0; i < count; i++) {
    const j = i * 3;
    const [x, y] = samples[i];

    const worldX =
      (rect.left +
        x -
        window.innerWidth / 2) *
      unit;

    const worldY =
      (window.innerHeight / 2 -
        rect.top -
        y) *
      unit;

    positions[j] = origins[j] = worldX;

    positions[j + 1] =
      origins[j + 1] =
      worldY;

    positions[j + 2] =
      origins[j + 2] =
      0;

    const power =
      1.1 + Math.random() * 2.5;

    velocities[j] =
      (
        worldX * 0.38 +
        (Math.random() - 0.5) * 1.5
      ) * power;

    velocities[j + 1] =
      (
        worldY * 0.4 +
        (Math.random() - 0.5) * 1.1
      ) * power;

    velocities[j + 2] =
      (Math.random() * 3.2 - 0.65) *
      power;

    const random = Math.random();

    const color =
      random < 0.08
        ? white
        : random < 0.28
          ? hotCrimson
          : random < 0.86
            ? crimson
            : deepRed;

    colors[j] = color.r;
    colors[j + 1] = color.g;
    colors[j + 2] = color.b;
  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3
    )
  );

  geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(
      colors,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      size:
        window.innerWidth < 768
          ? 2.5
          : 3.5,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

  const points = new THREE.Points(
    geometry,
    material
  );

  points.frustumCulled = false;
  points.renderOrder = 2;

  return {
    points,
    geometry,
    material,
    positions,
    origins,
    velocities,
  };
}

function NameLetters({
  crimson = false,
}: {
  crimson?: boolean;
}) {
  return (
    <>
      {Array.from(NAME).map(
        (character, index) => (
          <span
            key={`${index}-${character}`}
            className={
              crimson
                ? "intro-letter intro-letter-crimson"
                : "intro-letter intro-letter-white"
            }
            aria-hidden="true"
          >
            {character === " "
              ? "\u00A0"
              : character}
          </span>
        )
      )}
    </>
  );
}

export default function CinematicIntro({
  mode,
  onComplete,
}: Props) {
  const rootRef =
    useRef<HTMLDivElement>(null);

  const nameRef =
    useRef<HTMLHeadingElement>(null);

  const subtitleRef =
    useRef<HTMLParagraphElement>(null);

  const mountRef =
    useRef<HTMLDivElement>(null);

  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (mode !== "full") return;

    const root = rootRef.current;
    const name = nameRef.current;
    const subtitle = subtitleRef.current;
    const mount = mountRef.current;

    if (
      !root ||
      !name ||
      !subtitle ||
      !mount
    ) {
      return;
    }

    let disposed = false;
    let frameId = 0;

    let timeline:
      | gsap.core.Timeline
      | null = null;

    let textParticles:
      | TextParticles
      | null = null;

    let renderer:
      | THREE.WebGLRenderer
      | null = null;

    const scene = new THREE.Scene();

    const camera =
      new THREE.PerspectiveCamera(
        55,
        window.innerWidth /
          window.innerHeight,
        0.1,
        100
      );

    camera.position.z = 10;

    const uniforms = {
      uTime: {
        value: 0,
      },
      uOpacity: {
        value: 1,
      },
      uExplosion: {
        value: 0,
      },
      uResolution: {
        value: new THREE.Vector2(
          window.innerWidth,
          window.innerHeight
        ),
      },
    };

    const fogGeometry =
      new THREE.PlaneGeometry(1, 1);

    const fogMaterial =
      new THREE.ShaderMaterial({
        vertexShader: fogVertex,
        fragmentShader: fogFragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

    const fogMesh = new THREE.Mesh(
      fogGeometry,
      fogMaterial
    );

    fogMesh.position.z = -4;
    fogMesh.renderOrder = -1;

    scene.add(fogMesh);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const distance =
        camera.position.z -
        fogMesh.position.z;

      const visibleHeight =
        2 *
        Math.tan(
          THREE.MathUtils.degToRad(
            camera.fov
          ) / 2
        ) *
        distance;

      fogMesh.scale.set(
        visibleHeight * camera.aspect,
        visibleHeight,
        1
      );

      uniforms.uResolution.value.set(
        width,
        height
      );

      renderer?.setSize(width, height);
    };

    try {
      renderer =
        new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference:
            "high-performance",
        });

      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          2
        )
      );

      renderer.setClearColor(
        0x000000,
        0
      );

      renderer.outputColorSpace =
        THREE.SRGBColorSpace;

      mount.appendChild(
        renderer.domElement
      );

      resize();
    } catch (error) {
      console.warn(
        "WebGL unavailable:",
        error
      );

      renderer?.dispose();
      renderer = null;
    }

    const whiteLetters =
      name.querySelectorAll<HTMLElement>(
        ".intro-letter-white"
      );

    const subtitleLetters =
      subtitle.querySelectorAll<HTMLElement>(
        ".intro-subtitle-letter"
      );

    const crimsonOverlay =
      name.querySelector<HTMLElement>(
        ".intro-name-crimson"
      );

    if (!crimsonOverlay) {
      renderer?.dispose();
      renderer?.domElement.remove();
      fogGeometry.dispose();
      fogMaterial.dispose();
      return;
    }

    gsap.set(whiteLetters, {
      opacity: 0,
      y: 65,
      rotateX: -75,
      filter: "blur(14px)",
    });

    gsap.set(subtitleLetters, {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    });

    gsap.set(crimsonOverlay, {
      "--takeover": "0%",
    });

    const state = {
      explosion: 0,
      textOpacity: 0,
    };

    const startTime =
      performance.now();

    const render = () => {
      if (disposed) return;

      uniforms.uTime.value =
        (performance.now() -
          startTime) /
        1000;

      if (textParticles) {
        const {
          positions,
          origins,
          velocities,
          geometry,
          material,
        } = textParticles;

        const t = state.explosion;

        for (
          let i = 0;
          i < positions.length;
          i += 3
        ) {
          positions[i] =
            origins[i] +
            velocities[i] * t;

          positions[i + 1] =
            origins[i + 1] +
            velocities[i + 1] * t -
            t * t * 0.14;

          positions[i + 2] =
            origins[i + 2] +
            velocities[i + 2] * t;
        }

        geometry.attributes.position.needsUpdate =
          true;

        material.opacity =
          state.textOpacity;
      }

      renderer?.render(
        scene,
        camera
      );

      frameId =
        requestAnimationFrame(render);
    };

    if (renderer) {
      render();
    }

    window.addEventListener(
      "resize",
      resize
    );

    const start = () => {
      if (disposed) return;

      if (renderer) {
        try {
          textParticles =
            makeTextParticles(
              name,
              camera
            );

          scene.add(
            textParticles.points
          );
        } catch (error) {
          console.warn(
            "Text sampling failed:",
            error
          );
        }
      }

      timeline = gsap.timeline({
        onComplete: () => {
          if (!disposed) {
            completeRef.current();
          }
        },
      });

      timeline
        .to(whiteLetters, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.055,
          ease: "power3.out",
        })
        .to(
          subtitleLetters,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.035,
            ease: "power2.out",
          },
          "-=0.25"
        )
        .addLabel(
          "takeover",
          "+=0.45"
        )
        .to(
          crimsonOverlay,
          {
            "--takeover": "100%",
            duration: 1.55,
            ease: "power2.inOut",
          },
          "takeover"
        )
        .to(
          name,
          {
            textShadow:
              "0 0 24px rgba(255,48,79,.45), 0 0 90px rgba(255,48,79,.3)",
            duration: 0.65,
          },
          "takeover+=0.85"
        )
        .addLabel(
          "charged",
          "takeover+=2.05"
        )
        .to(
          name,
          {
            x: () =>
              gsap.utils.random(
                -1.3,
                1.3
              ),
            y: () =>
              gsap.utils.random(
                -0.8,
                0.8
              ),
            duration: 0.045,
            repeat: 7,
            yoyo: true,
            ease: "none",
          },
          "charged"
        )
        .to(
          root,
          {
            "--intro-flash": 0.32,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
          },
          "charged+=0.36"
        )
        .addLabel(
          "explode",
          "charged+=0.58"
        )
        .set(
          name,
          {
            visibility: "hidden",
          },
          "explode"
        )
        .to(
          subtitleLetters,
          {
            opacity: 0,
            y: 30,
            duration: 0.3,
          },
          "explode"
        )
        .set(
          state,
          {
            textOpacity: 1,
          },
          "explode"
        )
        .to(
          state,
          {
            explosion: 2.6,
            duration: 1.65,
            ease: "power3.in",
          },
          "explode"
        )
        .to(
          uniforms.uExplosion,
          {
            value: 2.4,
            duration: 1.5,
            ease: "power2.out",
          },
          "explode"
        )
        .to(
          state,
          {
            textOpacity: 0,
            duration: 1,
          },
          "explode+=0.55"
        )
        .to(
          uniforms.uOpacity,
          {
            value: 0,
            duration: 1.1,
          },
          "explode+=0.6"
        )
        .to(
          root,
          {
            opacity: 0,
            duration: 0.5,
          },
          "explode+=1.35"
        );
    };

    document.fonts.ready
      .then(start)
      .catch(start);

    return () => {
      disposed = true;

      timeline?.kill();

      cancelAnimationFrame(
        frameId
      );

      window.removeEventListener(
        "resize",
        resize
      );

      if (textParticles) {
        scene.remove(
          textParticles.points
        );

        textParticles.geometry.dispose();
        textParticles.material.dispose();
      }

      scene.remove(fogMesh);

      fogGeometry.dispose();
      fogMaterial.dispose();

      renderer?.dispose();
      renderer?.domElement.remove();

      gsap.killTweensOf([
        root,
        name,
        crimsonOverlay,
        ...Array.from(whiteLetters),
        ...Array.from(subtitleLetters),
      ]);
    };
  }, [mode]);

  return (
    <div
      ref={rootRef}
      className={`cinematic-intro ${
        mode === "reduced"
          ? "is-reduced"
          : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio introduction"
    >
      <div className="intro-static-background" />
      <div className="intro-grid" />
      <div className="intro-vignette" />
      <div className="intro-flash" />

      {mode === "full" && (
        <div
          className="intro-particles"
          ref={mountRef}
          aria-hidden="true"
        />
      )}

      <div className="intro-content">
        <div className="intro-eyebrow">
          <span className="intro-eyebrow-line" />
          PORTFOLIO / 2026
          <span className="intro-eyebrow-line" />
        </div>

        <h1
          ref={nameRef}
          className="intro-name"
          aria-label={NAME}
        >
          <span className="intro-name-white">
            <NameLetters />
          </span>

          <span
            className="intro-name-crimson"
            aria-hidden="true"
          >
            <NameLetters crimson />
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="intro-subtitle"
          aria-label={SUBTITLE}
        >
          {Array.from(SUBTITLE).map(
            (character, index) => (
              <span
                key={`${index}-${character}`}
                className="intro-subtitle-letter"
                aria-hidden="true"
              >
                {character === " "
                  ? "\u00A0"
                  : character}
              </span>
            )
          )}
        </p>

        {mode === "reduced" && (
          <div className="intro-accessible-actions">
            <p>
              Welcome to my portfolio.
              Explore my work, projects
              and development experience.
            </p>

            <button
              type="button"
              className="intro-continue"
              onClick={() =>
                completeRef.current()
              }
            >
              EXPLORE PORTFOLIO
              <span aria-hidden="true">
                ↗
              </span>
            </button>
          </div>
        )}
      </div>

      {mode === "full" && (
        <button
          type="button"
          className="intro-skip"
          onClick={() =>
            completeRef.current()
          }
        >
          SKIP INTRO
          <span aria-hidden="true">
            ↗
          </span>
        </button>
      )}

      <div className="intro-bottom">
        <span>
          {mode === "reduced"
            ? "WELCOME TO MY PORTFOLIO"
            : "INITIALIZING EXPERIENCE"}
        </span>

        <span className="intro-bottom-dot" />

        <span>
          DESIGNED TO BE DIFFERENT
        </span>
      </div>
    </div>
  );
}
