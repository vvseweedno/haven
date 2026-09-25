# HAVEN UI, brand and visual experience contract

Last reviewed: 2026-09-25

## Audit conclusion

HAVEN already had a distinctive scientific-network direction, original visual assets and working WebGL, but the product had accumulated several visual dialects at once:

- rounded product cards and sharp editorial panels used different component rules;
- sidebar, Observatory, Agora, Cabinet, Atelier and Delivery behaved like separate brands;
- radii, shadows, border strengths and hard-coded colors varied by route;
- the original three-bar mark was duplicated as ad-hoc DOM rather than treated as a reusable brand asset;
- several images were forced into pixelated rendering even where that reduced perceived quality;
- decorative motion continued while offscreen and the main WebGL scene used a more expensive drawing-buffer configuration than the experience required;
- light theme was forced on first paint unless the user had already made a choice;
- the site had no automated visual-system contract to stop later regressions.

The corrected direction is **a scientific continuity instrument**: calm, inspectable, technical and editorial. It must not collapse into a generic SaaS dashboard, a crypto interface or a neon “AI hacker” aesthetic.

## Brand idea

HAVEN visualizes continuity through changing runtimes.

The visual system therefore uses:

1. **Planes** — layered identity/runtime states.
2. **Links** — provenance, lineage and accountable transitions.
3. **Signals** — small high-chroma accents reserved for state and direction.
4. **Fields** — low-contrast spatial grids, constellations and orbital structures that suggest relationships without pretending a live network exists.

The reusable HAVEN mark is implemented in `BrandMark.tsx` and is the canonical interface mark.

## Color system

Three high-chroma signals remain the recognizable brand language:

- **Sol** `#d8ff3d` — primary direction, positive action, selected state.
- **Tide** `#20d7d0` — evidence, continuity and connected structure.
- **Signal** `#ff704f` — caution, change, conflict and important boundaries.

They sit on a neutral scientific palette:

- **Void** — near-black structural surfaces.
- **Paper** — warm off-white reading surfaces.
- semantic background, raised, soft, line and muted tokens for both themes.

Rules:

- do not use all three signal colors on every component;
- large reading surfaces remain neutral;
- Sol is not a decorative highlighter across paragraphs;
- Signal never substitutes for an error state unless the semantics really are caution/error;
- new UI colors must use tokens unless the value belongs to an intentional artwork or WebGL palette.

## Typography

- **Space Grotesk Variable** — product headings and major statements.
- **Manrope Variable** — body copy, controls and long reading.
- **IBM Plex Mono** — IDs, protocol names, evidence metadata, compact state and machine-readable references.

Hierarchy rules:

- display headings use tight tracking and short line lengths;
- body text should normally remain between 55–72 characters per line;
- mono text is metadata, not the default interface voice;
- all-uppercase text is reserved for compact eyebrow/status information.

## Shape and depth

Canonical shape tokens:

- XS: 4px — tiny internal details.
- SM: 7px — controls and compact fields.
- MD: 12px — cards and small panels.
- LG: 18px — modal, hero and major workspace surfaces.
- XL: 26px — flagship hero surfaces.

Circular geometry is reserved for nodes, identities, status dots and orbital visuals.

Depth is restrained:

- small shadow for cards;
- medium shadow for important panels;
- large shadow only for flagship hero/modal overlays;
- borders carry most structure.

## Global chrome

The sidebar, top bar and four-stage journey rail form one visual frame.

The sidebar:

- uses a deep neutral field rather than a flat generic navigation panel;
- exposes the HAVEN mark once;
- uses a subtle Sol indicator for the current route;
- keeps reference groups visually quieter than the four decision stages.

The top bar:

- uses a translucent raised surface and blur;
- keeps language, search and theme controls compact;
- never invents an account/avatar state.

The journey rail:

- mirrors the four product-decision stages;
- uses Sol only for the current stage;
- remains readable without animation.

## Product surfaces

### Homepage

The homepage hero is the flagship brand surface. It combines:

- a dark Void field;
- Continuum WebGL as ambient spatial structure;
- a restrained image layer;
- one primary action and one context-specific secondary action;
- observed local metrics in a contained instrument panel.

The hero must remain legible when WebGL is disabled.

### Page headers

All explainer and product pages share the same chapter header grammar:

- dark field;
- chapter signal on the left edge;
- bounded line length;
- low-opacity visual asset;
- trust-boundary and evidence-source links;
- one recommended next action.

Do not restore route-specific decorative header styles that break this grammar.

### Evidence and workspace cards

