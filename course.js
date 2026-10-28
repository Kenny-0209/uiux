const $ = (s, root = document) => root.querySelector(s);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim();
const safeURL = value => { try { const u = new URL(value); return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : ''; } catch { return ''; } };
const prose = value => {
 const template = document.createElement('template');
 template.innerHTML = String(value || '');
 const allowed = new Set(['P','H1','H2','H3','STRONG','EM','UL','OL','LI','A','CODE','BR']);
 for(const el of [...template.content.querySelectorAll('*')]) {
  if(!allowed.has(el.tagName)){el.remove();continue;}
  for(const attr of [...el.attributes]) if(attr.name !== 'href' || el.tagName !== 'A') el.removeAttribute(attr.name);
  if(el.tagName === 'A'){const url=safeURL(el.getAttribute('href'));if(url){el.href=url;el.target='_blank';el.rel='noopener noreferrer';}else el.removeAttribute('href');}
 }
 return template.innerHTML;
};
let data = null, chapter = '전체', access = 'all', query = '';
const chapterNames = ['전체','UX/UI 입문','UI 공통 기초','Android','iOS','UX 설계와 실무'];
function drawChapters(){
 const buttons = chapterNames.map(name => {
  const n = name === '전체' ? data.episodes.length : data.episodes.filter(e => e.chapter === name).length;
  return `<button type="button" data-chapter="${escapeHTML(name)}" aria-pressed="${chapter === name}"><span>${escapeHTML(name)}</span> <b>${n}</b></button>`;
 }).join('');
 $('#chapters').innerHTML=buttons;
 $('#mobile-chapters').innerHTML=buttons;
}
function lessonRow(e){
 const expandedSource = e.members
  ? '<div class="locked-note"><b>강의 내용은 확인하지 못했습니다.</b>재생목록에 회원 전용으로 표시되어 영상 제목과 링크만 확인했습니다. 이 편의 원리나 내용을 추정해 채우지 않았습니다.</div>'
  : `<div class="prose">${prose(e.detailHtml)}</div>`;
 const sourceURL = escapeHTML(safeURL(e.url));
 const status = e.members ? '회원 전용 · 내용 미확인' : '공개 · 내용 확인';
 return `<article class="episode" id="episode-${e.index}">
  <button type="button" class="episode-toggle" data-episode="${e.index}" aria-expanded="false" aria-controls="detail-${e.index}">
   <span class="episode-num">${String(e.index).padStart(2,'0')}</span><span><span class="episode-title">${escapeHTML(e.title)}</span><span class="episode-meta"><span>${escapeHTML(e.chapter)}</span><span>${escapeHTML(e.lesson)}</span><span>${escapeHTML(e.duration)}</span><span class="badge ${e.members?'lock':''}">${status}</span></span></span><span class="toggle-icon" aria-hidden="true">＋</span>
  </button>
  <div id="detail-${e.index}" class="episode-detail" hidden><div class="detail-top"><span class="detail-source">${e.members?'목록 정보만 확인':`원본 영상 · ${escapeHTML(e.caption)} 기반 조사`}</span><a class="source-link" href="${sourceURL}" target="_blank" rel="noopener noreferrer">영상 원본 ↗</a></div>${expandedSource}</div>
 </article>`;
}
function drawEpisodes(){
 const q=normalize(query);
 const found=data.episodes.filter(e => {
  const searchable=[e.title,e.chapter,e.lesson,e.detailHtml?.replace(/<[^>]+>/g,' ') || ''].join(' ');
  return (chapter==='전체'||e.chapter===chapter) && (access==='all'||(access==='members'?e.members:!e.members)) && (!q||normalize(searchable).includes(q));
 });
 $('#count').textContent=`${found.length}개 강좌`;
 $('#active-chapter').textContent=chapter==='전체'?'전체 강좌':chapter;
 if(!found.length){$('#episodes').innerHTML='<div class="empty">일치하는 강좌가 없습니다. 다른 이름이나 분야를 선택해 주세요.</div>';return;}
 let last='';
 $('#episodes').innerHTML=found.map(e=>{
  const heading=e.chapter!==last ? `<div class="chapter-heading"><b>${escapeHTML(e.chapter)}</b><span>CHAPTER ${e.chapterNo}</span></div>` : '';
  last=e.chapter;
  return heading+lessonRow(e);
 }).join('');
}
function toggleEpisode(button){
 const panel=$('#detail-'+button.dataset.episode);
 if(!panel)return;
 const open=button.getAttribute('aria-expanded')==='true';
 document.querySelectorAll('.episode-toggle[aria-expanded="true"]').forEach(other=>{if(other!==button){other.setAttribute('aria-expanded','false');const detail=$('#detail-'+other.dataset.episode);if(detail)detail.hidden=true;}});
 button.setAttribute('aria-expanded',String(!open));
 panel.hidden=open;
}
document.addEventListener('click',event=>{
 const ch=event.target.closest('[data-chapter]');
 if(ch){chapter=ch.dataset.chapter;drawChapters();drawEpisodes();$('.collection-head').scrollIntoView({block:'start',behavior:'auto'});return;}
 const filter=event.target.closest('[data-access]');
 if(filter){access=filter.dataset.access;document.querySelectorAll('[data-access]').forEach(x=>x.setAttribute('aria-pressed',String(x===filter)));drawEpisodes();return;}
 const item=event.target.closest('[data-episode]');
 if(item)toggleEpisode(item);
});
$('#search').addEventListener('input',event=>{query=event.target.value;drawEpisodes();});
try{
 const response=await fetch('./course.json');
 if(!response.ok)throw new Error(`HTTP ${response.status}`);
 data=await response.json();
 if(!Array.isArray(data.episodes))throw new Error('잘못된 목록 형식');
 $('#total').textContent=data.episodes.length;
 $('#public-total').textContent=data.episodes.filter(e=>!e.members).length;
 $('#locked-total').textContent=data.episodes.filter(e=>e.members).length;
 $('#overview-content').innerHTML=prose(data.overviewHtml);
 drawChapters();drawEpisodes();
}catch(error){$('#error').textContent='강좌 자료를 불러오지 못했습니다. 로컬 서버를 확인해 주세요.';console.error(error);}
