/* ═══════════════════════════════════════════════════════
   SafeCodex — Enterprise Software Company
   JavaScript by SafeCodex Studio
═══════════════════════════════════════════════════════ */

'use strict';

// ── CUSTOM CURSOR ────────────────────────────────────────────────────────────
(()=>{
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if(!cursor || !ring) return;
  cursor.style.cssText='position:fixed;width:8px;height:8px;background:#0066FF;border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .25s,height .25s';
  ring.style.cssText='position:fixed;width:30px;height:30px;border:1px solid rgba(0,102,255,.3);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:transform .14s ease-out';
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cursor.style.left=mx+'px'; cursor.style.top=my+'px';
  });
  const animRing=()=>{ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(animRing); };
  animRing();
  document.querySelectorAll('a,button,.svc-card,.product-card,.case-card,.testi-card,.tech-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ cursor.style.width='44px'; cursor.style.height='44px'; cursor.style.background='rgba(0,102,255,.15)'; ring.style.opacity='0'; });
    el.addEventListener('mouseleave',()=>{ cursor.style.width='8px'; cursor.style.height='8px'; cursor.style.background='#0066FF'; ring.style.opacity='1'; });
  });
})();

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

// ── SCROLL PROGRESS BAR ──────────────────────────────────────────────────────
const progBar = document.getElementById('scroll-progress');
window.addEventListener('scroll',()=>{
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if(progBar) progBar.style.width = (window.scrollY/total*100)+'%';
},{passive:true});

// ── NAV SCROLL ───────────────────────────────────────────────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY>60);
},{passive:true});

// ── MOBILE NAV ───────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger?.addEventListener('click',()=>{
  navLinks?.classList.toggle('open');
});
navLinks?.querySelectorAll('a,button').forEach(a=>a.addEventListener('click',()=>navLinks?.classList.remove('open')));
const navStyle = document.createElement('style');
navStyle.textContent=`#navLinks.open{display:flex!important;flex-direction:column;position:fixed;top:64px;left:0;right:0;background:rgba(5,13,31,.97);padding:2rem 5vw;border-bottom:1px solid rgba(255,255,255,.07);gap:1.25rem;z-index:499;backdrop-filter:blur(20px)}#navLinks.open a{color:rgba(255,255,255,.8)!important;font-size:1rem}#navLinks.open button{align-self:flex-start}`;
document.head.appendChild(navStyle);

// ── SMOOTH SCROLL ────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
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

// ── HERO TITLE STAGGER ───────────────────────────────────────────────────────
(()=>{
  const title = document.querySelector('h1.hero-title');
  if(!title) return;
  // Split on <br> keeping inner HTML (blue/dim spans) intact
  const lines = title.innerHTML.split(/<br\s*\/?>/i);
  title.innerHTML = lines.map((line, i) =>
    `<span style="display:block;opacity:0;transform:translateY(24px);transition:opacity .65s cubic-bezier(.23,1,.32,1) ${200 + i*130}ms,transform .65s cubic-bezier(.23,1,.32,1) ${200 + i*130}ms">${line}</span>`
  ).join('');
  // Trigger after a short paint delay
  setTimeout(()=>{
    document.querySelectorAll('h1.hero-title > span').forEach(s=>{
      s.style.opacity='1'; s.style.transform='none';
    });
  }, 80);
})();

// ── TYPEWRITER on hero badge ──────────────────────────────────────────────────
(()=>{
  const el=document.querySelector('.hero-badge span');
  if(!el) return;
  const phrases=['Trusted by 120+ Enterprises Worldwide','ISO 27001 & SOC 2 Certified','Based in Hyderabad, India','Serving 28+ Countries'];
  let pi=0,ci=0,deleting=false;
  el.textContent='';
  const tick=()=>{
    const phrase=phrases[pi%phrases.length];
    if(!deleting){ el.textContent=phrase.slice(0,++ci); if(ci===phrase.length){deleting=true;setTimeout(tick,2200);return;} setTimeout(tick,55); }
    else{ el.textContent=phrase.slice(0,--ci); if(ci===0){deleting=false;pi++;setTimeout(tick,350);return;} setTimeout(tick,30); }
  };
  setTimeout(tick,1000);
})();

