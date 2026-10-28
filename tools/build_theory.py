"""Curated UI/UX knowledge map compiled from this project's research notes.

This is an editorial classification, not a claim that the categories form a
universal academic standard. Each concept retains references and relation
notes, while unavailable course material remains explicitly unavailable.
"""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parent.parent
S={
 'uswds':('USWDS · 설계 원칙','https://designsystem.digital.gov/design-principles/'),
 'iaref':('NN/g · 정보 구조와 사이트맵','https://www.nngroup.com/articles/information-architecture-sitemaps/'),
 'snapref':('Ohio State · 영화 촬영과 스냅 줌','https://ohiostate.pressbooks.pub/introfilm/chapter/cinematography-ii/'),
 'geometry':('Three.js · 형상','https://threejs.org/docs/pages/BufferGeometry.html'),
 'material':('Three.js · 재질','https://threejs.org/docs/pages/Material.html'),
 'lighting':('Three.js · 조명','https://threejs.org/docs/pages/Light.html'),
 'apple':('Apple HIG · 레이아웃','https://developer.apple.com/design/human-interface-guidelines/layout'),
 'android':('Android · 적응형 레이아웃','https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout'),
 'androidnav':('Android · 레이아웃과 탐색','https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns'),
 'wcag':('W3C · 접근성 원칙','https://www.w3.org/WAI/standards-guidelines/wcag/glance/'),
 'apg':('W3C · 접근 가능한 패턴','https://www.w3.org/WAI/ARIA/apg/'),
 'apgkey':('W3C · 키보드 인터페이스','https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/'),
 'toss':('토스 · 앱인토스 UX 가이드','https://developers-apps-in-toss.toss.im/design/consumer-ux-guide'),
 'tds':('토스 · TDS 컴포넌트','https://developers-apps-in-toss.toss.im/design/components'),
 'nng':('NN/g · 사용성 휴리스틱','https://www.nngroup.com/articles/ten-usability-heuristics/'),
 'journey':('NN/g · 여정과 흐름','https://www.nngroup.com/articles/user-journeys-vs-user-flows/'),
 'dashboard':('Dashboard Design Patterns','https://dashboarddesignpatterns.github.io/patterns.html'),
 'motion':('Apple HIG · 모션','https://developer.apple.com/design/human-interface-guidelines/motion'),
 'reduce':('MDN · 움직임 줄이기','https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion'),
 'easing':('MDN · 이징 함수','https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function'),
 'grid':('USWDS · 그리드','https://designsystem.digital.gov/components/grid/'),
 'accordion':('USWDS · 아코디언','https://designsystem.digital.gov/components/accordion/'),
 'modal':('USWDS · 모달','https://designsystem.digital.gov/components/modal/'),
 'side':('USWDS · 사이드 내비게이션','https://designsystem.digital.gov/components/side-navigation/'),
 'table':('USWDS · 표','https://designsystem.digital.gov/components/table/'),
 'step':('USWDS · 단계 표시기','https://designsystem.digital.gov/components/step-indicator/'),
 'search':('USWDS · 검색','https://designsystem.digital.gov/components/search/'),
 'summary':('USWDS · 요약 상자','https://designsystem.digital.gov/components/summary-box/'),
 'camera':('Three.js · 카메라','https://threejs.org/docs/#api/en/cameras/PerspectiveCamera'),
 'controls':('Three.js · OrbitControls','https://threejs.org/docs/#examples/en/controls/OrbitControls'),
 'css':('MDN · CSS 애니메이션','https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations'),
 'transitions':('GL Transitions · 원본','https://github.com/gl-transitions/gl-transitions'),
 'motionex':('Motion · 실제 예시','https://motion.dev/examples'),
 'base01':('디자인베이스 · UX/UI 입문','https://www.youtube.com/watch?v=VVd5uGGlBe0'),
 'base02':('디자인베이스 · 학습 방법','https://www.youtube.com/watch?v=qGf577jPglY'),
 'base03':('디자인베이스 · 디자인 도구','https://www.youtube.com/watch?v=ypX-KX0Uc2Q'),
 'base04':('디자인베이스 · 앱과 웹','https://www.youtube.com/watch?v=6YB318tbLNA'),
 'base05':('디자인베이스 · Android와 iOS','https://www.youtube.com/watch?v=JJwEXAjumLY'),
 'base06':('디자인베이스 · 제품과 PMF','https://www.youtube.com/watch?v=v9hu-W0AVTg'),
 'base07':('디자인베이스 · UI 기초','https://www.youtube.com/watch?v=vnx0I0DbH84'),
 'base08':('디자인베이스 · 그리드','https://www.youtube.com/watch?v=4aF_IQJeFpg'),
 'base09':('디자인베이스 · 색상','https://www.youtube.com/watch?v=TD4wchFyx_Q'),
 'base10':('디자인베이스 · 아이콘','https://www.youtube.com/watch?v=LGB-XI8aGVg'),
 'base11':('디자인베이스 · 타이포그래피','https://www.youtube.com/watch?v=iKaK2sAkKW8'),
 'base17':('디자인베이스 · Android 이해','https://www.youtube.com/watch?v=hPQ8fg1K3kE'),
 'base18':('디자인베이스 · 화면 밀도와 단위','https://www.youtube.com/watch?v=0TGVFr10mL0'),
 'base30':('디자인베이스 · iOS 텍스트 축소','https://www.youtube.com/watch?v=JIHf1lVjh_w'),
 'base35':('디자인베이스 · UX의 맥락','https://www.youtube.com/watch?v=Y9ZUm4ygRlY'),
 'base36':('디자인베이스 · 문제의 본질','https://www.youtube.com/watch?v=8ZYFveFmCHM'),
 'base37':('디자인베이스 · 타깃 이해','https://www.youtube.com/watch?v=GMHlt6tmrEc'),
 'base52':('디자인베이스 · 상품 상세 개선','https://www.youtube.com/watch?v=rQk9QUU-1gs'),
 'layoutvid':('MJ-DESIGN · 레이아웃','https://www.youtube.com/watch?v=F9wmzr0coQ8'),
 'appvid':('독립D · 앱 UX/UI 원칙','https://www.youtube.com/watch?v=dHsNQPmgVpw'),
 'vocab':('코드깎는노인 · UI 용어','https://www.youtube.com/watch?v=mlhKEy-2bgI'),
 'pixiv':('Pixiv · 검색 방법','https://www.pixiv.help/hc/en-us/articles/235646387-I-would-like-to-know-how-to-search-for-content-on-pixiv'),
 'algolia':('Algolia · 검색 패싯','https://docsearch.algolia.com/docs/packages/react/api-reference/'),
 'windows':('Microsoft · 데스크톱 설계','https://learn.microsoft.com/en-us/windows/apps/design/guidelines-overview'),
 'density':('Android · 화면 밀도','https://developer.android.com/training/multiscreen/screendensities'),
 'type':('Apple HIG · 타이포그래피','https://developer.apple.com/design/human-interface-guidelines/typography'),
}

sections=[]
def section(id,title,question,intro):
 d={'id':id,'title':title,'question':question,'intro':intro,'items':[]};sections.append(d);return d
def add(section,id,title,english,kind,meaning,application,caution,refs,aliases='',relations='',example=''):
 section['items'].append(dict(id=id,title=title,english=english,kind=kind,meaning=meaning,application=application,caution=caution,refs=refs.split(),aliases=aliases,relations=relations,example=example))

