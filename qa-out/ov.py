from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844})
    pg.goto('http://localhost:3000/schemes/magalir-urimai',wait_until='networkidle'); pg.wait_for_timeout(1200)
    print(pg.evaluate("""[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>391).slice(0,8).map(e=>e.tagName+'.'+String(e.className).slice(0,70)+' '+Math.round(e.getBoundingClientRect().right))"""))
    b.close()