// ── 3D CARD TILT ─────────────────────────────────────────────────────────────
document.querySelectorAll('.svc-card,.product-card,.case-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-6px) scale(1.01)`;
    card.style.transition='none';
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transition='transform .5s cubic-bezier(.23,1,.32,1),box-shadow .5s,border-color .3s';
    card.style.transform='';
  });
});

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

// ── PROCESS STEP HOVER ───────────────────────────────────────────────────────
document.querySelectorAll('.proc-step').forEach((step,i)=>{
  step.style.opacity='0';
  step.style.transform='translateX(-20px)';
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        setTimeout(()=>{ step.style.transition='opacity .6s cubic-bezier(.23,1,.32,1),transform .6s cubic-bezier(.23,1,.32,1)'; step.style.opacity='1'; step.style.transform=''; },i*100);
        obs.unobserve(step);
      }
    });
  },{threshold:.2});
  obs.observe(step);
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

// ── TESTIMONIALS STAGGER ─────────────────────────────────────────────────────
const testiObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.querySelectorAll('.testi-card').forEach((card,i)=>{
      card.style.opacity='0'; card.style.transform='translateY(28px)';
      setTimeout(()=>{ card.style.transition=`opacity .6s cubic-bezier(.23,1,.32,1) ${i*110}ms,transform .6s cubic-bezier(.23,1,.32,1) ${i*110}ms`; card.style.opacity='1'; card.style.transform=''; },150);
    });
    testiObs.unobserve(e.target);
  });
},{threshold:.15});
const testiGrid=document.querySelector('.testi-grid');
if(testiGrid) testiObs.observe(testiGrid);

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

// ── HERO CURSOR ORB ──────────────────────────────────────────────────────────
(()=>{
  const hero=document.querySelector('.hero');
  const glow=document.querySelector('.hero-glow-1');
  if(!hero||!glow) return;
  hero.addEventListener('mousemove',e=>{
    const r=hero.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width)*100;
    const y=((e.clientY-r.top)/r.height)*100;
    glow.style.background=`radial-gradient(circle, rgba(0,102,255,.25) 0%, transparent 65%)`;
    glow.style.left=(e.clientX-r.left-350)+'px';
    glow.style.top=(e.clientY-r.top-350)+'px';
    glow.style.transition='left .8s cubic-bezier(.23,1,.32,1),top .8s cubic-bezier(.23,1,.32,1)';
  });
})();

