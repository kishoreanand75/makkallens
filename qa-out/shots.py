import sys
from playwright.sync_api import sync_playwright
pages=[x if x!='home' else '' for x in sys.argv[1].split(',')]
sizes=[(390,844),(820,1100),(1440,900)]
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,h in sizes:
        ctx=b.new_context(viewport={'width':w,'height':h})
        pg=ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.on('pageerror',lambda e: errs.append(str(e)))
        for path in pages:
            pg.goto('http://localhost:3000/'+path,wait_until='networkidle')
            pg.wait_for_timeout(1200)
            pg.evaluate("window.scrollTo(0,document.body.scrollHeight)"); pg.wait_for_timeout(400); pg.evaluate("window.scrollTo(0,0)")
            ov=pg.evaluate("document.documentElement.scrollWidth-innerWidth")
            name=path.strip('/').replace('/','_') or 'home'
            pg.screenshot(path=f'qa-out/{name}_{w}.png',full_page=True)
            print(w,path,'overflow',ov,'errors',errs[:3])
    b.close()
