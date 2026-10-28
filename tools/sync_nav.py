"""Keep the five top-level site links identical across the static pages."""
from pathlib import Path
import re

root=Path(__file__).resolve().parent.parent
pages={'index.html':'examples','theory.html':'theory','course.html':'course','sources.html':'sources','about.html':'about'}
links=[('examples','예시 둘러보기','./index.html#main'),('theory','설계 지식','./theory.html'),('course','강좌 아카이브','./course.html'),('sources','참고 원천','./sources.html'),('about','이용 안내','./about.html')]
for filename,current in pages.items():
    path=root/filename
    text=path.read_text(encoding='utf-8')
    anchors=''.join(f'<a href="{href}"'+(' aria-current="page"' if key==current else '')+f'>{name}</a>' for key,name,href in links)
    nav='<!-- SITE NAV START -->\n<header class="site-header"><a class="site-brand" href="./index.html#main"><span class="site-mark">m.</span><span>모음<small>INTERACTION LIBRARY</small></span></a><nav class="site-nav" aria-label="주 메뉴">'+anchors+'</nav><span class="site-header-label">DESIGN LIBRARY</span></header>\n<!-- SITE NAV END -->'
    if '<!-- SITE NAV START -->' in text:
        text,n=re.subn(r'<!-- SITE NAV START -->.*?<!-- SITE NAV END -->',lambda m:nav,text,count=1,flags=re.S)
    elif '<!-- SITE NAV -->' in text:
        text,n=text.replace('<!-- SITE NAV -->',nav,1),1
    else:
        text,n=re.subn(r'<header class="topbar">.*?</header>',lambda m:nav,text,count=1,flags=re.S)
    if n!=1:raise RuntimeError(f'Cannot find header in {filename}')
    if 'site-nav.css?' not in text:
        text=text.replace('</head>',' <link rel="stylesheet" href="./site-nav.css?v=20261028">\n</head>',1)
    path.write_text(text,encoding='utf-8')
    print(filename,current)
