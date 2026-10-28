import {inspectDemo,showDemo,setDemoSlow,resetDemo} from './demo-adapter.js?v=20261028-controls';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=v=>String(v??'').normalize('NFKC').toLocaleLowerCase().trim();
const safeURL=v=>{try{const u=new URL(v,location.href);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}};
function sourceLink(source){const url=safeURL(source?.url);return url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(source.name)} ↗</a>`:'';}
function conceptHTML(item,chapterNo,itemNo,sources,liveExamples){
 const index=`${String(chapterNo).padStart(2,'0')}.${String(itemNo).padStart(2,'0')}`;
 const searchable=[item.title,item.english,item.kind,item.meaning,item.application,item.caution,item.aliases,item.relations,...item.refs.map(r=>sources[r]?.name||'')].join(' ');
 const refs=item.refs.map(key=>sourceLink(sources[key])).join('');
 const relation=item.relations?`<div class="relation"><b>개념 관계</b> · ${esc(item.relations)}</div>`:'';
 const aliases=item.aliases?`<p class="aliases">다른 이름 · ${esc(item.aliases)}</p>`:'';
 const example=item.example?`<a class="example-link" href="./index.html?q=${encodeURIComponent(item.example)}#main">관련 예시 더 보기 ↗</a>`:'';
 const live=liveExamples[item.id];
 const panel=live?`<div class="theory-example" data-preview="${esc(live.preview)}" data-name="${esc(live.name)}"><div class="theory-example-head"><div><span>실제 원본 예시</span><strong>${esc(live.name)}</strong></div><a href="${esc(safeURL(live.sourceUrl))}" target="_blank" rel="noopener noreferrer">${esc(live.sourceName)} · 원본 ↗</a></div><p>${esc(live.note)}</p><div class="theory-example-stage" aria-busy="true"><div class="theory-skeleton" aria-hidden="true"></div></div><div class="theory-player"><button type="button" data-show disabled>▶ Show me</button><button type="button" data-slow disabled aria-pressed="false">◷ Slow motion</button><button type="button" data-reset disabled>↺ Reset</button><span>원본 화면에서 직접 조작할 수 있습니다.</span></div></div>`:'';
 return `<article class="concept" id="${esc(item.id)}" data-search="${esc(normalize(searchable))}"><div class="concept-no">${index}</div><div class="concept-body"><div class="concept-title"><h3>${esc(item.title)}</h3><span class="english">${esc(item.english)}</span><span class="kind">${esc(item.kind)}</span></div><p class="definition">${esc(item.meaning)}</p><div class="decision-grid"><div class="decision"><h4>설계에 적용</h4><p>${esc(item.application)}</p></div><div class="decision"><h4>함께 살필 점</h4><p>${esc(item.caution)}</p></div></div>${aliases}${relation}${panel}<div class="concept-footer"><div class="refs" aria-label="참고 근거">${refs}</div>${example}</div></div></article>`;
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
try{
 const [knowledge,catalog,course,liveExamples]=await Promise.all(['./theory.json?v=20261028-1','./catalog.json','./course.json','./theory-examples.json?v=20261028-layout'].map(async url=>{const response=await fetch(url);if(!response.ok)throw Error(`HTTP ${response.status}`);return response.json()}));
 render(knowledge,catalog,course,liveExamples);
}catch(error){$('#load-error').textContent='설계 지식 문서를 불러오지 못했습니다. 새로고침하거나 잠시 후 다시 시도해 주세요.';console.error('설계 지식 로드 실패',error);}
