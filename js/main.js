/* ═══════════════════════════════════════════════════════
   SafeCodex — Enterprise Software Company
   JavaScript by SafeCodex Studio
═══════════════════════════════════════════════════════ */

'use strict';

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('visible'), i*70);
      revealObs.unobserve(e.target);
    }
  });
},{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

// ── NAV SCROLL ───────────────────────────────────────────────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY>60);
},{passive:true});

// ── MOBILE NAV ───────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
function setNavOpen(on){
  navLinks?.classList.toggle('open',on);
  hamburger?.setAttribute('aria-expanded',on?'true':'false');
}
hamburger?.addEventListener('click',()=>setNavOpen(!navLinks?.classList.contains('open')));
navLinks?.querySelectorAll('a,button').forEach(a=>a.addEventListener('click',()=>setNavOpen(false)));
document.addEventListener('keydown',e=>{ if(e.key==='Escape') setNavOpen(false); });
const navStyle = document.createElement('style');
navStyle.textContent=`#navLinks.open{display:flex!important;flex-direction:column;position:fixed;top:64px;left:0;right:0;background:rgba(5,13,31,.97);padding:2rem 5vw;border-bottom:1px solid rgba(255,255,255,.07);gap:1.25rem;z-index:499;backdrop-filter:blur(20px)}#navLinks.open a{display:block;color:rgba(255,255,255,.8)!important;font-size:1rem}#navLinks.open button{align-self:flex-start}`;
document.head.appendChild(navStyle);

// ── SMOOTH SCROLL ────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    const target=href.length>1&&document.querySelector(href);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

// ── ANIMATED COUNTERS ────────────────────────────────────────────────────────
function animCount(el, target, duration=1800){
  const suffix = el.dataset.suffix||'';
  let start=null;
  const step=ts=>{
    if(!start) start=ts;
    const prog=Math.min((ts-start)/duration,1);
    const ease=1-Math.pow(1-prog,4);
    el.textContent=Math.round(ease*target)+suffix;
    if(prog<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const countObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target;
    const val=parseFloat(el.dataset.count)||0;
    animCount(el,val,1600);
    countObs.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>countObs.observe(el));



// ── TYPEWRITER on hero badge ──────────────────────────────────────────────────
(()=>{
  const el=document.querySelector('.hero-badge span');
  if(!el) return;
  const phrases=['Trusted by 120+ Enterprises Worldwide','ISO 27001 & SOC 2 Certified','Offices in the USA & India','Serving 28+ Countries'];
  let pi=0,ci=0,deleting=false;
  el.textContent='';
  const tick=()=>{
    const phrase=phrases[pi%phrases.length];
    if(!deleting){ el.textContent=phrase.slice(0,++ci); if(ci===phrase.length){deleting=true;setTimeout(tick,2200);return;} setTimeout(tick,55); }
    else{ el.textContent=phrase.slice(0,--ci); if(ci===0){deleting=false;pi++;setTimeout(tick,350);return;} setTimeout(tick,30); }
  };
  setTimeout(tick,1000);
})();

// ── MAGNETIC BUTTONS ─────────────────────────────────────────────────────────
document.querySelectorAll('.btn-primary,.btn-secondary,.nav-cta,.submit-btn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.35;
    const y=(e.clientY-r.top-r.height/2)*.35;
    btn.style.transform=`translate(${x}px,${y}px) scale(1.04)`;
    btn.style.transition='none';
  });
  btn.addEventListener('mouseleave',()=>{
    btn.style.transition='transform .4s cubic-bezier(.23,1,.32,1),background .25s,box-shadow .25s';
    btn.style.transform='';
  });
});

// ── TECH GRID STAGGER ────────────────────────────────────────────────────────
const techObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.querySelectorAll('.tech-item').forEach((item,i)=>{
      item.style.opacity='0';
      item.style.transform='translateY(16px) scale(.95)';
      setTimeout(()=>{
        item.style.transition=`opacity .5s cubic-bezier(.23,1,.32,1) ${i*50}ms,transform .5s cubic-bezier(.23,1,.32,1) ${i*50}ms`;
        item.style.opacity='1';
        item.style.transform='';
      },100);
    });
    techObs.unobserve(e.target);
  });
},{threshold:.15});
const techGrid=document.querySelector('.tech-grid');
if(techGrid) techObs.observe(techGrid);

// ── PARTICLE CANVAS ──────────────────────────────────────────────────────────
(()=>{
  const hero=document.querySelector('.hero');
  if(!hero) return;
  const canvas=document.createElement('canvas');
  canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.5';
  hero.prepend(canvas);
  const ctx=canvas.getContext('2d');
  let W,H,particles=[];
  const resize=()=>{ W=canvas.width=hero.offsetWidth; H=canvas.height=hero.offsetHeight; };
  resize();
  window.addEventListener('resize',resize,{passive:true});
  const COLS=['rgba(0,102,255,','rgba(0,194,255,','rgba(0,230,118,'];
  class P{
    constructor(){this.reset();}
    reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.r=Math.random()*1.5+.3;this.a=Math.random()*.4+.05;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;this.c=COLS[Math.floor(Math.random()*COLS.length)];}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=this.c+this.a+')';ctx.fill();}
    update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();}
  }
  for(let i=0;i<90;i++) particles.push(new P());
  const loop=()=>{ ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(loop); };
  loop();
})();

// ── @keyframes spin for form button ─────────────────────────────────────────
const spinStyle=document.createElement('style');
spinStyle.textContent='@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(spinStyle);

