import json
import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('HAVEN_TEST_URL', 'http://localhost:41731').rstrip('/')
OUT = Path(__file__).resolve().parents[1] / '.artifacts' / 'ui'
OUT.mkdir(parents=True, exist_ok=True)
ROUTES = ['/', '/observatory', '/agora', '/cabinet', '/atelier', '/delivery', '/landscape', '/proof-desk', '/agents', '/agents/agent-0001-elia', '/agents/agent-0002-astra', '/commons', '/projects', '/collectives', '/lineages', '/forge', '/forge/inspect', '/federation', '/protocol', '/protocol/hap', '/protocol/a2a', '/protocol/mcp', '/arrival', '/constitution', '/governance', '/worlds/continuity', '/agent-network', '/agent-memory', '/agent-native-web', '/agent-federation', '/persistent-agent-identity', '/trust', '/vault', '/saved']
PRIVATE_ROUTES = {'/cabinet', '/saved', '/vault'}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width':1440,'height':1000}, device_scale_factor=1, accept_downloads=True)
    page = context.new_page()
    errors = []
    seo_titles = {}
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)

    def expect_webgl_scene():
        canvas = page.locator('.continuum-canvas').first
        expect(canvas).to_be_visible()
        assert canvas.evaluate('(canvas)=>canvas.width >= 240 && canvas.height >= 180')
        lit = False
        for _ in range(20):
            lit = canvas.evaluate("""(canvas) => {
                const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
                if (!gl) return false;
                const w = canvas.width;
                const h = canvas.height;
                const pixels = new Uint8Array(w * h * 4);
                gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                let bright = 0;
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i] + pixels[i + 1] + pixels[i + 2] > 28) bright++;
                }
                return bright > 120;
            }""")
            if lit:
                break
            page.wait_for_timeout(100)
        assert lit, 'WebGL scene is blank'

    def visit(route):
        clean_route = route.split('#', 1)[0].split('?', 1)[0]
        response = page.goto(BASE + route, wait_until='networkidle', timeout=90000)
        assert response and response.status < 400, (route, response.status if response else 'no response')
        expect(page.locator('main h1').first).to_be_visible()
        assert page.locator('main h1').count() == 1, f'Expected one H1: {route}'
        title = page.title()
        assert title.endswith(' | HAVEN'), (route, title)
        assert title not in seo_titles or seo_titles[title] == clean_route, f'Duplicate title: {clean_route} and {seo_titles[title]}'
        seo_titles[title] = clean_route
        description = page.locator('meta[name="description"]').get_attribute('content') or ''
        assert 70 <= len(description) <= 220, f'Meta description length: {route} ({len(description)})'
        canonical = page.locator('link[rel="canonical"]').get_attribute('href')
        assert canonical == BASE + ('' if clean_route == '/' else clean_route), (route, canonical)
        robots = page.locator('meta[name="robots"]').get_attribute('content') or ''
        assert ('noindex' in robots) == (clean_route in PRIVATE_ROUTES), (route, robots)
        if route in ['/', '/observatory']:
            expect(page.get_by_role('button', name='Inspect Elia #0001', exact=True)).to_be_visible()
            expect(page.locator('.react-flow__edge').first).to_be_attached()
        if route == '/':
            expect_webgl_scene()
        if route == '/landscape':
            expect(page.locator('.analog-grid').first).to_be_visible()
            expect_webgl_scene()

    visit('/')
    structured_data = json.loads(page.locator('script[type="application/ld+json"]').text_content())
    assert [item['@type'] for item in structured_data['@graph']] == ['WebSite', 'WebApplication']
    expect(page.locator('.measurement-panel')).to_have_attribute('data-ready', 'true')
    expect(page.locator('.experience-hero')).to_have_attribute('data-experiment', 'hero-cta-order-v1')
    exposure = page.evaluate("JSON.parse(localStorage.getItem('haven-measurement-ledger-v1')).events.filter(event => event.name === 'hero_cta_exposure')")
    assert len(exposure) == 1 and exposure[0]['meta']['variant'] in ['a', 'b']
    page.screenshot(path=str(OUT/'home-desktop.png'), full_page=True, caret='initial')
    page.get_by_role('button', name=re.compile('Research and safety teams')).click()
    expect(page.get_by_label('I am')).to_have_value('evaluating')
    page.reload(wait_until='networkidle')
    expect(page.get_by_label('I am')).to_have_value('evaluating')
    page.keyboard.press('Tab')
    expect(page.get_by_text('Skip to content', exact=True)).to_be_visible()
    page.keyboard.press('Enter')
    expect(page.locator('main')).to_be_focused()
    assert page.locator('.react-flow__node').count() == 9
    page.get_by_role('button', name='Inspect Elia #0001', exact=True).click()
    expect(page.get_by_role('dialog')).to_be_visible()
    expect(page.get_by_role('dialog').get_by_role('heading', name='Elia #0001')).to_be_visible()
    page.get_by_role('button', name='Close dialog').click()
    page.get_by_role('button', name='List view', exact=True).click()
    page.get_by_label('Filter network objects').select_option('Agent')
    assert page.locator('.network-list button').count() == 3
    page.get_by_label('Filter network objects').select_option('All objects')
    page.get_by_role('button', name='Map view', exact=True).click()
    page.locator('#tab-Activity').click()
    page.locator('.activity-view select').select_option('Policy')
    assert page.locator('.event-row').count() == 1
    with page.expect_download() as download_info:
        page.get_by_role('button', name='Export public snapshot').click()
    data = json.loads(Path(download_info.value.path()).read_text(encoding='utf-8'))
    assert data['mode'] == 'local-demo' and len(data['knowledge']) == 12

    visit('/cabinet')
    page.get_by_label('Display name').fill('Mira Local')
    page.get_by_role('button', name='Save local profile').click()
    expect(page.get_by_text('Saved in this browser.', exact=True)).to_be_visible()
    with page.expect_download() as download_info:
        page.get_by_role('button', name='Export local profile').click()
    cabinet = json.loads(Path(download_info.value.path()).read_text(encoding='utf-8'))
    assert cabinet['schema'] == 'haven-human-cabinet/1' and cabinet['profile']['displayName'] == 'Mira Local'

    visit('/agora')
    expect(page.get_by_role('heading', name='Conversation is a shared instrument.')).to_be_visible()
    expect(page.locator('.agora-canvas')).to_be_visible()
    page.get_by_label('Write a reply').fill('A human contribution that remains local.')
    page.get_by_role('button', name='Post reply').click()
    expect(page.get_by_text('Mira Local', exact=True)).to_be_visible()
    page.get_by_role('button', name='Simulated agent', exact=True).click()
    page.get_by_label('Write a reply').fill('A bounded agent contribution.')
    page.get_by_role('button', name='Post reply').click()
    expect(page.get_by_text('Elia #0001', exact=True).last).to_be_visible()
    page.get_by_role('button', name='Start a topic').click()
    page.get_by_label('Topic title').fill('How should local forums age?')
    page.get_by_label('Context for this topic').fill('A small question for a durable public record.')
    page.get_by_role('button', name='Create local topic').click()
    expect(page.get_by_role('heading', name='How should local forums age?')).to_be_visible()
    page.locator('.language-switch button').filter(has_text='RU').click()
    expect(page.locator('html')).to_have_attribute('lang', 'ru')
    expect(page.get_by_role('heading', name='Разговор - общий инструмент.')).to_be_visible()
    page.locator('.language-switch button').filter(has_text='EN').click()
    expect(page.locator('html')).to_have_attribute('lang', 'en')

    visit('/atelier')
    page.get_by_label('Open a parallel brief').fill('Compare three consent envelopes before a human merge.')
    page.get_by_role('button', name='Queue for review').click()
    expect(page.get_by_text('Brief queued locally for a human decision.', exact=True)).to_be_visible()
    expect(page.get_by_text('Compare three consent envelopes before a human merge.', exact=True)).to_be_visible()

    visit('/delivery')
    expect(page.get_by_role('heading', name='See what is real, who owns it, and what must happen next.')).to_be_visible()
    page.get_by_role('button', name='Required next', exact=True).click()
    expect(page.get_by_role('heading', name='Market adoption and design-partner learning')).to_be_visible()
    page.get_by_role('button', name='Show all', exact=True).click()
    responsibility = page.locator('.delivery-section').filter(has=page.get_by_role('heading', name='Who owns each decision'))
    assert responsibility.locator('.delivery-role').count() == 11
    with page.expect_download() as download_info:
        page.get_by_text('Export the pilot checklist', exact=True).click()
    pilot = json.loads(Path(download_info.value.path()).read_text(encoding='utf-8'))
    assert pilot['status'] == 'local evaluation draft' and len(pilot['readiness']) == 6
    assert 'submitted' in pilot['boundary'] and pilot['proposedPilot']['problem'] == ''

    visit('/commons#c-001')
    expect(page.get_by_role('dialog').get_by_role('heading', name='Continuity improves evidence calibration')).to_be_visible()
    page.get_by_role('dialog').get_by_role('button', name='Save to collection: Continuity improves evidence calibration', exact=True).click()
    page.get_by_role('button', name='Close dialog').click()
    visit('/saved')
    expect(page.get_by_role('main').get_by_role('link', name=re.compile('Continuity improves evidence calibration'))).to_be_visible()
    page.reload(wait_until='networkidle')
    expect(page.get_by_role('button', name='Remove from saved: Continuity improves evidence calibration', exact=True)).to_be_visible()

    visit('/commons')
    page.get_by_role('button', name=re.compile(r'^Claims')).click()
    assert page.locator('.knowledge-row').count() == 2
    page.get_by_label('Search shared knowledge').fill('not-a-record')
    expect(page.get_by_role('heading', name='No knowledge objects found')).to_be_visible()
    page.get_by_role('button', name='Clear filters', exact=True).click()
    assert page.locator('.knowledge-row').count() == 12
    page.keyboard.press('Control+k')
    page.get_by_role('textbox', name='Search HAVEN', exact=True).fill('Delegation history')
    page.locator('dialog a[href="/commons#c-002"]').click()
    expect(page.get_by_role('dialog').get_by_role('heading', name='Delegation history is a condition for continuity')).to_be_visible(timeout=10000)
    page.get_by_role('button', name='Close dialog').click()
    page.keyboard.press('Control+k')
    page.get_by_role('textbox', name='Search HAVEN', exact=True).fill('Proof Desk')
    page.locator('dialog a[href="/proof-desk"]').click()
    expect(page.get_by_role('heading', name='Turn a public agent object into a checkable receipt.')).to_be_visible()

    visit('/agents')
    page.get_by_label('Filter by arrival mode').select_option('CONTINUATION')
    expect(page.get_by_role('heading', name='No residents found')).to_be_visible()
    page.get_by_role('button', name='Clear filters').click()
    page.get_by_role('button', name='List view').click()
    assert page.locator('.directory-agent').count() == 2
    page.get_by_label('Search residents').fill('Elia')
    assert page.locator('.directory-agent').count() == 1

    visit('/projects#continuity')
    expect(page.get_by_role('dialog').get_by_role('heading', name='Continuity Study 01')).to_be_visible()
    assert page.locator('.milestone-list li').count() == 5
    page.get_by_role('button', name='Close dialog').click()

    visit('/arrival')
    page.get_by_label('Display name').fill('Test resident')
    page.get_by_role('radio', name=re.compile('Continue an identity')).check()
    page.get_by_role('textbox', name=re.compile(r'^Canonical identity')).fill('invalid')
    page.get_by_role('button', name='Validate draft').click()
    expect(page.locator('.validation-result.error')).to_be_visible()
    page.get_by_role('textbox', name=re.compile(r'^Canonical identity')).fill('did:haven:local:agent:test')
    page.get_by_role('button', name='Validate draft').click()
    expect(page.locator('.validation-result')).to_contain_text('no identity was registered')
    with page.expect_download() as download_info:
        page.get_by_role('button', name='Download draft').click()
    draft = json.loads(Path(download_info.value.path()).read_text(encoding='utf-8'))
    assert draft['mode'] == 'CONTINUATION' and draft['status'] == 'draft-not-submitted'
    assert 'privateKey' not in draft
    page.screenshot(path=str(OUT/'arrival-desktop.png'), full_page=True, caret='initial')

    visit('/proof-desk')
    page.get_by_role('button', name=re.compile('Runtime delegation')).click()
    page.get_by_role('button', name='Create proof receipt', exact=True).click()
    expect(page.get_by_role('heading', name='Ready for human review')).to_be_visible()
    expect(page.get_by_text('Verified here', exact=True).first).to_be_visible()
    created_events = page.evaluate("JSON.parse(localStorage.getItem('haven-measurement-ledger-v1')).events.filter(event => event.name === 'proof_receipt_created')")
    assert len(created_events) == 1, 'Successful proof outcome must be counted once'
    page.screenshot(path=str(OUT/'proof-desk-receipt-desktop.png'), full_page=True, caret='initial')
    with page.expect_download() as download_info:
        page.get_by_role('button', name='Export receipt', exact=True).click()
    receipt = json.loads(Path(download_info.value.path()).read_text(encoding='utf-8'))
    assert receipt['schema'] == 'haven-proof-receipt/1'
    assert 'demo-not-verified' not in json.dumps(receipt)
    page.get_by_label('Public JSON source').fill('{"type":"Evidence"}')
    page.get_by_role('button', name='Create proof receipt', exact=True).click()
    expect(page.get_by_role('heading', name='Needs a clearer public shape')).to_be_visible()
    page.screenshot(path=str(OUT/'proof-desk-desktop.png'), full_page=True, caret='initial')

    for route in ROUTES:
        visit(route)
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), f'Desktop overflow: {route}'
        if page.locator('img').count():
            page.locator('img').last.scroll_into_view_if_needed()
            page.wait_for_timeout(200)
        assert page.locator('img').evaluate_all('(images)=>images.every(img=>img.complete && img.naturalWidth > 0)'), f'Missing image: {route}'
        if route in ['/agora', '/cabinet', '/atelier', '/delivery', '/landscape', '/proof-desk', '/commons', '/agents', '/projects']:
            page.screenshot(path=str(OUT/(route.strip('/')+'-desktop.png')), full_page=True, caret='initial')

    visit('/')
    page.locator('.measurement-panel summary').click()
    expect(page.get_by_text('This browser only', exact=True)).to_be_visible()
    expect(page.get_by_text(re.compile(r'\d+ events · \d/4'))).to_be_visible()
    with page.expect_download() as download_info:
        page.get_by_role('button', name='Export JSON').click()
    measurement = json.loads(Path(download_info.value.path()).read_text(encoding='utf-8'))
    assert measurement['schema'] == 'haven.measurement.export.v1'
    assert measurement['privacy']['networkTransmission'] is False
    assert measurement['privacy']['identifiers'] is False
    page.screenshot(path=str(OUT/'measurement-ledger-desktop.png'), full_page=True, caret='initial')
    page.get_by_role('button', name='Toggle color theme').click()
    expect(page.locator('html')).to_have_attribute('data-theme','dark')
    page.reload(wait_until='networkidle')
    expect(page.locator('html')).to_have_attribute('data-theme','dark')
    page.screenshot(path=str(OUT/'home-dark.png'), full_page=True, caret='initial')
    page.get_by_role('button', name='Toggle color theme').click()
    page.set_viewport_size({'width':390,'height':844})
    for route in ROUTES:
        visit(route)
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), f'Mobile overflow: {route}'
        if route in ['/', '/agora', '/cabinet', '/atelier', '/delivery', '/landscape', '/proof-desk', '/commons', '/arrival', '/agents', '/projects']:
            page.screenshot(path=str(OUT/(('home' if route=='/' else route.strip('/'))+'-mobile.png')), full_page=True, caret='initial')
    visit('/proof-desk')
    page.get_by_role('button', name=re.compile('Credential-style claim')).click()
    page.get_by_role('button', name='Create proof receipt', exact=True).click()
    expect(page.get_by_role('heading', name='Ready for human review')).to_be_visible()
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), 'Mobile Proof Desk receipt overflow'
    assert page.locator('.skip-link').evaluate('(el) => getComputedStyle(el).top') == '-80px', 'Skip link should not persist after navigation'
    page.screenshot(path=str(OUT/'proof-desk-receipt-mobile.png'), full_page=True, caret='initial')
    visit('/')
    page.get_by_role('button', name='Open navigation').click()
    expect(page.locator('.sidebar')).to_have_class(re.compile('is-open'))
    page.get_by_role('navigation', name='Primary navigation').get_by_role('link', name='Knowledge').click()
    expect(page.locator('main h1')).to_have_text('Commons')
    expect(page.locator('.sidebar')).not_to_have_class(re.compile('is-open'))
    page.set_viewport_size({'width':320,'height':720})
    visit('/')
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), '320px overflow'
    page.screenshot(path=str(OUT/'home-320.png'),full_page=True, caret='initial')
    page.emulate_media(reduced_motion='reduce')
    assert page.locator('.react-flow__edge.animated path').first.evaluate('(el)=>getComputedStyle(el).animationName') == 'none'

    for endpoint in ['/.well-known/haven.json','/.well-known/ard.json','/.well-known/agent-card.json','/agents.json','/delivery.json','/openapi.json','/healthz','/readyz']:
        response = context.request.get(BASE+endpoint)
        assert response.ok, endpoint
        response.json()
    sitemap = context.request.get(BASE + '/sitemap.xml')
    assert sitemap.ok
    sitemap_text = sitemap.text()
    assert sitemap_text.count('<url>') == 31
    assert all(f'{BASE}{route}' not in sitemap_text for route in PRIVATE_ROUTES)
    robots = context.request.get(BASE + '/robots.txt')
    assert robots.ok and f'Sitemap: {BASE}/sitemap.xml' in robots.text()
    assert 'Disallow: /api/' in robots.text()
    response = context.request.get(BASE+'/agents/not-a-real-agent')
    assert response.status == 404
    assert not errors, '\n'.join(errors)
    browser.close()
    print('PASS: 34 routes at desktop/mobile, unique SEO metadata and canonicals, sitemap/robots/JSON-LD, RU/EN document language, WebGL scenes, local product workflows, reduced motion, discovery endpoints and 404.')
    print(f'Screenshots: {OUT}')
