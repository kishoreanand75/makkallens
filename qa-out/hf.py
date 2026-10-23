from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,h in [(1440,900),(820,1100),(390,844)]:
        pg=b.new_page(viewport={'width':w,'height':h}); errs=[]
        pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        pg.goto('http://localhost:3000/popular',wait_until='networkidle'); pg.wait_for_timeout(800)
        pg.screenshot(path=f'qa-out/hdr_{w}.png',clip={'x':0,'y':0,'width':w,'height':min(h,200)})
        pg.evaluate("window.scrollTo(0,document.body.scrollHeight)"); pg.wait_for_timeout(600)
        pg.screenshot(path=f'qa-out/ftr_{w}.png')
        print(w,'overflow',pg.evaluate("document.documentElement.scrollWidth-innerWidth"),errs)
    b.close()
