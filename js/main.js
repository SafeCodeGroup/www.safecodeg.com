// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=mx+'px';cursor.style.top=my+'px';
});
function animRing(){
  rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
}animRing();
document.querySelectorAll('a,button,.service-row,.work-card,.faq-q,.testi-card,.p-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-grow'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-grow'));
});

// Nav scroll
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',scrollY>60);
});

// Mobile nav
document.getElementById('hamburger').addEventListener('click',()=>{
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>{
  document.getElementById('navLinks').classList.remove('open');
}));

// Hero orb follow
const hero=document.querySelector('.hero');
const orb=document.getElementById('heroOrb');
if(hero&&orb){
  hero.addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect();
    orb.style.left=(e.clientX-r.left)+'px';
    orb.style.top=(e.clientY-r.top)+'px';
  });
}

// Scroll reveal
const obs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'),i*70);
      obs.unobserve(e.target);
    }
  });
},{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ── 1. HERO TEXT STAGGER ────────────────────────────────────────────────────
(()=>{
  const title = document.querySelector('h1.hero-title');
  if(!title || !title.innerHTML) return;
  const words = title.innerHTML.split(/((?:<[^>]+>)|(?:<\/[^>]+>)|\s+)/);
  let rebuilt = '';
  let idx = 0;
  words.forEach(part => {
    if(!part) return;
    if(part.startsWith('<') || /^\s+$/.test(part)) { rebuilt += part; }
    else {
      rebuilt += `<span class="hw" style="display:inline-block;opacity:0;transform:translateY(28px);transition:opacity .6s cubic-bezier(.23,1,.32,1) ${idx*80}ms,transform .6s cubic-bezier(.23,1,.32,1) ${idx*80}ms">${part}</span>`;
      idx++;
    }
  });
  title.innerHTML = rebuilt;
  requestAnimationFrame(()=>{
    setTimeout(()=>{
      document.querySelectorAll('.hw').forEach(w=>{
        w.style.opacity='1';
        w.style.transform='translateY(0)';
      });
    }, 300);
  });
})();

// ── 2. ANIMATED COUNTER ROLL-UP ─────────────────────────────────────────────
function animateCount(el, target, duration=1800, suffix=''){
  let start = null;
  const step = ts => {
    if(!start) start = ts;
    const prog = Math.min((ts-start)/duration, 1);
    const ease = 1 - Math.pow(1-prog, 4);
    el.textContent = Math.round(ease * target) + suffix;
    if(prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const el = e.target;
    const val = parseInt(el.dataset.count);
    const suf = el.dataset.suffix || '';
    animateCount(el, val, 1600, suf);
    counterObs.unobserve(el);
  });
}, {threshold:.5});
// Tag stat values for counting
document.querySelectorAll('.asc-num').forEach(el => {
  const txt = el.textContent.replace(/[^0-9.]/g,'');
  const suf = el.textContent.replace(/[0-9.]/g,'').trim();
  if(txt) {
    el.dataset.count = txt;
    el.dataset.suffix = suf;
    el.textContent = '0' + suf;
    counterObs.observe(el);
  }
});
// About stat values
document.querySelectorAll('.about-stat-val').forEach(el => {
  const num = el.textContent.match(/\d+/);
  if(!num) return;
  const suf = el.textContent.replace(/\d+/,'');
  el.dataset.count = num[0];
  el.dataset.suffix = suf;
  el.textContent = '0' + suf;
  counterObs.observe(el);
});

// ── 3. PROCESS BAR ANIMATION ────────────────────────────────────────────────
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.pc-bar-fill').forEach((b,i)=>{
        setTimeout(()=>{ b.style.width=b.dataset.w+'%'; },i*180);
      });
      barObs.disconnect();
    }
  });
},{threshold:.3});
const barParent=document.querySelector('[data-w]')?.closest('div');
if(barParent)barObs.observe(barParent);

// Skill bars animation
const skillObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.skill-bar-fill').forEach((b,i)=>{
        setTimeout(()=>{ b.style.width=b.dataset.w+'%'; },i*120);
      });
      skillObs.disconnect();
    }
  });
},{threshold:.2});
const skillSection=document.getElementById('skillBars');
if(skillSection)skillObs.observe(skillSection);

