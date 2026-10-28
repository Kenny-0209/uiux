(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = value => Array.isArray(value) ? value : value ? [value] : [];
  const asText = value => Array.isArray(value) ? value.join(' · ') : value ?? '';
  let diagrams = [], guides = {theories:[], documents:[]};
  let selectedDoc = '전체', selectedCategory = '전체';
  const dialog = $('#detail'), body = $('#detailBody');
  const sourceLink = source => source && source.url ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title || source.name || '원문 보기')} ↗</a>` : '';
  const visual = item => typeof window.diagramVisual === 'function' ? window.diagramVisual(item) : '';
  const docOf = d => list(d.documents).map(String);
  const categoriesOf = d => list(d.category).map(String);
  function filterButton(name, type, active) { return `<button type="button" data-type="${type}" data-value="${esc(name)}" aria-pressed="${name === active}">${esc(name)}</button>`; }
  function renderFilters() {
    const docs = [...new Set(diagrams.flatMap(docOf))];
    const cats = [...new Set(diagrams.flatMap(categoriesOf))];
    $('#documentFilters').innerHTML = ['전체', ...docs].map(n => filterButton(n,'doc',selectedDoc)).join('');
    $('#categoryFilters').innerHTML = ['전체', ...cats].map(n => filterButton(n,'category',selectedCategory)).join('');
  }
  function drawCards() {
    const q = $('#search').value.trim().toLowerCase();
    const filtered = diagrams.filter(d => {
      const searchText = [d.name,d.english,d.category,d.purpose,d.description,d.when,d.caution,d.documents,d.alternatives].map(asText).join(' ').toLowerCase();
      return (!q || searchText.includes(q)) && (selectedDoc === '전체' || docOf(d).includes(selectedDoc)) && (selectedCategory === '전체' || categoriesOf(d).includes(selectedCategory));
    });
    $('#resultCount').textContent = `${filtered.length}개 도식`;
    $('#empty').hidden = filtered.length > 0;
    $('#cards').innerHTML = filtered.map(d => `<article class="card"><div class="card-visual">${visual(d)}</div><div class="card-content"><div class="card-top"><span>${esc(asText(d.category))}</span><span>개념 예시</span></div><h3>${esc(d.name)}</h3><div class="en">${esc(d.english || '')}</div><p>${esc(d.description)}</p><div class="tags">${docOf(d).slice(0,3).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div><button class="detail-button" data-diagram="${esc(d.id)}" type="button">사용 상황과 대안 보기 <span aria-hidden="true">↗</span></button></div></article>`).join('');
  }
  function openDialog(html) { body.innerHTML = html; if (!dialog.open) dialog.showModal(); dialog.scrollTop=0; }
  function showDiagram(d) {
    let alternatives = list(d.alternatives).map(a => ({id:a, label:(diagrams.find(x=>x.id===a)?.name || a)}));
    openDialog(`<div class="dialog-content"><div class="section-no">${esc(asText(d.category))} / 도식</div><h2>${esc(d.name)}</h2><div class="en">${esc(d.english)}</div><div class="card-visual">${visual(d)}</div><p>${esc(d.description)}</p><div class="dialog-grid"><div class="dialog-block"><h3>무엇을 표현하나요?</h3><p>${esc(asText(d.purpose))}</p></div><div class="dialog-block"><h3>언제 사용하나요?</h3><p>${esc(asText(d.when))}</p></div><div class="dialog-block"><h3>살펴볼 점</h3><p>${esc(asText(d.caution))}</p></div><div class="dialog-block"><h3>관련 문서</h3><p>${esc(docOf(d).join(' · '))}</p></div></div><div class="source"><b>함께 비교할 대안</b><div>${alternatives.length ? alternatives.map(a=>`<button type="button" class="alt-button" data-alternative="${esc(a.id)}">${esc(a.label)} ↗</button>`).join('') : '연결할 대안을 조사 중입니다.'}</div></div><p class="source">참고 원천 · ${sourceLink(d.source)}<br>그림은 이 도식을 설명하기 위해 자체 제작한 예시입니다.</p></div>`);
  }
  function showDocument(d) {
    openDialog(`<div class="dialog-content"><div class="section-no">DOCUMENT GUIDE</div><h2>${esc(d.title)}</h2><p>${esc(d.summary)}</p>${d.sections.map(s=>`<div class="dialog-block" style="margin-top:10px"><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><div>${s.diagrams.map(a=>`<button class="alt-button" type="button" data-alternative="${esc(a)}">${esc(a)} ↗</button>`).join('')}</div></div>`).join('')}<p class="source">문서 구조 참고 · ${sourceLink(d.source)}<br>제시한 도식은 선택 후보이며 제출처가 정한 필수 요건은 아닙니다.</p></div>`);
  }
  function findAlternative(name) {
    const aliases = {"\ube44\uad50\ud45c": "matrix", "\ud30c\uc774\ud504\ub77c\uc778": "pipeline", "\uc2e4\ud5d8\uc124\uacc4\ub3c4": "study-design", "\uc120 \uadf8\ub798\ud504": "line", "\uc778\uacfc DAG": "causal-dag"};
    const target=aliases[name] || name;
    const exact = diagrams.find(x=> x.id === target || x.name === target || x.english === target);
    if (exact) { showDiagram(exact); return; }
    dialog.close(); selectedDoc='전체'; selectedCategory='전체'; $('#search').value=name; renderFilters(); drawCards(); $('#catalog').scrollIntoView({behavior:'smooth'});
  }
  function renderGuides() {
    $('#documentCards').innerHTML = guides.documents.map((d,i)=>`<article class="doc-card"><span class="number">0${i+1} / DOCUMENT</span><h3>${esc(d.title)}</h3><p>${esc(d.summary)}</p><button type="button" data-document="${esc(d.id)}">문서별 도식 살펴보기 ↗</button></article>`).join('');
    $('#theoryCards').innerHTML = guides.theories.map((t,i)=>`<article class="theory-card"><span class="num">${String(i+1).padStart(2,'0')} / PRINCIPLE</span><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p><details><summary>적용과 주의점</summary><p><b>적용</b> · ${esc(t.apply)}</p><p><b>주의</b> · ${esc(t.caution)}</p><p>${sourceLink(t.source)}</p></details></article>`).join('');
  }
  document.addEventListener('click', e => {
    const filter = e.target.closest('[data-type]');
    if(filter){ if(filter.dataset.type==='doc') selectedDoc=filter.dataset.value; else selectedCategory=filter.dataset.value; renderFilters(); drawCards(); }
    const item = e.target.closest('[data-diagram]'); if(item) { const d=diagrams.find(x=>x.id===item.dataset.diagram); if(d) showDiagram(d); }
    const doc = e.target.closest('[data-document]'); if(doc) { const d=guides.documents.find(x=>x.id===doc.dataset.document); if(d) showDocument(d); }
    const alt = e.target.closest('[data-alternative]'); if(alt) findAlternative(alt.dataset.alternative);
  });
  $('#search').addEventListener('input',drawCards);
  $('#reset').addEventListener('click',()=>{selectedDoc='전체';selectedCategory='전체';$('#search').value='';renderFilters();drawCards();});
  $('#closeDetail').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  Promise.all([fetch('data/diagrams.json').then(r=>{if(!r.ok)throw Error('도식 데이터');return r.json()}),fetch('data/guides.json').then(r=>{if(!r.ok)throw Error('안내 데이터');return r.json()})]).then(([d,g])=>{diagrams=d; guides=g; $('#totalCount').textContent=`${d.length}개 도식 · ${g.theories.length}개 설계 원리`; renderFilters();drawCards();renderGuides();}).catch(e=>{$('#resultCount').textContent='데이터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.';$('#totalCount').textContent='불러오기 실패';console.error(e)});
})();