a=section('foundations','경험 설계의 기초','무엇을, 누구를 위해 설계하는가?','UX를 결과와 과정의 관점으로, UI를 사람이 보고 다루는 접점으로 구분한다. 아래 체계는 이 프로젝트에서 연구와 판단을 연결하기 위해 만든 분류다.')
add(a,'ux-ui','사용자 경험과 인터페이스','UX / UI','기본 개념','UX는 사람이 서비스와 상호작용하며 겪는 경험 전반이고, UI는 그 상호작용이 일어나는 화면·입력·출력 등의 접점이다.','사용자의 목표와 상황을 먼저 적고, 그 목표를 화면의 정보·행동·상태로 번역한다.','UI의 완성도만으로 전체 경험을 판단할 수 없다. UX와 UI는 서로 다른 범위지만 분리된 작업은 아니다.','base01 base35 uswds',relations='범위 중첩: UI는 UX에 영향을 주는 접점이다.')
add(a,'design-tech','설계와 구현 기술','Design intent / implementation','구조','설계는 어떤 사용자에게 어떤 정보와 행동을 어떤 순서로 제공할지 정하는 일이고, 기술은 그것을 구현하는 수단이다.','예: 3D 모델을 보며 결과를 비교하는 목적 → 목록·뷰어·필터의 조합 → 패널, 카메라, 애니메이션 코드.','버튼 효과나 라이브러리의 선택만으로 과업 구조가 결정되지는 않는다.','base35 uswds',relations='상위·하위: 인터랙션 설계는 모션·상태·컴포넌트 구현과 연결된다.')
add(a,'context','사용 맥락과 제약','Context of use','관점','같은 기능도 사용자 숙련도, 과업, 주변 환경, 기기, 입력 방식에 따라 사용 경험이 달라진다.','사용자·목표·장소·기기·작업 중단 가능성·실패 비용을 함께 기록하고 설계의 전제로 삼는다.','모든 사용자에게 통하는 하나의 레이아웃이나 단일 정답을 가정하지 않는다.','base35 base37 uswds wcag')
add(a,'constraints','접근성·성능·신뢰','Cross-cutting constraints','횡단 원칙','접근성, 반응 속도, 개인정보, 오류 복구와 신뢰는 특정 화면 하나가 아니라 전체 경험을 가로지르는 조건이다.','초기 설계부터 키보드·보조 기술·저성능 기기·민감한 정보의 취급을 검토하고 구현 후 관찰한다.','보기 좋은 화면이나 개별 컴포넌트의 통과만으로 서비스 전체가 접근 가능하다고 단정하지 않는다.','uswds wcag toss',relations='범위 중첩: 접근성은 사용성에 포함되는 문제와 독립적인 요구를 함께 가진다.')
add(a,'learning','사례 분석과 학습','Reference analysis / learning','방법','디자인 사례와 도구를 볼 때 화면의 겉모습뿐 아니라 문제, 사용자, 정보 구성과 실제 동작을 분석한다.','참고 화면에서 어떤 정보가 강조되고 어떤 입력과 피드백이 일어나는지 기록한 뒤 다른 맥락에서도 검증한다.','한 사례의 선택을 모든 제품에 그대로 복제할 보편 규칙으로 취급하지 않는다.','base02 base07 appvid')

a=section('research','사용자와 문제 정의','무엇이 중요하며 어떻게 알 수 있는가?','사용자의 말과 실제 행동, 조직의 목표, 기술 제약을 함께 살핀다. 중요도는 보편적인 면적 공식이 아니라 근거를 가지고 조정할 판단이다.')
add(a,'users','사용자·타깃·관계자','Users / target audience / stakeholders','연구','사용자, 구매 결정자, 운영자와 영향을 받는 사람은 서로 다를 수 있다. 타깃은 특정 맥락에서 제품이 우선 지원할 사람들이다.','각 집단의 목표·기대·지식·제약을 적고 관찰이나 인터뷰로 실제 차이를 확인한다.','인구통계만으로 사용자의 목적과 능력을 결정하지 않는다.','base37 uswds')
add(a,'problem','문제와 가치 제안','Problem framing / value proposition','연구','표면에 드러난 요청에서 해결할 문제와 사용자에게 중요한 가치를 분리한다.','‘패널을 좁혀 달라’는 요청 뒤에서 모델의 가림, 비교의 어려움, 조작 빈도와 실패 위험을 확인한다.','솔루션을 문제로 단정하거나 비타민·진통제 같은 비유를 정량적 사실로 취급하지 않는다.','base36 base35')
add(a,'product-fit','제품 과정과 문제 적합성','Product lifecycle / product-market fit','제품 관점','제품은 문제를 파악하고 가설을 만들며 구현·출시·관찰을 반복한다. PMF는 제품이 특정 시장의 필요와 맞는지를 살피는 관점이다.','사용자 문제와 가치 가설을 분리하고 사용·반복 사용·피드백 등 실제 근거로 가정을 점검한다.','예쁜 UI나 단일 지표만으로 시장 적합성을 확정하지 않는다.','base06 base36')
add(a,'research-method','인터뷰·관찰·사용성 조사','User research / observation','방법','인터뷰는 생각과 경험을, 과업 관찰은 실제 행동과 어려움을 알아보는 방법이다.','가설과 조사 질문을 분리하고 대표 과업을 수행하게 한 뒤 실수·막힘·설명을 함께 기록한다.','소수 관찰 결과를 전체 사용자에 대한 확정적 통계처럼 해석하지 않는다.','uswds nng base37')
add(a,'journey','사용자 여정','User journey','모형','사용자가 목표를 위해 서비스 안팎에서 겪는 단계, 접점, 감정과 문제를 시간의 흐름으로 표현한다.','서비스를 발견하고 정보를 확인한 뒤 결과를 활용하기까지 여러 접점과 담당자를 그린다.','여정은 화면 전환 도면과 동일하지 않다. 실제 행동을 조사하지 않은 여정은 가설이다.','journey',relations='범위 중첩: 사용자 흐름은 여정의 일부 과업과 화면 경로를 더 구체적으로 나타낸다.')
add(a,'flow','사용자 흐름과 과업','User flow / task flow','모형','목표 달성을 위해 거치는 행동, 화면, 분기와 실패·복구 경로를 나타낸다.','결과 선택 → 3D 확인 → 세부 속성 조회 → 비교·내보내기의 분기와 되돌아가기를 그린다.','정상 흐름만 그리면 권한 부족, 빈 상태, 취소 및 오류 경로가 빠진다.','journey nng',relations='중복 표기: 작업 흐름·사용자 흐름은 문맥에 따라 겹친다. 여정과는 범위가 다르다.')
add(a,'priority','중요도와 우선순위','Prioritization','판단','정보와 행동의 우선순위는 사용자 목표, 수행 빈도, 긴급성, 실패 비용, 의존 관계와 비교 필요성을 함께 고려한 판단이다.','주 작업과 보조 작업을 목록화하고 실제 시나리오별 빈도·위험·동시 사용을 비교해 우선순위 가설을 만든다.','중앙에 두거나 면적을 크게 잡는 것만으로 중요도가 자동 산정되지는 않는다.','base35 base52 apple',relations='관련: 정보 우선순위는 시각적 위계의 입력이며 두 개념은 동일하지 않다.')

