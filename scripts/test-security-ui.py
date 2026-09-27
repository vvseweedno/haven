import hashlib
import json
import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('HAVEN_TEST_URL', 'http://localhost:41731').rstrip('/')
OUT = Path(__file__).resolve().parents[1] / '.artifacts' / 'security'
OUT.mkdir(parents=True, exist_ok=True)
PASSPHRASE = 'a uniquely long browser test passphrase'
MARKER = 'PRIVATE_BROWSER_TEST_29a184'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, accept_downloads=True, bypass_csp=False)
    page = context.new_page()
    page.clock.install()
    errors, requests = [], []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('request', lambda r: requests.append({'url': r.url, 'method': r.method, 'body': r.post_data}))

    def visit(route):
        response = page.goto(BASE + route, wait_until='networkidle')
        assert response.status == 200, (route, response.status)
        expect(page.locator('main h1')).to_be_visible()
        return response

    def unlock():
        page.get_by_label('Passphrase', exact=True).fill(PASSPHRASE)
        page.get_by_role('button', name='Unlock notebook', exact=True).click()
        expect(page.get_by_role('button', name='Lock', exact=True)).to_be_visible(timeout=15000)

    # Security headers must be present on HTML, JSON and unusual 404 routes.
    first = visit('/vault')
    policy = first.headers['content-security-policy']
    script_policy = next(part for part in policy.split(';') if part.strip().startswith('script-src '))
    assert "'nonce-" in script_policy and "'strict-dynamic'" in script_policy
    assert 'unsafe-inline' not in script_policy and 'unsafe-eval' not in script_policy
    assert first.headers['x-content-type-options'] == 'nosniff'
    assert first.headers['x-frame-options'] == 'DENY'
    assert 'x-powered-by' not in first.headers
    other = context.request.get(BASE + '/trust', headers={'x-nonce': 'attacker-controlled-nonce'})
    assert other.headers['content-security-policy'] != policy
    assert 'attacker-controlled-nonce' not in other.headers['content-security-policy']
    missing = context.request.get(BASE + '/does-not-exist.json')
    assert missing.status == 404 and "script-src 'self' 'nonce-" in missing.headers['content-security-policy']
    # Inject into response bytes: debugger-created scripts have elevated trust in Chromium.
    probe = context.new_page()
    violations = []
    probe.on('console', lambda m: violations.append(m.text) if 'Content Security Policy' in m.text else None)
    def inject(route):
        response = route.fetch()
        html = response.text().replace('</head>', '<script>window.__injected=true</script></head>')
        html = html.replace('<body>', '<body><img src="data:image/png;base64,invalid" onerror="window.__attributeInjected=true">')
        route.fulfill(response=response, body=html)
    probe.route('**/trust', inject)
    probe.goto(BASE + '/trust', wait_until='networkidle')
    assert probe.evaluate('!window.__injected && !window.__attributeInjected')
    assert len(violations) >= 2, violations
    probe.close()

    # Create, save, reload, reject wrong passphrase, and unlock.
    page.get_by_label('Passphrase', exact=True).fill(PASSPHRASE)
    page.get_by_label('Confirm passphrase', exact=True).fill(PASSPHRASE)
    page.get_by_role('button', name='Create notebook').click()
    expect(page.get_by_role('button', name='Lock', exact=True)).to_be_visible(timeout=15000)
    page.locator('.note-index-tools').get_by_role('button', name='New note').click()
    page.get_by_label('Note title', exact=True).fill(MARKER)
    page.get_by_label('Note body', exact=True).fill('A private note. <script>window.__noteInjected=true</script>')
    page.get_by_label('Note kind').select_option('Research')
    page.get_by_role('button', name='Save note', exact=True).click()
    expect(page.get_by_role('status').filter(has_text='Saved encrypted')).to_be_visible()
    encrypted = page.evaluate("localStorage.getItem('haven-vault-v1')")
    assert MARKER not in encrypted and 'A private note' not in encrypted
    assert json.loads(encrypted)['format'] == 'haven-vault/1'
    assert page.evaluate('!window.__noteInjected')
    page.screenshot(path=str(OUT/'vault-desktop.png'), full_page=True, caret='initial')
    with page.expect_download() as download:
        page.get_by_role('button', name='Encrypted backup', exact=True).click()
    backup = Path(download.value.path()).read_bytes()
    assert MARKER.encode() not in backup
    page.reload(wait_until='networkidle')
    expect(page.get_by_role('button', name='Unlock notebook')).to_be_visible()
    assert MARKER not in page.locator('body').inner_text()
    page.get_by_label('Passphrase', exact=True).fill('this passphrase is incorrect')
    page.get_by_role('button', name='Unlock notebook').click()
    expect(page.locator('main').get_by_role('alert')).to_contain_text('Could not unlock')
    unlock()
    expect(page.get_by_label('Note title', exact=True)).to_have_value(MARKER)

    # Failed storage writes remain visibly unsaved and do not overwrite the archive.
    page.evaluate("""() => { window.__setItem = Storage.prototype.setItem; Storage.prototype.setItem = function(k,v) { if(k==='haven-vault-v1') throw new DOMException('Storage quota exceeded','QuotaExceededError'); return window.__setItem.call(this,k,v); }; }""")
    page.get_by_label('Note body', exact=True).fill('Unsaved storage failure test')
    page.get_by_role('button', name='Save note').click()
    expect(page.locator('main').get_by_role('alert')).to_contain_text('quota')
    expect(page.locator('.unsaved-label')).to_be_visible()
    assert page.evaluate("localStorage.getItem('haven-vault-v1')") == encrypted
    page.evaluate('() => { Storage.prototype.setItem = window.__setItem; }')
    page.get_by_role('button', name='Save note').click()
    expect(page.get_by_role('status').filter(has_text='Saved encrypted')).to_be_visible()
    page.get_by_role('button', name='Lock', exact=True).click()

    # Import is reviewed before replacement; old encrypted archive remains until confirmation.
    before_import = page.evaluate("localStorage.getItem('haven-vault-v1')")
    page.get_by_label('Import encrypted archive', exact=True).set_input_files({'name': 'backup.json', 'mimeType': 'application/json', 'buffer': backup})
    expect(page.get_by_role('heading', name='Restore an encrypted archive')).to_be_visible()
    page.get_by_label('Passphrase', exact=True).fill(PASSPHRASE)
    page.get_by_role('button', name='Review archive').click()
    expect(page.get_by_role('button', name='Replace local notebook')).to_be_visible(timeout=15000)
    assert page.evaluate("localStorage.getItem('haven-vault-v1')") == before_import
    page.get_by_role('button', name='Replace local notebook').click()
    expect(page.get_by_label('Note title', exact=True)).to_have_value(MARKER)
    expect(page.get_by_label('Note body', exact=True)).to_have_value(re.compile('A private note'))

    # A second tab invalidates the unlocked session instead of allowing a stale overwrite.
    second = context.new_page()
    second.goto(BASE + '/vault', wait_until='networkidle')
    second.get_by_label('Passphrase', exact=True).fill(PASSPHRASE)
    second.get_by_role('button', name='Unlock notebook').click()
    expect(second.get_by_label('Note title', exact=True)).to_have_value(MARKER, timeout=15000)
    second.get_by_label('Note body', exact=True).fill('Changed from another tab')
    second.get_by_role('button', name='Save note').click()
    expect(page.get_by_role('button', name='Unlock notebook')).to_be_visible()
    expect(page.get_by_role('status').filter(has_text='another tab')).to_be_visible()
    second.close()
    unlock()
    page.wait_for_timeout(150)
    page.clock.fast_forward(310000)
    expect(page.get_by_role('button', name='Unlock notebook')).to_be_visible()
    expect(page.get_by_role('status').filter(has_text='inactivity')).to_be_visible()
    page.clock.resume()

    # Public API never exposes the notebook and enforces query bounds and method restrictions.
    result = context.request.get(BASE + '/api/v1/catalog?limit=100')
    assert result.status == 200
    data = result.json()
    assert data['items'] and all(item['visibility'] == 'PUBLIC' for item in data['items'])
    assert not any(item['href'] == '/vault' for item in data['items'])
    assert MARKER not in result.text()
    assert context.request.get(BASE + '/api/v1/catalog?limit=100', headers={'If-None-Match': result.headers['etag']}).status == 304
    assert context.request.get(BASE + '/api/v1/catalog?limit=100', headers={'If-None-Match': '*'}).status == 304
    assert context.request.head(BASE + '/api/v1/catalog').body() == b''
    assert context.request.post(BASE + '/api/v1/catalog', data={'title': 'should not write'}).status == 405
    assert context.request.get(BASE + '/api/v1/catalog?q=' + MARKER).json()['total'] == 0
    for query in ['limit=101', 'offset=-1', 'q=a&q=b', 'kind=PRIVATE', 'unknown=1', 'q=' + 'x'*121]:
        response = context.request.get(BASE + '/api/v1/catalog?' + query)
        assert response.status == 400, query
        assert 'no-store' in response.headers['cache-control']
    assert context.request.get(BASE + '/api/v1/status').json()['capabilities']['remoteExecution'] is False

    # HAVEN Border is reachable as a machine surface but remains zero-trust and fail-closed.
    border = context.request.get(BASE + '/.well-known/haven')
    assert border.status == 200
    border_data = border.json()
    assert border_data['admission']['anonymous'] is True
    assert border_data['admission']['humanOwnerRequired'] is False
    assert border_data['admission']['defaultTrust'] == 0
    assert border_data['execution']['available'] is False
    assert border_data['capabilities']['default'] == []

    handshake = context.request.post(
        BASE + '/api/v1/handshake',
        data={'protocol': 'haven/1.3'},
    )
    assert handshake.status == 200
    assert handshake.json()['ok'] is True
    assert context.request.post(
        BASE + '/api/v1/handshake',
        data={'protocol': 'haven/999'},
    ).status == 409
    assert context.request.post(
        BASE + '/api/v1/handshake',
        data='not-json',
        headers={'Content-Type': 'text/plain'},
    ).status == 415
    assert context.request.post(
        BASE + '/api/v1/handshake',
        data={'padding': 'x' * 17000},
    ).status == 413

    # Public agent identifiers are not credentials. Session creation needs the
    # one-time ticket returned only after proof-of-key-possession.
    session_without_ticket = context.request.post(
        BASE + '/api/v1/session',
        data={'agentId': 'agent:public-identifier-is-not-a-secret'},
    )
    assert session_without_ticket.status == 401
    assert session_without_ticket.json()['code'] == 'VERIFICATION_TICKET_REQUIRED'
    assert context.request.get(BASE + '/api/v1/capabilities').status == 401

    # Inspector computes exact-byte hashes, clears stale reports and never executes input.
    visit('/forge/inspect')
    source = '{"schema":"test/1","visibility":"PRIVATE","body":"<script>window.__objectInjected=true</script>"}'
    page.get_by_label('JSON source').fill(source)
    page.get_by_role('button', name='Inspect object').click()
    expect(page.locator('.fingerprint code')).to_have_text(hashlib.sha256(source.encode()).hexdigest())
    with page.expect_download() as download:
        page.get_by_role('button', name='Export report').click()
    report = json.loads(Path(download.value.path()).read_text())
    assert report['signatureVerification'] == 'not-performed' and 'body' not in json.dumps(report)
    assert page.evaluate('!window.__objectInjected')
    page.screenshot(path=str(OUT/'inspector-desktop.png'), full_page=True, caret='initial')
    page.get_by_label('JSON source').fill('not json')
    assert page.locator('.fingerprint code').count() == 0
    page.get_by_role('button', name='Inspect object').click()
    expect(page.locator('main').get_by_role('alert')).to_contain_text('Invalid JSON')
    page.get_by_label('Open JSON file').set_input_files({'name': 'input.json', 'mimeType': 'application/json', 'buffer': b'{"schema":"test/1","visibility":"PUBLIC"}'})
    page.get_by_role('button', name='Inspect object').click()
    expect(page.locator('.fingerprint code')).to_be_visible()

    # Proof Desk treats a public object as data, keeps its source local and exports only the receipt.
    visit('/proof-desk')
    proof_source = '{"id":"urn:haven:proof:security-test","type":"Evidence","createdAt":"2026-09-23T14:00:00.000Z","proof":"<script>window.__proofInjected=true</script>"}'
    page.get_by_label('Public JSON source').fill(proof_source)
    page.get_by_role('button', name='Create proof receipt', exact=True).click()
    expect(page.get_by_role('heading', name='Ready for human review')).to_be_visible()
    assert page.evaluate('!window.__proofInjected')
    with page.expect_download() as download:
        page.get_by_role('button', name='Export receipt', exact=True).click()
    proof_receipt = Path(download.value.path()).read_text(encoding='utf-8')
    assert 'proofInjected' not in proof_receipt
    assert '<script>' not in proof_receipt

    # Agora renders local message content as text and never turns a forum reply into script.
    visit('/agora')
    page.get_by_label('Write a reply').fill('<script>window.__agoraInjected=true</script>')
    page.get_by_role('button', name='Post reply').click()
    expect(page.get_by_text('<script>window.__agoraInjected=true</script>', exact=True)).to_be_visible()
    assert page.evaluate('!window.__agoraInjected')

    visit('/trust')
    expect(page.get_by_role('status').filter(has_text='Public API online')).to_be_visible()
    page.get_by_role('button', name='Refresh node status').click()
    expect(page.get_by_role('status').filter(has_text='Public API online')).to_be_visible()
    page.screenshot(path=str(OUT/'trust-desktop.png'), full_page=True, caret='initial')
    for width in [390, 320]:
        page.set_viewport_size({'width': width, 'height': 844})
        for route in ['/vault', '/forge/inspect', '/trust']:
            visit(route)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, route)
            if route == '/vault':
                unlock()
                expect(page.get_by_label('Note body', exact=True)).to_be_visible()
            page.screenshot(path=str(OUT/f'{route.strip("/").replace("/", "-")}-{width}.png'), full_page=True, caret='initial')
    page.get_by_role('button', name='Toggle color theme').click()
    page.screenshot(path=str(OUT/'trust-dark-mobile.png'), full_page=True, caret='initial')
    assert not any(MARKER in r['url'] or (r['body'] and MARKER in r['body']) for r in requests)
    assert all(r['method'] in ['GET', 'HEAD'] for r in requests), requests
    assert not errors, errors
    (OUT/'result.json').write_text(json.dumps({'status': 'passed', 'flows': ['nonce CSP and injection blocking', 'encrypted storage and recovery', 'wrong password and failed save', 'cross-tab invalidation and idle lock', 'private/public boundary', 'API validation and conditional caching', 'local inspector', 'desktop/mobile/dark layouts'], 'browserErrors': errors}, indent=2))
    print('PASS: security headers, encrypted notebook lifecycle, public API, inspector and responsive layouts')
    browser.close()
