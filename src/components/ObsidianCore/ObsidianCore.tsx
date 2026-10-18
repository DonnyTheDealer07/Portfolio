
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

import "./ObsidianCore.css";

type PointerPosition = {
  x: number;
  y: number;
  inside: boolean;
};

type ObsidianCoreProps = {
  active?: boolean;
  pointerRef?: RefObject<PointerPosition>;
};

export default function ObsidianCore({
  active = true,
  pointerRef,
}: ObsidianCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const coarsePointer = window.matchMedia(
      "(pointer: coarse)"
    ).matches;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      container.classList.add("obsidian-fallback");
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.75)
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    // A transparent WebGL surface eliminates
    // the rectangular background behind the core.
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.setAttribute(
      "aria-hidden",
      "true"
    );

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      34,
      1,
      0.1,
      100
    );

    camera.position.set(0, 0, 9.6);

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const rotatingCore = new THREE.Group();
    sculpture.add(rotatingCore);

    // ----------------------------------------
    // FACETED OBSIDIAN GEOMETRY
    // ----------------------------------------

    const outerGeometry =
      new THREE.IcosahedronGeometry(2.25, 5);

    const positions = outerGeometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let index = 0; index < positions.count; index++) {
      vertex.fromBufferAttribute(positions, index);

      const normal = vertex.clone().normalize();

      const distortion =
        1 +
        0.13 *
          Math.sin(
            normal.x * 7.3 + normal.y * 4.1
          ) *
          Math.cos(
            normal.z * 5.7 - normal.x * 3.2
          ) +
        0.055 *
          Math.sin(
            normal.y * 13.1 + normal.z * 8.4
          );

      vertex.multiplyScalar(distortion);

      positions.setXYZ(
        index,
        vertex.x,
        vertex.y,
        vertex.z
      );
    }

    outerGeometry.computeVertexNormals();

    const obsidianMaterial =
      new THREE.MeshPhysicalMaterial({
        color: 0x090a10,
        metalness: 0.72,
        roughness: 0.21,
        clearcoat: 1,
        clearcoatRoughness: 0.14,
        flatShading: true,
        side: THREE.DoubleSide,
      });

    const outerMesh = new THREE.Mesh(
      outerGeometry,
      obsidianMaterial
    );

    rotatingCore.add(outerMesh);

    const innerGeometry =
      new THREE.IcosahedronGeometry(2.19, 2);

    const innerMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xff173e,
        wireframe: true,
        transparent: true,
        opacity: 0.075,
        depthWrite: false,
      });

    const innerMesh = new THREE.Mesh(
      innerGeometry,
      innerMaterial
    );

    rotatingCore.add(innerMesh);

    const edgeGeometry = new THREE.EdgesGeometry(
      new THREE.IcosahedronGeometry(2.265, 1),
      22
    );

    const edgeMaterial =
      new THREE.LineBasicMaterial({
        color: 0xff3153,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      });

    const edgeLines = new THREE.LineSegments(
      edgeGeometry,
      edgeMaterial
    );

    edgeLines.scale.setScalar(1.025);
    rotatingCore.add(edgeLines);

    // ----------------------------------------
    // LIGHTING
    // ----------------------------------------

    const ambient = new THREE.AmbientLight(
      0x65708b,
      1.6
    );

    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(
      0xe3e7ff,
      4.8
    );

    keyLight.position.set(-4, 5, 7);
    scene.add(keyLight);

    const crimsonLight = new THREE.PointLight(
      0xff174a,
      110,
      13,
      1.7
    );

    crimsonLight.position.set(3.2, -1.1, 3.4);
    scene.add(crimsonLight);

    const rimLight = new THREE.PointLight(
      0xff526b,
      65,
      12,
      1.6
    );

    rimLight.position.set(-3, -2.5, -2);
    scene.add(rimLight);

    const blueLight = new THREE.PointLight(
      0x607bb0,
      35,
      12,
      1.8
    );

    blueLight.position.set(0, 4, -3);
    scene.add(blueLight);

    // ----------------------------------------
    // INDEPENDENT ORBITAL ENERGY RINGS
    // ----------------------------------------

    const orbitGroup = new THREE.Group();
    sculpture.add(orbitGroup);

    const createOrbit = (
      radius: number,
      opacity: number,
      thickness: number,
      rotation: [number, number, number]
    ) => {
      const geometry = new THREE.TorusGeometry(
        radius,
        thickness,
        8,
        180
      );

      const material = new THREE.MeshBasicMaterial({
        color: 0xff304f,
        transparent: true,
        opacity,
        depthWrite: false,
      });

      const ring = new THREE.Mesh(
        geometry,
        material
      );

      ring.rotation.set(...rotation);
      orbitGroup.add(ring);

      const particleGeometry =
        new THREE.SphereGeometry(0.035, 8, 8);

      const particleMaterial =
        new THREE.MeshBasicMaterial({
          color: 0xff4867,
        });

      const particle = new THREE.Mesh(
        particleGeometry,
        particleMaterial
      );

      const particlePivot = new THREE.Group();
      particlePivot.rotation.copy(ring.rotation);

      particle.position.x = radius;
      particlePivot.add(particle);

      orbitGroup.add(particlePivot);

      return {
        ring,
        particlePivot,
        geometry,
        material,
        particleGeometry,
        particleMaterial,
      };
    };

    const orbits = [
      createOrbit(
        2.9,
        0.29,
        0.008,
        [1.12, -0.4, 0]
      ),
      createOrbit(
        3.15,
        0.17,
        0.005,
        [0.4, 1.2, 0]
      ),
      createOrbit(
        3.43,
        0.11,
        0.004,
        [1.65, 0.15, 0.3]
      ),
    ];

    // ----------------------------------------
    // EXISTING SCULPTURE PARTICLES
    // ----------------------------------------

    const particlesCount = 160;

    const particlePositions = new Float32Array(
      particlesCount * 3
    );

    for (let index = 0; index < particlesCount; index++) {
      const radius = 3.2 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(
        2 * Math.random() - 1
      );

      particlePositions[index * 3] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      particlePositions[index * 3 + 1] =
        radius * Math.cos(phi);

      particlePositions[index * 3 + 2] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);
    }

    const particlesGeometry =
      new THREE.BufferGeometry();

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        particlePositions,
        3
      )
    );

    const particlesMaterial =
      new THREE.PointsMaterial({
        color: 0xff4260,
        size: 0.025,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        sizeAttenuation: true,
      });

    const particles = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );

    scene.add(particles);

    // ----------------------------------------
    // POINTER TRACKING WITH WEIGHTED INERTIA
    // ----------------------------------------

    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const localPointer = {
      x: 0.5,
      y: 0.5,
      inside: false,
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerRef || coarsePointer) return;

      const bounds =
        container.getBoundingClientRect();

      localPointer.x =
        (event.clientX - bounds.left) /
        Math.max(bounds.width, 1);

      localPointer.y =
        (event.clientY - bounds.top) /
        Math.max(bounds.height, 1);

      localPointer.inside = true;
    };

    const onPointerLeave = () => {
      localPointer.inside = false;
    };

    container.addEventListener(
      "pointermove",
      onPointerMove
    );

    container.addEventListener(
      "pointerleave",
      onPointerLeave
    );

    // ----------------------------------------
    // RESPONSIVE CANVAS
    // ----------------------------------------

    const resize = () => {
      const width = Math.max(
        1,
        container.clientWidth
      );

      const height = Math.max(
        1,
        container.clientHeight
      );

      renderer.setSize(width, height, false);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(resize);

    observer.observe(container);
    resize();

    // ----------------------------------------
    // ANIMATION LOOP
    // ----------------------------------------

    const clock = new THREE.Clock();

    let frameId = 0;
    let lastElapsed = 0;

    sculpture.rotation.set(
      -0.22,
      0.35,
      -0.12
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (document.hidden) {
        lastElapsed = 0;
        return;
      }

      const elapsed = clock.getElapsedTime();

      const delta = lastElapsed
        ? Math.min(elapsed - lastElapsed, 0.05)
        : 0.016;

      lastElapsed = elapsed;

      const enabled =
        activeRef.current && !reducedMotion;

      const sharedPointer =
        pointerRef?.current ?? localPointer;

      const pointerEnabled =
        enabled &&
        !coarsePointer &&
        sharedPointer.inside;

      pointer.targetX = pointerEnabled
        ? (sharedPointer.x - 0.5) * 2
        : 0;

      pointer.targetY = pointerEnabled
        ? (sharedPointer.y - 0.5) * 2
        : 0;

      // Framerate-independent damping.
      const damping =
        1 - Math.exp(-4.5 * delta);

      pointer.x = THREE.MathUtils.lerp(
        pointer.x,
        pointer.targetX,
        damping
      );

      pointer.y = THREE.MathUtils.lerp(
        pointer.y,
        pointer.targetY,
        damping
      );

      if (enabled) {
        // Natural idle rotation is preserved.
        rotatingCore.rotation.y += delta * 0.11;

        // The entire sculpture responds to the
        // cursor without snapping or jerking.
        sculpture.rotation.x =
          THREE.MathUtils.lerp(
            sculpture.rotation.x,
            -0.22 + pointer.y * 0.27,
            damping
          );

        sculpture.rotation.y =
          THREE.MathUtils.lerp(
            sculpture.rotation.y,
            0.35 + pointer.x * 0.34,
            damping
          );

        sculpture.rotation.z =
          THREE.MathUtils.lerp(
            sculpture.rotation.z,
            -0.12 - pointer.x * 0.13,
            damping
          );

        sculpture.position.y =
          Math.sin(elapsed * 0.55) * 0.13;

        // Rings rotate independently.
        orbits[0].ring.rotation.z +=
          delta * 0.06;

        orbits[1].ring.rotation.z -=
          delta * 0.045;

        orbits[2].ring.rotation.z +=
          delta * 0.035;

        // Particles orbit the sculpture.
        orbits[0].particlePivot.rotation.z +=
          delta * 0.24;

        orbits[1].particlePivot.rotation.z -=
          delta * 0.19;

        orbits[2].particlePivot.rotation.z +=
          delta * 0.14;

        particles.rotation.y +=
          delta * 0.006;

        // Crimson lighting follows the pointer.
        crimsonLight.position.x =
          THREE.MathUtils.lerp(
            crimsonLight.position.x,
            3.2 + pointer.x * 3,
            damping * 0.75
          );

        crimsonLight.position.y =
          THREE.MathUtils.lerp(
            crimsonLight.position.y,
            -1.1 - pointer.y * 2.5,
            damping * 0.75
          );

        crimsonLight.intensity =
          100 +
          Math.sin(elapsed * 1.2) * 13 +
          Math.abs(pointer.x) * 15;

        rimLight.intensity =
          65 +
          Math.sin(elapsed * 0.7) * 8;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ----------------------------------------
    // CLEANUP
    // ----------------------------------------

    return () => {
      cancelAnimationFrame(frameId);

      observer.disconnect();

      container.removeEventListener(
        "pointermove",
        onPointerMove
      );

      container.removeEventListener(
        "pointerleave",
        onPointerLeave
      );

      outerGeometry.dispose();
      obsidianMaterial.dispose();

      innerGeometry.dispose();
      innerMaterial.dispose();

      edgeGeometry.dispose();
      edgeMaterial.dispose();

      particlesGeometry.dispose();
      particlesMaterial.dispose();

      for (const orbit of orbits) {
        orbit.geometry.dispose();
        orbit.material.dispose();
        orbit.particleGeometry.dispose();
        orbit.particleMaterial.dispose();
      }

      renderer.dispose();

      if (
        renderer.domElement.parentNode === container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, [pointerRef]);

  return (
    <div
      ref={containerRef}
      className="obsidian-core"
      aria-hidden="true"
    >
      <div className="obsidian-core-fallback" />
    </div>
  );
}