a=section('architecture','정보 구조와 탐색','어떤 개념을 어떻게 묶고 찾게 할 것인가?','내용의 의미와 관계를 조직하는 정보 구조와, 실제로 그 구조를 이동·검색하는 탐색 체계를 나누어 본다.')
add(a,'ia','정보 구조','Information architecture','설계','콘텐츠와 기능을 의미에 따라 분류하고 관계, 명칭, 경로를 정하는 구조다.','사용자가 아는 용어와 실제 과업을 기준으로 주제·세부 주제·상태를 정리하고 서로 연결한다.','사이트 메뉴의 모양만 바꾸는 것은 정보 구조의 전체 작업이 아니다.','iaref uswds')
add(a,'grouping','그룹화와 근접성','Grouping / proximity','원리','관련 정보와 행동을 공간·제목·테두리·정렬 등으로 묶어 관계를 드러낸다.','단계 설명과 결과 목록처럼 역할이 다른 패널은 제목·구조·위계로 차이를 드러내고 관련된 조작은 가까이 둔다.','가깝게 배치했다고 해서 실제 의미 관계가 성립하는 것은 아니다.','apple layoutvid base52',relations='범위 중첩: 근접성은 그룹화를 만드는 여러 시각적 수단 중 하나다.')
add(a,'labeling','명칭과 용어','Labels / terminology','설계','사용자가 보게 되는 범주·메뉴·버튼·상태의 이름을 이해하기 쉬운 언어로 정하는 일이다.','같은 대상을 일관된 이름으로 부르고 익숙한 한국어·영어 별칭을 검색에 연결한다.','내부 조직의 용어를 모든 사용자가 이해한다고 가정하지 않는다.','uswds toss nng')
add(a,'navigation','내비게이션','Navigation / wayfinding','설계','사용자가 현재 위치를 파악하고 다른 영역으로 이동하며 돌아올 수 있게 하는 구조다.','정보 구조와 화면 크기, 이동 빈도를 보고 상단 탐색·사이드바·탭바를 선택한다.','위치 표시와 뒤로 가기가 없으면 화면이 깔끔해도 길을 잃기 쉽다.','side androidnav toss',example='내비게이션')
add(a,'search','검색과 자동완성','Search / autocomplete','기능','이름·태그·내용을 단서로 원하는 항목을 찾고 후보를 제시하는 기능이다.','정확한 명칭을 아는 사람에게 즉시 찾기를 제공하고 후보의 종류와 결과 수를 표시한다.','자동완성 후보의 선택이 어떤 필터를 적용하는지 분명해야 한다.','search pixiv',example='검색')
add(a,'facets','태그와 패싯 검색','Tags / faceted search','기능','태그는 항목의 속성이나 주제를 나타내고, 패싯은 여러 속성 축으로 결과를 좁히는 탐색 방식이다.','기능·형태·동작·분위기를 나눠 고르고 포함·제외 및 AND/OR의 의미를 보여준다.','태그 분류는 사실 근거에 따라야 하며, 값의 부재를 해당 속성의 부정으로 취급하지 않는다.','algolia pixiv',relations='범위 중첩: 태그는 데이터의 표기이고 패싯은 그 값을 활용하는 탐색 구조다.')
add(a,'disclosure','단계적 공개','Progressive disclosure','원리','먼저 필요한 정보를 보여 주고 나머지는 상황에 맞게 추가로 드러내는 방법이다.','기본 결과는 화면에 유지하고 드문 고급 설정은 접거나 별도 영역에서 연다.','동시에 비교해야 하거나 오류를 판단하는 필수 정보까지 숨기면 오히려 탐색 비용이 늘어난다.','apple dashboard',aliases='점진적 공개 · progressive disclosure',relations='동의어: 단계적 공개와 점진적 공개는 같은 개념의 번역이다. 아코디언은 그 구현 패턴 중 하나다.',example='아코디언')

a=section('screen','화면 구성과 정보 위계','한 화면에서 무엇이 얼마나 보여야 하는가?','화면의 구성을 텍스트 수, 글꼴·크기, 영역의 폭과 높이, 여백, 색, 도구와 상태까지 함께 다룬다.')
add(a,'workspace','작업 공간과 영역 배분','Workspace allocation','화면 설계','주 작업 영역과 내비게이션·상세 정보·도구·결과의 역할과 공간을 함께 설계한다.','3D 뷰어에 좌우 패널과 하단 바가 겹친다면 각 영역의 필요 시점·최소 너비·동시 비교 여부를 먼저 측정한다.','큰 영역이 항상 가장 중요하다는 규칙은 없다. 작은 경고나 필수 상태도 중요할 수 있다.','dashboard apple base52',example='사이드바')
add(a,'visual-hierarchy','시각적 위계','Visual hierarchy','시각 원리','크기·두께·위치·대비·간격·색·형태를 조합해 무엇을 먼저 보고 어떻게 구분할지 표현한다.','우선순위가 높은 제목과 행동을 보조 설명과 다르게 표현하고 실제 화면에서 시선을 확인한다.','가운데 위치나 큰 크기가 언제나 중요성을 보장하지 않으며 언어의 읽기 방향과 과업에 따라 달라진다.','apple layoutvid base52',relations='관련: 정보 우선순위는 판단의 근거이고 시각적 위계는 그 판단을 표현하는 수단이다.')
add(a,'density','정보 밀도','Information density','화면 설계','주어진 공간에 표시되는 정보의 양과 그 정보가 이해·비교에 미치는 부담을 다룬다.','텍스트 길이, 목록 행 수, 글꼴 크기, 패널 수, 공백과 비교에 필요한 정보를 함께 조정한다.','밀도를 낮추는 것이 항상 좋지는 않다. 숙련자의 비교 작업에서는 충분한 정보가 동시에 필요할 수 있다.','dashboard base52',relations='범위 중첩: 밀도와 인지 부담은 관련되지만 한 값으로 같게 계산할 수 없다.')
add(a,'grid','그리드·여백·정렬','Grid / spacing / alignment','화면 구조','컬럼, 거터, 마진과 정렬선은 화면 요소의 관계와 배치를 유지하는 기준이다.','같은 내용을 여러 열과 여백으로 배치해 읽기·비교·조작 영역이 적절한지 살핀다.','그리드 숫자나 일정한 공백 자체가 사용성을 보장하지 않는다.','grid base08 layoutvid apple',example='그리드')
add(a,'responsive','반응형·적응형 레이아웃','Responsive / adaptive layout','화면 구조','이용 가능한 창의 크기와 환경이 바뀔 때 콘텐츠와 탐색 구조를 재배치하거나 다른 구성을 제공한다.','넓은 창에서는 목록과 상세를 나란히 두고 좁은 창에서는 전환하거나 단계적으로 제공한다.','휴대전화 여부만으로 실제 창의 크기와 입력 방식을 알 수 없다. 축소 모의만으로 실제 기기 사용성을 확정하지 않는다.','android apple',relations='범위 중첩: 반응형과 적응형은 접근법이 겹치지만 모든 구현에서 같은 뜻은 아니다.',example='반응형')
add(a,'master-detail','목록과 상세·분할 화면','List-detail / split view','패턴','목록에서 선택한 대상과 그 상세를 분리하거나 나란히 보여 주는 화면 구조다.','대상을 반복 비교해야 할 때는 함께 보여 주고 좁은 창에서는 선택과 상세를 오갈 수 있게 한다.','비교 맥락을 잃거나 선택 상태가 가려지지 않도록 한다.','android dashboard',relations='범위 중첩: 분할 화면은 여러 영역을 나누는 넓은 개념이고 목록·상세는 그중 한 용도다.',example='분할')
add(a,'sidebar','사이드바와 보조 패널','Sidebar / side panel','패턴','화면 가장자리에 내비게이션, 작업 단계, 속성 또는 결과를 배치하는 구성이다.','왼쪽이 단계, 오른쪽이 결과라면 역할을 명시하고 너비·시각 스타일·접기 가능성을 과업에 맞게 구분한다.','모든 사이드바가 내비게이션은 아니다. 양쪽을 늘 고정하면 주 작업 공간이 줄어든다.','side dashboard',relations='범위 중첩: 사이드 내비게이션은 사이드바의 한 용도이고 드로어는 나타나는 방식의 한 패턴이다.',example='사이드바')
add(a,'layout-patterns','히어로·카드·벤토·스티키','Hero / card / bento / sticky','화면 패턴','히어로는 첫 화면의 주제와 행동을 강조하고, 카드와 벤토는 콘텐츠를 묶어 배치하며, 스티키는 스크롤 중 요소를 특정 위치에 유지한다.','정보의 중요도와 비교 관계에 따라 각각의 영역과 크기를 정하고 스티키 요소가 본문을 가리는지 확인한다.','벤토는 고정된 장식 템플릿이 아니며 큰 히어로가 모든 업무 화면에 적절한 것도 아니다.','vocab apple',relations='중복 아님: 카드는 내용의 묶음, 벤토는 여러 영역의 배치, 스티키는 스크롤 중 위치 동작이다.',example='카드')

