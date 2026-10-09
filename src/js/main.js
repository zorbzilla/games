/* ==========================================================================
   QuUp Games: site interactions (every page)
   Everything here is progressive: each page is complete without this file.
   ========================================================================== */
(() => {
  'use strict';

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

  /* The page source is not for browsing: no context menu, no view-source or
     developer-tools shortcuts. (A deterrent only; text can still be selected and copied.) */
  document.addEventListener('contextmenu', (e) => {
    if (!e.target.closest('input, textarea, [contenteditable]')) e.preventDefault();
  });
  document.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    const c = e.code;
    if (
      e.key === 'F12' ||
      (mod && e.shiftKey && (c === 'KeyI' || c === 'KeyJ' || c === 'KeyC')) ||
      (mod && e.altKey && (c === 'KeyI' || c === 'KeyJ' || c === 'KeyC' || c === 'KeyU')) ||
      (mod && !e.shiftKey && !e.altKey && (c === 'KeyU' || c === 'KeyS'))
    ) {
      e.preventDefault();
    }
  });

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
    'aria.crumbs': 'You are here',
    'nav.home': 'Home',
    'nav.about': 'About us',
    'nav.careers': 'Careers',
    'nav.soon': 'Soon',
    'nav.soonTip': 'Opening soon',
    'nav.games': 'Games',
    'nav.contact': 'Contact',
    'menu.new': 'New',
    'menu.all': 'All games',
    'store.gpSmall': 'For Android',
    'store.asSmall': 'For iPhone',
    'store.soon': 'Coming soon',
    'ft.rights': 'All rights reserved.',
    'dod.genre': 'Detective · Investigation',
    'dod.blurb': 'Search the crime scene, question the suspects, connect the evidence on the board and make your call.',

    // home
    'home.new': 'Out now',
    'home.newText': 'Our first game is live',
    'home.tagline': 'Badge on. The file is on your desk.',
    'home.lead': 'Search the crime scene, question the suspects, catch the contradictions. The final call is yours.',
    'home.explore': 'Explore the game',
    'fact.weekly': 'Weekly leaderboard',
    'fact.rank': 'Climb the ranks',
    'fact.noacc': 'No account needed',
    'tk.scene': 'CRIME SCENE',
    'tk.cross': 'DO NOT CROSS',

    // games list
    'games.eyebrow': 'Games',
    'games.title': 'Our games',
    'games.lead': 'Games for your phone that stay with you. Every game we have released is here.',
    'games.new': 'Out now',
    'games.open': 'View the game',

    // game page
    'game.new': 'Out now',
    'game.cta': 'Download and play now',
    'game.tagline': 'Every file hides a lie.',
    'game.desc': 'Open files are piling up. Search the scene, question the suspects, connect the evidence on the board and make the final call.',
    'game.genreL': 'Genre',
    'game.genre': 'Detective, investigation',
    'game.boardL': 'Leaderboard',
    'game.board': 'Weekly',
    'game.rankL': 'Career',
    'game.rank': 'From Trainee Detective to Special Unit Commander',
    'tab.play': 'Gameplay',
    'play.kicker': 'How to play',
    'tab.cases': 'Cases',
    'tab.privacy': 'Privacy',
    'p1.t': 'ID card',
    'p1.d': 'Pick a name and report for duty. Your name shows on the ranking and on the files you close.',
    'p1.alt': 'Screenshot from the game: the detective ID card',
    'p2.t': 'Cases',
    'p2.d': 'Open files are waiting for you. Pick one and open the file.',
    'p2.alt': 'Screenshot from the game: the case list',
    'p3.t': 'Briefing',
    'p3.d': 'Learn about the victim, the suspects and the deadline. Take the case or leave it.',
    'p3.alt': 'Screenshot from the game: a case briefing',
    'p4.t': 'Crime scene',
    'p4.d': 'Search the spots one by one. Every piece of evidence you find goes into the file.',
    'p4.alt': 'Screenshot from the game: searching the crime scene',
    'p5.t': 'Board',
    'p5.d': 'Lay out the evidence and events. Pick two cards; if they are connected, it goes into the file.',
    'p5.alt': 'Screenshot from the game: the deduction board',
    'p6.t': 'Verdict',
    'p6.d': 'Make your accusation. Charge the wrong person and you lose experience and standing.',
    'p6.alt': 'Screenshot from the game: the verdict',
    'p7.t': 'Career',
    'p7.d': 'Every file you solve raises your rank, from Trainee Detective to Special Unit Commander.',
    'p7.alt': 'Screenshot from the game: the career screen',
    'p8.t': 'Score',
    'p8.d': 'A new table every week. The experience you earn that week moves you up.',
    'p8.alt': 'Screenshot from the game: the weekly score table',
    'case.1': 'The Missing Man',
    'case.2': 'Broken Window',
    'case.3': 'The Last Message',
    'case.5': 'The Missing Bag',
    'case.6': 'Room 307',
    'case.7': 'Two Witnesses',
    'case.8': 'The Crow',
    'files.tab': 'File',
    'files.stamp': 'Classified',
    'files.more': 'New files on the way',
    'files.moreSub': 'The archive keeps growing. New cases will be added to the game.',
    'gp.title': 'Privacy in short',
    'gp.sub': 'What Detective on Duty does with your data, and what it doesn’t.',
    'gp.full': 'Full policy',

    // about
    'about.eyebrow': 'About us',
    'about.kicker': 'Independent mobile game studio',
    'about.lead': 'We make games for your phone that stay with you: quick to learn, hard to put down. Every game we make follows the same three rules.',
    'v1.t': 'Fun comes first',
    'v1.d': 'No mechanic makes it into a game unless it’s fun in the first minute.',
    'v2.t': 'Smooth on every phone',
    'v2.d': 'Games that open fast and go easy on the battery, even on older phones.',
    'v3.t': 'Respect for players',
    'v3.d': 'We don’t ask for an account to play. Your progress stays on your own phone.',
    'about.games': 'Our games',
    'about.write': 'Get in touch',

    // careers
    'cr.eyebrow': 'Careers',
    'cr.title': 'Join the team',
    'cr.lead': 'We make games for your phone that stay with you. Development, design, art or sound: if you love this work as much as we do, we would like to meet you.',
    'cr.s1t': 'Fill in the form',
    'cr.s1d': 'Tell us about yourself, your work and the field you love.',
    'cr.s2t': 'It reaches us',
    'cr.s2d': 'Your application comes straight to our team.',
    'cr.s3t': 'We get back to you',
    'cr.s3d': 'When there is a role that fits, we will get in touch.',
    'ap.title': 'Open application',
    'ap.req': '* required',
    'ap.name': 'Full name',
    'ap.namePh': 'Your first and last name',
    'ap.mail': 'Email',
    'ap.mailPh': 'you@example.com',
    'ap.field': 'Your field',
    'ap.pick': 'Pick a field',
    'ap.f1': 'Game development (Unity / C#)',
    'ap.f2': 'Game design',
    'ap.f3': 'Art and animation',
    'ap.f4': 'Sound and music',
    'ap.f5': 'Marketing and community',
    'ap.f6': 'Other',
    'ap.cv': 'CV',
    'ap.cvPick': 'Choose your CV or drop it here',
    'ap.cvPickTouch': 'Choose your CV',
    'ap.cvHint': 'PDF or Word · up to 5 MB',
    'ap.cvClear': 'Remove the CV',
    'ap.way': 'How would you like to work?',
    'ap.w1': 'Full-time',
    'ap.w2': 'Part-time',
    'ap.w3': 'Internship',
    'ap.w4': 'Freelance',
    'ap.msg': 'Tell us about yourself',
    'ap.msgPh': 'What have you made, what would you like to make? Which games do you love?',
    'ap.consent': 'I agree that my details are used only for my application.',
    'ap.send': 'Send application',
    'ap.note': 'Pressing send opens your application, ready to go, in your email app. Don’t forget to attach your CV there.',
    'ap.noteSend': 'Your application and CV come straight to us.',
    'ap.attach': 'Before sending, attach your CV to the email:',
    'ap.doneMail': 'Almost there!',
    'ap.doneMailD': 'Your application is ready in your email app. Don’t forget to send it.',
    'ap.doneSent': 'Application received',
    'ap.doneSentD': 'Thank you! We will read it and get in touch when there is a role that fits.',
    'ap.fallback': 'If your email app didn’t open, copy your application and send it to:',
    'ap.copy': 'Copy application',
    'ap.edit': 'Edit the form',

    // contact
    'ct.eyebrow': 'Contact',
    'ct.title': 'Write to us',
    'ct.lead': 'Support, feedback, press or partnerships. Pick the right address and we’ll get back to you faster.',
    'ct.supportT': 'Support',
    'ct.supportD': 'Problems with our games, account deletion and purchases.',
    'ct.helloT': 'General and partnerships',
    'ct.helloD': 'Press, partnerships and any kind of hello.',
    'ct.copy': 'Copy address',
    'ct.send': 'Send an email',
    'ct.shareT': 'Share the site',
    'ct.shareD': 'Send QuUp Games to a friend.',
    'ct.shareBtn': 'Share',

    // privacy (Detective on Duty)
    'priv.title': 'Privacy policy',
    'priv.1': 'No account, email or ID needed.',
    'priv.2': 'Your save and progress are stored on your phone.',
    'priv.3': 'The leaderboard only shows your handle, score, rank and avatar.',
    'priv.4': 'You can delete your account and data from the Settings screen in the game.',
    'priv.note': 'The full, official policy is written in English.',
    'priv.back': 'Back to the game',

    // 404
    'nf.title': 'Page not found',
    'nf.lead': 'The page you’re looking for may have moved, changed its name or never existed.',
    'nf.path': 'You asked for',
    'nf.home': 'Back to home',
    'nf.games': 'Our games',
  };

  const META_EN = {
    home: ['QuUp Games', 'QuUp Games is an independent mobile game studio making games for your phone that stay with you. Our new game, Detective on Duty, is out now.'],
    games: ['Games | QuUp Games', 'The games from QuUp Games: games for your phone that stay with you.'],
    game: ['Detective on Duty | QuUp Games', 'Detective on Duty: crime scenes, interrogations, a deduction board and your final call. The new detective game from QuUp Games.'],
    about: ['About us | QuUp Games', 'QuUp Games is an independent mobile game studio making games for your phone that stay with you.'],
    careers: ['Careers | QuUp Games', 'Join the QuUp Games team: an open application for game development, design, art and sound.'],
    contact: ['Contact | QuUp Games', 'Write to QuUp Games: support@quupgames.com for support, hello@quupgames.com for everything else.'],
    privacy: ['Detective on Duty Privacy Policy | QuUp Games', 'What Detective on Duty by QuUp Games does with data: no account needed, your save stays on your device.'],
    404: ['Page not found | QuUp Games', 'This page could not be found. Head to the QuUp Games home page or see our games.'],
  };

  // Strings that only exist at runtime.
  const EXTRA = {
    tr: {
      'aria.menuOpen': 'Menüyü aç',
      'aria.menuClose': 'Menüyü kapat',
      'toast.copied': 'Adres kopyalandı',
      'toast.select': 'Adres seçildi, şimdi kopyalayabilirsin',
      'toast.gpSoon': 'Google Play bağlantısı çok yakında burada.',
      'share.text': 'QuUp Games: telefonda oynanan, akılda kalan oyunlar.',
      'share.copied': 'Bağlantı kopyalandı',
      'share.fail': 'Bağlantı: ',
      'err.required': 'Bu alanı doldur.',
      'err.email': 'Geçerli bir e-posta adresi yaz.',
      'err.pick': 'Bir alan seç.',
      'err.consent': 'Devam etmek için onay ver.',
      'err.cv': 'CV’ni ekle.',
      'err.cvType': 'PDF ya da Word dosyası seç.',
      'err.cvSize': 'Dosya en fazla 5 MB olabilir.',
      'ap.lineCv': 'CV (ekte)',
      'ap.cvPickTouch': 'CV’ni seç',
      'ap.subject': 'Kariyer başvurusu',
      'ap.lineField': 'İlgi alanı',
      'ap.lineWay': 'Çalışma şekli',
      'ap.doneSent': 'Başvurun bize ulaştı',
      'ap.doneSentD': 'Teşekkürler! Okuyacağız ve uygun bir rol olduğunda seninle iletişime geçeceğiz.',
      'ap.intro': 'Kendimden bahsedeyim:',
      'ap.sign': 'QuUp Games kariyer formundan gönderildi.',
      'ap.copied': 'Başvuru kopyalandı',
      'ap.copyFail': 'Kopyalanamadı.',
      'ap.to': 'Kime',
      'ap.subj': 'Konu',
      'ap.sendFail': 'Gönderilemedi. E-posta ile deneyelim.',
    },
    en: {
      'aria.menuOpen': 'Open menu',
      'aria.menuClose': 'Close menu',
      'toast.copied': 'Address copied',
      'toast.select': 'Address selected, ready to copy',
      'toast.gpSoon': 'The Google Play link is coming very soon.',
      'share.text': 'QuUp Games: games for your phone that stay with you.',
      'share.copied': 'Link copied',
      'share.fail': 'Link: ',
      'err.required': 'Please fill this in.',
      'err.email': 'Please enter a valid email address.',
      'err.pick': 'Please pick a field.',
      'err.consent': 'Please tick this to continue.',
      'err.cv': 'Please add your CV.',
      'err.cvType': 'Please choose a PDF or Word file.',
      'err.cvSize': 'The file can be up to 5 MB.',
      'ap.lineCv': 'CV (attached)',
      'ap.subject': 'Job application',
      'ap.lineField': 'Field',
      'ap.lineWay': 'How I would like to work',
      'ap.intro': 'About me:',
      'ap.sign': 'Sent from the QuUp Games careers form.',
      'ap.copied': 'Application copied',
      'ap.copyFail': 'Couldn’t copy it.',
      'ap.to': 'To',
      'ap.subj': 'Subject',
      'ap.sendFail': 'It didn’t go through. Let’s use email instead.',
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
  $$('[data-i18n-alt]').forEach((el) => {
    const k = el.dataset.i18nAlt;
    if (!(k in TR)) TR[k] = el.getAttribute('alt') || '';
  });
  $$('[data-i18n-ph]').forEach((el) => {
    const k = el.dataset.i18nPh;
    if (!(k in TR)) TR[k] = el.getAttribute('placeholder') || '';
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
    $$('[data-i18n-alt]').forEach((el) => {
      const v = d[el.dataset.i18nAlt];
      if (typeof v === 'string') el.setAttribute('alt', v);
    });
    $$('[data-i18n-ph]').forEach((el) => {
      const v = d[el.dataset.i18nPh];
      if (typeof v === 'string') el.setAttribute('placeholder', v);
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

  /* The store links are written into the pages by src/build.py (STORE_LINKS there).
     A store that has no link yet only explains itself. */
  function initSoon() {
    $$('[data-soon]').forEach((el) => {
      let timer = 0;
      const tip = () => {
        el.classList.add('is-tip');
        clearTimeout(timer);
        timer = setTimeout(() => el.classList.remove('is-tip'), 1800);
      };
      el.addEventListener('click', tip);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tip();
        }
      });
    });
  }

  function initStores() {
    $$('[data-store="googleplay"]').forEach((a) => {
      if (a.getAttribute('href') !== '#') return;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        toast(t('toast.gpSoon'));
      });
    });
    $$('.store--soon').forEach((b) => {
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
        const url = btn.dataset.share || (canonical ? canonical.href : window.location.href.split('#')[0]);
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

  /* A phone that shows real screens from the game, one after another (only while it is on screen) */
  function slideshow(box, every) {
    const imgs = $$('img', box);
    if (imgs.length < 2) return null;
    let i = 0;
    let timer = 0;
    const show = (n) => {
      imgs[i].classList.remove('is-on');
      i = (n + imgs.length) % imgs.length;
      const img = imgs[i];
      // lazy images get fetched a step ahead, so the next screen is ready when its turn comes
      const next = imgs[(i + 1) % imgs.length];
      if (next.loading === 'lazy') next.loading = 'eager';
      img.classList.add('is-on');
    };
    const run = (on) => {
      clearInterval(timer);
      timer = 0;
      if (on && !mqReduce.matches) timer = setInterval(() => show(i + 1), every);
    };
    if (imgs[1].loading === 'lazy') imgs[1].loading = 'eager';
    whileVisible(box, () => run(true), () => run(false));
    return { show };
  }

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
    const shots = $('#phone .shots');
    if (shots) slideshow(shots, 3200);
  }

  /* ======================================================================
     6. Game page: tabs (linked to the address, e.g. #cases)
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

  /* Gameplay: eight steps, each with its real screen in the phone. It moves on by
     itself while the tab is open; a click (or hover) takes over. */
  function initPlay() {
    const box = $('#play');
    if (!box) return null;
    const steps = $$('.pstep', box);
    const imgs = $$('.shots img', box);
    if (!steps.length || steps.length !== imgs.length) return null;
    let i = 0;
    let timer = 0;
    let active = false; // the tab is open and the page is visible
    let held = false;   // pointer or keyboard focus is inside
    let userAt = -Infinity; // no click yet: the first step moves on after the usual pause

    const show = (n, fromUser) => {
      n = (n + steps.length) % steps.length;
      if (fromUser) userAt = performance.now();
      if (n === i) return;
      steps[i].classList.remove('is-on');
      steps[i].setAttribute('aria-pressed', 'false');
      imgs[i].classList.remove('is-on');
      i = n;
      steps[i].classList.add('is-on');
      steps[i].setAttribute('aria-pressed', 'true');
      imgs[i].classList.add('is-on');
      const next = imgs[(i + 1) % imgs.length];
      if (next.loading === 'lazy') next.loading = 'eager';
    };
    const sync = () => {
      const run = active && !held && !document.hidden && !mqReduce.matches;
      if (run && !timer) {
        timer = setInterval(() => {
          // after a click, give the reader time before moving on again
          if (performance.now() - userAt > 9000) show(i + 1);
        }, 4200);
      }
      if (!run && timer) { clearInterval(timer); timer = 0; }
    };

    steps.forEach((btn, k) => btn.addEventListener('click', () => show(k, true)));
    box.addEventListener('keydown', (e) => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d || !e.target.closest('.pstep')) return;
      e.preventDefault();
      show(i + d, true);
      steps[i].focus();
    });
    box.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { held = true; sync(); } });
    box.addEventListener('pointerleave', () => { held = false; sync(); });
    box.addEventListener('focusin', () => { held = true; sync(); });
    box.addEventListener('focusout', (e) => { if (!box.contains(e.relatedTarget)) { held = false; sync(); } });
    document.addEventListener('visibilitychange', sync);
    if (imgs[1] && imgs[1].loading === 'lazy') imgs[1].loading = 'eager';
    return {
      setActive(on) { active = on; sync(); },
    };
  }

  function initGame() {
    const tabs = initTabs();
    const play = initPlay();
    if (tabs && play) tabs.onChange((id) => play.setActive(id === 'gameplay'));
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
    window.addEventListener('scroll', measure, { passive: true });
    zone.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || mqReduce.matches) return;
      aimAt(clamp((e.clientX - box.x) / box.w, -1, 1), clamp((e.clientY - box.y) / box.h, -1, 1));
    }, { passive: true });
    zone.addEventListener('pointerleave', () => aimAt(0, 0));
  }

  /* ======================================================================
     8. 404: the address that was asked for
     ====================================================================== */
  function initNotFound() {
    const out = $('#nfPath');
    if (!out) return;
    let path = window.location.pathname;
    try { path = decodeURIComponent(path); } catch (e) { /* keep it encoded */ }
    if (!path || path === '/') return;
    out.textContent = path;
    out.title = path;
    out.parentElement.hidden = false;
  }

  /* ======================================================================
     9. Careers: the application form
     The site has no server: by default the form writes the application into
     an email (mailto). With data-endpoint (a form service) it posts it instead.
     ====================================================================== */
  function initCareers() {
    const form = $('#applyForm');
    const done = $('#applyDone');
    if (!form || !done) return;
    const mail = form.dataset.mail;
    const endpoint = form.dataset.endpoint || '';
    const msg = $('#apMsg');
    const count = $('#apMsgCount');
    const f = form.elements;
    const checked = $$('[data-check]', form);
    let tried = false;
    let lastText = '';

    const countUp = () => { count.textContent = `${msg.value.length} / ${msg.maxLength}`; };
    msg.addEventListener('input', countUp);
    countUp();

    // the CV: a click opens the file picker, a file can also be dropped on the field
    const cv = f.cv;
    const cvBox = $('#apCvBox');
    const cvName = $('#apCvName');
    const cvMeta = $('#apCvMeta');
    const cvClear = $('#apCvClear');
    const CV_MAX = 5 * 1024 * 1024;
    const CV_TYPES = /\.(pdf|docx?)$/i;
    const cvFile = () => (cv.files && cv.files[0]) || null;
    // phones and tablets have nothing to drop a file from: just "choose your CV" there
    const pickKey = window.matchMedia('(hover: none)').matches ? 'ap.cvPickTouch' : 'ap.cvPick';
    const size = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
    const showCv = () => {
      const file = cvFile();
      cvBox.classList.toggle('has-file', !!file);
      cvClear.hidden = !file;
      // while a file is chosen its name is not a translated text
      if (file) {
        cvName.removeAttribute('data-i18n');
        cvMeta.removeAttribute('data-i18n');
        cvName.textContent = file.name;
        cvMeta.textContent = `${(file.name.split('.').pop() || '').toUpperCase()} · ${size(file.size)}`;
      } else {
        cvName.dataset.i18n = pickKey;
        cvMeta.dataset.i18n = 'ap.cvHint';
        cvName.textContent = t(pickKey);
        cvMeta.textContent = t('ap.cvHint');
      }
    };
    cv.addEventListener('change', () => { showCv(); show(cv); });
    showCv();
    cvClear.addEventListener('click', () => {
      cv.value = '';
      showCv();
      if (tried) show(cv);
      cv.focus();
    });
    ['dragenter', 'dragover'].forEach((type) => cvBox.addEventListener(type, (e) => {
      e.preventDefault();
      cvBox.classList.add('is-over');
    }));
    ['dragleave', 'dragend', 'drop'].forEach((type) => cvBox.addEventListener(type, () => cvBox.classList.remove('is-over')));
    cvBox.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!e.dataTransfer || !e.dataTransfer.files.length) return;
      const pick = new DataTransfer();
      pick.items.add(e.dataTransfer.files[0]);
      cv.files = pick.files;
      showCv();
      show(cv);
    });

    // a field's problem, as a dictionary key ('' when it is fine)
    const problem = (el) => {
      if (el.type === 'checkbox') return el.checked ? '' : 'err.consent';
      if (el.type === 'file') {
        const file = cvFile();
        if (!file) return 'err.cv';
        if (!CV_TYPES.test(file.name)) return 'err.cvType';
        return file.size > CV_MAX ? 'err.cvSize' : '';
      }
      if (el.tagName === 'SELECT') return el.value ? '' : 'err.pick';
      if (!el.value.trim()) return 'err.required';
      if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) return 'err.email';
      return '';
    };
    const show = (el) => {
      const key = problem(el);
      const box = el.closest('.field');
      const out = $('.field__error', box);
      box.classList.toggle('is-bad', !!key);
      el.setAttribute('aria-invalid', key ? 'true' : 'false');
      out.dataset.err = key;
      out.textContent = key ? t(key) : '';
      return !key;
    };
    // after a first try, a field clears its message as soon as it is right (the CV is checked as soon as it is picked)
    checked.forEach((el) => {
      if (el.type === 'file') return;
      el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', () => { if (tried) show(el); });
    });
    onLang.push(() => $$('.field__error[data-err]', form).forEach((out) => { out.textContent = out.dataset.err ? t(out.dataset.err) : ''; }));

    const optionText = (sel) => (sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].textContent.trim() : '');
    const compose = () => {
      const way = $('input[name="way"]:checked', form);
      const lines = [
        `${t('ap.name')}: ${f.fullname.value.trim()}`,
        `${t('ap.mail')}: ${f.email.value.trim()}`,
        `${t('ap.lineField')}: ${optionText(f.field)}`,
      ];
      if (way) lines.push(`${t('ap.lineWay')}: ${way.nextElementSibling.textContent.trim()}`);
      if (cvFile()) lines.push(`${t('ap.lineCv')}: ${cvFile().name}`);
      lines.push('', t('ap.intro'), f.message.value.trim(), '', '---', t('ap.sign'));
      return {
        subject: `${t('ap.subject')}: ${f.fullname.value.trim()} · ${optionText(f.field)}`,
        body: lines.join('\r\n'),
      };
    };
    const finish = (sent) => {
      $('#applyDoneTitle').dataset.i18n = sent ? 'ap.doneSent' : 'ap.doneMail';
      $('#applyDoneText').dataset.i18n = sent ? 'ap.doneSentD' : 'ap.doneMailD';
      $('#applyDoneTitle').textContent = t($('#applyDoneTitle').dataset.i18n);
      $('#applyDoneText').textContent = t($('#applyDoneText').dataset.i18n);
      $('#applyFallback').hidden = sent;
      $('#applyCopy').hidden = sent;
      $('#applyAttach').hidden = sent || !cvFile();
      $('#applyAttachName').textContent = cvFile() ? cvFile().name : '';
      form.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      const scroller = $('.page');
      if (scroller) scroller.scrollTop = 0;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      tried = true;
      const bad = checked.filter((el) => !show(el));
      if (bad.length) {
        bad[0].focus();
        return;
      }
      if (f._gotcha && f._gotcha.value) return; // a bot filled the hidden field
      const { subject, body } = compose();
      lastText = `${t('ap.to')}: ${mail}\n${t('ap.subj')}: ${subject}\n\n${body.replace(/\r\n/g, '\n')}`;
      if (endpoint) {
        try {
          const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
          if (res.ok) {
            finish(true);
            return;
          }
        } catch (err) { /* falls back to email below */ }
        toast(t('ap.sendFail'));
      }
      // opens the visitor's email app with the application written out
      const link = document.createElement('a');
      link.href = `mailto:${mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      document.body.append(link);
      link.click();
      link.remove();
      finish(false);
    });

    $('#applyCopy').addEventListener('click', () => {
      copyText(lastText).catch(() => {
        // no clipboard access: copy through a hidden text box instead
        const box = document.createElement('textarea');
        box.value = lastText;
        box.setAttribute('readonly', '');
        box.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
        document.body.append(box);
        box.select();
        const ok = document.execCommand && document.execCommand('copy');
        box.remove();
        if (!ok) throw new Error('copy failed');
      }).then(() => toast(t('ap.copied')), () => toast(t('ap.copyFail')));
    });
    $('#applyEdit').addEventListener('click', () => {
      done.hidden = true;
      form.hidden = false;
      f.fullname.focus();
    });
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
  initSoon();
  initStores();
  initCopy();
  initShare();
  if (page === 'home') initHome();
  if (page === 'game') initGame();
  if (page === 'about') initAbout();
  if (page === 'careers') initCareers();
  if (page === '404') initNotFound();

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
