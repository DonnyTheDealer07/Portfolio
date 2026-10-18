
import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ObsidianCore.css";

type ObsidianCoreProps = {
  active?: boolean;
};

export default function ObsidianCore({
  active = true,
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

    const outerGeometry = new THREE.IcosahedronGeometry(
      2.25,
      5
    );

    const positions = outerGeometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let index = 0; index < positions.count; index++) {
      vertex.fromBufferAttribute(positions, index);

      const normal = vertex.clone().normalize();

      const distortion =
        1 +
        0.13 *
          Math.sin(normal.x * 7.3 + normal.y * 4.1) *
          Math.cos(normal.z * 5.7 - normal.x * 3.2) +
        0.055 *
          Math.sin(normal.y * 13.1 + normal.z * 8.4);

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
    sculpture.add(outerMesh);

    const innerGeometry = new THREE.IcosahedronGeometry(
      2.19,
      2
    );

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
    sculpture.add(innerMesh);

    const edgeGeometry = new THREE.EdgesGeometry(
      new THREE.IcosahedronGeometry(2.265, 1),
      22
    );

    const edgeMaterial = new THREE.LineBasicMaterial({
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
    sculpture.add(edgeLines);

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

    const haloGeometry = new THREE.TorusGeometry(
      2.9,
      0.008,
      8,
      160
    );

    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0xff304f,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });

    const halo = new THREE.Mesh(
      haloGeometry,
      haloMaterial
    );
    halo.rotation.x = 1.12;
    halo.rotation.y = -0.4;
    sculpture.add(halo);

    const secondHalo = new THREE.Mesh(
      new THREE.TorusGeometry(
        3.15,
        0.004,
        8,
        160
      ),
      new THREE.MeshBasicMaterial({
        color: 0xff304f,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      })
    );

    secondHalo.rotation.x = 0.4;
    secondHalo.rotation.y = 1.2;
    sculpture.add(secondHalo);

    const particlesCount = 160;
    const particlePositions = new Float32Array(
      particlesCount * 3
    );

    for (let i = 0; i < particlesCount; i++) {
      const radius = 3.2 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] =
        radius * Math.sin(phi) * Math.cos(theta);

      particlePositions[i * 3 + 1] =
        radius * Math.cos(phi);

      particlePositions[i * 3 + 2] =
        radius * Math.sin(phi) * Math.sin(theta);
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

    const pointer = {
      x: 0,
      y: 0,
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();

      pointer.x =
        ((event.clientX - bounds.left) /
          bounds.width) *
          2 -
        1;

      pointer.y =
        ((event.clientY - bounds.top) /
          bounds.height) *
          2 -
        1;
    };

    const onPointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    container.addEventListener(
      "pointermove",
      onPointerMove
    );
    container.addEventListener(
      "pointerleave",
      onPointerLeave
    );

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

    const clock = new THREE.Clock();
    let frameId = 0;

    sculpture.rotation.set(
      -0.22,
      0.35,
      -0.12
    );

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const delta = Math.min(
        clock.getDelta(),
        0.05
      );

      const elapsed = clock.elapsedTime;

      if (activeRef.current && !reducedMotion) {
        sculpture.rotation.y += delta * 0.11;

        sculpture.rotation.x = THREE.MathUtils.lerp(
          sculpture.rotation.x,
          -0.22 + pointer.y * 0.16,
          0.025
        );

        sculpture.rotation.z = THREE.MathUtils.lerp(
          sculpture.rotation.z,
          -0.12 - pointer.x * 0.12,
          0.025
        );

        sculpture.position.y =
          Math.sin(elapsed * 0.55) * 0.13;

        halo.rotation.z += delta * 0.045;
        secondHalo.rotation.z -= delta * 0.035;

        particles.rotation.y += delta * 0.006;

        crimsonLight.intensity =
          100 +
          Math.sin(elapsed * 1.2) * 13;
      }

      renderer.render(scene, camera);
    };

    animate();

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
      haloGeometry.dispose();
      haloMaterial.dispose();
      secondHalo.geometry.dispose();
      (secondHalo.material as THREE.Material).dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

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