a=section('visual','시각 언어와 콘텐츠','읽고 구분하고 신뢰할 수 있게 보이는가?','서체, 문장, 색, 아이콘, 이미지와 일관성은 장식만이 아니라 정보와 행동의 의미를 전달한다.')
add(a,'typography','타이포그래피와 가독성','Typography / readability','시각 설계','글꼴, 크기, 굵기, 행간, 줄 길이와 정렬을 통해 글의 성격과 읽기 위계를 만든다.','제목·보조 정보·본문의 차이를 정하고 실제 한글 길이와 확대 상태에서 줄바꿈을 확인한다.','글자를 작게 하거나 무조건 줄여 공간을 확보하면 읽기와 접근성을 해칠 수 있다.','type appvid base11')
add(a,'contrast','색상·대비·의미','Color / contrast','시각 설계','색과 명도 대비는 정보 구분과 강조를 돕지만 색만이 의미를 전달해서는 안 된다.','상태에 색과 함께 텍스트·아이콘을 제공하고 배경, 테마, 실제 기기와 확대 상태에서 확인한다.','브랜드 색이 예쁘다는 이유만으로 텍스트 대비를 충분하다고 가정하지 않는다.','wcag toss appvid base09')
add(a,'icons','아이콘과 시각적 표지','Icons / visual cues','시각 설계','아이콘은 행동이나 대상을 압축해 표현하는 표지이며 크기·선 굵기·정렬의 일관성이 필요하다.','의미가 모호한 아이콘은 텍스트 또는 접근 가능한 이름을 함께 제공하고 상태와 클릭 영역을 살핀다.','익숙하지 않은 아이콘을 보편적으로 이해한다고 가정하지 않는다.','appvid wcag toss base10')
add(a,'writing','UX 라이팅과 콘텐츠','UX writing / content','콘텐츠','사용자가 현재 상태와 다음 행동을 이해하도록 버튼, 안내, 오류와 설명을 작성한다.','버튼 이름에 실제 결과를 담고 오류에는 무엇이 잘못됐는지와 복구 방법을 제시한다.','짧게 쓰는 것보다 명확한 것이 우선이며 특정 문체 규칙은 해당 플랫폼의 적용 범위를 확인한다.','toss uswds')
add(a,'consistency','일관성과 디자인 토큰','Consistency / design tokens','시스템','반복되는 간격·색·글자·컴포넌트의 규칙을 공유해 관계와 예측 가능성을 높인다.','비슷한 역할은 비슷하게 표현하되 단계 패널과 결과 패널처럼 다른 역할은 알아볼 수 있게 구분한다.','겉모양이 같다고 역할이 같은 것은 아니며 일관성은 모든 화면을 똑같이 만드는 뜻이 아니다.','uswds tds')

a=section('interaction','행동·상태·피드백','사용자가 행동하면 무엇이 달라지는가?','인터랙션은 입력, 시스템 상태 변화, 사용자에게 보이는 피드백과 다음 행동까지 포함한다.')
add(a,'states','상태와 피드백','States / feedback','인터랙션','기본·호버·포커스·선택·진행·성공·오류·비활성 등의 상태와 그 변화를 명확히 전달한다.','좋아요를 누르면 선택 여부와 수치의 변화를 보여 주고 실패 시 이전 상태와 재시도를 제공한다.','색이나 애니메이션만으로 성공·오류를 전달하지 않는다.','nng wcag',example='피드백')
add(a,'buttons','버튼·행동','Buttons / actions','패턴','버튼은 사용자가 명시적으로 행동을 실행하는 조작 요소다.','중요 행동과 보조 행동의 위계, 명칭, 활성·비활성 이유와 실행 결과를 함께 정한다.','단순한 모션은 행동의 의미와 결과를 대신하지 못한다.','apg toss',example='버튼')
add(a,'selection','선택·토글·입력','Selection / toggle / form','패턴','옵션 선택, 설정 변경과 입력은 서로 다른 상태와 확인 방식이 필요한 조작이다.','즉시 켜고 끄는 설정은 스위치, 여러 항목 선택은 체크박스, 상호 배타적 선택은 라디오 등 맥락에 맞춰 검토한다.','겉모양이 유사해도 실제 상태, 키보드 동작, 저장 시점이 다를 수 있다.','apg tds',example='토글')
add(a,'tabs','탭과 세그먼트','Tabs / segmented control','패턴','탭은 같은 수준의 관련 콘텐츠 사이를 전환하고, 세그먼트 컨트롤은 상황에 따라 보기나 옵션을 전환한다.','서로 다른 영역을 자주 오갈 때 선택 상태와 현재 내용을 연결하고 키보드 조작을 제공한다.','정보를 동시에 비교해야 할 때 모든 내용을 탭 뒤에 나누면 비교가 어려워질 수 있다.','apg androidnav',relations='범위 중첩: 탭과 세그먼트는 유사한 형태를 쓰지만 콘텐츠 탐색과 값 선택의 역할이 다를 수 있다.',example='탭')
add(a,'menus','드롭다운·메뉴·콤보박스','Dropdown / menu / combobox','패턴','드롭다운은 펼쳐지는 표현을 가리키는 넓은 말이며, 메뉴와 콤보박스는 각각 행동 선택과 값 입력·선택 같은 역할을 가진다.','무엇을 실행하거나 어떤 값을 고르는지 먼저 정하고 열림, 포커스와 키보드 동작을 설계한다.','화살표가 달린 모든 상자를 같은 접근성 역할로 만들지 않는다.','apg vocab',relations='범위 중첩: 드롭다운은 시각적 표현이고 메뉴·콤보박스는 기능과 의미가 다른 패턴이다.',example='콤보박스')
add(a,'tooltip','툴팁과 팝오버','Tooltip / popover','패턴','툴팁은 짧은 보조 설명을 제공하고 팝오버는 더 다양한 내용이나 조작을 담을 수 있다.','아이콘의 의미나 추가 정보를 제공할 때 포커스·터치에서의 노출과 닫힘을 확인한다.','필수 설명을 호버에만 숨기지 않으며, 사용자가 직접 조작해야 하는 내용은 적절한 대화상자나 팝오버로 검토한다.','apg vocab',relations='관련되지만 구분: 툴팁과 팝오버는 노출 방식이 비슷해도 내용의 역할과 조작이 다르다.',example='툴팁')
add(a,'carousel','캐러셀','Carousel','패턴','제한된 공간에서 여러 콘텐츠를 순서대로 전환해 보여 주는 패턴이다.','현재 항목과 전체 수, 이전·다음 조작 및 일시정지 가능 여부를 표시한다.','자동 전환이 사용자의 읽기나 조작을 방해하지 않아야 하며 모든 항목을 쉽게 찾아갈 수 있어야 한다.','apg wcag vocab',example='캐러셀')
add(a,'accordion','아코디언','Accordion','패턴','제목을 눌러 관련 콘텐츠를 펼치고 접는 패턴이다.','여러 설명의 전체 내용을 동시에 볼 필요가 낮을 때 사용하고 펼침 상태를 표시한다.','주요 비교 정보나 꼭 필요한 안내를 발견하기 어려운 곳에 숨기지 않는다.','accordion apg',relations='중복 아님: 단계적 공개는 원리이며 아코디언은 그것을 구현하는 한 방법이다.',example='아코디언')
add(a,'modal','모달과 대화상자','Modal / dialog','패턴','현재 작업 위에서 별도의 집중이 필요한 짧은 작업이나 확인을 제공하는 패턴이다.','취소·닫기, 포커스 이동과 복귀, 키보드 및 배경과의 관계를 함께 설계한다.','모든 대화상자가 모달은 아니다. 빈번한 작업을 불필요하게 막으면 작업 흐름이 끊긴다.','modal apg',relations='범위 중첩: 모달은 배경 작업을 제한하는 방식이고 대화상자는 더 넓은 UI 유형이다.',example='모달')
add(a,'drawer','드로어와 오버레이 패널','Drawer / overlay panel','패턴','화면의 한쪽에서 보조 콘텐츠를 열어 기존 화면과 함께 쓰는 패널이다.','필터나 상세 설정을 필요할 때 열되 닫는 방법과 뷰어와의 동시 사용을 명확히 한다.','열린 패널이 주요 콘텐츠를 가리는지, 스크린리더 포커스를 어떻게 다룰지 확인한다.','apple apg',relations='관련: 사이드바는 위치·역할, 드로어는 열고 닫는 방식에 관한 분류다.',example='드로어')
add(a,'toast','토스트·스낵바와 알림','Toast / snackbar / alert','패턴','행동 결과나 중요한 상태를 짧은 메시지로 제공하는 방식이다.','저장 완료처럼 짧은 확인을 표시하고, 복구가 필요한 경우 행동과 충분한 시간을 제공한다.','일시 메시지에만 중요한 오류나 필수 정보를 담지 않는다. 용어는 디자인 시스템마다 쓰임이 다르다.','nng wcag vocab',example='토스트')
add(a,'loading','로딩·스켈레톤·진행','Loading / skeleton / progress','패턴','기다리는 동안 작업 중임을 알리고, 가능하면 진행 상태나 예상되는 콘텐츠 구조를 제공한다.','짧은 대기에는 명확한 상태 표시를 쓰고 콘텐츠 위치가 중요하면 스켈레톤을 검토한다.','스켈레톤은 실제 진행률이 아니며 실패·긴 대기·재시도를 대신하지 않는다.','nng toss',relations='범위 중첩: 스켈레톤은 로딩을 나타내는 방법 중 하나이고 진행률 표시와는 다르다.',example='스켈레톤')
add(a,'step','단계 표시기','Step indicator','패턴','여러 단계로 구성된 작업에서 현재 단계와 전체 진행 구조를 보여 준다.','각 단계의 이름, 현재 위치, 완료 여부와 돌아가기 가능성을 명확히 한다.','단계 수나 완료 비율이 실제 작업의 시간·난이도를 그대로 의미하지는 않는다.','step',example='단계')
add(a,'table','표와 비교','Tables / comparison','패턴','행·열·정렬·그룹을 사용해 여러 항목의 속성과 값을 비교하는 구조다.','비교에 필요한 열과 단위, 정렬과 필터 상태를 유지하고 좁은 화면의 접근 방식을 별도로 검토한다.','정보를 숨기거나 카드로 바꾸면 항목 간 비교가 더 어려워질 수 있다.','table dashboard',example='표')
add(a,'summary','요약과 상세','Summary / detail','패턴','핵심 판단에 필요한 내용을 먼저 묶고 근거와 상세는 연결해 제공한다.','결과의 상태·주요 수치·다음 행동을 짧게 요약하고 필요한 세부 자료로 연결한다.','요약이 예외 조건이나 위험한 결과를 누락하지 않도록 원본과 함께 검토한다.','summary base52',relations='관련: 요약은 정보의 표현이고 단계적 공개는 표시 순서의 원리다.',example='요약')
add(a,'error','오류 예방과 복구','Error prevention / recovery','원리','실수를 막고 오류 발생 시 원인을 이해하고 되돌리거나 다시 시도할 수 있도록 한다.','입력 시 유효성을 알려 주고 삭제·전환에는 취소 또는 되돌리기를 상황에 맞게 제공한다.','불필요한 확인창을 반복하기보다 실패 비용과 복구 가능성에 따라 결정한다.','nng wcag toss',example='오류')