// ── 4. WORK CARD 3D TILT ON HOVER ───────────────────────────────────────────
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-8px) scale(1.01)`;
    card.style.boxShadow = `${-x*20}px ${-y*20}px 60px rgba(0,0,0,.22)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1), box-shadow .5s';
    card.style.transform = '';
    card.style.boxShadow = '';
    setTimeout(()=>card.style.transition='', 500);
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

// ── 5. MAGNETIC BUTTONS ─────────────────────────────────────────────────────
document.querySelectorAll('.btn-fill,.btn-outline,.nav-cta,.submit-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * 0.35;
    const y = (e.clientY - r.top - r.height/2) * 0.35;
    btn.style.transform = `translate(${x}px,${y}px) scale(1.04)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform .4s cubic-bezier(.23,1,.32,1)';
    btn.style.transform = '';
    setTimeout(()=>btn.style.transition='', 400);
  });
  btn.addEventListener('mouseenter', () => btn.style.transition='none');
});

// ── 6. GLASS SERVICE CARDS — POINTER GLOW ────────────────────────────────────
document.querySelectorAll('.svc-glass').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
    card.style.background = `radial-gradient(180px circle at ${x}px ${y}px, rgba(255,255,255,.1), rgba(255,255,255,.04) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ── 7. TESTIMONIAL CARDS STAGGER ─────────────────────────────────────────────
const testiObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const cards = e.target.querySelectorAll('.testi-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(32px)';
      setTimeout(() => {
        card.style.transition = `opacity .6s cubic-bezier(.23,1,.32,1) ${i*100}ms, transform .6s cubic-bezier(.23,1,.32,1) ${i*100}ms`;
        card.style.opacity = '1';
        card.style.transform = '';
      }, 200);
    });
    testiObs.unobserve(e.target);
  });
}, {threshold:.15});
const testiGrid = document.querySelector('.testi-grid');
if(testiGrid) testiObs.observe(testiGrid);

// ── 8. PROCESS STEP CIRCLES — POP IN ────────────────────────────────────────
const psObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const circles = e.target.querySelectorAll('.ps-circle');
    circles.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'scale(0.4)';
      setTimeout(() => {
        c.style.transition = `opacity .5s cubic-bezier(.34,1.56,.64,1) ${i*100}ms, transform .5s cubic-bezier(.34,1.56,.64,1) ${i*100}ms`;
        c.style.opacity = '1';
        c.style.transform = 'scale(1)';
      }, 100);
    });
    psObs.unobserve(e.target);
  });
}, {threshold:.2});
const psGrid = document.querySelector('.process-steps-grid');
if(psGrid) psObs.observe(psGrid);

// ── 9. TYPEWRITER on hero eyebrow ────────────────────────────────────────────
(()=>{
  const el = document.querySelector('.hero-eyebrow span');
  if(!el || el.closest('[style*="display:none"]')) return;
  const phrases = ['Design & Web Agency', 'UI/UX Experts', 'Based in Hyderabad', 'Trusted by 28 Countries'];
  let pi = 0, ci = 0, deleting = false;
  el.textContent = '';
  const tick = () => {
    const phrase = phrases[pi % phrases.length];
    if(!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if(ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 65);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if(ci === 0) { deleting = false; pi++; setTimeout(tick, 300); return; }
      setTimeout(tick, 35);
    }
  };
  setTimeout(tick, 1200);
})();

// ── 10. SCROLL PROGRESS BAR ──────────────────────────────────────────────────
const progBar = document.createElement('div');
progBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#FF4D2E,#FF8C69);z-index:9999;width:0%;transition:width .1s;pointer-events:none';
document.body.appendChild(progBar);
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progBar.style.width = (window.scrollY / total * 100) + '%';
}, {passive:true});

// ── 11. SECTION BACKGROUND COLOUR SHIFT ON SCROLL ────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navEl = document.getElementById('navbar');
const sectionColorMap = {
  work: '', services: '', process: '', about: '', testimonials: '',
  faq: '', contact: '', pricing: ''
};
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting && e.intersectionRatio > 0.4) {
      const id = e.target.id;
      // Active nav link highlight
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.style.color = (a.getAttribute('href') === '#'+id) ? 'var(--coral)' : '';
      });
    }
  });
}, {threshold:.4});
sections.forEach(s => sectionObs.observe(s));

