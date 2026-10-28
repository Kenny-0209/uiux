/* Explicit, non-destructive controls for known local demo families.
 * Remote frames and unrelated interactive forms deliberately remain unsupported.
 */
const cssStates = new WeakMap();

function demoContext(frame) {
  try {
    const doc = frame?.contentDocument;
    const win = frame?.contentWindow;
    if (!doc || !win || doc.readyState === 'loading' || win.location.origin !== location.origin) return null;
    return {doc, win, path: win.location.pathname};
  } catch (_) { return null; }
}

function family(ctx) {
  const {doc, path} = ctx;
  if (doc.body?.matches('[data-hb-kind]')) return 'handbook';
  if (/\/examples\/(magiccss|animate37|ctext)\//.test(path)) return 'css';
  if (/\/examples\/cdpt\//.test(path)) return 'codrops';
  if (/\/examples\/gt\d+\//.test(path)) return 'shader';
  return null;
}

function playControl(ctx, kind) {
  const {doc} = ctx;
  if (kind === 'handbook') return doc.querySelector('[data-hb-demo], [data-hb-replay], [data-hb-autoscroll]');
  if (kind === 'css' || kind === 'shader') return doc.querySelector('#play');
  if (kind === 'codrops') return doc.querySelector('#demo');
  return null;
}

function cssTarget(ctx, kind) {
  return kind === 'css' ? ctx.doc.querySelector('.stage') : kind === 'codrops' ? ctx.doc.querySelector('#pt-main') : null;
}

function applyCssRate(ctx, state) {
  for (const animation of state.target.getAnimations({subtree: true})) {
    if (ctx.win.CSSAnimation && animation instanceof ctx.win.CSSAnimation) animation.playbackRate = state.slow ? 0.25 : 1;
  }
}

function ensureCssState(ctx, target) {
  let state = cssStates.get(ctx.doc);
  if (state) return state;
  state = {target, slow: false};
  cssStates.set(ctx.doc, state);
  target.addEventListener('animationstart', () => {
    if (state.slow) ctx.win.requestAnimationFrame(() => applyCssRate(ctx, state));
  }, true);
  return state;
}

/** Returns current supported capabilities; re-run after every iframe load. */
export function inspectDemo(frame) {
  const ctx = demoContext(frame);
  if (!ctx) return {show: false, slow: false, reset: !!frame, slowActive: false};
  const kind = family(ctx), play = playControl(ctx, kind);
  const slow = kind === 'handbook' ? ctx.doc.querySelector('[data-hb-slowmo]') : null;
  const target = cssTarget(ctx, kind);
  const canCss = !!(target?.getAnimations && ctx.win.CSSAnimation && !ctx.win.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const state = cssStates.get(ctx.doc);
  const ready = kind !== 'shader' || ctx.doc.body.dataset.renderState === 'ready';
  return {show: !!play && !play.disabled && ready, slow: slow ? !slow.disabled : canCss,
    reset: true, slowActive: slow ? !!slow.checked : !!state?.slow};
}

/** Activates only an explicitly identified demo-play control. */
export function showDemo(frame) {
  const ctx = demoContext(frame);
  if (!ctx) return false;
  const kind = family(ctx), play = playControl(ctx, kind);
  if (!play || play.disabled) return false;
  if (kind === 'css' && play.getAttribute('aria-pressed') === 'true') return true;
  if (kind === 'shader' && (ctx.doc.body.dataset.renderState !== 'ready' || play.getAttribute('aria-label')?.includes('일시정지'))) return false;
  play.click();
  return true;
}

/** Slow motion delegates to Handbook, or controls CSS animations for tested families. */
export function setDemoSlow(frame, on) {
  const ctx = demoContext(frame);
  if (!ctx) return false;
  const kind = family(ctx);
  const slow = kind === 'handbook' ? ctx.doc.querySelector('[data-hb-slowmo]') : null;
  if (slow) {
    if (slow.disabled) return false;
    if (slow.checked !== !!on) slow.click();
    return slow.checked === !!on;
  }
  const target = cssTarget(ctx, kind);
  if (!target?.getAnimations || !ctx.win.CSSAnimation || ctx.win.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const state = ensureCssState(ctx, target);
  state.slow = !!on;
  applyCssRate(ctx, state);
  return true;
}

/** Reload preserves the original URL including its query and works for remote frames. */
export function resetDemo(frame) {
  if (!frame?.src) return false;
  frame.src = frame.src;
  return true;
}