// ── ACTIVE NAV HIGHLIGHT ─────────────────────────────────────────────────────
const sections=document.querySelectorAll('section[id]');
const navSectionObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting && e.intersectionRatio>.3){
      document.querySelectorAll('.nav-links a').forEach(a=>{
        const isActive=a.getAttribute('href')==='#'+e.target.id;
        a.style.color=isActive?'#fff':'';
        a.style.fontWeight=isActive?'600':'500';
      });
    }
  });
},{threshold:.3});
sections.forEach(s=>navSectionObs.observe(s));

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
    return validateField(id,errId,s=>s.length>0);
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
      submittedAt:new Date().toISOString()
    };
    setLoading(true);
    // Save to localStorage
    try{
      const saved=JSON.parse(localStorage.getItem('sc_enquiries')||'[]');
      saved.push(data);
      localStorage.setItem('sc_enquiries',JSON.stringify(saved));
    }catch(_){}

    form.style.display='none';
    const succ=document.getElementById('successState');
    if(succ) succ.style.display='block';
    const sumEl=document.getElementById('submissionSummary');
    if(sumEl) sumEl.innerHTML=`<strong>Your enquiry:</strong><br>${data.first} ${data.last} · ${data.email}${data.company?' · '+data.company:''}<br>${data.service}<br><em style="color:var(--muted)">"${data.message.slice(0,120)}${data.message.length>120?'…':''}"</em>`;
    setLoading(false);

    const replyEl=document.getElementById('aiReply');
    const PROMPT=`You are the professional client success team at SafeCodex Technologies, an enterprise software company based in Hyderabad, India. We build custom software, cloud solutions, AI/ML systems, cybersecurity, and ERP integrations.

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
        replyEl.innerHTML=`<span style="white-space:pre-wrap">${text}</span><div style="margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.07);font-size:.78rem;color:rgba(255,255,255,.35)">— SafeCodex Technologies · <a href="mailto:contact@safecodeg.com" style="color:#3385FF;text-decoration:none">contact@safecodeg.com</a></div>`;
      }catch(err){
        replyEl.textContent=`Hi ${data.first}, thank you for reaching out. We've received your enquiry about ${data.service} and a member of our technical team will get back to you within one business day. — SafeCodex Team`;
      }
    } else if(replyEl){
      replyEl.textContent=`Hi ${data.first}, thank you for your enquiry about ${data.service||'our services'}. Our technical team will review your requirements and respond within one business day with an initial assessment. — SafeCodex Technologies`;
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

  const SONI_AV=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
  const SYSTEM=`You are Soni, the professional AI assistant for SafeCodex Technologies — an enterprise software company based in Hyderabad, India. You are helpful, concise, and professional.

Company facts:
- Services: Custom Software Development, Cloud & DevOps (AWS/Azure/K8s), AI/ML & Data Engineering, Cybersecurity (VAPT/SOC2/ISO27001), ERP & System Integration, Mobile Apps (React Native/Flutter)
- Products: CodeVault ERP (manufacturing ERP, 320+ companies), NexusAI Platform (AI/MLOps), ShieldOps SIEM (security monitoring)
- Clients: 120+ enterprises across 28+ countries
- Certifications: ISO 27001, SOC 2, CMMI Level 3
- Uptime SLA: 99.9%
- Team: 200+ engineers and consultants
- Founded: 2018 | HQ: LB Nagar, Hyderabad, Telangana, India
- Phone: 040 7777 0007 | WhatsApp: +91 40 7777 0007 | Email: contact@safecodeg.com
- Delivery: Agile sprints, typical project 8–24 weeks
- Keep replies under 100 words unless the question genuinely needs more.
- Sign as "Soni" only on first reply.`;

  function togglePanel(){
    open=!open;
    panel.classList.toggle('open',open);
    if(open && msgs.children.length===0){
      appendBot("Hi! I'm **Soni**, SafeCodex's AI assistant. I can tell you about our software services, products, delivery process, or help you get in touch with our team. What would you like to know?");
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
    await new Promise(r=>setTimeout(r,500));
    removeTyping();
    const bubble=streamRow();
    let fullText='';
    try{
      if(sampleCap){
        const apiMsgs=[];
        let sysAdded=false;
        history.forEach(m=>{
          if(m.role==='user'&&!sysAdded){ apiMsgs.push({role:'user',content:SYSTEM+'\n\n---\n'+m.content}); sysAdded=true; }
          else apiMsgs.push(m);
        });
        await sampleCap(apiMsgs,{
          onText:({text:t})=>{
            fullText=t;
            bubble.innerHTML=mdToHtml(t)+'<span style="display:inline-block;width:2px;height:12px;background:#0066FF;margin-left:2px;animation:tdot .6s ease-in-out infinite;vertical-align:text-bottom"></span>';
            if(msgs) msgs.scrollTop=msgs.scrollHeight;
          }
        });
        bubble.innerHTML=mdToHtml(fullText);
        history.push({role:'assistant',content:fullText});
      } else {
        const fallback=`Hi! I'm Soni. SafeCodex builds enterprise software — custom apps, cloud infrastructure, AI/ML systems, cybersecurity, and ERP integrations. For detailed enquiries please email **contact@safecodeg.com** or call **040 7777 0007**.`;
        bubble.innerHTML=mdToHtml(fallback);
        history.push({role:'assistant',content:fallback});
      }
    }catch(err){
      bubble.innerHTML=mdToHtml('Sorry, I hit a snag. Please email **contact@safecodeg.com** or call **040 7777 0007** and our team will help directly.');
    }
    if(msgs) msgs.scrollTop=msgs.scrollHeight;
    isTyping=false;
    if(sendB) sendB.disabled=false;
    input?.focus();
  }
})();

