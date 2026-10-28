(() => {
 'use strict';
 const root=document.querySelector('#compare-list'), count=document.querySelector('#compare-count'), search=document.querySelector('#compare-q'), empty=document.querySelector('#compare-empty');
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 if(!window.COMPARE40){count.textContent='자료를 불러오지 못했습니다.';return;}
 const {papers,groups}=window.COMPARE40;
 const previousNames={'edge-definition':'선의 출처·도착점·관계 종류','notation':'도식의 문법과 범위','representation-change':'같은 대상의 다른 표현과 생략','purpose-first':'목적과 독자에서 시작하기','relation-label':'연결의 의미를 명시하기','grouping':'근접과 유사성으로 묶기','panels-scales':'패널별 대상·선택 기준·범례','flow-counts':'흐름도의 분기와 수량 검산','comparison':'비교의 기준 맞추기'};
 const prior=[
  ['edge-definition','notation','representation-change','representation-change','edge-definition','purpose-first','notation','notation','notation','relation-label'],
  ['representation-change','edge-definition','representation-change','notation','edge-definition','representation-change','comparison','edge-definition','comparison','notation'],
  ['representation-change','purpose-first','notation','purpose-first','panels-scales','comparison','purpose-first','notation','comparison','relation-label'],
  ['flow-counts','flow-counts','notation','flow-counts','flow-counts','flow-counts','edge-definition','comparison','flow-counts','flow-counts']
 ];
 let n=0;
 const rows=groups.flatMap((g,gi)=>g.rows.map((r,ri)=>({n:++n, group:g.name,common:g.common, prior:previousNames[prior[gi][ri]],a:papers[r[0]],b:papers[r[1]],focus:r[2], difference:r[3],explain:r[4],gap:r[5],revision:r[6],recheck:r[7]})));
 const paper=(p,side)=>`<div class="compare-paper"><span>${side} / 원문에서 확인</span><strong>${esc(p.name)}</strong><p>${esc(p.fact)}</p>${p.image?`<figure><img loading="lazy" src="${esc(p.image)}" alt="${esc(p.name)}의 원본 ${esc(p.fig)}"><figcaption>${esc(p.name)} · ${esc(p.fig)} · 원본 그대로 · <a href="${esc(p.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.license)}</a></figcaption></figure>`:p.url.includes('arxiv.org/pdf/')?`<details class="paper-preview"><summary>원본 PDF 페이지 펼치기</summary><iframe title="${esc(p.name)}의 원본 PDF" data-src="${esc(p.url)}" loading="lazy"></iframe><small>브라우저가 미리보기를 지원하지 않으면 아래 원본 링크를 이용하세요.</small></details>`:''}<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.fig)} 원본·캡션 보기 ↗</a></div>`;
 function render(){
  const q=search.value.trim().toLocaleLowerCase();
  const visible=rows.filter(r=>JSON.stringify(r).toLocaleLowerCase().includes(q));
  count.textContent=`${visible.length} / ${rows.length}회 비교`;empty.hidden=visible.length>0;
  root.innerHTML=visible.map(r=>`<details class="review-card" id="comparison-${r.n}"><summary><span class="review-number">${String(r.n).padStart(2,'0')}</span><span><small>${esc(r.group)}</small><strong>${esc(r.focus)}</strong><span class="review-paper">${esc(r.a.name)} ↔ ${esc(r.b.name)}</span></span><span class="review-plus" aria-hidden="true">＋</span></summary><div class="review-body"><p class="compare-common"><b>공통 개념과 비교 범위</b> ${esc(r.common)}</p><div class="compare-papers">${paper(r.a,'A')}${paper(r.b,'B')}</div><div class="review-evidence"><div><span>01 / 그림에서 다른 점</span><p>${esc(r.difference)}</p></div><div><span>02 / 원문을 바탕으로 한 해석</span><p>${esc(r.explain)}</p></div><div><span>03 / 기존 원리의 설명력: 부분 설명</span><p><a href="index.html#theory">${esc(r.prior)}</a>에서 출발합니다. ${esc(r.gap)}</p></div><div><span>04 / 보완한 기준</span><p>${esc(r.revision)}</p></div><div><span>05 / 같은 원문으로 다시 확인</span><p>${esc(r.recheck)}</p></div></div></div></details>`).join('');
  const id=location.hash.slice(1);if(id){const detail=document.getElementById(id);if(detail)detail.open=true;}
 }
 root.addEventListener('toggle',event=>{const detail=event.target;if(detail.classList.contains('paper-preview')&&detail.open){const frame=detail.querySelector('iframe');if(!frame.src)frame.src=frame.dataset.src;}},true);
 search.addEventListener('input',render);render();
})();
