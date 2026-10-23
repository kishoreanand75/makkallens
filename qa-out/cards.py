from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
    for path in ['popular','documents']:
        pg.goto('http://localhost:3000/'+path,wait_until='networkidle'); pg.wait_for_timeout(1000)
        for lay in ['top','split','faded']:
            pg.evaluate(f"localStorage.setItem('av-card-layout', JSON.stringify('{lay}'))"); pg.reload(wait_until='networkidle'); pg.wait_for_timeout(1200)
            y=0 if path=='popular' else 700
            pg.evaluate(f"window.scrollTo(0,{600 if path=='popular' else 900})"); pg.wait_for_timeout(700)
            pg.screenshot(path=f'qa-out/card_{path}_{lay}.png')
            print(path,lay,'overflow',pg.evaluate("document.documentElement.scrollWidth-innerWidth"))
    pg.set_viewport_size({'width':390,'height':844}); pg.evaluate("localStorage.setItem('av-card-layout', JSON.stringify('top'))"); pg.goto('http://localhost:3000/popular',wait_until='networkidle'); pg.wait_for_timeout(1000)
    print('mobile overflow',pg.evaluate("document.documentElement.scrollWidth-innerWidth"),errs[:2])
    b.close()