a=section('accessibility','접근성과 포용','다른 감각과 입력 방식에서도 사용할 수 있는가?','접근성은 후처리 체크리스트가 아니라 정보·입력·시간·기술의 제약을 다루는 설계 원칙이다.')
add(a,'accessibility','접근성의 네 원칙','Perceivable / operable / understandable / robust','기준','웹 콘텐츠 접근성은 인지 가능, 운용 가능, 이해 가능, 견고성의 네 관점에서 살핀다.','텍스트 대안, 키보드 조작, 이해 가능한 문구와 보조 기술 호환을 화면 흐름 전체에서 확인한다.','이 요약은 WCAG 성공 기준이나 특정 지역의 법적 요구사항을 대신하지 않는다.','wcag uswds')
add(a,'keyboard','키보드·포커스·의미','Keyboard / focus / semantics','구현 원칙','포커스의 위치와 순서를 인지할 수 있어야 하고 조작 요소의 역할과 상태가 보조 기술에 전달되어야 한다.','탭 순서, 눈에 보이는 포커스, 모달 진입·복귀, 버튼과 레이블을 확인한다.','ARIA 속성만 추가한다고 키보드 동작이나 접근성이 자동으로 완성되지 않는다.','apgkey apg wcag',example='키보드')
add(a,'alternatives','대체 표현과 감각','Text alternatives / multimodal feedback','원리','색, 움직임, 소리 또는 이미지로만 전달되는 뜻을 다른 방식으로도 이해할 수 있게 한다.','아이콘의 이름, 이미지 설명, 캡션, 오류의 텍스트와 선택 상태를 함께 제공한다.','모든 이미지에 같은 형식의 대체 텍스트를 기계적으로 붙이지 말고 의미와 역할을 고려한다.','wcag uswds')
add(a,'reduced-motion','움직임 줄이기','Reduced motion','설정·구현','사용자의 움직임 감소 선호에 따라 큰 이동과 장식적인 움직임을 줄이거나 다른 피드백으로 대체한다.','운영체제 설정과 브라우저의 prefers-reduced-motion을 확인하고 기능의 결과는 여전히 전달한다.','모션을 없애는 것만으로 상태 피드백까지 사라져서는 안 된다.','motion reduce',aliases='Reduce motion · 움직임 감소',relations='동의어: 움직임 감소와 움직임 줄이기는 같은 설정을 가리킨다.',example='움직임')

