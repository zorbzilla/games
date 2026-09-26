/* ==========================================================================
   Zorbzilla Games: site interactions
   Everything here is progressive: the page is complete without this file.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const hasIO = 'IntersectionObserver' in window;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };

  /* ======================================================================
     1. Language (TR text lives in the HTML, EN lives here)
     ====================================================================== */
  const EN = {
    'meta.title': 'Zorbzilla Games | Mobile Game Studio',
    'meta.desc': 'Zorbzilla Games is an independent studio making smooth, colorful, hard-to-put-down mobile games for iOS and Android.',
    skip: 'Skip to content',
    'aria.home': 'Zorbzilla Games home',
    'aria.mainnav': 'Main menu',
    'aria.footnav': 'Footer menu',
    'aria.lang': 'Change language: Turkish or English',
    'nav.games': 'Games',
    'nav.services': 'Services',
    'nav.process': 'Process',
    'nav.studio': 'Studio',
    'nav.contact': 'Contact',
    'nav.cta': 'Get in touch',

    'hero.badge': 'Independent mobile game studio',
    'hero.t1': 'We build',
    'hero.t2': 'worlds',
    'hero.t3': 'that fit your pocket.',
    'hero.lead': 'We design, build and ship smooth, colorful games for iOS and Android that are hard to put down once you start.',
    'hero.cta1': 'Explore games',
    'hero.cta2': 'Play now',
    'hero.perk1': 'Smooth 60 FPS',
    'hero.perk2': 'iOS and Android',
    'hero.perk3': 'Player-first design',

    'game.aria': 'Neon Stack mini game. Tap or press Space to drop a block.',
    'game.best': 'Best',
    'game.perfect': 'Perfect!',
    'game.tap': 'Tap to play',
    'game.score': 'Score',
    'game.record': 'New best!',
    'game.retry': 'Tap to retry',
    'game.caption': 'Live demo: tap the phone and stack the blocks.',

    'tb.1': 'PLAY',
    'tb.2': 'DESIGN',
    'tb.3': 'BUILD',
    'tb.4': 'LAUNCH',
    'tb.5': 'GROW',
    'tk.2': 'PUZZLE',
    'tk.5': 'ACTION',
    'tk.6': 'STRATEGY',
    'tk.7': 'RACING',

    'games.eyebrow': 'Games',
    'games.title': 'Made for your thumbs.',
    'games.lead': 'Every game starts with a single tap and gets deeper as you play. You can play the first one right here on this page.',
    'f1.tag2': 'One-tap',
    'st.live': 'Web demo live',
    'f1.desc': 'Drop each block at the right moment and raise a neon tower into the sky. Overhangs get sliced off; land a streak of perfect drops and the block grows back.',
    'spec.genre': 'Genre',
    'spec.platform': 'Platforms',
    'spec.control': 'Controls',
    'f1.control': 'One tap',
    'f1.cta': 'Play in browser',
    'f1.soon': 'Coming soon to the App Store and Google Play',
    'st.soon': 'Coming soon',
    'st.dev': 'In development',
    'st.proto': 'Prototype',
    'st.concept': 'Concept',
    'g2.tag1': 'Runner',
    'g2.desc': 'Squish your jelly hero past obstacles, grab the coins and beat your record.',
    'g3.tag1': 'Puzzle',
    'g3.tag2': 'Merge',
    'g3.desc': 'Merge planets, grow stars and build your own galaxy one step at a time.',
    'g4.tag1': 'Strategy',
    'g4.desc': 'Build a kingdom on your tiny island, manage resources and challenge the islands next door.',
    'g5.tag1': 'Racing',
    'g5.tag2': 'One-finger',
    'g5.desc': 'Drift with one finger and paint every corner with neon trails.',

    'sv.eyebrow': 'Services',
    'sv.title': 'From first idea to the app store.',
    'sv.lead': 'The same team and tools behind our own games are available for partner projects.',
    'sv.1t': 'Game design',
    'sv.1d': 'Core loops that are easy to learn and hard to master, plus levels people remember.',
    'sv.2t': 'Development',
    'sv.2d': 'Unity and native tech that hit 60 FPS, even on entry-level phones.',
    'sv.3t': 'Art and animation',
    'sv.3d': 'Vivid 2D and 3D art, fluid animation and effects that feel great to touch.',
    'sv.4t': 'Monetization',
    'sv.4d': 'Ads and in-app purchases balanced so players never feel squeezed.',
    'sv.5t': 'LiveOps and analytics',
    'sv.5d': 'A/B tests, live events and data that make every update better.',
    'sv.6t': 'Launch and ASO',
    'sv.6d': 'Store optimization, launch planning and community management.',

    'pr.eyebrow': 'Process',
    'pr.title': 'How is a game born?',
    'pr.lead': 'Every idea goes through the same five levels. An idea that can’t clear a level doesn’t move on.',
    'pr.1t': 'Idea',
    'pr.1d': 'We sketch dozens of ideas fast and keep the most fun core.',
    'pr.2t': 'Prototype',
    'pr.2d': 'A playable build within days. If it isn’t fun, it goes back on the shelf.',
    'pr.3t': 'Playtest',
    'pr.3d': 'We test with real players, read the metrics and improve every round.',
    'pr.4t': 'Launch',
    'pr.4d': 'A polished, optimized release on the App Store and Google Play.',
    'pr.5t': 'Live ops',
    'pr.5d': 'Updates, events and community keep the game alive for years.',

    'stu.eyebrow': 'Studio',
    'stu.title': 'A small monster that loves making games.',
    'stu.text': 'Zorbzilla was founded to make mobile games that leave players smiling. Every project follows the same three rules.',
    'stu.v1t': 'Fun comes first',
    'stu.v1d': 'No mechanic makes it into a game unless it’s fun in the first ten seconds.',
    'stu.v2t': 'Obsessed with performance',
    'stu.v2d': 'Smooth, battery-friendly games that open fast, even on older phones.',
    'stu.v3t': 'Respect for players',
    'stu.v3d': 'No dark patterns. Fair economies and honest design.',
    'zorb.hi': 'Hi! I’m Zorb. Give me a tap.',
    'zorb.aria': 'Talk to Zorb the mascot',
    'stat.1': 'FPS target',
    'stat.2': 'platforms',
    'stat.3': 'game projects',
    'stat.4': 'ideas in the notebook',

    'ct.eyebrow': 'Contact',
    'ct.title': 'Got a game in mind?',
    'ct.lead': 'Publishing, co-development or just saying hello. We’re open to all of it, so drop us a line.',
    'ct.copy': 'Copy address',
    'ct.send': 'Send an email',
    'ct.appstore': 'App Store · soon',
    'ct.play': 'Google Play · soon',

    'ft.tag': 'Worlds that fit your pocket.',
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
      'game.over': 'Oyun bitti. Skor: {n}',
      'zorb.best': 'Neon Stack rekorun {n}. Geçebilir misin?',
      'zorb.lines': [
        'Neon Stack’te üst üste üç mükemmel yaparsan blok yeniden büyür!',
        'Bu sayfadaki her piksel 60 FPS için çalışıyor.',
        'Yeni oyunlar yolda. Gözün bizde olsun!',
        'Bir fikrin mi var? Aşağıdan bize yaz.',
        'Hey, gıdıklanıyorum!',
      ],
    },
    en: {
      'aria.menuOpen': 'Open menu',
      'aria.menuClose': 'Close menu',
      'ct.copied': 'Email address copied',
      'ct.select': 'Address selected, ready to copy',
      'game.over': 'Game over. Score: {n}',
      'zorb.best': 'Your Neon Stack best is {n}. Can you beat it?',
      'zorb.lines': [
        'Land three perfect drops in a row in Neon Stack and the block grows back!',
        'Every pixel on this page works hard for 60 FPS.',
        'New games are on the way. Keep an eye on us!',
        'Got an idea? Drop us a line below.',
        'Hey, that tickles!',
      ],
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
    if (remember) store.set('zg-lang', lang);
    if (map) requestAnimationFrame(map.layout);
  }

  /* ======================================================================
     2. Header: scrolled state, hide on scroll down, XP bar, active link
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
    const wide = window.matchMedia('(min-width: 981px)');
    const onWide = (e) => { if (e.matches && menuOpen) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
  }

  /* ======================================================================
     4. Hero background: a small WebGL shader with adaptive quality.
        It refuses software rendering, drops resolution and frame rate on
        slow devices, pauses off-screen and falls back to the CSS gradient.
     ====================================================================== */
  const hero = $('.hero');
  let heroVisible = true;
  let heroBottom = 0; // cached so pointer handlers never force a layout

  const shader = (() => {
    const canvas = $('#heroBg');
    const phone = $('#phone');
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
uniform vec2 uMouse;
uniform float uMouseOn;
uniform vec2 uFocus;
float blob(vec2 p, vec2 c, float r){ vec2 d = p - c; return exp(-dot(d, d) / (r * r)); }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float m = min(uRes.x, uRes.y);
  vec2 p = gl_FragCoord.xy / m;
  vec2 f = uFocus * uRes / m;
  float t = uTime;
  vec2 w = p + 0.05 * vec2(sin(p.y * 3.7 + t * 0.55), cos(p.x * 3.1 - t * 0.47));
  vec3 bg = vec3(0.078, 0.047, 0.169);
  vec3 col = bg;
  col += vec3(0.42, 0.28, 1.00) * 0.62 * blob(w, f + vec2(0.07 * sin(t * 0.31), 0.06 * cos(t * 0.27)), 0.46);
  col += vec3(1.00, 0.31, 0.60) * 0.52 * blob(w, f + vec2(0.20 + 0.14 * cos(t * 0.23 + 1.3), 0.22 + 0.10 * sin(t * 0.29 + 0.4)), 0.27);
  col += vec3(0.22, 0.78, 1.00) * 0.44 * blob(w, f + vec2(-0.22 + 0.13 * sin(t * 0.19 + 2.1), -0.26 + 0.09 * cos(t * 0.25 + 1.7)), 0.29);
  col += vec3(1.00, 0.77, 0.24) * 0.26 * blob(w, f + vec2(0.30 + 0.10 * cos(t * 0.17 + 4.0), -0.14 + 0.12 * sin(t * 0.21 + 3.0)), 0.18);
  col += vec3(0.24, 0.86, 0.59) * 0.12 * blob(w, vec2(0.08, 0.95) * uRes / m + 0.04 * vec2(sin(t * 0.2), cos(t * 0.25)), 0.34);
  col += vec3(0.48, 0.36, 1.00) * 0.16 * blob(w, vec2(0.92, 0.90) * uRes / m + 0.05 * vec2(cos(t * 0.18), sin(t * 0.22)), 0.36);
  col += vec3(0.62, 0.48, 1.00) * 0.26 * uMouseOn * blob(p, uMouse * uRes / m, 0.17);
  float band = sin((w.x - w.y * 0.6) * 5.0 - t * 0.35) * 0.5 + 0.5;
  col += vec3(0.55, 0.40, 1.00) * 0.05 * band * blob(p, f, 0.7);
  vec2 q = uv - 0.5;
  col *= 1.0 - 0.55 * dot(q, q);
  col = mix(col, bg, smoothstep(0.16, 0.0, uv.y));
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (n - 0.5) / 255.0;
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
      mouse: gl.getUniformLocation(prog, 'uMouse'),
      mouseOn: gl.getUniformLocation(prog, 'uMouseOn'),
      focus: gl.getUniformLocation(prog, 'uFocus'),
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
    let shown = false;
    const t0 = performance.now();
    const focus = [0.72, 0.5];
    const mouse = { x: 0.7, y: 0.5, tx: 0.7, ty: 0.5, on: 0, ton: 0 };

    function measure() {
      const w = hero.clientWidth;
      const h = hero.clientHeight;
      if (!w || !h) return;
      heroTop = hero.getBoundingClientRect().top + window.scrollY;
      heroH = h;
      canvas.width = Math.max(2, Math.round(w * scale));
      canvas.height = Math.max(2, Math.round(h * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (phone) {
        const hr = hero.getBoundingClientRect();
        const pr = phone.getBoundingClientRect();
        focus[0] = (pr.left + pr.width / 2 - hr.left) / hr.width;
        focus[1] = 1 - (pr.top + pr.height / 2 - hr.top) / hr.height;
      }
      // resizing clears the drawing buffer, so paint right away to avoid a blank frame
      render(performance.now());
    }

    function render(now) {
      const time = mqReduce.matches ? 14 : (now - t0) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.on += (mouse.ton - mouse.on) * 0.05;
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.time, time);
      gl.uniform2f(U.mouse, mouse.x, mouse.y);
      gl.uniform1f(U.mouseOn, mouse.on);
      gl.uniform2f(U.focus, focus[0], focus[1]);
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

    function pointer(x, y, inside) {
      mouse.tx = x / window.innerWidth;
      mouse.ty = 1 - (y + window.scrollY - heroTop) / heroH;
      mouse.ton = inside ? 1 : 0;
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
      pointer,
      get state() { return frozen ? 'frozen' : `${halfRate ? 'half-rate' : 'full-rate'} @${scale.toFixed(2)}`; },
    };
  })();

  /* ======================================================================
     5. Hero parallax: phone tilt + floating items follow the pointer
     ====================================================================== */
  function initParallax() {
    const stage = $('#heroStage');
    if (!stage || !hero) return;
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
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    window.addEventListener('pointermove', (e) => {
      if (!heroVisible || e.pointerType !== 'mouse') return;
      const inside = e.clientY + window.scrollY < heroBottom;
      if (shader) shader.pointer(e.clientX, e.clientY, inside);
      if (mqReduce.matches) return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      kick();
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      tx = 0;
      ty = 0;
      if (shader) shader.pointer(window.innerWidth * 0.7, 0, false);
      kick();
    });
  }

  /* ======================================================================
     6. Game cards: 3D tilt with a moving glare (mouse only)
     ====================================================================== */
  function initTilt() {
    if (!mqFine.matches || mqReduce.matches) return;
    $$('[data-tilt]').forEach((card) => {
      let px = 0.5;
      let py = 0.5;
      let raf = 0;
      const paint = () => {
        raf = 0;
        const r = card.getBoundingClientRect();
        const nx = clamp((px - r.left) / r.width, 0, 1);
        const ny = clamp((py - r.top) / r.height, 0, 1);
        card.style.setProperty('--ry', `${((nx - 0.5) * 12).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((0.5 - ny) * 9).toFixed(2)}deg`);
        card.style.setProperty('--gx', `${(nx * 100).toFixed(1)}%`);
        card.style.setProperty('--gy', `${(ny * 100).toFixed(1)}%`);
      };
      card.addEventListener('pointerenter', () => card.classList.add('is-tilting'));
      card.addEventListener('pointermove', (e) => {
        px = e.clientX;
        py = e.clientY;
        if (!raf) raf = requestAnimationFrame(paint);
      });
      card.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        raf = 0;
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ======================================================================
     7. Process: a winding level-map path that fills as you scroll
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
          // phones: a soft S-curve that stays inside the node column
          const c1 = [a[0], (a[1] + b[1]) / 2];
          const c2 = [b[0], (a[1] + b[1]) / 2];
          seg = ` C${pt(c1)} ${pt(c2)} ${pt(b)}`;
          segLen = cubicLen(a, c1, c2, b);
        } else {
          // wide screens: run along the node row, turn down/up in the gap between columns
          // (never across the step text), then continue into the next node
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
     8. Stat counters
     ====================================================================== */
  function initCounters() {
    const els = $$('[data-count]');
    if (!hasIO || !els.length || mqReduce.matches) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target;
        const to = parseInt(el.dataset.count, 10) || 0;
        const t0 = performance.now();
        const dur = 1100;
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  /* ======================================================================
     9. Zorb the mascot: eye follows the pointer, taps get a reply
     ====================================================================== */
  function initZorb() {
    const btn = $('#zorbBtn');
    const bubble = $('#zorbBubble');
    const eye = $('#zorbEye');
    const pupil = $('#zorbPupil');
    const body = $('.zb-body');
    if (!btn || !bubble || !eye || !pupil) return;
    let active = false;
    let px = null;
    let py = null;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let idle = 0;
    let lineIdx = 0;

    const tick = () => {
      raf = 0;
      if (px != null) {
        const r = eye.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, dist / 240);
        tx = (dx / dist) * k;
        ty = (dy / dist) * k;
      }
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      pupil.setAttribute('transform', `translate(${(x * 13).toFixed(2)} ${(y * 13).toFixed(2)})`);
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const lookAround = () => {
      if (!active) return;
      px = null;
      const a = Math.random() * Math.PI * 2;
      const k = 0.35 + Math.random() * 0.6;
      tx = Math.cos(a) * k;
      ty = Math.sin(a) * k * 0.7;
      kick();
      idle = setTimeout(lookAround, 1600 + Math.random() * 1800);
    };
    const wake = () => {
      clearTimeout(idle);
      idle = setTimeout(lookAround, 2600);
    };

    window.addEventListener('pointermove', (e) => {
      if (!active || mqReduce.matches) return;
      px = e.clientX;
      py = e.clientY;
      kick();
      wake();
    }, { passive: true });

    if (hasIO) {
      new IntersectionObserver((entries) => {
        active = entries[entries.length - 1].isIntersecting;
        if (active && !mqReduce.matches) wake();
        else clearTimeout(idle);
      }).observe(btn);
    }

    btn.addEventListener('click', () => {
      const lines = t('zorb.lines');
      const best = window.NeonStack ? window.NeonStack.best : 0;
      let text;
      if (best > 0 && lineIdx % 3 === 2) text = t('zorb.best').replace('{n}', best);
      else text = lines[lineIdx % lines.length];
      lineIdx += 1;
      bubble.textContent = text;
      if (mqReduce.matches) return;
      if (body && body.animate) {
        body.animate(
          [
            { transform: 'translateY(0) scale(1, 1)' },
            { transform: 'translateY(-18px) scale(.96, 1.05)', offset: 0.35 },
            { transform: 'translateY(0) scale(1.06, .94)', offset: 0.7 },
            { transform: 'translateY(0) scale(1, 1)' },
          ],
          { duration: 520, easing: 'ease-out' }
        );
      }
      if (bubble.animate) {
        bubble.animate(
          [{ transform: 'translateX(-50%) scale(.85)' }, { transform: 'translateX(-50%) scale(1)' }],
          { duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)' }
        );
      }
    });
  }

  /* ======================================================================
     10. Pause looping CSS animations while their section is off-screen
     ====================================================================== */
  function initPausing() {
    if (!hasIO) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => en.target.classList.toggle('fx-paused', !en.isIntersecting));
    }, { rootMargin: '120px 0px' });
    [$('.hero'), $('.ticker'), $('.zorb-stage')].filter(Boolean).forEach((el) => io.observe(el));
  }

  /* ======================================================================
     11. Small things: copy e-mail, play buttons, footer year
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
      const text = addr.textContent.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => toast(t('ct.copied')), selectAddr);
      } else {
        selectAddr();
      }
    });
  }

  function initPlayButtons() {
    const phone = $('#phone');
    $$('[data-play]').forEach((b) => {
      b.addEventListener('click', () => {
        if (phone) {
          const r = phone.getBoundingClientRect();
          if (r.top < 70 || r.bottom > window.innerHeight) {
            phone.scrollIntoView({ behavior: mqReduce.matches ? 'auto' : 'smooth', block: 'center' });
          }
        }
        if (window.NeonStack) window.NeonStack.play();
      });
    });
  }

  /* ======================================================================
     Boot
     ====================================================================== */
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get('lang') || store.get('zg-lang');
  if (wanted === 'en') setLang('en', false);
  else syncBurgerLabel();

  const langBtn = $('#langToggle');
  if (langBtn) langBtn.addEventListener('click', () => setLang(lang === 'tr' ? 'en' : 'tr', true));

  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  initScrollSpy();
  initParallax();
  initTilt();
  initCounters();
  initZorb();
  initPausing();
  initCopy();
  initPlayButtons();

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
