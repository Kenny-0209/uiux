"""Import licensed upstream screen templates; run with three checked-out repos.

python tools/import_layouts.py <100-templates> <novpix> <colorlib>
All listed previews remain linked to their exact source revision. Copies of the
HTML are kept byte-for-byte; a preview copy only blocks form submission.
"""
from pathlib import Path
import html, json, re, shutil, subprocess, sys

root = Path(__file__).resolve().parent.parent
examples = root / 'examples'
sources = [Path(p).resolve() for p in sys.argv[1:]]
if len(sources) != 3:
    raise SystemExit(__doc__)
commits = [subprocess.check_output(['git', '-C', str(p), 'rev-parse', 'HEAD'], text=True).strip() for p in sources]
expected = ['bab6ec6c8900450aab90989d217942a67ad9b16d', '9765e791bf4033c41a9c9a6bff817cae7363befa', 'feebd4716ef5c9149613b3c5a78030c34cbf846d']
if commits != expected:
    raise SystemExit('Source revisions differ from the researched revisions.')

group_names = {'admin-dashboard':'관리 대시보드','business':'비즈니스','ecommerce':'온라인 상점','education':'교육','events-community':'행사·커뮤니티','health-fitness':'건강·운동','landing-pages':'랜딩 페이지','local-services':'지역 서비스','portfolio':'포트폴리오','real-estate-travel':'부동산·여행','restaurant':'음식점','saas-landing':'소프트웨어 서비스'}
nov_names = {'agency':'에이전시','app-landing':'앱 소개','business':'기업','coming-soon':'출시 예고','designer-portfolio':'디자이너 포트폴리오','developer-portfolio':'개발자 포트폴리오','error-pages':'오류 화면','event-conference':'행사·콘퍼런스','fitness':'운동','link-in-bio':'링크 모음','personal-blog':'블로그','photography':'사진 포트폴리오','real-estate':'부동산','restaurant':'음식점','saas-landing':'소프트웨어 서비스','wedding':'결혼식'}
page_tags = {'index':['홈','소개'],'checkout':['결제','폼'],'product':['상품','상세'],'project':['프로젝트','상세'],'listing':['목록','검색'],'property':['부동산','상세'],'work':['포트폴리오','목록'],'contact':['연락','폼'],'services':['서비스','목록'],'service':['서비스','상세'],'menu':['메뉴','목록'],'article':['기사','상세'],'thread':['커뮤니티','대화'],'categories':['커뮤니티','분류'],'job':['채용','상세'],'lesson':['교육','학습'],'room':['숙박','상세'],'vehicle':['자동차','상세'],'pipeline':['업무','목록'],'reports':['보고서','차트'],'settings':['설정','폼'],'analytics':['분석','차트'],'dashboard':['관리','대시보드'],'orders':['주문','목록'],'profile':['프로필','설정'],'login':['로그인','폼'],'pricing':['요금제','비교'],'404':['오류','복구'],'500':['오류','복구'],'maintenance':['점검','상태'],'about':['소개','정보'],'gallery':['갤러리','상세'],'galleries':['갤러리','목록'],'booking':['예약','폼'],'practice':['서비스','목록'],'release':['음악','상세'],'programme':['교육','상세'],'travel':['행사','안내'],'appeal':['기부','안내'],'case':['사례','상세'],'cohorts':['분석','표'],'customers':['고객','목록'],'revenue':['수익','차트'],'blog-post':['블로그','본문'],'thanks':['완료','피드백'],'whats-on':['행사','일정']}
guard = '<meta http-equiv="Content-Security-Policy" content="form-action \'none\'; connect-src \'self\'"><script>document.addEventListener("submit",function(e){e.preventDefault()},true)</script>'
def preview(raw):
    text = raw.decode('utf-8')
    if not re.search(r'</head\s*>', text, re.I):
        raise ValueError('Expected HTML head')
    return re.sub(r'</head\s*>', lambda m: guard+m.group(), text, count=1, flags=re.I).encode('utf-8')
def title(raw, fallback):
    match = re.search(r'<title[^>]*>(.*?)</title\s*>', raw.decode('utf-8'), re.I|re.S)
    return html.unescape(re.sub(r'\s+', ' ', match.group(1)).strip()) if match else fallback
def record(id, name, english, tags, preview_path, source_path, repo, commit, upstream, license_path, code_files=None):
    return {'id':id,'name':name,'english':english,'category':'화면 구성',
      'description':'원본에서 제공하는 실제 화면입니다. 정보 배치와 원본의 조작을 살펴보세요. 데모 입력 전송은 차단됩니다.',
      'tags':list(dict.fromkeys(['화면 구성','반응형']+tags)), 'preview':'./examples/'+preview_path,
      'codePath':'./examples/'+source_path, 'codeFiles':code_files or [],
      'sourceName':repo, 'sourceUrl':f'https://github.com/{upstream}/blob/{commit}/'+str(upstream_path).replace('\\','/'),
      'license':'MIT', 'licensePath':'./examples/'+license_path,
      'adaptation':'원본 HTML을 별도로 보존하고 미리보기에서 폼 제출을 차단했습니다. 외부 자산과 원본 스크립트는 각 출처의 조건을 따릅니다.',
      'networkRequired':True, 'platforms':[], 'platformNote':'원본은 반응형으로 제공되지만 모든 기기와 조작은 검증하지 않았습니다.'}

