/* ==========================================================================
   QuUp Games: site interactions (every page)
   Everything here is progressive: each page is complete without this file.
   ========================================================================== */
(() => {
  'use strict';

  /* Store links for Detective on Duty; every store button on every page reads them.
     Google Play: until it is filled in, the button stays visible and says "coming soon" when clicked.
     App Store: until it is filled in, the button stays greyed out with a "Coming soon" tip. */
  const STORE_LINKS = {
    googleplay: '', // e.g. 'https://play.google.com/store/apps/details?id=...'
    appstore: '', // e.g. 'https://apps.apple.com/app/id...'
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const page = document.body.dataset.page || 'home';
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
     1. Language (Turkish lives in the HTML, English lives here)
     ====================================================================== */
  const EN = {
    skip: 'Skip to content',
    'aria.home': 'QuUp Games home',
    'aria.mainnav': 'Main menu',
    'aria.gamesMenu': 'Games menu',
    'aria.lang': 'Change language: Turkish or English',
    'nav.home': 'Home',
    'nav.about': 'About us',
    'nav.games': 'Games',
    'nav.privacy': 'Privacy',
    'nav.contact': 'Contact',
    'menu.gameSub': 'Detective · Android',
    'menu.new': 'New',
    'tab.overview': 'Overview',
    'tab.features': 'Features',
    'tab.how': 'How to play',
    'tab.cases': 'Cases',
    'store.gpSmall': 'For Android',
    'store.asSmall': 'For iPhone',
    'store.soon': 'Coming soon',
    'ft.slogan': 'Your next adventure is queued up.',
    'ft.rights': 'All rights reserved.',

    // home
    'home.new': 'Out now',
    'home.newText': 'Our first game is live',
    'home.tagline': 'Pin on your badge. The file is on your desk.',
    'home.lead': 'Search the crime scene, question the suspects, catch the contradiction in their statements. 50 case files are waiting for you.',
    'home.explore': 'Explore the game',
    'fact.cases': 'case files',
    'fact.weekly': 'Weekly leaderboard',
    'fact.noacc': 'No account needed',
    'phone.title': 'Case files',
    'phone.solved': 'Solved',
    'tk.scene': 'CRIME SCENE',
    'tk.cross': 'DO NOT CROSS',

    // game
    'game.new': 'Out now',
    'game.desc': 'The precinct in your pocket: 50 case files, a weekly leaderboard and a rank waiting to climb. Search the scene, question the suspects, find the lie.',
    'game.genreL': 'Genre',
    'game.genre': 'Detective, investigation',
    'game.platformL': 'Platform',
    'game.casesL': 'Cases',
    'game.casesV': '50 files',
    'game.devL': 'Developer',
    'ov.hintMouse': 'Move the magnifier over the scene to find hidden clues.',
    'ov.hintTouch': 'Tap anywhere and the magnifier follows.',
    'game.tagline': 'Every file hides a lie.',
    'case.tape': 'DO NOT CROSS ◆ CRIME SCENE ◆ DO NOT CROSS ◆ CRIME SCENE ◆ DO NOT CROSS ◆ CRIME SCENE ◆ DO NOT CROSS ◆ CRIME SCENE ◆ DO NOT CROSS ◆ CRIME SCENE',
    'f1.t': 'Crime scene',
    'f1.d': 'Search every corner. Every clue you find goes into the evidence log.',
    'f2.t': 'Interrogation',
    'f2.d': 'Confront statements with evidence. Balance pressure and trust.',
    'f2.m1': 'PRESSURE',
    'f2.m2': 'TRUST',
    'f3.t': 'Deduction board',
    'f3.d': 'Pin the clues and connect them. The right link leads to the right suspect.',
    'f4.t': 'Contradictions',
    'f4.d': 'Times, statements and evidence must line up. If not, someone is lying.',
    'f5.t': 'Career',
    'f5.d': 'Every file you close raises your rank and grows your reputation.',
    'f6.t': 'Weekly leaderboard',
    'f6.d': 'A new race every week. Climb past the other detectives.',
    'f6.you': 'YOU',
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
    'files.tab': 'File',
    'files.stamp': 'Classified',
    'files.more': 'more files in the archive',
    'files.moreSub': 'All of them are waiting in the game.',

    // about
    'about.eyebrow': 'About us',
    'about.kicker': 'Independent mobile game studio',
    'about.lead': 'We make games for your phone that stay with you. Our first game, Detective on Duty, is out now. Every game we make follows the same three rules.',
    'v1.t': 'Fun comes first',
    'v1.d': 'No mechanic makes it into a game unless it’s fun in the first minute.',
    'v2.t': 'Smooth on every phone',
    'v2.d': 'Games that open fast and go easy on the battery, even on older phones.',
    'v3.t': 'Respect for players',
    'v3.d': 'We don’t ask for an account to play. Your progress stays on your own phone.',
    'about.games': 'Our games',
    'about.write': 'Get in touch',
    'about.cardSub': 'Out now · Detective',

    // contact
    'ct.eyebrow': 'Contact',
    'ct.title': 'Got a lead? Write to us.',
    'ct.lead': 'Support, feedback, press or partnerships. Pick the right address and we’ll get back to you faster.',
    'ct.supportT': 'Support',
    'ct.supportD': 'Problems with the game, account deletion and purchases.',
    'ct.helloT': 'General and partnerships',
    'ct.helloD': 'Press, partnerships and any kind of hello.',
    'ct.copy': 'Copy address',
    'ct.send': 'Send an email',
    'ct.shareT': 'Share this page',
    'ct.shareD': 'Send the link to a friend.',
    'ct.shareBtn': 'Share',
    'ct.stores': 'Get the game',

    // privacy
    'priv.eyebrow': 'Privacy',
    'priv.title': 'Privacy policy',
    'priv.1': 'No account, email or ID needed.',
    'priv.2': 'Your save and progress are stored on your phone.',
    'priv.3': 'The leaderboard only shows your handle, score, rank and avatar.',
    'priv.4': 'You can delete your account and data from the Settings screen in the game.',
    'priv.note': 'The full, official policy is written in English.',
  };

  const META_EN = {
    home: ['QuUp Games | Detective on Duty is out', 'Detective on Duty, the first game from QuUp Games, is out. Search the crime scene, question the suspects, catch the contradiction.'],
    game: ['Detective on Duty | QuUp Games', 'Detective on Duty: 50 case files, an interrogation room, a deduction board and a weekly leaderboard. The new detective game from QuUp Games.'],
    about: ['About us | QuUp Games', 'QuUp Games is an independent mobile game studio. Our first game is Detective on Duty.'],
    contact: ['Contact | QuUp Games', 'Write to QuUp Games: support@quupgames.com for support, hello@quupgames.com for everything else.'],
    privacy: ['Privacy Policy | QuUp Games', 'What Detective on Duty by QuUp Games does with data: no account needed, your save stays on your device.'],
  };

  // Strings that only exist at runtime.
  const EXTRA = {
    tr: {
      'aria.menuOpen': 'Menüyü aç',
      'aria.menuClose': 'Menüyü kapat',
      'toast.copied': 'Adres kopyalandı',
      'toast.select': 'Adres seçildi, şimdi kopyalayabilirsin',
      'toast.gpSoon': 'Google Play bağlantısı çok yakında burada.',
      'share.text': 'Detective on Duty: QuUp Games’in ilk oyunu.',
      'share.copied': 'Sayfa bağlantısı kopyalandı',
      'share.fail': 'Bağlantı: ',
    },
    en: {
      'aria.menuOpen': 'Open menu',
      'aria.menuClose': 'Close menu',
      'toast.copied': 'Address copied',
      'toast.select': 'Address selected, ready to copy',
      'toast.gpSoon': 'The Google Play link is coming very soon.',
      'share.text': 'Detective on Duty: the first game from QuUp Games.',
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
  $$('[data-i18n-tip]').forEach((el) => {
    const k = el.dataset.i18nTip;
    if (!(k in TR)) TR[k] = el.dataset.tip || '';
  });
  const metaDesc = $('meta[name="description"]');
  const META_TR = [document.title, metaDesc ? metaDesc.content : ''];

  const DICT = { tr: Object.assign(TR, EXTRA.tr), en: Object.assign({}, EXTRA.en, EN) };
  let lang = 'tr';
  const t = (k) => {
    const v = DICT[lang][k];
    return v != null ? v : DICT.tr[k];
  };
  const onLang = [];
  window.QG = {
    t,
    get lang() { return lang; },
    // handy when checking a real device from the console: QG.fx
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
    $$('[data-i18n-tip]').forEach((el) => {
      const v = d[el.dataset.i18nTip];
      if (typeof v === 'string') el.dataset.tip = v;
    });
    const meta = lang === 'en' ? META_EN[page] || META_TR : META_TR;
    document.title = meta[0];
    if (metaDesc) metaDesc.content = meta[1];
    syncBurgerLabel();
    if (remember) store.set('qg-lang', lang);
    onLang.forEach((fn) => requestAnimationFrame(fn));
  }

  /* ======================================================================
     2. Header: games menu (hover or the arrow button) and the mobile menu
     ====================================================================== */
  const burger = $('#burger');
  const mnav = $('#mnav');
  let menuOpen = false;

  function syncBurgerLabel() {
    if (burger) burger.setAttribute('aria-label', t(menuOpen ? 'aria.menuClose' : 'aria.menuOpen'));
  }

  function initGamesMenu() {
    const item = $('.has-menu');
    const caret = item && $('.nav__caret', item);
    if (!item || !caret) return;
    let closeTimer = 0;
    const open = (v) => {
      clearTimeout(closeTimer);
      item.classList.toggle('is-open', v);
      caret.setAttribute('aria-expanded', String(v));
    };
    item.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') open(true); });
    item.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      closeTimer = setTimeout(() => open(false), 200);
    });
    caret.addEventListener('click', () => open(!item.classList.contains('is-open')));
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) open(false); });
    document.addEventListener('pointerdown', (e) => { if (!item.contains(e.target)) open(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !item.classList.contains('is-open')) return;
      open(false);
      caret.focus();
    });
  }

  function setMenu(open) {
    if (!burger || !mnav) return;
    menuOpen = open;
    burger.setAttribute('aria-expanded', String(open));
    syncBurgerLabel();
    root.classList.toggle('menu-open', open);
    if (open) {
      mnav.hidden = false;
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
    const wide = window.matchMedia('(min-width: 981px)');
    const onWide = (e) => { if (e.matches && menuOpen) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
  }

  /* ======================================================================
     3. Small things: toast, store buttons, copy, share, year
     ====================================================================== */
  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2600);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return Promise.reject(new Error('no clipboard'));
  }

  function initStores() {
    $$('[data-store="googleplay"]').forEach((a) => {
      if (STORE_LINKS.googleplay) {
        a.href = STORE_LINKS.googleplay;
        a.target = '_blank';
        a.rel = 'noopener';
      } else {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          toast(t('toast.gpSoon'));
        });
      }
    });
    $$('.store--soon').forEach((b) => {
      // once the iPhone version is out, the greyed-out button becomes a real link
      if (STORE_LINKS.appstore) {
        const a = document.createElement('a');
        a.className = 'store';
        a.dataset.store = 'appstore';
        a.href = STORE_LINKS.appstore;
        a.target = '_blank';
        a.rel = 'noopener';
        $$('.sr-only', b).forEach((el) => el.remove());
        a.append(...b.childNodes);
        b.replaceWith(a);
        return;
      }
      // not out yet: the button only explains itself
      let timer = 0;
      b.addEventListener('click', (e) => {
        e.preventDefault();
        b.classList.add('is-tip');
        clearTimeout(timer);
        timer = setTimeout(() => b.classList.remove('is-tip'), 1800);
      });
    });
  }

  function initCopy() {
    $$('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.copy;
        copyText(text).then(() => toast(`${t('toast.copied')}: ${text}`), () => {
          const target = btn.closest('.mail-card');
          const addr = target && $('.mail-card__addr', target);
          if (addr) {
            const range = document.createRange();
            range.selectNodeContents(addr);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
          toast(t('toast.select'));
        });
      });
    });
  }

  function initShare() {
    $$('[data-share]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const canonical = $('link[rel="canonical"]');
        const url = canonical ? canonical.href : window.location.href.split('#')[0];
        const data = { title: document.title, text: t('share.text'), url };
        if (navigator.share) {
          navigator.share(data).catch(() => { /* closed by the visitor */ });
          return;
        }
        copyText(url).then(() => toast(t('share.copied')), () => toast(t('share.fail') + url));
      });
    });
  }

  /* ======================================================================
     4. Pointer parallax: writes two custom properties, eased in rAF
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

  /* ======================================================================
     5. Home: an ultraviolet flashlight over the whole screen that shows
        fingerprints. WebGL with adaptive quality: it refuses software
        rendering, lowers resolution and frame rate on slow devices, pauses
        with the tab and falls back to the CSS background.
     ====================================================================== */
  const shader = (() => {
    const canvas = $('#heroBg');
    const phone = $('#phone');
    if (!canvas || !window.WebGLRenderingContext) return null;
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
    // hardware WebGL means the GPU composites the page too: the big glowing CSS loops may run
    root.classList.add('fx-gpu');

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
  vec3 bg = vec3(0.027, 0.031, 0.047);
  float smoke = fbm(p * 1.7 + vec2(t * 0.03, t * 0.012));
  vec3 col = bg * 0.8 + vec3(0.04, 0.05, 0.085) * smoke;
  vec2 f = uFocus * asp;
  col += vec3(0.3, 0.45, 1.0) * 0.09 * exp(-dot(p - f, p - f) * 5.0);
  vec2 L = uLight * asp;
  float d = length(p - L);
  float light = exp(-d * d * 16.0) * 0.8 + smoothstep(0.32, 0.28, d) * 0.2;
  col += vec3(0.75, 0.84, 1.0) * light * (0.05 + 0.13 * smoke);
  float s = 120.0 * uUnit;
  float clues = fprint(p, vec2(0.12, 0.28) * asp, s, 0.4)
              + fprint(p, vec2(0.46, 0.14) * asp, s * 0.85, -0.7)
              + fprint(p, vec2(0.92, 0.82) * asp, s * 1.05, 1.2)
              + fprint(p, vec2(0.34, 0.72) * asp, s * 0.8, 2.3)
              + fprint(p, vec2(0.62, 0.9) * asp, s * 0.9, -2.0);
  col += vec3(0.42, 0.72, 1.0) * clues * light * 0.5;
  vec2 q = uv - 0.5;
  col *= 1.0 - 0.55 * dot(q, q);
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
    let W = 1;
    let H = 1;
    let shown = false;
    const t0 = performance.now();
    const focus = [0.72, 0.5];
    // the flashlight wanders on its own until a mouse or a tap takes over
    const light = { x: 0.3, y: 0.62, tx: 0.3, ty: 0.62, mouse: false, until: 0 };

    function measure() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.max(2, Math.round(W * scale));
      canvas.height = Math.max(2, Math.round(H * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (phone) {
        const r = phone.getBoundingClientRect();
        focus[0] = (r.left + r.width / 2) / W;
        focus[1] = 1 - (r.top + r.height / 2) / H;
      }
      // resizing clears the drawing buffer, so paint right away to avoid a blank frame
      render(performance.now());
    }

    function render(now) {
      const still = mqReduce.matches;
      const time = still ? 14 : (now - t0) / 1000;
      if (still) {
        light.tx = 0.3;
        light.ty = 0.62;
      } else if (!light.mouse && now > light.until) {
        light.tx = 0.45 + 0.34 * Math.sin(time * 0.23) + 0.1 * Math.sin(time * 0.61);
        light.ty = 0.5 + 0.3 * Math.sin(time * 0.31 + 1.2);
      }
      const k = still ? 1 : light.mouse ? 0.16 : 0.035;
      light.x += (light.tx - light.x) * k;
      light.y += (light.ty - light.y) * k;
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, time);
      gl.uniform2f(U.light, light.x, light.y);
      gl.uniform2f(U.focus, focus[0], focus[1]);
      gl.uniform1f(U.unit, 1 / Math.min(W, H));
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
        root.classList.remove('fx-gpu');
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
      if (running || frozen || document.hidden) return;
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
      light.tx = clamp(x / W, 0, 1);
      light.ty = clamp(1 - y / H, 0, 1);
      if (mode === 'mouse') light.mouse = true;
      else light.until = performance.now() + 3200;
      if (!running) render(performance.now());
    }

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      stop();
      frozen = true;
      root.classList.remove('fx-gpu');
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

  function initHome() {
    const stage = $('#heroStage');
    if (!stage) return;
    const aimAt = parallax(stage);
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      if (shader) shader.aim(e.clientX, e.clientY, 'mouse');
      if (!mqReduce.matches) aimAt((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' && shader) shader.aim(e.clientX, e.clientY, 'touch');
    }, { passive: true });
    document.addEventListener('pointerleave', () => {
      aimAt(0, 0);
      if (shader) shader.release();
    });
    if (shader) {
      shader.start();
      document.addEventListener('visibilitychange', () => (document.hidden ? shader.stop() : shader.start()));
    }
  }

  /* ======================================================================
     6. Game page: tabs (linked to the address, e.g. #vakalar)
     ====================================================================== */
  function initTabs() {
    const list = $('.tabs');
    if (!list) return null;
    const tabs = $$('[role="tab"]', list);
    const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
    const ink = $('.tabs__ink', list);
    const hooks = [];
    let current = -1;

    const placeInk = () => {
      const tab = tabs[current];
      if (!tab || !ink) return;
      ink.style.width = `${tab.offsetWidth}px`;
      ink.style.height = `${tab.offsetHeight}px`;
      ink.style.translate = `${tab.offsetLeft}px ${tab.offsetTop}px`;
    };

    function select(i, opts = {}) {
      if (i === current || !panels[i]) return;
      current = i;
      tabs.forEach((tab, k) => {
        const on = k === i;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[k].hidden = !on;
      });
      const panel = panels[i];
      if (opts.animate !== false && !mqReduce.matches) {
        panel.classList.remove('is-entering');
        void panel.offsetWidth;
        panel.classList.add('is-entering');
      }
      placeInk();
      list.scrollTo({ left: tabs[i].offsetLeft - 24, behavior: opts.animate === false ? 'auto' : 'smooth' });
      if (opts.focus) tabs[i].focus();
      if (opts.hash !== false) {
        try { history.replaceState(null, '', `#${panel.id}`); } catch (e) { /* sandboxed frame: the tab still works */ }
      }
      hooks.forEach((fn) => fn(panel.id));
    }

    tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
    list.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last' };
      if (!(e.key in keys)) return;
      e.preventDefault();
      const step = keys[e.key];
      const next = step === 'first' ? 0 : step === 'last' ? tabs.length - 1 : (current + step + tabs.length) % tabs.length;
      select(next, { focus: true });
    });
    const fromHash = () => panels.findIndex((p) => p && `#${p.id}` === window.location.hash);
    window.addEventListener('hashchange', () => {
      const i = fromHash();
      if (i >= 0) select(i, { hash: false });
    });

    root.classList.add('tabs-on');
    select(Math.max(0, fromHash()), { hash: false, animate: false });
    onLang.push(placeInk);
    if ('ResizeObserver' in window) new ResizeObserver(placeInk).observe(list);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeInk);

    return {
      onChange(fn) {
        hooks.push(fn);
        fn(panels[current].id);
      },
    };
  }

  /* Rain over the noir scene */
  function initRain() {
    const canvas = $('#sceneRain');
    const host = $('#scene');
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
        ctx.strokeStyle = far ? 'rgba(150, 175, 235, 0.2)' : 'rgba(205, 220, 255, 0.36)';
        ctx.lineWidth = far ? 1 : 1.5;
        ctx.stroke();
      }
    }

    function resize() {
      W = host.clientWidth;
      H = host.clientHeight;
      if (!W || !H) return;
      // thin streaks look the same at 1x, and it keeps the canvas small on sharp screens
      dpr = 1;
      canvas.width = W;
      canvas.height = H;
      const n = Math.round(Math.min(120, (W * H) / 5200));
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

  /* A magnifier that reveals clues only visible through the lens */
  function initLens() {
    const art = $('#scene');
    const clues = $('#sceneClues');
    const lens = $('#sceneLens');
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

    let R = 0;
    const apply = () => {
      const lx = (x - R).toFixed(1);
      const ly = (y - R).toFixed(1);
      lens.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      clues.style.transform = `translate3d(${-lx}px, ${-ly}px, 0)`;
    };
    const tick = (now) => {
      raf = 0;
      const still = mqReduce.matches;
      if (!hover && now > until && !still) {
        const s = (now - t0) / 1000;
        tx = W * (0.46 + 0.3 * Math.sin(s * 0.33));
        ty = H * (0.62 + 0.14 * Math.sin(s * 0.57 + 1));
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
      if (!W || !H) return;
      R = lens.offsetWidth / 2;
      clues.style.width = `${W}px`;
      clues.style.height = `${H}px`;
      if (!x) {
        x = tx = W * 0.58;
        y = ty = H * 0.7;
      }
      x = clamp(x, 0, W);
      y = clamp(y, 0, H);
      apply();
      lens.classList.add('is-ready');
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

  /* Feature cards: one drawing plays at a time on desktop (the hovered card,
     otherwise each card in turn); touch screens play the cards on screen. */
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

  /* How to play: a winding level-map path that draws itself when the tab opens */
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
    let timers = [];
    let played = false;

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
      if (!mr.width || nodes.length < 2) return false;
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
          const c1 = [a[0], (a[1] + b[1]) / 2];
          const c2 = [b[0], (a[1] + b[1]) / 2];
          seg = ` C${pt(c1)} ${pt(c2)} ${pt(b)}`;
          segLen = cubicLen(a, c1, c2, b);
        } else {
          // side by side: run along the node row and turn in the gap between columns
          const gx = (boxes[i - 1].right + boxes[i].left) / 2 - mr.left;
          const dy = b[1] - a[1];
          const dir = Math.sign(dy) || 1;
          const r = Math.max(0, Math.min(24, Math.abs(dy) / 2, gx - a[0] - 2, b[0] - gx - 2));
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
      if (played || mqReduce.matches) {
        prog.style.transition = 'none';
        prog.style.strokeDashoffset = '0';
      }
      return true;
    }

    function play() {
      timers.forEach(clearTimeout);
      timers = [];
      if (!layout()) return;
      played = true;
      if (mqReduce.matches) {
        el.classList.remove('is-live');
        return;
      }
      const dur = 1800;
      el.classList.add('is-live');
      steps.forEach((s) => s.classList.remove('is-on'));
      prog.style.transition = 'none';
      prog.style.strokeDashoffset = String(len);
      void prog.getBoundingClientRect();
      prog.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(0.45, 0, 0.25, 1)`;
      prog.style.strokeDashoffset = '0';
      steps.forEach((s, i) => {
        timers.push(setTimeout(() => s.classList.add('is-on'), Math.max(0, fracs[i] * dur - 60)));
      });
    }

    if ('ResizeObserver' in window) {
      let pending = false;
      new ResizeObserver(() => {
        if (pending || !played) return;
        pending = true;
        requestAnimationFrame(() => { pending = false; layout(); });
      }).observe(el);
    }
    onLang.push(() => { if (played) layout(); });
    return { play };
  })();

  function initGame() {
    const tabs = initTabs();
    initRain();
    initLens();
    initFeats();
    if (tabs && map) {
      tabs.onChange((id) => {
        if (id === 'nasil-oynanir') requestAnimationFrame(() => map.play());
      });
    }
  }

  /* ======================================================================
     7. About: the emblem leans towards the pointer
     ====================================================================== */
  function initAbout() {
    const stage = $('#aboutStage');
    const zone = $('.about__grid');
    if (!stage || !zone) return;
    const aimAt = parallax(stage);
    const box = { x: 0, y: 0, w: 1, h: 1 };
    const measure = () => {
      const r = stage.getBoundingClientRect();
      box.x = r.left + r.width / 2;
      box.y = r.top + r.height / 2;
      box.w = Math.max(1, r.width * 0.9);
      box.h = Math.max(1, r.height * 0.9);
    };
    measure();
    window.addEventListener('resize', measure);
    $('.page').addEventListener('scroll', measure, { passive: true });
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || mqReduce.matches) return;
      aimAt(clamp((e.clientX - box.x) / box.w, -1, 1), clamp((e.clientY - box.y) / box.h, -1, 1));
    }, { passive: true });
    zone.addEventListener('pointerleave', () => aimAt(0, 0));
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get('lang') || store.get('qg-lang');
  if (wanted === 'en') setLang('en', false);
  else {
    root.lang = 'tr'; // Turkish casing (i → İ) and the TR/EN switch both key off this
    syncBurgerLabel();
  }

  const langBtn = $('#langToggle');
  if (langBtn) langBtn.addEventListener('click', () => setLang(lang === 'tr' ? 'en' : 'tr', true));

  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  initGamesMenu();
  initStores();
  initCopy();
  initShare();
  if (page === 'home') initHome();
  if (page === 'game') initGame();
  if (page === 'about') initAbout();

  if (shader) {
    let pending = false;
    const relayout = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        shader.measure();
      });
    };
    window.addEventListener('resize', relayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  }
})();
