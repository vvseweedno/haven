"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function AgoraScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    let inViewport = true;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      element.dataset.webgl = "unavailable";
      const fallback = document.createElement("div");
      fallback.className = "agora-scene-fallback";
      fallback.setAttribute("aria-hidden", "true");
      element.appendChild(fallback);
      return () => {
        fallback.remove();
        delete element.dataset.webgl;
      };
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "agora-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, 0.1, 50);
    camera.position.z = 8;
    const group = new THREE.Group();
    scene.add(group);

    const nodeCount = 144;
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const palette = [
      new THREE.Color("#d8ff3d"),
      new THREE.Color("#20d7d0"),
      new THREE.Color("#ff704f"),
    ];

    for (let index = 0; index < nodeCount; index += 1) {
      const column = index % 18;
      const row = Math.floor(index / 18);
      const pulse = Math.sin(index * 1.83) * 0.13;
      positions[index * 3] = (column - 8.5) * 0.48 + pulse;
      positions[index * 3 + 1] = (row - 3.5) * 0.5 + Math.cos(index * 0.61) * 0.1;
      positions[index * 3 + 2] = Math.sin(index * 0.47) * 0.38;
      const color = palette[(column + row * 2) % palette.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.066,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
    });
    const points = new THREE.Points(pointGeometry, pointsMaterial);
    group.add(points);

    const segments: number[] = [];
    for (let index = 0; index < nodeCount; index += 1) {
      const right = index % 18 === 17 ? -1 : index + 1;
      const down = index + 18 < nodeCount ? index + 18 : -1;
      for (const other of [right, down]) {
        if (other < 0 || (index + other) % 5 === 0) continue;
        segments.push(
          positions[index * 3],
          positions[index * 3 + 1],
          positions[index * 3 + 2],
          positions[other * 3],
          positions[other * 3 + 1],
          positions[other * 3 + 2],
        );
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#101413",
      transparent: true,
      opacity: 0.13,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    const haloGeometry = new THREE.RingGeometry(1.18, 1.2, 76);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: "#20d7d0",
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    group.add(halo);

    const resizeObserver = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
      camera.left = -5;
      camera.right = 5;
      camera.top = 5 / Math.max(0.5, rect.width / rect.height);
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(element);

    const render = (time = 0) => {
      if (disposed || !inViewport || document.hidden) return;
      const moving = !reduced.matches;
      const phase = moving ? time * 0.00018 : 0.6;
      group.rotation.z = Math.sin(phase * 0.7) * 0.035;
      group.rotation.x = Math.cos(phase * 0.55) * 0.03;
      halo.rotation.z = phase * 0.62;
      points.rotation.z = -phase * 0.11;
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
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", restart);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      pointGeometry.dispose();
      lineGeometry.dispose();
      haloGeometry.dispose();
      pointsMaterial.dispose();
      lineMaterial.dispose();
      haloMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="agora-scene" ref={host} />;
}
