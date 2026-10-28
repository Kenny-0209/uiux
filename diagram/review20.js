(() => {
  'use strict';
  const list = document.querySelector('#review-list');
  const count = document.querySelector('#review-count');
  const search = document.querySelector('#review-q');
  const empty = document.querySelector('#review-empty');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let cases = [];
  const render = () => {
    const q = search.value.trim().toLocaleLowerCase();
    const filtered = cases.filter(item => Object.values(item).join(' ').toLocaleLowerCase().includes(q));
    count.textContent = `${filtered.length} / ${cases.length}개 사례`;
    empty.hidden = filtered.length !== 0;
    list.innerHTML = filtered.map(item => `<details class="review-card" id="round-${item.n}"><summary><span class="review-number">${String(item.n).padStart(2, '0')}</span><span><small>${esc(item.category)}</small><strong>${esc(item.title)}</strong><span class="review-paper">${esc(item.paper)}</span></span><span class="review-plus" aria-hidden="true">＋</span></summary><div class="review-body">${item.image ? `<figure class="review-figure"><img src="${esc(item.image)}" loading="lazy" alt="${esc(item.paper)}의 원본 그림. 자세한 내용은 바로 뒤의 그림 관찰 설명을 참조하세요."><figcaption>${esc(item.license)} · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">이용 조건 ↗</a></figcaption></figure>` : ''}<div class="review-evidence"><div><span>01 / 원문과 그림에서 확인</span><p>${esc(item.seen)}</p></div><div><span>02 / 기존 설명의 빈틈</span><p>${esc(item.gap)}</p></div><div><span>03 / 보완한 설명</span><p>${esc(item.added)}</p></div><div><span>04 / 원문으로 다시 확인</span><p>${esc(item.recheck)}</p></div></div><div class="review-links"><a href="${esc(item.figure)}" target="_blank" rel="noopener noreferrer">해당 그림 원본 보기 ↗</a><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">논문 본문과 캡션 ↗</a></div></div></details>`).join('');
  };
  search.addEventListener('input', render);
  fetch('data/reviews20.json').then(response => { if (!response.ok) throw new Error('자료를 불러오지 못했습니다.'); return response.json(); }).then(items => { cases = items; render(); }).catch(() => { count.textContent = '자료를 불러오지 못했습니다. 페이지를 새로고침해 주세요.'; });
})();