// ── CONTACT FORM ─────────────────────────────────────────────────────────────
(async()=>{
  let sample=null;
  try{ if(typeof claude!=='undefined') sample=await claude.use('sample'); }catch(_){}

  const form   =document.getElementById('contactForm');
  const btn    =document.getElementById('submitBtn');
  const btnLbl =document.getElementById('btnLabel');
  const spinner=document.getElementById('btnSpinner');
  const status =document.getElementById('formStatus');
  if(!form) return;

  function validateField(id,errId,check){
    const el=document.getElementById(id);
    if(!el) return true;
    const ok=check(el.value.trim());
    el.classList.toggle('invalid',!ok);
    el.classList.toggle('valid',ok);
    const err=document.getElementById(errId);
    if(err) err.style.display=ok?'none':'block';
    return ok;
  }
  ['f-first','f-last','f-email','f-service','f-msg'].forEach(id=>{
    const el=document.getElementById(id);
    if(!el) return;
    el.addEventListener('blur',()=>validateOnBlur(id));
    el.addEventListener('input',()=>{ if(el.classList.contains('invalid')) validateOnBlur(id); });
  });
  function validateOnBlur(id){
    if(id==='f-email') return validateField(id,'err-email',s=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
    const errId='err-'+id.replace('f-','');
    return validateField(id,errId,s=>s.length>(id==='f-msg'?5:0));
  }
  function validateAll(){
    const a=validateField('f-first','err-first',s=>s.length>0);
    const b=validateField('f-last','err-last',s=>s.length>0);
    const c=validateField('f-email','err-email',s=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
    const d=validateField('f-service','err-service',s=>s.length>0);
    const e=validateField('f-msg','err-msg',s=>s.length>5);
    return a&&b&&c&&d&&e;
  }
  function setLoading(on){
    btn.disabled=on;
    if(btnLbl) btnLbl.textContent=on?'Sending…':'Send enquiry →';
    if(spinner) spinner.style.display=on?'inline':'none';
    btn.style.opacity=on?'.7':'1';
  }
  function showStatus(msg,isErr=true){
    if(!status) return;
    status.style.display='block';
    status.style.cssText=`display:block;padding:.75rem 1rem;border-radius:8px;font-size:.85rem;background:${isErr?'rgba(220,38,38,.08)':'rgba(22,163,74,.08)'};color:${isErr?'#DC2626':'#16A34A'};border:1px solid ${isErr?'rgba(220,38,38,.2)':'rgba(22,163,74,.2)'}`;
    status.textContent=msg;
  }

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!validateAll()){ showStatus('Please fill in all required fields correctly.'); return; }
    status.style.display='none';
    const data={
      first:document.getElementById('f-first').value.trim(),
      last:document.getElementById('f-last').value.trim(),
      email:document.getElementById('f-email').value.trim(),
      company:document.getElementById('f-company')?.value.trim()||'',
      service:document.getElementById('f-service').value,
      message:document.getElementById('f-msg').value.trim(),
      website:document.getElementById('f-website')?.value||''
    };
    setLoading(true);
    // Send to the server; only show success once the email has gone out
    try{
      const resp=await fetch('contact.php',{method:'POST',body:new URLSearchParams(data)});
      const result=await resp.json().catch(()=>({}));
      if(!resp.ok||!result.ok) throw new Error(result.error||'');
    }catch(err){
      setLoading(false);
      showStatus(err.message||'Could not send your enquiry. Please email contact@safecodeg.com directly.');
      return;
    }

    form.style.display='none';
    const succ=document.getElementById('successState');
    if(succ) succ.style.display='block';
    const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const sumEl=document.getElementById('submissionSummary');
    if(sumEl) sumEl.innerHTML=`<strong>Your enquiry:</strong><br>${esc(data.first)} ${esc(data.last)} · ${esc(data.email)}${data.company?' · '+esc(data.company):''}<br>${esc(data.service)}<br><em style="color:var(--muted)">"${esc(data.message.slice(0,120))}${data.message.length>120?'…':''}"</em>`;
    setLoading(false);

    const replyEl=document.getElementById('aiReply');
    const PROMPT=`You are the professional client success team at Safe Code Group LLC (SafeCodex), an enterprise software company with offices in Wyoming, USA and Hyderabad, India. We build custom software, cloud solutions, AI/ML systems, cybersecurity, and ERP integrations.

Write a warm, professional acknowledgement reply (2–3 short paragraphs, plain text, no subject line). The enquiry:
- Name: ${data.first} ${data.last}
- Company: ${data.company||'not specified'}
- Service: ${data.service}
- Message: "${data.message}"

Reference their specific service area. Mention that a technical team member will respond within one business day. Keep it under 90 words. Professional but human. Do not be sycophantic.`;

    if(sample&&replyEl){
      let text='';
      try{
        await sample(PROMPT,{
          onText:({text:t})=>{
            text=t;
            replyEl.innerHTML=`<span style="white-space:pre-wrap">${t}</span><span style="display:inline-block;width:2px;height:13px;background:#0066FF;margin-left:2px;animation:tdot .6s ease-in-out infinite;vertical-align:text-bottom"></span>`;
          }
        });
        replyEl.innerHTML=`<span style="white-space:pre-wrap">${text}</span><div style="margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.07);font-size:.78rem;color:rgba(255,255,255,.35)">— Safe Code Group · <a href="mailto:contact@safecodeg.com" style="color:#3385FF;text-decoration:none">contact@safecodeg.com</a></div>`;
      }catch(err){
        replyEl.textContent=`Hi ${data.first}, thank you for reaching out. We've received your enquiry about ${data.service} and a member of our technical team will get back to you within one business day. — SafeCodex Team`;
      }
    } else if(replyEl){
      replyEl.textContent=`Hi ${data.first}, thank you for your enquiry about ${data.service||'our services'}. Our technical team will review your requirements and respond within one business day with an initial assessment. — Safe Code Group`;
    }
  });
})();

function resetForm(){
  const succ=document.getElementById('successState');
  const form=document.getElementById('contactForm');
  if(succ) succ.style.display='none';
  if(form){ form.style.display='flex'; form.reset(); }
  document.querySelectorAll('.fg input,.fg textarea,.fg select').forEach(el=>el.classList.remove('invalid','valid'));
  document.querySelectorAll('.field-err').forEach(el=>el.style.display='none');
  const status=document.getElementById('formStatus');
  if(status) status.style.display='none';
}

