# HAVEN frontend and browser-interface contract

Last reviewed: 2026-09-26

## Audit conclusion

HAVEN's browser UI is now a large multi-route product rather than a single demo screen. The main frontend risk was no longer missing interface code; it was **coupling**: expensive specialist code leaking into first contact, state behavior diverging across tabs, hidden mobile navigation remaining focusable, diagnostic code carrying stale assumptions, and browser tests describing an older information architecture.

The frontend contract is therefore:

**render the smallest useful route, keep state boundaries explicit, preserve keyboard/browser semantics, and fail without breaking the decision path.**

The interface must remain usable without hover, without WebGL, without persistent storage, with reduced motion, at 320 px width, and with browser-local features unavailable.

## Route and bundle architecture

### Home is not Observatory

The home route uses `HomeDashboard`. It must not import:

- `NetworkMap`;
- `@xyflow/react`;
- Observatory fixture data;
- the full Observatory dashboard.

The Observatory route owns the interactive graph and research-dashboard bundle.

This separation is a performance and maintainability boundary, not only a visual preference.

### Client islands

Use client components only where browser state or interaction requires them.

Appropriate client responsibilities include:

- locale/theme preference;
- browser-local saved state;
- dialogs;
- interactive graph controls;
- local proof generation;
- forms and local drafts;
- session measurement;
- WebGL.

Route metadata, crawlable text and non-interactive page structure should remain server-renderable where practical.

### Heavy features

- Search dialog is dynamically loaded.
- Continuum Three.js is deferred and dynamically loaded.
- Observatory graph code stays outside the home route.
- Deep reference routes should not be eagerly prefetched by global navigation.
- The four primary decision routes may be prefetched because they are the expected journey.

## State and storage boundaries

Use storage according to product semantics:

- `localStorage`: explicit durable user preferences and durable browser-local artifacts only.
- `sessionStorage`: evaluation context, measurement and other current-tab journey state.
- React state: transient controls and unsaved interface state.

Requirements:

- storage access must be failure-tolerant;
- a detected browser preference is not silently converted into an explicit saved preference;
- explicit locale/theme choices may synchronize across tabs;
- free-form text must not enter the measurement ledger;
- diagnostic state must not be required for normal UI operation.

## Navigation

Internal application navigation uses Next.js `Link` unless native navigation is intentionally required.

Prefetch policy:

- brand/home and four decision-path routes: normal Next prefetch behavior;
- large specialist/reference routes: prefetch may be disabled until intent is clear;
- external documents: normal anchors with safe `rel` when opening a new browsing context;
- download actions remain explicit actions, not fake navigation.

The browser Back button, hash navigation and direct route entry must remain valid.

## Search

Search opens immediately with four task-oriented actions.

The public catalog is fetched **only after the user enters a query**. Opening search alone must not spend a catalog request or make the task shortcuts wait on the API.

Requirements:

- request is cancellable;
- malformed API responses are rejected;
- retry is explicit;
- internal results use client-side navigation;
- no-results is announced only for a real non-empty query;
- closing the dialog restores focus to the invoking control.

## Dialogs and overlays

Use native `<dialog>` through the shared `Modal` component.

The shared modal must:

- use an accessible labelled title;
- support Escape through native cancel behavior;
- close on backdrop interaction;
- lock body scrolling only while open;
- restore the previously focused element on close;
- render untrusted content as text rather than HTML.

Mobile navigation is also an overlay. When closed, it must be removed from keyboard/accessibility reach, not merely translated offscreen.

## Forms and controls

Every button declares its intent:

- `type="submit"` for form submission;
- `type="button"` for every other button.

Do not rely on the HTML default button type.

Other rules:

- labels are programmatically associated with controls;
- errors use `role="alert"` when immediate;
- success/progress updates use polite status/live regions;
- disabled state cannot be communicated by color alone;
- destructive actions require an explicit confirmation when recovery is unavailable;
- local file inputs remain size-bounded before parsing.

## Responsive interface

Supported layout floor: **320 CSS px**.

Required test widths:

- 1440 px desktop;
- 390 px common mobile;
- 320 px minimum supported browser width.

At every route:

- `document.documentElement.scrollWidth <= window.innerWidth + 1`;
- primary actions remain reachable;
- the four-stage journey remains in the same order;
- closed sidebar controls cannot receive focus;
- dialogs fit the viewport;
- long IDs and machine-readable values wrap or scroll within their own surface rather than the page.

## Accessibility frontend

Frontend acceptance requires:

- one visible page H1;
- skip link to `main`;
- `main` is programmatically focusable for skip navigation;
- keyboard-operable tabs and segmented controls;
- correct `aria-current`, `aria-selected`, `aria-pressed`, labels and live regions;
- focus restoration after dialogs;
- no hidden mobile navigation in the tab order;
- meaningful image alternatives where images carry information;
- decorative canvas and graphics hidden from assistive technology;
- `prefers-reduced-motion` respected.

Color and visual requirements remain governed by `docs/ui-brand.md`.

## Animation and WebGL integration

Animation is enhancement only.

Frontend requirements:

- essential actions cannot depend on hover or animation;
- WebGL failures leave usable HTML and a static fallback;
- rendering stops when scenes are outside the viewport or the document is hidden;
- reduced-motion users receive a stable scene;
- pointer decoration does not replace the native cursor and stops its frame loop when idle.

## Error recovery

Unexpected rendering errors need layered recovery.

The normal route error boundary must:

- avoid displaying stack traces or raw error content;
- offer a retry;
- offer a route back to product orientation;
- preserve the global shell when possible.

A separate global error boundary must remain available for failures in the root application shell itself. It cannot depend on HAVEN context providers or client-side navigation being healthy.

404, loading, route-runtime and global-shell error states are different and must remain separate. Route transitions expose a polite busy status instead of leaving a blank content region.

## TypeScript and React rules

- TypeScript stays `strict`.
- `noUnusedLocals` and `noUnusedParameters` stay enabled.
- React Strict Mode stays enabled.
- Hooks are unconditional and in stable order.
- Provider values are memoized when incidental provider renders would otherwise invalidate the full subtree.
- effects clean up event listeners, timers, observers, object URLs and browser-global mutations.
- browser globals are guarded when utility functions can be called outside an event/render path.

## Browser QA

The browser suite in `scripts/test-ui.py` is the source of truth for route-level interface behavior.

It covers:

- all product routes;
- desktop and mobile overflow;
- metadata and canonicals;
- task-first home/search;
- home/Observatory separation;
- dialog focus;
- local workflows;
- session-scoped state;
- theme and locale persistence;
- opt-in diagnostics;
- WebGL and reduced motion;
- discovery endpoints and 404 behavior.

The suite is intentionally separate from static conformance. A green TypeScript build does not replace browser testing.

## Working roles

- Frontend Architect
- Frontend Developer
- JavaScript / TypeScript Engineer
- React / Vue / Next.js Developer
- CSS Specialist
- Responsive Developer
- Animation Developer
- Accessibility Frontend Engineer

## Supervisory review

- **Product Manager** — implementation serves the decision path.
- **Project / Delivery Manager** — scope and release evidence remain explicit.
- **UX Lead** — interaction behavior matches the intended journey.
- **Design Director** — browser implementation preserves hierarchy and visual intent.
- **Tech Lead** — component boundaries, state and dependencies remain maintainable.
- **SEO Lead** — client behavior does not erase crawlable route meaning.
- **Analytics Lead** — measurement remains bounded and semantically correct.
- **QA Lead** — static, build and browser regressions are covered.
- **Security** — browser APIs, storage, rendering and file handling remain bounded.
- **Accessibility** — semantics, keyboard, focus, motion and responsive behavior are review gates.
- **Performance** — route bundles, prefetching, WebGL and effects remain bounded.
- **Content Strategy** — interface labels remain clear and consistent in EN/RU.

## Release checklist

