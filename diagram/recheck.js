(() => {'use strict';const notes=[
 ['원문에서 확인','같은 효소 반응의 세 표현','A는 반응식, B는 종과 반응을 분리한 그래프, C는 퍼텐셜·유량과 보존 관계를 표현한 bond graph입니다. 같은 반응을 다른 문법과 상세 수준으로 나타냅니다.','독자에게 어느 표현이 더 이해하기 쉬운지는 별도로 시험하지 않았습니다.'],
 ['범례와 본문에서 확인','속 빈 원과 채운 원','이 그림에서 속 빈 원은 화학종, 빈 사각형은 반응, 채운 원은 공통 퍼텐셜과 질량 보존을 나타내는 접합입니다. 채운 정도는 장식이 아니라 구성요소의 종류를 구분합니다.','저자는 문자 대신 도형을 택한 이유를 밝히지만 원을 왜 굳이 비워 두었는지 개별 의도까지 설명하지는 않습니다.'],
 ['캡션에서 확인','화살표는 양의 방향을 정합니다','C의 화살표는 결합된 몰 유량과 화학 퍼텐셜을 나타내며 화살표 머리는 양의 유량을 정하는 기준입니다. 반응은 반대 방향으로도 진행될 수 있습니다.','이 정의를 모든 화살표나 다른 종류의 그래프에 적용하지 않습니다.'],
 ['저자가 밝힌 선택 이유','문자 대신 도형을 쓴 이유','저자는 전통적인 bond graph의 문자 구성요소와 반화살표 대신 도형과 일반 화살표를 사용한 것이 시스템 생물학의 표기 관례에 가깝게 하기 위한 것이라고 설명합니다.','저자의 직접 진술과, 독자가 어떻게 이해할지에 대한 추정은 다릅니다.']
 ];document.querySelectorAll('.annot-marker').forEach(b=>b.addEventListener('click',()=>{const n=notes[Number(b.dataset.note)];document.getElementById('note-kind').textContent=n[0];document.getElementById('note-title').textContent=n[1];document.getElementById('note-text').textContent=n[2];document.getElementById('note-limit').textContent=n[3];}));})();