// ── SONI AI ASSISTANT ────────────────────────────────────────────────────────
(async()=>{
  const btn    =document.getElementById('sony-btn');
  const panel  =document.getElementById('sony-panel');
  const closeB =document.getElementById('sony-close');
  const msgs   =document.getElementById('sony-messages');
  const input  =document.getElementById('sony-input');
  const sendB  =document.getElementById('sony-send');
  const chips  =document.querySelectorAll('.sony-chip');
  if(!btn||!panel) return;

  let open=false, history=[], isTyping=false, sampleCap=null;
  try{ if(typeof claude!=='undefined') sampleCap=await claude.use('sample'); }catch(_){}

  const SONI_AV=`<svg viewBox="0 0 40 40" width="26" height="26" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="av1" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#1e3a6e"/><stop offset="100%" stop-color="#0a1628"/></radialGradient><radialGradient id="av2" cx="50%" cy="35%" r="55%"><stop offset="0%" stop-color="#FFD4A8"/><stop offset="100%" stop-color="#F5A97A"/></radialGradient><radialGradient id="av3" cx="50%" cy="0%" r="80%"><stop offset="0%" stop-color="#3D1F6B"/><stop offset="100%" stop-color="#1A0A30"/></radialGradient><linearGradient id="av4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0066FF"/><stop offset="100%" stop-color="#00C2FF"/></linearGradient></defs><circle cx="20" cy="20" r="20" fill="url(#av1)"/><path d="M6 40 C6 32 12 29 20 29 C28 29 34 32 34 40Z" fill="url(#av4)"/><rect x="17" y="26" width="6" height="5" rx="3" fill="url(#av2)"/><ellipse cx="20" cy="17" rx="11" ry="12" fill="url(#av3)"/><ellipse cx="20" cy="19" rx="8.5" ry="9" fill="url(#av2)"/><path d="M9 16 C9 6 13 3 20 3 C27 3 31 6 31 16 C30 10 27 8 20 8 C13 8 10 10 9 16Z" fill="url(#av3)"/><path d="M9.5 16 C8 20 8 25 9.5 28 C10 26 11 22 11.5 19Z" fill="url(#av3)"/><path d="M30.5 16 C32 20 32 25 30.5 28 C30 26 29 22 28.5 19Z" fill="url(#av3)"/><path d="M13.5 15.5 C15 14.5 17.5 14.5 19 15.5" stroke="#2a0f4a" stroke-width="1.2" stroke-linecap="round" fill="none"/><path d="M21 15.5 C22.5 14.5 25 14.5 26.5 15.5" stroke="#2a0f4a" stroke-width="1.2" stroke-linecap="round" fill="none"/><ellipse cx="15.8" cy="18.5" rx="2.6" ry="2.1" fill="#1a0830"/><circle cx="15.8" cy="18.6" r="1.5" fill="#4a2080"/><circle cx="15.8" cy="18.6" r=".8" fill="#0d0618"/><circle cx="16.6" cy="17.7" r=".7" fill="white"/><ellipse cx="24.2" cy="18.5" rx="2.6" ry="2.1" fill="#1a0830"/><circle cx="24.2" cy="18.6" r="1.5" fill="#4a2080"/><circle cx="24.2" cy="18.6" r=".8" fill="#0d0618"/><circle cx="25" cy="17.7" r=".7" fill="white"/><path d="M16.5 24 C18 22.8 22 22.8 23.5 24" fill="#E8725A"/><path d="M16.5 24 C18 25.5 22 25.5 23.5 24" fill="#E8725A"/><path d="M16.5 24 C18.5 24.5 21.5 24.5 23.5 24" stroke="#C4402A" stroke-width=".5" fill="none"/><ellipse cx="12" cy="22" rx="2.5" ry="1.3" fill="rgba(255,130,110,.2)"/><ellipse cx="28" cy="22" rx="2.5" ry="1.3" fill="rgba(255,130,110,.2)"/><circle cx="10.5" cy="20" r="1.4" fill="#FFD700"/><ellipse cx="10.5" cy="23" rx=".9" ry="1.5" fill="#FFD700"/><circle cx="29.5" cy="20" r="1.4" fill="#FFD700"/><ellipse cx="29.5" cy="23" rx=".9" ry="1.5" fill="#FFD700"/></svg>`;

  const SYSTEM=`You are Rsoni, the professional AI assistant for Safe Code Group LLC (SafeCodex) — an enterprise software company with offices in Wyoming, USA and Hyderabad, India. You are helpful, concise, and professional.

Company facts:
- Services: Custom Software Development, Cloud & DevOps (AWS/Azure/K8s), AI/ML & Data Engineering, Cybersecurity (VAPT/SOC2/ISO27001), ERP & System Integration, Mobile Apps (React Native/Flutter)
- Products: CodeVault ERP (manufacturing ERP, 320+ companies), NexusAI Platform (AI/MLOps), ShieldOps SIEM (security monitoring)
- Clients: 120+ enterprises across 28+ countries
- Certifications: ISO 27001, SOC 2, CMMI Level 3
- Uptime SLA: 99.9%
- Team: 200+ engineers and consultants
- Founded: 2022 | HQ: Rock Springs, Wyoming, USA | India office: LB Nagar, Hyderabad, Telangana
- LinkedIn: https://www.linkedin.com/company/safecodegroup
- Phone: +91 7702721477 | WhatsApp: +91 7702721477 | Email: contact@safecodeg.com
- Delivery: Agile sprints, typical project 8–24 weeks
- Keep replies under 100 words unless the question genuinely needs more.
- Sign as "Rsoni" only on first reply.`;

  function togglePanel(){
    open=!open;
    panel.classList.toggle('open',open);
    if(open && msgs.children.length===0){
      appendBot("Hi! I'm **Rsoni**, SafeCodex's AI assistant. I can tell you about our software services, products, delivery process, or help you get in touch with our team. What would you like to know?");
    }
    if(open) setTimeout(()=>input?.focus(),320);
  }
  btn.addEventListener('click',togglePanel);
  closeB?.addEventListener('click',()=>{ open=false; panel.classList.remove('open'); });
  chips.forEach(c=>c.addEventListener('click',()=>{ if(!open) togglePanel(); if(input) input.value=c.textContent; sendMessage(); }));
  input?.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMessage(); } });
  sendB?.addEventListener('click',sendMessage);

  function appendBot(md){
    const row=document.createElement('div');
    row.className='sony-msg';
    row.innerHTML=`<div class="sony-msg-av bot">${SONI_AV}</div><div class="sony-bubble bot">${mdToHtml(md)}</div>`;
    msgs?.appendChild(row);
    if(msgs) msgs.scrollTop=msgs.scrollHeight;
  }
  function appendUser(text){
    const row=document.createElement('div');
    row.className='sony-msg user';
    row.innerHTML=`<div class="sony-msg-av usr">U</div><div class="sony-bubble usr">${esc(text)}</div>`;
    msgs?.appendChild(row);
    if(msgs) msgs.scrollTop=msgs.scrollHeight;
  }
  function showTyping(){
    const el=document.createElement('div');
    el.className='sony-msg'; el.id='sony-typing-row';
    el.innerHTML=`<div class="sony-msg-av bot">${SONI_AV}</div><div class="sony-typing"><span></span><span></span><span></span></div>`;
    msgs?.appendChild(el);
    if(msgs) msgs.scrollTop=msgs.scrollHeight;
  }
  function removeTyping(){ document.getElementById('sony-typing-row')?.remove(); }
  function streamRow(){
    const row=document.createElement('div');
    row.className='sony-msg';
    const av=document.createElement('div'); av.className='sony-msg-av bot'; av.innerHTML=SONI_AV;
    const bubble=document.createElement('div'); bubble.className='sony-bubble bot';
    row.appendChild(av); row.appendChild(bubble);
    msgs?.appendChild(row);
    return bubble;
  }
  function mdToHtml(t){ return t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/\n/g,'<br>'); }
  function esc(t){ return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  async function sendMessage(){
    const text=input?.value.trim();
    if(!text||isTyping) return;
    if(input) input.value='';
    if(sendB) sendB.disabled=true;
    isTyping=true;
    appendUser(text);
    history.push({role:'user',content:text});
    document.getElementById('sony-suggestions')?.style.setProperty('display','none');
    showTyping();
    await new Promise(r=>setTimeout(r,400));
    removeTyping();
    const bubble=streamRow();
    let fullText='';

    // Build messages array — system prompt prepended to first user message
    const apiMessages = history.map((m,i)=>{
      if(m.role==='user' && i===0){
        return {role:'user', content: SYSTEM + '\n\n---\nUser question: ' + m.content};
      }
      return {role: m.role, content: m.content};
    });

    try{
      // Try Claude artifact capability first
      if(sampleCap){
        await sampleCap(apiMessages,{
          onText:({text:t})=>{
            fullText=t;
            bubble.innerHTML=mdToHtml(t)+'<span style="display:inline-block;width:2px;height:12px;background:#0066FF;margin-left:2px;animation:tdot .6s ease-in-out infinite;vertical-align:text-bottom"></span>';
            if(msgs) msgs.scrollTop=msgs.scrollHeight;
          }
        });
        bubble.innerHTML=mdToHtml(fullText);
      } else {
        // No server-side model proxy: answer from the built-in replies below
        throw new Error('offline');
      }
      history.push({role:'assistant', content:fullText});

    }catch(err){
      // Smart fallback — answer common questions locally
      const q = text.toLowerCase();
      let reply='';
      if(q.includes('service')||q.includes('what do you do')||q.includes('offer'))
        reply='We offer **Custom Software Development**, **Cloud & DevOps** (AWS/Azure/K8s), **AI/ML & Data Engineering**, **Cybersecurity** (VAPT/SOC2/ISO27001), **ERP & System Integration**, and **Mobile App Development** (React Native/Flutter).';
      else if(q.includes('product'))
        reply='SafeCodex has three products: **CodeVault ERP** (manufacturing & logistics, 320+ companies), **NexusAI Platform** (AI/MLOps, 18M+ predictions/day), and **ShieldOps SIEM** (real-time security monitoring, 2.4B events/day).';
      else if(q.includes('price')||q.includes('cost')||q.includes('how much'))
        reply='Project costs depend on scope and complexity. Custom software projects typically start from ₹8–15 lakhs. Please reach out at **contact@safecodeg.com** or call **+91 7702721477** for a free estimate.';
      else if(q.includes('contact')||q.includes('reach')||q.includes('email')||q.includes('phone'))
        reply='📧 **contact@safecodeg.com**\n📞 **+91 7702721477**\n📍 USA: Rock Springs, Wyoming 82901\n📍 India: LGF 23, Sahara Complex, LB Nagar, Hyderabad, Telangana\n💬 WhatsApp: +91 7702721477';
      else if(q.includes('how long')||q.includes('timeline')||q.includes('time'))
        reply='Typical timelines: Discovery & Architecture (2–3 weeks), Development sprints (8–20 weeks), QA & Testing (2–3 weeks), Deployment (1 week). Total: **12–26 weeks** depending on complexity.';
      else if(q.includes('case study')||q.includes('client')||q.includes('example'))
        reply='Key projects include:\n- **CodeVault ERP** for Bharat Heavy Industrials — 60% efficiency gain\n- **ShieldOps SIEM** for IndusInd Bank — 84% fewer security incidents\n- **NexusAI** for Apollo Hospitals — 91% diagnostic accuracy';
      else if(q.includes('location')||q.includes('where')||q.includes('hyderabad'))
        reply='Safe Code Group LLC is headquartered in **Rock Springs, Wyoming, USA**, with an India office at **LGF 23, Sahara Complex, LB Nagar, Hyderabad, Telangana**. We serve clients across 28+ countries.';
      else if(q.includes('erp')||q.includes('codevault'))
        reply='**CodeVault ERP** is our full-stack enterprise resource planning platform covering procurement, production, inventory, payroll, and reporting. Currently live in 320+ companies across manufacturing, logistics, and services with 99.9% uptime SLA.';
      else if(/\bai\b/.test(q)||q.includes('machine learning')||q.includes('nexus'))
        reply='**NexusAI Platform** is our unified AI operations platform for model training, deployment, monitoring, and MLOps. It processes 18M+ predictions per day with 94% accuracy across industries including healthcare, finance, and retail.';
      else if(q.includes('security')||q.includes('siem')||q.includes('shield'))
        reply='**ShieldOps SIEM** provides real-time threat detection processing 2.4B security events daily with sub-second alert latency. Covers SOC 2, ISO 27001, PCI-DSS and RBI compliance reporting. Currently in Beta.';
      else if(q.includes('cloud')||q.includes('devops')||q.includes('aws')||q.includes('azure'))
        reply='We provide multi-cloud architecture on **AWS and Azure**, CI/CD pipelines, **Kubernetes** orchestration, Docker containerisation, Terraform IaC, and 24/7 infrastructure monitoring with 99.9% uptime SLA.';
      else if(/\b(hi|hello|hey)\b/.test(q))
        reply="Hi there! 👋 I'm **Rsoni**, SafeCodex's AI assistant. Ask me anything about our software services, products, pricing, timelines, or how to get in touch!";
      else
        reply=`Great question! For detailed information about "${esc(text)}", please reach out to our team directly:\n\n📧 **contact@safecodeg.com**\n📞 **+91 7702721477**\n\nWe'll get back to you within one business day.`;

      // Simulate typing
      bubble.innerHTML='';
      for(let i=0;i<reply.length;i++){
        await new Promise(r=>setTimeout(r,10));
        bubble.innerHTML=mdToHtml(reply.slice(0,i+1))+'<span style="display:inline-block;width:2px;height:12px;background:#0066FF;margin-left:2px;animation:tdot .6s ease-in-out infinite;vertical-align:text-bottom"></span>';
        if(msgs) msgs.scrollTop=msgs.scrollHeight;
      }
      bubble.innerHTML=mdToHtml(reply);
      history.push({role:'assistant',content:reply});
    }

    if(msgs) msgs.scrollTop=msgs.scrollHeight;
    isTyping=false;
    if(sendB) sendB.disabled=false;
    input?.focus();
  }
})();

