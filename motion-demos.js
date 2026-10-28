const motionIds = new Set(['magnetic', 'cursor', 'spring', 'easing', 'crossfade', 'dolly-zoom', 'dolly', 'zoom', 'pan-tilt']);
export function hasMotionDemo(entry) { return Boolean(entry && motionIds.has(entry.id)); }

// Each study owns its listeners and animation; unmounting it stops both.
export function mountMotionDemo(host, entry) {
  if (!host || !hasMotionDemo(entry)) return () => {};
  const root = document.createElement('div');
  root.className = 'motion-demo';
  host.replaceChildren(root);
  const listeners = [];
  let animation = 0;
  const on = (el, type, handler, options) => {
    if (!el) return;
    el.addEventListener(type, handler, options);
    listeners.push(() => el.removeEventListener(type, handler, options));
  };
  const $ = selector => root.querySelector(selector);
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const title = (text, hint = '직접 조작') => `<div class="md-title"><span>${text}</span><small>${hint}</small></div>`;

  if (entry.id === 'magnetic') {
    root.innerHTML = title('포인터가 가까워지면 버튼이 끌려옵니다') + `
      <div class="md-stage md-magnet"><div class="md-field" tabindex="0" aria-label="마그네틱 버튼 실험 영역. 방향키로 포인터를 움직이세요.">
        <span class="md-halo" aria-hidden="true"></span><button type="button" class="md-target">자석 버튼 ↗</button><span class="md-pointer" aria-hidden="true"></span>
      </div></div><div class="md-toolbar"><span class="md-hint">마우스나 손가락을 점선 안으로 움직여 보세요 · 방향키도 지원</span></div>`;
    const field = $('.md-field'), target = $('.md-target'), pointer = $('.md-pointer');
    let keyX = 0, keyY = 0;
    const reset = () => { target.style.transform = ''; };
    const move = (x, y, keyboard = false) => {
      const r = field.getBoundingClientRect();
      const dx = x - r.width / 2, dy = y - r.height / 2;
      const distance = Math.hypot(dx, dy), radius = Math.min(80, r.width * .4, r.height * .4);
      const influence = Math.max(0, 1 - distance / Math.max(radius, 1));
      target.style.transform = `translate(${dx * influence * .42}px, ${dy * influence * .42}px)`;
      pointer.style.left = `${Math.max(0, Math.min(r.width, x))}px`;
      pointer.style.top = `${Math.max(0, Math.min(r.height, y))}px`;
      if (keyboard) field.dataset.keyboard = 'true'; else delete field.dataset.keyboard;
    };
    on(field, 'pointermove', e => { const r = field.getBoundingClientRect(); move(e.clientX-r.left, e.clientY-r.top); });
    on(field, 'pointerdown', e => { if (e.pointerType === 'touch') { const r=field.getBoundingClientRect(); move(e.clientX-r.left,e.clientY-r.top); field.setPointerCapture(e.pointerId); } });
    on(field, 'pointerleave', reset);
    on(field, 'pointercancel', reset);
    on(field, 'pointerup', e => { if (e.pointerType === 'touch') reset(); });
    on(field, 'keydown', e => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      const r = field.getBoundingClientRect();
      keyX = Math.max(-r.width/2, Math.min(r.width/2, keyX + (e.key==='ArrowRight'?12:e.key==='ArrowLeft'?-12:0)));
      keyY = Math.max(-r.height/2, Math.min(r.height/2, keyY + (e.key==='ArrowDown'?12:e.key==='ArrowUp'?-12:0)));
      move(r.width/2+keyX, r.height/2+keyY, true);
    });
    on(field, 'blur', e => { if (!field.contains(e.relatedTarget)) { delete field.dataset.keyboard; reset(); } });
    on(target, 'click', () => { target.textContent = '선택했어요 ✓'; });
  } else if (entry.id === 'cursor') {
    root.innerHTML = title('커서를 따라오는 원의 크기를 바꿔 보세요') + `
      <div class="md-stage md-cursor"><div class="md-field" tabindex="0" aria-label="커서 실험 영역. 포인터 또는 방향키로 움직이세요."><span class="md-ring" aria-hidden="true"></span><span class="md-caption">여기에서 포인터를 움직여 보세요</span><span class="md-orb" aria-hidden="true"></span></div></div>
      <div class="md-toolbar"><label>크기 <input type="range" min="18" max="72" value="38" aria-label="커서 표시 크기"><output>38px</output></label><span class="md-hint">터치 · 방향키 지원</span></div>`;
    const field = $('.md-field'), orb = $('.md-orb'), input = $('input'), output = $('output');
    let x = 50, y = 50;
    const draw = () => { orb.style.left=x+'%'; orb.style.top=y+'%'; };
    on(field, 'pointermove', e => { const r=field.getBoundingClientRect(); x=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)); y=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100)); draw(); });
    on(field, 'pointerdown', e => { if (e.pointerType==='touch') { field.setPointerCapture(e.pointerId); const r=field.getBoundingClientRect(); x=(e.clientX-r.left)/r.width*100; y=(e.clientY-r.top)/r.height*100; draw(); } });
    on(field, 'keydown', e => { if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return; e.preventDefault(); e.stopPropagation(); x=Math.max(0,Math.min(100,x+(e.key==='ArrowRight'?5:e.key==='ArrowLeft'?-5:0))); y=Math.max(0,Math.min(100,y+(e.key==='ArrowDown'?5:e.key==='ArrowUp'?-5:0))); draw(); });
    on(input, 'input', () => { orb.style.width=orb.style.height=input.value+'px'; output.textContent=input.value+'px'; });
  } else if (entry.id === 'spring') {
    root.innerHTML = title('감쇠가 작을수록 더 오래 흔들립니다') + `
      <div class="md-stage md-spring"><div class="md-track"><div class="md-stop" aria-hidden="true"></div><div class="md-ball"></div></div></div>
      <div class="md-toolbar"><label>감쇠 <input type="range" min="5" max="30" value="10" aria-label="스프링 감쇠"><output>10</output></label><button type="button" data-play>다시 움직이기 ↗</button></div>`;
    const ball=$('.md-ball'), input=$('input'), output=$('output');
    const play = () => {
      cancelAnimationFrame(animation);
      if (reduced()) { ball.style.left='100%'; return; }
      let x=0, velocity=0, last=0;
      const tick = time => {
        if (!last) last=time;
        const dt=Math.min((time-last)/1000,.032); last=time;
        for (let i=0;i<4;i++) { const h=dt/4; velocity+=(-120*(x-1)-Number(input.value)*velocity)*h; x+=velocity*h; }
        ball.style.left=`${Math.max(-.1,Math.min(1.1,x))*100}%`;
        if (Math.abs(x-1)>.002 || Math.abs(velocity)>.003) animation=requestAnimationFrame(tick);
      };
      ball.style.left='0%'; animation=requestAnimationFrame(tick);
    };
    on(input,'input',()=>{ output.textContent=input.value; play(); });
    on($('[data-play]'),'click',play);
  } else if (entry.id === 'easing') {
    root.innerHTML = title('같은 거리, 서로 다른 속도') + `
      <div class="md-stage md-easing"><div class="md-races"><div class="md-race"><small>선택한 곡선</small><span data-eased></span></div><div class="md-race linear"><small>일정한 속도</small><span data-linear></span></div></div>
      <svg viewBox="-4 -4 108 108" role="img" aria-label="시간에 따른 진행률 곡선"><line class="md-axis" x1="0" y1="100" x2="100" y2="100"/><line class="md-axis" x1="0" y1="100" x2="0" y2="0"/><line class="md-graph-guide" x1="0" y1="100" x2="100" y2="0"/><polyline class="md-graph-line"/></svg></div>
      <div class="md-toolbar"><select aria-label="이징 종류"><option value="in">천천히 출발</option><option value="out">천천히 도착</option><option value="inout">출발과 도착</option></select><button type="button" data-play>비교 재생 ↗</button></div>`;
    const select=$('select'), graph=$('.md-graph-line'), eased=$('[data-eased]'), linear=$('[data-linear]');
    const curve = p => select.value==='in' ? p*p*p : select.value==='out' ? 1-Math.pow(1-p,3) : p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
    const drawGraph = () => { graph.setAttribute('points',Array.from({length:41},(_,i)=>{const p=i/40;return `${p*100},${100-curve(p)*100}`}).join(' ')); };
    const play = () => {
      cancelAnimationFrame(animation); eased.style.left='0%'; linear.style.left='0%';
      if (reduced()) { eased.style.left=linear.style.left='100%'; return; }
      let start=0;
      const tick = time => { if(!start) start=time; const p=Math.min(1,(time-start)/1300); eased.style.left=`${curve(p)*100}%`; linear.style.left=`${p*100}%`; if(p<1) animation=requestAnimationFrame(tick); };
      animation=requestAnimationFrame(tick);
    };
    drawGraph(); on(select,'change',()=>{drawGraph();play();}); on($('[data-play]'),'click',play);
  } else if (['dolly-zoom','dolly','zoom','pan-tilt'].includes(entry.id)) {
    const messages = {
      'dolly': '카메라가 앞으로 이동하고 화각은 그대로입니다',
      'zoom': '카메라는 고정하고 화각을 좁힙니다',
      'dolly-zoom': '카메라를 옮기며 화각을 넓혀 피사체 크기를 유지합니다',
      'pan-tilt': '카메라 위치는 고정하고 바라보는 방향을 돌립니다'
    };
    root.innerHTML = title(messages[entry.id], '2D 개념 모형') + `
      <div class="md-stage md-camera">
        <svg viewBox="0 0 600 230" role="img" aria-label="카메라 위치와 시야각, 결과 장면을 나란히 보여 주는 2D 개념 모형">
          <rect x="0" y="0" width="225" height="230" fill="#242539"/><text x="12" y="20" class="md-svg-label">위에서 본 배치 · 개념도</text>
          <path d="M12 117H218" stroke="#ffffff35" stroke-dasharray="4 5"/>
          <path data-cone fill="#bca7f01e" stroke="#cbb5ff88" stroke-width="1"/>
          <g data-camera><rect x="-10" y="-11" width="20" height="22" rx="4" fill="#eee6ff"/><path d="M9 -7l9 4v6l-9 4z" fill="#c3aef2"/><path d="M-10 0h-8" stroke="#eee6ff" stroke-width="2"/></g>
          <circle cx="172" cy="117" r="8" fill="#f5be97"/><text x="157" y="145" class="md-svg-label">피사체</text>
          <path d="M207 65v104" stroke="#91c5c0" stroke-width="6"/><text x="196" y="190" class="md-svg-label">배경</text>
          <svg x="232" y="0" width="368" height="230" viewBox="0 0 368 230" overflow="hidden">
            <rect width="368" height="230" fill="#7ba7b2"/>
            <g data-scene-move>
              <g data-camera-bg>
                <circle cx="292" cy="45" r="24" fill="#fbe9bf"/>
                <path d="M0 165l62-60 49 35 65-73 74 73 47-38 71 67v61H0z" fill="#698994"/>
                <rect x="35" y="90" width="32" height="86" rx="3" fill="#496879"/>
                <rect x="293" y="76" width="35" height="99" rx="3" fill="#496879"/>
                <path d="M0 177h368v53H0z" fill="#3e5865"/>
              </g>
              <g data-camera-subject fill="#f6ccb0"><circle cx="184" cy="92" r="17"/><path d="M162 124q22-15 44 0l13 64h-70z"/></g>
            </g>
            <text x="12" y="20" class="md-svg-label md-svg-light">결과 장면 · 설명용</text>
          </svg>
        </svg>
      </div>
      <div class="md-camera-values" aria-live="polite"><span data-distance></span><span data-angle></span><span data-camera-hint></span>${entry.id==='pan-tilt'?'':'<span class="md-camera-assumption">36mm 센서 기준</span>'}</div>
      <div class="md-toolbar">${entry.id==='pan-tilt'?'<button type="button" data-direction aria-pressed="false">팬 ↔</button>':''}<label>진행 <input type="range" min="0" max="100" value="0" aria-label="카메라 동작 진행"><output>0%</output></label></div>`;
    const input=$('input'), output=$('output'), subject=$('[data-camera-subject]'), bg=$('[data-camera-bg]');
    const camera=$('[data-camera]'), cone=$('[data-cone]'), sceneMove=$('[data-scene-move]');
    const distanceLabel=$('[data-distance]'), angleLabel=$('[data-angle]'), hint=$('[data-camera-hint]');
    let tilt=false;
    const drawCamera = () => {
      const t=Number(input.value)/100;
      let distance=7, focal=35;
      if(entry.id==='dolly') distance=7-3.5*t;
      else if(entry.id==='zoom') focal=35+35*t;
      else if(entry.id==='dolly-zoom') { distance=7-3.5*t; focal=35*distance/7; }
      const fov=2*Math.atan(36/(2*focal))*180/Math.PI;
      const subjectScale=(focal/35)*(7/distance);
      const backgroundScale=(focal/35)*(14/(distance+7));
      const cameraX=45+(7-distance)*18;
      const spread=Math.min(105, Math.tan(fov*Math.PI/360)*95);
      const turn=entry.id==='pan-tilt' && !tilt ? 24*t : 0;
      camera.setAttribute('transform',`translate(${cameraX} 117)`);
      cone.setAttribute('d',`M${cameraX+15} 117 L${cameraX+105} ${117-spread-turn} L${cameraX+105} ${117+spread-turn} Z`);
      subject.setAttribute('transform',`translate(184 135) scale(${subjectScale}) translate(-184 -135)`);
      bg.setAttribute('transform',`translate(184 115) scale(${backgroundScale}) translate(-184 -115)`);
      sceneMove.setAttribute('transform',entry.id==='pan-tilt' ? (tilt ? `translate(0 ${-35*t})` : `translate(${-58*t} 0)`) : 'translate(0 0)');
      output.textContent=`${input.value}%`;
      if(entry.id==='pan-tilt') {
        distanceLabel.textContent='위치: 고정'; angleLabel.textContent=`${tilt?'수직':'수평'} 방향: ${Math.round(30*t)}°`;
        hint.textContent=tilt?'위아래로 회전':'좌우로 회전';
      } else {
        distanceLabel.textContent=`거리: ${distance.toFixed(1)} m`;
        angleLabel.textContent=`수평 화각: 약 ${Math.round(fov)}°`;
        hint.textContent=entry.id==='dolly-zoom'?'피사체 크기: 일정':entry.id==='dolly'?'화각: 고정':'위치: 고정';
      }
    };
    on(input,'input',drawCamera);
    on($('[data-direction]'),'click',()=>{tilt=!tilt;const toggle=$('[data-direction]');toggle.textContent=tilt?'틸트 ↕':'팬 ↔';toggle.setAttribute('aria-pressed',String(tilt));drawCamera();});
    drawCamera();
  } else if (entry.id === 'crossfade') {
    root.innerHTML = title('두 장면이 겹치며 바뀝니다') + `
      <div class="md-stage md-crossfade">
       <svg class="md-scene" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="낮의 산과 해"><rect width="400" height="180" fill="#90d5db"/><circle cx="300" cy="48" r="25" fill="#fff0bb"/><path d="M0 155L90 64l54 54 57-76 118 108 81-52v82H0" fill="#7daf99"/><path d="M0 180v-40l78-36 72 50 81-65 95 66 74-30v55" fill="#436f72"/></svg>
       <svg class="md-scene md-scene-b" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice" role="img" aria-label="밤의 산과 달"><rect width="400" height="180" fill="#332a58"/><circle cx="300" cy="48" r="24" fill="#ffdfb5"/><circle cx="310" cy="40" r="23" fill="#332a58"/><g fill="#fff1d4"><circle cx="52" cy="28" r="2"/><circle cx="120" cy="55" r="2"/><circle cx="197" cy="28" r="2"/><circle cx="353" cy="70" r="2"/></g><path d="M0 155L90 64l54 54 57-76 118 108 81-52v82H0" fill="#625480"/><path d="M0 180v-40l78-36 72 50 81-65 95 66 74-30v55" fill="#292843"/></svg>
       <span class="md-scene-label">A · 낮</span><span class="md-scene-label">B · 밤</span>
      </div><div class="md-toolbar"><label>전환 <input type="range" min="0" max="100" value="50" aria-label="장면 전환 비율"><output>50%</output></label><span class="md-hint">A에서 B로</span></div>`;
    const input=$('input'), output=$('output'), scene=$('.md-scene-b');
    on(input,'input',()=>{scene.style.opacity=Number(input.value)/100;output.textContent=input.value+'%';});
  }
  // Interactive controls must not activate the surrounding detail card.
  on(root, 'click', e => e.stopPropagation());
  return () => { cancelAnimationFrame(animation); for(const dispose of listeners) dispose(); if(root.isConnected) root.remove(); };
}