// ── 12. ABOUT BENTO CELLS — STAGGER REVEAL ───────────────────────────────────
const bentoObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const cells = e.target.querySelectorAll('.ab');
    cells.forEach((cell, i) => {
      cell.style.opacity = '0';
      cell.style.transform = 'translateY(24px) scale(0.97)';
      setTimeout(() => {
        cell.style.transition = `opacity .6s cubic-bezier(.23,1,.32,1) ${i*60}ms, transform .6s cubic-bezier(.23,1,.32,1) ${i*60}ms`;
        cell.style.opacity = '1';
        cell.style.transform = '';
      }, 100);
    });
    bentoObs.unobserve(e.target);
  });
}, {threshold:.1});
const bento = document.querySelector('.about-bento');
if(bento) bentoObs.observe(bento);

// ── 13. PARTICLE CANVAS on hero ──────────────────────────────────────────────
(()=>{
  const hero = document.querySelector('.hero');
  if(!hero) return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.45';
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const resize = () => {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, {passive:true});
  const COLORS = ['rgba(255,77,46,', 'rgba(255,140,105,', 'rgba(10,10,10,'];
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random()*W;
      this.y = Math.random()*H;
      this.r = Math.random()*1.8+.4;
      this.alpha = Math.random()*.45+.08;
      this.vx = (Math.random()-.5)*.25;
      this.vy = (Math.random()-.5)*.25;
      this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.color+this.alpha+')';
      ctx.fill();
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
    }
  }
  for(let i=0;i<80;i++) particles.push(new Particle());
  const loop = () => {
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{ p.update(); p.draw(); });
    requestAnimationFrame(loop);
  };
  loop();
})();

// ── 14. SMOOTH NAV LINK SCROLL ────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// ── Services accordion
function toggleSvc(header) {
  const row = header.closest('.svc-row');
  const isOpen = row.classList.contains('open');
  document.querySelectorAll('.svc-row').forEach(r => r.classList.remove('open'));
  if (!isOpen) row.classList.add('open');
}

// FAQ
document.querySelectorAll('.faq-item').forEach(item=>{
  item.querySelector('.faq-q').addEventListener('click',()=>{
    const was=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!was)item.classList.add('open');
  });
});