// ── CASE STUDY MODAL ────────────────────────────────────────────────────────
(()=>{
  const CASES = [
    {
      title: 'CodeVault ERP for Bharat Heavy Industrials',
      tags: ['Manufacturing','ERP & Integration','Cloud Native'],
      tagClasses: ['modal-tag-blue','modal-tag-cyan','modal-tag-green'],
      duration: '14 weeks · 2024',
      subtitle: 'Replacing a 15-year-old legacy ERP with a cloud-native platform across 8 manufacturing plants and 12,400 users — delivering 60% operational efficiency gains within 6 months of go-live.',
      metrics: [
        {val:'60%',cls:'',label:'Efficiency gain'},
        {val:'₹4.2Cr',cls:'blue',label:'Annual savings'},
        {val:'3 days',cls:'green',label:'Procurement cycle (was 18)'},
        {val:'99.7%',cls:'',label:'System uptime SLA'},
      ],
      challenge: 'Bharat Heavy Industrials operated on a monolithic SAP R/2 system from 2007 — slow, expensive to maintain, and unable to support real-time inventory visibility across 8 geographically distributed plants. Manual procurement approvals averaged 18 days, causing production delays worth ₹1.8Cr quarterly.',
      solution: 'SafeCodex designed and built CodeVault ERP — a cloud-native, microservices-based platform on AWS, integrated with the existing HRMS and finance systems via REST APIs. We ran a parallel deployment for 6 weeks to ensure zero-downtime migration.',
      features: [
        'Real-time inventory tracking across 8 plants with sub-second sync',
        'Automated purchase order approval workflows reducing cycle time from 18 days to 3',
        'Integrated supplier portal with 240+ approved vendors',
        'Mobile app for plant managers with offline-first capability',
        'Power BI dashboards connected via live data warehouse',
        'Role-based access for 12,400+ users with SSO via Azure AD',
      ],
      outcome: 'Within 6 months of go-live, procurement cycle time dropped 83%, inventory write-offs fell 45%, and the finance team closed monthly books 11 days faster. Annual operational savings reached ₹4.2Cr — a full ROI in under 18 months.',
      quote: '"SafeCodex didn\'t just replace our old system — they fundamentally modernised how we run operations. The implementation was flawless and the results exceeded every KPI we set."',
      quoteAuthor: 'Rajesh Kumar, CTO — Bharat Heavy Industrials Ltd.',
      tech: ['AWS EKS','Node.js','React','PostgreSQL','Redis','Kafka','Azure AD','Power BI','Terraform'],
    },
    {
      title: 'ShieldOps SIEM for IndusInd Bank',
      tags: ['Fintech','Cybersecurity','Real-time Analytics'],
      tagClasses: ['modal-tag-blue','modal-tag-cyan','modal-tag-green'],
      duration: '8 weeks · 2024',
      subtitle: 'Deploying an enterprise Security Information and Event Management platform that processes 2.4 billion security events daily and reduced mean time to detect from 4 hours to under 0.3 seconds.',
      metrics: [
        {val:'84%',cls:'green',label:'Fewer security incidents'},
        {val:'&lt;0.3s',cls:'blue',label:'Mean time to detect'},
        {val:'2.4B',cls:'',label:'Events processed / day'},
        {val:'100%',cls:'green',label:'SOC 2 audit pass rate'},
      ],
      challenge: 'IndusInd Bank\'s security team manually reviewed alerts from 14 disparate tools, with a mean detection time of 4 hours. A 2023 near-miss phishing incident exposed the gap — the bank needed a unified, real-time SIEM with automated response before their RBI compliance audit.',
      solution: 'SafeCodex deployed ShieldOps SIEM — built on an Apache Kafka streaming backbone with Elasticsearch for indexing, custom ML anomaly detection models, and automated SOAR playbooks. Integration covered 14 existing security tools including Palo Alto firewalls and CrowdStrike EDR.',
      features: [
        'Real-time ingestion of 2.4B events/day from 14 security tool integrations',
        'ML-based anomaly detection with tuned false-positive rates below 0.2%',
        'Automated SOAR playbooks blocking threats in under 1 second',
        'Unified threat dashboard with drill-down from org level to endpoint',
        'RBI, PCI-DSS, and ISO 27001 compliance reporting automated',
        '24/7 SOC integration with PagerDuty escalation chains',
      ],
      outcome: 'In the first 90 days post-deployment, critical security incidents dropped 84%. The bank passed its RBI cybersecurity audit with zero major findings — a first in 3 years. The SOC team now handles 4x the event volume with the same headcount.',
      quote: '"ShieldOps cut our detection time from hours to milliseconds. The SafeCodex team understood our regulatory environment and delivered something our internal team simply could not have built."',
      quoteAuthor: 'Vikram Nair, CISO — IndusInd Bank',
      tech: ['Apache Kafka','Elasticsearch','Python','TensorFlow','Docker','AWS','Palo Alto APIs','CrowdStrike','PagerDuty'],
    },
    {
      title: 'NexusAI Patient Risk Platform for Apollo Hospitals',
      tags: ['Healthcare','AI / ML','Predictive Analytics'],
      tagClasses: ['modal-tag-blue','modal-tag-cyan','modal-tag-green'],
      duration: '20 weeks · 2023–24',
      subtitle: 'Building an AI-powered early warning system that predicts patient deterioration risk with 91% accuracy across 14 Apollo hospitals — enabling earlier interventions and measurably improving patient outcomes.',
      metrics: [
        {val:'91%',cls:'green',label:'Prediction accuracy'},
        {val:'14',cls:'blue',label:'Hospitals live'},
        {val:'38%',cls:'green',label:'ICU transfer reduction'},
        {val:'4.2M',cls:'',label:'Patient records processed'},
      ],
      challenge: 'Apollo\'s clinical teams lacked a data-driven early warning system. Nurses relied on periodic manual observations, often catching patient deterioration too late. With 14 hospitals and over 8,000 beds, scaling manual risk assessment was not viable.',
      solution: 'SafeCodex built a patient risk scoring engine on the NexusAI Platform, trained on 4.2M anonymised patient records. The model ingests real-time vitals from bedside monitors via HL7 FHIR APIs and generates continuous risk scores visible on nursing station dashboards.',
      features: [
        'Continuous risk scoring using vitals, lab results, and nursing notes via NLP',
        'HL7 FHIR integration with bedside monitors and EMR systems',
        'Explainable AI dashboard showing which factors drove each risk score',
        'Automated alert routing to charge nurses based on threshold rules',
        'HIPAA-compliant data architecture with end-to-end encryption',
        'MLOps pipeline for monthly model retraining on new patient data',
      ],
      outcome: '91% prediction accuracy at 4-hour intervention windows. ICU transfer rate for flagged patients dropped 38% as earlier intervention became standard protocol. Apollo\'s Chief Medical Officer cited the platform as a cornerstone of their 2025 clinical quality strategy.',
      quote: '"The AI doesn\'t replace clinical judgement — it gives our nurses a second set of eyes on every patient, all the time. The outcomes speak for themselves."',
      quoteAuthor: 'Ananya Prasad, Head of Clinical Innovation — Apollo Hospitals',
      tech: ['Python','TensorFlow','HL7 FHIR','Azure ML','PostgreSQL','React','Node.js','Kubernetes','MLflow'],
    },
  ];

  const modal   = document.getElementById('caseModal');
  const backdrop= document.getElementById('modalBackdrop');
  const closeBtn= document.getElementById('modalClose');
  const body    = document.getElementById('modalBody');
  if(!modal) return;

  function openCase(idx){
    const c = CASES[idx];
    if(!c) return;

    const metricsHtml = c.metrics.map(m=>`
      <div class="modal-metric">
        <div class="modal-metric-val ${m.cls}">${m.val}</div>
        <div class="modal-metric-label">${m.label}</div>
      </div>`).join('');

    const tagsHtml = c.tags.map((t,i)=>`<span class="modal-tag ${c.tagClasses[i]}">${t}</span>`).join('');
    const featuresHtml = c.features.map(f=>`<li>${f}</li>`).join('');
    const techHtml = c.tech.map(t=>`<span class="modal-tech-pill">${t}</span>`).join('');

    body.innerHTML = `
      <div class="modal-hero">
        <div class="modal-hero-meta">
          ${tagsHtml}
          <span style="font-size:.7rem;color:rgba(255,255,255,.3);margin-left:auto;font-family:'Space Grotesk',sans-serif">${c.duration}</span>
        </div>
        <h2>${c.title}</h2>
        <p class="modal-hero-sub">${c.subtitle}</p>
      </div>

      <div class="modal-metrics">${metricsHtml}</div>

      <div class="modal-section">
        <div class="modal-section-title">The Challenge</div>
        <p>${c.challenge}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Our Solution</div>
        <p>${c.solution}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Key Deliverables</div>
        <ul class="modal-list">${featuresHtml}</ul>
      </div>

      <div class="modal-quote">
        <p>${c.quote}</p>
        <div class="modal-quote-author">— ${c.quoteAuthor}</div>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Outcome</div>
        <p>${c.outcome}</p>
      </div>

      <div class="modal-section">
        <div class="modal-section-title">Technology Stack</div>
        <div class="modal-tech-pills">${techHtml}</div>
      </div>

      <div class="modal-cta">
        <button class="btn-primary" onclick="document.getElementById('caseModal').classList.remove('open');document.body.style.overflow='';document.getElementById('contact').scrollIntoView({behavior:'smooth'})">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/></svg>
          Start a similar project
        </button>
        <span style="font-size:.8rem;color:rgba(255,255,255,.3)">Free discovery call · No commitment</span>
      </div>`;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Reset scroll position
    const panel = document.getElementById('modalPanel');
    if(panel) panel.scrollTop = 0;
  }

  function closeModal(){
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open on card click
  document.querySelectorAll('.case-card[data-case]').forEach(card=>{
    card.addEventListener('click', ()=> openCase(parseInt(card.dataset.case)));
    card.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openCase(parseInt(card.dataset.case)); } });
  });

  // Close triggers
  backdrop?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });
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

