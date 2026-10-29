(() => {
  'use strict';
  const $=s=>document.querySelector(s);
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let cases=[], current=0;
  const group=$('#group-filter'),search=$('#element-search');
  function selectCase(i) {
    current=i; const c=cases[i];
    $('#case-buttons').innerHTML=cases.map((x,n)=>`<button type="button" data-case="${n}" aria-pressed="${n===i}"><small>0${n+1} / ${x.items.length}개 요소 · PDF ${x.pdfPage}쪽</small><b>${esc(x.title)}</b></button>`).join('');
    $('#case-overview').innerHTML=`<span class="case-kicker">${esc(c.source)}</span><h3>${esc(c.title)}</h3><p><b>분석 범위</b> · ${esc(c.scope)}</p><p><b>문서의 내용</b> · ${esc(c.context)}</p><p><b>자료 특성</b> · ${esc(c.evidence)}</p><p><a href="${esc(c.sourceUrl)}" target="_blank" rel="noopener noreferrer">대학의 원문 게시물 ↗</a> · <a href="${esc(c.pdfUrl)}" target="_blank" rel="noopener noreferrer">원본 PDF · ${c.pdfPage}쪽 확인 ↗</a> <small>(브라우저에서 PDF가 다운로드될 수 있습니다.)</small></p><div class="domestic-theory"><div><b>적용한 기준</b>${esc(c.theoryBefore)}</div><div><b>부족한 점</b>${esc(c.miss)}</div><div><b>보완한 기준</b>${esc(c.revision)}</div></div>`;
    group.innerHTML='<option value="all">전체 보기</option>'+[...new Set(c.items.map(x=>x.group))].map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
    search.value=''; renderElements();
  }
  function renderElements(){
    const c=cases[current],q=search.value.trim().toLowerCase();
    const list=c.items.filter(x=>(group.value==='all'||x.group===group.value)&&(!q||Object.values(x).join(' ').toLowerCase().includes(q)));
    $('#result-count').textContent=`${list.length} / ${c.items.length}개 요소`;
    $('#no-elements').hidden=list.length!==0;
    $('#elements').innerHTML=list.map(x=>`<details class="element-record"><summary><span>${esc(x.id.toUpperCase())} · ${esc(x.group)}</span>${esc(x.name)}</summary><dl class="element-properties"><dt>담긴 내용</dt><dd>${esc(x.content)}</dd><dt>위치</dt><dd>${esc(x.position)}</dd><dt>형태·테두리</dt><dd>${esc(x.form)}</dd><dt>글자·정렬</dt><dd>${esc(x.typeface)}</dd><dt>색·명도</dt><dd>${esc(x.color)}</dd><dt>연결·소속</dt><dd>${esc(x.relation)}</dd><dt>해석·근거</dt><dd>${esc(x.assessment)}</dd><dt>확인 한계</dt><dd class="uncertain">${esc(x.uncertainty)}</dd></dl></details>`).join('');
  }
  $('#case-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-case]');if(b)selectCase(Number(b.dataset.case));});
  group.addEventListener('change',renderElements);search.addEventListener('input',renderElements);
  $('#expand-all').addEventListener('click',()=>document.querySelectorAll('#elements details').forEach(x=>{x.open=true;}));
  $('#collapse-all').addEventListener('click',()=>document.querySelectorAll('#elements details').forEach(x=>{x.open=false;}));
  Promise.all(['data/domestic.json','data/domestic-extra.json'].map(url=>fetch(url).then(r=>{if(!r.ok)throw new Error('data');return r.json();}))).then(data=>{cases=data.flatMap(d=>d.cases);selectCase(0);}).catch(()=>{$('#case-overview').textContent='사례 데이터를 불러오지 못했습니다. 다시 시도해 주세요.';});
})();
