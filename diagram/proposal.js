(() => {
  'use strict';
  const mode = document.querySelector('#view-mode');
  const diagram = document.querySelector('#demo-diagram');
  const explanation = document.querySelector('#demo-explanation');
  function render() {
    if (mode.value === 'conditions') {
      diagram.innerHTML = '<div class="demo-diagram"><div class="demo-box core"><b>기존 체계 기반 교육</b><p>학위과정 · 교수진 활용<br>사업 종료 후 이어갈 계획</p></div><div class="demo-box conditional"><b>조건부 인턴십</b><p>외부 재원과 참여기관 협의 필요<br>조건 확인 후 추진할 계획</p></div></div>';
      explanation.textContent = '두 활동은 모두 계획이지만 운영 전제가 다릅니다. 문장이 직접 밝힌 조건을 분리해 표시했습니다. 실제 지속 가능성은 재원과 권한 등 추가 확인이 필요합니다.';
    } else {
      diagram.innerHTML = '<div class="demo-diagram"><div class="demo-box"><b>교육 운영</b><p>학위과정 · 교수진 활용</p></div><div class="demo-box"><b>인턴십 운영</b><p>외부 기관 협력</p></div></div>';
      explanation.textContent = '두 활동을 같은 상자 수준에 놓으면 목록은 간결하지만, 인턴십에 필요한 재원과 협의가 그림에 드러나지 않습니다.';
    }
  }
  mode.addEventListener('change', render); render();
})();
