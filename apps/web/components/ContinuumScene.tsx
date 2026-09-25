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
    let inViewport = true;
    let pointerX = 0;
    let pointerY = 0;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
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
      new THREE.Color("#d8ff3d"),
      new THREE.Color("#20d7d0"),
      new THREE.Color("#ff704f"),
      new THREE.Color("#a9c7b1"),
    ];

    for (let i = 0; i < nodeCount; i += 1) {
      const ring = 1.25 + (i % 7) * 0.34;
      const angle = i * 2.39996;
      positions[i * 3] = Math.cos(angle) * ring + Math.sin(i * 1.7) * 0.18;
      positions[i * 3 + 1] =
        Math.sin(angle) * ring * 0.72 + Math.cos(i * 0.91) * 0.24;
      positions[i * 3 + 2] = Math.sin(i * 0.73) * 1.15;
      const color = palette[i % palette.length];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({
        size: 0.052,
        vertexColors: true,
        transparent: true,
        opacity: 0.88,
      }),
    );
    group.add(points);

    const linePositions: number[] = [];
    for (let i = 0; i < nodeCount; i += 1) {
      for (let j = i + 1; j < nodeCount; j += 1) {
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
        color: "#7fae9a",
        transparent: true,
        opacity: 0.2,
      }),
    );
    group.add(lines);

    const rings = [
      { radius: 2.35, color: "#d8ff3d", y: 0.35, z: 0.13 },
      { radius: 2.95, color: "#20d7d0", y: -0.52, z: -0.22 },
      { radius: 3.42, color: "#ff704f", y: 0.86, z: 0.4 },
    ].map((ring, index) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(ring.radius, 0.0045, 8, 180),
        new THREE.MeshBasicMaterial({
          color: ring.color,
          transparent: true,
          opacity: 0.34 - index * 0.06,
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

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    resize();

    const move = (event: PointerEvent) => {
      if (reduced.matches) return;
      const rect = element.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    element.addEventListener("pointermove", move, { passive: true });

    const render = (time = 0) => {
      if (disposed || !inViewport || document.hidden) return;
      const moving = !reduced.matches;
      const t = moving ? time * 0.00014 : 0.42;
      group.rotation.y = t + (moving ? pointerX * 0.055 : 0);
      group.rotation.x = Math.sin(t * 0.8) * 0.06 + (moving ? pointerY * 0.035 : 0);
      rings.forEach((ring, index) => {
        ring.rotation.z = t * (0.72 + index * 0.22);
      });
      renderer.render(scene, camera);
      if (moving) frame = requestAnimationFrame(render);
    };

    const restart = () => {
      cancelAnimationFrame(frame);
      if (disposed || !inViewport || document.hidden) return;
      if (reduced.matches) render(0);
      else frame = requestAnimationFrame(render);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry?.isIntersecting ?? true;
        restart();
      },
      { threshold: 0.02 },
    );
    intersectionObserver.observe(element);

    const visibility = () => restart();
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", restart);
    restart();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", visibility);
      element.removeEventListener("pointermove", move);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
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
