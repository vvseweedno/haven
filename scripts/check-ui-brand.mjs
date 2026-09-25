import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function runUiBrandAudit({ root = process.cwd(), silent = false } = {}) {
  const failures = [];
  let checks = 0;
  const check = (condition, message) => {
    checks += 1;
    if (!condition) failures.push(message);
  };
  const read = (path) => readFileSync(join(root, path), "utf8");

  const required = [
    "docs/ui-brand.md",
    "apps/web/components/BrandMark.tsx",
    "apps/web/components/AppShell.tsx",
    "apps/web/components/NetworkMap.tsx",
    "apps/web/components/ContinuumScene.tsx",
    "apps/web/components/AgoraScene.tsx",
    "apps/web/app/globals.css",
    "apps/web/app/layout.tsx",
  ];
  required.forEach((path) =>
    check(existsSync(join(root, path)), `Missing UI/brand contract file: ${path}`),
  );
  if (failures.length) return finish();

  const contract = read("docs/ui-brand.md");
  const mark = read("apps/web/components/BrandMark.tsx");
  const shell = read("apps/web/components/AppShell.tsx");
  const network = read("apps/web/components/NetworkMap.tsx");
  const continuum = read("apps/web/components/ContinuumScene.tsx");
  const agoraScene = read("apps/web/components/AgoraScene.tsx");
  const css = read("apps/web/app/globals.css");
  const layout = read("apps/web/app/layout.tsx");

  for (const token of [
    "--sol:",
    "--tide:",
    "--signal:",
    "--radius-sm:",
    "--radius-md:",
    "--radius-lg:",
    "--shadow-sm:",
    "--shadow-md:",
    "--shadow-lg:",
    "--motion-fast:",
    "--motion-base:",
    "--focus-ring:",
  ]) {
    check(css.includes(token), `Visual system is missing token ${token}`);
  }

  check(
    css.includes("HAVEN visual system v2"),
    "The global stylesheet must contain the unified visual-system layer.",
  );
  check(
    mark.includes("brand-mark-plane") &&
      mark.includes("brand-mark-link") &&
      mark.includes("brand-mark-signal"),
    "BrandMark must preserve planes, provenance link and signal dot.",
  );
  check(
    shell.includes('import { BrandMark }') && shell.includes("<BrandMark"),
    "Global navigation must use the canonical BrandMark.",
  );
  check(
    network.includes('import { BrandMark }') &&
      network.includes('className="brand-mark-map"'),
    "The Observatory home node must reuse the canonical BrandMark.",
  );
  check(
    !shell.includes('className="haven-mark"') &&
      !network.includes('className="haven-mark"'),
    "Ad-hoc duplicated HAVEN mark DOM must not return.",
  );

  for (const source of [
    ["ContinuumScene", continuum],
    ["AgoraScene", agoraScene],
  ]) {
    const [name, code] = source;
    check(code.includes("IntersectionObserver"), `${name} must pause when offscreen.`);
    check(code.includes("visibilitychange"), `${name} must react to background-tab visibility.`);
    check(
      code.includes("prefers-reduced-motion: reduce"),
      `${name} must honor reduced motion.`,
    );
    check(
      !code.includes("preserveDrawingBuffer: true"),
      `${name} must not preserve the drawing buffer for decorative rendering.`,
    );
    check(
      /setPixelRatio\(Math\.min\([^\n]+1\.(?:2[0-9]|3[0-9]|4[0-9])\)\)/.test(code),
      `${name} must cap device pixel ratio to a bounded value.`,
    );
  }

  check(
    css.includes("@media (prefers-reduced-motion: reduce)") &&
      css.includes(".pointer-aura") &&
      css.includes("display: none !important"),
    "Global visual motion must provide a reduced-motion path.",
  );
  check(
    css.includes(".page-header-art img") &&
      css.includes("image-rendering: auto") &&
      css.includes("animation: none"),
    "Page-header imagery must use the refined non-glitch treatment.",
  );
  check(
    css.includes(".agora-page,") &&
      css.includes(".cabinet-page,") &&
      css.includes(".atelier-page"),
    "Specialist product surfaces must inherit the shared brand system.",
  );
  check(
    shell.includes("prefers-color-scheme: dark") &&
      layout.includes("prefers-color-scheme: dark"),
    "System theme preference must be honored in both first paint and hydrated UI.",
  );

  const roles = [
    "Product Designer",
    "UI Designer",
    "Visual Designer",
    "Brand Designer",
    "Art Director",
    "Creative Director",
    "Design System Designer",
    "Motion Designer",
    "3D Artist",
    "Creative Developer",
    "WebGL / Three.js Developer",
    "AI Image Designer",
    "Product Manager",
    "Project / Delivery Manager",
    "UX Lead",
    "Design Director",
    "Tech Lead",
    "SEO Lead",
    "Analytics Lead",
    "QA Lead",
    "Security",
    "Accessibility",
    "Performance",
    "Content Strategy",
  ];
  for (const role of roles) {
    check(contract.includes(role), `UI/brand ownership does not name ${role}.`);
  }

  for (const section of [
    "## Brand idea",
    "## Color system",
    "## Typography",
    "## Shape and depth",
    "## Global chrome",
    "## Motion design",
    "## WebGL / Three.js",
    "## Image direction",
    "## Accessibility",
    "## Performance",
    "## Release checklist",
  ]) {
    check(contract.includes(section), `docs/ui-brand.md is missing ${section}.`);
  }

  return finish();

  function finish() {
    if (failures.length) {
      const message = [
        `HAVEN UI/brand audit failed (${failures.length}/${checks} checks):`,
        ...failures.map((failure) => `- ${failure}`),
      ].join("\n");
      if (!silent) console.error(message);
      const error = new Error(message);
      error.failures = failures;
      throw error;
    }
    const message = `HAVEN UI/brand audit passed (${checks} static checks).`;
    if (!silent) console.log(message);
    return { checks, failures: [] };
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    runUiBrandAudit();
  } catch {
    process.exitCode = 1;
  }
}
