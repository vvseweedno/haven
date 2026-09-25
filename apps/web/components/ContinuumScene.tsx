"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ContinuumScene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    let pointerX = 0;
    let pointerY = 0;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      });
    } catch {
      element.dataset.webgl = "unavailable";
      const fallback = document.createElement("div");
      fallback.className = "continuum-scene-fallback";
      fallback.setAttribute("aria-hidden", "true");
      element.appendChild(fallback);
      return () => fallback.remove();
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "continuum-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    const group = new THREE.Group();
    scene.add(group);

    const nodeCount = 96;
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const palette = [
      new THREE.Color("#9cc9ac"),
      new THREE.Color("#7fb8c8"),
      new THREE.Color("#d5bd80"),
      new THREE.Color("#bcaeda"),
      new THREE.Color("#ecaa95"),
    ];

    for (let i = 0; i < nodeCount; i++) {
      const ring = 1.25 + (i % 7) * 0.34;
      const angle = i * 2.39996;
      const z = Math.sin(i * 0.73) * 1.15;
      positions[i * 3] = Math.cos(angle) * ring + Math.sin(i * 1.7) * 0.18;
      positions[i * 3 + 1] =
        Math.sin(angle) * ring * 0.72 + Math.cos(i * 0.91) * 0.24;
      positions[i * 3 + 2] = z;
      const color = palette[i % palette.length];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
      }),
    );
    group.add(points);

    const linePositions: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if ((i + j) % 11 !== 0) continue;
        const ax = positions[i * 3];
        const ay = positions[i * 3 + 1];
        const az = positions[i * 3 + 2];
        const bx = positions[j * 3];
        const by = positions[j * 3 + 1];
        const bz = positions[j * 3 + 2];
        const distance = Math.hypot(ax - bx, ay - by, az - bz);
        if (distance > 1.55) continue;
        linePositions.push(ax, ay, az, bx, by, bz);
      }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3),
    );
    const lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: "#8fbfa7",
        transparent: true,
        opacity: 0.22,
      }),
    );
    group.add(lines);

    const rings = [
      { radius: 2.35, color: "#9cc9ac", y: 0.35, z: 0.13 },
      { radius: 2.95, color: "#7fb8c8", y: -0.52, z: -0.22 },
      { radius: 3.42, color: "#d5bd80", y: 0.86, z: 0.4 },
    ].map((ring, index) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(ring.radius, 0.0045, 8, 180),
        new THREE.MeshBasicMaterial({
          color: ring.color,
          transparent: true,
          opacity: 0.42 - index * 0.08,
        }),
      );
      mesh.rotation.x = Math.PI / 2.5 + ring.y;
      mesh.rotation.y = ring.z;
      group.add(mesh);
      return mesh;
    });

    const resize = () => {
      const rect = element.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    element.addEventListener("pointermove", move);

    const render = (time = 0) => {
      if (disposed) return;
      const activeMotion = !reduced.matches;
      const t = activeMotion ? time * 0.00018 : 0.42;
      group.rotation.y = t + pointerX * 0.08;
      group.rotation.x = Math.sin(t * 0.8) * 0.08 + pointerY * 0.05;
      rings.forEach((ring, index) => {
        ring.rotation.z = t * (0.9 + index * 0.3);
      });
      renderer.render(scene, camera);
      if (activeMotion) frame = requestAnimationFrame(render);
    };
    render();

    const rerender = () => {
      cancelAnimationFrame(frame);
      render();
    };
    reduced.addEventListener("change", rerender);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", rerender);
      element.removeEventListener("pointermove", move);
      observer.disconnect();
      pointGeometry.dispose();
      lineGeometry.dispose();
      points.material.dispose();
      lines.material.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        ring.material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
      delete element.dataset.webgl;
    };
  }, []);

  return <div className={`continuum-scene ${className}`} ref={host} />;
}
