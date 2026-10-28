// Search controls for the source-backed catalogue. Tag group labels describe
// the tag itself; they do not assert that an example has an inferred mood.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = value => String(value || '').normalize('NFKC').toLocaleLowerCase().trim();

export function createSearchTools({examples, tagGroups, onChange, chooseTag, chooseExample}) {
 const input=document.querySelector('#search'), menu=document.querySelector('#search-suggestions');
 const state={include:new Set(),exclude:new Set(),match:'all',scope:'all',source:'전체'};
 const index=new Map();
 for(const e of examples){const seen=new Set();for(const tag of e.tags||[]){
  const key=norm(tag);if(!key)continue;
  let record=index.get(key);if(!record){record={tag,count:0,groups:new Set()};index.set(key,record)}
  if(!seen.has(key)){record.count++;seen.add(key)}for(const group of tagGroups.tags?.[tag]||['기타·검토'])record.groups.add(group);
 }}
 const tags=[...index.values()].sort((a,b)=>b.count-a.count||a.tag.localeCompare(b.tag,'ko'));
 const groups=tagGroups.groups||['기타·검토'];
 const sources=[...new Set(examples.map(e=>e.sourceName).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ko'));
 let group='전체',tagQuery='',limit=48,active=-1,suggestions=[];

 function textMatches(e, term){
  const exact=state.scope==='tag-exact', onlyTags=state.scope!=='all';
  const fields=onlyTags?(e.tags||[]):[e.name,e.english,e.category,e.sourceName,...(e.tags||[]),...(e.taxonomy?.subcategories||[]),...Object.values(e.taxonomy?.related||{}).flat()];
  return fields.some(x=>exact?norm(x)===term:norm(x).includes(term));
 }
 function matches(e,query){
  const tokens=[...String(query||'').matchAll(/(-?)(?:"([^"]+)"|(\S+))/g)].map(m=>({negative:!!m[1],value:norm(m[2]||m[3])})).filter(x=>x.value);
  if(!tokens.every(t=>t.negative?!textMatches(e,t.value):textMatches(e,t.value)))return false;
  const exampleTags=new Set((e.tags||[]).map(norm));
  if([...state.exclude].some(tag=>exampleTags.has(norm(tag))))return false;
  const wanted=[...state.include];
  if(wanted.length&&!(state.match==='all'?wanted.every(tag=>exampleTags.has(norm(tag))):wanted.some(tag=>exampleTags.has(norm(tag)))))return false;
  return state.source==='전체'||e.sourceName===state.source;
 }
 function closeSuggestions(){menu.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');active=-1;}
 function updateActive(){
  const options=[...menu.querySelectorAll('[role=option]')];
  options.forEach((node,i)=>node.setAttribute('aria-selected',String(i===active)));
  if(active>=0&&options[active]){input.setAttribute('aria-activedescendant',options[active].id);options[active].scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');
 }
 function drawSuggestions(){
  const q=norm(input.value); if(!q){closeSuggestions();return;}
  const last=q.match(/(?:^|\s)(?:-?)(?:"([^"]*)"|(\S+))$/); const needle=norm(last?.[1]||last?.[2]||q);
  if(!needle){closeSuggestions();return;}
  const tagResults=tags.filter(x=>norm(x.tag).includes(needle)).sort((a,b)=>(norm(a.tag).startsWith(needle)?0:1)-(norm(b.tag).startsWith(needle)?0:1)||b.count-a.count).slice(0,6);
  const exampleResults=/(?:^|\s)-\S+$/.test(input.value)?[]:examples.filter(e=>norm(e.name).includes(needle)||norm(e.english).includes(needle)).slice(0,4);
  suggestions=[...tagResults.map(t=>({type:'tag',value:t.tag,count:t.count,groups:[...t.groups]})),...exampleResults.map(e=>({type:'example',value:e.name,category:e.category}))];
  if(!suggestions.length){closeSuggestions();return;}
  menu.innerHTML=suggestions.map((s,i)=>`<div id="search-option-${i}" role="option" aria-selected="false" class="suggestion" data-suggestion="${i}"><span class="suggestion-icon">${s.type==='tag'?'#':'↗'}</span><span class="suggestion-text"><strong>${esc(s.value)}</strong><small>${esc(s.type==='tag'?s.groups.slice(0,2).join(' · '):s.category)}</small></span><span class="suggestion-meta">${s.type==='tag'?`${s.count}개`:'예시'}</span></div>`).join('');
  menu.hidden=false;input.setAttribute('aria-expanded','true');active=-1;
 }
 function choose(i){
  const s=suggestions[i];if(!s)return;
  const negative=/(?:^|\s)-\S+$/.test(input.value);
  closeSuggestions();
  if(s.type==='tag'){
   if(negative){state.include.delete(s.value);state.exclude.add(s.value);renderSelected();renderTags();}
   chooseTag(s.value,negative);
  }else chooseExample(s.value);
 }
 input.addEventListener('focus',drawSuggestions);
 input.addEventListener('blur',()=>setTimeout(closeSuggestions,150));
 input.addEventListener('keydown',event=>{
  if(event.isComposing)return;
  if(event.key==='ArrowDown'&&suggestions.length&&!menu.hidden){event.preventDefault();active=(active+1)%suggestions.length;updateActive();}
  else if(event.key==='ArrowUp'&&suggestions.length&&!menu.hidden){event.preventDefault();active=(active-1+suggestions.length)%suggestions.length;updateActive();}
  else if(event.key==='Enter'&&active>=0&&!menu.hidden){event.preventDefault();choose(active);}
  else if(event.key==='Escape'&&!menu.hidden){event.stopPropagation();closeSuggestions();}
 });
 menu.addEventListener('pointerdown',event=>event.preventDefault());
 menu.addEventListener('click',event=>{const option=event.target.closest('[data-suggestion]');if(option)choose(Number(option.dataset.suggestion));});

 const panel=document.querySelector('#advanced-search');
 panel.innerHTML=`<summary><span>상세 검색</span><small>태그 조합 · 검색 범위 · 출처</small><b aria-hidden="true">＋</b></summary>
  <div class="advanced-body"><div class="advanced-fields">
   <label>검색 범위<select id="search-scope"><option value="all">이름·태그·분류</option><option value="tag-partial">태그 부분 일치</option><option value="tag-exact">태그 완전 일치</option></select></label>
   <label>태그 포함 조건<select id="tag-match"><option value="all">선택한 태그 모두 포함 (AND)</option><option value="any">선택한 태그 중 하나 이상 (OR)</option></select></label>
   <label>출처<select id="source-filter"><option value="전체">전체 출처</option>${sources.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('')}</select></label>
  </div><p class="advanced-help">검색어는 띄어쓰기로 함께 찾고, 제외할 단어 앞에 -를 붙이세요. 여러 단어는 큰따옴표로 묶을 수 있습니다.</p>
  <div class="advanced-selected" aria-live="polite"></div>
  <div class="tag-browser-head"><div><strong>태그 둘러보기</strong><small>태그 수와 사례 수는 전체 목록 기준</small></div><label><span class="visually-hidden">태그 목록 검색</span><input type="search" id="tag-list-search" placeholder="태그 찾기" autocomplete="off"></label></div>
  <div class="tag-groups" role="group" aria-label="태그 분류"></div><p class="tag-guide">태그를 누르면 포함, 옆의 −를 누르면 제외합니다. 확인이 필요한 태그는 기타·검토에 표시합니다.</p>
  <div class="tag-options"></div><button type="button" class="tags-show-more" hidden>태그 더 보기</button><div class="advanced-bottom"><button type="button" data-advanced-reset>상세 조건 초기화</button><span>${tags.length}개 태그를 분류했습니다.</span></div></div>`;
 const groupBox=panel.querySelector('.tag-groups'), options=panel.querySelector('.tag-options'), selected=panel.querySelector('.advanced-selected'), showMore=panel.querySelector('.tags-show-more');
 function renderGroups(){groupBox.innerHTML=['전체',...groups].map(g=>{const n=g==='전체'?tags.length:tags.filter(x=>x.groups.has(g)).length;return `<button type="button" data-group="${esc(g)}" class="${group===g?'is-active':''}" aria-pressed="${group===g}">${esc(g)} <small>${n}</small></button>`}).join('');}
 function renderTags(){
  const q=norm(tagQuery), candidates=tags.filter(t=>(group==='전체'||t.groups.has(group))&&(!q||norm(t.tag).includes(q)));
  options.innerHTML=candidates.slice(0,limit).map(t=>{const included=state.include.has(t.tag),excluded=state.exclude.has(t.tag);return `<div class="tag-option ${included?'is-included':''} ${excluded?'is-excluded':''}"><button type="button" data-include="${esc(t.tag)}" aria-pressed="${included}" title="포함 태그로 선택">#${esc(t.tag)} <small>${t.count}</small></button><button type="button" data-exclude="${esc(t.tag)}" aria-label="${esc(t.tag)} 제외" aria-pressed="${excluded}">−</button></div>`}).join('')||'<p class="tag-empty">일치하는 태그가 없습니다.</p>';
  showMore.hidden=candidates.length<=limit;showMore.textContent=`태그 더 보기 · ${Math.min(limit,candidates.length)} / ${candidates.length}`;
 }
 function renderSelected(){
  const parts=[...[...state.include].map(t=>({tag:t,kind:'include'})),...[...state.exclude].map(t=>({tag:t,kind:'exclude'}))];
  const extra=[state.scope!=='all'?(state.scope==='tag-exact'?'태그 완전 일치':'태그 부분 일치'):'',state.source!=='전체'?`출처: ${state.source}`:'',state.match==='any'&&state.include.size?'태그 중 하나 이상':''].filter(Boolean);
  selected.innerHTML=(parts.length||extra.length)?`<span>선택 조건</span>${parts.map(x=>`<button type="button" data-remove="${esc(x.tag)}" data-kind="${x.kind}" aria-label="${esc(x.tag)} ${x.kind==='include'?'포함':'제외'} 조건 제거">${x.kind==='include'?'+':'−'} #${esc(x.tag)} ×</button>`).join('')}${extra.map(x=>`<span class="filter-meta">${esc(x)}</span>`).join('')}`:'<span>선택한 태그 없음</span>';
  const summary=panel.querySelector('summary small');const amount=parts.length+extra.length;summary.textContent=amount?`${amount}개 조건 적용 중`:'태그 조합 · 검색 범위 · 출처';
 }
 function update(){renderSelected();renderTags();onChange();}
 panel.addEventListener('click',event=>{
  const g=event.target.closest('[data-group]');if(g){group=g.dataset.group;limit=48;renderGroups();renderTags();return;}
  const inc=event.target.closest('[data-include]');if(inc){const t=inc.dataset.include;if(state.include.has(t))state.include.delete(t);else{state.exclude.delete(t);state.include.add(t)}update();return;}
  const exc=event.target.closest('[data-exclude]');if(exc){const t=exc.dataset.exclude;if(state.exclude.has(t))state.exclude.delete(t);else{state.include.delete(t);state.exclude.add(t)}update();return;}
  const remove=event.target.closest('[data-remove]');if(remove){state[remove.dataset.kind].delete(remove.dataset.remove);update();return;}
  if(event.target.closest('.tags-show-more')){limit+=48;renderTags();return;}
  if(event.target.closest('[data-advanced-reset]')){state.include.clear();state.exclude.clear();state.match='all';state.scope='all';state.source='전체';panel.querySelector('#tag-match').value='all';panel.querySelector('#search-scope').value='all';panel.querySelector('#source-filter').value='전체';update();}
 });
 panel.querySelector('#tag-list-search').addEventListener('input',e=>{tagQuery=e.target.value;limit=48;renderTags();});
 panel.querySelector('#tag-match').addEventListener('change',e=>{state.match=e.target.value;renderSelected();onChange();});
 panel.querySelector('#search-scope').addEventListener('change',e=>{state.scope=e.target.value;renderSelected();onChange();});
 panel.querySelector('#source-filter').addEventListener('change',e=>{state.source=e.target.value;renderSelected();onChange();});
 renderGroups();renderTags();renderSelected();
 return {matches,drawSuggestions};
}
