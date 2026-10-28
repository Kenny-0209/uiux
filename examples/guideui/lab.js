
const $ = (s,root=document)=>root.querySelector(s);
const lab=document.body.dataset.lab;
const on=(id,fn)=>{const el=document.getElementById(id);if(el){el.addEventListener('input',fn);el.addEventListener('change',fn)}};
const get=id=>document.getElementById(id).value;
const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
if(lab==='grid'){
 const update=()=>{const cols=get('cols'),gap=get('gap'),margin=get('margin');const el=$('.sample-grid');el.style.setProperty('--cols',cols);el.style.setProperty('--gap',gap+'px');el.style.setProperty('--margin',margin+'px');set('cols-out',cols+'열');set('gap-out',gap+'px');set('margin-out',margin+'px');set('grid-note',cols+'열 · 항목 폭 '+Math.round(el.querySelector('.sample-card').getBoundingClientRect().width)+'px')};['cols','gap','margin'].forEach(x=>on(x,update));window.addEventListener('resize',update);update();
}
if(lab==='color'){
 const luminance=hex=>{const rgb=hex.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
 const update=()=>{const fg=get('fg'),bg=get('bg'),a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);const box=$('.ratio-box');box.style.setProperty('--fg',fg);box.style.setProperty('--bg',bg);set('fg-out',fg);set('bg-out',bg);set('ratio-out',ratio.toFixed(2)+':1');const r=$('.ratio');r.className='ratio '+(ratio>=4.5?'good':'bad');set('ratio-guide',ratio>=4.5?'일반 텍스트 4.5:1 기준 이상':'일반 텍스트 4.5:1 기준 미만')};['fg','bg'].forEach(x=>on(x,update));update();
}
if(lab==='icon'){
 const paths={heart:'M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.5 1.2-1.2a5.4 5.4 0 0 0 0-7.6z',search:'M21 21l-4.4-4.4 M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0z',bookmark:'M6 3h12v18l-6-4-6 4z'};
 const update=()=>{const size=get('size'),stroke=get('stroke'),icon=get('icon'),fill=get('fill');const wrap=$('.icon-demo');wrap.style.setProperty('--icon-size',size+'px');wrap.style.setProperty('--stroke',stroke);wrap.style.setProperty('--icon-fill',fill==='filled'?'#b7d2b2':'none');$('#icon-path').setAttribute('d',paths[icon]);set('size-out',size+'px');set('stroke-out',stroke+'px')};['size','stroke','icon','fill'].forEach(x=>on(x,update));update();
}
if(lab==='type'){
 const update=()=>{const title=get('title-size'),body=get('body-size'),line=get('leading'),width=get('measure');const el=$('.text-sample');el.style.setProperty('--title-size',title+'px');el.style.setProperty('--body-size',body+'px');el.style.setProperty('--leading',line);el.style.setProperty('--measure',width+'px');set('title-out',title+'px');set('body-out',body+'px');set('leading-out',line+'배');set('measure-out',width+'px')};['title-size','body-size','leading','measure'].forEach(x=>on(x,update));update();
}
if(lab==='density'){
 const update=()=>{const dp=+get('dp'),dpi=+get('dpi'),px=dp*dpi/160;set('dp-out',dp+'dp');set('dpi-out',dpi+'dpi');set('pixel-out',px.toFixed(1)+'px');const v=$('.pixel-visual');v.style.width=Math.min(100,Math.max(6,px/8))+'%';v.textContent=dp+'dp → '+px.toFixed(0)+'px'};['dp','dpi'].forEach(x=>on(x,update));update();
}
if(lab==='shrink'){
 const update=()=>{const text=get('label-text')||'레이블 텍스트',width=+get('label-width'),min=+get('min-size'),mode=get('mode'),el=$('.clip-label');el.style.width=width+'px';el.textContent=text;el.className='clip-label '+(mode==='wrap'?'wrap':'nowrap');el.style.fontSize='24px';let size=24;if(mode==='shrink'){const cv=document.createElement('canvas'),ctx=cv.getContext('2d');const actual=Math.max(0,el.clientWidth-16);while(size>min){ctx.font='700 '+size+'px "Segoe UI", "Malgun Gothic", sans-serif';if(ctx.measureText(text).width<=actual)break;size--;}el.style.fontSize=size+'px'}set('width-out',width+'px');set('min-out',min+'px');set('shrink-out',mode==='shrink'?'표시 크기 '+size+'px · 더 줄이지 않으면 넘친 글자는 생략됩니다.':mode==='wrap'?'줄을 바꿔 내용을 보여줍니다.':'한 줄에서 넘친 글자를 생략합니다.')};['label-text','label-width','min-size','mode'].forEach(x=>on(x,update));window.addEventListener('resize',update);update();
}
if(lab==='hierarchy'){
 const update=()=>{const price=get('price-size'),gap=get('section-gap');const target=$('#after');target.style.setProperty('--price-size',price+'px');target.style.setProperty('--section-gap',gap+'px');set('price-out',price+'px');set('section-out',gap+'px');const compact=get('show-detail')==='essential';target.querySelector('.detail-row').hidden=compact;target.querySelector('.detail-note').textContent=compact?'보조 설명 접힘':'보조 설명 표시'};['price-size','section-gap','show-detail'].forEach(x=>on(x,update));document.querySelectorAll('.product-cta').forEach((button,i)=>button.addEventListener('click',()=>set('action-status',i===0?'기본 구성에서 구매 버튼을 눌렀습니다.':'조절한 구성에서 구매 버튼을 눌렀습니다.')));update();
}
