// Behaviour test: loads the real page and JS in jsdom from the local server and
// exercises the menu, product filters, contact form and product finder.
// Run with `npm test`. Exits non-zero if any check fails.

'use strict';

const { JSDOM, VirtualConsole, requestInterceptor } = require('jsdom');
const { createServer } = require('../scripts/serve.js');

const results = [];
const errors = [];
const check = (name, ok, info = '') => results.push({ name, ok: Boolean(ok), info });
const wait = ms => new Promise(r => setTimeout(r, ms));

// Load only local files; answer external ones (Google Fonts) with an empty
// stylesheet so the test runs offline
const localOnly = requestInterceptor(request => {
  if (!request.url.startsWith('http://127.0.0.1')) {
    return new Response('', { headers: { 'Content-Type': 'text/css' } });
  }
  return undefined;
});

async function run(base) {
  let fetchMode = 'fail';
  const calls = [];
  const vc = new VirtualConsole();
  // Real page failures only — jsdom's own CSS-parser notes are not site bugs
  vc.on('jsdomError', e => {
    if (['unhandled-exception', 'resource-loading'].includes(e.type)) errors.push(String(e.message || e));
  });
  vc.on('error', (...args) => errors.push('console.error: ' + args.join(' ')));

  const dom = await JSDOM.fromURL(base, {
    runScripts: 'dangerously',
    resources: { interceptors: [localOnly] },
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(w) {
      w.IntersectionObserver = class {
        constructor(cb) { this.cb = cb; }
        observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
        unobserve() {}
        disconnect() {}
      };
      w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
      w.fetch = async (url, opts) => {
        calls.push({ url: String(url), body: String(opts.body) });
        return fetchMode === 'ok'
          ? { ok: true, json: async () => ({ ok: true }) }
          : { ok: false, status: 501, json: async () => { throw new Error('not json'); } };
      };
    },
  });
  const w = dom.window;
  const d = w.document;
  if (d.readyState !== 'complete') await new Promise(r => w.addEventListener('load', r));
  await wait(200);

  // Page
  const rules = [...d.styleSheets].reduce((n, s) => { try { return n + s.cssRules.length; } catch { return n; } }, 0);
  check('stylesheet applied', rules > 100 && w.getComputedStyle(d.querySelector('.product-grid')).display === 'grid', `${rules} rules`);
  check('reveal elements become visible', d.querySelectorAll('.reveal:not(.visible)').length === 0);
  check('29 products listed', d.querySelectorAll('.product').length === 29);
  check('public emails are contact@ and support@',
    d.querySelector('a[href="mailto:contact@safecodeg.com"]') && d.querySelector('a[href="mailto:support@safecodeg.com"]'));

  // Mobile menu
  const hb = d.getElementById('hamburger');
  const nl = d.getElementById('navLinks');
  hb.click();
  check('menu opens', nl.classList.contains('open') && hb.getAttribute('aria-expanded') === 'true');
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape' }));
  check('Escape closes menu', !nl.classList.contains('open'));

  // Product filters
  const visible = () => [...d.querySelectorAll('.product')].filter(p => !p.classList.contains('is-hidden'));
  d.querySelector('[data-filter="devices"]').click();
  check('filter shows only devices', visible().length === 3 && visible().every(p => p.dataset.family === 'devices'));
  d.querySelector('[data-jump="learning"]').click();
  check('footer link filters learning', visible().length === 3 && visible().every(p => p.dataset.family === 'learning'));
  d.querySelector('[data-filter="all"]').click();
  check('"All" shows every product', visible().length === 29);

  // Contact form
  const form = d.getElementById('contactForm');
  const submit = () => form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  submit();
  check('empty form is blocked', calls.length === 0 && d.querySelectorAll('.contact-form .invalid').length === 5);
  const set = (id, v) => { d.getElementById(id).value = v; };
  set('f-first', 'Asha'); set('f-last', '<i>K</i>'); set('f-email', 'asha@example.com');
  set('f-service', 'Product support'); set('f-msg', 'Need help with SessionGuard.');
  fetchMode = 'fail'; submit(); await wait(50);
  check('posts to contact.php', calls[0]?.url.endsWith('contact.php') && calls[0].body.includes('service=Product+support'));
  check('server error shows message, not success',
    d.getElementById('successState').hidden && /contact@safecodeg\.com/.test(d.getElementById('formStatus').textContent));
  fetchMode = 'ok'; submit(); await wait(50);
  const successText = d.getElementById('successText');
  check('server OK shows success', !d.getElementById('successState').hidden && form.hidden);
  check('support topic replies from support@', /support@safecodeg\.com/.test(successText.textContent));
  check('visitor input is not rendered as HTML', !successText.querySelector('i'));
  d.getElementById('sendAnother').click();
  check('"Send another" resets the form', !form.hidden && d.getElementById('f-first').value === '');

  // Product finder
  d.getElementById('finderBtn').click();
  const panel = d.getElementById('finderPanel');
  check('finder opens', !panel.hidden);
  const ask = async q => {
    d.getElementById('finderInput').value = q;
    d.getElementById('finderForm').dispatchEvent(new w.Event('submit', { cancelable: true }));
    await wait(10);
    return [...d.querySelectorAll('.msg.bot')].pop();
  };
  const expected = [
    ['do you have single sign-on?', 'Core Identity'], ['vending', 'AGVending'], ['LMS for my company', 'LearnSphere'],
    ['license trial', 'License Service'], ['radar for cars', 'eRadar360'], ['siem', 'TitanSecure'],
    ['vmware migration', 'UniConneX'], ['ocr documents', 'DocStream'], ['casino', 'RoyalEdge'],
    ['golf swing', 'GolfVision'], ['keep my computer awake', 'SessionGuard'], ['clinical training', 'MedMaster'],
    ['robot', 'OrbitalBee'], ['resume help', 'CareerUpgrade'],
  ];
  for (const [q, want] of expected) {
    const top = (await ask(q)).querySelector('b')?.textContent || '(no match)';
    check(`finder: "${q}" → ${want}`, top.includes(want), top);
  }
  let reply = await ask('what is your email');
  check('finder: contact details', /contact@safecodeg\.com/.test(reply.textContent) && /support@safecodeg\.com/.test(reply.textContent));
  reply = await ask('where are your offices');
  check('finder: offices', /Wyoming/.test(reply.textContent) && /Hyderabad/.test(reply.textContent));
  await ask('<img src=x onerror=alert(1)>');
  check('finder: typed HTML is not rendered', !panel.querySelector('img'));
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape' }));
  check('Escape closes finder', panel.hidden);

  check('no JavaScript errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  w.close();
}

(async () => {
  const server = createServer();
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  try {
    await run(base);
  } finally {
    server.close();
  }
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.info && !r.ok ? '  — ' + r.info : ''}`);
  const failed = results.filter(r => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