// ── 3. NUMBER COUNTER WITH EASING ────────────────────────────────────────────
function runCounter(el){
  const raw = el.dataset.count;
  if(!raw) return;
  const target = parseFloat(raw);
  const suffix = el.dataset.suffix || '';
  const isFloat = raw.includes('.');
  const dur = 1600;
  let start = null;
  const ease = t => 1 - Math.pow(1-t, 4);
  const tick = ts => {
    if(!start) start = ts;
    const p = Math.min((ts-start)/dur, 1);
    const val = ease(p) * target;
    el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
    if(p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const numObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.querySelectorAll('[data-count]').forEach(runCounter);
    numObs.unobserve(e.target);
  });
},{threshold:.3});
['#heroStats','.stats-band-inner'].forEach(sel=>{
  const el = document.querySelector(sel);
  if(el) numObs.observe(el);
});

// ── 4. TYPEWRITER BADGE ───────────────────────────────────────────────────────
(()=>{
  const el = document.querySelector('.hero-badge span');
  if(!el) return;
  const lines = [
    'Trusted by 120+ Enterprises Worldwide',
    'ISO 27001 · SOC 2 · CMMI Level 3 Certified',
    'Serving 28 Countries · Est. 2018',
    '98% Client Retention · 500+ Projects',
  ];
  let li=0, ci=0, del=false;
  el.textContent='';
  const tick = ()=>{
    const phrase = lines[li % lines.length];
    if(!del){ el.textContent = phrase.slice(0, ++ci); if(ci===phrase.length){del=true;setTimeout(tick,2400);return;} setTimeout(tick,50); }
    else { el.textContent = phrase.slice(0, --ci); if(ci===0){del=false;li++;setTimeout(tick,300);return;} setTimeout(tick,28); }
  };
  setTimeout(tick,900);
})();

