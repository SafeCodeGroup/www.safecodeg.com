/* ═══════════════════════════════════════════════════════
   Safe Code Group — site behaviour
═══════════════════════════════════════════════════════ */

'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── NAV: scrolled state, mobile menu, active link ───────────────────────────
const nav = $('#nav');
const navLinks = $('#navLinks');
const hamburger = $('#hamburger');

const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
}
hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
$$('a', navLinks).forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

const sectionLinks = $$('.nav-links a:not(.nav-cta)');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    sectionLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => sectionObs.observe(s));

// ── REVEAL ON SCROLL ─────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => reduceMotion ? el.classList.add('visible') : revealObs.observe(el));

// ── PRODUCT FILTERS ──────────────────────────────────────────────────────────
const filters = $$('.filter');
const products = $$('.product');

function applyFilter(family) {
  filters.forEach(f => {
    const on = f.dataset.filter === family;
    f.classList.toggle('active', on);
    f.setAttribute('aria-selected', String(on));
  });
  products.forEach(p => p.classList.toggle('is-hidden', family !== 'all' && p.dataset.family !== family));
}
filters.forEach(f => f.addEventListener('click', () => applyFilter(f.dataset.filter)));
$$('[data-jump]').forEach(a => a.addEventListener('click', () => applyFilter(a.dataset.jump)));

// ── CONTACT FORM ─────────────────────────────────────────────────────────────
(() => {
  const form = $('#contactForm');
  if (!form) return;
  const btn = $('#submitBtn');
  const btnLabel = $('#btnLabel');
  const status = $('#formStatus');
  const success = $('#successState');

  const rules = {
    'f-first': v => v.length > 0,
    'f-last': v => v.length > 0,
    'f-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'f-service': v => v.length > 0,
    'f-msg': v => v.length > 5,
  };

  function check(id) {
    const el = document.getElementById(id);
    const ok = rules[id](el.value.trim());
    el.classList.toggle('invalid', !ok);
    el.classList.toggle('valid', ok);
    el.setAttribute('aria-invalid', String(!ok));
    const err = document.getElementById('err-' + id.slice(2));
    if (err) err.style.display = ok ? 'none' : 'block';
    return ok;
  }
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    el.setAttribute('aria-describedby', 'err-' + id.slice(2));
    el.addEventListener('blur', () => { if (el.value.trim()) check(id); });
    el.addEventListener('input', () => { if (el.classList.contains('invalid')) check(id); });
  });

  function showError(msg) {
    status.textContent = msg;
    status.className = 'is-error';
  }
  function setLoading(on) {
    btn.disabled = on;
    btn.classList.toggle('loading', on);
    btnLabel.textContent = on ? 'Sending…' : 'Send message';
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const allOk = Object.keys(rules).map(check).every(Boolean);
    if (!allOk) {
      showError('Please complete the highlighted fields.');
      form.querySelector('.invalid')?.focus();
      return;
    }
    status.className = '';
    status.textContent = '';

    const data = {
      first: $('#f-first').value.trim(),
      last: $('#f-last').value.trim(),
      email: $('#f-email').value.trim(),
      company: $('#f-company').value.trim(),
      service: $('#f-service').value,
      message: $('#f-msg').value.trim(),
      website: $('#f-website').value,
    };

    setLoading(true);
    // Only show success once the server confirms the email has gone out
    try {
      const resp = await fetch('contact.php', { method: 'POST', body: new URLSearchParams(data) });
      const result = await resp.json().catch(() => ({}));
      if (!resp.ok || !result.ok) throw new Error(result.error || '');
    } catch (err) {
      setLoading(false);
      showError(err.message || 'Could not send your message. Please email contact@safecodeg.com directly.');
      return;
    }
    setLoading(false);

    const replyFrom = data.service === 'Product support' ? 'support@safecodeg.com' : 'contact@safecodeg.com';
    $('#successText').textContent = `Thanks, ${data.first}. We’ve received your message about “${data.service}” and will reply from ${replyFrom} within one business day.`;
    form.hidden = true;
    success.hidden = false;
  });

  $('#sendAnother').addEventListener('click', () => {
    form.reset();
    $$('.invalid,.valid', form).forEach(el => el.classList.remove('invalid', 'valid'));
    $$('.field-err', form).forEach(el => { el.style.display = 'none'; });
    success.hidden = true;
    form.hidden = false;
    $('#f-first').focus();
  });
})();

