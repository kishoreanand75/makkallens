from playwright.sync_api import sync_playwright
B='http://localhost:3000'
res=[]
def chk(n,c): res.append((n,bool(c))); print(('PASS ' if c else 'FAIL ')+n)
with sync_playwright() as p:
    b=p.chromium.launch()
    for w,h in [(1440,900),(390,844)]:
        ctx=b.new_context(viewport={'width':w,'height':h}); pg=ctx.new_page(); errs=[]
        pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e: errs.append(str(e)))
        pg.goto(B+'/',wait_until='networkidle')
        btn=pg.get_by_role('button',name='My documents'); 
        chk(f'{w} my-docs button visible',btn.first.is_visible())
        btn.first.click(); dlg=pg.get_by_role('dialog'); chk(f'{w} popup opens',dlg.is_visible())
        boxes=dlg.get_by_role('checkbox'); n=boxes.count(); chk(f'{w} popup has checkboxes ({n})',n>=10)
        boxes.nth(0).check(); boxes.nth(1).check()
        pg.get_by_role('button',name='சேமி').last.click(); pg.wait_for_timeout(300)
        pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
        chk(f'{w} popup closes on Esc',dlg.count()==0)
        chk(f'{w} count shows 2',pg.get_by_text('2/').first.is_visible() if pg.get_by_text('2/').count() else False)
        pg.goto(B+'/popular',wait_until='networkidle')
        chk(f'{w} popular has 50',pg.locator('ol[aria-label="Top 50"] > li').count()==50)
        pg.fill('#top-search','ரேஷன்'); pg.wait_for_timeout(300)
        c=pg.locator('ol[aria-label="Top 50"] > li').count(); chk(f'{w} search filters ({c})',0<c<50)
        pg.fill('#top-search','')
        pg.get_by_role('button',name='வடிகட்டி').first.click(); pg.wait_for_timeout(400)
        chk(f'{w} filter drawer opens',pg.get_by_role('dialog').count()>0)
        pg.keyboard.press('Escape')
        pg.goto(B+'/ask?q=சாதிச் சான்றிதழ்',wait_until='networkidle'); pg.wait_for_timeout(1500)
        chk(f'{w} ask answers',len(pg.inner_text('main'))>300)
        chk(f'{w} no console errors {errs[:2]}',not errs)
        ctx.close()
    b.close()
print('FAILED:',[n for n,c in res if not c])