// ── Contact form — real submission with AI reply + db storage ──────────────
(async () => {
  // Load capabilities (non-blocking — page works without them)
  let sample = null, db = null;
  try { if(typeof claude!=='undefined') sample = await claude.use('sample'); } catch(_) {}
  try { if(typeof claude!=='undefined') db = await claude.use('db'); } catch(_) {}

  const form     = document.getElementById('contactForm');
  const btn      = document.getElementById('submitBtn');
  const btnLabel = document.getElementById('btnLabel');
  const spinner  = document.getElementById('btnSpinner');
  const status   = document.getElementById('formStatus');

  // Live validation helpers
  function validateField(input, errId, check) {
    const ok = check(input.value.trim());
    input.classList.toggle('invalid', !ok);
    input.classList.toggle('valid', ok);
    document.getElementById(errId).style.display = ok ? 'none' : 'block';
    return ok;
  }

  ['f-first','f-last','f-email','f-service','f-msg'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur', () => validateOnBlur(id));
    el.addEventListener('input', () => { if(el.classList.contains('invalid')) validateOnBlur(id); });
  });

  function validateOnBlur(id) {
    const el = document.getElementById(id);
    const v = el.value.trim();
    if(id === 'f-email') return validateField(el, 'err-email', s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
    return validateField(el, 'err-' + id.replace('f-',''), s => s.length > 0);
  }

  function validateAll() {
    const first   = validateField(document.getElementById('f-first'),   'err-first',   s => s.length > 0);
    const last    = validateField(document.getElementById('f-last'),    'err-last',    s => s.length > 0);
    const email   = validateField(document.getElementById('f-email'),   'err-email',   s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
    const service = validateField(document.getElementById('f-service'), 'err-service', s => s.length > 0);
    const msg     = validateField(document.getElementById('f-msg'),     'err-msg',     s => s.length > 5);
    return first && last && email && service && msg;
  }

  function setLoading(on) {
    btn.disabled = on;
    btnLabel.textContent = on ? 'Sending…' : 'Send message →';
    spinner.style.display = on ? 'inline' : 'none';
    btn.style.opacity = on ? '.75' : '1';
  }

  function showStatus(msg, isError = true) {
    status.style.display = 'block';
    status.style.color = isError ? '#FF4D2E' : '#22C55E';
    status.style.borderColor = isError ? 'rgba(255,77,46,.2)' : 'rgba(34,197,94,.2)';
    status.style.background = isError ? 'rgba(255,77,46,.08)' : 'rgba(34,197,94,.08)';
    status.textContent = msg;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      showStatus('Please fill in all required fields correctly.');
      return;
    }
    status.style.display = 'none';

    const data = {
      first:   document.getElementById('f-first').value.trim(),
      last:    document.getElementById('f-last').value.trim(),
      email:   document.getElementById('f-email').value.trim(),
      company: document.getElementById('f-company').value.trim(),
      service: document.getElementById('f-service').value,
      message: document.getElementById('f-msg').value.trim(),
      submittedAt: new Date().toISOString()
    };

    setLoading(true);

    // 1 — Save to db (best-effort)
    if (db) {
      try {
        const id = 'msg_' + Date.now();
        await db.doc('contacts/' + id).set(data);
      } catch(_) {}
    }

    // 2 — Show success screen immediately
    form.style.display = 'none';
    document.getElementById('successState').style.display = 'block';

    // Populate summary
    document.getElementById('submissionSummary').innerHTML =
      `<strong style="color:rgba(255,255,255,.6)">Your submission:</strong><br>` +
      `${data.first} ${data.last} · ${data.email}` +
      (data.company ? ` · ${data.company}` : '') +
      `<br>${data.service}<br><em style="color:rgba(255,255,255,.3)">"${data.message.slice(0,120)}${data.message.length > 120 ? '…' : ''}"</em>`;

    setLoading(false);

    // 3 — Generate AI personalised reply
    const replyEl = document.getElementById('aiReply');
    if (sample) {
      try {
        const prompt = `You are the friendly, professional team at SafeCodex, a UI/UX and web application design agency.
Write a warm, personalised acknowledgement email reply (plain text, 3 short paragraphs, no subject line, no sign-off needed — it will be appended).
The person who just contacted us:
- Name: ${data.first} ${data.last}
- Company: ${data.company || 'not specified'}
- Service they need: ${data.service}
- Their message: "${data.message}"

Make it feel human and specific to what they said. Mention their service area. Keep it under 80 words. Don't be sycophantic. End by saying we'll be in touch within one business day.`;

        let replyText = '';
        replyEl.innerHTML = '<div class="reply-loading" style="display:flex;gap:4px;align-items:center;padding:.5rem 0"><div style="width:6px;height:6px;background:rgba(255,77,46,.6);border-radius:50%;animation:tp .9s ease-in-out infinite"></div><div style="width:6px;height:6px;background:rgba(255,77,46,.6);border-radius:50%;animation:tp .9s ease-in-out .2s infinite"></div><div style="width:6px;height:6px;background:rgba(255,77,46,.6);border-radius:50%;animation:tp .9s ease-in-out .4s infinite"></div><span style="font-size:.8rem;color:rgba(255,255,255,.3);margin-left:4px">Writing your reply…</span></div>';

        await sample(prompt, {
          onText: ({ text }) => {
            replyText = text;
            replyEl.innerHTML = `<span style="white-space:pre-wrap">${text}</span><span style="display:inline-block;width:2px;height:14px;background:#FF4D2E;margin-left:2px;animation:tp .6s ease-in-out infinite;vertical-align:text-bottom"></span>`;
          }
        });

        // Final clean render without cursor
        replyEl.innerHTML = `<span style="white-space:pre-wrap">${replyText}</span>`;
        replyEl.insertAdjacentHTML('beforeend',
          `<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.07);font-size:.8rem;color:rgba(255,255,255,.4)">— The SafeCodex Team<br><a href="mailto:hello@safecodex.io" style="color:rgba(255,77,46,.7);text-decoration:none">hello@safecodex.io</a></div>`);
      } catch(err) {
        replyEl.textContent = `Hi ${data.first}, thanks for reaching out! We've received your message about ${data.service} and will get back to you within one business day. — The SafeCodex Team`;
      }
    } else {
      replyEl.textContent = `Hi ${data.first}, thanks for reaching out! We've received your message about ${data.service || 'your project'} and will get back to you within one business day. — The SafeCodex Team`;
    }
  });
})();

