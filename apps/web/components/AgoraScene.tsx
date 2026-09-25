"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function AgoraScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      element.dataset.webgl = "unavailable";
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "agora-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    element.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, 3, -3, 0.1, 50);
    camera.position.z = 8;
    const group = new THREE.Group();
    scene.add(group);

    const nodeCount = 168;
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const palette = [
      new THREE.Color("#d8ff3d"),
      new THREE.Color("#20d7d0"),
      new THREE.Color("#ff704f"),
    ];
    for (let index = 0; index < nodeCount; index += 1) {
      const column = index % 21;
      const row = Math.floor(index / 21);
      const pulse = Math.sin(index * 1.83) * 0.16;
      positions[index * 3] = (column - 10) * 0.42 + pulse;
      positions[index * 3 + 1] = (row - 3.5) * 0.5 + Math.cos(index * 0.61) * 0.12;
      positions[index * 3 + 2] = Math.sin(index * 0.47) * 0.45;
      const color = palette[(column + row * 2) % palette.length];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({ size: 0.072, vertexColors: true, transparent: true, opacity: 0.84 }),
    );
    group.add(points);

    const segments: number[] = [];
    for (let index = 0; index < nodeCount; index += 1) {
      const right = index % 21 === 20 ? -1 : index + 1;
      const down = index + 21 < nodeCount ? index + 21 : -1;
      for (const other of [right, down]) {
        if (other < 0 || (index + other) % 5 === 0) continue;
        segments.push(
          positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2],
          positions[other * 3], positions[other * 3 + 1], positions[other * 3 + 2],
        );
      }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));
    const lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: "#101413", transparent: true, opacity: 0.16 }),
    );
    group.add(lines);

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(1.15, 1.18, 92),
      new THREE.MeshBasicMaterial({ color: "#20d7d0", transparent: true, opacity: 0.26, side: THREE.DoubleSide }),
    );
    group.add(halo);

    const observer = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
      camera.left = -5;
      camera.right = 5;
      camera.top = 5 / Math.max(0.5, rect.width / rect.height);
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
    });
    observer.observe(element);

    let frame = 0;
    let disposed = false;
    const render = (time = 0) => {
      if (disposed) return;
      const phase = reduced.matches ? 0.6 : time * 0.00022;
      group.rotation.z = Math.sin(phase * 0.7) * 0.045;
      group.rotation.x = Math.cos(phase * 0.55) * 0.04;
      halo.rotation.z = phase * 0.8;
      points.rotation.z = -phase * 0.15;
      renderer.render(scene, camera);
      if (!reduced.matches) frame = requestAnimationFrame(render);
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
      observer.disconnect();
      pointGeometry.dispose();
      lineGeometry.dispose();
      points.material.dispose();
      lines.material.dispose();
      halo.geometry.dispose();
      halo.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="agora-scene" ref={host} />;
}
