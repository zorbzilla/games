/* ==========================================================================
   Detective on Duty by Quup Games: site interactions
   Everything here is progressive: the page is complete without this file.
   ========================================================================== */
(() => {
  'use strict';

  /* Store link for Detective on Duty. Every download button stays hidden until it is filled in. */
  const STORE_LINKS = {
    googleplay: '', // e.g. 'https://play.google.com/store/apps/details?id=...'
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hasIO = 'IntersectionObserver' in window;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };

  /* Runs a render function only while `el` is on screen and the tab is visible. */
  function whileVisible(el, onStart, onStop) {
    let seen = !hasIO;
    const sync = () => (seen && !document.hidden ? onStart() : onStop());
    if (hasIO) {
      new IntersectionObserver((entries) => {
        seen = entries[entries.length - 1].isIntersecting;
        sync();
      }, { rootMargin: '80px 0px' }).observe(el);
    }
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  /* ======================================================================
     1. Language (TR text lives in the HTML, EN lives here)
     ====================================================================== */
  const EN = {
    'meta.title': 'Detective on Duty | Quup Games',
    'meta.desc': 'Detective on Duty is the first mobile game from Quup Games. Search the crime scene, question the suspects, catch the contradiction. 50 case files are waiting for you.',
    skip: 'Skip to content',
    'aria.home': 'Quup Games home',
    'aria.mainnav': 'Main menu',
    'aria.footnav': 'Footer menu',
    'aria.lang': 'Change language: Turkish or English',
    'nav.game': 'Game',
    'nav.features': 'Features',
    'nav.how': 'How to play',
    'nav.cases': 'Cases',
    'nav.studio': 'Studio',
    'nav.contact': 'Contact',
    'nav.cta': 'Get in touch',
    'nav.privacy': 'Privacy policy',
    'store.gp': 'Get it on Google Play',

    'hero.chip': 'The first game from Quup Games',
    'hero.tagline': 'Pin on your badge. The file is on your desk.',
    'hero.lead': 'Search the crime scene, question the suspects, catch the contradiction in their statements. You pick the culprit, and you close the file.',
    'hero.cta1': 'Explore the game',
    'hero.cta2': 'Meet the studio',
    'fact.cases': 'case files',
    'fact.weekly': 'Weekly leaderboard',
    'fact.noacc': 'No account needed',
    'hero.hintMouse': 'The flashlight follows your cursor. There are fingerprints hidden in the dark.',
    'hero.hintTouch': 'The flashlight roams the dark. Tap to aim it.',

    'tk.scene': 'CRIME SCENE',
    'tk.cross': 'DO NOT CROSS',

    'game.eyebrow': 'The game',
    'game.title': 'Every file hides a lie.',
    'game.lead': 'In Detective on Duty, every case is an investigation. You gather evidence, compare statements and find the lie. The final call is yours.',
    'case.tape': 'DO NOT CROSS ◆ CRIME SCENE ◆ DO NOT CROSS ◆ CRIME SCENE ◆ DO NOT CROSS ◆ CRIME SCENE ◆ DO NOT CROSS ◆ CRIME SCENE ◆ DO NOT CROSS ◆ CRIME SCENE',
    'case.hintMouse': 'Move the magnifier over the scene to find the clues.',
    'case.hintTouch': 'Tap anywhere and the magnifier follows.',
    'case.eyebrow': 'Our first game',
    'case.desc': 'The precinct in your pocket: 50 case files, a weekly leaderboard and a rank waiting to climb.',
    'case.casesLabel': 'Cases',
    'case.casesVal': '50 files',
    'case.genreLabel': 'Genre',
    'case.genre': 'Detective, investigation',
    'case.platformLabel': 'Platform',
    'case.studioLabel': 'Studio',
    'case.stamp': 'On duty',
    'case.ask': 'Ask us about the game',

    'feat.eyebrow': 'Features',
    'feat.title': 'A real investigation, in the palm of your hand.',
    'feat.lead': 'Every case gives you the same tools. How you use them is up to you.',
    'f1.t': 'Crime scene',
    'f1.d': 'Search every corner. Every clue you find goes into the evidence log; you’ll learn later which ones matter.',
    'f1.tag': 'Evidence log',
    'f2.t': 'Interrogation room',
    'f2.d': 'Confront statements with evidence. Strike the right balance between pressure and trust.',
    'f2.tag': 'Pressure and trust',
    'f2.m1': 'PRESSURE',
    'f2.m2': 'TRUST',
    'f3.t': 'Deduction board',
    'f3.d': 'Pin the clues to the board and connect them. The right link leads you to the right suspect.',
    'f3.tag': 'Connections',
    'f4.t': 'Contradictions',
    'f4.d': 'Times, statements and evidence have to line up. If they don’t, someone is lying.',
    'f4.tag': 'Timeline',
    'f5.t': 'Career',
    'f5.d': 'Every file you close raises your rank and grows your reputation.',
    'f5.tag': 'Rank and reputation',
    'f6.t': 'Weekly leaderboard',
    'f6.d': 'A new race every week. Climb past the other detectives with the experience you earn.',
    'f6.tag': 'Fresh every week',
    'f6.you': 'YOU',

    'flow.eyebrow': 'How to play',
    'flow.title': 'One case, five steps.',
    'flow.lead': 'From the moment you open a file to the moment you close it, every step builds on the last.',
    's1.t': 'Briefing',
    's1.d': 'Open the file. Get to know the incident, the place and the people.',
    's2.t': 'Crime scene',
    's2.d': 'Gather the evidence. One small detail can change everything.',
    's3.t': 'Interrogation',
    's3.d': 'Hear the suspects out and confront their statements with evidence.',
    's4.t': 'Deduction',
    's4.d': 'Connect the clues on the board and expose the contradiction.',
    's5.t': 'Verdict',
    's5.d': 'Pick the culprit, write your report, close the file.',

    'files.eyebrow': 'Case files',
    'files.title': '50 files. All of them waiting to be solved.',
    'files.lead': 'Here are the first eight files on the desk. There are 42 more in the archive.',
    'files.tab': 'File',
    'files.stamp': 'Classified',
    'files.more': 'more files in the archive',
    'files.moreSub': 'All of them are waiting in the game.',

    'stu.eyebrow': 'Studio',
    'stu.title': 'We are Quup Games.',
    'stu.text': 'Quup Games is an independent mobile game studio. Detective on Duty is our first game. Every game we make follows the same three rules.',
    'stu.v1t': 'Fun comes first',
    'stu.v1d': 'No mechanic makes it into a game unless it’s fun in the first minute.',
    'stu.v2t': 'Smooth on every phone',
    'stu.v2d': 'Games that open fast and go easy on the battery, even on older phones.',
    'stu.v3t': 'Respect for players',
    'stu.v3d': 'We don’t ask for an account to play. Your progress stays on your own phone.',
    'priv.eyebrow': 'Privacy',
    'priv.title': 'Privacy, in short.',
    'priv.1': 'No account, email or ID needed.',
    'priv.2': 'Your save and progress are stored on your phone.',
    'priv.3': 'The leaderboard only shows your handle, score, rank and avatar.',
    'priv.4': 'You can delete your account and data from the Settings screen in the game.',
    'priv.cta': 'Read the full privacy policy',

    'ct.eyebrow': 'Contact',
    'ct.title': 'Got a lead? Write to us.',
    'ct.lead': 'Support, feedback, press or partnerships. It all comes to the same address.',
    'ct.copy': 'Copy address',
    'ct.send': 'Send an email',
    'links.title': 'Links',
    'link.gp': 'Download Detective on Duty',
    'link.privT': 'Privacy policy',
    'link.privD': 'What the game does with data, on one page',
    'link.shareT': 'Share this page',
    'link.shareD': 'Send the link to a friend',

    'ft.tag': 'Pin on your badge. The file is on your desk.',
    'ft.rights': 'All rights reserved.',
    'ft.top': 'Back to top',
  };

  // Strings that only exist at runtime.
  const EXTRA = {
    tr: {
      'aria.menuOpen': 'Menüyü aç',
      'aria.menuClose': 'Menüyü kapat',
      'ct.copied': 'E-posta adresi kopyalandı',
      'ct.select': 'Adres seçildi, şimdi kopyalayabilirsin',
      'share.text': 'Detective on Duty: Quup Games’in ilk oyunu.',
      'share.copied': 'Sayfa bağlantısı kopyalandı',
      'share.fail': 'Bağlantı: ',
    },
    en: {
      'aria.menuOpen': 'Open menu',
      'aria.menuClose': 'Close menu',
      'ct.copied': 'Email address copied',
      'ct.select': 'Address selected, ready to copy',
      'share.text': 'Detective on Duty: the first game from Quup Games.',
      'share.copied': 'Page link copied',
      'share.fail': 'Link: ',
    },
  };

  const TR = {};
  $$('[data-i18n]').forEach((el) => {
    const k = el.dataset.i18n;
    if (!(k in TR)) TR[k] = el.textContent;
  });
  $$('[data-i18n-aria]').forEach((el) => {
    const k = el.dataset.i18nAria;
    if (!(k in TR)) TR[k] = el.getAttribute('aria-label') || '';
  });
  const metaDesc = $('meta[name="description"]');
  TR['meta.title'] = document.title;
  TR['meta.desc'] = metaDesc ? metaDesc.content : '';

  const DICT = { tr: Object.assign(TR, EXTRA.tr), en: Object.assign({}, EXTRA.en, EN) };
  let lang = 'tr';
  const t = (k) => {
    const v = DICT[lang][k];
    return v != null ? v : DICT.tr[k];
  };
  window.ZG = {
    t,
    get lang() { return lang; },
    // handy when checking a real device from the console: ZG.fx
    get fx() { return shader ? shader.state : 'css-fallback'; },
  };

  function setLang(next, remember) {
    lang = next === 'en' ? 'en' : 'tr';
    root.lang = lang;
    const d = DICT[lang];
    $$('[data-i18n]').forEach((el) => {
      const v = d[el.dataset.i18n];
      if (typeof v === 'string') el.textContent = v;
    });
    $$('[data-i18n-aria]').forEach((el) => {
      const v = d[el.dataset.i18nAria];
      if (typeof v === 'string') el.setAttribute('aria-label', v);
    });
    if (d['meta.title']) document.title = d['meta.title'];
    if (metaDesc && d['meta.desc']) metaDesc.content = d['meta.desc'];
    syncBurgerLabel();
    if (remember) store.set('qg-lang', lang);
    if (map) requestAnimationFrame(map.layout);
  }

  /* ======================================================================
     2. Header: scrolled state, hide on scroll down, progress bar, active link
     ====================================================================== */
  const hud = $('#hud');
  const xpFill = $('#xpFill');
  const burger = $('#burger');
  const mnav = $('#mnav');
  let menuOpen = false;
  let lastY = window.scrollY;
  let scrollQueued = false;

  function syncBurgerLabel() {
    if (burger) burger.setAttribute('aria-label', t(menuOpen ? 'aria.menuClose' : 'aria.menuOpen'));
  }

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(scrollFrame);
  }

  function scrollFrame() {
    scrollQueued = false;
    // reads first
    const y = window.scrollY;
    const max = root.scrollHeight - window.innerHeight;
    const mapBox = map ? map.measure() : null;
    // then writes
    hud.classList.toggle('is-scrolled', y > 8);
    if (!menuOpen) {
      if (y > lastY + 6 && y > 520) hud.classList.add('is-hidden');
      else if (y < lastY - 6 || y <= 520) hud.classList.remove('is-hidden');
    }
    if (Math.abs(y - lastY) > 6) lastY = y;
    if (xpFill) xpFill.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0})`;
    if (mapBox) map.paint(mapBox);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  hud.addEventListener('focusin', () => hud.classList.remove('is-hidden'));

  function initScrollSpy() {
    const links = $$('.nav__link');
    const targets = [$('#top')].concat(links.map((a) => $(a.getAttribute('href')))).filter(Boolean);
    if (!hasIO || !links.length) return;
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = '#' + en.target.id;
        links.forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === id ? 'true' : 'false'));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach((s) => spy.observe(s));
  }

  /* ======================================================================
     3. Mobile menu
     ====================================================================== */
  function setMenu(open) {
    if (!burger || !mnav) return;
    menuOpen = open;
    burger.setAttribute('aria-expanded', String(open));
    syncBurgerLabel();
    root.classList.toggle('menu-open', open);
    if (open) {
      mnav.hidden = false;
      hud.classList.remove('is-hidden');
      requestAnimationFrame(() => mnav.classList.add('is-open'));
      const first = $('a', mnav);
      if (first) first.focus({ preventScroll: true });
    } else {
      mnav.classList.remove('is-open');
      mnav.hidden = true;
    }
  }

  if (burger && mnav) {
    burger.addEventListener('click', () => setMenu(!menuOpen));
    mnav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenu(false);
        burger.focus();
      }
    });
    const wide = window.matchMedia('(min-width: 1041px)');
    const onWide = (e) => { if (e.matches && menuOpen) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
  }

  /* ======================================================================
     4. Hero background: a flashlight in a smoky dark room that reveals
        fingerprints. WebGL with adaptive quality: it refuses software
        rendering, lowers resolution and frame rate on slow devices, pauses
        off-screen and falls back to the CSS background.
     ====================================================================== */
  const hero = $('.hero');
  let heroVisible = true;
  let heroBottom = 0; // cached so pointer handlers never force a layout

  const shader = (() => {
    const canvas = $('#heroBg');
    const badge = $('#heroBadge');
    if (!canvas || !hero || !window.WebGLRenderingContext) return null;
    const force = /[?&]gl=force\b/.test(window.location.search);
    let gl = null;
    try {
      gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: !force,
      });
    } catch (e) {
      gl = null;
    }
    if (!gl) return null;

    const vsSrc = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fsSrc = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLight;
uniform vec2 uFocus;
uniform float uUnit;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return v;
}
float fprint(vec2 p, vec2 c, float s, float rot){
  vec2 q = p - c;
  float cs = cos(rot); float sn = sin(rot);
  q = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y) / s;
  q.y *= 0.8;
  float r = length(q);
  float ridge = abs(sin((r + noise(q * 5.0) * 0.07) * 26.0));
  return smoothstep(0.62, 0.18, ridge) * smoothstep(1.0, 0.65, r);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 asp = uRes / min(uRes.x, uRes.y);
  vec2 p = uv * asp;
  float t = uTime;
  vec3 bg = vec3(0.035, 0.035, 0.043);
  float smoke = fbm(p * 1.7 + vec2(t * 0.03, t * 0.012));
  vec3 col = bg * 0.75 + vec3(0.055, 0.055, 0.068) * smoke;
  vec2 f = uFocus * asp;
  col += vec3(1.0, 0.8, 0.35) * 0.06 * exp(-dot(p - f, p - f) * 6.0);
  vec2 L = uLight * asp;
  float d = length(p - L);
  float light = exp(-d * d * 16.0) * 0.8 + smoothstep(0.32, 0.28, d) * 0.2;
  col += vec3(1.0, 0.92, 0.76) * light * (0.06 + 0.14 * smoke);
  float s = 120.0 * uUnit;
  float clues = fprint(p, vec2(0.16, 0.30) * asp, s, 0.4)
              + fprint(p, vec2(0.60, 0.84) * asp, s * 0.85, -0.7)
              + fprint(p, vec2(0.90, 0.20) * asp, s * 1.05, 1.2)
              + fprint(p, vec2(0.40, 0.58) * asp, s * 0.8, 2.3)
              + fprint(p, vec2(0.78, 0.55) * asp, s * 0.9, -2.0);
  col += vec3(1.0, 0.84, 0.3) * clues * light * 0.42;
  vec2 q = uv - 0.5;
  col *= 1.0 - 0.6 * dot(q, q);
  col = mix(col, bg, smoothstep(0.18, 0.0, uv.y));
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {
      res: gl.getUniformLocation(prog, 'uRes'),
      time: gl.getUniformLocation(prog, 'uTime'),
      light: gl.getUniformLocation(prog, 'uLight'),
      focus: gl.getUniformLocation(prog, 'uFocus'),
      unit: gl.getUniformLocation(prog, 'uUnit'),
    };

    let scale = window.innerWidth < 700 ? 0.5 : 0.42;
    let halfRate = false;
    let frozen = false;
    let running = false;
    let raf = 0;
    let odd = false;
    let lastT = 0;
    let acc = 0;
    let frames = 0;
    let strikes = 0;
    let startedAt = 0;
    let winStart = 0;
    let heroTop = 0;
    let heroH = 1;
    let cssMin = 1;
    let shown = false;
    const t0 = performance.now();
    const focus = [0.72, 0.5];
    // the flashlight wanders on its own until a mouse or a tap takes over
    const light = { x: 0.66, y: 0.5, tx: 0.66, ty: 0.5, mouse: false, until: 0 };

    function measure() {
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      if (!w || !h) return;
      heroTop = hero.getBoundingClientRect().top + window.scrollY;
      heroH = h;
      cssMin = Math.min(w, h);
      canvas.width = Math.max(2, Math.round(w * scale));
      canvas.height = Math.max(2, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (badge) {
        const hr = hero.getBoundingClientRect();
        const br = badge.getBoundingClientRect();
        focus[0] = (br.left + br.width / 2 - hr.left) / hr.width;
        focus[1] = 1 - (br.top + br.height / 2 - hr.top) / hr.height;
      }
      // resizing clears the drawing buffer, so paint right away to avoid a blank frame
      render(performance.now());
    }

    function render(now) {
      const still = mqReduce.matches;
      const time = still ? 14 : (now - t0) / 1000;
      if (still) {
        light.tx = 0.7;
        light.ty = 0.42;
      } else if (!light.mouse && now > light.until) {
        light.tx = 0.5 + 0.32 * Math.sin(time * 0.23) + 0.1 * Math.sin(time * 0.61);
        light.ty = 0.5 + 0.26 * Math.sin(time * 0.31 + 1.2);
      }
      const k = still ? 1 : light.mouse ? 0.16 : 0.035;
      light.x += (light.tx - light.x) * k;
      light.y += (light.ty - light.y) * k;
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, time);
      gl.uniform2f(U.light, light.x, light.y);
      gl.uniform2f(U.focus, focus[0], focus[1]);
      gl.uniform1f(U.unit, 1 / cssMin);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.classList.add('is-ready');
      }
    }

    // Quality ladder: lower resolution -> half frame rate -> freeze on the last frame.
    function degrade(severe) {
      if (severe && (scale > 0.25 || !halfRate)) {
        scale = 0.24;
        halfRate = true;
        measure();
      } else if (!severe && scale > 0.26) {
        scale = Math.max(0.24, scale * 0.72);
        measure();
      } else if (!severe && !halfRate) {
        halfRate = true;
      } else {
        frozen = true;
        stop();
      }
    }

    // Judge smoothness in one-second windows, ignoring the first second after a (re)start.
    function loop(now) {
      raf = requestAnimationFrame(loop);
      const dt = lastT ? now - lastT : 0;
      lastT = now;
      if (now - startedAt > 1000 && dt > 0 && dt < 250) {
        if (!winStart) winStart = now;
        acc += dt;
        frames += 1;
        if (now - winStart >= 1000) {
          const avg = acc / frames;
          acc = 0;
          frames = 0;
          winStart = now;
          if (avg > 34) {
            strikes = 0;
            degrade(true);
          } else if (avg > 21) {
            strikes += 1;
            if (strikes >= 2) { strikes = 0; degrade(false); }
          } else {
            strikes = 0;
          }
        }
      }
      if (!running) return;
      if (halfRate && (odd = !odd)) return;
      render(now);
    }

    function start() {
      if (running || frozen || document.hidden || !heroVisible) return;
      if (mqReduce.matches) { render(performance.now()); return; }
      running = true;
      lastT = 0;
      acc = 0;
      frames = 0;
      winStart = 0;
      startedAt = performance.now();
      raf = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function aim(x, y, mode) {
      light.tx = clamp(x / window.innerWidth, 0, 1);
      light.ty = clamp(1 - (y + window.scrollY - heroTop) / heroH, 0, 1);
      if (mode === 'mouse') light.mouse = true;
      else light.until = performance.now() + 3200;
      if (!running) render(performance.now());
    }

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      stop();
      frozen = true;
      canvas.classList.remove('is-ready');
    });

    measure();
    return {
      start,
      stop,
      measure,
      aim,
      release() { light.mouse = false; },
      get state() { return frozen ? 'frozen' : `${halfRate ? 'half-rate' : 'full-rate'} @${scale.toFixed(2)}`; },
    };
  })();

  /* ======================================================================
     5. Pointer parallax: the hero badge and props, the studio emblem.
        Eased in rAF; writes two custom properties and nothing else.
     ====================================================================== */
  function parallax(stage) {
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    const tick = () => {
      raf = 0;
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      stage.style.setProperty('--px', x.toFixed(4));
      stage.style.setProperty('--py', y.toFixed(4));
      if (Math.abs(tx - x) > 0.0005 || Math.abs(ty - y) > 0.0005) raf = requestAnimationFrame(tick);
    };
    return (nx, ny) => {
      tx = nx;
      ty = ny;
      if (!raf) raf = requestAnimationFrame(tick);
    };
  }

  function initHeroPointer() {
    const stage = $('#heroStage');
    if (!stage || !hero) return;
    const aimAt = parallax(stage);

    window.addEventListener('pointermove', (e) => {
      if (!heroVisible || e.pointerType !== 'mouse') return;
      const inside = e.clientY + window.scrollY < heroBottom;
      if (shader) {
        if (inside) shader.aim(e.clientX, e.clientY, 'mouse');
        else shader.release();
      }
      if (mqReduce.matches) return;
      aimAt((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });

    hero.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' && shader) shader.aim(e.clientX, e.clientY, 'touch');
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      aimAt(0, 0);
      if (shader) shader.release();
    });
  }

  // The stage box is measured on relayout (page coordinates), so pointer moves never force a layout.
  const studioTilt = (() => {
    const stage = $('#studioStage');
    const zone = $('#studyo');
    if (!stage || !zone) return null;
    const aimAt = parallax(stage);
    const box = { x: 0, y: 0, w: 1, h: 1 };
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || mqReduce.matches) return;
      aimAt(clamp((e.pageX - box.x) / box.w, -1, 1), clamp((e.pageY - box.y) / box.h, -1, 1));
    }, { passive: true });
    zone.addEventListener('pointerleave', () => aimAt(0, 0));
    return {
      measure() {
        const r = stage.getBoundingClientRect();
        box.x = r.left + window.scrollX + r.width / 2;
        box.y = r.top + window.scrollY + r.height / 2;
        box.w = Math.max(1, r.width * 0.9);
        box.h = Math.max(1, r.height * 0.9);
      },
    };
  })();

  /* ======================================================================
     6. The noir scene: rain + a magnifier that reveals hidden clues
     ====================================================================== */
  function initRain() {
    const canvas = $('#caseRain');
    const host = $('#caseArt');
    if (!canvas || !host || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let W = 0;
    let H = 0;
    let dpr = 1;
    let drops = [];
    let running = false;
    let raf = 0;
    let last = 0;

    const make = (anywhere) => ({
      x: Math.random() * (W + 160) - 80,
      y: anywhere ? Math.random() * H : -Math.random() * 120,
      l: 12 + Math.random() * 22,
      v: 720 + Math.random() * 520,
      far: Math.random() < 0.55,
    });

    function draw(dt) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (let pass = 0; pass < 2; pass++) {
        const far = pass === 0;
        ctx.beginPath();
        for (const d of drops) {
          if (d.far !== far) continue;
          const v = d.v * (far ? 0.72 : 1);
          d.y += v * dt;
          d.x += v * dt * 0.16;
          if (d.y - d.l > H) Object.assign(d, make(false));
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - d.l * 0.16, d.y - d.l);
        }
        ctx.strokeStyle = far ? 'rgba(170, 178, 215, 0.2)' : 'rgba(214, 218, 240, 0.36)';
        ctx.lineWidth = far ? 1 : 1.5;
        ctx.stroke();
      }
    }

    function resize() {
      W = host.clientWidth;
      H = host.clientHeight;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const n = Math.round(Math.min(170, (W * H) / 4000));
      drops = Array.from({ length: n }, () => make(true));
      draw(0);
    }

    function frame(now) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(frame);
    }

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
    resize();
    whileVisible(host, () => {
      if (running || mqReduce.matches) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }, () => {
      running = false;
      cancelAnimationFrame(raf);
    });
  }

  function initLens() {
    const art = $('#caseArt');
    const clues = $('#caseClues');
    const lens = $('#caseLens');
    if (!art || !clues || !lens) return;
    let W = 0;
    let H = 0;
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let hover = false;
    let until = 0;
    let visible = false;
    const t0 = performance.now();

    const apply = () => {
      clues.style.setProperty('--lx', `${x.toFixed(1)}px`);
      clues.style.setProperty('--ly', `${y.toFixed(1)}px`);
      lens.style.setProperty('--lxp', `${x.toFixed(1)}px`);
      lens.style.setProperty('--lyp', `${y.toFixed(1)}px`);
    };
    const tick = (now) => {
      raf = 0;
      const still = mqReduce.matches;
      if (!hover && now > until && !still) {
        const s = (now - t0) / 1000;
        tx = W * (0.52 + 0.3 * Math.sin(s * 0.33));
        ty = H * (0.64 + 0.14 * Math.sin(s * 0.57 + 1));
      }
      const k = hover ? 0.3 : 0.07;
      x += (tx - x) * k;
      y += (ty - y) * k;
      apply();
      const moving = Math.abs(tx - x) + Math.abs(ty - y) > 0.4;
      if (visible && (!still || moving)) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };

    const size = () => {
      W = art.clientWidth;
      H = art.clientHeight;
      if (!x) {
        x = tx = W * 0.62;
        y = ty = H * 0.72;
      }
      x = clamp(x, 0, W);
      y = clamp(y, 0, H);
      apply();
    };
    const point = (e) => {
      const r = art.getBoundingClientRect();
      tx = clamp(e.clientX - r.left, 0, r.width);
      ty = clamp(e.clientY - r.top, 0, r.height);
    };

    art.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      point(e);
      hover = true;
      kick();
    });
    art.addEventListener('pointerleave', () => { hover = false; });
    art.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      point(e);
      until = performance.now() + 3500;
      kick();
    });

    if ('ResizeObserver' in window) new ResizeObserver(size).observe(art);
    size();
    whileVisible(art, () => { visible = true; kick(); }, () => {
      visible = false;
      cancelAnimationFrame(raf);
      raf = 0;
    });
  }

  /* ======================================================================
     7. How to play: a winding level-map path that fills as you scroll
     ====================================================================== */
  const map = (() => {
    const el = $('#map');
    if (!el) return null;
    const svg = $('.map__svg', el);
    const track = $('.map__track', el);
    const prog = $('.map__progress', el);
    const steps = $$('.step', el);
    const nodes = $$('.step__node', el);
    let len = 0;
    let fracs = [];
    let ready = false;

    const cubicLen = (a, b, c, d) => {
      let L = 0;
      let px = a[0];
      let py = a[1];
      for (let i = 1; i <= 20; i++) {
        const s = i / 20;
        const m = 1 - s;
        const x = m * m * m * a[0] + 3 * m * m * s * b[0] + 3 * m * s * s * c[0] + s * s * s * d[0];
        const y = m * m * m * a[1] + 3 * m * m * s * b[1] + 3 * m * s * s * c[1] + s * s * s * d[1];
        L += Math.hypot(x - px, y - py);
        px = x;
        py = y;
      }
      return L;
    };
    const quadLen = (a, c, b) => cubicLen(a, [a[0] + (2 / 3) * (c[0] - a[0]), a[1] + (2 / 3) * (c[1] - a[1])], [b[0] + (2 / 3) * (c[0] - b[0]), b[1] + (2 / 3) * (c[1] - b[1])], b);
    const pt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

    function layout() {
      const mr = el.getBoundingClientRect();
      if (!mr.width || nodes.length < 2) return;
      const pts = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return [r.left + r.width / 2 - mr.left, r.top + r.height / 2 - mr.top];
      });
      const boxes = steps.map((s) => s.getBoundingClientRect());
      const vertical = Math.abs(pts[1][1] - pts[0][1]) > Math.abs(pts[1][0] - pts[0][0]);
      let d = `M${pt(pts[0])}`;
      const cum = [0];
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        let seg;
        let segLen;
        if (vertical) {
          // a soft S-curve that stays inside the node column
          const c1 = [a[0], (a[1] + b[1]) / 2];
          const c2 = [b[0], (a[1] + b[1]) / 2];
          seg = ` C${pt(c1)} ${pt(c2)} ${pt(b)}`;
          segLen = cubicLen(a, c1, c2, b);
        } else {
          // side by side: run along the node row and turn in the gap between columns
          const gx = (boxes[i - 1].right + boxes[i].left) / 2 - mr.left;
          const dy = b[1] - a[1];
          const dir = Math.sign(dy) || 1;
          const r = Math.max(0, Math.min(26, Math.abs(dy) / 2, gx - a[0] - 2, b[0] - gx - 2));
          const p1 = [gx - r, a[1]];
          const k1 = [gx, a[1]];
          const p2 = [gx, a[1] + dir * r];
          const p3 = [gx, b[1] - dir * r];
          const k2 = [gx, b[1]];
          const p4 = [gx + r, b[1]];
          seg = ` L${pt(p1)} Q${pt(k1)} ${pt(p2)} L${pt(p3)} Q${pt(k2)} ${pt(p4)} L${pt(b)}`;
          segLen = (p1[0] - a[0]) + quadLen(p1, k1, p2) + Math.abs(p3[1] - p2[1]) + quadLen(p3, k2, p4) + (b[0] - p4[0]);
        }
        d += seg;
        cum.push(cum[i - 1] + segLen);
      }
      const total = cum[cum.length - 1] || 1;
      fracs = cum.map((v) => v / total);
      svg.setAttribute('viewBox', `0 0 ${mr.width.toFixed(1)} ${mr.height.toFixed(1)}`);
      track.setAttribute('d', d);
      prog.setAttribute('d', d);
      len = prog.getTotalLength ? prog.getTotalLength() : total;
      prog.style.strokeDasharray = `${len} ${len}`;
      ready = true;
      if (mqReduce.matches) {
        prog.style.strokeDashoffset = '0';
        el.classList.remove('is-live');
        return;
      }
      el.classList.add('is-live');
      paint(measure());
    }

    function measure() {
      if (!ready) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, height: r.height, vh: window.innerHeight };
    }

    function paint(box) {
      if (!box || mqReduce.matches) return;
      const raw = (box.vh * 0.74 - box.top) / box.height;
      const p = clamp(raw, 0, 1);
      prog.style.strokeDashoffset = String(len * (1 - p));
      steps.forEach((s, i) => s.classList.toggle('is-on', raw >= fracs[i] - 0.001));
    }

    return { layout, measure, paint };
  })();

  /* ======================================================================
     8. Feature cards: one illustration plays at a time on desktop (the
        hovered card, otherwise each card in turn); touch screens play the
        one or two cards that are on screen. Everything else stays paused.
     ====================================================================== */
  function initFeats() {
    const cards = $$('.feat');
    if (!cards.length) return;
    if (!hasIO) { cards.forEach((c) => c.classList.add('is-live')); return; }
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const seen = new Set();
    let hovered = null;
    let auto = null;
    let timer = 0;

    const apply = () => {
      const live = new Set();
      if (!document.hidden && !mqReduce.matches) {
        if (!fine.matches) seen.forEach((c) => live.add(c));
        else if (hovered) live.add(hovered);
        else if (auto) live.add(auto);
      }
      cards.forEach((c) => c.classList.toggle('is-live', live.has(c)));
    };
    const step = () => {
      const vis = cards.filter((c) => seen.has(c));
      auto = vis.length ? vis[(vis.indexOf(auto) + 1) % vis.length] : null;
      apply();
    };
    const sync = () => {
      const cycle = fine.matches && seen.size > 0 && !document.hidden && !mqReduce.matches;
      if (cycle && !timer) timer = setInterval(() => { if (!hovered) step(); }, 5200);
      if (!cycle && timer) { clearInterval(timer); timer = 0; }
      if (cycle && (!auto || !seen.has(auto))) step();
      else apply();
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) seen.add(en.target); else seen.delete(en.target); });
      sync();
    }, { threshold: 0.35 });
    cards.forEach((c) => {
      io.observe(c);
      c.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse') return;
        hovered = c;
        apply();
      });
      c.addEventListener('pointerleave', () => {
        if (hovered !== c) return;
        hovered = null;
        auto = c; // carry on from here
        apply();
      });
    });
    document.addEventListener('visibilitychange', sync);
    if (fine.addEventListener) fine.addEventListener('change', sync);
  }

  /* ======================================================================
     9. Pause looping CSS animations while their part of the page is off-screen
     ====================================================================== */
  function initPausing() {
    if (!hasIO) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.target.classList.toggle('fx-paused', !en.isIntersecting));
    }, { rootMargin: '120px 0px' });
    [$('.hero'), $('.ticker'), $('#studioStage')].filter(Boolean).forEach((el) => io.observe(el));
  }

  /* ======================================================================
     10. Small things: store links, copy e-mail, share, footer year
     ====================================================================== */
  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2400);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return Promise.reject(new Error('no clipboard'));
  }

  function initCopy() {
    const btn = $('#copyMail');
    const addr = $('#mailAddr');
    if (!btn || !addr) return;
    const selectAddr = () => {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(addr);
      sel.removeAllRanges();
      sel.addRange(range);
      toast(t('ct.select'));
    };
    btn.addEventListener('click', () => {
      copyText(addr.textContent.trim()).then(() => toast(t('ct.copied')), selectAddr);
    });
  }

  function initShare() {
    const btn = $('#shareBtn');
    if (!btn) return;
    const canonical = $('link[rel="canonical"]');
    btn.addEventListener('click', () => {
      const url = canonical ? canonical.href : window.location.href.split('#')[0];
      const data = { title: document.title, text: t('share.text'), url };
      if (navigator.share) {
        navigator.share(data).catch(() => { /* closed by the visitor */ });
        return;
      }
      copyText(url).then(() => toast(t('share.copied')), () => toast(t('share.fail') + url));
    });
  }

  function initStoreLinks() {
    let any = false;
    $$('[data-store]').forEach((a) => {
      const url = STORE_LINKS[a.dataset.store];
      if (!url) return;
      any = true;
      a.href = url;
      a.hidden = false;
      const wrap = a.closest('[data-store-wrap]');
      if (wrap) wrap.hidden = false;
    });
    root.classList.toggle('has-store', any);
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get('lang') || store.get('qg-lang');
  if (wanted === 'en') setLang('en', false);
  else syncBurgerLabel();

  const langBtn = $('#langToggle');
  if (langBtn) langBtn.addEventListener('click', () => setLang(lang === 'tr' ? 'en' : 'tr', true));

  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  initStoreLinks();
  initScrollSpy();
  initHeroPointer();
  initRain();
  initLens();
  initCopy();
  initShare();
  initFeats();
  initPausing();

  if (hasIO && hero) {
    new IntersectionObserver((entries) => {
      heroVisible = entries[entries.length - 1].isIntersecting;
      if (!shader) return;
      if (heroVisible) shader.start();
      else shader.stop();
    }).observe(hero);
  } else if (shader) {
    shader.start();
  }

  document.addEventListener('visibilitychange', () => {
    if (!shader) return;
    if (document.hidden) shader.stop();
    else shader.start();
  });

  const relayout = () => {
    if (hero) heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
    if (shader) shader.measure();
    if (studioTilt) studioTilt.measure();
    if (map) map.layout();
    scrollFrame();
  };
  if ('ResizeObserver' in window) {
    let pending = false;
    new ResizeObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        relayout();
      });
    }).observe(document.body);
  } else {
    window.addEventListener('resize', relayout);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);

  relayout();
})();