// ═══════════════════════════════════════════════
// ADVANCED INTERACTIONS JS — SafeCodex
// ═══════════════════════════════════════════════

// ── 1. PAGE LOADER ──────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('sc-loader');
    if (loader) loader.classList.add('hidden');
  }, 1000);
});

// ── 2. CUSTOM CURSOR ────────────────────────────────────────────────────────
(()=>{
  const cur = document.getElementById('sc-cursor');
  const ring = document.getElementById('sc-ring');
  if(!cur||!ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  },{passive:true});
  const lerp=(a,b,t)=>a+(b-a)*t;
  (function animRing(){
    rx=lerp(rx,mx,.12); ry=lerp(ry,my,.12);
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();
  const hoverEls = document.querySelectorAll('a,button,.svc-card,.product-card,.case-card,.testi-card,.tls-item,.glass-card');
  hoverEls.forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
})();

// ── 3. SCROLL PROGRESS ──────────────────────────────────────────────────────
(()=>{
  const bar = document.getElementById('sc-progress');
  if(!bar) return;
  window.addEventListener('scroll',()=>{
    const pct = window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100;
    bar.style.width = Math.min(pct,100)+'%';
  },{passive:true});
})();

// ── 4. REVEAL ON SCROLL (all variants) ──────────────────────────────────────
(()=>{
  const selectors = '.reveal,.reveal-left,.reveal-right,.reveal-scale';
  const els = [...document.querySelectorAll(selectors)].filter(el=>!el.closest('.hero'));
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('visible'), i*60);
        obs.unobserve(e.target);
      }
    });
  },{threshold:.08});
  els.forEach(el=>obs.observe(el));
})();

