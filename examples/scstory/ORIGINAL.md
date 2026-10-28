# scroll-story-lab

**Scroll-driven animation patterns in vanilla JS and modern CSS — reveals, parallax, pinned scenes and progress, zero dependencies**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![Live demos](https://img.shields.io/badge/demos-live-2563EB)](https://alebrito124356.github.io/scroll-story-lab/)

Most scroll-animation tutorials hand you a library; this repo hands you the patterns underneath. Five self-contained HTML pages cover the techniques that power modern editorial and product pages — IntersectionObserver reveals, transform-only parallax, sticky-pinned scrollytelling, the new CSS scroll timelines, and reading-progress UI — each implemented in plain HTML, CSS and vanilla JavaScript you can read in one sitting. No build step, no npm, no CDN: clone it, open `index.html`, view source. Every page includes a `prefers-reduced-motion` treatment and comments that explain *why*, not just *how*.

## Demos

| Page | What's inside | Live |
| --- | --- | --- |
| [index.html](index.html) | Gallery landing linking every demo, plus the house rules | [open](https://alebrito124356.github.io/scroll-story-lab/index.html) |
| [reveals.html](reveals.html) | 5 demos: fade-up, staggered grid, directional entrances via data-attribute, once vs repeat, threshold & rootMargin tuning — all driven by one reusable ~30-line IntersectionObserver function | [open](https://alebrito124356.github.io/scroll-story-lab/reveals.html) |
| [parallax.html](parallax.html) | 3 demos: layered depth hero, six shapes at five speeds, 0.5x/1x/1.5x comparison rail — transform + requestAnimationFrame, passive listeners, and why `background-attachment: fixed` fails on mobile | [open](https://alebrito124356.github.io/scroll-story-lab/parallax.html) |
| [pinned-scenes.html](pinned-scenes.html) | A 300vh editorial scrollytelling scene: `position: sticky` stage, `getBoundingClientRect` progress math, three story steps with crossfading figures and a scene progress bar | [open](https://alebrito124356.github.io/scroll-story-lab/pinned-scenes.html) |
| [css-scroll-timelines.html](css-scroll-timelines.html) | 3 demos with zero JavaScript: reading bar via `animation-timeline: scroll()`, image scaling into view and sliding text via `view()` — wrapped in `@supports` with an honest fallback and a support table | [open](https://alebrito124356.github.io/scroll-story-lab/css-scroll-timelines.html) |
| [progress.html](progress.html) | 3 demos: ten-line reading progress bar, live table of contents (IntersectionObserver with a rootMargin "reading band"), back-to-top button after 600px | [open](https://alebrito124356.github.io/scroll-story-lab/progress.html) |

## Techniques

Reading the source teaches, among other things:

- **One observer, many behaviours** — a single ~30-line `IntersectionObserver` function driving fade-up, direction, stagger, and once-vs-repeat purely through data attributes and CSS.
- **`rootMargin` as a trigger line** — insetting the intersection root to move the reveal point up the viewport, and shrinking it to a thin band for scroll-spy TOCs.
- **Compositor-only motion** — animating nothing but `transform` and `opacity`, with `will-change` used surgically instead of sprayed.
- **rAF batching** — scroll listeners (always `{ passive: true }`) that only schedule; one `requestAnimationFrame` callback per frame does all reads before all writes.
- **Sticky-pin progress math** — `progress = -rect.top / (sectionHeight - viewportHeight)`, clamped, then quantised into steps for scrollytelling.
- **CSS scroll-driven animations** — `animation-timeline: scroll()` and `view()` with `animation-range`, re-timing ordinary keyframes against scroll position with no script at all.
- **Honest progressive enhancement** — from-states live in `@keyframes` and enhancements in `@supports`, so unsupporting browsers see a complete static page, never a hidden one.
- **Reduced motion as design** — every page collapses decorative movement to opacity (or nothing) under `prefers-reduced-motion`, while position-feedback like progress bars stays.

## Browser support

Everything except `css-scroll-timelines.html` runs in any evergreen browser. CSS scroll-driven animations (`animation-timeline: scroll()` / `view()`) are supported in Chrome/Edge 115+, Opera 101+ and Safari 26+; Firefox has them in development behind the `layout.css.scroll-driven-animations.enabled` flag (status as of early 2026 — check [caniuse](https://caniuse.com/mdn-css_properties_animation-timeline) for current data). That page degrades gracefully: unsupported browsers get the full static content plus a visible notice, and never a broken half-state.

## Related repos

- [css-animation-cookbook](https://github.com/AleBrito124356/css-animation-cookbook) — keyframe recipes and transition patterns in pure CSS
- [svg-animation-lab](https://github.com/AleBrito124356/svg-animation-lab) — line drawing, morphing and motion along paths
- [easing-playground](https://github.com/AleBrito124356/easing-playground) — interactive easing curves and spring motion
- [threejs-hero-collection](https://github.com/AleBrito124356/threejs-hero-collection) — WebGL hero sections with Three.js
- [tailwind-landing-sections](https://github.com/AleBrito124356/tailwind-landing-sections) — copy-paste landing page sections built with Tailwind
- [remotion-video-templates](https://github.com/AleBrito124356/remotion-video-templates) — programmatic video templates in React

## License

[MIT](LICENSE)
