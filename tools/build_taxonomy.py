from pathlib import Path
import re, json, collections

root=Path(__file__).resolve().parent.parent
script=(root/'real-app.js').read_text(encoding='utf-8')
manifest_block=re.search(r'const manifests=\[(.*?)\];',script,re.S).group(1)
files=re.findall(r"'([^']+)'",manifest_block)
examples={}
for name in files:
    for entry in json.loads((root/'examples'/name).read_text(encoding='utf-8')):
        if isinstance(entry,dict) and entry.get('id'):
            examples.setdefault(entry['id'],entry)

# Additional live Motion examples are currently declared in real-app.js.
motion=[
 ('motion-gestures','호버와 클릭 제스처','Gestures','모션과 인터랙션',['호버','클릭','제스처']),
 ('motion-accordion','아코디언','Accordion','UI 패턴',['아코디언','펼치기']),
 ('motion-drag','드래그','Drag','모션과 인터랙션',['드래그','제스처']),
 ('motion-spring','스프링','Spring','모션과 인터랙션',['스프링','탄성']),
 ('motion-hover','호버 반응','Hover','모션과 인터랙션',['호버','포인터']),
 ('motion-press','누르기 반응','Press','모션과 인터랙션',['클릭','키보드','제스처']),
]
for id,name,english,category,tags in motion:
    examples[id]=dict(id=id,name=name,english=english,category=category,tags=tags)