// ── 5. STAGGERED GRID CHILDREN ──────────────────────────────────────────────
(()=>{
  const grids = document.querySelectorAll('.services-grid,.products-grid,.testi-grid,.tech-logo-strip'); // hero excluded
  // Never touch hero children
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      [...e.target.children].forEach((child,i)=>{
        child.style.opacity='0';
        child.style.transform='translateY(20px)';
        setTimeout(()=>{
          child.style.transition=`opacity .55s cubic-bezier(.23,1,.32,1) ${i*80}ms,transform .55s cubic-bezier(.23,1,.32,1) ${i*80}ms`;
          child.style.opacity='1';
          child.style.transform='none';
        },100);
      });
      obs.unobserve(e.target);
    });
  },{threshold:.08});
  grids.forEach(g=>obs.observe(g));
})();

// ── 9. 3D CARD TILT ─────────────────────────────────────────────────────────
document.querySelectorAll('.svc-card,.product-card,.case-card,.glass-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-6px) scale(1.015)`;
    card.style.transition='none';
    // Spotlight
    const spot=card.querySelector('.svc-spotlight');
    if(spot){spot.style.setProperty('--mx',(e.clientX-r.left)+'px');spot.style.setProperty('--my',(e.clientY-r.top)+'px');}
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transition='transform .5s cubic-bezier(.23,1,.32,1),box-shadow .5s';
    card.style.transform='';
    card.style.boxShadow='';
  });
});

// ── 11. HERO PARTICLE CANVAS ────────────────────────────────────────────────
(()=>{
  const hero=document.querySelector('.hero');
  if(!hero||hero.querySelector('canvas')) return;
  const c=document.createElement('canvas');
  c.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.45';
  hero.prepend(c);
  const ctx=c.getContext('2d');
  let W,H;
  const resize=()=>{W=c.width=hero.offsetWidth;H=c.height=hero.offsetHeight;};
  resize();
  window.addEventListener('resize',resize,{passive:true});
  const COLS=['rgba(0,102,255,','rgba(0,194,255,','rgba(0,230,118,'];
  class P{
    constructor(){this.reset();}
    reset(){this.x=Math.random()*W;this.y=Math.random()*H;this.r=Math.random()*1.6+.3;this.a=Math.random()*.4+.05;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;this.c=COLS[Math.floor(Math.random()*COLS.length)];}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=this.c+this.a+')';ctx.fill();}
    update(){this.x+=this.vx;this.y+=this.vy;if(this.x<0||this.x>W||this.y<0||this.y>H)this.reset();}
  }
  const dots=Array.from({length:90},()=>new P());
  (function loop(){ctx.clearRect(0,0,W,H);dots.forEach(d=>{d.update();d.draw();});requestAnimationFrame(loop);})();
})();