Cards share border, radius and low-depth rules. Hover motion is small and only available on fine pointers.

Specialist routes such as Agora, Cabinet and Atelier may keep their editorial layouts, but they use the same palette, radius, border and motion system. A specialist route is not a separate brand.

## Motion design

Motion explains continuity; it does not prove sophistication.

Allowed motion:

- slow orbital drift;
- short hover elevation;
- directional state transitions;
- network-edge movement when the user has not requested reduced motion.

Requirements:

- `prefers-reduced-motion` collapses non-essential animation;
- WebGL pauses when outside the viewport or the document is hidden;
- no infinite glitch/scanner animation on reading surfaces;
- no cursor replacement; the pointer aura is a subtle optional enhancement on fine pointers only;
- motion cannot carry information that is unavailable statically.

## WebGL / Three.js

Continuum and Agora scenes are decorative product atmosphere.

Requirements:

- WebGL failure must leave a styled static fallback;
- pixel ratio is capped;
- no unnecessary preserved drawing buffer;
- rendering pauses when offscreen and when the tab is hidden;
- reduced-motion users receive a stable frame;
- canvas content is `aria-hidden`;
- the interface remains fully usable before or without WebGL.

## Image direction

Existing artwork is treated as abstract scientific evidence/continuity imagery.

Rules for future AI-generated or commissioned images:

- abstract topology, lineage, layers, fields, archival diagrams and material/scientific texture are appropriate;
- avoid humanoid robot portraits, glowing brains, cyberpunk city imagery, stock “AI face” imagery and crypto symbols;
- avoid fake screenshots of functionality that does not exist;
- images must not imply customers, live nodes or operational scale;
- raster effects such as 1-bit dither or data-mosh are accents, not a blanket filter over every image;
- every informative image needs meaningful alt text; purely atmospheric images remain empty-alt/decorative.

## Theme behavior

If the user has not chosen a theme, HAVEN follows the operating-system color preference from first paint. A manual user choice remains persistent.

Both themes preserve the same information hierarchy and signal semantics.

## Accessibility

- focus indicators use the theme-aware focus token;
- minimum interactive height is approximately 40–44px for primary controls/navigation;
- color is never the only state indicator;
- reduced motion is honored;
- overlays preserve semantic dialog behavior;
- visual texture cannot lower text contrast;
- mobile navigation keeps the same task order as desktop.

## Performance

Visual quality does not justify permanent GPU work.

Release review must check:

- WebGL loop suspension offscreen/background;
- capped device pixel ratio;
- no unnecessary `preserveDrawingBuffer`;
- deferred Three.js loading;
- image sizing through Next Image where applicable;
- no new full-screen blur/filter stack without measuring cost;
- production build and existing performance acceptance remain green.

## Working roles

- Product Designer
- UI Designer
- Visual Designer
- Brand Designer
- Art Director
- Creative Director
- Design System Designer
- Motion Designer
- 3D Artist
- Creative Developer
- WebGL / Three.js Developer
- AI Image Designer

## Supervisory review

- **Product Manager** — visual decisions support the product decision path.
- **Project / Delivery Manager** — visual scope is releasable and regression-safe.
- **UX Lead** — hierarchy and interaction remain understandable.
- **Design Director** — visual language is coherent across routes.
- **Tech Lead** — component and rendering architecture stays maintainable.
- **SEO Lead** — visual changes do not hide crawlable meaning.
- **Analytics Lead** — visual variants do not manufacture experiment conclusions.
- **QA Lead** — responsive, theme and interaction regressions are tested.
- **Security** — visual affordances do not overstate identity, trust or permission.
- **Accessibility** — focus, motion, contrast and semantics pass review.
- **Performance** — GPU, image and rendering cost stay bounded.
- **Content Strategy** — brand expression does not weaken product truth.

## Release checklist

- [ ] Canonical `BrandMark` is used instead of duplicated ad-hoc logo DOM.
- [ ] Sol, Tide and Signal retain stable semantic roles.
- [ ] Shared radius, shadow, motion and focus tokens are present.
- [ ] Global chrome, hero, page header, cards, dialogs and forms use the same system.
- [ ] Agora, Cabinet, Atelier and Delivery still feel like HAVEN.
- [ ] Page-header artwork is not forced into a permanent glitch animation.
- [ ] WebGL pauses offscreen/background and honors reduced motion.
- [ ] No `preserveDrawingBuffer: true` remains in decorative Three.js.
- [ ] System color preference is honored before a manual theme choice.
- [ ] Mobile interactive targets remain usable.
- [ ] `npm test` and `npm run build` pass.
