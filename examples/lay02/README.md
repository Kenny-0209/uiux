# lay02 원본 예시

Start Bootstrap 저장소의 고정 커밋에서 가져온 실제 배포본입니다. `source.html`은 변경하지 않은 원본이며 `index.html`은 로컬 iframe에서 실행할 수 있도록 CSS·JavaScript 의존성 경로만 바꿨습니다. CSS와 JS 원본, 필요한 제3자 라이선스를 같은 폴더에 보존합니다. 화면에 표시되는 모든 데이터는 원본 예제의 가상 데이터입니다.

공통 JavaScript 원본은 source.js이며, 패널용 app.js는 두 서로 다른 템플릿이 브라우저 저장 상태를 공유하지 않도록 localStorage 키만 구분합니다.

패널용 HTML의 Font Awesome 아이콘 스크립트에는 defer를 추가했습니다. DOM 파싱 후 실행하여 조기 초기화 오류를 피하기 위한 수정이며 저장된 source.html과 icons.js 원본은 변경하지 않았습니다.