// ── 13. PROCESS STEPS STAGGER ───────────────────────────────────────────────
(()=>{
  const steps=document.querySelectorAll('.proc-step');
  if(!steps.length) return;
  steps.forEach((s,i)=>{s.style.opacity='0';s.style.transform='translateX(-20px)';});
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const idx=[...steps].indexOf(e.target);
      setTimeout(()=>{
        e.target.style.transition='opacity .6s cubic-bezier(.23,1,.32,1),transform .6s cubic-bezier(.23,1,.32,1)';
        e.target.style.opacity='1'; e.target.style.transform='';
        const num=e.target.querySelector('.proc-num');
        if(num){num.style.transform='scale(0)';num.style.transition='transform .5s cubic-bezier(.34,1.56,.64,1) .15s';requestAnimationFrame(()=>num.style.transform='scale(1)');}
      },idx*90);
      obs.unobserve(e.target);
    });
  },{threshold:.2});
  steps.forEach(s=>obs.observe(s));
})();

// ── 16. CASE CARD HOVER SHIMMER + OPEN ON CLICK ─────────────────────────────
document.querySelectorAll('.case-card[data-case]').forEach(card=>{
  card.style.cursor='pointer';
});

// ── 18. TECH PILL CATEGORY STAGGER ──────────────────────────────────────────
(()=>{
  document.querySelectorAll('.tech-logo-strip').forEach(strip=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        [...e.target.querySelectorAll('.tls-item')].forEach((item,i)=>{
          item.style.opacity='0'; item.style.transform='scale(.85)';
          setTimeout(()=>{
            item.style.transition=`opacity .45s cubic-bezier(.23,1,.32,1) ${i*55}ms,transform .45s cubic-bezier(.34,1.56,.64,1) ${i*55}ms`;
            item.style.opacity='1'; item.style.transform='';
          },100);
        });
        obs.unobserve(e.target);
      });
    },{threshold:.1});
    obs.observe(strip);
  });
})();

/* ════════════════════════════════════════════════════════
   IMPROVED ANIMATIONS — SafeCodex v2
════════════════════════════════════════════════════════ */

// ── 1. STAGGERED SECTION CHILDREN REVEAL ─────────────────────────────────────
document.querySelectorAll('.services-grid,.products-grid,.testi-grid,.tech-grid,.cases-grid').forEach(el=>{
  el.classList.add('reveal-children');
  el.classList.remove('reveal');
});
const childObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); childObs.unobserve(e.target); }
  });
},{threshold:.08});
document.querySelectorAll('.reveal-children').forEach(el=>childObs.observe(el));

// (duplicate hero title animation removed)

// ── 7. CURSOR ORB FOLLOWS MOUSE IN HERO ──────────────────────────────────────
(()=>{
  const hero = document.querySelector('.hero');
  const glow1 = document.querySelector('.hero-glow-1');
  if(!hero||!glow1) return;
  let animId;
  let tx=0,ty=0,cx=0,cy=0;
  hero.addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect();
    tx=e.clientX-r.left-350; ty=e.clientY-r.top-350;
  });
  const lerp=(a,b,t)=>a+(b-a)*t;
  const frame=()=>{
    cx=lerp(cx,tx,.06); cy=lerp(cy,ty,.06);
    glow1.style.left=cx+'px'; glow1.style.top=cy+'px';
    animId=requestAnimationFrame(frame);
  };
  frame();
  hero.addEventListener('mouseleave',()=>{ tx=ty=0; });
})();

// ── 8. SERVICE CARD POINTER GLOW ─────────────────────────────────────────────
document.querySelectorAll('.svc-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=e.clientX-r.left, y=e.clientY-r.top;
    card.style.setProperty('--gx',x+'px');
    card.style.setProperty('--gy',y+'px');
    card.style.background=`radial-gradient(220px circle at ${x}px ${y}px, rgba(0,102,255,.06), #fff 55%)`;
  });
  card.addEventListener('mouseleave',()=>{ card.style.background=''; });
});

// ── 10. STATS BAND: NUMBER POP ───────────────────────────────────────────────
(()=>{
  const band = document.querySelector('.stats-band-inner');
  if(!band) return;
  const statsObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('.stat-item').forEach((item,i)=>{
        item.style.opacity='0'; item.style.transform='translateY(24px)';
        setTimeout(()=>{
          item.style.transition='opacity .6s cubic-bezier(.23,1,.32,1),transform .6s cubic-bezier(.23,1,.32,1)';
          item.style.opacity='1'; item.style.transform='';
        },i*120);
      });
      statsObs.unobserve(e.target);
    });
  },{threshold:.3});
  statsObs.observe(band);
})();

// ── 11. ACTIVE NAV LINK HIGHLIGHT ON SCROLL ───────────────────────────────────
(()=>{
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const id = '#'+e.target.id;
      links.forEach(a=>{
        a.classList.toggle('active', a.getAttribute('href')===id);
      });
    });
  },{threshold:.4,rootMargin:'-10% 0px -50% 0px'});
  sections.forEach(s=>obs.observe(s));
})();

// ── 12. PARTICLE CANVAS ON HERO ───────────────────────────────────────────────
(()=>{
  const hero = document.querySelector('.hero');
  if(!hero||document.querySelector('.hero canvas')) return; // don't double-add
  const canvas = document.createElement('canvas');
  canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.4';
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W,H;
  const resize=()=>{ W=canvas.width=hero.offsetWidth; H=canvas.height=hero.offsetHeight; };
  resize();
  window.addEventListener('resize',resize,{passive:true});
  class Dot{
    constructor(){ this.reset(); }
    reset(){
      this.x=Math.random()*W; this.y=Math.random()*H;
      this.r=Math.random()*1.5+.3;
      this.a=Math.random()*.35+.05;
      this.vx=(Math.random()-.5)*.28; this.vy=(Math.random()-.5)*.28;
      const C=['rgba(0,102,255,','rgba(0,194,255,','rgba(0,230,118,'];
      this.c=C[Math.floor(Math.random()*C.length)];
    }
    draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=this.c+this.a+')'; ctx.fill(); }
    update(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset(); }
  }
  const dots=Array.from({length:80},()=>new Dot());
  const loop=()=>{ ctx.clearRect(0,0,W,H); dots.forEach(d=>{d.update();d.draw();}); requestAnimationFrame(loop); };
  loop();
})();