# Each matching rule is a discoverable facet. Rules use named content, original
# tags and source paths, not a guessed visual design or unverified behaviour.
common=[
 ('로딩',r'로딩|스켈레톤|스피너|시머|skeleton|\bloading\b|\bloader\b|\bspinner\b|\bshimmer\b'),
 ('진행 상태',r'진행률|진행 상태|진행 막대|진행 표시|progress|processing|작업 단계|실행 상태'),
 ('버튼',r'버튼|\bbutton\b|\bbuttons\b|\bcta\b|버튼형'),
 ('토글',r'토글|스위치|toggle|switch'),
 ('패널',r'패널|panel|drawer|드로어|offcanvas|오프캔버스'),
 ('사이드바',r'사이드바|sidebar|sidebars|side nav|측면 탐색'),
 ('마우스·커서',r'마우스|커서|포인터|cursor|pointer|mouse|magnetic|마그네틱'),
 ('호버',r'호버|마우스 오버|hover|mouseover'),
 ('클릭·탭',r'클릭|누르기|\bclick\b|\bpress\b|\btap\b'),
 ('드래그',r'드래그|drag|끌어|끌기'),
 ('스와이프',r'스와이프|swipe'),
 ('검색',r'검색|search|\bfind\b'),
 ('필터',r'필터|filter'),
 ('입력',r'입력|input|textfield|text field|form field|prompt field'),
 ('폼',r'\bform\b|\bforms\b|폼|가입|신청|결제 입력|checkout'),
 ('선택',r'선택|select|picker|checkbox|라디오|radio'),
 ('슬라이더',r'슬라이더|slider|range input'),
 ('아코디언',r'아코디언|accordion'),
 ('접기·펼치기',r'펼치기|접기|disclosure|collaps'),
 ('탭',r'\btab\b|\btabs\b|탭바|탭 전환|탭 메뉴'),
 ('내비게이션',r'내비게이션|네비게이션|navigation|\bnav\b|\bnavbar\b|메뉴|\bmenu\b'),
 ('모달·대화상자',r'모달|대화상자|modal|dialog|lightbox|라이트박스'),
 ('툴팁',r'툴팁|tooltip|팝오버|popover'),
 ('알림',r'알림|notification|toast|토스트|alert|\bbadge\b|배지'),
 ('피드백',r'피드백|feedback|오류|error|성공|success|경고|warning'),
 ('목록',r'목록|\blist\b|\blists\b|listbox'),
 ('카드',r'카드|\bcard\b|\bcards\b'),
 ('캐러셀',r'캐러셀|carousel|슬라이드쇼|slideshow'),
 ('대화·채팅',r'채팅|대화(?!상자)|메시지|chat|message|conversation|bubble|말풍선'),
 ('평가·반응',r'평가|별점|좋아요|싫어요|rating|\breview\b|thumbs|\blike\b'),
 ('비교',r'비교|compare|comparison|before.after|전후'),
 ('표·데이터',r'표 |데이터|\btable\b|\bgrid\b|차트|\bchart\b|대시보드|dashboard'),
 ('스크롤',r'스크롤|\bscroll\b|scrolling|scroll-'),
 ('패럴랙스',r'패럴랙스|parallax'),
 ('고정',r'\bsticky\b|\bpinned?\b|\bfixed\b|고정'),
 ('화면 전환',r'화면 전환|페이지 전환|화면 전환 효과|\b(?:page|screen|view) transitions?\b'),
 ('페이드',r'페이드|fade|dissolve|디졸브'),
 ('슬라이드',r'슬라이드|\bslide\b|sliding'),
 ('줌·확대',r'줌|확대|축소|zoom|\bscale\b|scaling'),
 ('회전',r'회전|rotat|\borbit\b|오빗'),
 ('탄성·스프링',r'탄성|스프링|\bspring\b|\bbounce\b|elastic|bounce|rubber'),
 ('변형',r'변형|\bmorph\b|morphing|distort|왜곡'),
 ('등장·퇴장',r'등장|퇴장|\breveal\b|\benter\b|\bexit\b|\bin\b.*\bout\b'),
 ('텍스트',r'텍스트|타이포|글자|문자|\btext\b|typograph|letter|font'),
 ('색상·그라데이션',r'색상|색채|컬러|그라데이션|gradient|\bcolor\b|\bcolour\b'),
 ('이미지',r'이미지|사진|\bimage\b|\bphoto\b|gallery|갤러리'),
 ('오디오·비디오',r'오디오|비디오|음악|\baudio\b|\bvideo\b|\bmusic\b'),
 ('카메라',r'카메라|camera|\bdolly\b|달리|시점|화각'),
 ('3D',r'\b3d\b|3차원|입체|\bwebgl\b|\bgltf\b|\bthree\.js\b'),
 ('조명',r'조명|lighting|\blight source\b|spotlight|햇빛|sunlight'),
 ('재질',r'재질|\bmaterial\b|reflection|반사|transmission'),
 ('입자',r'입자|particles?|point cloud|포인트 클라우드'),
 ('애니메이션',r'애니메이션|animation|\banimated\b|\banimate\b'),
 ('접근성',r'접근성|accessibility|\baria\b|키보드|keyboard|포커스|\bfocus\b'),
 ('복사·공유',r'복사|공유|copy|clipboard|\bshare\b|sharing'),
 ('파일',r'파일|file|upload|download|업로드|다운로드'),
 ('상태',r'\bstate\b|\bstates\b|상태|\bstatus\b'),
 ('체크박스',r'체크박스|checkbox'),
 ('라디오',r'라디오|\bradio\b'),
 ('포커스',r'포커스|\bfocus\b'),
 ('터치',r'터치|\btouch\b|스와이프|\bswipe\b'),
 ('키보드',r'키보드|\bkeyboard\b'),
 ('반응형',r'반응형|\bresponsive\b'),
 ('시각적 강조',r'강조|highlight|\bemphasis\b'),
 ('색상 변화',r'색상 변화|색이 바뀌|colou?r chang'),
 ('그림자',r'그림자|\bshadow\b'),
 ('블러',r'블러|흐림|흐려|\bblur\b'),
 ('테두리',r'테두리|\bborder\b'),
 ('피드',r'피드(?!백)|\bfeed\b'),
 ('타임라인',r'타임라인|\btimeline\b'),
 ('단계',r'단계|\bsteps?\b|stepper'),
 ('유효성 검사',r'유효성|\bvalidation\b|\bvalidate\b'),
 ('자동 완성',r'자동 완성|자동완성|autocomplete'),
 ('알림 배지',r'알림 배지|\bbadge\b|배지'),
 ('아이콘',r'아이콘|\bicons?\b'),
 ('전환',r'전환|\btransition\b'),
 ('키프레임',r'키프레임|\bkeyframes?\b'),
 ('SVG',r'\bsvg\b'),
 ('무한 반복',r'무한 반복|\binfinite\b|\bloop(?:ing)?\b'),
 ('회전 운동',r'회전 운동|\bspin(?:ning)?\b|\brotate(?:s|d|ion)?\b'),
 ('타이핑',r'타이핑|\btyping\b|typewriter'),
 ('글로우',r'글로우|\bglow(?:ing)?\b'),
 ('물결',r'물결|\bripple\b|\bwaves?\b'),
 ('입력 상태',r'입력 상태|\bfocus(?:ed)?\b|\bdisabled\b|비활성'),
]