a=section('platform','데스크톱·모바일·환경','어떤 기기와 입력 환경에서 사용하는가?','기기 이름만으로 결정하지 않고 사용 가능한 창, 입력 수단, 화면 밀도, 확대와 운영체제 관례를 함께 살핀다.')
add(a,'platforms','웹·앱과 플랫폼 관례','Web / native apps / platform conventions','환경','웹과 앱은 배포, 운영체제와의 연결, 탐색 및 입력 관례가 다를 수 있으며 Android와 iOS도 각각의 시스템 맥락을 가진다.','대상 서비스와 사용자 환경을 확인하고 해당 플랫폼의 최신 공식 지침과 실제 기기 동작을 비교한다.','웹과 앱의 경계는 기술 방식과 실행 환경에 따라 달라지므로 한 가지 특징으로 일반화하지 않는다.','base04 base05 base17 android apple')
add(a,'desktop','데스크톱 작업 환경','Desktop interaction','환경','넓고 크기 조절이 가능한 창, 포인터와 키보드를 활용하는 환경이다.','다중 패널·표·단축키·여러 창의 비교를 고려하되 창 축소와 확대에도 대응한다.','데스크톱이라고 모든 사용자가 마우스나 큰 화면을 쓰는 것은 아니다.','windows apple')
add(a,'mobile','모바일·터치 환경','Mobile / touch interaction','환경','작은 창, 손가락 입력, 기기 방향, 시스템 영역과 이동 중 사용을 고려하는 환경이다.','터치 목표의 간격, 화면 아래 조작, 안전 영역과 뒤로 가기, 실제 기기에서의 사용을 확인한다.','호버에만 의존한 필수 기능은 터치에서 사용하기 어렵다. 플랫폼별 수치는 원문을 확인한다.','android apple toss wcag',example='터치')
add(a,'input-modes','포인터·터치·키보드','Pointer / touch / keyboard','입력','동일한 기기에서도 마우스, 트랙패드, 손가락, 펜, 키보드와 보조 기술이 함께 쓰일 수 있다.','호버 보조 효과와 별개로 클릭·터치·포커스 경로를 제공하고 각 입력의 피드백을 비교한다.','데스크톱=마우스, 모바일=터치라는 구분은 예외가 많다.','wcag apgkey apple')
add(a,'display-units','화면 밀도와 단위','DPI / dp / sp','기술 개념','물리 픽셀 수와 화면 밀도, 논리 단위는 서로 다르며 글자 크기는 사용자 설정의 영향을 받는다.','Android의 dp·sp와 iOS의 포인트·텍스트 크기 설정 등 해당 플랫폼의 단위와 확대 설정을 구분한다.','같은 숫자를 CSS 픽셀, 물리 픽셀, dp와 pt에 그대로 대입하지 않는다.','density type base18')
add(a,'dynamic-type','가변 텍스트와 줄바꿈','Dynamic type / text resizing','환경','사용자 글자 크기, 언어와 콘텐츠 길이에 따라 텍스트 영역과 레이아웃이 달라지는 상황이다.','확대·번역·긴 이름에서 잘림, 자동 줄바꿈, 영역 증가와 조작 가림을 확인한다.','문구를 자동으로 축소하는 방식은 가독성을 희생할 수 있으므로 대안을 비교한다.','type apple base30')

a=section('motion','모션과 인터랙션 표현','움직임이 무엇을 전달하며 어떻게 느껴지는가?','모션의 역할을 먼저 정한 뒤 속도·거리·가속·탄성·방향을 조합한다. 느낌을 특정 색이나 단일 효과로 자동 환원하지 않는다.')
add(a,'motion-purpose','모션의 목적','Purposeful motion','원리','움직임은 상태 변화, 관계, 주목, 피드백 또는 분위기를 전달할 수 있다.','화면이 어디에서 열리고 어디로 돌아가는지, 클릭이 등록됐는지 설명하는 데 필요한 정도로 쓴다.','장식 때문에 자주 하는 과업을 느리게 하거나 모션만으로 필수 정보를 전달하지 않는다.','motion')
add(a,'duration','시간·거리·속도','Duration / distance / velocity','속성','동작의 길이와 거리, 시간에 따른 속도는 움직임의 지각과 작업 리듬을 바꾼다.','같은 패널을 짧고 긴 이동·빠르고 느린 속도로 비교하고 실제 과업에서 방해 여부를 관찰한다.','빠름이나 부드러움을 단일 밀리초 값으로 규정하지 않는다.','motion easing')
add(a,'easing','이징 곡선','Easing','기술','시간에 따라 애니메이션의 진행률이 어떻게 변하는지 정하는 함수다.','입장, 퇴장, 눌림에서 선형과 가속·감속 곡선을 비교하고 도착·출발의 성격을 조정한다.','이징은 스프링과 같은 물리 모형이 아니며 같은 시간이라도 체감은 움직임의 거리와 대상에 따라 달라진다.','easing motion',example='이징')
add(a,'spring','스프링·탄성','Spring / damping','기술','목표 위치를 향하는 힘과 감쇠를 사용해 튀거나 안정되는 움직임을 모델링한다.','강성과 감쇠, 초기 속도를 바꿔 가벼운 반응과 안정적인 복귀를 비교한다.','탄성이 항상 재미있거나 좋은 것은 아니다. 과한 흔들림은 피로하거나 상태 인식을 방해할 수 있다.','motionex motion',relations='관련: 스프링과 이징은 둘 다 시간에 따른 움직임을 만들지만 모형과 조절 방식이 다르다.',example='스프링')
add(a,'gesture','제스처·드래그·호버','Gestures / drag / hover','인터랙션','포인터 이동, 누르기, 끌기와 터치 동작을 입력으로 받아 반응하는 상호작용이다.','드래그 순서 변경을 제공할 때 위치, 잡힌 상태, 취소 및 키보드 대체 경로를 함께 설계한다.','호버는 터치에 그대로 대응되지 않으며 시각 효과만으로 기능을 알려서는 안 된다.','apgkey motion',example='드래그')
add(a,'micro','마이크로 인터랙션','Microinteraction','인터랙션','작은 단위의 행동·상태 변화와 그에 대한 피드백으로 구성되는 상호작용이다.','좋아요, 저장, 선택이나 복사에서 결과를 바로 알리고 실패 시 복구할 수 있게 한다.','크기가 작다고 목적 없이 반복하거나 접근성을 생략해도 된다는 뜻은 아니다.','vocab motion',example='피드백')
add(a,'magnetic','마그네틱 버튼','Magnetic button','효과','포인터가 다가갈 때 버튼이나 시각 요소가 포인터 방향으로 반응하는 효과다.','실험적 탐색이나 강조에 사용할 때 원래 클릭 위치와 포커스·터치 대안을 함께 확인한다.','장식 효과가 선택을 어렵게 만들거나 키보드 사용자를 배제하지 않아야 한다.','motionex wcag',example='마그네틱 버튼')
add(a,'cursor','커스텀 커서','Custom cursor','효과','기본 포인터를 보완하거나 대체하는 표시를 사용해 상황이나 반응을 전달한다.','드래그 가능 여부 등 맥락 정보를 보조적으로 나타내고 시스템 포인터와 함께 검토한다.','포인터를 가리거나 터치·키보드에서 필수 정보를 누락하지 않는다.','motionex wcag',example='커서')
add(a,'scroll','스크롤 연동과 패럴랙스','Scroll-driven motion / parallax','효과','스크롤 위치나 진행에 따라 요소가 이동하거나 서로 다른 속도로 움직이는 방식이다.','읽는 순서와 정보 접근을 유지하면서 깊이 표현이나 점진적 공개에 활용한다.','스크롤을 가로채거나 긴 필수 애니메이션으로 읽기와 복귀를 방해하지 않는다.','vocab motion reduce',relations='범위 중첩: 패럴랙스는 스크롤 연동 효과의 한 유형이며 모든 스크롤 모션이 패럴랙스는 아니다.',example='패럴랙스')
add(a,'snap-stagger','스크롤 스냅과 순차 등장','Scroll snap / stagger','효과','스크롤 스냅은 스크롤 위치를 특정 지점에 맞추고, 스태거는 여러 요소의 움직임을 시간차로 배치한다.','슬라이드 경계나 다수 항목의 등장 순서를 명확히 할 때 비교하고 사용자가 자유롭게 지나갈 수 있는지 본다.','스냅이 사용자의 스크롤을 강제로 빼앗거나 순차 등장 때문에 읽기를 기다리게 하지 않는다.','vocab reduce',relations='중복 아님: 스냅은 스크롤 위치, 스태거는 여러 요소의 시간 간격을 다룬다.',example='스냅')

