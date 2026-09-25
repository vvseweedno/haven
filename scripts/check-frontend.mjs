import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

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
    "apps/web/app/loading.tsx",
    "apps/web/components/HomeDashboard.tsx",
    "apps/web/components/Dashboard.tsx",
    "apps/web/components/AppShell.tsx",
    "apps/web/components/SearchDialog.tsx",
    "apps/web/components/Workspace.tsx",
    "apps/web/app/globals.css",
    "apps/web/next.config.ts",
  ];
  for (const path of required) {
    check(existsSync(join(root, path)), `Missing frontend contract file: ${path}`);
  }
  if (failures.length) return finish();

  const homeRoute = read("apps/web/app/page.tsx");
  const observatoryRoute = read("apps/web/app/observatory/page.tsx");
  const home = read("apps/web/components/HomeDashboard.tsx");
  const shell = read("apps/web/components/AppShell.tsx");
  const search = read("apps/web/components/SearchDialog.tsx");
  const workspace = read("apps/web/components/Workspace.tsx");
  const errorBoundary = read("apps/web/app/error.tsx");
  const loading = read("apps/web/app/loading.tsx");
  const css = read("apps/web/app/globals.css");
  const nextConfig = read("apps/web/next.config.ts");
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
      search.includes("if (!wantsCatalog || catalogLoaded) return"),
    "Search must not fetch the catalog before a real query.",
  );
  check(
    search.includes('import Link from "next/link"') &&
      search.includes("<Link") &&
      !search.includes('<a\n                key={item.id}'),
    "Internal search results must use Next Link navigation.",
  );
  check(
    workspace.includes("const previousFocus = useRef") &&
      workspace.includes("previousFocus.current") &&
      workspace.includes("target.focus()"),
    "Shared dialogs must restore the invoking focus target.",
  );
  check(
    workspace.includes("useId()") &&
      workspace.includes("aria-labelledby={titleId}"),
    "Shared dialogs must use a programmatically labelled title.",
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
    nextConfig.includes("reactStrictMode: true"),
    "React Strict Mode must remain enabled.",
  );
  check(
    nextConfig.includes("poweredByHeader: false"),
    "Next.js powered-by header must remain disabled.",
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
    const sourceFile = ts.createSourceFile(
      display,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );

    const inspectJsx = (node) => {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(sourceFile);
        const attributes = node.attributes.properties.filter(ts.isJsxAttribute);
        if (tag === "button") {
          check(
            attributes.some((attribute) => attribute.name.text === "type"),
            `${display} contains a button without an explicit type.`,
          );
        }
        if (tag === "a") {
          const target = attributes.find((attribute) => attribute.name.text === "target");
          const rel = attributes.find((attribute) => attribute.name.text === "rel");
          const targetValue =
            target?.initializer && ts.isStringLiteral(target.initializer)
              ? target.initializer.text
              : "";
          const relValue =
            rel?.initializer && ts.isStringLiteral(rel.initializer)
              ? rel.initializer.text
              : "";
          if (targetValue === "_blank") {
            check(
              /(?:^|\s)(?:noopener|noreferrer)(?:\s|$)/.test(relValue),
              `${display} opens a new tab without noopener/noreferrer.`,
            );
          }
        }
      }
      ts.forEachChild(node, inspectJsx);
    };
    inspectJsx(sourceFile);

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
  } catch {
    process.exitCode = 1;
  }
}