- [ ] Home route imports `HomeDashboard`, not the Observatory dashboard.
- [ ] Home bundle does not import React Flow / NetworkMap / Observatory fixture data.
- [ ] Search does not fetch the catalog until a non-empty query exists.
- [ ] Internal search results use Next.js client navigation.
- [ ] Shared modal has an accessible title and focus restoration.
- [ ] Mobile sidebar is not keyboard-reachable while closed.
- [ ] No component conditionally calls a React hook.
- [ ] Non-submit buttons explicitly declare `type="button"`.
- [ ] Form submitters explicitly declare `type="submit"`.
- [ ] Locale and theme choices behave correctly across reloads and tabs.
- [ ] Diagnostics are opt-in through `?diagnostics=1`.
- [ ] Measurement remains session-scoped and excludes typed free-form text.
- [ ] 1440 px, 390 px and 320 px layouts do not horizontally overflow.
- [ ] Reduced motion leaves all essential interactions usable.
- [ ] WebGL failure does not block the page.
- [ ] Route runtime errors have a safe retry/recovery screen.
- [ ] Root-shell failures have a provider-independent global recovery screen.
- [ ] Route transitions expose an accessible loading status.
- [ ] Pointer decoration stops immediately when reduced-motion or coarse-pointer preference becomes active.
- [ ] Observatory motion controls cannot re-enable animation while reduced-motion is active.
- [ ] Decorative WebGL surfaces have a static fallback.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.


## Implemented continuation — 2026-09-25

The continuing frontend pass closed several browser-level gaps that static layout work did not cover:

- explicit theme choices are held separately from system preference so an operating-system theme change cannot overwrite a manual HAVEN choice in the same tab;
- search opened from mobile navigation restores focus to the visible menu trigger, while desktop search returns to the visible sidebar trigger;
- task-first search keeps the public catalog request lazy until a real query exists and uses client-side Next navigation for internal results;
- the shared modal restores invoking focus and carries a programmatic title;
- browser JSON downloads attach their temporary anchor before activation and always revoke the object URL;
- route-level loading and error surfaces were added, plus a provider-independent global error fallback;
- the pointer aura now reacts to live reduced-motion/coarse-pointer changes and cancels its frame loop immediately;
- Observatory connection motion is disabled in component state when reduced motion is active rather than relying on CSS alone;
- Agora now has a static non-WebGL fallback instead of leaving an empty decorative region;
- frontend conformance is enforced in `npm test` by `scripts/check-frontend.mjs`, including explicit button intent across TSX surfaces.


## Implemented continuation — 2026-09-26

The follow-up frontend pass tightened behavior that only appeared under real browser navigation and error recovery:

- task-first search now clears failed catalog state as soon as the query is cleared, so a temporary API failure cannot poison the four local task shortcuts;
- shared dialogs expose their programmatic label through a real heading and still restore focus to the invoking control on close;
- Delivery filters are generated from states that actually exist, so the interface no longer offers an empty “Required next” view when no delivery role is in that state;
- browser QA now asserts the current Delivery qualification copy and export actions rather than stale pre-refactor labels;
- primary fit/proof routes keep normal Next.js prefetch behavior while deep specialist routes can remain intent-loaded;
- deferred Continuum WebGL waits until its surface approaches the viewport and browser idle time is available, while keeping the existing static placeholder and reduced-motion/runtime fallbacks;
- the static frontend audit now protects search recovery, semantic dialog headings, primary-route prefetching and near-viewport Three.js loading.


## Implemented continuation — 2026-09-26 / pass 2

The second continuation pass focused on interaction correctness that sits between routing, browser state and accessibility:

- keyboard-driven sidebar navigation now moves focus into the persistent `main` region after route selection, while pointer navigation keeps normal pointer behavior;
- the machine-readable ARD footer entry uses a native anchor instead of the Next.js app router;
- the Human Cabinet uses named form controls, browser name autocomplete and localized informative image alt text;
- browser-local Human Cabinet state now listens for `storage` changes so multiple tabs on the same origin stay coherent without introducing a server account;
- Playwright now verifies that Cabinet state actually propagates between two tabs in one browser context;
- the frontend static audit protects the new focus-transfer, native machine-link and browser-local synchronization behavior.