a=section('transitions','전환과 장면 표현','화면이나 장면은 어떤 관계로 바뀌는가?','화면 구조의 변화와 시각 효과를 구분한다. 같은 전환 기법도 탐색 맥락이나 연속성의 표현에 따라 의미가 달라진다.')
add(a,'screen-transition','화면·상태 전환','Screen / state transition','전환','화면, 모달, 콘텐츠 또는 상태가 바뀔 때 이전과 이후의 관계를 전달한다.','앞뒤 이동, 패널 열기, 상세 진입에서 방향과 공간적 관계를 일관되게 정한다.','움직임이 실제 계층이나 사용자의 기대와 어긋나면 방향 감각을 해칠 수 있다.','motion vocab',example='화면 전환')
add(a,'crossfade','페이드·크로스 디졸브','Fade / cross dissolve','기법','페이드는 한 요소의 불투명도를 바꾸고, 크로스 디졸브는 한 장면이 사라지는 동안 다른 장면이 나타나게 한다.','연속성을 강하게 드러내지 않아도 되는 상태나 장면 전환을 비교한다.','두 장면이 겹치는 동안 정보의 가독성과 인지 가능성을 확인한다.','transitions motion',aliases='크로스페이드 · crossfade',relations='동의어로 쓰임: 크로스페이드와 크로스 디졸브는 장면이 겹쳐 바뀌는 맥락에서 흔히 같은 뜻이다.',example='디졸브')
add(a,'slide-mask','슬라이드·와이프·마스크','Slide / wipe / mask','기법','슬라이드는 요소를 이동시키고, 와이프·마스크는 경계나 형태를 이용해 다른 내용을 드러낸다.','이동 방향과 드러나는 경계를 바꿔 탐색 방향이나 장면의 성격을 표현한다.','방향이 같다고 같은 기법은 아니며 장식이 내용의 가독성을 가리지 않아야 한다.','transitions motion',relations='중복 아님: 슬라이드는 이동이고 와이프·마스크는 드러내는 경계에 관한 방식이다.',example='와이프')
add(a,'shader','셰이더와 화면 효과','Shader / visual effect','구현 기술','화면의 픽셀이나 정점 처리를 프로그램으로 정의해 잡음, 변형, 빛과 화면 전환 등을 구현한다.','TV 잡음 와이프처럼 실제 셰이더의 재생과 진행 상태를 확인하고 렌더링 비용을 측정한다.','셰이더는 구현 수단이며 사용자가 이해해야 할 전환 목적을 대신하지 않는다.','transitions',example='TV 잡음 와이프')

a=section('spatial','카메라·3D 작업 환경','공간에서 무엇을 보고 조작하는가?','3D 표현은 UI의 목적과 별개의 기술 계층이면서, 시점·선택·상태 표시가 경험 설계에 직접 영향을 준다.')
add(a,'camera','카메라·시점·투영','Camera / view / projection','공간 개념','카메라는 가상 장면을 바라보는 위치·방향·투영을 정의한다. 원근 투영과 직교 투영은 깊이를 다르게 표현한다.','대상의 크기 비교, 거리감과 치수 확인 중 무엇이 중요한지에 맞춰 투영과 초기 구도를 정한다.','시점을 움직이는 것과 물체를 회전시키는 것은 사용자 관점에서 다를 수 있다.','camera controls',example='카메라')
add(a,'dolly','달리와 이동','Dolly / camera movement','카메라 동작','카메라가 공간 안에서 대상에 가까워지거나 멀어지는 이동이다.','대상과 주변의 상대적인 거리와 원근 변화가 과업에 필요한지 확인한다.','광학적 줌과 달리는 모두 크게 보이게 할 수 있지만 장면의 원근 관계가 다르다.','camera',relations='중복 아님: 달리는 카메라 위치 이동이고 줌은 화각이나 배율 변화다.',example='달리')
add(a,'zoom','줌·화각','Zoom / field of view','카메라 동작','시야각 또는 확대 배율을 바꿔 보이는 범위와 대상의 화면상 크기를 조정한다.','전체 맥락을 잃지 않으면서 특정 부분을 살펴볼 수 있도록 범위와 복귀를 제공한다.','투영 방식과 디지털 확대에 따라 결과가 다르므로 모든 줌을 광학 렌즈 변화로 단정하지 않는다.','camera',example='줌')
add(a,'snap-zoom','스냅 줌','Snap zoom','카메라 기법','화각이나 배율을 짧은 시간에 빠르게 바꾸어 시선을 끌거나 장면의 리듬을 바꾸는 표현이다.','같은 줌을 빠르게와 느리게 비교하고 대상 확인이나 강조에 실제로 도움이 되는지 본다.','달리 줌처럼 카메라 이동과 화각을 결합해야 하는 것은 아니며, 빠른 확대는 감각적으로 불편할 수 있다.','snapref camera motion',relations='중복 아님: 스냅 줌은 빠른 줌의 시간적 표현이고 달리 줌은 이동과 줌을 결합한 기법이다.',example='줌')
add(a,'dolly-zoom','달리 줌','Dolly zoom / vertigo effect','카메라 기법','카메라 이동과 반대 방향의 줌·화각 변화를 결합해 대상의 화면 크기를 비슷하게 유지하면서 배경의 원근감을 바꾸는 기법이다.','감정적인 강조나 공간 관계의 변화가 필요한 장면에서 이동과 화각을 함께 조절해 비교한다.','일반적인 카메라 줌이나 스냅 줌과 동일하지 않으며 과도한 원근 변화는 불편을 줄 수 있다.','camera motion',aliases='Vertigo effect',relations='중복 아님: 달리 줌은 달리와 줌의 결합이며 어느 하나와 같은 말이 아니다.',example='달리 줌')
add(a,'pan-tilt','팬·틸트·오빗','Pan / tilt / orbit','카메라 동작','팬과 틸트는 대체로 카메라 위치를 유지하며 방향을 바꾸고, 오빗은 목표 주변에서 시점을 회전한다.','장면을 훑는지 대상을 둘러보는지에 따라 회전 중심과 조작 방식을 정한다.','이름만으로 모든 구현의 회전축이나 중심이 동일하다고 가정하지 않는다.','controls camera',relations='관련: 팬·틸트와 오빗은 모두 회전이지만 회전 중심과 사용 목적이 다르다.',example='오빗')
add(a,'viewer','3D 모델 뷰어','3D model viewer','작업 공간','모델을 관찰하고 시점, 선택, 표시 상태, 속성과 결과를 다루는 작업 화면이다.','모델을 주요 작업 영역에 두고 단계 목록·결과 목록·도구가 동시에 필요한 시점과 접을 수 있는 조건을 정한다.','뷰어를 크게 만드는 것만이 목표는 아니다. 비교, 경고, 객체 선택과 성능도 함께 검증한다.','controls dashboard',example='모델 뷰어')
add(a,'geometry-material','형상·재질·조명','Geometry / material / lighting','3D 기술','형상은 물체의 형태, 재질은 표면의 시각적 반응, 조명은 장면의 빛을 정의한다.','색과 조명뿐 아니라 윤곽, 선택 강조와 숨김 상태로 객체를 구별해 작업에 필요한 정보를 유지한다.','사실적인 표현이 항상 데이터의 식별과 비교에 가장 적합한 것은 아니다.','geometry material lighting',example='재질')

