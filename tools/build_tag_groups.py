"""Group every existing tag by its wording, without inventing example traits."""
from pathlib import Path
import collections
import json
import re
import unicodedata

root = Path(__file__).resolve().parent.parent
taxonomy = json.loads((root / 'taxonomy.json').read_text(encoding='utf-8'))['items']
tags = sorted({tag for item in taxonomy.values() for tag in item['tags']}, key=str.casefold)
script = (root / 'real-app.js').read_text(encoding='utf-8')
files = re.findall(r"'([^']+)'", re.search(r'const manifests=\[(.*?)\];', script, re.S).group(1))
examples = [item for name in files for item in json.loads((root / 'examples' / name).read_text(encoding='utf-8'))]
names = {str(item.get(k, '')).strip().casefold() for item in examples for k in ('name', 'english')}
title_terms = {unicodedata.normalize('NFKC', tag).strip().casefold() for item in taxonomy.values() for tag in item.get('titleTags', [])}
sources = {str(item.get('sourceName', '')).strip().casefold() for item in examples}

rules = [
 ('기능·목적', r'로딩|진행|검색|필터|탐색|선택|입력|평가|반응|피드백|알림|공유|복사|저장|업로드|다운로드|결제|인증|접근성|온보딩|설정|비교|상태|안내|도움말|보안|로그인|공개|검증|유효성|정렬|전송|생성|사용량|측정|제어|관리|신청|확인|추적|작업|loading|loader|progress|search|filter|select|input|feedback|rating|review|notify|notification|share|copy|clipboard|upload|download|checkout|auth|accessib|onboard|setting|compare|status|\bstate|validation|sort|submit|saving|security|privacy|approval|consent|usage|track|control|task'),
 ('요소·형태', r'버튼|토글|스위치|체크박스|라디오|패널|사이드바|메뉴|탭|카드|목록|리스트|모달|대화상자|툴팁|팝오버|배지|배너|슬라이더|아코디언|(?:^|[ ·])표(?:$|[ ·])|차트|그리드|폼|입력창|대시보드|내비게이션|아이콘|헤더|푸터|텍스트|타이포|글자|도형|프롬프트|프레임|배경|이미지|커서|마우스|스피너|스켈레톤|플로팅|타임라인|캐러셀|리플|button|toggle|switch|checkbox|radio|panel|sidebar|menu|\btabs?\b|card|\blists?\b|modal|dialog|tooltip|popover|badge|banner|slider|accordion|table|chart|grid|\bform|dashboard|navigat|\bicons?\b|header|footer|text|typo|cursor|pointer|spinner|skeleton|floating|timeline|carousel|\bprompt\b|image|background|layout'),
 ('동작·입력', r'호버|클릭|누르|드래그|스와이프|터치|키보드|포커스|스크롤|제스처|마우스|포인터|입력|끌기|스냅|고정|펼치|접기|타이핑|드로잉|선택|hover|click|press|drag|swipe|touch|keyboard|focus|scroll|gesture|mouse|pointer|\bsnap|sticky|pinned|typing|typewriter|drawing|select|\btap\b|interact'),
 ('모션·전환', r'모션|애니메이션|전환|등장|퇴장|이동|회전|줌|확대|축소|탄성|스프링|바운스|페이드|디졸브|슬라이드|변형|마스크|와이프|패럴랙스|글리치|키프레임|반복|시머|리플|물결|드러내|순차|진동|경로|궤도|흐르|넘기|motion|animat|transition|reveal|appear|disappear|\benter|\bexit|mov(e|ing)|rotat|spin|zoom|scal(e|ing)|spring|elastic|bounce|fade|dissolve|slide|morph|mask|wipe|parallax|glitch|keyframe|loop|shimmer|ripple|\bwave|stagger|vibrat|\bpath\b|orbit|flip|transform|transition|tween|easing'),
 ('시각 스타일·분위기', r'분위기|부드러|경쾌|차분|무게감|깔끔|미니멀|유리|메탈|네온|빛|그림자|색상|색채|그라데이션|명암|질감|재질|투명|블러|테두리|광택|입체|픽셀|그레인|노이즈|하프톤|시각|패턴|glow|neon|glass|metal|gradient|colou?r|contrast|shadow|texture|material|opacity|transparent|blur|border|grain|noise|halftone|visual|aesthetic|minimal|soft|smooth|pixel|pattern|hologra|clay|aurora'),
 ('콘텐츠·주제', r'채팅|대화|메시지|에이전트|인공지능|\bai\b|음성|오디오|비디오|이미지|사진|영상|파일|코드|문서|상품|결제|가격|쇼핑|행사|프로젝트|프로필|뉴스|지도|데이터|차트|통계|날씨|자연|chat|conversation|message|agent|voice|audio|video|image|photo|media|file|code|document|product|checkout|pricing|shop|event|project|profile|news|\bmap\b|data|chart|weather|nature'),
 ('공간·카메라', r'\b3d\b|3차원|입체|카메라|달리|오빗|렌즈|화각|시점|투영|원근|직교|조명|깊이|메시|모델|입자|포인트 클라우드|공간|지형|camera|dolly|orbit|lens|\bfov\b|perspective|orthographic|projection|lighting|depth|\bmesh|model|particle|point cloud|spatial|terrain|geometry|webgl|gltf|three\.js'),
 ('기술·구현', r'\bhtml\b|\bcss\b|javascript|typescript|\bjs\b|react|vue|webgl|webgpu|svg|canvas|shader|셰이더|키프레임|라이브러리|프레임워크|\bapi\b|gltf|\bdom\b|코드|렌더링|프로그래밍|physics|물리|shader|keyframe|library|framework|render|\bgsap\b|\bthree\.js\b|bootstrap|tailwind'),
 ('기기·환경', r'데스크톱|모바일|반응형|터치|키보드|마우스|태블릿|desktop|mobile|responsive|touch|keyboard|mouse|tablet|기기|\bdevice\b'),
]
compiled = [(label,re.compile(pattern,re.I)) for label,pattern in rules]
groups = [label for label,_ in rules] + ['예시 이름·키워드','출처·라이브러리','기타·검토']
# Short and domain-specific terms need explicit meanings; substring matching
# alone would turn terms such as "빛" or "표" into unrelated labels.
explicit = {
 '기능·목적': '스트리밍|add to cart fly|advanced parameters|content warning|CTA|daily limit ring|editor|error retry|FAQ|helpful bar|language picker|price calculator|response length|rewrite options|run log console|spend alerts|thinking|thumbs down reasons|token ring|tool call indicator|trust|가독성|값 조절|거래|계획|구매|기록|단계|대기|더보기|동작 줄이기|돋보기|매물|범위|별점|분석|생략|설명|성공|수량|승인|시간|신고|순서 변경|예약|오류|요약|자동 완성|자동완성|장바구니|재고|재생|정보위계|즐겨찾기|채용|체크|추가|출처|카운터|평점|행동|확장',
 '요소·형태': 'dots|커버|CTA|FAQ|helpful bar|lines|marquee ticker|net|points|rings|split flap board|token ring|tool call indicator|가로|갤러리|거터|격자|그룹|글꼴|굵기|단계|단어|다중 손잡이|드로어|랜딩|레이아웃|링크|마진|메이슨리|밀도|바|보드|분할|분할 화면|분할화면|사각형|상단바|쌓기|여백|열|원|줄바꿈|중앙|콤보박스|큐브|크기|토스트|페이지|패딩|포털|하단|하단바|하트|행간|화면 중심|화면영역|히어로',
 '동작·입력': 'add to cart fly|editor|language picker|raycast|raycasting|walk|값 조절|다중 손잡이|더보기|동작 줄이기|뒤집기|마그네틱|방향|순서 변경|시선|쌓기|요소 진입|자동 완성|자동완성|재생|체크|추가|클립보드|타자기|편집|행동|확장|흔들림',
 '모션·전환': '스케일|스트리밍|add to cart fly|blending|cloth simulation|fluid simulation|heart burst|ken burns|marquee ticker|split flap board|walk|뒤집기|마그네틱|모핑|비행|시퀀스|쌓기|요소 진입|이징|재생|커튼|클리핑|클립|타자기|파도|파편|펄스|포털|흔들림|효과',
 '시각 스타일·분위기': '스포트라이트|anisotropy|blending|clearcoat|dispersion|displacementmap|halo|iridescence|plasma|scanline|scattering|sheen|subsurface|toon|transmission|wireframe|격자|그라디언트|굵기|글꼴|글로우|대비|명도|보케|여백|테마|파도|하트|행간|효과',
 '콘텐츠·주제': '토큰|스트리밍|birds|car|clouds|clouds2|CRM|daily limit ring|FAQ|fog|globe|price calculator|response length|rewrite options|run log console|snow rain|spend alerts|thinking|token ring|tool call indicator|trunk|가독성|강의|갤러리|거래|고객|교육|구매|기록|답변|매물|매장|병원|부동산|분석|블로그|서비스|설명|소개|스토리|시퀀스|숙소|업무|여행|예약|웨비나|인사|자료|장바구니|재고|재무|제품|직원|채용|출시|카페|커리큘럼|티켓|평점|포트폴리오',
 '공간·카메라': '셔터|스포트라이트|1인칭|anisotropy|birds|car|cells|clearcoat|cloth simulation|clouds|clouds2|collada|convex|csg|cubes|dispersion|displacementmap|extrude|fluid simulation|fog|globe|hemisphere|ifc|ik|iridescence|ISO|lights|lod|ortho|pcd|pdb|physical|pointlight|points|ray marching sdf|raycast|raycasting|rectarealight|rings|scattering|sheen|skinning|snow rain|spline|splines|spotlight|starfield|subsurface|sunlight|teapot|topology|transmission|trunk|usdz|Vertigo|volumetric smoke|voxelpainter|vsm|walk|wireframe|각도|거리|경계|구형|노출|대상 맞춤|드론|방향|별|보케|비행|시선|시야|시야각|아크볼|위 방향|장애물|조리개|초점|축|충돌|충돌체|큐브|트랙볼|트럭|파티클|패닝|팬|프레이밍|피사계심도|해상도|환경|흔들림',
 '기술·구현': 'anisotropy|blending|collada|convex|csg|displacementmap|extrude|fluid simulation|ifc|ik|lod|pcd|pdb|physical|ray marching sdf|raycast|raycasting|skinning|spline|splines|topology|usdz|volumetric smoke|voxelpainter|vsm|wireframe|dp|dpi|이징|클리핑|클립보드|파티클|해상도',
 '기기·환경': 'Android|iOS|dp|dpi|뷰포트|해상도',
}
explicit = {label:{x.casefold() for x in values.split('|')} for label,values in explicit.items()}
mapping = {}
for tag in tags:
    labels = [label for label,pattern in compiled if pattern.search(tag) or tag.casefold() in explicit.get(label,set())]
    if unicodedata.normalize('NFKC',tag).strip().casefold() in title_terms or tag.strip().casefold() in names: labels.append('예시 이름·키워드')
    if tag.strip().casefold() in sources or re.search(r'\b(?:Codrops|Magic CSS|Vanta)\b',tag,re.I): labels.append('출처·라이브러리')
    mapping[tag] = labels or ['기타·검토']

out = {'version':1,'method':'태그 표기와 원본 항목명에 근거한 다중 분류. 표현만으로 알 수 없는 태그는 기타·검토로 표시하며 분위기를 추측하지 않습니다.', 'groups':groups, 'tags':mapping}
(root/'tag-groups.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
counts=collections.Counter(g for values in mapping.values() for g in values)
print('tags',len(tags),'assigned',len(mapping),'unclassified',counts['기타·검토'])
for group in groups: print(group,counts[group])
