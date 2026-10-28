"""Count unique examples for each tag and category facet; record gaps."""
from pathlib import Path
import collections
import json
import re
import sys

root = Path(__file__).resolve().parent.parent
script = (root / 'real-app.js').read_text(encoding='utf-8')
block = re.search(r'const manifests=\[(.*?)\];', script, re.S).group(1)
files = re.findall(r"'([^']+)'", block)
examples = {}
for file in files:
    for item in json.loads((root / 'examples' / file).read_text(encoding='utf-8')):
        examples.setdefault(item['id'], item)
for id, category in [('motion-gestures','모션과 인터랙션'),('motion-accordion','UI 패턴'),('motion-drag','모션과 인터랙션'),('motion-spring','모션과 인터랙션'),('motion-hover','모션과 인터랙션'),('motion-press','모션과 인터랙션')]:
    examples[id] = {'id': id, 'category': category}
taxonomy = json.loads((root / 'taxonomy.json').read_text(encoding='utf-8'))['items']
if set(examples) != set(taxonomy):
    raise ValueError('예시와 분류 목록의 ID가 일치하지 않습니다.')
tags = collections.Counter()
facets = collections.Counter()
categories = collections.Counter()
for id, item in examples.items():
    detail = taxonomy[id]
    tags.update(set(detail['tags']))
    categories.update([item['category']])
    facets.update((item['category'], facet) for facet in set(detail['subcategories']))
    for category, values in detail.get('related', {}).items():
        facets.update((category, facet) for facet in set(values))
lines = [
    '# 태그와 세부 분류 수량 점검', '',
    '기준일: 2026-10-28. 사이트 예시 ID를 기준으로 중복 없이 집계했습니다. '
    '태그는 예시 설명과 원본 정보를 이용한 자동 분류이므로 개별 원문 검토가 필요합니다.', '',
    f'- 사례: {len(examples)}개',
    f'- 태그: {len(tags)}개 중 40개 이상 {sum(n >= 40 for n in tags.values())}개, 미만 {sum(n < 40 for n in tags.values())}개',
    f'- 분야별 세부 분류: {len(facets)}개 중 40개 이상 {sum(n >= 40 for n in facets.values())}개, 미만 {sum(n < 40 for n in facets.values())}개',
    '- 40개 미만인 분류를 기준에 맞추기 위해 연관성이 없는 사례를 붙이거나 원본을 중복 계산하지 않았습니다.',
    '- Movin 추가분 288개는 원본 HTML/CSS/JS를 보존하며 MIT-0 라이선스를 표시합니다.', '',
    '## 세부 분류별 사례 수', '', '| 분야 | 세부 분류 | 사례 수 | 40개까지 부족 |', '|---|---|---:|---:|',
]
for (category, facet), n in sorted(facets.items()):
    lines.append(f'| {category} | {facet} | {n} | {max(0,40-n)} |')
lines += ['', '## 태그별 사례 수', '', '| 태그 | 사례 수 | 40개까지 부족 |', '|---|---:|---:|']
for tag, n in sorted(tags.items(), key=lambda x: (-x[1], x[0])):
    lines.append(f'| {tag.replace("|", "／")} | {n} | {max(0,40-n)} |')
report = Path(sys.argv[1]) if len(sys.argv)>1 else root / 'taxonomy-audit.md'
report.write_text('\n'.join(lines)+'\n', encoding='utf-8')
print('\n'.join(lines[4:8]))