// ── 5. 3D CARD TILT (svc + product + case) ────────────────────────────────────
document.querySelectorAll('.svc-card,.product-card,.case-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-6px) scale(1.015)`;
    card.style.transition='transform 0s';
    card.style.boxShadow=`${-x*18}px ${-y*18}px 50px rgba(0,102,255,.18)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transition='transform .55s cubic-bezier(.23,1,.32,1), box-shadow .55s, border-color .3s';
    card.style.transform='';
    card.style.boxShadow='';
  });
});

// ── 6. MAGNETIC CTA BUTTONS ──────────────────────────────────────────────────
document.querySelectorAll('.btn-primary,.btn-secondary,.nav-cta').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.3;
    const y=(e.clientY-r.top-r.height/2)*.3;
    btn.style.transform=`translate(${x}px,${y}px) scale(1.04)`;
    btn.style.transition='none';
  });
  btn.addEventListener('mouseleave',()=>{
    btn.style.transition='transform .4s cubic-bezier(.23,1,.32,1),background .25s,box-shadow .25s';
    btn.style.transform='';
  });
});

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

// ── 9. PROCESS STEP TIMELINE DRAW ON SCROLL ──────────────────────────────────
(()=>{
  const timeline = document.querySelector('.process-timeline');
  if(!timeline) return;
  const line = document.querySelector('.process-timeline::before');
  // Animate each step sequentially as user scrolls past them
  const steps = document.querySelectorAll('.proc-step');
  const stepObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const num = el.querySelector('.proc-num');
      const body = el.querySelector('.proc-body');
      el.style.opacity='0'; el.style.transform='translateX(-16px)';
      requestAnimationFrame(()=>{
        el.style.transition='opacity .55s cubic-bezier(.23,1,.32,1), transform .55s cubic-bezier(.23,1,.32,1)';
        el.style.opacity='1'; el.style.transform='';
      });
      if(num){ num.style.transform='scale(0)'; num.style.transition='transform .4s cubic-bezier(.34,1.56,.64,1) .15s'; requestAnimationFrame(()=>num.style.transform='scale(1)'); }
      stepObs.unobserve(el);
    });
  },{threshold:.25});
  steps.forEach(s=>stepObs.observe(s));
})();

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
      e.target.querySelectorAll('[data-count]').forEach(runCounter);
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

// ── 13. SCROLL PROGRESS LINE ──────────────────────────────────────────────────
(()=>{
  let bar = document.getElementById('scroll-progress');
  if(!bar){ bar=document.createElement('div'); bar.id='scroll-progress'; bar.style.cssText='position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#0066FF,#00C2FF);z-index:9999;width:0%;pointer-events:none;transition:width .1s'; document.body.prepend(bar); }
  window.addEventListener('scroll',()=>{
    const total=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(window.scrollY/total*100)+'%';
  },{passive:true});
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
  modal.style.cssText='position:fixed;inset:0;z-index:8500;display:flex;align-items:center;justify-content:center;padding:1.5rem;opacity:0;pointer-events:none;transition:opacity .35s cubic-bezier(.23,1,.32,1)';
  modal.innerHTML=`
    <div id="cm2Bg" style="position:absolute;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(12px)"></div>
    <div id="cm2Panel" style="position:relative;z-index:1;background:#050D1F;border:1px solid rgba(0,102,255,.2);border-radius:24px;width:100%;max-width:780px;max-height:90vh;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(0,102,255,.3) transparent;transform:scale(.94) translateY(20px);transition:transform .4s cubic-bezier(.23,1,.32,1)">
      <button onclick="closeCaseModal()" style="position:sticky;top:1rem;float:right;margin:1rem 1rem 0 0;width:36px;height:36px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:50%;color:rgba(255,255,255,.7);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:10" onmouseover="this.style.background='rgba(0,102,255,.2)';this.style.borderColor='rgba(0,102,255,.4)';this.style.color='#fff'" onmouseout="this.style.background='rgba(255,255,255,.06)';this.style.borderColor='rgba(255,255,255,.1)';this.style.color='rgba(255,255,255,.7)'">✕</button>
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