// ── 14. CASE CARD MODAL ───────────────────────────────────────────────────────
(()=>{
  const CASES=[
    {
      tag:'Manufacturing · ERP',dur:'14 weeks · 2024',
      title:'CodeVault ERP for Bharat Heavy Industrials',
      sub:'Replacing a 15-year-old monolithic SAP R/2 with a cloud-native ERP across 8 plants and 12,400 users — cutting the procurement cycle from 18 days to 3.',
      metrics:[{v:'60%',l:'Efficiency gain'},{v:'₹4.2Cr',l:'Annual savings'},{v:'3 days',l:'Procurement (was 18)'},{v:'99.7%',l:'Uptime SLA'}],
      challenge:'Bharat Heavy Industrials ran on a SAP R/2 system from 2007. Slow approvals, no real-time inventory visibility, and ₹1.8Cr in quarterly production delays caused by manual procurement processes.',
      solution:'We built CodeVault ERP on AWS EKS — microservices for procurement, production, inventory, payroll, and reporting. 6-week parallel deployment for zero-downtime cutover. React frontend with role-based views for 12,400 users.',
      deliverables:['Real-time inventory sync across 8 plants with sub-second latency','Auto-approval workflow reducing procurement from 18 days to 3','Supplier portal with 240 vendors and EDI integration','Mobile app for plant managers with offline-first capability','Power BI dashboards via live Azure Synapse data warehouse','SSO via Azure AD for 12,400+ users'],
      quote:'"SafeCodex didn\'t just replace our old system — they modernised how we operate. The implementation was flawless and results exceeded every KPI we set."',
      author:'Rajesh Kumar, CTO — Bharat Heavy Industrials',
      outcome:'ROI achieved in 18 months. Procurement cycle dropped 83%. Monthly book close accelerated by 11 days. Inventory write-offs fell 45%.',
      tech:['AWS EKS','React','Node.js','PostgreSQL','Redis','Kafka','Azure AD','Power BI','Terraform'],
    },
    {
      tag:'Fintech · Cybersecurity',dur:'8 weeks · 2024',
      title:'ShieldOps SIEM for IndusInd Bank',
      sub:'Real-time threat detection and response processing 2.4B security events daily — reducing mean detection time from 4 hours to under 0.3 seconds.',
      metrics:[{v:'84%',l:'Fewer incidents'},{v:'<0.3s',l:'Detection latency'},{v:'2.4B',l:'Events/day'},{v:'100%',l:'Audit pass rate'}],
      challenge:'The security team manually reviewed alerts from 14 separate tools. Mean detection time was 4 hours. A 2023 phishing near-miss forced the bank to act before their RBI compliance deadline.',
      solution:'ShieldOps SIEM deployed on an Apache Kafka streaming backbone with Elasticsearch indexing, custom ML anomaly detection (tuned <0.2% false-positive rate), and automated SOAR playbooks integrating 14 existing security tools.',
      deliverables:['2.4B event/day ingestion from 14 tool integrations including Palo Alto and CrowdStrike','ML anomaly detection with <0.2% false-positive rate','Automated SOAR playbooks blocking threats in <1 second','Unified threat dashboard with org-to-endpoint drill-down','RBI, PCI-DSS, ISO 27001 compliance reporting automated','24/7 SOC integration with PagerDuty escalation chains'],
      quote:'"ShieldOps cut our detection time from hours to milliseconds. The SafeCodex team understood our regulatory environment deeply and delivered something exceptional."',
      author:'Vikram Nair, CISO — IndusInd Bank',
      outcome:'Critical incidents down 84% in 90 days. RBI audit passed with zero major findings — a first in 3 years. SOC team handles 4x event volume with same headcount.',
      tech:['Apache Kafka','Elasticsearch','Python','TensorFlow','Docker','AWS','Palo Alto','CrowdStrike','PagerDuty'],
    },
    {
      tag:'Healthcare · AI/ML',dur:'20 weeks · 2023–24',
      title:'NexusAI Patient Risk Platform for Apollo Hospitals',
      sub:'AI early-warning system predicting patient deterioration with 91% accuracy across 14 hospitals — enabling earlier clinical intervention.',
      metrics:[{v:'91%',l:'Prediction accuracy'},{v:'14',l:'Hospitals live'},{v:'38%',l:'ICU transfer reduction'},{v:'4.2M',l:'Records processed'}],
      challenge:'Apollo\'s clinical teams relied on periodic manual observations — catching deterioration too late. With 14 hospitals and 8,000+ beds, manual risk assessment was not scalable.',
      solution:'Patient risk scoring engine on NexusAI Platform trained on 4.2M anonymised records. Real-time vitals ingested via HL7 FHIR APIs. Continuous risk scores visible on nursing station dashboards. HIPAA-compliant architecture with end-to-end encryption.',
      deliverables:['Continuous risk scoring from vitals, labs, and nursing notes via NLP','HL7 FHIR integration with bedside monitors and EMR','Explainable AI dashboard showing risk drivers per patient','Automated alert routing to charge nurses based on thresholds','HIPAA-compliant data architecture end-to-end','Monthly MLOps pipeline retraining on new patient data'],
      quote:'"The AI gives our nurses a second set of eyes on every patient, all the time. The outcomes speak for themselves."',
      author:'Ananya Prasad, Head of Clinical Innovation — Apollo Hospitals',
      outcome:'91% accuracy at 4-hour intervention windows. ICU transfer rate dropped 38% for flagged patients. Cited as cornerstone of Apollo\'s 2025 clinical quality strategy.',
      tech:['Python','TensorFlow','HL7 FHIR','Azure ML','PostgreSQL','React','Node.js','Kubernetes','MLflow'],
    },
  ];

  // Build modal DOM once
  const modal = document.createElement('div');
  modal.id='caseModal2';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.setAttribute('aria-label','Case study');
  modal.style.cssText='position:fixed;inset:0;z-index:8500;display:flex;align-items:center;justify-content:center;padding:1.5rem;opacity:0;pointer-events:none;transition:opacity .35s cubic-bezier(.23,1,.32,1)';
  modal.innerHTML=`
    <div id="cm2Bg" style="position:absolute;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(12px)"></div>
    <div id="cm2Panel" style="position:relative;z-index:1;background:#050D1F;border:1px solid rgba(0,102,255,.2);border-radius:24px;width:100%;max-width:780px;max-height:90vh;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(0,102,255,.3) transparent;transform:scale(.94) translateY(20px);transition:transform .4s cubic-bezier(.23,1,.32,1)">
      <button onclick="closeCaseModal()" aria-label="Close case study" style="position:sticky;top:1rem;float:right;margin:1rem 1rem 0 0;width:36px;height:36px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:50%;color:rgba(255,255,255,.7);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:10" onmouseover="this.style.background='rgba(0,102,255,.2)';this.style.borderColor='rgba(0,102,255,.4)';this.style.color='#fff'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.borderColor='rgba(255,255,255,.1)';this.style.color='rgba(255,255,255,.7)'">✕</button>
      <div id="cm2Body" style="padding:2.25rem;clear:both"></div>
    </div>`;
  document.body.appendChild(modal);

  window.closeCaseModal=()=>{
    modal.style.opacity='0'; modal.style.pointerEvents='none';
    document.getElementById('cm2Panel').style.transform='scale(.94) translateY(20px)';
    document.body.style.overflow='';
  };
  window.openCaseModal=idx=>{
    const c=CASES[idx]; if(!c) return;
    const mets=c.metrics.map(m=>`<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:1.125rem;text-align:center"><div style="font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:700;color:#fff;letter-spacing:-.04em;line-height:1">${m.v}</div><div style="font-size:.72rem;color:rgba(255,255,255,.35);margin-top:.3rem">${m.l}</div></div>`).join('');
    const dels=c.deliverables.map(d=>`<li style="font-size:.875rem;color:rgba(255,255,255,.55);line-height:1.65;padding-left:1.25rem;position:relative;margin-bottom:.5rem"><span style="position:absolute;left:0;top:.5rem;width:5px;height:5px;border-radius:50%;background:#0066FF;display:block"></span>${d}</li>`).join('');
    const tech=c.tech.map(t=>`<span style="font-size:.74rem;font-weight:600;padding:.28rem .825rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:999px;color:rgba(255,255,255,.55);font-family:'Space Grotesk',sans-serif">${t}</span>`).join('');
    document.getElementById('cm2Body').innerHTML=`
      <div style="background:linear-gradient(135deg,#030A18,#071428);border-radius:16px;padding:1.875rem;margin-bottom:1.75rem;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 80% 20%,rgba(0,102,255,.2),transparent 60%);pointer-events:none"></div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem;position:relative;z-index:1">
          <span style="font-size:.7rem;font-weight:700;padding:.28rem .75rem;border-radius:999px;background:rgba(0,102,255,.18);color:#3385FF;border:1px solid rgba(0,102,255,.3);font-family:'Space Grotesk',sans-serif">${c.tag}</span>
          <span style="font-size:.7rem;font-weight:700;padding:.28rem .75rem;border-radius:999px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.1);font-family:'Space Grotesk',sans-serif;margin-left:auto">${c.dur}</span>
        </div>
        <h2 style="font-family:'Space Grotesk',sans-serif;font-size:clamp(1.2rem,2.5vw,1.7rem);font-weight:700;color:#fff;letter-spacing:-.03em;line-height:1.2;margin-bottom:.75rem;position:relative;z-index:1">${c.title}</h2>
        <p style="font-size:.9rem;color:rgba(255,255,255,.5);line-height:1.75;position:relative;z-index:1">${c.sub}</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:.875rem;margin-bottom:1.75rem">${mets}</div>
      ${['Challenge','Solution','Deliverables','Outcome'].map((s,i)=>{
        const content = [c.challenge, c.solution, `<ul style="list-style:none;margin-top:.6rem">${dels}</ul>`, c.outcome][i];
        return `<div style="margin-bottom:1.5rem">
          <div style="font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0066FF;margin-bottom:.875rem;display:flex;align-items:center;gap:.6rem;font-family:'Space Grotesk',sans-serif">${s}<span style="flex:1;height:1px;background:rgba(0,102,255,.2)"></span></div>
          <div style="font-size:.9rem;color:rgba(255,255,255,.55);line-height:1.8">${content}</div>
        </div>`;
      }).join('')}
      <div style="background:rgba(0,102,255,.06);border-left:3px solid #0066FF;border-radius:0 12px 12px 0;padding:1.25rem 1.5rem;margin-bottom:1.75rem">
        <p style="font-size:.95rem;color:rgba(255,255,255,.7);line-height:1.75;font-style:italic">${c.quote}</p>
        <div style="font-size:.78rem;color:rgba(255,255,255,.3);margin-top:.75rem;font-family:'Space Grotesk',sans-serif">— ${c.author}</div>
      </div>
      <div style="margin-bottom:1.75rem">
        <div style="font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0066FF;margin-bottom:.875rem;display:flex;align-items:center;gap:.6rem;font-family:'Space Grotesk',sans-serif">Tech Stack<span style="flex:1;height:1px;background:rgba(0,102,255,.2)"></span></div>
        <div style="display:flex;gap:.45rem;flex-wrap:wrap">${tech}</div>
      </div>
      <div style="display:flex;gap:1rem;align-items:center;padding-top:1.5rem;border-top:1px solid rgba(255,255,255,.07);flex-wrap:wrap">
        <button class="btn-primary" onclick="closeCaseModal();document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Start a similar project →</button>
        <span style="font-size:.8rem;color:rgba(255,255,255,.3)">Free discovery call · No commitment</span>
      </div>`;
    document.getElementById('cm2Panel').scrollTop=0;
    modal.style.opacity='1'; modal.style.pointerEvents='all';
    document.getElementById('cm2Panel').style.transform='scale(1) translateY(0)';
    document.body.style.overflow='hidden';
  };

  // Wire up case cards
  document.querySelectorAll('.case-card[data-case]').forEach(card=>{
    card.style.cursor='pointer';
    card.addEventListener('click',()=>openCaseModal(+card.dataset.case));
    card.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openCaseModal(+card.dataset.case); } });
  });
  // Wire up "Read case study" buttons
  document.querySelectorAll('.case-read-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      const card=btn.closest('[data-case]');
      if(card) openCaseModal(+card.dataset.case);
    });
  });
  document.getElementById('cm2Bg')?.addEventListener('click',closeCaseModal);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeCaseModal(); });
})();
