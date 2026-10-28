import {inspectDemo,showDemo,setDemoSlow,resetDemo} from './demo-adapter.js?v=20261028-controls';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=v=>String(v??'').normalize('NFKC').toLocaleLowerCase().trim();
const safeURL=v=>{try{const u=new URL(v,location.href);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}};
function sourceLink(source){const url=safeURL(source?.url);return url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(source.name)} ↗</a>`:'';}
// Editorial reading prompts; not claims about the source authors' research or results.
const caseContext={grouping:'결제 정보와 주문 내역을 한 화면에서 확인해야 할 때',navigation:'메뉴가 많아 현재 위치를 놓치기 쉬울 때',search:'대화가 많아 원하는 항목을 찾아야 할 때',disclosure:'세부 내용을 한꺼번에 펼치면 화면이 길어질 때',workspace:'탐색과 데이터 작업에 같은 화면 공간이 필요할 때','visual-hierarchy':'무엇을 먼저 보고 어떤 행동을 할지 안내해야 할 때',density:'표와 차트가 많아 중요한 정보를 찾기 어려울 때',grid:'화면 폭이 바뀌어도 내용의 배열을 유지해야 할 때',responsive:'같은 목록을 서로 다른 화면 폭에서 보여줄 때','master-detail':'목록을 보면서 선택한 내용을 함께 확인해야 할 때',sidebar:'보조 메뉴와 본문이 같은 공간을 나눠 써야 할 때','layout-patterns':'제목과 주요 행동을 첫 화면에서 전달해야 할 때',typography:'제목과 본문, 보조 정보의 읽는 순서를 구분해야 할 때',buttons:'사용자가 누른 행동을 알아차릴 수 있어야 할 때',selection:'설정이 켜져 있는지 꺼져 있는지 알려줘야 할 때',tabs:'관련 내용을 한 공간에서 나누어 보여줘야 할 때',menus:'여러 선택지 중 현재 값을 바꿔야 할 때',accordion:'상세 설명이 많아 한 화면에 모두 넣기 어려울 때',modal:'현재 작업 중 별도의 확인이 필요할 때',drawer:'기존 화면을 유지하며 보조 내용을 열어야 할 때',toast:'작업 결과를 짧게 알려줘야 할 때',loading:'콘텐츠를 기다리는 동안 화면의 상태를 알려줘야 할 때',step:'여러 단계 중 현재 위치를 알려줘야 할 때',table:'행과 열의 값을 비교하고 정렬해야 할 때',tooltip:'화면을 복잡하게 하지 않고 추가 설명이 필요할 때',crossfade:'두 장면 사이의 변화를 부드럽게 이어야 할 때',scroll:'스크롤과 콘텐츠의 움직임을 연결해 보여줄 때','snap-stagger':'스크롤을 일정한 구간에 맞춰 멈추게 할 때','slide-mask':'새 화면이 들어오는 방향으로 변화를 설명할 때','pan-tilt':'카메라의 위치 이동과 시선 회전을 구분해야 할 때',dolly:'카메라 이동과 줌의 원근 차이를 비교할 때','dolly-zoom':'피사체의 크기와 배경의 원근을 함께 살펴볼 때'};
const caseAdvice={grouping:'관련 입력은 묶고, 결제할 내역은 별도 영역에서 확인할 수 있게 하세요.',navigation:'현재 위치가 보이는지, 메뉴 이름만으로 목적지를 알 수 있는지 확인하세요.',disclosure:'자주 필요한 내용은 쉽게 찾게 하고, 접힌 항목의 제목을 명확하게 써 보세요.',workspace:'메뉴를 접어 넓어진 작업 영역과, 숨긴 메뉴를 다시 찾는 비용을 함께 비교하세요.',sidebar:'자주 쓰는 기능을 계속 보여줄지, 필요할 때만 열지 실제 작업 흐름에 맞춰 결정하세요.',density:'정보를 줄이기 전에 함께 비교해야 할 항목이 무엇인지 먼저 확인하세요.',responsive:'화면 폭을 바꾸며 열 수와 읽는 순서가 자연스럽게 바뀌는지 확인하세요.',table:'정렬 기준과 정렬 방향이 보이는지, 키보드로도 조작할 수 있는지 확인하세요.',tooltip:'중요한 정보가 호버에서만 보이지 않도록 터치와 키보드 사용도 확인하세요.',loading:'기다리는 상태를 보여 주되, 실제 콘텐츠가 준비됐는지는 별도로 알려주세요.',error:'흔들림만으로 끝내지 말고 무엇이 잘못됐고 어떻게 고칠 수 있는지 알려주세요.',crossfade:'부드러움뿐 아니라 전환 전후의 내용과 현재 위치를 이해할 수 있는지도 확인하세요.'};
function conceptHTML(item,chapterNo,itemNo,sources,liveExamples){
 const index=`${String(chapterNo).padStart(2,'0')}.${String(itemNo).padStart(2,'0')}`;
 const searchable=[item.title,item.english,item.kind,item.meaning,item.application,item.caution,item.aliases,item.relations,...item.refs.map(r=>sources[r]?.name||'')].join(' ');
 const refs=item.refs.map(key=>sourceLink(sources[key])).join('');
 const relation=item.relations?`<div class="relation"><b>개념 관계</b> · ${esc(item.relations)}</div>`:'';
 const aliases=item.aliases?`<p class="aliases">다른 이름 · ${esc(item.aliases)}</p>`:'';
 const example=item.example?`<a class="example-link" href="./index.html?q=${encodeURIComponent(item.example)}#main">관련 예시 더 보기 ↗</a>`:'';
 const live=liveExamples[item.id];
 const panel=live?`<div class="theory-example" data-preview="${esc(live.preview)}" data-name="${esc(live.name)}"><div class="theory-example-head"><div><span>원본 사례</span><strong>${esc(live.name)}</strong></div><a href="${esc(safeURL(live.sourceUrl))}" target="_blank" rel="noopener noreferrer">${esc(live.sourceName)} · 원본 ↗</a></div><div class="theory-example-stage" aria-busy="true"><div class="theory-skeleton" aria-hidden="true"></div></div><div class="theory-player"><button type="button" data-show disabled>▶ Show me</button><button type="button" data-slow disabled aria-pressed="false">◷ Slow motion</button><button type="button" data-reset disabled>↺ Reset</button><span>직접 살펴보는 원본 예시</span></div></div><p class="case-observation"><b>화면에서 확인</b> ${esc(live.note)}</p>`:`<div class="missing-example">직접 확인할 사례를 찾는 중입니다. ${example}</div>`;
 const situation=caseContext[item.id]?`<p class="case-situation"><b>이럴 때</b> ${esc(caseContext[item.id])}</p>`:'';
 return `<article class="concept" id="${esc(item.id)}" data-search="${esc(normalize(searchable))}"><div class="concept-no">${index}</div><div class="concept-body"><div class="concept-title"><h3>${esc(item.title)}</h3><span class="english">${esc(item.english)}</span><span class="kind">${esc(item.kind)}</span></div>${situation}${panel}<div class="case-apply"><b>설계할 때</b><span>${esc(caseAdvice[item.id]||item.application)}</span></div><details class="concept-detail"><summary>개념과 주의할 점 · 출처</summary><p class="definition">${esc(item.meaning)}</p><div class="decision"><h4>함께 살필 점</h4><p>${esc(item.caution)}</p></div>${aliases}${relation}<div class="refs" aria-label="참고 근거">${refs}</div></details>${live&&example?`<div class="concept-footer">${example}</div>`:''}</div></article>`;
}
function render(data,catalog,course,liveExamples){
 const all=data.sections.flatMap(s=>s.items),names=new Map(all.map(x=>[x.id,x.title]));
 $('#toc').innerHTML=data.sections.map((section,i)=>`<a class="toc-link" href="#section-${esc(section.id)}"><span>${esc(section.title)}</span><small>${String(i+1).padStart(2,'0')}</small></a>`).join('')+'<a class="toc-link" href="#relations"><span>중복과 개념 관계</span><small>↗</small></a><a class="toc-link" href="#inventory"><span>기존 자료 대응</span><small>↗</small></a>';
 $('#chapters').innerHTML=data.sections.map((section,i)=>`<section class="chapter" id="section-${esc(section.id)}" data-section-search="${esc(normalize(section.title+' '+section.question+' '+section.intro))}"><div class="chapter-head"><span class="chapter-num">${String(i+1).padStart(2,'0')}</span><div><h2>${esc(section.title)}</h2><p class="question">${esc(section.question)}</p><p class="description">${esc(section.intro)}</p></div></div>${section.items.map((item,n)=>conceptHTML(item,i+1,n+1,data.sources,liveExamples)).join('')}</section>`).join('');
 $('#relations-list').innerHTML=data.duplicates.map(r=>`<div class="relation-row"><a href="#${esc(r.target)}">${esc(r.terms)} ↗</a><b>${esc(r.relationship)}</b><span>${esc(r.note)}</span></div>`).join('');
 $('#inventory-list').innerHTML=catalog.map(item=>{const id=data.catalogMap[item.id];return `<div class="inventory-row"><span>${esc(item.name)}</span><a href="#${esc(id)}">${esc(names.get(id)||'관련 지식')} ↗</a>${sourceLink({name:'기존 출처',url:item.sourceUrl})}</div>`}).join('');
 $('#course-map').innerHTML=course.episodes.filter(e=>!e.members).map(item=>{const id=data.courseMap[String(item.index)];return `<div class="inventory-row"><span>${String(item.index).padStart(2,'0')} · ${esc(item.title)}</span><a href="#${esc(id)}">${esc(names.get(id)||'관련 지식')} ↗</a>${sourceLink({name:'강의 원본',url:item.url})}</div>`}).join('');
 const search=$('#theory-search');
 function filter(){
  const terms=normalize(search.value).split(/\s+/).filter(Boolean);let count=0;
  for(const section of document.querySelectorAll('.chapter')){
   const sectionMatch=terms.length&&terms.every(t=>section.dataset.sectionSearch.includes(t));let shown=0;
   for(const article of section.querySelectorAll('.concept')){const show=!terms.length||sectionMatch||terms.every(t=>article.dataset.search.includes(t));article.hidden=!show;if(show){shown++;count++;}}
   section.hidden=shown===0;
  }
  $('#result-status').textContent=terms.length?`${count}개 개념이 일치합니다.`:`${data.sections.length}개 분야 · ${all.length}개 개념 · 관계와 출처 포함`;
 }
 search.addEventListener('input',filter);filter();
 // An internal link should always reveal its destination even after a search.
 function revealHash(){if(!location.hash)return;const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(!target)return;if(target.closest('.chapter[hidden]')||target.matches('.concept[hidden]')){search.value='';filter()}requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));}
 window.addEventListener('hashchange',revealHash);revealHash();
 mountExamples();
}
function mountExamples(){
 const controls=(panel,ready)=>{
  const frame=panel.querySelector('iframe'),cap=ready?inspectDemo(frame):{show:false,slow:false,reset:false,slowActive:false};
  panel.querySelector('[data-show]').disabled=!cap.show;panel.querySelector('[data-slow]').disabled=!cap.slow;panel.querySelector('[data-slow]').setAttribute('aria-pressed',String(cap.slowActive));panel.querySelector('[data-reset]').disabled=!cap.reset;
 };
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){
  const panel=entry.target,stage=panel.querySelector('.theory-example-stage');
  if(entry.isIntersecting&&!stage.querySelector('iframe')){
   const frame=document.createElement('iframe');frame.title=panel.dataset.name+' 원본 예시';frame.setAttribute('sandbox','allow-scripts allow-forms allow-same-origin allow-popups');frame.referrerPolicy='no-referrer';
   frame.addEventListener('load',()=>{stage.classList.add('ready');stage.setAttribute('aria-busy','false');controls(panel,true)});frame.src=panel.dataset.preview;stage.append(frame);
  }else if(!entry.isIntersecting&&stage.querySelector('iframe')){stage.querySelector('iframe').remove();stage.classList.remove('ready');stage.setAttribute('aria-busy','true');controls(panel,false)}
 }},{rootMargin:'200px 0px'});
 document.querySelectorAll('.theory-example').forEach(panel=>{observer.observe(panel);panel.addEventListener('click',event=>{
  const button=event.target.closest('button'),frame=panel.querySelector('iframe');if(!button||!frame)return;
  if(button.hasAttribute('data-show'))showDemo(frame);
  if(button.hasAttribute('data-slow'))setDemoSlow(frame,button.getAttribute('aria-pressed')!=='true');
  if(button.hasAttribute('data-reset')){const stage=panel.querySelector('.theory-example-stage');stage.classList.remove('ready');stage.setAttribute('aria-busy','true');controls(panel,false);resetDemo(frame);return}
  controls(panel,true);
 })});
}
// Link only examples already collected from their original sources.
async function addSourceExamples(liveExamples){
 const mappings={
  'apg-35':['table','열 제목을 눌러 정렬하고 표의 순서가 바뀌는지 확인하세요.'],
  hb081:['tooltip','대상에 포인터를 올려 보조 설명이 나타나는 순간을 살펴보세요.'],
  hb059:['error','잘못된 입력에 대한 시각적 피드백을 살펴보세요.'],
  hb007:['scroll','스크롤하면서 배경과 콘텐츠의 이동 속도 차이를 살펴보세요.'],
  hb021:['snap-stagger','스크롤할 때 화면이 구간에 맞춰 정렬되는지 살펴보세요.'],
  hb071:['states','진행 중과 완료 상태가 달라지는 방식을 확인하세요.'],
  hb103:['viewer','3D 대상을 여러 방향에서 보는 방식과 조작을 살펴보세요.'],
  tr01:['crossfade','두 장면이 겹치며 바뀌는 방식을 살펴보세요.'],
  tr03:['slide-mask','장면이 어느 방향으로 들어오고 나가는지 살펴보세요.'],
  tr09:['screen-transition','화면 사이에서 공유 요소가 이어지는 방식을 살펴보세요.'],
  cam01:['dolly','카메라 이동과 줌에 따라 배경의 원근이 어떻게 달라지는지 비교하세요.'],
  cam02:['pan-tilt','카메라의 위치 이동과 회전이 화면에 미치는 차이를 비교하세요.'],
  cam03:['dolly-zoom','피사체 크기와 배경 원근의 변화를 함께 살펴보세요.']
 };
 const manifests=await Promise.all(['apg-more.json','hand-all.json','camera-manifest.json'].map(async name=>{try{const r=await fetch('./examples/'+name);return r.ok?await r.json():[]}catch{return []}}));
 for(const entry of manifests.flat()){
  const target=mappings[entry.id];if(!target||!entry.preview||!entry.sourceUrl||liveExamples[target[0]])continue;
  liveExamples[target[0]]={...entry,note:target[1]};
 }
}
try{
 const [knowledge,catalog,course,liveExamples]=await Promise.all(['./theory.json?v=20261028-1','./catalog.json','./course.json','./theory-examples.json?v=20261028-layout'].map(async url=>{const response=await fetch(url);if(!response.ok)throw Error(`HTTP ${response.status}`);return response.json()}));
 await addSourceExamples(liveExamples);
 render(knowledge,catalog,course,liveExamples);
}catch(error){$('#load-error').textContent='설계 지식 문서를 불러오지 못했습니다. 새로고침하거나 잠시 후 다시 시도해 주세요.';console.error('설계 지식 로드 실패',error);}
