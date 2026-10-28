const $ = (s, root = document) => root.querySelector(s);
const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const motion = [
 {id:'motion-gestures',name:'호버와 클릭 제스처',english:'Gestures',category:'인터랙션',description:'포인터를 올리고 눌러 반응을 확인하세요.',tags:['호버','클릭','제스처'],preview:'https://examples.motion.dev/js/gestures',sourceName:'Motion',sourceUrl:'https://motion.dev/examples/js-gestures',license:'원본 제공 · 온라인',remote:true},
 {id:'motion-accordion',name:'아코디언',english:'Accordion',category:'UI 패턴',description:'각 항목을 눌러 열고 닫는 실제 아코디언입니다.',tags:['아코디언','펼치기'],preview:'https://examples.motion.dev/js/accordion',sourceName:'Motion',sourceUrl:'https://motion.dev/examples/js-accordion',license:'원본 제공 · 온라인',remote:true},
 {id:'motion-drag',name:'드래그',english:'Drag',category:'인터랙션',description:'도형을 직접 잡고 움직이는 Motion 공식 예시입니다.',tags:['드래그','제스처'],preview:'https://examples.motion.dev/js/drag',sourceName:'Motion',sourceUrl:'https://motion.dev/examples/js-drag',license:'원본 제공 · 온라인',remote:true},
 {id:'motion-spring',name:'스프링',english:'Spring',category:'모션',description:'Motion의 스프링 애니메이션 원본 예시입니다.',tags:['스프링','탄성'],preview:'https://examples.motion.dev/js/spring',sourceName:'Motion',sourceUrl:'https://motion.dev/examples/js-spring',license:'원본 제공 · 온라인',remote:true},
 {id:'motion-hover',name:'호버 반응',english:'Hover',category:'인터랙션',description:'포인터를 올리면 반응하는 원본 예시입니다.',tags:['호버','포인터'],preview:'https://examples.motion.dev/js/hover',sourceName:'Motion',sourceUrl:'https://motion.dev/examples/js-hover',license:'원본 제공 · 온라인',remote:true},
 {id:'motion-press',name:'누르기 반응',english:'Press',category:'인터랙션',description:'포인터나 키보드로 눌러 반응을 확인하세요.',tags:['클릭','키보드','제스처'],preview:'https://examples.motion.dev/js/press',sourceName:'Motion',sourceUrl:'https://motion.dev/examples/js-press',license:'원본 제공 · 온라인',remote:true},
];
import {inspectDemo, showDemo, setDemoSlow, resetDemo} from './demo-adapter.js';
const initialCategories=['전체','화면 구성','UI 패턴','모션과 인터랙션','화면 전환','카메라','3D'];
for(const e of motion) e.category=e.category==='인터랙션'||e.category==='모션'?'모션과 인터랙션':e.category;
let examples=[], category='전체', subcategory='전체', selectedTag='', platform='전체', query='', currentFiles=[], codeRequest=0;
let expanded=null;
const mobileSubfilters=document.createElement('div');mobileSubfilters.id='subfilters-mobile';mobileSubfilters.className='subfilters-mobile';mobileSubfilters.setAttribute('aria-label','세부 분류');$('#mobile-filters').after(mobileSubfilters);
const activeTag=document.createElement('div');activeTag.id='active-tag';activeTag.className='active-tag';activeTag.setAttribute('aria-live','polite');$('#platform-filters').closest('.platform-bar').after(activeTag);
const norm = x => String(x || '').normalize('NFKC').toLocaleLowerCase().trim();
function updateExpandButton(wrap,active){const btn=wrap?.querySelector('[data-expand]');if(!btn)return;btn.textContent=active?'↙  축소':'↗  크게 보기';btn.setAttribute('aria-expanded',String(active));btn.setAttribute('aria-label',`${btn.dataset.title} ${active?'축소':'크게 보기'}`);}
function clearExpanded({focus=true}={}){if(!expanded)return;const wrap=expanded;expanded=null;const card=wrap.closest('.work-card');card?.classList.remove('is-expanded');card?.style.removeProperty('--expanded-preview-height');updateExpandButton(wrap,false);if(focus&&wrap.isConnected)wrap.querySelector('[data-expand]')?.focus({preventScroll:true});}
function toggleExpanded(wrap){if(expanded===wrap){clearExpanded();return}if(expanded)clearExpanded({focus:false});const card=wrap.closest('.work-card');if(!card)return;const preview=wrap.querySelector('iframe, .gpu-placeholder');const height=preview?.getBoundingClientRect().height||270;card.style.setProperty('--expanded-preview-height',`${Math.round(height*2)}px`);expanded=wrap;card.classList.add('is-expanded');updateExpandButton(wrap,true);card.scrollIntoView({block:'start',behavior:'smooth'});}
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&expanded&&!$('#code-dialog').open){event.preventDefault();clearExpanded();}});
function needsGPU(e){return Boolean(e.requiresGPU || e.category==='3D');}
function frame(e, eager=true){
 const height=Number(e.previewHeight);const style=Number.isFinite(height)&&height>=200&&height<=650?` style="height:${height}px"`:'';
 return `<iframe src="${escapeHTML(e.preview)}" title="${escapeHTML(e.name)} 실시간 예시" loading="${eager?'eager':'lazy'}" sandbox="allow-scripts allow-forms allow-same-origin allow-popups" allow="clipboard-write" referrerpolicy="no-referrer"${style}></iframe>`;
}
function gpuPlaceholder(e,failed=false){return `<div class="gpu-placeholder"><span>INTERACTIVE DEMO</span><p>${failed?'예시를 불러오지 못했습니다.':'화면에 보이면 자동으로 불러옵니다.'}</p>${failed?`<button type="button" data-retry-gpu="${escapeHTML(e.id)}">다시 시도</button>`:''}</div>`;}
// Keep GPU use bounded and load only panels in or immediately near the viewport.
const gpuVisible=new Set(),gpuActive=new Map();
const MAX_GPU_ACTIVE=4,MAX_GPU_LOADING=1;
function setGpuWaiting(host){
 const card=host.closest('.work-card'),state=card&&skeletonStates.get(card);if(!state)return;
 clearTimeout(state.timer);state.ready=false;state.entered=false;card.classList.remove('skeleton-entering');
 card.classList.add('is-loading');card.setAttribute('aria-busy','true');skeletonObserver.observe(card);
}
function stopGpu(host,{reset=true}={}){
 const entry=gpuActive.get(host);if(!entry)return;
 clearTimeout(entry.timer);gpuActive.delete(host);delete host.dataset.gpuActive;
 if(reset&&host.isConnected){
  const preview=host.querySelector('iframe'),height=preview?.getBoundingClientRect().height||0;
  host.innerHTML=gpuPlaceholder(entry.example);const placeholder=host.querySelector('.gpu-placeholder');if(height)placeholder.style.height=`${height}px`;
  setGpuWaiting(host);playerLoading(host.closest('.demo-wrap'),true);
 }
}
function startGpu(host){
 const e=examples.find(x=>x.id===host.dataset.gpuWatch);if(!e||gpuActive.has(host))return;
 const height=host.querySelector('.gpu-placeholder')?.getBoundingClientRect().height||0;
 const entry={example:e,loading:true,timer:0};gpuActive.set(host,entry);host.dataset.gpuActive=e.id;
 host.innerHTML=frame(e);const preview=host.querySelector('iframe');if(height)preview.style.height=`${height}px`;
 showFrameSkeleton(preview);playerLoading(host.closest('.demo-wrap'));
 entry.timer=setTimeout(()=>{
  if(gpuActive.get(host)!==entry||!entry.loading)return;
  gpuActive.delete(host);delete host.dataset.gpuActive;host.dataset.gpuFailed='true';
  const currentHeight=preview.getBoundingClientRect().height||height;host.innerHTML=gpuPlaceholder(e,true);
  const placeholder=host.querySelector('.gpu-placeholder');if(currentHeight)placeholder.style.height=`${currentHeight}px`;
  placeholderReady(host);playerLoading(host.closest('.demo-wrap'),true);scheduleGpu();
 },20000);
}
function scheduleGpu(){
 if(document.hidden)return;
 let loading=[...gpuActive.values()].filter(x=>x.loading).length;
 for(const host of gpuVisible){
  if(gpuActive.size>=MAX_GPU_ACTIVE||loading>=MAX_GPU_LOADING)break;
  if(!host.isConnected||gpuActive.has(host)||host.dataset.gpuFailed)continue;
  startGpu(host);loading++;
 }
}
const gpuObserver=new IntersectionObserver(records=>{
 for(const record of records){const host=record.target;
  if(record.isIntersecting)gpuVisible.add(host);
  else{gpuVisible.delete(host);delete host.dataset.gpuFailed;stopGpu(host)}
 }
 scheduleGpu();
},{rootMargin:'80px 0px 80px 0px'});
document.addEventListener('visibilitychange',()=>{if(document.hidden){for(const host of [...gpuActive.keys()])stopGpu(host)}else scheduleGpu()});
async function selectCode(index){
 const item=currentFiles[index];if(!item)return;const request=++codeRequest;
 $('#code-files').innerHTML=currentFiles.map((f,i)=>`<button type="button" data-file="${i}" aria-pressed="${i===index}">${escapeHTML(f.label)}</button>`).join('');
 $('#code-text').textContent='불러오는 중…';
 try{const res=await fetch(item.path);if(!res.ok)throw new Error(`HTTP ${res.status}`);const value=await res.text();if(request===codeRequest)$('#code-text').textContent=value;}
 catch(err){if(request===codeRequest)$('#code-text').textContent=`파일을 불러오지 못했습니다. (${err.message})`;}
}
function platformList(e){return Array.isArray(e.platforms)?e.platforms.filter(x=>x==='데스크톱'||x==='모바일'):[];}
function matchesPlatform(e){const p=platformList(e);return platform==='전체'||(platform==='미확인'?!p.length:p.includes(platform));}
function categoryFacets(e,name){return e.category===name?(e.taxonomy?.subcategories||[]):(e.taxonomy?.related?.[name]||[]);}
function matchesCategory(e,name=category){return name==='전체'||e.category===name||categoryFacets(e,name).length>0;}
function matchesSearch(e){const q=norm(query);return !q||[e.name,e.english,e.category,e.sourceName,...(e.tags||[]),...(e.taxonomy?.subcategories||[]),...Object.values(e.taxonomy?.related||{}).flat()].some(x=>norm(x).includes(q));}
function matchesTag(e){return !selectedTag||(e.tags||[]).some(t=>norm(t)===norm(selectedTag));}
function eligible(e){return matchesPlatform(e)&&matchesSearch(e)&&matchesTag(e);}
function renderPlatforms(){const choices=['전체','데스크톱','모바일','미확인'];$('#platform-filters').innerHTML=choices.map(x=>{const n=x==='전체'?examples.length:examples.filter(e=>x==='미확인'?!platformList(e).length:platformList(e).includes(x)).length;return `<button type="button" class="platform-chip ${platform===x?'is-active':''}" data-platform="${x}" aria-pressed="${platform===x}">${x}<span>${n}</span></button>`}).join('');}
function renderFilters(){
  const names=[...new Set([...initialCategories,...examples.map(x=>x.category)])];
  const counts=new Map();if(category!=='전체')examples.filter(e=>eligible(e)&&matchesCategory(e)).forEach(e=>categoryFacets(e,category).forEach(f=>counts.set(f,(counts.get(f)||0)+1)));
  const facets=[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'ko'));
  const subButtons=facets.map(([name,n])=>`<button type="button" class="subfilter ${name===subcategory?'is-active':''}" data-subcategory="${escapeHTML(name)}" aria-pressed="${name===subcategory}"><span>${escapeHTML(name)}</span><span>${n}</span></button>`).join('');
  $('#filters').innerHTML=names.map(name=>{const n=examples.filter(e=>eligible(e)&&matchesCategory(e,name)).length;const nested=name===category&&name!=='전체'&&facets.length?`<div class="subfilter-list" aria-label="${escapeHTML(name)} 세부 분류"><button type="button" class="subfilter ${subcategory==='전체'?'is-active':''}" data-subcategory="전체" aria-pressed="${subcategory==='전체'}"><span>전체 보기</span><span>${n}</span></button>${subButtons}</div>`:'';return `<button class="filter ${name===category?'is-active':''}" type="button" data-filter="${escapeHTML(name)}" aria-pressed="${name===category}"><span>${escapeHTML(name)}</span><span>${n}</span></button>${nested}`}).join('');
  $('#mobile-filters').innerHTML=names.map(name=>`<button class="chip ${name===category?'is-active':''}" type="button" data-filter="${escapeHTML(name)}" aria-pressed="${name===category}">${escapeHTML(name)}</button>`).join('');
  $('#subfilters-mobile').innerHTML=category!=='전체'&&facets.length?`<span>세부 분류</span><button class="subchip ${subcategory==='전체'?'is-active':''}" data-subcategory="전체" type="button" aria-pressed="${subcategory==='전체'}">전체</button>${facets.map(([name,n])=>`<button class="subchip ${name===subcategory?'is-active':''}" data-subcategory="${escapeHTML(name)}" type="button" aria-pressed="${name===subcategory}">${escapeHTML(name)} <small>${n}</small></button>`).join('')}`:'';
  $('#active-tag').innerHTML=selectedTag?`<span>태그</span><button type="button" data-clear-tag aria-label="${escapeHTML(selectedTag)} 태그 필터 해제">#${escapeHTML(selectedTag)} <b aria-hidden="true">×</b></button>`:'';
}
let matchesToShow=[], visibleCount=0;
const PAGE_SIZE=24;
const skeletonStates=new WeakMap();
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const skeletonObserver=new IntersectionObserver(records=>records.forEach(({target,isIntersecting})=>{
 if(!isIntersecting)return;
 const state=skeletonStates.get(target);if(!state||state.entered)return;
 state.entered=true;state.started=performance.now();target.classList.add('skeleton-entering');
 skeletonObserver.unobserve(target);finishSkeleton(target);
}),{rootMargin:'0px 0px 80px 0px'});
function finishSkeleton(card){
 const state=skeletonStates.get(card);if(!state||!state.entered||!state.ready)return;
 clearTimeout(state.timer);
 const remaining=reducedMotion.matches?0:Math.max(0,380-(performance.now()-state.started));
 state.timer=setTimeout(()=>{if(!card.isConnected)return;card.classList.remove('is-loading','skeleton-entering');card.setAttribute('aria-busy','false');},remaining);
}
function prepareSkeleton(card){
 const state={ready:!card.querySelector('iframe, [data-gpu-watch]'),entered:false,started:0,timer:0};skeletonStates.set(card,state);
 card.classList.add('is-loading');card.setAttribute('aria-busy','true');
 card.insertAdjacentHTML('beforeend','<div class="panel-skeleton" aria-hidden="true"><div class="skeleton-top"><i></i><i></i></div><div class="skeleton-preview"><span></span><b></b></div><div class="skeleton-bottom"><i></i><i></i><i></i></div></div>');
 skeletonObserver.observe(card);
}
function showFrameSkeleton(frame){
 const card=frame.closest('.work-card'),state=card&&skeletonStates.get(card);if(!state)return;
 clearTimeout(state.timer);state.ready=false;card.classList.add('is-loading');card.setAttribute('aria-busy','true');
}
function frameReady(frame){
 const card=frame.closest('.work-card'),state=card&&skeletonStates.get(card);if(!state)return;
 state.ready=true;finishSkeleton(card);
}
function placeholderReady(host){const card=host.closest('.work-card'),state=card&&skeletonStates.get(card);if(state){state.ready=true;finishSkeleton(card)}}
const sentinel=document.createElement('div');sentinel.className='load-sentinel';sentinel.setAttribute('role','status');sentinel.setAttribute('aria-live','polite');
$('#more-examples').before(sentinel);
let pagingQueued=false;
function queueMore(){
 if(pagingQueued||visibleCount>=matchesToShow.length)return;
 pagingQueued=true;requestAnimationFrame(()=>{pagingQueued=false;if(!sentinel.isConnected||visibleCount>=matchesToShow.length)return;
  if(sentinel.getBoundingClientRect().top<=window.innerHeight+1000){appendCards();queueMore();}
 });
}
const pageObserver=new IntersectionObserver(records=>{if(records.some(r=>r.isIntersecting))queueMore()},{rootMargin:'0px 0px 1000px 0px'});
pageObserver.observe(sentinel);
function tagHTML(e){
 const tags=e.tags||[];if(!tags.length)return '';
 const items=tags.map((tag,i)=>`<button type="button" class="tag-chip${i>=3?' tag-extra':''}" data-tag="${escapeHTML(tag)}"${i>=3?' hidden':''} title="이 태그로 찾기">#${escapeHTML(tag)}</button>`).join('');
 return items+(tags.length>3?`<button type="button" class="tag-more" data-tags-toggle aria-expanded="false" aria-label="${tags.length-3}개 태그 더 보기">+${tags.length-3}</button>`:'');
}
function cardHTML(e,i){return `<article class="work-card" data-example="${escapeHTML(e.id)}"><div class="demo-wrap"><div class="demo-top"><span>${escapeHTML(e.sourceName)}</span><span class="demo-actions"><span>${escapeHTML(e.displayOrigin||(e.remote?'원본 연결 · 온라인':e.networkRequired?'원본 코드 · 온라인 자산':'원본 코드 · 로컬'))}</span><button type="button" data-expand data-title="${escapeHTML(e.name)}" aria-label="${escapeHTML(e.name)} 크게 보기" aria-expanded="false">↗ 크게 보기</button></span></div><div class="demo-content"${needsGPU(e)?` data-gpu-watch="${escapeHTML(e.id)}"`:""}>${needsGPU(e)?gpuPlaceholder(e):frame(e,i<2)}</div><div class="demo-player" role="group" aria-label="예시 재생 조작"><button type="button" data-player-show disabled title="예시를 불러온 뒤 지원 여부를 확인합니다.">▶ <span>Show me</span></button><button type="button" data-player-slow disabled aria-pressed="false" title="예시를 불러온 뒤 지원 여부를 확인합니다.">◷ <span>Slow motion</span></button><button type="button" data-player-reset disabled title="예시를 처음 상태로 되돌립니다.">↺ <span>Reset</span></button><span class="demo-player-status" aria-live="polite">지원 여부 확인 중</span></div></div><div class="work-content"><div class="work-label"><span>${escapeHTML(e.category)}${e.taxonomy?.subcategories?.length?` / ${escapeHTML(e.taxonomy.subcategories[0])}`:''}</span><span>${escapeHTML(e.license||'원문 확인')}</span></div><div class="work-platform">${escapeHTML(platformList(e).length?platformList(e).join(' · '):'기기 구분 미확인')}${e.platformNote?` <span>· ${escapeHTML(e.platformNote)}</span>`:''}</div><div class="work-heading"><div><h3>${escapeHTML(e.name)}</h3><span>${escapeHTML(e.english||'')}</span></div><a class="open-icon" href="${escapeHTML(e.sourceUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(e.name)} 원본 보기">↗</a></div><p>${escapeHTML(e.description)}</p><div class="work-footer"><div class="tags">${tagHTML(e)}</div><div class="work-links">${!e.remote||e.codePath?`<button type="button" data-code="${escapeHTML(e.id)}">\uCF54\uB4DC \uBCF4\uAE30</button>`:''}<a href="${escapeHTML(e.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(e.sourceLabel||'\uC6D0\uBCF8 \uCF54\uB4DC')} \u2197</a>${e.licensePath?`<button type="button" data-license="${escapeHTML(e.id)}">\uB77C\uC774\uC120\uC2A4</button>`:''}</div></div></div></article>`;}
function compactCard(card){
 const info=card.querySelector('.work-content'),label=info.querySelector('.work-label'),platform=info.querySelector('.work-platform');
 const categoryLabel=label.firstElementChild,license=label.lastElementChild,preview=card.querySelector('.demo-content iframe, .demo-content .gpu-placeholder');
 const before=info.getBoundingClientRect().height,previewHeight=preview?.getBoundingClientRect().height||0;
 const note=platform.querySelector('span');if(note)platform.title=note.textContent.replace(/^\s*·\s*/, '');
 const group=document.createElement('div');group.className='work-meta-left';
 categoryLabel.classList.add('work-category');license.classList.add('work-license');
 group.append(platform,document.createTextNode(' - '),categoryLabel);label.prepend(group);
 card.classList.add('compact-card');
 const saved=Math.max(0,before-info.getBoundingClientRect().height);
 card.dataset.previewGrowth=String(saved);
 if(preview&&previewHeight)preview.style.height=`${previewHeight+saved}px`;
}
function appendCards(){
 if(visibleCount>=matchesToShow.length)return;
 const start=visibleCount, end=Math.min(start+PAGE_SIZE,matchesToShow.length);
 $('#cards').insertAdjacentHTML('beforeend',matchesToShow.slice(start,end).map((e,i)=>cardHTML(e,start+i)).join(''));
 document.querySelectorAll('#cards .work-card:not(.compact-card)').forEach(prepareSkeleton);
 document.querySelectorAll('#cards .demo-player:not([data-decorated])').forEach(p=>{
  p.dataset.decorated='true';
  p.querySelector('[data-player-show]').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4l16 6.5-6 1.6-1.5 6.4z"/></svg><span>Show me</span>';
  p.querySelector('[data-player-slow]').innerHTML='<span>Slow motion</span>';
  p.querySelector('[data-player-reset]').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>Reset</span>';
 });
 document.querySelectorAll('#cards .work-card:not(.compact-card)').forEach(compactCard);
 visibleCount=end;
 $('#cards').querySelectorAll('[data-gpu-watch]:not([data-gpu-observed])').forEach(host=>{host.dataset.gpuObserved='true';playerLoading(host.closest('.demo-wrap'),true);gpuObserver.observe(host)});
 const more=$('#more-examples');
 more.hidden=true;
 more.textContent=`\uC608\uC2DC \uB354 \uBCF4\uAE30 \u00B7 ${end} / ${matchesToShow.length}`;
 sentinel.textContent=end<matchesToShow.length?'스크롤하면 다음 예시를 불러옵니다.':'';
}
function render(){
  if(expanded)clearExpanded({focus:false});
  document.querySelectorAll('[data-gpu-watch]').forEach(host=>{gpuObserver.unobserve(host);gpuVisible.delete(host);stopGpu(host,{reset:false})});
  document.querySelectorAll('#cards .work-card').forEach(card=>{skeletonObserver.unobserve(card);const state=skeletonStates.get(card);if(state)clearTimeout(state.timer)});
  const matches=examples.filter(eligible), filtered=matches.filter(e=>matchesCategory(e)&&(subcategory==='전체'||categoryFacets(e,category).includes(subcategory)));
  $('#result-count').textContent=`${filtered.length}개 예시`;
  $('#current-category').textContent=category==='전체'?'모든 예시':subcategory==='전체'?category:`${category} / ${subcategory}`;
  matchesToShow=filtered;visibleCount=0;$('#cards').innerHTML='';
  if(filtered.length){appendCards();queueMore()}else{$('#more-examples').hidden=true;sentinel.textContent='';$('#cards').innerHTML=`<div class="empty"><span>NO EXAMPLES</span><h3>현재 분야에 일치하는 예시가 없습니다.</h3>${category!=='전체'&&matches.length?`<button type="button" data-filter="전체">전체 분야에서 ${matches.length}개 보기 ↗</button>`:'<p>다른 이름이나 태그로 찾아보세요.</p>'}</div>`;}

}
// The preview controls only claim capabilities exposed by the example itself.
function playerFor(frame){return frame.closest('.demo-wrap')?.querySelector('.demo-player');}
function playerLoading(wrap, waiting=false){
 const p=wrap?.querySelector('.demo-player');if(!p)return;
 p.hidden=false;
 p.querySelectorAll('button').forEach(b=>b.disabled=true);
 p.querySelector('[data-player-slow]').setAttribute('aria-pressed','false');
 p.querySelector('.demo-player-status').textContent=waiting?'예시 시작 후 사용할 수 있습니다.':'지원 여부 확인 중';
}
// Preserve the original Handbook controls inside the example instead of showing a duplicate bar.
function setupNativePlayer(frame,doc){
 if(!doc?.body?.matches('[data-hb-kind]'))return false;
 const native=doc.querySelector('.hb-player');if(!native)return false;
 const align=doc.createElement('style');align.textContent='.hb-page .hb-watch > .hb-player{display:flex!important;justify-content:flex-start!important;align-self:flex-start!important;justify-self:start!important;margin-left:0!important;margin-right:auto!important;text-align:left!important;align-items:center!important;flex-wrap:wrap!important}.hb-player>.hb-play,.hb-player>.hb-toggle{justify-content:center}';doc.head.append(align);
 if(!native.querySelector('[data-hb-demo], [data-hb-replay], [data-hb-autoscroll]')){
  const show=doc.createElement('button');show.className='hb-play';show.type='button';show.disabled=true;show.title='이 원본은 자동 시연을 제공하지 않습니다.';
  show.innerHTML='<svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>Show me';
  native.prepend(show);
 }
 if(!native.querySelector('[data-hb-slowmo]')){
  const label=doc.createElement('label');label.className='hb-toggle is-disabled';label.title='이 원본은 느린 재생을 제공하지 않습니다.';
  label.innerHTML='<input class="hb-switch" type="checkbox" role="switch" disabled><span>Slow motion</span>';native.append(label);
 }
 const originalReset=native.querySelector('[data-hb-reset]');if(originalReset)originalReset.style.display='none';
 const reset=doc.createElement('button');reset.type='button';reset.className='hb-play';reset.title='예시를 처음 상태로 되돌립니다.';
 reset.innerHTML='<svg class="hb-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>Reset';
 reset.addEventListener('click',()=>{showFrameSkeleton(frame);playerLoading(frame.closest('.demo-wrap'));resetDemo(frame)});native.append(reset);
 return true;
}
function setupPlayer(frame){
 const p=playerFor(frame);if(!p)return;
 const show=p.querySelector('[data-player-show]'),slow=p.querySelector('[data-player-slow]'),reset=p.querySelector('[data-player-reset]'),status=p.querySelector('.demo-player-status');
 const supported=inspectDemo(frame);
 reset.disabled=!supported.reset;
 let doc;try{doc=frame.contentDocument;}catch(_){doc=null}
 const speed=doc?.querySelector('input[type="checkbox"][data-hb-slowmo]');
 if(setupNativePlayer(frame,doc))p.hidden=true;
 show.disabled=!supported.show;slow.disabled=!supported.slow;
 show.title=show.disabled?'이 원본은 자동 시연을 제공하지 않습니다.':'예시의 자동 시연을 시작합니다.';
 slow.title=slow.disabled?'이 원본은 느린 재생을 제공하지 않습니다.':'예시의 느린 재생을 전환합니다.';
 slow.setAttribute('aria-pressed',String(supported.slowActive));
 if(speed)speed.addEventListener('change',()=>slow.setAttribute('aria-pressed',String(speed.checked)));
 status.textContent=!doc?'외부 원본: 자동 시연·느린 재생 미지원':show.disabled&&slow.disabled?'이 예시는 자동 시연·느린 재생 미지원':show.disabled?'자동 시연 미지원':slow.disabled?'느린 재생 미지원':'';
}
document.addEventListener('load',event=>{if(event.target.matches?.('.demo-content iframe')){
 const host=event.target.closest('[data-gpu-watch]'),entry=host&&gpuActive.get(host);
 if(host&&(!entry||host.querySelector('iframe')!==event.target))return;
 setupPlayer(event.target);frameReady(event.target);
 if(entry&&entry.loading){clearTimeout(entry.timer);entry.loading=false;scheduleGpu()}
}},true);
document.addEventListener('click',async event=>{
 const tagToggle=event.target.closest('[data-tags-toggle]');if(tagToggle){const group=tagToggle.closest('.tags'),expanded=tagToggle.getAttribute('aria-expanded')==='true';group.querySelectorAll('.tag-extra').forEach(tag=>tag.hidden=expanded);tagToggle.setAttribute('aria-expanded',String(!expanded));tagToggle.textContent=expanded?`+${group.querySelectorAll('.tag-extra').length}`:'접기';tagToggle.setAttribute('aria-label',expanded?'태그 더 보기':'추가 태그 접기');return;}
 const tag=event.target.closest('[data-tag]');if(tag){selectedTag=tag.dataset.tag;renderFilters();render();document.querySelector('.library-bar')?.scrollIntoView({block:'start',behavior:'auto'});return;}
 if(event.target.closest('[data-clear-tag]')){selectedTag='';renderFilters();render();return;}
 const sub=event.target.closest('[data-subcategory]');if(sub){subcategory=sub.dataset.subcategory;renderFilters();render();document.querySelector('.library-bar')?.scrollIntoView({block:'start',behavior:'auto'});return;}
 const playerButton=event.target.closest('[data-player-show], [data-player-slow], [data-player-reset]');
 if(playerButton){
  const wrap=playerButton.closest('.demo-wrap'),frame=wrap?.querySelector('.demo-content iframe');if(!frame)return;
  if(playerButton.matches('[data-player-reset]')){showFrameSkeleton(frame);playerLoading(wrap);resetDemo(frame);return;}
  if(playerButton.matches('[data-player-show]'))showDemo(frame);
  if(playerButton.matches('[data-player-slow]')){setDemoSlow(frame,playerButton.getAttribute('aria-pressed')!=='true');playerButton.setAttribute('aria-pressed',String(inspectDemo(frame).slowActive));}
  return;
 }
 const platformButton=event.target.closest('[data-platform]');if(platformButton){platform=platformButton.dataset.platform;renderPlatforms();renderFilters();render();return;}
 const more=event.target.closest('#more-examples');if(more){appendCards();return;}
 const filter=event.target.closest('[data-filter]');if(filter){category=filter.dataset.filter;subcategory='전체';renderFilters();render();document.querySelector('.library-bar')?.scrollIntoView({block:'start',behavior:'auto'});return;}
 const expand=event.target.closest('[data-expand]');if(expand){toggleExpanded(expand.closest('.demo-wrap'));return;}
 const retry=event.target.closest('[data-retry-gpu]');if(retry){const host=retry.closest('[data-gpu-watch]');if(host){delete host.dataset.gpuFailed;setGpuWaiting(host);gpuVisible.add(host);scheduleGpu()}return;}
 const code=event.target.closest('[data-code]');if(code){const e=examples.find(x=>x.id===code.dataset.code);if(!e)return;$('#code-title').textContent=`${e.name} · 코드`;$('#code-description').textContent=(e.adaptation||'원본 코드입니다.')+' 원본은 링크에서 확인할 수 있습니다.';$('#code-source').href=e.sourceUrl;currentFiles=[{label:e.codeLabel||'원본 HTML',path:e.codePath||e.preview},...(Array.isArray(e.codeFiles)?e.codeFiles.filter(f=>f&&f.path&&f.label):[])];if(/^mo\d+$/.test(e.id)&&!e.codeFiles)currentFiles.push({label:'공통 CSS',path:'./examples/asset/demo.css'},{label:'공통 JavaScript',path:'./examples/asset/demo.js'});currentFiles=currentFiles.filter((f,i,a)=>a.findIndex(other=>other.path===f.path)===i);$('#code-dialog').showModal();selectCode(0);return;}
 const file=event.target.closest('[data-file]');if(file){selectCode(Number(file.dataset.file));return;}
 const license=event.target.closest('[data-license]');if(license){const e=examples.find(x=>x.id===license.dataset.license);if(!e)return;$('#code-title').textContent=`${e.sourceName} · ${e.license} 라이선스`;$('#code-description').textContent='원본 저장소에서 함께 제공한 라이선스 고지입니다.';$('#code-source').href=e.sourceUrl;currentFiles=[{label:'라이선스',path:e.licensePath}];$('#code-dialog').showModal();selectCode(0);return;}
 if(event.target.closest('[data-close]')){codeRequest++;$('#code-dialog').close();}
});
$('#search').addEventListener('input',e=>{query=e.target.value;renderFilters();render()});
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'&&!$('#code-dialog').open){event.preventDefault();$('#search').focus();}});
const manifests=['manifest.json','camera-manifest.json','spatial-manifest.json','ui-more.json','hand-all.json','ai-all.json','apg-more.json','bootstrap.json','templates.json','camera-more.json','3d-more.json','motion-more.json','text-more.json','scroll-more.json','vanta-more.json','env-more.json','entry-more.json','animate-more.json','course-labs.json','codscroll.json','ics-scroll.json','scroll-drive.json','transition-manifest.json'];
const taxonomyRequest=fetch('./taxonomy.json?v=20261028-3').then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}).catch(error=>({error}));
const batches=await Promise.all(manifests.map(async name=>{try{const res=await fetch(`./examples/${name}`);if(!res.ok)throw new Error(`HTTP ${res.status}`);const data=await res.json();if(!Array.isArray(data))throw new Error('잘못된 목록 형식');return {name,data};}catch(error){return {name,error};}}));
const taxonomy=await taxonomyRequest;
const failed=batches.filter(x=>x.error);const seen=new Set();examples=[...batches.flatMap(x=>x.data||[]),...motion].filter(e=>{if(!e||!e.id||seen.has(e.id))return false;seen.add(e.id);return true});
examples.forEach(e=>{const detail=taxonomy.items?.[e.id];e.taxonomy=detail||{subcategories:['세부 분류 검토'],related:{},needsReview:true};if(detail?.tags?.length)e.tags=detail.tags;});
if(failed.length){$('#load-note').textContent=`일부 예시 목록을 불러오지 못했습니다: ${failed.map(x=>x.name).join(', ')}`;failed.forEach(x=>console.warn('목록 오류',x.name,x.error));}
if(taxonomy.error){$('#load-note').textContent+=' 세부 분류를 불러오지 못해 기존 태그만 표시합니다.';console.warn('세부 분류 오류',taxonomy.error);}
$('#total').textContent=String(examples.length).padStart(2,'0');renderPlatforms();renderFilters();render();
