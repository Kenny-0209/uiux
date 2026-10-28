/* Explicit, non-destructive controls for known local demo families.
 * Remote frames and unrelated interactive forms deliberately remain unsupported.
 */
const cssStates = new WeakMap();
const mediaStates = new WeakMap();

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
  if (/\/examples\/(?:ui0[678]|ai0(?:49|50|52|53|54))\//.test(path) && doc.querySelector('button.replay#r')) return 'replay-timers';
  if (/\/examples\/ai075\//.test(path)) return 'transcript-player';
  if (/\/examples\/ai084\//.test(path)) return 'voice-preview';
  if (/\/examples\/tpl018\//.test(path)) return 'lesson-preview';
  return null;
}

function playControl(ctx, kind) {
  const {doc} = ctx;
  if (kind === 'handbook') return doc.querySelector('[data-hb-demo], [data-hb-replay], [data-hb-autoscroll]');
  if (kind === 'css' || kind === 'shader') return doc.querySelector('#play');
  if (kind === 'codrops') return doc.querySelector('#demo');
  if (kind === 'replay-timers') return doc.querySelector('button.replay#r');
  if (kind === 'transcript-player') return doc.querySelector('#pp');
  if (kind === 'voice-preview') return doc.querySelector('#pre');
  if (kind === 'lesson-preview') return doc.querySelector('#play');
  return null;
}

function cssTarget(ctx, kind) {
  return kind === 'css' ? ctx.doc.querySelector('.stage') : kind === 'codrops' ? ctx.doc.querySelector('#pt-main') : kind === 'replay-timers' ? ctx.doc.querySelector('.wrap') : null;
}

function applyCssRate(ctx, state) {
  for (const animation of state.target.getAnimations({subtree: true})) {
    if ((ctx.win.CSSAnimation && animation instanceof ctx.win.CSSAnimation) || (ctx.win.CSSTransition && animation instanceof ctx.win.CSSTransition)) animation.playbackRate = state.slow ? 0.25 : 1;
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
  target.addEventListener('transitionrun', () => {
    if (state.slow) ctx.win.requestAnimationFrame(() => applyCssRate(ctx, state));
  }, true);
  return state;
}

// Only these known self-contained playback demos use timer-driven animation.
// Keep the original code intact, but scale subsequent timer intervals inside
// the iframe. Replaying clears the original timers and starts at the new rate.
function ensureTimedState(ctx) {
  let state = cssStates.get(ctx.doc);
  if (!state) state = ensureCssState(ctx, ctx.doc.querySelector('.wrap') || ctx.doc.body);
  if (state.timerWrapped) return state;
  state.timerWrapped = true;
  const timeout=ctx.win.setTimeout.bind(ctx.win), interval=ctx.win.setInterval.bind(ctx.win);
  ctx.win.setTimeout=(fn,delay,...args)=>timeout(fn,Number(delay||0)*(state.slow?4:1),...args);
  ctx.win.setInterval=(fn,delay,...args)=>interval(fn,Number(delay||0)*(state.slow?4:1),...args);
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
  const isMedia=kind==='transcript-player'||kind==='voice-preview'||kind==='lesson-preview';
  const canSlow=kind==='shader'?ready:kind==='replay-timers'||isMedia?!!play&&!play.disabled:canCss;
  const active=kind==='shader'?ctx.doc.body.dataset.demoSlow==='true':kind==='transcript-player'?Number(ctx.win.rate)===0.25:kind==='voice-preview'?!!mediaStates.get(ctx.doc)?.slow:!!state?.slow;
  return {show: !!play && !play.disabled && ready, slow: slow ? !slow.disabled : canSlow,
    reset: true, slowActive: slow ? !!slow.checked : active};
}

/** Activates only an explicitly identified demo-play control. */
export function showDemo(frame) {
  const ctx = demoContext(frame);
  if (!ctx) return false;
  const kind = family(ctx), play = playControl(ctx, kind);
  if (!play || play.disabled) return false;
  if (kind === 'css' && play.getAttribute('aria-pressed') === 'true') return true;
  if (kind === 'shader' && ctx.doc.body.dataset.renderState !== 'ready') return false;
  if ((kind === 'shader' || kind === 'transcript-player') && play.getAttribute('aria-label')?.toLowerCase().includes(kind==='shader'?'일시정지':'pause')) return true;
  // The course mockup cannot seek back after its sample ends. Reload its
  // isolated preview, then start the sample again at the selected rate.
  if (kind === 'lesson-preview' && parseFloat(ctx.doc.querySelector('#pb')?.style.width)>=100) {
    const slow=!!cssStates.get(ctx.doc)?.slow;
    frame.addEventListener('load',()=>{if(slow){setDemoSlow(frame,true);frame.contentDocument?.dispatchEvent(new frame.contentWindow.Event('uiux-demo-state'));}showDemo(frame)},{once:true});
    return resetDemo(frame);
  }
  if (kind === 'lesson-preview' && play.getAttribute('aria-pressed')==='true') return true;
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
  if (kind === 'shader') {
    if (ctx.doc.body.dataset.renderState !== 'ready') return false;
    ctx.doc.dispatchEvent(new ctx.win.CustomEvent('uiux-set-slow', {detail:{slow:!!on}}));
    return ctx.doc.body.dataset.demoSlow===String(!!on);
  }
  if (kind === 'transcript-player') {
    const button=ctx.doc.querySelector('#sp');if(!button||!Number.isFinite(Number(ctx.win.rate)))return false;
    let media=mediaStates.get(ctx.doc)||{};if(on&&!media.slow)media.previous=Number(ctx.win.rate);
    media.slow=!!on;mediaStates.set(ctx.doc,media);ctx.win.rate=on?0.25:(media.previous||1);
    button.textContent=`${ctx.win.rate}x`;button.setAttribute('aria-label',`Playback speed ${ctx.win.rate} times`);return true;
  }
  if (kind === 'voice-preview') {
    const input=ctx.doc.querySelector('#r');if(!input||ctx.doc.querySelector('#pre')?.disabled)return false;
    let media=mediaStates.get(ctx.doc)||{};if(on&&!media.slow)media.previous=input.value;
    media.slow=!!on;mediaStates.set(ctx.doc,media);input.value=on?input.min:(media.previous||'1');
    input.dispatchEvent(new ctx.win.Event('input',{bubbles:true}));return true;
  }
  if (kind === 'replay-timers' || kind === 'lesson-preview') {
    const state=ensureTimedState(ctx);state.slow=!!on;applyCssRate(ctx,state);
    const play=playControl(ctx,kind);
    if(kind==='replay-timers')play?.click();
    else if(play?.getAttribute('aria-pressed')==='true'){play.click();play.click();}
    return true;
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