rows=[]
old=json.loads((examples/'templates.json').read_text(encoding='utf-8'))
existing={x['sourceUrl'].split('/blob/'+commits[0]+'/')[-1] for x in old}
out=examples/'lytpl'; out.mkdir(exist_ok=True)
(out/'README.md').write_text('# 단일 HTML 화면 원본\n\n100 Free HTML Templates의 고정 커밋에서 기존에 수집하지 않은 화면을 가져왔습니다. `*-source.html`은 원본이고 대응되는 파일은 폼 제출 차단만 추가한 미리보기입니다. 공통 MIT 라이선스는 상위 examples/LIC-TPL.txt에 있습니다. 외부 이미지와 글꼴에는 원천의 별도 조건이 적용됩니다.\n',encoding='utf-8')
for file in sorted(sources[0].glob('*/*/index.html')):
    upstream_path=file.relative_to(sources[0])
    if upstream_path.as_posix() in existing: continue
    group, slug = upstream_path.parts[:2]
    if group not in group_names: continue
    raw=file.read_bytes(); ident=f'lt{len(rows)+1:03d}'
    (out/f'{ident}-source.html').write_bytes(raw); (out/f'{ident}.html').write_bytes(preview(raw))
    label=slug.replace('-',' ').title(); group_label=group_names[group]
    rows.append(record(ident,group_label+' · '+label,title(raw,label),[group_label,label,'템플릿','홈','소개'],f'lytpl/{ident}.html',f'lytpl/{ident}-source.html','100 Free HTML Templates',commits[0],'mmrahmanbappi/100-free-html-templates','LIC-TPL.txt'))

def import_multi(source, prefix, container, upstream, source_name, commit, selected):
    global upstream_path
    destroot=examples/container;destroot.mkdir(exist_ok=True)
    note='\n`LICENSE.txt`는 Colorlib 원본의 MIT 라이선스이며 `BOOT-LIC.txt`는 포함된 Bootstrap v6.0.0-alpha.1의 MIT 라이선스입니다. 각 템플릿의 `CREDITS.txt`에서 이미지 출처와 적용 조건을 확인하세요.\n' if container=='lycolor' else ''
    (destroot/'README.md').write_text(f'# {source_name} 화면 원본\n\n고정 커밋 {commit}의 원본 템플릿별 폴더입니다. HTML은 `.source.html`로 보존하고 실제 페이지 경로는 폼 제출을 차단한 미리보기입니다. 각 폴더의 원본 자산, 크레딧과 라이선스를 유지합니다.\n'+note,encoding='utf-8')
    shutil.copy2(source/'LICENSE',destroot/'LICENSE.txt')
    counter=0
    for number,d in enumerate(selected,1):
        target=destroot/f'{prefix}{number:02d}'
        if target.exists(): shutil.rmtree(target)
        shutil.copytree(d,target,ignore=shutil.ignore_patterns('thumb*.webp','*.source.html'))
        (target/'README-수집.md').write_text('이 폴더는 '+str(d.relative_to(source))+' 원본의 화면, 자산, 크레딧을 보존하기 위해 만들었습니다. `.source.html`은 수정하지 않은 원본이고 일반 HTML은 폼 제출만 차단한 미리보기입니다.\n',encoding='utf-8')
        for original in sorted(d.glob('*.html')):
            if prefix=='nv' and (d.name=='email-templates' or original.name=='dawn.html'): continue
            raw=original.read_bytes(); clone=target/original.name
            (target/(original.stem+'.source.html')).write_bytes(raw)
            clone.write_bytes(preview(raw))
            counter+=1; ident=f'{prefix}{counter:03d}'; upstream_path=original.relative_to(source)
            group=nov_names.get(d.name,d.name.replace('-',' ').title())
            role=original.stem; tags=[group]+page_tags.get(role, [role.replace('-',' ')])
            label=('홈' if role=='index' else role.replace('-',' ').title())
            common=[]
            for filename,kind in [('assets/css/style.css','원본 CSS'),('assets/js/main.js','원본 JavaScript')]:
                if (target/filename).is_file():common.append({'label':kind,'path':'./examples/'+f'{container}/{target.name}/{filename}'})
            rows.append(record(ident,group+' · '+label,title(raw,d.name),tags,f'{container}/{target.name}/{original.name}',f'{container}/{target.name}/{original.stem}.source.html',source_name,commit,upstream,f'{container}/LICENSE.txt',common))

import_multi(sources[1], 'nv', 'lynov', 'Novpix/free-html-templates', 'Novpix', commits[1], sorted(p for p in (sources[1]/'templates').iterdir() if p.is_dir() and p.name!='email-templates'))
import_multi(sources[2], 'cl', 'lycolor', 'ColorlibHQ/bootstrap-templates', 'Colorlib', commits[2], sorted(p for p in sources[2].iterdir() if p.is_dir() and not p.name.startswith(('.', '_', 'bs6-'))))
(examples/'layout-more.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('imported',len(rows),'by source:', {source:sum(r['sourceName']==source for r in rows) for source in set(r['sourceName'] for r in rows)})