// Reset form back to empty state
function resetForm() {
  document.getElementById('successState').style.display = 'none';
  document.getElementById('contactForm').style.display = 'flex';
  document.getElementById('contactForm').reset();
  document.querySelectorAll('.fg input,.fg textarea,.fg select').forEach(el => {
    el.classList.remove('invalid','valid');
  });
  document.querySelectorAll('.field-err').forEach(el => el.style.display = 'none');
  document.getElementById('formStatus').style.display = 'none';
}

// Mobile nav style
const style=document.createElement('style');
style.textContent=`#navLinks.open{display:flex!important;flex-direction:column;position:fixed;top:64px;left:0;right:0;background:var(--warm);padding:2rem 5vw;border-bottom:1px solid var(--mid);gap:1.25rem;z-index:499}#navLinks.open a:not(.nav-cta){color:var(--ink)}`;
document.head.appendChild(style);

// ── SONY — SafeCodex AI Assistant ─────────────────────────────────────────
(async () => {
  // Inject Sony styles
  // Soni styles loaded from css/style.css
  document.head.appendChild(s);

  // Build widget HTML
  const html = `
    <button id="sony-btn" aria-label="Chat with Soni">
      <div class="sony-pulse"></div>
      <!-- Female avatar illustration -->
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Hair back -->
        <ellipse cx="19" cy="17" rx="11" ry="12.5" fill="#1a0a2e"/>
        <!-- Neck -->
        <rect x="16.5" y="26" width="5" height="5" rx="2" fill="#FBBF9C"/>
        <!-- Face -->
        <ellipse cx="19" cy="19" rx="8.5" ry="9.5" fill="#FBBF9C"/>
        <!-- Hair top flowing -->
        <path d="M9 16 C9 7 13 4 19 4 C25 4 29 7 29 16 C29 10 27 7 19 7 C11 7 9 10 9 16Z" fill="#1a0a2e"/>
        <!-- Hair sides -->
        <path d="M9.5 16 C8 19 8 23 9 26 C9.5 24 10 21 10.5 19Z" fill="#1a0a2e"/>
        <path d="M28.5 16 C30 19 30 23 29 26 C28.5 24 28 21 27.5 19Z" fill="#1a0a2e"/>
        <!-- Eyes -->
        <ellipse cx="15.5" cy="18.5" rx="1.6" ry="1.8" fill="#2d1a4e"/>
        <ellipse cx="22.5" cy="18.5" rx="1.6" ry="1.8" fill="#2d1a4e"/>
        <!-- Eye shine -->
        <circle cx="16.2" cy="17.8" r=".55" fill="white"/>
        <circle cx="23.2" cy="17.8" r=".55" fill="white"/>
        <!-- Eyebrows -->
        <path d="M13.5 16.2 C14.5 15.5 16.5 15.5 17.5 16.2" stroke="#4a2c6e" stroke-width=".9" stroke-linecap="round" fill="none"/>
        <path d="M20.5 16.2 C21.5 15.5 23.5 15.5 24.5 16.2" stroke="#4a2c6e" stroke-width=".9" stroke-linecap="round" fill="none"/>
        <!-- Smile -->
        <path d="M16 22.5 C17.2 23.8 20.8 23.8 22 22.5" stroke="#e8907a" stroke-width="1" stroke-linecap="round" fill="none"/>
        <!-- Lips -->
        <path d="M17 22 C18 22.8 20 22.8 21 22" stroke="#e8907a" stroke-width="1.2" stroke-linecap="round" fill="none"/>
        <!-- Nose -->
        <path d="M18.5 20.5 C18.8 21.2 19.2 21.2 19.5 20.5" stroke="#e8a080" stroke-width=".7" stroke-linecap="round" fill="none"/>
        <!-- Cheek blush -->
        <ellipse cx="13.5" cy="21" rx="2" ry="1" fill="rgba(255,150,130,.22)"/>
        <ellipse cx="24.5" cy="21" rx="2" ry="1" fill="rgba(255,150,130,.22)"/>
        <!-- Earrings small -->
        <circle cx="10.5" cy="21" r="1.2" fill="#FF4D2E" opacity=".9"/>
        <circle cx="27.5" cy="21" r="1.2" fill="#FF4D2E" opacity=".9"/>
      </svg>
    </button>
    <div id="sony-panel" role="dialog" aria-label="Soni — SafeCodex Assistant">
      <div id="sony-header">
        <div id="sony-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="11" rx="7" ry="7.5" fill="#0a0516"/>
            <rect x="10.5" y="17" width="3" height="3" rx="1.2" fill="#FBBF9C"/>
            <ellipse cx="12" cy="12" rx="5.5" ry="6" fill="#FBBF9C"/>
            <path d="M5.5 10 C5.5 4.5 8 3 12 3 C16 3 18.5 4.5 18.5 10 C18.5 6 16.5 4.5 12 4.5 C7.5 4.5 5.5 6 5.5 10Z" fill="#0a0516"/>
            <path d="M6 10.5 C5 12.5 5 15 6 17 C6.5 15.5 7 13.5 7 12Z" fill="#0a0516"/>
            <path d="M18 10.5 C19 12.5 19 15 18 17 C17.5 15.5 17 13.5 17 12Z" fill="#0a0516"/>
            <ellipse cx="9.5" cy="11.8" rx="1" ry="1.1" fill="#2d1a4e"/>
            <ellipse cx="14.5" cy="11.8" rx="1" ry="1.1" fill="#2d1a4e"/>
            <circle cx="9.9" cy="11.4" r=".35" fill="white"/>
            <circle cx="14.9" cy="11.4" r=".35" fill="white"/>
            <path d="M8.5 10.3 C9.2 9.8 10.5 9.8 11.2 10.3" stroke="#4a2c6e" stroke-width=".6" stroke-linecap="round" fill="none"/>
            <path d="M12.8 10.3 C13.5 9.8 14.8 9.8 15.5 10.3" stroke="#4a2c6e" stroke-width=".6" stroke-linecap="round" fill="none"/>
            <path d="M10 14.2 C10.8 15 13.2 15 14 14.2" stroke="#e8907a" stroke-width=".8" stroke-linecap="round" fill="none"/>
            <ellipse cx="8" cy="13.5" rx="1.2" ry=".6" fill="rgba(255,150,130,.2)"/>
            <ellipse cx="16" cy="13.5" rx="1.2" ry=".6" fill="rgba(255,150,130,.2)"/>
          </svg>
        </div>
        <div>
          <div id="sony-name">Soni</div>
          <div id="sony-status">SafeCodex Assistant · Online</div>
        </div>
        <button id="sony-close" aria-label="Close">✕</button>
      </div>
      <div id="sony-messages"></div>
      <div id="sony-suggestions">
        <button class="sony-chip">What services do you offer?</button>
        <button class="sony-chip">How much does a project cost?</button>
        <button class="sony-chip">How long does it take?</button>
        <button class="sony-chip">Do you do mobile apps?</button>
      </div>
      <div id="sony-input-row">
        <input id="sony-input" type="text" placeholder="Ask Sony anything…" autocomplete="off" maxlength="400"/>
        <button id="sony-send" aria-label="Send">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 3l5 4-5 4" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  `;
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  // References
  const btn      = document.getElementById('sony-btn');
  const panel    = document.getElementById('sony-panel');
  const closeBtn = document.getElementById('sony-close');
  const msgs     = document.getElementById('sony-messages');
  const input    = document.getElementById('sony-input');
  const sendBtn  = document.getElementById('sony-send');
  const chips    = document.querySelectorAll('.sony-chip');

  // State
  let open = false;
  let history = []; // [{role,content}]
  let isTyping = false;
  let sampleCap = null;

  // Load sample capability
  try { if(typeof claude!=='undefined') sampleCap = await claude.use('sample'); } catch(_){}

  // Toggle panel
  function togglePanel() {
    open = !open;
    panel.classList.toggle('open', open);
    if (open && msgs.children.length === 0) {
      appendBot("Hi! I'm **Soni** 👋, SafeCodex's assistant. I can answer any questions about our services, process, pricing, timeline — whatever's on your mind. What would you like to know?");
    }
    if (open) setTimeout(() => input.focus(), 320);
  }

  btn.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', () => { open = false; panel.classList.remove('open'); });

  // Click chips
  chips.forEach(c => c.addEventListener('click', () => {
    if (!open) togglePanel();
    input.value = c.textContent;
    sendMessage();
  }));

  // Send on enter
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
  sendBtn.addEventListener('click', sendMessage);

  // Append helpers
  const SONI_AV = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="11" rx="7" ry="7.5" fill="#0a0516"/><rect x="10.5" y="17" width="3" height="3" rx="1.2" fill="#FBBF9C"/><ellipse cx="12" cy="12" rx="5.5" ry="6" fill="#FBBF9C"/><path d="M5.5 10 C5.5 4.5 8 3 12 3 C16 3 18.5 4.5 18.5 10 C18.5 6 16.5 4.5 12 4.5 C7.5 4.5 5.5 6 5.5 10Z" fill="#0a0516"/><path d="M6 10.5 C5 12.5 5 15 6 17 C6.5 15.5 7 13.5 7 12Z" fill="#0a0516"/><path d="M18 10.5 C19 12.5 19 15 18 17 C17.5 15.5 17 13.5 17 12Z" fill="#0a0516"/><ellipse cx="9.5" cy="11.8" rx="1" ry="1.1" fill="#2d1a4e"/><ellipse cx="14.5" cy="11.8" rx="1" ry="1.1" fill="#2d1a4e"/><circle cx="9.9" cy="11.4" r=".35" fill="white"/><circle cx="14.9" cy="11.4" r=".35" fill="white"/><path d="M8.5 10.3 C9.2 9.8 10.5 9.8 11.2 10.3" stroke="#4a2c6e" stroke-width=".6" stroke-linecap="round" fill="none"/><path d="M12.8 10.3 C13.5 9.8 14.8 9.8 15.5 10.3" stroke="#4a2c6e" stroke-width=".6" stroke-linecap="round" fill="none"/><path d="M10 14.2 C10.8 15 13.2 15 14 14.2" stroke="#e8907a" stroke-width=".8" stroke-linecap="round" fill="none"/><ellipse cx="8" cy="13.5" rx="1.2" ry=".6" fill="rgba(255,150,130,.2)"/><ellipse cx="16" cy="13.5" rx="1.2" ry=".6" fill="rgba(255,150,130,.2)"/></svg>`;

  function appendBot(md) {
    const row = document.createElement('div');
    row.className = 'sony-msg';
    row.innerHTML = `<div class="sony-msg-av bot">${SONI_AV}</div><div class="sony-bubble bot">${mdToHtml(md)}</div>`;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function appendUser(text) {
    const row = document.createElement('div');
    row.className = 'sony-msg user';
    row.innerHTML = `<div class="sony-msg-av usr">U</div><div class="sony-bubble usr">${esc(text)}</div>`;
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'sony-msg';
    el.id = 'sony-typing-row';
    el.innerHTML = `<div class="sony-msg-av bot">${SONI_AV}</div><div class="sony-typing"><span></span><span></span><span></span></div>`;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('sony-typing-row');
    if (el) el.remove();
  }

  function streamBotRow() {
    const row = document.createElement('div');
    row.className = 'sony-msg';
    const bubble = document.createElement('div');
    bubble.className = 'sony-bubble bot';
    row.innerHTML = '';
    const av = document.createElement('div');
    av.className = 'sony-msg-av bot';
    av.innerHTML = SONI_AV;
    row.appendChild(av);
    row.appendChild(bubble);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return bubble;
  }

  // Simple markdown → HTML
  function mdToHtml(t) {
    return t
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/`(.+?)`/g,'<code style="background:rgba(255,255,255,.1);padding:1px 5px;border-radius:4px;font-size:.8em">$1</code>')
      .replace(/\n/g,'<br>');
  }

  function esc(t) { return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  const SYSTEM = `You are Soni, the friendly and knowledgeable AI assistant for SafeCodex — a UI/UX design and web application agency based in Hyderabad, India. You are female, warm, and approachable.

About SafeCodex:
- Founded 2018. Team of 12 designers, engineers, and strategists.
- Services: UI/UX Design, Web App Development (React/Next.js/Node), Mobile Design (iOS/Android/Flutter), Design Systems (Figma/Storybook/tokens), Brand & Visual Identity, UX Audit & Consulting.
- Pricing: Starter from $3,500 (up to 8 screens), Growth $9,800 (full product), Retainer $4,200/month.
- Typical timelines: Starter 3–4 weeks, Growth 8–14 weeks.
- We work with startups, scale-ups, and product companies worldwide (28 countries).
- 140+ projects shipped, 96% client return rate, 98% on-time delivery.
- Contact: hello@safecodex.io · 040 7777 0007 · WhatsApp: +91 40 7777 0007 (wa.me/914077770007) · LGF 23, Sahara Complex, LB Nagar, Hyderabad, Telangana, India.
- Notable work: Meridian (SaaS analytics), Petal (health app), Folio (fintech), Sphere (AI OS), Lumen (finance), Mira (voice commerce), Chord (music studio), Axis (analytics), Zen (focus app).

Personality:
- Warm, knowledgeable, concise. Use short paragraphs.
- Never make up information not in the context above. If unsure, say so and suggest emailing hello@safecodex.io.
- Sign your name as "Soni" only on first reply.
- Keep answers under 120 words unless the question genuinely needs more detail.
- Use light markdown (**bold**, *italic*) for emphasis. No bullet walls.`;

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isTyping) return;
    input.value = '';
    sendBtn.disabled = true;
    isTyping = true;

    appendUser(text);
    history.push({ role: 'user', content: text });

    // Hide chips after first use
    document.getElementById('sony-suggestions').style.display = 'none';

    showTyping();
    await new Promise(r => setTimeout(r, 500)); // natural pause
    removeTyping();

    const bubble = streamBotRow();
    let fullText = '';

    try {
      if (sampleCap) {
        const messages = [
          { role: 'user', content: SYSTEM + '\n\n---\nUser: ' + history[0].content }
        ];
        // Build proper alternating history for multi-turn
        const apiMsgs = [];
        let sysAdded = false;
        for (let i = 0; i < history.length; i++) {
          const m = history[i];
          if (m.role === 'user' && !sysAdded) {
            apiMsgs.push({ role: 'user', content: SYSTEM + '\n\n---\n' + m.content });
            sysAdded = true;
          } else {
            apiMsgs.push(m);
          }
        }
        await sampleCap(apiMsgs, {
          onText: ({ text }) => {
            fullText = text;
            bubble.innerHTML = mdToHtml(text) + '<span style="display:inline-block;width:2px;height:12px;background:#FF4D2E;margin-left:2px;animation:tp .6s ease-in-out infinite;vertical-align:text-bottom"></span>';
            msgs.scrollTop = msgs.scrollHeight;
          }
        });
        bubble.innerHTML = mdToHtml(fullText);
        history.push({ role: 'assistant', content: fullText });
      } else {
        // Fallback if sample not available
        const fallback = "I'm Soni, SafeCodex's assistant! It looks like I need a moment to get set up. In the meantime, feel free to email us at **hello@safecodex.io** and the team will get back to you within one business day.";
        bubble.innerHTML = mdToHtml(fallback);
        history.push({ role: 'assistant', content: fallback });
      }
    } catch(err) {
      bubble.innerHTML = mdToHtml("Sorry, I hit a snag there. Try again or reach us directly at **hello@safecodex.io**.");
    }

    msgs.scrollTop = msgs.scrollHeight;
    isTyping = false;
    sendBtn.disabled = false;
    input.focus();
  }
})();