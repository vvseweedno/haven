import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function walk(root, predicate) {
  const files = [];
  const visit = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      const stat = statSync(path);
      if (stat.isDirectory()) visit(path);
      else if (predicate(path)) files.push(path);
    }
  };
  visit(root);
  return files;
}

function openingTags(source, tagName) {
  const tags = [];
  const needle = `<${tagName}`;
  let cursor = 0;

  while ((cursor = source.indexOf(needle, cursor)) !== -1) {
    const boundary = source[cursor + needle.length];
    if (boundary && /[A-Za-z0-9:_-]/.test(boundary)) {
      cursor += needle.length;
      continue;
    }

    let index = cursor + needle.length;
    let quote = "";
    let escaped = false;
    let braceDepth = 0;

    for (; index < source.length; index += 1) {
      const char = source[index];

      if (quote) {
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === "\\") {
          escaped = true;
          continue;
        }
        if (char === quote) quote = "";
        continue;
      }

      if (char === '"' || char === "'" || char === "`") {
        quote = char;
        continue;
      }
      if (char === "{") {
        braceDepth += 1;
        continue;
      }
      if (char === "}") {
        braceDepth = Math.max(0, braceDepth - 1);
        continue;
      }
      if (char === ">" && braceDepth === 0) {
        tags.push(source.slice(cursor, index + 1));
        cursor = index + 1;
        break;
      }
    }

    if (index >= source.length) break;
  }

  return tags;
}

