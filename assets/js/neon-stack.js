/* ==========================================================================
   Neon Stack: a one-tap isometric stacking game that lives in the hero phone.
   - Attract mode plays itself until the visitor taps.
   - Runs only while the phone is on screen and the tab is visible.
   ========================================================================== */
(() => {
  'use strict';

  const canvas = document.getElementById('stackCanvas');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const byId = (id) => document.getElementById(id);
  const ui = byId('gameUi');
  const scoreEl = byId('gScore');
  const bestEl = byId('gBest');
  const overScoreEl = byId('gOverScore');
  const recordEl = byId('gRecord');
  const perfectEl = byId('gPerfect');
  const comboEl = byId('gCombo');
  const liveEl = byId('gLive');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const COS = Math.cos(Math.PI / 6);
  const SIN = 0.5;
  const BASE = 100; // block footprint in world units
  const BH = 22; // block height
  const RANGE = 132; // travel of the moving block either side of the tower
  const PERFECT = 6; // tolerance that counts as a perfect drop
  const GROW = 8; // size won back per perfect drop once a streak is running
  const BEST_KEY = 'zg-neonstack-best';

  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } },
  };
  const t = (key, fallback) => {
    const v = window.ZG && window.ZG.t ? window.ZG.t(key) : '';
    return v || fallback;
  };

  let W = 0;
  let H = 0;
  let dpr = 1;
  let unit = 1;

  let mode = 'attract'; // 'attract' | 'play'
  let over = false;
  let overAt = 0;
  let blocks = [];
  let mover = null;
  let debris = [];
  let rings = [];
  let score = 0;
  let combo = 0;
  let best = parseInt(store.get(BEST_KEY), 10) || 0;
  let cam = 0;
  let camT = 0;
  let zoom = 1;
  let zoomT = 1;
  let hue0 = 280;
  let demoTarget = 0;
  let demoMax = 12;

  let booting = false;
  let running = false;
  let visible = !('IntersectionObserver' in window);
  let raf = 0;
  let last = 0;
  const listeners = [];

  const stars = Array.from({ length: 28 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.3 + 0.4,
    a: Math.random() * 0.5 + 0.2,
    p: Math.random() * 0.6 + 0.2,
  }));

  /* ---------- Game state ---------- */
  function newGame(nextMode) {
    mode = nextMode;
    over = false;
    score = 0;
    combo = 0;
    cam = camT = 0;
    zoom = zoomT = 1;
    debris = [];
    rings = [];
    hue0 = 250 + Math.random() * 110;
    blocks = [{ x: -BASE / 2, z: -BASE / 2, w: BASE, d: BASE, y: -BH * 40, h: BH * 40, hue: hue0 - 20, base: true }];
    spawn();
    scoreEl.textContent = '0';
    bestEl.textContent = String(best);
    recordEl.classList.remove('is-on');
    ui.dataset.state = mode;
    canvas.classList.toggle('is-playing', mode === 'play');
    if (mode === 'attract') {
      demoMax = 9 + Math.floor(Math.random() * 9);
      pickDemoTarget();
    }
  }

  function spawn() {
    const top = blocks[blocks.length - 1];
    const n = blocks.length;
    mover = {
      x: top.x, z: top.z, w: top.w, d: top.d,
      y: top.y + top.h, h: BH,
      hue: hue0 + n * 9,
      axis: n % 2 ? 'x' : 'z',
      off: -RANGE,
      dir: 1,
      speed: Math.min(118 + n * 5.5, 300),
    };
    follow(mover, top);
  }

  function follow(m, top) {
    if (m.axis === 'x') { m.x = top.x + m.off; m.z = top.z; }
    else { m.z = top.z + m.off; m.x = top.x; }
  }

  function drop() {
    const top = blocks[blocks.length - 1];
    const m = mover;
    if (!m || over) return;
    const a = m.axis;
    const s = a === 'x' ? 'w' : 'd';
    const size = top[s];
    let delta = m[a] - top[a];
    const perfect = Math.abs(delta) <= PERFECT;
    if (perfect) delta = 0;
    const overlap = size - Math.abs(delta);

    if (overlap <= 0) {
      debris.push(Object.assign({}, m, { vy: 0, alpha: 1, back: delta < 0 }));
      mover = null;
      endGame();
      return;
    }

    const b = { x: m.x, z: m.z, w: m.w, d: m.d, y: m.y, h: m.h, hue: m.hue };
    if (perfect) {
      b[a] = top[a];
      combo += 1;
      if (combo >= 3 && size < BASE) {
        const g = Math.min(GROW, BASE - size);
        b[s] = size + g;
        b[a] = top[a] - g / 2;
      }
      rings.push({ b, t: 0 });
      celebrate();
    } else {
      combo = 0;
      b[s] = overlap;
      const piece = Object.assign({}, m, { vy: 0, alpha: 1 });
      if (delta > 0) {
        b[a] = m[a];
        piece[a] = top[a] + size;
        piece[s] = delta;
        piece.back = false;
      } else {
        b[a] = top[a];
        piece[a] = m[a];
        piece[s] = -delta;
        piece.back = true;
      }
      debris.push(piece);
    }

    blocks.push(b);
    score += 1;
    scoreEl.textContent = String(score);
    if (!booting) pulse(scoreEl, 1.3);
    camT = score * BH;
    spawn();
  }

  function endGame() {
    over = true;
    overAt = performance.now();
    combo = 0;
    zoomT = H ? Math.min(1, (H * 0.5) / unit / (score * BH + 120)) : 1;
    camT = score * BH * 0.5;
    if (mode !== 'play') return;

    const record = score > best;
    if (record) {
      best = score;
      store.set(BEST_KEY, String(best));
    }
    overScoreEl.textContent = String(score);
    bestEl.textContent = String(best);
    recordEl.classList.toggle('is-on', record);
    ui.dataset.state = 'over';
    canvas.classList.remove('is-playing');
    announce(t('game.over', 'Oyun bitti. Skor: {n}').replace('{n}', score));
    listeners.forEach((fn) => fn({ score, best, record }));
  }

  function tap() {
    if (mode === 'attract') { newGame('play'); start(); return; }
    if (over) {
      if (performance.now() - overAt > 450) { newGame('play'); start(); }
      return;
    }
    drop();
  }

  /* ---------- Attract mode "AI" ---------- */
  function pickDemoTarget() {
    demoTarget = Math.random() < 0.6 ? 0 : (Math.random() - 0.5) * 34;
  }

  function think(dt) {
    const m = mover;
    const top = blocks[blocks.length - 1];
    const size = m.axis === 'x' ? top.w : top.d;
    if (score >= demoMax) {
      if (Math.abs(m.off) > size + 4) drop();
      return;
    }
    const prev = m.off - m.dir * m.speed * dt;
    if ((prev - demoTarget) * (m.off - demoTarget) <= 0) {
      drop();
      pickDemoTarget();
    }
  }

  /* ---------- Juice ---------- */
  function pulse(el, amount) {
    if (!el.animate) return;
    el.animate([{ transform: `scale(${amount})` }, { transform: 'scale(1)' }], {
      duration: 260,
      easing: 'cubic-bezier(.34,1.56,.64,1)',
    });
  }

  function celebrate() {
    if (booting) return;
    comboEl.textContent = combo > 1 ? `×${combo}` : '';
    if (perfectEl.animate) {
      perfectEl.animate(
        [
          { opacity: 0, transform: 'translateY(10px) scale(.7)' },
          { opacity: 1, transform: 'translateY(0) scale(1.08)', offset: 0.25 },
          { opacity: 1, transform: 'translateY(-4px) scale(1)', offset: 0.7 },
          { opacity: 0, transform: 'translateY(-14px) scale(.96)' },
        ],
        { duration: 900, easing: 'ease-out' }
      );
    }
    if (mode === 'play' && navigator.vibrate) {
      try { navigator.vibrate(12); } catch (e) { /* not allowed here */ }
    }
  }

  function announce(text) {
    if (!liveEl) return;
    liveEl.textContent = '';
    setTimeout(() => { liveEl.textContent = text; }, 60);
  }

  /* ---------- Simulation ---------- */
  function update(dt, now) {
    if (mover && !over) {
      mover.off += mover.dir * mover.speed * dt;
      if (mover.off > RANGE) { mover.off = RANGE; mover.dir = -1; }
      else if (mover.off < -RANGE) { mover.off = -RANGE; mover.dir = 1; }
      follow(mover, blocks[blocks.length - 1]);
      if (mode === 'attract') think(dt);
    }

    const k = 1 - Math.exp(-dt * 5);
    cam += (camT - cam) * k;
    zoom += (zoomT - zoom) * k;

    for (let i = debris.length - 1; i >= 0; i--) {
      const p = debris[i];
      p.vy += 1200 * dt;
      p.y -= p.vy * dt;
      p.alpha -= dt * 1.2;
      if (p.alpha <= 0) debris.splice(i, 1);
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      rings[i].t += dt * 1.7;
      if (rings[i].t >= 1) rings.splice(i, 1);
    }

    if (over) {
      const since = now - overAt;
      if (mode === 'attract' && since > 1700) newGame('attract');
      else if (mode === 'play' && since > 30000) newGame('attract');
    }
  }

  /* ---------- Rendering ---------- */
  const hsl = (h, s, l, a) => (a == null ? `hsl(${h % 360},${s}%,${l}%)` : `hsla(${h % 360},${s}%,${l}%,${a})`);

  function project(x, y, z) {
    const s = unit * zoom;
    return [W / 2 + (x - z) * COS * s, H * 0.6 + ((x + z) * SIN - y + cam) * s];
  }

  function poly(pts, fill) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function drawBlock(b, alpha) {
    const yt = b.y + b.h;
    const t1 = project(b.x, yt, b.z);
    const t2 = project(b.x + b.w, yt, b.z);
    const t3 = project(b.x + b.w, yt, b.z + b.d);
    const t4 = project(b.x, yt, b.z + b.d);
    const b2 = project(b.x + b.w, b.y, b.z);
    const b3 = project(b.x + b.w, b.y, b.z + b.d);
    const b4 = project(b.x, b.y, b.z + b.d);
    if (alpha != null) ctx.globalAlpha = alpha;
    if (b.base) {
      poly([t4, t3, b3, b4], hsl(b.hue, 40, 26));
      poly([t2, t3, b3, b2], hsl(b.hue, 40, 19));
      poly([t1, t2, t3, t4], hsl(b.hue, 42, 34));
    } else {
      poly([t4, t3, b3, b4], hsl(b.hue, 78, 53));
      poly([t2, t3, b3, b2], hsl(b.hue, 76, 41));
      poly([t1, t2, t3, t4], hsl(b.hue, 88, 67));
    }
    ctx.strokeStyle = 'rgba(255,255,255,.42)';
    ctx.lineWidth = 1;
    ctx.stroke();
    if (alpha != null) ctx.globalAlpha = 1;
  }

  function draw() {
    if (!W || !H) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const top = blocks[blocks.length - 1];
    const hueNow = hue0 + blocks.length * 9;
    // The blocks cycle through the whole rainbow; the sky stays in the violet-magenta band.
    const skyHue = 245 + ((((hueNow % 360) + 360) % 360) / 360) * 75;
    const s = unit * zoom;

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, hsl(skyHue + 12, 58, 11));
    sky.addColorStop(1, hsl(skyHue, 64, 27));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#fff';
    for (const st of stars) {
      const y = (((st.y * H + cam * s * st.p * 0.6) % H) + H) % H;
      ctx.globalAlpha = st.a;
      ctx.beginPath();
      ctx.arc(st.x * W, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const glow = project(0, top.y + top.h, 0);
    const rg = ctx.createRadialGradient(glow[0], glow[1], 0, glow[0], glow[1], W * 0.75);
    rg.addColorStop(0, hsl(skyHue + 20, 95, 62, 0.3));
    rg.addColorStop(1, hsl(skyHue + 20, 95, 62, 0));
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);

    for (const p of debris) if (p.back) drawBlock(p, Math.max(p.alpha, 0));

    const limit = H + 70 * s;
    for (const b of blocks) {
      if (H * 0.6 + (cam - b.y - b.h) * s > limit) continue;
      drawBlock(b);
    }

    for (const r of rings) {
      const e = 6 + r.t * 30;
      const b = r.b;
      const yt = b.y + b.h;
      const c = [
        project(b.x - e, yt, b.z - e),
        project(b.x + b.w + e, yt, b.z - e),
        project(b.x + b.w + e, yt, b.z + b.d + e),
        project(b.x - e, yt, b.z + b.d + e),
      ];
      ctx.globalAlpha = 1 - r.t;
      ctx.beginPath();
      ctx.moveTo(c[0][0], c[0][1]);
      for (let i = 1; i < 4; i++) ctx.lineTo(c[i][0], c[i][1]);
      ctx.closePath();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    for (const p of debris) if (!p.back) drawBlock(p, Math.max(p.alpha, 0));
    if (mover && !over) drawBlock(mover);
  }

  /* ---------- Loop ---------- */
  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    update(dt, now);
    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !visible || document.hidden) return;
    if (mode === 'attract' && reduceMotion.matches) { draw(); return; }
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    W = w;
    H = h;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    unit = W / 300;
    draw();
  }

  /* ---------- Input ---------- */
  let downX = 0;
  let downY = 0;
  let downAt = 0;
  let downId = null;

  canvas.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    if (mode === 'play' && !over) {
      e.preventDefault();
      tap();
      return;
    }
    downX = e.clientX;
    downY = e.clientY;
    downAt = performance.now();
    downId = e.pointerId;
  });
  canvas.addEventListener('pointerup', (e) => {
    if (e.pointerId !== downId) return;
    downId = null;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) < 12 && performance.now() - downAt < 700) tap();
  });
  canvas.addEventListener('pointercancel', () => { downId = null; });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!e.repeat) tap();
    }
  });

  /* ---------- Boot ---------- */
  newGame('attract');
  resize();
  // Fast-forward the demo a few seconds so the first frame already shows a tower.
  booting = true;
  for (let i = 0; i < 420 && !over; i++) update(1 / 60, 0);
  booting = false;
  draw();

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) start();
      else stop();
    }, { threshold: 0.01 }).observe(canvas);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  reduceMotion.addEventListener?.('change', () => {
    stop();
    start();
  });

  window.NeonStack = {
    play() {
      newGame('play');
      try { canvas.focus({ preventScroll: true }); } catch (e) { canvas.focus(); }
      start();
    },
    get best() { return best; },
    onEnd(fn) { if (typeof fn === 'function') listeners.push(fn); },
  };
})();
