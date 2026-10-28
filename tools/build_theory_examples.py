"""Curate specific source examples for relevant concepts in the reading guide."""
from pathlib import Path
import json, re

root=Path(__file__).resolve().parent.parent
concepts=json.loads((root/'theory.json').read_text(encoding='utf-8'))
concept_ids={item['id'] for section in concepts['sections'] for item in section['items']}
script=(root/'real-app.js').read_text(encoding='utf-8')
manifests=re.findall(r"'([^']+)'",re.search(r'const manifests=\[(.*?)\];',script,re.S).group(1))
examples={}
for manifest in manifests:
    for entry in json.loads((root/'examples'/manifest).read_text(encoding='utf-8')):
        examples.setdefault(entry['id'],entry)
# Each pairing is an editorial illustration, not proof that an original author
# used the theory, or that the example is suitable for all contexts.
mapping={
 'grouping':('bsp004','주문 정보와 결제 입력이 구역별로 묶인 방식을 살펴보세요.'),
 'navigation':('bsp010','여러 사이드 내비게이션의 현재 위치와 메뉴 구조를 살펴보세요.'),
 'search':('ui03','대화 목록에서 검색어 입력과 결과 표시를 살펴보세요.'),
 'disclosure':('apg-01','항목을 펼치고 접을 때 정보를 어떻게 나누는지 살펴보세요.'),
 'workspace':('lay02','사이드바와 데이터 영역의 공간 배분을 살펴보세요.'),
 'visual-hierarchy':('bsp020','제품 소개에서 제목, 이미지와 행동의 강조 순서를 살펴보세요.'),
 'density':('bsp006','표, 차트와 탐색 영역이 한 화면에 얼마나 들어가는지 살펴보세요.'),
 'grid':('bsp007','화면 폭과 열 구성에 따라 콘텐츠가 배치되는 방식을 살펴보세요.'),
 'responsive':('bsp001','화면 폭에 따라 카드 목록이 달라지는 반응형 예시입니다.'),
 'master-detail':('ui02','두 영역을 함께 배치해 내용을 비교하거나 확인하는 분할 화면입니다.'),
 'sidebar':('lay01','보조 탐색 패널을 접을 때 본문 공간이 어떻게 달라지는지 살펴보세요.'),
 'layout-patterns':('bsp008','같은 목적을 가진 여러 히어로 영역 구성을 비교해 보세요.'),
 'typography':('bsp002','블로그의 제목과 본문, 보조 정보의 글자 위계를 살펴보세요.'),
 'writing':('bsp004','입력 라벨과 주문 요약의 텍스트를 살펴보세요.'),
 'buttons':('mo03','누르는 순간 버튼에 나타나는 반응을 확인해 보세요.'),
 'selection':('mo04','선택 상태가 스위치에 어떻게 표시되는지 살펴보세요.'),
 'tabs':('apg-02','탭 선택과 연결된 패널의 변화를 살펴보세요.'),
 'menus':('apg-04','선택형 콤보박스에서 선택지와 현재 값을 살펴보세요.'),
 'accordion':('apg-01','아코디언의 열림과 닫힘, 키보드 동작을 살펴보세요.'),
 'modal':('apg-05','대화상자를 열고 닫으며 포커스 이동을 살펴보세요.'),
 'drawer':('mo06','화면 밖 패널이 등장하고 사라지는 방식을 살펴보세요.'),
 'toast':('mo05','작업 후 짧게 표시되는 알림을 살펴보세요.'),
 'loading':('mo08','콘텐츠가 준비되기 전 표시되는 스켈레톤을 살펴보세요.'),
 'step':('ui08','작업의 여러 단계와 현재 상태를 어떻게 표시하는지 살펴보세요.'),
 'keyboard':('apg-02','탭과 화살표 키를 사용해 패턴의 키보드 조작을 살펴보세요.'),
 'desktop':('lay02','넓은 화면에서 탐색, 지표와 표를 함께 배치한 구성입니다.'),
 'mobile':('ai014','작은 화면을 대상으로 구성된 채팅 예시입니다.'),
 'gesture':('mo07','항목을 끌어서 순서를 바꿀 때의 반응을 살펴보세요.'),
 'micro':('mo03','작은 누름 반응이 사용자의 행동에 어떤 피드백을 주는지 살펴보세요.'),
 'magnetic':('mo01','포인터가 다가갈 때 원본 버튼이 반응하는 방식을 살펴보세요.'),
 'cursor':('mo02','포인터를 따라 움직이는 커서 표현을 살펴보세요.'),
}
result={}
for concept,(id,note) in mapping.items():
    assert concept in concept_ids and id in examples, (concept,id)
    e=examples[id]
    assert e.get('preview','').startswith('./examples/') and (root/e['preview']).exists(),id
    result[concept]={key:e.get(key,'') for key in ('id','name','preview','sourceName','sourceUrl','license')}
    result[concept]['note']=note
(root/'theory-examples.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('curated concept examples',len(result))
