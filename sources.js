const input=document.querySelector('#source-search');
const list=document.querySelector('#source-list');
const count=document.querySelector('#source-count');
const error=document.querySelector('#source-error');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=value=>String(value??'').normalize('NFKC').toLocaleLowerCase().trim();
function validURL(value){try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:''}catch{return ''}}
try{
 const response=await fetch('./sources.json');if(!response.ok)throw Error(`HTTP ${response.status}`);
 const entries=await response.json();if(!Array.isArray(entries))throw Error('Invalid source list');
 const sectionIds=new Map([...new Set(entries.map(item=>item.section||'기타'))].map((section,index)=>[section,`source-group-${index+1}`]));
 function render(){
  const terms=norm(input.value).split(/\s+/).filter(Boolean),groups=new Map();let total=0;
  for(const item of entries){const url=validURL(item.url);if(!url||!terms.every(term=>norm(`${item.name} ${item.section} ${url}`).includes(term)))continue;
   const section=item.section||'기타';if(!groups.has(section))groups.set(section,[]);groups.get(section).push({...item,url});total++;
  }
  count.textContent=`${total}개 원천`;
  const navigation=[...groups].map(([section,items])=>`<a href="#${sectionIds.get(section)}"><span>${esc(section)}</span><small>${items.length}</small></a>`).join('');
  document.querySelector('#source-nav').innerHTML=navigation;
  document.querySelector('#source-mobile-nav').innerHTML=navigation;
  list.innerHTML=total?[...groups].map(([section,items])=>`<section class="source-group" id="${sectionIds.get(section)}"><h3>${esc(section)} <small>· ${items.length}</small></h3><div class="source-grid">${items.map(item=>`<a class="source-card" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(item.name)} ↗</strong><span>${esc(item.url)}</span></a>`).join('')}</div></section>`).join(''):'<p class="notice">일치하는 원천이 없습니다. 다른 검색어를 입력해 주세요.</p>';
 }
 input.addEventListener('input',render);render();
}catch(e){error.textContent='원천 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';console.warn('참고 원천 로드 실패',e)}