by_category={
 'UI 패턴':[
  ('버튼·행동',r'버튼|\bbutton|\bcta\b|행동|\baction\b|command'),
  ('토글·선택',r'토글|스위치|toggle|switch|select|선택|picker|checkbox|radio|rating|별점|segmented'),
  ('패널·사이드바',r'패널|사이드바|panel|sidebar|drawer|offcanvas|드로어'),
  ('마우스·커서',r'마우스|커서|포인터|cursor|pointer|mouse|magnetic|hover|호버'),
  ('입력·폼',r'입력|\bform\b|textfield|text field|\binput\b|prompt|slider|슬라이더|autocomplete|combobox'),
  ('검색·필터',r'검색|필터|search|filter'),
  ('목록·카드',r'목록|카드|\blist\b|listbox|\bcard\b|timeline|타임라인|treeview|\btree\b'),
  ('내비게이션·탭',r'내비게이션|네비게이션|navigation|\bnav\b|\btab\b|\btabs\b|메뉴|\bmenu\b|breadcrumb|페이지네이션|pagination'),
  ('모달·오버레이',r'모달|대화상자|modal|dialog|tooltip|툴팁|popover|팝오버|overlay|오버레이|lightbox'),
  ('알림·피드백',r'알림|notification|toast|토스트|alert|badge|배지|피드백|feedback|오류|error|success|성공|warning'),
  ('로딩·진행',r'로딩|스켈레톤|스피너|시머|skeleton|loading|loader|spinner|shimmer|progress|진행|타이핑|typing indicator'),
  ('대화·메시지',r'채팅|대화(?!상자)|메시지|chat|message|conversation|bubble|말풍선'),
  ('비교·평가',r'비교|compare|comparison|평가|별점|좋아요|싫어요|rating|review|thumbs|\blike\b'),
  ('파일·도구',r'파일|file|upload|download|업로드|다운로드|코드|code block|도구|\btool\b|복사|copy|clipboard|공유|\bshare\b'),
  ('접근성·키보드',r'접근성|accessibility|\baria\b|키보드|keyboard|포커스|\bfocus\b|menubar|radiogroup|spinbutton|treegrid'),
  ('데이터·표',r'데이터|\btable\b|\bgrid\b|\bchart\b|차트|\blog\b|실행 로그|사용량'),
  ('상태·진행 표시',r'상태|\bstatus\b|\bstates?\b|진행|\bprogress\b|\bsteps?\b|단계|\borb\b|구체'),
  ('아코디언·단계적 공개',r'아코디언|accordion|단계적.?공개|접기|disclosure|collaps'),
  ('설정·동의·온보딩',r'설정|setting|controls?|개인정보|privacy|동의|consent|온보딩|onboarding|\btour\b|first run|작업 계획|task plan'),
  ('안내·배너·사용량',r'안내|배너|banner|라벨|\blabel\b|사용량|한도|rate limit|측정기|\bmeter\b|토큰|token|가격|요금제|price|upgrade'),
  ('음성·미디어',r'음성|발화|오디오|녹음|\baudio\b|\bvoice\b|\bspeech\b|recorder|transcript|카메라 촬영|photo capture'),
 ],
 '화면 구성':[
  ('패널·분할 화면',r'패널|사이드바|sidebar|split|분할|drawer|offcanvas|드로어'),
  ('대시보드·관리 화면',r'대시보드|dashboard|관리|admin|\bcrm\b|지표|\banalytics\b|재고|inventory'),
  ('내비게이션·헤더·푸터',r'내비게이션|네비게이션|navigation|navbars?|header|헤더|footer|푸터|상단|하단'),
  ('그리드·목록·카드',r'그리드|grid|목록|리스트|\blist\b|카드|\bcard\b|masonry|앨범|album'),
  ('상품·쇼핑·결제',r'쇼핑|상품|구매|결제|store|shop|product|\bcheckout\b|commerce|pricing|요금제'),
  ('로그인·입력·신청',r'로그인|sign.?in|login|가입|신청|입력|\bform\b|signup|waitlist|대기 목록'),
  ('소개·랜딩·히어로',r'소개|랜딩|\blanding\b|\bhero|커버|\bcover\b|\bjumbotron\b|출시|coming.soon|웨비나|webinar'),
  ('검색·탐색',r'검색|탐색|search|browse|job board|채용'),
  ('콘텐츠·미디어',r'콘텐츠|매거진|블로그|\bblog\b|\bmedia\b|포트폴리오|portfolio|gallery|갤러리|profile|프로필'),
  ('행사·프로젝트',r'프로젝트|project|업무 보드|행사|\bevent\b|ticket|티켓'),
  ('화면 원리·가독성',r'명도|대비|contrast|아이콘|\bicon\b|선 굵기|stroke|글자 크기|line spacing|줄 간격|pixel density|화면 밀도|\bdp\b|text shrinking|wrapping|텍스트 처리'),
 ],
 '모션과 인터랙션':[
  ('버튼·클릭',r'버튼|\bbutton\b|\bclick\b|클릭|\bpress\b|\bhold\b|누르기|눌러|ripple|리플'),
  ('마우스·호버',r'마우스|커서|포인터|cursor|pointer|mouse|hover|호버|magnetic|마그네틱'),
  ('드래그·제스처',r'드래그|drag|gesture|제스처|swipe|스와이프|touch|터치|당겨서'),
  ('로딩·진행',r'로딩|loading|spinner|스피너|skeleton|스켈레톤|shimmer|시머|progress|진행'),
  ('입력·선택',r'입력|input|\bform\b|toggle|토글|switch|스위치|slider|슬라이더|selection|선택'),
  ('알림·피드백',r'알림|토스트|toast|notification|feedback|피드백|error|오류|success|성공|badge|배지'),
  ('툴팁·안내',r'툴팁|tooltip|팝오버|popover|도움말|help'),
  ('텍스트·숫자',r'텍스트|문자|글자|text|typing|숫자|number'),
  ('이미지·미디어',r'이미지|image|\baudio\b|오디오|video|비디오|미디어'),
  ('물리·시뮬레이션',r'스프링|spring|탄성|elastic|물리|physics|simulation|시뮬레이션|\bcloth\b|soft.body|flocking|군집'),
  ('검색·내비게이션',r'검색|search|\bmenu\b|메뉴|내비게이션|navigation'),
  ('확대·렌즈',r'확대|축소|\bzoom\b|magnifier|렌즈|\blens\b'),
  ('시각 효과·경로',r'테두리|\bborder\b|gradient|그라데이션|하트|\bheart\b|\blike\b|체크|checkmark|경로|\bpath\b|\bsvg\b|noise|노이즈|\bisland\b|아일랜드|장바구니|cart|포커스|\bfocus\b'),
 ],
 '화면 전환':[
  ('페이드·디졸브',r'페이드|fade|dissolve|디졸브|opacity|불투명'),
  ('슬라이드·이동',r'슬라이드|slide|\bmove\b|이동|밀기|밀어|\bpush\b|\bpull\b'),
  ('줌·크기',r'줌|zoom|확대|축소|\bscale\b'),
  ('회전·뒤집기',r'회전|rotate|rotation|flip|뒤집|curl|컬|fold|접히|unfold|경첩|hinge'),
  ('마스크·와이프',r'와이프|wipe|마스크|mask|circle|원형|portal|포털|clip|드러내'),
  ('변형·공유 요소',r'형태|변형|morph|shared|공유 요소|\bflip technique\b'),
  ('블러·빛·색상',r'흐림|블러|blur|빛|\bflash\b|\blight\b|색상|\bcolor\b'),
  ('픽셀·셰이더',r'픽셀|pixel|모자이크|glitch|글리치|shader|셰이더|불길|burn|녹이|melt|kaleidoscope|만화경|dreamy|일렁|\bwaves\b|물결|물방울|hexagonal|블라인드|blind|파편|fragment|crosshatch|교차선|tile|타일|\bnoise\b|잡음'),
  ('입체 화면 전환',r'\b3d\b|입체|\bcube\b|큐브|원근|perspective'),
  ('전환 기술·물리 효과',r'\bapi\b|탄성|\belastic\b|쓰러|\bfalling\b'),
 ],
 '카메라':[
  ('이동·달리·트럭',r'달리|dolly|트럭|truck|이동|movement|\bmove\b|이동 경계|boundary|이동 제한'),
  ('회전·오빗·팬',r'회전|orbit|오빗|\bpan\b|\btrackball\b|\barcball\b|\brotate\b|방향|up direction'),
  ('줌·화각·렌즈',r'줌|zoom|화각|\bfov\b|렌즈|\blens\b|피사계|depth of field|초점 거리'),
  ('시점·투영',r'시점|view|투영|perspective|orthographic|직교|원근|\blook\b|카메라 비교|camera comparison'),
  ('경로·스토리',r'경로|\bpath\b|스토리|story|sequence|flight|비행|드론|스크롤|scroll|기록|재생'),
  ('대상 맞춤·포커스',r'대상|초점|맞춤|맞추|\bfit\b|\bframe\b|focal|focus|target|padding|여백|bounds'),
  ('입력·제스처',r'입력|제스처|gesture|\binput\b|키보드|keyboard|마우스|mouse|드래그|drag|터치|touch|커서|cursor'),
  ('충돌·경계',r'충돌|collision|경계|boundary|제한|limits?'),
  ('촬영·노출',r'촬영|photo|\bexposure\b|노출|조리개|셔터|\biso\b|\bshake\b|흔들림'),
 ],
 '3D':[
  ('모델·뷰어',r'모델|\bmodel\b|뷰어|\bviewer\b|\bloader\b|\bgltf\b|\bcollada\b|\bsvg\b'),
  ('형상·메시·곡선',r'형상|도형|메시|\bmesh\b|geometry|곡선|\bcurve\b|spline|볼록|convex|\bcsg\b|extrud|돌출|terrain|지형|복셀|voxel'),
  ('3D 상호작용·선택',r'상호작용|interactive|\bselect\b|선택|포인터|레이캐스팅|raycast|배치|편집|editor|transform|변환 조작|회전 조작'),
  ('재질·표면',r'재질|\bmaterials?\b|surface|표면|texture|텍스처|\bsheen\b|\biridescence\b|\btransmission\b|반사|reflection|\bdispersion\b|셰이딩|shading|wireframe|와이어프레임'),
  ('조명·환경',r'조명|\blights?\b|\blighting\b|\bsky\b|하늘|태양|sunlight|\bfog\b|안개|환경'),
  ('캐릭터·애니메이션',r'캐릭터|character|skinning|키프레임|keyframe|애니메이션|animation|모프|\bmorph\b|걷기|\bwalk\b|\bik\b'),
  ('카메라·회전',r'카메라|camera|\borbit\b|오빗|모델 회전|\btrackball\b|시점'),
  ('카드·2.5D',r'카드|\bcard\b|2\.5d|pseudo.3d|홀로그램|holographic|tilt|기울기|캐러셀|carousel'),
  ('셰이더·공간 효과',r'셰이더|shader|\bwebgl\b|연기|smoke|볼류메트릭|volumetric|ray.marching|레이 마칭|파티클|입자|point cloud|포인트 클라우드'),
  ('깊이·그림자',r'깊이|depth|그림자|shadow|\bpointlight\b'),
  ('스크롤·연동',r'스크롤|\bscroll\b|scroll.driven'),
 ],
 '스크롤':[
  ('패럴랙스·깊이',r'패럴랙스|parallax|깊이|\bdepth\b'),
  ('고정·스티키',r'고정|\bsticky\b|\bpinned?\b|\bfixed\b'),
  ('가로·스냅·관성',r'가로|수평|horizontal|\bsnap\b|스냅|관성|inertia|smooth'),
  ('등장·순차',r'등장|reveal|\bstagger\b|순차|fly.in|fly.out|퇴장'),
  ('진행·내비게이션',r'진행|progress|\bscrollspy\b|내비게이션|navigation|읽기|reading'),
  ('이미지·미디어',r'이미지|image|사진|photo|media|미디어|video|비디오|sequence|시퀀스'),
  ('텍스트·타이포',r'텍스트|문자|타이포|\btext\b|typograph|\bword\b'),
  ('스토리·연동',r'스토리|story|scrollytelling|\bscrub\b|타임라인|timeline|연동|scroll.driven|scroll.trigger|trigger'),
  ('패널·카드',r'패널|panel|카드|\bcard\b|\bgrid\b|그리드|columns?|열 스크롤|목록|\blist\b'),
  ('그래픽·변형',r'기울기|skew|와이프|wipe|\bsvg\b|\bpath\b|경로|선 그리기|line draw|숫자|counter|헤더|header'),
 ],
 '등장과 퇴장':[
  ('페이드·블러',r'페이드|fade|흐림|흐려|\bblur\b|\bpuff\b|vanish'),
  ('슬라이드·이동',r'슬라이드|밀어|\bslide\b|\bmove\b|이동|spacein|spaceout|\btin\b|tinup|tindown|\broll\b|rollin|rollout|굴러'),
  ('확대·축소',r'확대|축소|\bscale\b|\bzoom\b|\bswap\b'),
  ('회전·뒤집기',r'회전|뒤집|\bflip\b|\brotate\b|twister|foolish|perspective|원근|경첩|\bopen\b'),
  ('탄성·튀기',r'탄성|\bbounce\b|\bspring\b|elastic|swash|boing|진동|\btin\b|tinup|tindown|\bwobble\b|튀어나|jackinthebox'),
  ('마스크·드러내기',r'마스크|mask|clip|클립|커튼|curtain|reveal|드러내|잉크|ink|\bhole\b|구멍'),
  ('텍스트·순차',r'텍스트|글자|단어|문자|\btext\b|letter|\bword\b|\bstagger\b|순차'),
  ('분해·특수 효과',r'분해|분산|산산|shatter|bomb|폭발|특수|\bmagic\b'),
 ],
 '타이포그래피':[
  ('등장·퇴장·순차',r'등장|퇴장|enter|\bexit\b|reveal|\bstagger\b|순차|드러내'),
  ('타이핑·문자 변화',r'타자|타이핑|typing|typewriter|scramble|스크램블|글자별|문자별|\bcharacter\b|\bletter\b'),
  ('움직임·경로',r'움직|모션|kinetic|\bpath\b|경로|회전|\borbit\b|궤도|marquee|마퀴|ticker|티커|\bwave\b|물결|\bfalling\b|떨어|\bswing\b|swinging|흔들|진자|\bheartbeat\b|pulse|박동|\bfold\b|접히|도미노|domino'),
  ('변형·가변 글꼴',r'변형|morph|variable|가변|글꼴|\bfont\b|rubber|탄성|stretch'),
  ('색상·채우기',r'색상|\bcolor\b|gradient|그라데이션|\bfill\b|채우기|형광|highlight|강조|스캐너|scanner|열지도|thermal'),
  ('질감·재질',r'질감|재질|metal|금속|chrome|유리|glass|금박|gold|neon|네온|hologram|홀로그램|\bfoil\b|반사|reflection|그림자|shadow'),
  ('글리치·픽셀',r'글리치|glitch|픽셀|pixel|분할|sliced|\bprism\b|프리즘|분리|anaglyph|반전|negative'),
  ('입체·입자',r'\b3d\b|입체|\bextrud|돌출|particles?|입자|깊이'),
  ('드로잉·손글씨',r'손글씨|handwriting|\bdraw\b|그리기'),
  ('시각 스타일·패턴',r'메아리|\becho\b|만화|\bcomic\b|\bpop art\b|스포트라이트|spotlight|ransom|조합|녹아|melting|청사진|blueprint|회로|circuit|등고선|contour|연기|\bsmoke\b|서리|\bfrozen\b|\bice\b|모아레|moir|\bpattern\b|\bled\b|전광판|이퀄라이저|equalizer'),
 ],
 '배경과 분위기':[
  ('그라데이션·색상',r'그라데이션|gradient|색상|\bcolor\b|\baurora\b|오로라|\bplasma\b|플라스마'),
  ('입자·점·별',r'입자|particles?|\bdots?\b|\bpoints?\b|별|starfield|constellation|별자리|\bgpgpu\b'),
  ('물·유체·파동',r'물결|물방울|\bwater\b|\bwave\b|\bwaves\b|유체|\bfluid\b|\bliquid\b|액체|ripple|파문|\bblob\b'),
  ('빛·불꽃',r'빛|\blight\b|\bglow\b|\bfire\b|불꽃|fireworks|번개|lightning|\brays\b'),
  ('날씨·자연',r'눈|비|\bsnow\b|\brain\b|\bclouds?\b|구름|하늘|\bsky\b|\bfog\b|안개|\bbirds\b|새 떼|우주|\bspace\b'),
  ('노이즈·필름·글리치',r'노이즈|\bnoise\b|grain|그레인|필름|\bfilm\b|scanline|스캔라인|glitch|글리치|\bascii\b|아스키|하프톤|halftone'),
  ('패턴·격자·선',r'격자|\bgrid\b|\bpattern\b|패턴|\blines?\b|등고선|topographic|연결망|\bnet\b|\bcells\b|매트릭스|matrix'),
  ('3D·셰이더',r'\b3d\b|입체|\bwebgl\b|shader|셰이더|\bglobe\b|지구|\brings\b|고리'),
  ('기하·추상 패턴',r'기하|geometric|추상|abstract|떠다니|floating|흐름장|flow field|생명 게임|game of life|줄기|\btrunk\b|가지'),
  ('시각 효과·사진',r'색수차|chromatic|\bglassmorphism\b|글래스모피즘|켄 번스|ken burns|톤 매핑|tonemapping|\bexposure\b|노출'),
 ],
}

