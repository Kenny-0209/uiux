"""Import the upstream plain HTML/CSS/JS examples without changing their code.

Usage: python tools/import_movin.py PATH_TO_MOVIN_CHECKOUT
The checkout's commit is recorded in every source URL.
"""
from pathlib import Path
import json
import re
import shutil
import subprocess
import sys

root = Path(__file__).resolve().parent.parent
upstream = Path(sys.argv[1]).resolve()
revision = subprocess.check_output(['git', '-C', str(upstream), 'rev-parse', 'HEAD'], text=True).strip()
target = root / 'examples' / 'movin'
target.mkdir(exist_ok=True)
shutil.copyfile(upstream / 'LICENSE', target / 'LICENSE.txt')
(target / 'README.md').write_text(
    '# Movin 원본 예시\n\nMovin 저장소의 HTML, CSS, JavaScript와 개별 설명을 원본 그대로 보관합니다. '
    '각 mv 번호 폴더의 index.html은 사이트의 패널 안에서 원본을 실행하기 위한 최소한의 미리보기 문서입니다. '
    '원본 출처와 고정 커밋은 `../movin.json`에, 이용 조건은 `LICENSE.txt`에 있습니다.\n', encoding='utf-8')

types = {
    'buttons': ('버튼', ['버튼', '행동']),
    'cards': ('카드', ['카드']),
    'checkboxes': ('체크박스', ['체크박스', '선택', '입력']),
    'inputs': ('입력 필드', ['입력', '폼']),
    'loaders': ('로딩 표시', ['로딩', '상태']),
    'radios': ('라디오 버튼', ['라디오', '선택', '입력']),
    'toggles': ('토글', ['토글', '스위치', '선택']),
}
entries = []
for group, (ko, base_tags) in types.items():
    for component in sorted((upstream / 'components' / group).iterdir()):
        if not component.is_dir():
            continue
        html_files, css_files, js_files = [list(component.glob('*.' + ext)) for ext in ('html', 'css', 'js')]
        if len(html_files) != 1 or len(css_files) != 1 or len(js_files) > 1:
            raise ValueError(f'Unexpected source files: {component}')
        html, css = html_files[0], css_files[0]
        markup = html.read_text(encoding='utf-8')
        stylesheet = css.read_text(encoding='utf-8')
        javascript = js_files[0].read_text(encoding='utf-8') if js_files else ''
        readme = (component / 'README.md').read_text(encoding='utf-8')
        title = re.search(r'^# (.+)$', readme, re.M).group(1)
        paragraphs = re.split(r'\n\s*\n', readme.strip())
        # Keep the card compact; the complete upstream description is included
        # as a source file beside the HTML, CSS and JavaScript.
        source_description = paragraphs[1].replace('\n', ' ')
        description = re.split(r'(?<=[.!?])\s+', source_description, maxsplit=1)[0]
        id = f'mv{len(entries)+1:03d}'
        directory = target / id
        directory.mkdir(exist_ok=True)
        for file in [html, css, *js_files, component / 'README.md']:
            shutil.copyfile(file, directory / file.name)
        # Only the surrounding document is added. The component files remain upstream originals.
        wrapper = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title><link rel="stylesheet" href="{css.name}">
<style>html{{color-scheme:light}}*{{box-sizing:border-box}}body{{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#f5f5f6;color:#222;font:15px system-ui,sans-serif;overflow:auto}}</style>
</head><body>{markup}{f'<script src="{js_files[0].name}"></script>' if js_files else ''}</body></html>\n'''
        (directory / 'index.html').write_text(wrapper, encoding='utf-8')
        tags = list(base_tags)
        if re.search(r'@keyframes|\banimation\s*:', stylesheet, re.I): tags.append('애니메이션')
        if ':hover' in stylesheet: tags.append('호버')
        if ':focus' in stylesheet: tags.append('포커스')
        if re.search(r'\btransition\s*:', stylesheet): tags.append('상태 전환')
        if re.search(r'prefers-reduced-motion', stylesheet): tags.append('동작 줄이기')
        if re.search(r'role="(?:switch|checkbox|radio)"|type="(?:checkbox|radio)"', markup): tags.append('상태 선택')
        base = f'./examples/movin/{id}/'
        source = f'https://github.com/raza-ahmed/movin-components/tree/{revision}/components/{group}/{component.name}'
        entry = {
            'id': id, 'name': f'{title} · {ko}', 'english': '', 'category': 'UI 패턴',
            'description': description, 'taxonomyText': source_description, 'tags': tags, 'preview': base + 'index.html',
            'codePath': base + html.name,
            'codeFiles': [{'label': css.name, 'path': base + css.name}] + [{'label': f.name, 'path': base + f.name} for f in js_files] + [{'label': '원본 설명', 'path': base + 'README.md'}],
            'sourceName': 'Movin', 'sourceUrl': source, 'license': 'MIT-0',
            'licensePath': './examples/movin/LICENSE.txt',
            'adaptation': '원본 HTML·CSS·JavaScript는 그대로 보존하고 패널용 미리보기 문서만 추가했습니다.',
            'platforms': [], 'platformNote': '기기별 실제 동작 미검증', 'requiresGPU': False,
        }
        entries.append(entry)

(root / 'examples' / 'movin.json').write_text(json.dumps(entries, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(entries)} original components from {revision}')