// ── PRODUCT FINDER ───────────────────────────────────────────────────────────
// Answers only from the products listed on this page, plus contact details.
(() => {
  const btn = $('#finderBtn');
  const panel = $('#finderPanel');
  const msgs = $('#finderMsgs');
  const form = $('#finderForm');
  const input = $('#finderInput');
  if (!btn || !panel) return;

  const catalog = products.map(p => ({
    name: $('h3', p).textContent,
    stage: $('.stage', p).textContent,
    desc: $('p', p).textContent,
    family: p.dataset.family,
    text: p.textContent.toLowerCase(),
  }));

  // Extra words people use that don't appear verbatim in product text
  const synonyms = {
    sso: 'sso sign-in identity oidc saml', single: 'sso sign-in', 'sign-on': 'sso sign-in', signin: 'sso sign-in',
    login: 'sign-in sso identity', auth: 'sign-in sso mfa identity',
    licence: 'licens', license: 'licens', licensing: 'licens', trial: 'trial licens', subscription: 'licens',
    lms: 'learning lms course', training: 'learning course clinical', course: 'learning course',
    vending: 'vending', kiosk: 'vending', radar: 'radar v2x', car: 'radar driver', driver: 'radar driver',
    robot: 'robot', robotics: 'robot', space: 'robot satellite edge', satellite: 'satellite edge',
    security: 'security siem zero-trust soc', siem: 'siem security', cloud: 'cloud hypervisor multi-cloud',
    vmware: 'vmware hypervisor', database: 'database', ocr: 'ocr document', document: 'document ocr',
    agent: 'agents reasoning', ai: 'ai ', ml: 'ml model', trading: 'trading market', finance: 'trading capital',
    casino: 'casino gaming', gaming: 'casino gaming', golf: 'golf sports', sports: 'sports golf', music: 'audio music',
    audio: 'audio music', '3d': '3d xr', xr: 'xr 3d', vr: 'xr 3d', health: 'clinic medical healthcare',
    medical: 'clinic medical healthcare', doctor: 'clinic medical', career: 'career job resume', job: 'career job resume',
    resume: 'resume career', construction: 'construction blueprint', architecture: 'architecture blueprint',
    awake: 'awake session', sleep: 'awake session', productivity: 'planner task', project: 'planner task',
  };

  function addMsg(who, build) {
    const el = document.createElement('div');
    el.className = 'msg ' + who;
    if (typeof build === 'string') el.textContent = build; else build(el);
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function line(parent, text, tag = 'p') {
    const el = document.createElement(tag);
    el.textContent = text;
    parent.appendChild(el);
    return el;
  }
  function contactLink(parent, text) {
    const a = document.createElement('a');
    a.href = '#contact';
    a.textContent = text;
    a.addEventListener('click', () => toggle(false));
    parent.appendChild(a);
  }

  const stopwords = new Set('do does you your have has a an the for my our we us is are any what which how can could i me need want looking with to of and or in on about there tell show some'.split(' '));

  function search(q) {
    const words = q.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !stopwords.has(w));
    // Words the visitor typed weigh 2; synonym expansions weigh 1
    const weights = new Map();
    words.forEach(w => {
      weights.set(w, 2);
      (synonyms[w] || '').trim().split(/\s+/).filter(t => t.length > 1 && !weights.has(t)).forEach(t => weights.set(t, 1));
    });
    const terms = [...weights.keys()];
    // Match at word starts so "ai" doesn't hit "email" and "licens" hits "licenses"
    const res = terms.map(t => new RegExp('(^|[^a-z0-9])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    return catalog
      .map(p => {
        const name = p.name.toLowerCase();
        // Names also match mid-word for longer terms, so "vending" finds "AGVending"
        const score = res.reduce((s, re, i) => {
          const inName = re.test(name) || (terms[i].length >= 4 && name.includes(terms[i]));
          return s + weights.get(terms[i]) * (inName ? 3 : re.test(p.text) ? 1 : 0);
        }, 0);
        return { p, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(r => r.p);
  }

  function answer(q) {
    const s = q.toLowerCase();
    if (/\b(contact|email|phone|call|whatsapp|price|pricing|cost|quote|demo|buy|support)\b/.test(s)) {
      return addMsg('bot', el => {
        line(el, 'You can reach us here:');
        const ul = line(el, '', 'ul');
        ['Sales & general: contact@safecodeg.com', 'Product support: support@safecodeg.com', 'Phone / WhatsApp (India): +91 77027 21477']
          .forEach(t => line(ul, t, 'li'));
        contactLink(el, 'Or use the contact form →');
      });
    }
    if (/\b(where|office|offices|location|address|usa|india|wyoming|hyderabad)\b/.test(s)) {
      return addMsg('bot', 'Safe Code Group LLC has its headquarters in Rock Springs, Wyoming (USA) and an engineering office in LB Nagar, Hyderabad (India).');
    }
    if (/^\s*(hi|hello|hey|namaste)\b/.test(s)) {
      return addMsg('bot', 'Hi! Tell me what you need — for example “single sign-on”, “licensing”, “LMS” or “vending software” — and I’ll point you to the right product.');
    }
    const hits = search(q);
    if (!hits.length) {
      return addMsg('bot', el => {
        line(el, 'I couldn’t match that to one of our products. Our team can help directly.');
        contactLink(el, 'Ask our team →');
      });
    }
    addMsg('bot', el => {
      line(el, hits.length === 1 ? 'This product matches:' : 'These products match:');
      const ul = line(el, '', 'ul');
      hits.forEach(p => {
        const li = document.createElement('li');
        const b = document.createElement('b');
        b.textContent = p.name;
        li.appendChild(b);
        li.appendChild(document.createTextNode(` (${p.stage}) — ${p.desc}`));
        ul.appendChild(li);
      });
      contactLink(el, 'Ask about early access or licensing →');
    });
  }

  function toggle(open) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      if (!msgs.children.length) addMsg('bot', 'Hi! I can help you find the right Safe Code Group product, or share our contact details. What are you looking for?');
      input.focus();
    }
  }
  btn.addEventListener('click', () => toggle(panel.hidden));
  $('#finderClose').addEventListener('click', () => { toggle(false); btn.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { toggle(false); btn.focus(); } });

  function ask(text) {
    const q = text.trim().slice(0, 200);
    if (!q) return;
    addMsg('user', q);
    answer(q);
  }
  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); input.value = ''; });
  $$('#finderChips button').forEach(c => c.addEventListener('click', () => ask(c.textContent)));
})();

// ── FOOTER YEAR ──────────────────────────────────────────────────────────────
$('#year').textContent = new Date().getFullYear();
