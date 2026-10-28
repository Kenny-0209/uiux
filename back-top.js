const buttons=document.querySelectorAll('[data-back-to-top]');
const mobile=document.querySelector('.mobile-back-to-top');
for(const button of buttons)button.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
function update(){if(mobile)mobile.hidden=window.scrollY<80;}
window.addEventListener('scroll',update,{passive:true});update();
