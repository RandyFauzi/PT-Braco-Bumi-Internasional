/* main.js — REFACTORED
   - Single entry loader that injects sections/
   - initUI() sets up page-level features
   - Modular functions: navbar, anchors, reveals, hero, about, vision, clients, contact, certifications
   - Avoids duplicate handlers and conflicts
*/
if (!window.__BBI_MAIN_LOADED) {
  window.__BBI_MAIN_LOADED = true;
  console.log('[main.js] BBI main starting');

  const BASE = 'sections/';
  const SECTIONS = [
    'navbar.html',
    'hero.html',
    'about.html',
    'vision.html',
    'services.html',
    'parameter-uji.html',
    'clients.html',
    'legal.html',
    'contact.html',
    'footer.html'
  ];

  // small UI banner for errors/info
  function showBanner(msg, bg = '#fff6e6', color = '#7a4d00') {
    const id = 'bbi-error-banner';
    let el = document.getElementById(id);
    if (el) el.remove();
    el = document.createElement('div');
    el.id = id;
    el.style.position = 'fixed';
    el.style.left = '12px';
    el.style.right = '12px';
    el.style.top = '12px';
    el.style.zIndex = 99999;
    el.style.padding = '12px';
    el.style.borderRadius = '10px';
    el.style.background = bg;
    el.style.color = color;
    el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)';
    el.innerHTML = `<strong>${msg}</strong> <button id="bbi-dismiss" style="margin-left:12px;padding:6px;border-radius:8px;cursor:pointer">Dismiss</button>`;
    document.body.appendChild(el);
    document.getElementById('bbi-dismiss').onclick = () => el.remove();
  }

  // load sections async and inject into DOM
  async function loadSections() {
    const app = document.getElementById('app') || (() => { const d = document.createElement('div'); d.id = 'app'; document.body.prepend(d); return d; })();
    let loadedAny = false;
    for (const file of SECTIONS) {
      const url = BASE + file;
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) { console.warn('[main.js] fetch failed', res.status, url); continue; }
        const html = await res.text();
        if (file === 'navbar.html') {
          app.insertAdjacentHTML('beforebegin', html);
        } else if (file === 'footer.html') {
          app.insertAdjacentHTML('afterend', html);
        } else {
          const wrap = document.createElement('div');
          wrap.id = file.replace('.html', '');
          wrap.className = 'section';
          wrap.innerHTML = html;
          app.appendChild(wrap);
        }
        loadedAny = true;
      } catch (err) {
        console.error('[main.js] fetch error', url, err);
      }
    }
    if (!loadedAny) {
      showBanner('Gagal memuat sections. Pastikan folder "sections/" ada dan file HTML tersedia.');
      return;
    }
    initUI();
  }

  // ---------- UI bootstrap ----------
  function initUI() {
    initNavbar();
    initAnchors();
    initRevealStagger();
    initHeroSection();
    initAboutSection();
    initVisionModern();
    initVisionFeatures();
    initClientsSection();
    initContactSection();
    initContactLight();
    initCertCarousel(); // certification carousel in legal section
  }

  // ---------- NAVBAR ----------
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const hamb = document.getElementById('hamburger');
    const navLinks = navbar.querySelector('.nav-links');

    const TALL = 80, SHORT = 64;
    function onScroll() {
      const scrolled = window.scrollY > 48;
      navbar.classList.toggle('scrolled', scrolled);
      document.body.style.paddingTop = scrolled ? `${SHORT}px` : `${TALL}px`;

      // highlight current section
      const offset = scrolled ? SHORT : TALL;
      const pos = window.pageYOffset + offset + 1;
      const sections = document.querySelectorAll('.section[id]');
      let found = false;
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        const top = s.offsetTop;
        const h = s.offsetHeight;
        const id = s.getAttribute('id');
        const link = navbar.querySelector(`.nav-links a[href="#${id}"]`);
        if (pos >= top && pos < top + h) {
          navbar.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
          if (link) link.classList.add('active');
          found = true;
          break;
        }
      }
      if (!found && window.scrollY < 10) {
        navbar.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        const home = navbar.querySelector(`.nav-links a[href="#hero"]`);
        if (home) home.classList.add('active');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (hamb && navLinks) {
      hamb.addEventListener('click', () => {
        const open = navLinks.classList.toggle('show');
        hamb.classList.toggle('active');
        hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('no-scroll', open);
      });
      navLinks.addEventListener('click', (e) => {
        if (e.target.closest('a') && window.innerWidth <= 980) {
          navLinks.classList.remove('show');
          hamb.classList.remove('active');
          document.body.classList.remove('no-scroll');
          hamb.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // ---------- Smooth anchor handling ----------
  function initAnchors() {
    document.body.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      const navbar = document.getElementById('navbar');
      const scrolled = navbar?.classList.contains('scrolled');
      const offset = scrolled ? 64 : 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset - 10;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  // ---------- Contact form (basic simulation) ----------
  function initContactSection() {
    const form = document.querySelector('#contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]') || form.querySelector('button');
      if (btn) { btn.disabled = true; btn.textContent = 'Mengirim...'; }
      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.textContent = 'Kirim Pesan'; }
        form.reset();
        alert('Pesan terkirim (simulasi)');
      }, 900);
    });
  }

  // ---------- Light contact (alternative / small form) ----------
  function initContactLight(){
    const form = document.getElementById('contact-form-light');
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const name = form.querySelector('[name=nama]').value.trim();
      const email = form.querySelector('[name=email]').value.trim();
      if(!name || !email){ alert('Mohon isi Nama dan Email.'); return; }
      const btn = form.querySelector('.btn-primary');
      const old = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      setTimeout(()=> {
        btn.innerHTML = old;
        btn.disabled = false;
        form.reset();
        alert('Terima kasih! Pesan Anda telah terkirim.');
      }, 900);
    });

    const card = document.querySelector('.contact-card-wrap');
    if(card){
      const obs = new IntersectionObserver((entries, ob)=>{
        entries.forEach(en=>{
          if(en.isIntersecting){
            document.querySelectorAll('.ci-icon').forEach((ic,i)=>{
              ic.style.transition = 'transform .5s cubic-bezier(.2,.9,.25,1)';
              setTimeout(()=> ic.style.transform = 'translateY(-6px)', i*80);
            });
            ob.unobserve(en.target);
          }
        });
      }, {threshold:0.18});
      obs.observe(card);
    }
  }

  // ---------- Reveal & Stagger (single observer for all reveal elements) ----------
  function initRevealStagger() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (prefersReducedMotion) {
          el.classList.add('in-view');
          obs.unobserve(el);
          return;
        }
        let delay = 0;
        const explicit = el.getAttribute('data-reveal-delay');
        if (explicit !== null) {
          delay = parseInt(explicit, 10) || 0;
        } else {
          const idxAttr = el.getAttribute('data-reveal-index');
          if (idxAttr !== null) delay = (parseInt(idxAttr, 10) || 0) * 80;
        }
        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('in-view');
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

    function observeAll(list) {
      list.forEach(el => {
        if (prefersReducedMotion) { el.classList.add('in-view'); return; }
        if (el.classList.contains('in-view')) return;
        io.observe(el);
      });
    }

    const initial = Array.from(document.querySelectorAll('.reveal, .reveal-pop'));
    if (initial.length) observeAll(initial);

    const mo = new MutationObserver(muts => {
      const toObserve = [];
      for (const m of muts) {
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach(node => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches && node.matches('.reveal, .reveal-pop')) toObserve.push(node);
            toObserve.push(...Array.from(node.querySelectorAll ? node.querySelectorAll('.reveal, .reveal-pop') : []));
          });
        }
      }
      if (toObserve.length) observeAll(toObserve);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // safety fallback for old browsers / edge cases
    setTimeout(() => {
      const all = Array.from(document.querySelectorAll('.reveal, .reveal-pop'));
      const anyVisible = all.some(e => e.classList.contains('in-view'));
      if (!anyVisible && all.length) {
        all.forEach((el, i) => {
          el.style.transitionDelay = `${i * 60}ms`;
          el.classList.add('in-view');
        });
      }
    }, 2200);
  }

  // ---------- HERO helpers ----------
  function animateCounter(el, finalValue, duration = 1500) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();
    const step = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const v = Math.floor(p * (finalValue - start) + start);
      el.textContent = v.toLocaleString('id-ID');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initHeroSection() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.querySelectorAll('.stat-number[data-final]').forEach(el => {
      if (el.dataset.counted) return;
      const final = parseInt(el.dataset.final.replace(/[^\d]/g, '')) || 0;
      if (final > 0) animateCounter(el, final, 1300);
      el.dataset.counted = 'true';
    });

    const lazyImgs = hero.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const imgObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          obs.unobserve(img);
        });
      }, { rootMargin: '0px 0px 120px 0px' });
      lazyImgs.forEach(i => imgObs.observe(i));
    } else {
      lazyImgs.forEach(i => { i.src = i.dataset.src; i.removeAttribute('data-src'); });
    }
  }

  // ---------- ABOUT ----------
  function initAboutSection() {
    const about = document.getElementById('about');
    if (!about) return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      about.querySelectorAll('.reveal, .reveal-pop').forEach(el => { el.classList.add('in-view'); el.style.transition = 'none'; });
      return;
    }
    about.querySelectorAll('.community-pill').forEach(p => p.setAttribute('role', 'region'));
  }

  // ---------- VISION (modern) ----------
  function initVisionModern() {
    const section = document.getElementById('vision');
    if (!section) return;
    const els = section.querySelectorAll('.reveal');
    if (els.length) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      els.forEach(e => io.observe(e));
    }

    const cards = Array.from(section.querySelectorAll('.value-glass'));
    if (cards.length) {
      const io2 = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cards.forEach((c, i) => {
              c.style.transitionDelay = `${i * 80}ms`;
              c.classList.add('in-view');
            });
            obs.disconnect();
          }
        });
      }, { threshold: 0.12 });
      io2.observe(section);
    }

    section.querySelectorAll('.stat-number[data-final]').forEach(el => {
      if (el.dataset.counted) return;
      const final = parseInt(el.dataset.final.replace(/[^\d]/g, '')) || 0;
      if (final > 0) animateCounter(el, final, 1100);
      el.dataset.counted = 'true';
    });
  }

  function initVisionFeatures(){
    const section = document.getElementById('vision');
    if(!section) return;
    const items = Array.from(section.querySelectorAll('.feature-item'));
    if(!items.length) return;

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const idx = parseInt(el.getAttribute('data-reveal-index') || '0',10);
        el.style.transitionDelay = `${(idx || 0) * 90}ms`;
        el.classList.add('in-view');
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

    items.forEach(i => io.observe(i));

    setTimeout(()=>{
      const any = items.some(x => x.classList.contains('in-view'));
      if(!any){
        items.forEach((el,i) => {
          el.style.transitionDelay = `${i*90}ms`;
          el.classList.add('in-view');
        });
      }
    }, 2000);
  }

  // ---------- CLIENTS (logos, accordion, testimonials) ----------
  function initClientsSection(){
    const section = document.getElementById('clients');
    if(!section) return;

    // logo reveal
    const logos = Array.from(section.querySelectorAll('.logo-item'));
    logos.forEach((el, i) => {
      el.style.transition = `transform 420ms ease, opacity 420ms ease`;
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            setTimeout(()=> el.classList.add('in-view'), i * 70);
            obs.unobserve(entry.target);
          }
        });
      }, {threshold: 0.12});
      io.observe(el);
    });

    // accessible accordion if exists
    const acc = section.querySelectorAll('.accordion .ac-item');
    acc.forEach(item => {
      const btn = item.querySelector('.ac-button');
      const panel = item.querySelector('.ac-panel');
      if(!btn || !panel) return;
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        section.querySelectorAll('.accordion .ac-button').forEach(b => {
          b.setAttribute('aria-expanded','false');
          const p = b.closest('.ac-item')?.querySelector('.ac-panel');
          if(p) p.setAttribute('hidden','');
        });
        if(!expanded){ btn.setAttribute('aria-expanded','true'); panel.removeAttribute('hidden'); }
        else { btn.setAttribute('aria-expanded','false'); panel.setAttribute('hidden',''); }
      });
      btn.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowDown' || e.key === 'PageDown'){ e.preventDefault(); const next = item.nextElementSibling?.querySelector('.ac-button'); next?.focus(); }
        if(e.key === 'ArrowUp' || e.key === 'PageUp'){ e.preventDefault(); const prev = item.previousElementSibling?.querySelector('.ac-button'); prev?.focus(); }
        if(e.key === 'Home'){ e.preventDefault(); section.querySelector('.accordion .ac-button')?.focus(); }
        if(e.key === 'End'){ e.preventDefault(); const nodes = section.querySelectorAll('.accordion .ac-button'); nodes[nodes.length-1]?.focus(); }
      });
    });

    // testimonials slider (simple)
    const sliderWrap = section.querySelector('.testimonials');
    if(sliderWrap){
      const track = sliderWrap.querySelector('.testimonial-track');
      const slides = Array.from(track.querySelectorAll('.testimonial-card'));
      if(slides.length){
        let idx = 0;
        let playing = sliderWrap.getAttribute('data-autoplay') === 'true';
        const interval = parseInt(sliderWrap.getAttribute('data-interval') || '5500', 10);
        function update(){ const w = slides[0].clientWidth + 18; track.style.transform = `translateX(${ - idx * w }px)`; }
        function next(){ idx = (idx + 1) % slides.length; update(); }
        function prev(){ idx = (idx - 1 + slides.length) % slides.length; update(); }
        sliderWrap.querySelector('.t-next')?.addEventListener('click', () => { next(); playing = false; });
        sliderWrap.querySelector('.t-prev')?.addEventListener('click', () => { prev(); playing = false; });
        let timer;
        function startAuto(){ if(!playing) return; timer = setInterval(() => next(), interval); }
        function pauseAuto(){ playing = false; clearInterval(timer); }
        function resumeAuto(){ playing = true; clearInterval(timer); startAuto(); }
        sliderWrap.addEventListener('mouseenter', pauseAuto);
        sliderWrap.addEventListener('mouseleave', resumeAuto);
        sliderWrap.addEventListener('focusin', pauseAuto);
        sliderWrap.addEventListener('focusout', resumeAuto);
        window.addEventListener('resize', update);
        setTimeout(()=> { update(); startAuto(); }, 120);
      }
    }
  }

  // ---------- Certifications carousel (legal.html) ----------
    // ---------- Certifications carousel (legal.html) ----------
  function initCertCarousel(){
    const dataContainer = document.getElementById('certData');
    const imgEl = document.getElementById('certImage');
    const titleEl = document.getElementById('legal-title');
    const descEl = document.getElementById('cert-desc');
    const dateEl = document.getElementById('cert-date');
    const formatEl = document.getElementById('cert-format');
    // these buttons may be absent if you removed them from HTML
    const downloadBtn = document.getElementById('btn-download'); // may be null
    const waBtn = document.getElementById('btn-wa'); // may be null
    const indexContainer = document.getElementById('certIndex');
    const prevBtn = document.getElementById('certPrev');
    const nextBtn = document.getElementById('certNext');

    // require only the essential elements; allow buttons to be missing
    if (!dataContainer || !imgEl || !titleEl || !descEl || !dateEl || !formatEl || !indexContainer) {
      // not present on page — skip silently
      return;
    }

    const dataNodes = Array.from(dataContainer.querySelectorAll('.cert-item'));
    const items = dataNodes.map(n => ({
      src: n.dataset.src,
      pdf: n.dataset.pdf,
      title: n.dataset.title,
      desc: n.dataset.desc,
      date: n.dataset.date,
      format: n.dataset.format
    }));
    if (!items.length) return;

    // build index buttons (auto)
    function buildIndex(){
      indexContainer.innerHTML = '';
      for (let i=0;i<items.length;i++){
        const li = document.createElement('li');
        li.className = 'index-item' + (i===0 ? ' active' : '');
        li.dataset.index = String(i);
        li.tabIndex = 0;
        li.textContent = String(i+1).padStart(2,'0');
        indexContainer.appendChild(li);
      }
      return Array.from(indexContainer.querySelectorAll('.index-item'));
    }
    let indexButtons = buildIndex();

    let current = 0, anim = false;
    function setActive(i){
      indexButtons.forEach((b, idx) => b.classList.toggle('active', idx === i));
    }
    function goto(i){
      if (anim) return;
      current = ((i % items.length) + items.length) % items.length;
      const it = items[current];
      anim = true;
      imgEl.style.transition = 'opacity 220ms ease';
      imgEl.style.opacity = 0;
      setTimeout(() => {
        imgEl.src = it.src;
        imgEl.alt = it.title || 'Sertifikat';
        titleEl.textContent = it.title || '';
        descEl.textContent = it.desc || '';
        dateEl.textContent = it.date ? ('Diterbitkan: ' + it.date) : '';
        formatEl.textContent = it.format ? ('• ' + it.format) : '';
        // only update download button if it exists
        if (downloadBtn) {
          if (it.pdf) { downloadBtn.href = it.pdf; downloadBtn.removeAttribute('disabled'); }
          else { downloadBtn.href = '#'; downloadBtn.setAttribute('disabled',''); }
        }
        // only update wa button if present
        if (waBtn) {
          waBtn.href = 'https://wa.me/6287777572255?text=' + encodeURIComponent('Halo PT Braco Bumi Internasional, saya ingin verifikasi: ' + (it.title||'Sertifikat'));
        }
        setActive(current);
        requestAnimationFrame(() => imgEl.style.opacity = 1);
        setTimeout(()=> anim = false, 260);
      }, 200);
    }

    // bind events
    indexContainer.addEventListener('click', (e) => {
      const li = e.target.closest('.index-item');
      if (!li) return;
      goto(Number(li.dataset.index));
    });
    indexContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const li = e.target.closest('.index-item'); if (!li) return;
        e.preventDefault(); goto(Number(li.dataset.index));
      }
    });
    prevBtn?.addEventListener('click', () => goto(current - 1));
    nextBtn?.addEventListener('click', () => goto(current + 1));
    document.addEventListener('keydown', (e) => { if (e.key==='ArrowLeft') goto(current - 1); if (e.key==='ArrowRight') goto(current + 1); });

    // swipe support on image
    let sx = 0, dx = 0;
    imgEl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; dx = 0; }, {passive:true});
    imgEl.addEventListener('touchmove', e => { dx = e.touches[0].clientX - sx; }, {passive:true});
    imgEl.addEventListener('touchend', () => { if (Math.abs(dx) > 40) { if (dx < 0) goto(current + 1); else goto(current - 1); } sx = 0; dx =0; });

    // preload first then init
    const pre = new Image();
    pre.onload = () => { imgEl.src = items[0].src; imgEl.alt = items[0].title || 'Sertifikat'; goto(0); };
    pre.onerror = () => { imgEl.src = items[0].src; goto(0); };
    pre.src = items[0].src;
  }


  // start loader when DOM ready
  document.addEventListener('DOMContentLoaded', loadSections);
} else {
  console.log('[main.js] already loaded - skipping');
}