export function runFrontendAudit({ root = process.cwd(), silent = false } = {}) {
  const failures = [];
  let checks = 0;
  const check = (condition, message) => {
    checks += 1;
    if (!condition) failures.push(message);
  };
  const read = (path) => readFileSync(join(root, path), "utf8");

  const required = [
    "docs/frontend-interface.md",
    "apps/web/app/error.tsx",
    "apps/web/app/global-error.tsx",
    "apps/web/app/loading.tsx",
    "apps/web/components/HomeDashboard.tsx",
    "apps/web/components/Dashboard.tsx",
    "apps/web/components/ExperienceHero.tsx",
    "apps/web/components/DeferredContinuumScene.tsx",
    "apps/web/components/AppShell.tsx",
    "apps/web/components/SearchDialog.tsx",
    "apps/web/components/Workspace.tsx",
    "apps/web/components/ProtocolCards.tsx",
    "apps/web/app/protocol/page.tsx",
    "apps/web/app/agents/[id]/page.tsx",
    "apps/web/app/globals.css",
    "apps/web/next.config.ts",
    ".github/workflows/ci.yml",
  ];
  for (const path of required) {
    check(existsSync(join(root, path)), `Missing frontend contract file: ${path}`);
  }
  if (failures.length) return finish();

  const homeRoute = read("apps/web/app/page.tsx");
  const observatoryRoute = read("apps/web/app/observatory/page.tsx");
  const home = read("apps/web/components/HomeDashboard.tsx");
  const hero = read("apps/web/components/ExperienceHero.tsx");
  const deferredScene = read("apps/web/components/DeferredContinuumScene.tsx");
  const shell = read("apps/web/components/AppShell.tsx");
  const search = read("apps/web/components/SearchDialog.tsx");
  const workspace = read("apps/web/components/Workspace.tsx");
  const protocolCards = read("apps/web/components/ProtocolCards.tsx");
  const protocolRoute = read("apps/web/app/protocol/page.tsx");
  const agentDetailRoute = read("apps/web/app/agents/[id]/page.tsx");
  const errorBoundary = read("apps/web/app/error.tsx");
  const globalError = read("apps/web/app/global-error.tsx");
  const loading = read("apps/web/app/loading.tsx");
  const agoraScene = read("apps/web/components/AgoraScene.tsx");
  const pointerAura = read("apps/web/components/PointerAura.tsx");
  const networkMap = read("apps/web/components/NetworkMap.tsx");
  const css = read("apps/web/app/globals.css");
  const nextConfig = read("apps/web/next.config.ts");
  const ciWorkflow = read(".github/workflows/ci.yml");
  const contract = read("docs/frontend-interface.md");
  const delivery = read("apps/web/lib/delivery.ts");

  check(
    homeRoute.includes('import { HomeDashboard }') &&
      homeRoute.includes("<HomeDashboard"),
    "Home route must render HomeDashboard.",
  );
  check(
    !home.includes("NetworkMap") &&
      !home.includes("@xyflow/react") &&
      !home.includes("@/lib/observatory"),
    "HomeDashboard must not pull Observatory/React Flow code into first contact.",
  );
  check(
    hero.includes('href="/landscape"') &&
      !hero.includes('prefetch={false}\n                  href="/landscape"') &&
      hero.includes('href="/proof-desk#proof-workbench"'),
    "Expected primary decision routes should retain normal Next.js prefetch behavior.",
  );
  check(
    deferredScene.includes("IntersectionObserver") &&
      deferredScene.includes("requestIdleCallback") &&
      deferredScene.includes('rootMargin: "240px 0px"'),
    "Decorative Three.js should be deferred until the scene is near the viewport and the browser is idle.",
  );
  check(
    observatoryRoute.includes('import { Dashboard }') &&
      observatoryRoute.includes("<Dashboard"),
    "Observatory route must own Dashboard.",
  );
  check(
    shell.includes('dynamic(() => import("./SearchDialog"), { ssr: false })'),
    "SearchDialog must remain dynamically loaded from the shell.",
  );
  check(
    search.includes("const wantsCatalog = query.trim().length > 0") &&
      search.includes("if (!wantsCatalog)") &&
      search.includes("if (catalogLoaded) return"),
    "Search must not fetch the catalog before a real query.",
  );
  check(
    search.includes('setError("")') &&
      search.includes("setLoading(false)") &&
      search.includes("wantsCatalog && error"),
    "Search must recover to the task-first state when the query is cleared.",
  );
  check(
    search.includes('import Link from "next/link"') &&
      search.includes("<Link") &&
      !search.includes('<a\n                key={item.id}'),
    "Internal search results must use Next Link navigation.",
  );
  check(
    protocolCards.includes('import { protocolCards } from "@/lib/haven-data"') &&
      protocolRoute.includes("<ProtocolCards />") &&
      !protocolRoute.includes("cards={protocolCards}"),
    "Client protocol cards must own icon-bearing data instead of receiving React component functions across the server boundary.",
  );
  check(
    agentDetailRoute.includes("export const dynamicParams = false"),
    "Fixture identity detail routes must reject unknown IDs at the routing layer.",
  );
  check(
    workspace.includes("const previousFocus = useRef") &&
      workspace.includes("previousFocus.current") &&
      workspace.includes("target.focus()"),
    "Shared dialogs must restore the invoking focus target.",
  );
  check(
    workspace.includes("useId()") &&
      workspace.includes("aria-labelledby={titleId}") &&
      workspace.includes("<h2 id={titleId}>"),
    "Shared dialogs must use a programmatically labelled semantic heading.",
  );
  check(
    shell.includes('explicitTheme.current = nextTheme') &&
      shell.includes('if (!explicitTheme.current) applyTheme(event.matches)'),
    "An explicit theme choice must not be overwritten by later system-theme changes.",
  );
  check(
    shell.includes("openSearchFromSidebar") &&
      shell.includes("menuButton.current?.focus()"),
    "Mobile search must restore focus to a visible control rather than the hidden sidebar.",
  );
  check(
    css.includes(".sidebar:not(.is-open)") &&
      css.includes("visibility: hidden") &&
      css.includes("pointer-events: none"),
    "Closed mobile navigation must be removed from keyboard/pointer reach.",
  );
  check(
    shell.includes("aria-hidden={mobileViewport && !mobileOpen ? true : undefined}") &&
      shell.includes("inert={mobileViewport && !mobileOpen ? true : undefined}"),
    "Closed mobile navigation must be explicitly hidden and inert to assistive technology.",
  );
  check(
    errorBoundary.includes('className="button primary"') &&
      errorBoundary.includes("onClick={reset}") &&
      errorBoundary.includes('href="/"'),
    "Route error UI must expose retry and safe orientation recovery.",
  );
  check(
    loading.includes('role="status"') &&
      loading.includes('aria-busy="true"'),
    "Route loading UI must expose an accessible busy status.",
  );
  check(
    globalError.includes("<html") &&
      globalError.includes("onClick={reset}") &&
      globalError.includes('href="/"'),
    "Root-shell failures must have a last-resort retry and home recovery surface.",
  );
  check(
    agoraScene.includes("agora-scene-fallback"),
    "Agora must provide a static fallback when WebGL cannot initialize.",
  );
  check(
    pointerAura.includes("reduced.addEventListener") &&
      pointerAura.includes("coarse.addEventListener") &&
      pointerAura.includes("const stop ="),
    "Pointer decoration must react to live reduced-motion and coarse-pointer changes.",
  );
  check(
    networkMap.includes("reducedMotion") &&
      networkMap.includes("disabled={reducedMotion}"),
    "Observatory connection animation must obey the reduced-motion preference in component state.",
  );
  check(
    workspace.includes("document.body.appendChild(anchor)") &&
      workspace.includes("anchor.remove()"),
    "Shared downloads must use a browser-compatible attached anchor lifecycle.",
  );
  check(
    nextConfig.includes("reactStrictMode: true"),
    "React Strict Mode must remain enabled.",
  );
  check(
    nextConfig.includes("poweredByHeader: false"),
    "Next.js powered-by header must remain disabled.",
  );
  check(
    ciWorkflow.includes("python scripts/test-ui.py") &&
      ciWorkflow.includes("python scripts/test-security-ui.py"),
    "CI must execute both browser UI and browser security verification.",
  );
  check(
    ciWorkflow.includes("npm run build") &&
      ciWorkflow.indexOf("npm run build") < ciWorkflow.indexOf("python scripts/test-ui.py"),
    "Browser verification must exercise a production build rather than the dev server.",
  );
  check(
    ciWorkflow.includes("playwright") && ciWorkflow.includes("chromium"),
    "CI must provision a Chromium Playwright runtime for browser verification.",
  );
  check(
    ciWorkflow.includes("path: .artifacts/") &&
      ciWorkflow.includes("include-hidden-files: true"),
    "CI must upload the hidden .artifacts browser evidence directory.",
  );
  check(
    css.includes("@media (max-width: 760px)") &&
      css.includes("@media (max-width: 980px)") &&
      css.includes("min-width: 320px"),
    "Responsive CSS must preserve desktop/tablet/mobile and the 320px floor.",
  );
  check(
    css.includes("@media (prefers-reduced-motion: reduce)"),
    "Frontend must retain a reduced-motion path.",
  );

  const tsxRoots = [
    join(root, "apps", "web", "components"),
    join(root, "apps", "web", "app"),
  ];
  const tsxFiles = tsxRoots.flatMap((dir) =>
    walk(dir, (path) => path.endsWith(".tsx")),
  );

  for (const file of tsxFiles) {
    const source = readFileSync(file, "utf8");
    const display = relative(root, file).replaceAll("\\", "/");

    for (const tag of openingTags(source, "button")) {
      check(
        /\btype\s*=/.test(tag),
        `${display} contains a button without an explicit type.`,
      );
    }

    for (const tag of openingTags(source, "a")) {
      const opensNewContext = /\btarget\s*=\s*["']_blank["']/.test(tag);
      if (!opensNewContext) continue;
      check(
        /\brel\s*=\s*["'][^"']*(?:noopener|noreferrer)[^"']*["']/.test(tag),
        `${display} opens a new tab without noopener/noreferrer.`,
      );
    }

    if (!display.endsWith("app/layout.tsx")) {
      check(
        !source.includes("dangerouslySetInnerHTML"),
        `${display} must not render arbitrary HTML through dangerouslySetInnerHTML.`,
      );
    }
  }

  const roles = [
    "Frontend Architect",
    "Frontend Developer",
    "JavaScript / TypeScript Engineer",
    "React / Vue / Next.js Developer",
    "CSS Specialist",
    "Responsive Developer",
    "Animation Developer",
    "Accessibility Frontend Engineer",
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
    check(contract.includes(role), `Frontend contract does not name ${role}.`);
    check(delivery.includes(role), `Delivery ownership does not name ${role}.`);
  }

  for (const section of [
    "## Route and bundle architecture",
    "## State and storage boundaries",
    "## Navigation",
    "## Search",
    "## Dialogs and overlays",
    "## Forms and controls",
    "## Responsive interface",
    "## Accessibility frontend",
    "## Animation and WebGL integration",
    "## Error recovery",
    "## TypeScript and React rules",
    "## Browser QA",
    "## Release checklist",
  ]) {
    check(contract.includes(section), `docs/frontend-interface.md is missing ${section}.`);
  }

  return finish();

  function finish() {
    if (failures.length) {
      const message = [
        `HAVEN frontend audit failed (${failures.length}/${checks} checks):`,
        ...failures.map((failure) => `- ${failure}`),
      ].join("\n");
      if (!silent) console.error(message);
      const error = new Error(message);
      error.failures = failures;
      throw error;
    }
    const message = `HAVEN frontend audit passed (${checks} static checks).`;
    if (!silent) console.log(message);
    return { checks, failures: [] };
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    runFrontendAudit();
  } catch (error) {
    console.error(
      error instanceof Error ? error.stack || error.message : String(error),
    );
    process.exitCode = 1;
  }
}