a=section('process','설계·구현·평가','어떻게 조합하고 검증하는가?','한 번에 정답을 계산하기보다 근거, 선택, 구현과 실제 관찰을 반복해 가설을 수정한다.')
add(a,'workflow','요청에서 설계까지','Design workflow','방법','모호한 느낌이나 구체적인 동작 요청을 사용자 목표, 개념, 우선순위, 화면 구조, 기능과 구현으로 차례로 해석한다.','주제·사용자·핵심 과업 → 필요한 정보·상태 → 묶음과 우선순위 → 화면·패턴 → 모션·기술 → 검증 순으로 정리한다.','이 순서는 작업을 돕는 출발점이며 새로운 증거가 나오면 앞 단계로 돌아간다.','base35 base52 uswds')
add(a,'tradeoffs','설계 상충관계','Design trade-offs','판단','한 선택이 동시에 장점과 비용을 만들 수 있으므로 작업과 사용 맥락을 기준으로 비교한다.','패널을 접으면 뷰어는 넓어지지만 비교와 재탐색 비용이 늘 수 있다. 나란히 표시·접기·탭을 과업별로 비교한다.','하나의 점수나 보편 비율만으로 모든 요구를 최적화할 수 없다.','dashboard apple base52')
add(a,'evaluate','사용성·접근성 검증','Usability / accessibility evaluation','방법','대표 과업에서 성공 여부, 시간, 오류, 이해와 접근성을 관찰해 설계의 가정을 확인한다.','데스크톱·모바일·키보드·화면 확대와 실제 데이터에서 과업을 수행하고 문제의 영향과 재현 조건을 기록한다.','자동 검사나 창 크기 시뮬레이션만으로 실제 기기와 다양한 사용자 검증을 대체할 수 없다.','uswds wcag apgkey')
add(a,'design-system','디자인 시스템','Design system','시스템','원칙, 토큰, 컴포넌트, 사용 지침과 운영 규칙을 공유해 제품 전반의 일관성을 지원한다.','버튼·텍스트·피드백을 공통화하면서 각 컴포넌트의 사용 조건·상태·접근성과 변경 이력을 기록한다.','컴포넌트를 사용한다고 맥락에 맞는 화면 설계가 자동으로 완성되지는 않는다.','tds uswds')
add(a,'design-tools','디자인 도구와 협업','Design tools / collaboration','도구','화면 설계, 프로토타입, 문서화와 개발 전달에 사용하는 도구와 협업 방식이다.','도구를 고르기 전에 필요한 산출물, 상호작용 검증, 공유와 개발 연계 방식부터 정한다.','특정 툴을 다룰 수 있다는 사실이 사용자 조사나 설계 판단을 대신하지 않는다.','base03 uswds')
add(a,'ethics','신뢰·선택권·다크패턴','Trust / deceptive design','원리','사용자가 행동의 결과를 이해하고 원치 않는 선택을 거부하거나 나갈 수 있게 한다.','동의, 광고, 뒤로 가기와 확인 버튼의 표현이 실제 결과와 일치하는지 살핀다.','토스 앱인토스의 검수 기준은 해당 환경의 구체적 조건이며 모든 서비스에 그대로 적용되는 법규는 아니다.','toss uswds')
add(a,'examples','실제 사례와 참고 원천','Real examples / references','자료','실제 서비스 화면과 공개 코드, 디자인 시스템은 설계 대안을 관찰하고 구현을 검증하는 자료다.','사용 목적·기기·입력·상태·라이선스·출처를 기록하고 같은 문제를 해결하는 여러 사례를 비교한다.','유명 서비스의 디자인은 그 서비스의 맥락에 맞춘 선택일 수 있으며 그대로 복사해도 같은 결과가 보장되지 않는다.','motionex tds uswds')

duplicates=[
 ('단계적 공개 / 점진적 공개','같은 개념의 번역','disclosure','핵심을 먼저 보이고 추가 정보를 필요할 때 공개한다.'),
 ('크로스페이드 / 크로스 디졸브','동의어로 쓰임','crossfade','두 장면의 페이드가 겹치는 전환 맥락에서 같은 뜻으로 쓰인다.'),
 ('움직임 줄이기 / 움직임 감소 / Reduce Motion','같은 설정','reduced-motion','사용자의 모션 감소 선호와 그에 대응하는 동작을 가리킨다.'),
 ('사용자 여정 / 사용자 흐름','관련되지만 구분','journey','여정은 서비스 안팎의 경험을, 흐름은 목표를 위한 구체적인 단계와 분기를 다룬다.'),
 ('정보 우선순위 / 시각적 위계','관련되지만 구분','visual-hierarchy','우선순위는 무엇이 중요한지에 대한 판단이고 위계는 이를 보이게 표현하는 것이다.'),
 ('정보 밀도 / 인지 부담','관련되지만 구분','density','정보량과 이해 부담은 연관되지만 동일한 수치가 아니다.'),
 ('단계적 공개 / 아코디언','원리와 구현','accordion','단계적 공개는 표시 전략이고 아코디언은 구현 패턴 중 하나다.'),
 ('사이드바 / 사이드 내비게이션 / 드로어','범위 중첩','sidebar','사이드바는 넓은 위치·영역, 사이드 내비게이션은 용도, 드로어는 열고 닫는 패턴이다.'),
 ('모달 / 대화상자','범위 중첩','modal','대화상자는 넓은 유형이고 모달은 배경과의 상호작용을 제한하는 방식이다.'),
 ('로딩 / 스켈레톤 / 진행률','원리와 구현','loading','로딩 상태를 나타내는 여러 방법이며 스켈레톤은 진행률 자체가 아니다.'),
 ('패럴랙스 / 스크롤 연동','부분 관계','scroll','패럴랙스는 속도 차이로 깊이를 표현하는 유형이고 스크롤 연동은 더 넓다.'),
 ('달리 / 줌 / 달리 줌','관련되지만 구분','dolly-zoom','달리는 위치, 줌은 화각·배율, 달리 줌은 둘의 결합이다.'),
 ('팬·틸트 / 오빗','관련되지만 구분','pan-tilt','회전 방향과 회전 중심, 목적을 구분한다.'),
 ('반응형 / 적응형','범위 중첩','responsive','창과 환경 변화에 대응하지만 모든 구현에서 같은 접근은 아니다.'),
]
catalog_map={'hierarchy':'visual-hierarchy','density':'density','disclosure':'disclosure','grouping':'grouping','userflow':'journey','accessibility':'accessibility','workspace':'workspace','responsive':'responsive','sidebar':'sidebar','split':'master-detail','grid':'grid','accordion':'accordion','modal':'modal','drawer':'drawer','step':'step','table':'table','search':'search','summary':'summary','magnetic':'magnetic','cursor':'cursor','spring':'spring','easing':'easing','crossfade':'crossfade','reduced-motion':'reduced-motion','dolly-zoom':'dolly-zoom','dolly':'dolly','zoom':'zoom','pan-tilt':'pan-tilt','orbit':'pan-tilt','viewer':'viewer','mobbin':'examples','saasframe':'examples','fps60':'examples','desktop-guidance':'desktop','mobile-adaptive':'mobile'}
catalog=json.loads((ROOT/'catalog.json').read_text(encoding='utf8'))
course_map={'1':'ux-ui','2':'learning','3':'design-tools','4':'platforms','5':'platforms','6':'product-fit','7':'learning','8':'grid','9':'contrast','10':'icons','11':'typography','17':'platforms','18':'display-units','30':'dynamic-type','35':'context','36':'problem','37':'users','52':'workflow'}
course=json.loads((ROOT/'course.json').read_text(encoding='utf8'))
assert set(course_map)=={str(e['index']) for e in course['episodes'] if not e['members']}
assert set(catalog_map)=={e['id'] for e in catalog}
ids={e['id'] for section in sections for e in section['items']}
assert len(ids)==sum(len(s['items']) for s in sections)
assert all(t in ids for t in catalog_map.values()) and all(t in ids for t in course_map.values()) and all(d[2] in ids for d in duplicates)
assert all(ref in S for section in sections for item in section['items'] for ref in item['refs'])
out={'version':1,'edited':'2026-10-28','sections':sections,'sources':{k:{'name':v[0],'url':v[1]} for k,v in S.items()},'duplicates':[{'terms':x[0],'relationship':x[1],'target':x[2],'note':x[3]} for x in duplicates],'catalogMap':catalog_map,'courseMap':course_map}
(ROOT/'theory.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('sections',len(sections),'concepts',len(ids),'catalog',len(catalog),'relations',len(duplicates),'sources',len(S))