def patterns(rules):
    return [(label,re.compile(pattern,re.IGNORECASE)) for label,pattern in rules]
tag_rules=patterns(common)
facet_rules={cat:patterns(rules) for cat,rules in by_category.items()}
data={};unclassified=collections.defaultdict(list)
for id,e in examples.items():
    existing=[str(t).strip() for t in (e.get('tags') or []) if str(t).strip()]
    # Descriptions are original or curated explanations of each example, so
    # they can reveal functions and motion omitted from a short title.
    core=[e.get('name',''),e.get('english',''),*existing,e.get('sourceUrl','').rsplit('/',1)[-1]]
    facet_evidence=' '.join(str(x) for x in core)
    evidence=' '.join([facet_evidence,str(e.get('description','')),str(e.get('taxonomyText',''))])
    category=e.get('category','')
    facets=[label for label,regex in facet_rules.get(category,[]) if regex.search(facet_evidence)]
    if not facets:
        facets=['세부 분류 검토']
        unclassified[category].append(f"{id}: {e.get('name')} / {e.get('english','')}")
    generated=[label for label,regex in tag_rules if regex.search(evidence)]
    # A 3D format loader loads an asset; it does not by itself demonstrate a loading indicator.
    if category in ('3D','카메라') and '로딩' in generated and not re.search(r'스켈레톤|스피너|시머|skeleton|spinner|shimmer|loading indicator|로딩 상태',evidence,re.I):
        generated.remove('로딩')
    # Purpose-first tags make frequently searched uses visible in the panel.
    all_tags=[]
    for tag in generated+existing:
        if tag.casefold() not in {x.casefold() for x in all_tags} and tag!=category:
            all_tags.append(tag)
    if not all_tags:
        all_tags=[str(e.get('name') or e.get('english') or '분류 검토')]
    related={}
    if category=='모션과 인터랙션':
        relevant={'버튼·행동','토글·선택','패널·사이드바','마우스·커서','입력·폼','검색·필터','목록·카드','내비게이션·탭','모달·오버레이','알림·피드백','로딩·진행','대화·메시지','비교·평가','파일·도구','접근성·키보드','아코디언·단계적 공개'}
        ui_facets=[label for label,regex in facet_rules['UI 패턴'] if label in relevant and regex.search(facet_evidence)]
        if ui_facets:related['UI 패턴']=ui_facets
    if category=='UI 패턴' and e.get('sourceName')=='Movin':
        # This collection consists of animated interface components. Relate
        # only matching interaction facets, based on source type and wording.
        motion_facets=[label for label,regex in facet_rules['모션과 인터랙션'] if regex.search(facet_evidence)]
        if motion_facets:related['모션과 인터랙션']=motion_facets
    data[id]={'subcategories':facets,'tags':all_tags,'related':related,'needsReview':facets==['세부 분류 검토']}

out=root/'taxonomy.json'
out.write_text(json.dumps({'version':2,'method':'항목명·영문명·예시 설명·기존 태그·원본 파일명을 기준으로 생성한 다중 분류. 자동 분류는 원문과 대조가 필요하며 의미가 불명확한 항목은 검토 대상으로 둡니다.','items':data},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('entries',len(data),'without_tags',sum(not v['tags'] for v in data.values()),'unclassified',sum(map(len,unclassified.values())))
for cat,items in unclassified.items():
 print('\n'+cat, len(items))
 for v in items:print('  '+v)
