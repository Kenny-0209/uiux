import { entries } from './data.js';
import { mountLab } from './labs.js';
import { mountInlineDemo, hasInlineDemo } from './inline-demos.js';
import { mountMotionDemo, hasMotionDemo } from './motion-demos.js';
const $ = (selector, root = document) => root.querySelector(selector);
const html = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeURL = value => { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : '#'; } catch { return '#'; } };
const normalize = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim();
const groups = ['전체','설계이론','화면구성','UI패턴','모션','카메라','3D','실제사례'];
const categoryInfo={
 '설계이론':{label:'설계 이론',english:'DESIGN PRINCIPLES',desc:'사용자가 이해하고 행동하는 방식을 설계합니다.'},
 '화면구성':{label:'화면 구성',english:'LAYOUT & STRUCTURE',desc:'정보와 작업 영역을 배치하고 화면 크기에 맞게 조정합니다.'},
 'UI패턴':{label:'UI 패턴',english:'INTERFACE PATTERNS',desc:'기능을 표현하는 요소와 조합을 살펴봅니다.'},
 '모션':{label:'모션과 상호작용',english:'MOTION & INTERACTION',desc:'상태 변화와 상호작용의 움직임을 조절합니다.'},
 '카메라':{label:'카메라와 장면',english:'CAMERA & TRANSITIONS',desc:'시점과 화각이 장면을 어떻게 바꾸는지 살펴봅니다.'},
 '3D':{label:'3D와 공간',english:'SPATIAL INTERACTION',desc:'공간과 모델을 탐색하는 방법을 살펴봅니다.'},
 '실제사례':{label:'실제 사례',english:'REAL-WORLD REFERENCES',desc:'실제 제품에서 사용된 화면과 동작의 출처입니다.'}
};
const tabs = [['catalog','◈','아카이브'],['labs','◉','인터랙션 실험'],['sources','▤','원천 목록'],['about','ⓘ','이용 안내']];
const icons = {catalog:'layers-2', labs:'flask-conical', sources:'book-open', about:'info'};
const icon = (name, cls='ui-icon') => `<img class="${cls}" src="./icons/${name}.svg" alt="" aria-hidden="true">`;
const labs = [
 {id:'layout',name:'화면 구성 실험',badge:'화면 설계',desc:'좌우·하단 패널, 글자와 정보량을 조절하며 3D 작업 공간의 변화를 확인합니다.'},
 {id:'magnetic',name:'마그네틱 버튼',badge:'UI 모션',desc:'커서가 가까워질 때 버튼이 반응하는 범위와 강도를 조절합니다.'},
 {id:'spring',name:'스프링과 탄성',badge:'모션 기초',desc:'강도와 감쇠를 조절해 흔들림과 정착을 비교합니다.'},
 {id:'camera',name:'카메라와 달리 줌',badge:'카메라',desc:'카메라 이동과 화각 변화의 차이를 개념 모형으로 비교합니다.'},
 {id:'crossfade',name:'크로스 디졸브',badge:'장면 전환',desc:'두 장면이 겹치는 비율과 전환 시간을 직접 조절합니다.'},
 {id:'controls',name:'UI 요소와 상태',badge:'UI 패턴',desc:'아코디언, 모달, 진행 단계와 표의 기본 동작을 직접 체험합니다.'},
 {id:'cursor',name:'커스텀 커서',badge:'UI 모션',desc:'커서를 따라오는 표시의 크기와 움직임을 직접 조절합니다.'}
];
const labEntries={layout:'workspace',magnetic:'magnetic',spring:'spring',camera:'dolly-zoom',crossfade:'crossfade',controls:'accordion',cursor:'cursor'};
let view='catalog', category='전체', query='', sources=[], sourcesError='', disposeLab=null, disposeDetail=null, inlineDisposers=[];
function clearInlineDemos(){for(const dispose of inlineDisposers){try{dispose?.();}catch(error){console.warn(error)}}inlineDisposers=[];}
function mountCardDemos(root=document){root.querySelectorAll('[data-inline-entry]').forEach(host=>{const entry=entries.find(e=>e.id===host.dataset.inlineEntry);if(!entry)return;try{const dispose=hasMotionDemo(entry)?mountMotionDemo(host,entry):mountInlineDemo(host,entry);if(typeof dispose==='function')inlineDisposers.push(dispose);}catch(error){console.error('Inline demo failed:',entry.id,error);host.innerHTML='<div class="inline-fallback">미리보기를 불러오지 못했습니다.</div>';}});}
function nav(mobile=false) {return tabs.map(([id,_symbol,name]) => `<button type="button" data-view="${id}" class="${view===id?'active':''}" ${view===id?'aria-current="page"':''}>${icon(icons[id])}<span>${name}</span></button>`).join('');}
function shell(){
 const active = tabs.find(tab => tab[0]===view);
 $('#app').innerHTML=`<div class="shell"><aside class="side"><a class="brand" href="#catalog"><span class="brandmark">m<span>.</span></span><span>모음<small>DESIGN LIBRARY</small></span></a><div class="side-label">LIBRARY</div><nav class="nav" aria-label="주 메뉴">${nav()}</nav><a class="back-gallery" href="./index.html#main">← 예시 목록으로</a><div class="side-divider"></div><div class="side-label">COLLECTION</div><div class="side-index"><button data-category-jump="설계이론">설계 원칙</button><button data-category-jump="화면구성">화면 구성</button><button data-category-jump="UI패턴">UI 패턴</button><button data-category-jump="모션">모션</button><button data-category-jump="카메라">카메라</button></div><div class="side-footer"><span class="status-dot"></span> 개인 아카이브 <small>DESIGN IN MOTION · 01</small></div></aside><div class="main"><header class="top"><div class="mobile-brand"><span class="brandmark">m<span>.</span></span><span>모음</span></div><div class="crumb">Library <span aria-hidden="true">/</span> <strong>${html(active[2])}</strong></div><div class="top-right"><span class="top-label">UX · INTERACTION · MOTION</span><span class="top-divider"></span><span class="status-dot"></span><span>LOCAL EDITION</span></div></header><main id="main" class="content" tabindex="-1"></main></div></div><nav class="mobile-nav" aria-label="모바일 메뉴">${nav(true)}<a class="back-gallery" href="./index.html#main"><span aria-hidden="true">←</span>예시 목록</a></nav><dialog id="detail" class="detail" aria-label="항목 상세"></dialog>`;
}
function heading(en,title,description,count=''){return `<div class="page-heading"><div><div class="eyebrow">${html(en)}</div><h1>${html(title)}</h1><p>${html(description)}</p></div>${count?`<div class="heading-count">${html(count)}</div>`:''}</div>`;}
function setView(next){
 if(!tabs.some(tab=>tab[0]===next)) return;
 if(disposeLab){disposeLab();disposeLab=null;}
 view=next; history.replaceState(null,'','#'+next); render(); window.scrollTo({top:0,behavior:'auto'});
}
function preview(entry){
 const individual=['hierarchy','density','disclosure','grouping','userflow','accessibility','sidebar','split','grid','viewer','responsive'];
 const t=individual.includes(entry.id)?entry.id:(entry.lab || (entry.category==='카메라'?'camera':entry.category==='모션'?'spring':entry.category==='실제사례'?'reference':'layout'));
 const visuals={
  hierarchy:'<div class="art-hierarchy"><div class="art-line-lg"></div><div class="art-line-md"></div><div class="art-line-sm"></div><div class="art-hierarchy-rule"></div><div class="art-line-sm faint"></div><div class="art-line-sm faint"></div></div>',
  density:'<div class="art-density"><div class="density-low"><span></span><span></span><span></span></div><div class="density-high"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div><small>SPARSE</small><small>DENSE</small></div>',
  disclosure:'<div class="art-disclosure"><div><i></i><span></span><b>−</b></div><section><i></i><i></i><i></i></section><div><i></i><span></span><b>＋</b></div></div>',
  grouping:'<div class="art-grouping"><div><i></i><i></i><i></i></div><div><i></i><i></i><i></i></div></div>',
  userflow:'<div class="art-flow"><span>START</span><i></i><b>01</b><i></i><b>02</b><i></i><b>03</b><i></i><span>END</span></div>',
  accessibility:'<div class="art-access"><span>Aa</span><div><b></b><b></b><b></b><i></i></div></div>',
  sidebar:'<div class="art-side"><div><i></i><b></b><b></b><b></b><b></b></div><section><span></span><span></span><span></span></section></div>',
  split:'<div class="art-split"><div><i></i><i></i><i></i><i></i></div><section><b></b><span></span><span></span></section></div>',
  grid:'<div class="art-grid"><i></i><i></i><i></i><i></i><i></i><i></i></div>',
  viewer:'<div class="art-camera"><div class="camera-grid"></div><div class="camera-square one"></div><div class="camera-square two"></div><div class="camera-subject"></div><small>MODEL / VIEW</small></div>',
  responsive:'<div class="art-responsive"><div class="art-desktop"><span></span><span></span><span></span></div><div class="art-phone"><span></span><span></span><span></span></div></div>',
  layout:'<div class="art-window"><i></i><div class="art-window-body"><b></b><section><em></em><em></em><em></em><em></em></section><b></b></div></div>',
  controls:'<div class="art-controls"><div><i></i><span></span><b>＋</b></div><div><i></i><span></span><b>−</b></div><div><i></i><span></span><b>＋</b></div></div>',
  magnetic:'<div class="art-orbit"><div class="orbit-ring"></div><div class="art-magnetic">MOVE WITH ME <span>↗</span></div><div class="art-pointer">↖</div></div>',
  cursor:'<div class="art-cursor"><i></i><i></i><i></i><span>↖</span><small>MOVE THE CURSOR</small></div>',
  spring:'<div class="art-curve"><svg viewBox="0 0 250 100" fill="none" aria-hidden="true"><path d="M0 50H250M0 20H250M0 80H250" stroke="currentColor" opacity=".11"/><path d="M0 79 C28 79 23 10 52 20 S78 78 104 51 S130 34 153 50 S184 45 205 49 L250 49" stroke="currentColor" stroke-width="2.5"/><circle cx="104" cy="51" r="5" fill="currentColor"/></svg><small>SPRING / MOTION</small></div>',
  camera:'<div class="art-camera"><div class="camera-grid"></div><div class="camera-square one"></div><div class="camera-square two"></div><div class="camera-subject"></div><small>CAMERA / VIEW</small></div>',
  crossfade:'<div class="art-crossfade"><div class="fade-shape a"></div><div class="fade-shape b"></div><span>01 <i>→</i> 02</span></div>',
  reference:'<div class="art-reference"><div><i></i><i></i><i></i></div><section><b></b><b></b><b></b><b></b></section></div>'
 };
 return `<div class="preview preview-${html(t)}" aria-hidden="true"><span class="preview-label">${entry.lab?'INTERACTIVE STUDY':'REFERENCE'}</span>${visuals[t]||visuals.layout}</div>`;
}
function card(entry){
 const canInteract=hasInlineDemo(entry)||hasMotionDemo(entry);
 const number=String(entries.findIndex(x=>x.id===entry.id)+1).padStart(2,'0');
 const type=entry.lab||(entry.id==='orbit'?'camera':'controls');
 const surface=canInteract?`<div class="preview preview-${html(type)} live-preview" data-inline-entry="${html(entry.id)}" aria-label="${html(entry.name)} 직접 체험"></div>`:`<div class="reference-surface"><span>REAL-WORLD REFERENCE</span><strong>↗</strong><p>직접 조작하는 실험이 아닌<br>외부 실제 사례입니다.</p><a href="${html(safeURL(entry.sourceUrl))}" target="_blank" rel="noopener noreferrer">${html(entry.sourceName)}에서 보기 ↗</a></div>`;
 return `<article class="card encyclopedia-card category-${groups.indexOf(entry.category)}"><div class="entry-header"><div class="entry-heading"><span class="entry-number">${number} <span>·</span> ${html(entry.english)}</span><h3>${html(entry.name)}</h3></div><button type="button" class="entry-more" data-entry="${html(entry.id)}" aria-label="${html(entry.name)} 설명과 출처 보기">자세히 <span aria-hidden="true">↗</span></button></div><p class="entry-description">${html(entry.description)}</p>${surface}<div class="entry-footer"><div class="entry-tags">${(entry.tags||[]).slice(0,3).map(tag=>`<span>#${html(tag)}</span>`).join('')}</div><span class="entry-activity">${canInteract?'직접 체험':'외부 사례'} <i></i></span></div></article>`;
}
function drawCards(){
 const q=normalize(query); const found=entries.filter(e=>(category==='전체'||e.category===category)&&(!q||[e.name,e.english,...(e.tags||[])].some(x=>normalize(x).includes(q))));
 clearInlineDemos(); $('#resultMeta').textContent=`${found.length}개 항목 · 이름과 태그로 검색`;
 const categories=groups.slice(1).map((id,index)=>({id,index,items:found.filter(entry=>entry.category===id)})).filter(group=>group.items.length);
 $('#cards').innerHTML=categories.length?categories.map(group=>{const info=categoryInfo[group.id];return `<section class="category-section" aria-labelledby="cat-${group.index}"><header class="category-heading"><div class="category-number">${String(group.index+1).padStart(2,'0')}</div><div class="category-heading-text"><span>${html(info.english)}</span><h2 id="cat-${group.index}">${html(info.label)}</h2><p>${html(info.desc)}</p></div><div class="category-count">${group.items.length}<span>개 항목</span></div></header><div class="category-entries">${group.items.map(card).join('')}</div></section>`;}).join(''):'<div class="empty">검색 결과가 없습니다. 다른 이름이나 태그를 입력해 주세요.</div>';
 mountCardDemos($('#cards'));
}
function catalog(){
 $('#main').innerHTML=heading('DESIGN KNOWLEDGE LIBRARY','화면을 깊이 이해하는 곳','설계의 이유부터 작은 움직임까지, 직접 체험하고 비교해 보세요.',`${entries.length}개 항목`)+`<section class="hero"><div class="hero-copy"><div class="eyebrow">A SPACE TO EXPLORE</div><h2>좋은 화면은<br>좋은 질문에서 시작합니다.</h2><p>사용자의 목적을 이해하고 정보를 정리하며, 적절한 움직임을 찾아보세요. 설계 지식과 실험, 참고 원천을 연결합니다.</p><div class="hero-actions"><button type="button" class="btn btn-primary" data-view="labs">실험 둘러보기 →</button><button type="button" class="btn btn-light" data-view="sources">원천 보기</button></div></div><div class="hero-art" aria-hidden="true"><div class="hero-art-box"><span>연결된 설계 지식</span><strong>${String(entries.length).padStart(2,'0')} <span style="display:inline;font-size:12px;font-weight:500">ITEMS</span></strong><div class="hero-art-line"></div></div></div></section><div class="section-title"><div><div class="eyebrow">START EXPLORING</div><h2>세 가지 관점으로 살펴보기</h2></div></div><section class="overview-grid" aria-label="분야 소개"><div class="overview-card"><div class="iconbox">▦</div><h3>화면과 정보</h3><p>무엇을 보여주고 어떤 순서로 이해하게 할까요?</p></div><div class="overview-card"><div class="iconbox">◉</div><h3>상호작용과 모션</h3><p>행동에 반응하는 다양한 움직임을 실험합니다.</p></div><div class="overview-card"><div class="iconbox">↗</div><h3>실제 사례와 원천</h3><p>설계의 근거와 참고 자료를 함께 확인합니다.</p></div></section><div class="section-title"><div><div class="eyebrow">THE ARCHIVE</div><h2>설계 지식 탐색</h2></div><p>이름과 태그로 찾아보세요.</p></div><div class="toolbar"><label class="search-wrap"><span class="sr-only">이름 또는 태그 검색</span><input id="search" class="search" type="search" placeholder="이름 또는 태그 검색 · 예: 패널, 스프링" value="${html(query)}" autocomplete="off"></label></div><div class="filters" role="group" aria-label="분야 필터">${groups.map(g=>`<button type="button" class="chip ${category===g?'active':''}" data-category="${html(g)}" aria-pressed="${category===g}">${html(g)}</button>`).join('')}</div><p id="resultMeta" class="result-meta" aria-live="polite"></p><div id="cards" class="cards"></div><p class="footnote">이 아카이브는 확인한 원천을 바탕으로 구성한 초기 항목입니다. 원천의 모든 자료를 수집한 것은 아닙니다.</p>`;
 $('#search').addEventListener('input',event=>{query=event.target.value;drawCards();}); drawCards();
}
function catalogGallery(){
 $('#main').innerHTML=`<section class="gallery-section"><header class="collection-title"><div><span class="collection-kicker">THE INTERACTIVE DESIGN LIBRARY <i>✳</i></span><h1>만져보며 이해하는 디자인</h1><p>화면을 구성하는 생각부터 작은 움직임까지, 직접 해보고 비교하세요.</p></div><div class="collection-index"><strong>${String(entries.length).padStart(2,'0')}</strong><span>개의 개념과 사례<br>계속 확장하는 아카이브</span></div></header><div class="gallery-tools"><div class="section-kicker">분야별로 둘러보기 <span>↓</span></div><label class="search-wrap"><span class="sr-only">이름 또는 태그 검색</span>${icon('search','search-icon')}<input id="search" class="search" type="search" placeholder="이름 또는 태그 검색" value="${html(query)}" autocomplete="off"><kbd>⌘ K</kbd></label></div><div class="filter-bar"><div class="filters" role="group" aria-label="분야 필터">${groups.map(g=>`<button type="button" class="chip ${category===g?'active':''}" data-category="${html(g)}" aria-pressed="${category===g}">${html(g==='전체'?g:categoryInfo[g].label)}</button>`).join('')}</div></div><div class="gallery-meta"><p id="resultMeta" class="result-meta" aria-live="polite"></p><span>LOOK · PLAY · LEARN <b>✳</b></span></div><div id="cards" class="archive-sections"></div><p class="footnote">각 실험은 개념을 이해하기 위한 예시입니다. 실제 사례는 원문 링크에서 확인할 수 있습니다.</p></section>`;
 $('#search').addEventListener('input',event=>{query=event.target.value;drawCards();}); drawCards();
}
function openDetail(entry){
 const d=$('#detail'); const related=(entry.related||[]).map(id=>entries.find(e=>e.id===id)).filter(Boolean);
 d.innerHTML=`<div class="detail-inner"><div class="detail-head"><div><span class="badge">${html(entry.category)}</span><h2>${html(entry.name)}</h2><p class="en">${html(entry.english)}</p></div><button type="button" class="close" data-close-detail aria-label="닫기">×</button></div><p class="detail-description">${html(entry.description)}</p><div class="tags">${(entry.tags||[]).map(tag=>`<span class="tag"># ${html(tag)}</span>`).join('')}</div><div class="detail-grid"><div class="detail-block"><strong>이럴 때 살펴보세요</strong><p>${html(entry.when)}</p></div><div class="detail-block"><strong>함께 생각할 점</strong><p>${html(entry.caution)}</p></div><div class="detail-block"><strong>적용 환경</strong><p>${html(entry.platform)}</p></div><div class="detail-block"><strong>원천 형식</strong><p>${html(entry.kind)} · 독립적으로 작성한 요약</p></div></div><div class="detail-links"><a href="${html(safeURL(entry.sourceUrl))}" target="_blank" rel="noopener noreferrer">${html(entry.sourceName)} 원문 보기 ↗</a>${entry.lab?`<button type="button" class="btn btn-primary" data-lab="${html(entry.lab)}">관련 실험 열기 →</button>`:''}</div>${related.length?`<p class="result-meta" style="margin-top:22px">관련 항목</p><div class="tags">${related.map(x=>`<button type="button" class="chip" data-related="${html(x.id)}">${html(x.name)}</button>`).join('')}</div>`:''}</div>`;
 d.showModal();
}
function openDetailGallery(entry){
 const d=$('#detail'); const related=(entry.related||[]).map(id=>entries.find(e=>e.id===id)).filter(Boolean);
 const interactive=hasInlineDemo(entry);
 d.innerHTML=`<div class="detail-inner"><div class="detail-head"><div><span class="detail-overline">${html(entry.category)} <span> / </span> ${html(entry.kind)}</span><h2>${html(entry.name)}</h2><p class="en">${html(entry.english)}</p></div><button type="button" class="close" data-close-detail aria-label="닫기">×</button></div><div class="detail-columns"><div class="detail-stage"><div class="detail-stage-header"><span>PREVIEW</span><span>${interactive?'INTERACTIVE':'ILLUSTRATION'}</span></div>${interactive?'<div id="detail-live" class="detail-live"></div>':`<div id="detail-art">${preview(entry)}</div><p class="detail-note">화면은 항목을 설명하기 위한 도식입니다. 원본 자료는 아래 링크에서 확인할 수 있습니다.</p>`}</div><div class="detail-info"><p class="detail-description">${html(entry.description)}</p><div class="detail-section"><strong>이럴 때 살펴보세요</strong><p>${html(entry.when)}</p></div><div class="detail-section"><strong>함께 생각할 점</strong><p>${html(entry.caution)}</p></div><div class="detail-section"><strong>적용 환경</strong><p>${html(entry.platform)}</p></div><div class="tags">${(entry.tags||[]).map(tag=>`<span class="tag"># ${html(tag)}</span>`).join('')}</div><div class="detail-links"><a href="${html(safeURL(entry.sourceUrl))}" target="_blank" rel="noopener noreferrer">${html(entry.sourceName)} 원문 보기 ↗</a></div>${related.length?`<p class="result-meta" style="margin-top:24px">관련 항목</p><div class="tags related">${related.map(x=>`<button type="button" class="chip" data-related="${html(x.id)}">${html(x.name)}</button>`).join('')}</div>`:''}</div></div></div>`;
 d.addEventListener('close',()=>{if(disposeDetail){disposeDetail();disposeDetail=null;}},{once:true});
 d.showModal();
 if(interactive){try{disposeDetail=hasMotionDemo(entry)?mountMotionDemo($('#detail-live'),entry):mountInlineDemo($('#detail-live'),entry);}catch(error){$('#detail-live').textContent='실험을 불러오지 못했습니다: '+error.message;console.error(error);}}
}
function labsView(){
 $('#main').innerHTML=heading('INTERACTION LAB','움직여 보면 더 잘 보입니다.','화면 구성부터 모션까지, 각 패널에서 직접 조작해 보세요.',`${labs.length}개 실험`)+`<div class="lab-intro">${icon('sparkles')} <span>패널에서 바로 조작하고, 필요하면 상세 설정을 열어 보세요</span><span>01 — 07</span></div><section id="lab-area" hidden><div class="section-title" style="margin-top:30px"><h2 id="lab-title"></h2><button type="button" class="chip" data-close-lab>닫기</button></div><div id="lab-host" class="lab-host"></div></section><div class="lab-list-header"><span>ALL EXPERIMENTS</span><span>${labs.length} STUDIES</span></div><div class="experiment-list">${labs.map(x=>`<article class="experiment" data-experiment="${x.id}"><div class="preview preview-${x.id} live-preview" data-inline-entry="${labEntries[x.id]}" aria-label="${x.name} 미리보기"></div><div class="experiment-content"><span class="card-category">${x.badge}</span><h3>${x.name}</h3><p>${x.desc}</p><button type="button" class="btn" data-open-lab="${x.id}">상세 설정 ↗</button></div></article>`).join('')}</div><p class="footnote">실험은 자체 제작한 개념 모형입니다. 카메라 예시는 실제 촬영이나 3D 렌더링을 재현하지 않습니다.</p>`;
 mountCardDemos($('.experiment-list'));
}
function openLab(id){
 if(!labs.some(x=>x.id===id)) return;
 if(view!=='labs')setView('labs'); if(disposeLab)disposeLab();
 $('#lab-area').hidden=false; $('#lab-title').textContent=labs.find(x=>x.id===id).name;
 document.querySelectorAll('[data-experiment]').forEach(el=>el.classList.toggle('selected',el.dataset.experiment===id));
 try{disposeLab=mountLab($('#lab-host'),id);}catch(e){$('#lab-host').textContent='실험을 불러오지 못했습니다: '+e.message;console.error(e);}
 $('#lab-area').scrollIntoView({block:'start',behavior:'auto'});
}
function sourcesView(){
 $('#main').innerHTML=heading('SOURCE DIRECTORY','원천 목록','설계 이론, 실제 사례와 구현 자료를 조사하기 위한 출발점입니다.',`${sources.length}개 링크`)+`<div class="notice">이 목록에는 수집 후보가 포함되어 있습니다. 각 자료의 접근·보존·재게시 조건은 다르며 모든 원천의 조건을 검증한 목록은 아닙니다. 직접 정리한 항목은 아카이브에서 확인하세요.</div>${sourcesError?`<div class="notice">${html(sourcesError)}</div>`:''}<div class="toolbar"><label class="search-wrap"><span class="sr-only">원천 이름 또는 분야 검색</span><input id="source-search" class="search" type="search" placeholder="원천 이름 또는 분야 검색"></label></div><p class="result-meta" id="source-count" aria-live="polite"></p><div id="source-list" class="sources-list"></div>`;
 const draw=()=>{const q=normalize($('#source-search').value);const found=sources.filter(s=>!q||normalize(`${s.name} ${s.section}`).includes(q));$('#source-count').textContent=`${found.length}개 원천`;$('#source-list').innerHTML=found.length?found.map(s=>`<a class="source" href="${html(safeURL(s.url))}" target="_blank" rel="noopener noreferrer"><span>${html(s.section)}</span><br><strong>${html(s.name)} ↗</strong><p>${html(s.url)}</p></a>`).join(''):'<div class="empty">일치하는 원천이 없습니다.</div>';};$('#source-search').addEventListener('input',draw);draw();
}
function about(){
 $('#main').innerHTML=heading('HOW TO USE','이용 안내','아카이브를 활용하는 방법과 자료의 범위입니다.')+`<div class="overview-grid"><div class="overview-card"><div class="iconbox">1</div><h3>이름과 태그로 찾기</h3><p>기법의 이름이나 정확한 태그로 관련 항목을 찾습니다.</p></div><div class="overview-card"><div class="iconbox">2</div><h3>직접 실험하기</h3><p>실험실에서 패널, 움직임, 카메라 설정을 조절합니다.</p></div><div class="overview-card"><div class="iconbox">3</div><h3>근거와 원문 확인</h3><p>상세 화면의 출처 링크를 통해 원래 자료를 확인합니다.</p></div></div><div class="notice"><strong>자료의 범위</strong><br>화면 설계와 주요 모션을 탐색하는 초기 아카이브입니다. 모든 기법과 실제 제품 사례를 수록한 완성판은 아닙니다. 원천 목록은 조사 후보를 포함하며 모든 자료를 수집·재게시한 것은 아닙니다.</div><div class="detail-block"><strong>설계의 연결</strong><p>사용자 목적 → 정보 우선순위 → 화면 구성과 기능 → 인터랙션과 모션 → 실제 사용 확인. 결정은 사용자의 환경과 작업에 따라 달라집니다.</p></div><div class="detail-block" style="margin-top:10px"><strong>Codex에서 참고</strong><p>data.js와 sources.json에 항목명, 분류, 설명, 태그, 원문 주소가 들어 있습니다. 원천의 실제 사용 조건은 각각 확인해야 합니다.</p></div>`;
}
function render(){clearInlineDemos();shell();if(view==='catalog')catalogGallery();else if(view==='labs')labsView();else if(view==='sources')sourcesView();else about();}
document.addEventListener('click',event=>{
 const target=event.target.closest('button,a'); if(!target)return;
 if(target.matches('[data-view]'))setView(target.dataset.view);
 else if(target.matches('[data-category-jump]')){category=target.dataset.categoryJump;query='';if(view!=='catalog')setView('catalog');else render();document.querySelector('.gallery-section')?.scrollIntoView({block:'start',behavior:'auto'});}
 else if(target.matches('[data-category]')){category=target.dataset.category;document.querySelectorAll('[data-category]').forEach(el=>{el.classList.toggle('active',el===target);el.setAttribute('aria-pressed',String(el===target));});drawCards();}
 else if(target.matches('[data-entry]')){const entry=entries.find(x=>x.id===target.dataset.entry);if(entry)openDetailGallery(entry);}
 else if(target.matches('[data-close-detail]'))$('#detail').close();
 else if(target.matches('[data-related]')){const entry=entries.find(x=>x.id===target.dataset.related);if(entry){$('#detail').close();openDetailGallery(entry);}}
 else if(target.matches('[data-lab]')){const id=target.dataset.lab;$('#detail').close();openLab(id);}
 else if(target.matches('[data-open-lab]'))openLab(target.dataset.openLab);
 else if(target.matches('[data-close-lab]')){if(disposeLab)disposeLab();disposeLab=null;$('#lab-area').hidden=true;document.querySelectorAll('[data-experiment]').forEach(el=>el.classList.remove('selected'));}
});
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'&&view==='catalog'&&!$('#detail').open){event.preventDefault();$('#search')?.focus();}});
window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);if(tabs.some(t=>t[0]===next)&&next!==view){if(disposeLab)disposeLab();disposeLab=null;view=next;render();}});
async function init(){
 try{const response=await fetch('./sources.json');if(!response.ok)throw new Error(`HTTP ${response.status}`);const value=await response.json();if(!Array.isArray(value))throw new Error('잘못된 목록 형식');sources=value;}catch(e){sourcesError='원천 목록을 불러오지 못했습니다. 로컬 서버에서 열었는지 확인해 주세요.';console.warn(e);}
 const hash=location.hash.slice(1);if(tabs.some(t=>t[0]===hash))view=hash;render();
}
init();
