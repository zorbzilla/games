#!/usr/bin/env python3
"""Builds the QuUp Games pages from shared parts (header, footer, icons).

Run `npm run build` in the repository root. This script writes readable pages to
the root; src/tools/minify.mjs then compresses them (and the CSS and JS) in place.
"""
import json
import os
import re
import sys
from urllib.parse import urlparse

SRC = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SRC)
BASE = 'https://zorbzilla.github.io/games/'
BASE_PATH = urlparse(BASE).path   # '/games/' on GitHub Pages, '/' on a domain of its own
Q = open(os.path.join(SRC, 'q.txt')).read().strip()

# ---------------------------------------------------------------- icons
SPRITE = f'''<svg class="sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- The Q from the QuUp Games logo (viewBox 0 0 638 619) -->
      <path id="q-path" d="{Q}"/>
    </defs>
    <symbol id="q-mark" viewBox="0 0 638 619"><use href="#q-path" fill="currentColor"/></symbol>

    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-next" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></g></symbol>
    <symbol id="i-copy" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="9" y="9" width="11.5" height="11.5" rx="2.5"/><path d="M15 9V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v6.5A2.5 2.5 0 0 0 6 15h3"/></g></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7 8 6 8-6" stroke-linecap="round"/></g></symbol>
    <symbol id="i-help" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.6"/><path d="m5.9 5.9 3.6 3.6M14.5 14.5l3.6 3.6M18.1 5.9l-3.6 3.6M9.5 14.5l-3.6 3.6"/></g></symbol>
    <symbol id="i-hello" viewBox="0 0 24 24"><path d="M4.5 5h15A1.5 1.5 0 0 1 21 6.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17h-1A1.5 1.5 0 0 1 3 15.5v-9A1.5 1.5 0 0 1 4.5 5z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/><circle cx="8.5" cy="11" r="1.25" fill="currentColor"/><circle cx="12" cy="11" r="1.25" fill="currentColor"/><circle cx="15.5" cy="11" r="1.25" fill="currentColor"/></symbol>
    <symbol id="i-share" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/></g></symbol>
    <symbol id="i-home" viewBox="0 0 24 24"><path d="M4 10.4 12 4l8 6.4v8.6a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-trophy" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3.5M8 20.5h8M9.5 17.5h5"/></g></symbol>
    <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 19.5 6v5.5c0 4.6-3.2 8.4-7.5 9.5-4.3-1.1-7.5-4.9-7.5-9.5V6zM8.8 12.2l2.2 2.2 4.2-4.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-rank" viewBox="0 0 24 24"><path d="m5 12.5 7-5 7 5M5 19l7-5 7 5M12 2.2l1.2 2.3 2.5.3-1.8 1.7.5 2.5-2.4-1.3-2.4 1.3.5-2.5-1.8-1.7 2.5-.3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
    <symbol id="i-smile" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M8.5 14.5s1.3 2 3.5 2 3.5-2 3.5-2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="9" cy="10" r="1.3" fill="currentColor"/><circle cx="15" cy="10" r="1.3" fill="currentColor"/></symbol>
    <symbol id="i-gauge" viewBox="0 0 24 24"><path d="M4.5 18a9 9 0 1 1 15 0M12 14l4-4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="14" r="1.6" fill="currentColor"/></symbol>
    <symbol id="i-sys" viewBox="0 0 60 14"><g fill="currentColor"><rect x="0" y="9" width="3" height="5" rx="1"/><rect x="5" y="6" width="3" height="8" rx="1"/><rect x="10" y="3" width="3" height="11" rx="1"/><rect x="15" y="0" width="3" height="14" rx="1"/></g><path d="M24 5.5a9.5 9.5 0 0 1 13 0M26.8 8.5a5.5 5.5 0 0 1 7.4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="30.5" cy="11.8" r="1.6" fill="currentColor"/><rect x="41.5" y="1.5" width="15" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="43.5" y="3.5" width="9" height="7" rx="1.5" fill="currentColor"/><rect x="57.4" y="5" width="2" height="4" rx="1" fill="currentColor"/></symbol>

    <!-- Store logos -->
    <symbol id="logo-gplay" viewBox="0 0 24 24">
      <path fill="#1ec3ff" d="M1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924z"/>
      <path fill="#00df76" d="M13.544 10.989l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973z"/>
      <path fill="#ffc933" d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594z"/>
      <path fill="#ff3d5a" d="M13.544 13.056l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"/>
    </symbol>
    <symbol id="logo-apple" viewBox="0 0 24 24"><path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></symbol>

    <!-- Detective props that float around the phone -->
    <symbol id="f-badge" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="fBadgeMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f6fb"/><stop offset=".45" stop-color="#aab3c8"/><stop offset=".7" stop-color="#e7ebf4"/><stop offset="1" stop-color="#7d869c"/></linearGradient>
        <linearGradient id="fBadgeCore" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c86ff"/><stop offset="1" stop-color="#1f3a9e"/></linearGradient>
      </defs>
      <ellipse cx="32" cy="60" rx="18" ry="3" fill="#000" opacity=".45"/>
      <path d="M32 3 53 11v17c0 15-9.4 25.6-21 31C20.4 53.6 11 43 11 28V11z" fill="url(#fBadgeMetal)"/>
      <path d="M32 9.5 47.5 15.4V28c0 11.2-6.6 19.6-15.5 24.2C23.1 47.6 16.5 39.2 16.5 28V15.4z" fill="url(#fBadgeCore)"/>
      <path d="m32 18 3.9 7.9 8.7 1.3-6.3 6.1 1.5 8.7L32 37.9 24.2 42l1.5-8.7-6.3-6.1 8.7-1.3z" fill="#f4f6fb"/>
      <path d="M22 13.6 32 9.5l10 3.9" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
    </symbol>
    <symbol id="f-print" viewBox="0 0 64 64">
      <rect x="8" y="5" width="48" height="56" rx="6" fill="#e9ecf5"/>
      <rect x="8" y="5" width="48" height="10" rx="5" fill="#d3d9e8"/>
      <g fill="none" stroke="#2f5be8" stroke-width="2.2" stroke-linecap="round">
        <path d="M22 50c-2-4-3-8-3-12 0-7 6-13 13-13s13 6 13 13c0 3-.4 6-1.2 8.5"/>
        <path d="M26 52c-1.5-3.5-2.4-7.4-2.4-11.4 0-4.7 3.8-8.5 8.4-8.5s8.4 3.8 8.4 8.5c0 4.6-1 9-2.8 12.6"/>
        <path d="M30.5 53.5c-1.3-3.6-2-7.3-2-11 0-1.9 1.6-3.5 3.5-3.5s3.5 1.6 3.5 3.5c0 4.7-.8 9-2.3 12.8"/>
        <path d="M18 30c3-4.8 8.3-8 14-8s11 3.2 14 8"/>
      </g>
    </symbol>
    <symbol id="f-photo" viewBox="0 0 64 64">
      <rect x="7" y="4" width="50" height="58" rx="2.5" fill="#eceae3"/>
      <rect x="11" y="8" width="42" height="40" fill="#1a1f2e"/>
      <circle cx="32" cy="23" r="8" fill="#4a5470"/>
      <path d="M17 48c1.6-9 7.6-14 15-14s13.4 5 15 14z" fill="#4a5470"/>
      <path d="M11 8h42v40H11z" fill="none" stroke="#000" stroke-opacity=".25"/>
      <path d="M20 55h24" stroke="#b9b4a6" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="32" cy="5.5" r="4" fill="#ff4a64"/>
      <circle cx="30.8" cy="4.3" r="1.3" fill="#fff" opacity=".7"/>
    </symbol>
    <symbol id="f-marker" viewBox="0 0 64 64">
      <ellipse cx="33" cy="57" rx="25" ry="4" fill="#000" opacity=".5"/>
      <path d="M8 54 19 12h8L16 54z" fill="#1f3a9e"/>
      <path d="M16 54 27 12h19l10 42z" fill="#4d7cff"/>
      <path d="M27 12h19l1.2 4.6H25.8z" fill="#fff" opacity=".35"/>
      <text x="37" y="46" text-anchor="middle" font-family="'Saira Condensed', 'Arial Narrow', sans-serif" font-weight="800" font-size="27" fill="#fff">1</text>
    </symbol>
    <symbol id="f-magnifier" viewBox="0 0 64 64">
      <path d="M38 38 56 56" stroke="#141826" stroke-width="10" stroke-linecap="round"/>
      <path d="M40 40 55 55" stroke="#465070" stroke-width="3" stroke-linecap="round"/>
      <circle cx="26" cy="26" r="17" fill="#6fd3ff" fill-opacity=".16" stroke="#d6dbe8" stroke-width="6"/>
      <path d="M15.5 21a12 12 0 0 1 10-8" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".85"/>
    </symbol>
  </svg>'''

LOGO_INNER = '<svg class="logo__q" aria-hidden="true"><use href="#q-mark"/></svg><span class="logo__word" aria-hidden="true">uUp<em>Games</em></span>'


def logo(extra_cls=''):
    cls = f'logo {extra_cls}'.strip()
    return f'<a class="{cls}" href="./" aria-label="QuUp Games ana sayfa" data-i18n-aria="aria.home">{LOGO_INNER}</a>'


# Detective on Duty in the stores. Every store button on every page is written from these.
# An empty link keeps the button: Google Play then says "coming soon" when clicked,
# App Store stays greyed out with a "Coming soon" tip.
STORE_LINKS = {
    'googleplay': 'https://play.google.com/store/apps/details?id=com.quupgames.detectiveonduty',
    'appstore': '',  # e.g. 'https://apps.apple.com/app/id...'
}


def stores(extra=''):
    gp = STORE_LINKS['googleplay']
    gp_href = f'href="{gp}" target="_blank" rel="noopener"' if gp else 'href="#"'
    apple_inner = '''<svg class="store__logo" aria-hidden="true"><use href="#logo-apple"/></svg>
                <span class="store__text"><small data-i18n="store.asSmall">iPhone için</small><b>App Store</b></span>'''
    if STORE_LINKS['appstore']:
        apple = f'''<a class="store" data-store="appstore" href="{STORE_LINKS['appstore']}" target="_blank" rel="noopener">
                {apple_inner}
              </a>'''
    else:
        apple = f'''<button class="store store--soon" type="button" aria-disabled="true" data-tip="Yakında" data-i18n-tip="store.soon">
                {apple_inner}
                <span class="sr-only" data-i18n="store.soon">Yakında</span>
              </button>'''
    return f'''<div class="stores{(' ' + extra) if extra else ''}">
              <a class="store" data-store="googleplay" {gp_href}>
                <svg class="store__logo" aria-hidden="true"><use href="#logo-gplay"/></svg>
                <span class="store__text"><small data-i18n="store.gpSmall">Android için</small><b>Google Play</b></span>
              </a>
              {apple}
            </div>'''


# ---------------------------------------------------------------- the games (a second game gets a second entry)
DOD_IMG = 'assets/img/games/detective-on-duty/'
GAMES = [
    {
        'id': 'dod',
        'page': 'detective-on-duty.html',
        'name': 'Detective on Duty',
        'icon_s': DOD_IMG + 'icon-128.webp',
        'icon_m': DOD_IMG + 'icon-256.webp',
        'icon_l': DOD_IMG + 'icon-512.webp',
        'genre': ('dod.genre', 'Dedektif · Soruşturma'),
        'blurb': ('dod.blurb', 'Olay yerini ara, şüphelileri sorgula, delilleri panoda bağla ve kararını ver.'),
        'new': True,
    },
]
GAME_PAGES = ('game', 'privacy')   # pages that belong to Detective on Duty


def game_icon(g, cls, src_key='icon_m', px=96):
    return f'<img class="{cls}" src="{g[src_key]}" alt="" width="{px}" height="{px}" decoding="async">'


def cur(active, name):
    return ' aria-current="page"' if active == name else ''


def header(active, page_id):
    def is_here(g):
        return ' aria-current="page"' if page_id in GAME_PAGES and g['id'] == 'dod' else ''
    new = '<span class="new-tag" data-i18n="menu.new">Yeni</span>'
    rows = '\n'.join(f'''                <li><a class="menu__game" href="{g['page']}"{is_here(g)}>{game_icon(g, 'menu__icon', 'icon_s', 52)}<span class="menu__text"><b lang="en">{g['name']}</b><span data-i18n="{g['genre'][0]}">{g['genre'][1]}</span></span>{new if g['new'] else ''}</a></li>''' for g in GAMES)
    mrows = '\n'.join(f'''          <li><a class="mnav__game" href="{g['page']}"{is_here(g)}>{game_icon(g, 'mnav__icon', 'icon_s', 48)}<span class="mnav__text"><b lang="en">{g['name']}</b><span data-i18n="{g['genre'][0]}">{g['genre'][1]}</span></span>{new if g['new'] else ''}</a></li>''' for g in GAMES)
    return f'''<header class="hud">
    <div class="hud__inner wrap">
      {logo()}
      <nav class="nav" aria-label="Ana menü" data-i18n-aria="aria.mainnav">
        <ul class="nav__list">
          <li><a class="nav__link" href="about.html"{cur(active, 'about')} data-i18n="nav.about">Biz kimiz?</a></li>
          <li class="has-menu">
            <a class="nav__link" href="games.html"{cur(active, 'games')} data-i18n="nav.games">Oyunlar</a>
            <button class="nav__caret" type="button" aria-expanded="false" aria-controls="gamesMenu" aria-label="Oyunlar menüsü" data-i18n-aria="aria.gamesMenu"><svg aria-hidden="true"><use href="#i-chevron"/></svg></button>
            <div class="menu" id="gamesMenu">
              <ul class="menu__list">
{rows}
              </ul>
              <a class="menu__all" href="games.html"><span data-i18n="menu.all">Tüm oyunlar</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></a>
            </div>
          </li>
          <li><a class="nav__link" href="contact.html"{cur(active, 'contact')} data-i18n="nav.contact">İletişim</a></li>
        </ul>
      </nav>
      <div class="hud__actions">
        <button class="lang" id="langToggle" type="button" aria-label="Dili değiştir: Türkçe veya İngilizce" data-i18n-aria="aria.lang"><span data-lang="tr">TR</span><span data-lang="en">EN</span></button>
        <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Menüyü aç"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>

  <div class="mnav" id="mnav" hidden>
    <ul class="mnav__list">
      <li style="--i:0"><a class="mnav__link" href="./"{cur(active, 'home')}><span data-i18n="nav.home">Ana sayfa</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></a></li>
      <li style="--i:1"><a class="mnav__link" href="about.html"{cur(active, 'about')}><span data-i18n="nav.about">Biz kimiz?</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></a></li>
      <li style="--i:2">
        <a class="mnav__link" href="games.html"{' aria-current="page"' if page_id == 'games' else ''}><span data-i18n="nav.games">Oyunlar</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></a>
        <ul class="mnav__games">
{mrows}
        </ul>
      </li>
      <li style="--i:3"><a class="mnav__link" href="contact.html"{cur(active, 'contact')}><span data-i18n="nav.contact">İletişim</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></a></li>
    </ul>
  </div>'''


FOOTER = '''<footer class="foot">
    <div class="foot__inner wrap">
      <p class="foot__copy">© <span data-year>2026</span> QuUp Games. <span data-i18n="ft.rights">Tüm hakları saklıdır.</span></p>
    </div>
  </footer>'''

BACKDROP_PAGE = '<div class="backdrop" aria-hidden="true"><svg class="backdrop__q"><use href="#q-mark"/></svg></div>'
BACKDROP_PLAIN = '<div class="backdrop" aria-hidden="true"></div>'
BACKDROP_HOME = '<div class="backdrop" aria-hidden="true"><canvas class="backdrop__bg" id="heroBg"></canvas><div class="backdrop__siren"></div></div>'

THEME_COLOR = {None: '#07080c', 'dod': '#0c0913'}


# Share images: the studio's own card, and the Detective on Duty card for the pages that show the game.
OG_IMAGE = {'studio': 'assets/img/og.jpg', 'dod': 'assets/img/og-dod.jpg'}


def document(page_id, path, title, desc, active, content, backdrop=BACKDROP_PAGE, ld=None, theme=None, og='studio', index=True):
    url = BASE + path
    # a page that is not meant for search engines (the 404 page) gets no address of its own
    where = (f'<link rel="canonical" href="{url}">' if index else '<meta name="robots" content="noindex">')
    og_url = f'\n  <meta property="og:url" content="{url}">' if index else ''
    ld_block = ''
    if ld:
        ld_block = '\n  <script type="application/ld+json">\n' + json.dumps(ld, ensure_ascii=False, separators=(',', ':')) + '\n  </script>'
    theme_attr = f' data-theme="{theme}"' if theme else ''
    return f'''<!doctype html>
<html lang="tr"{theme_attr}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="{THEME_COLOR[theme]}">
  <meta name="color-scheme" content="dark">
  {where}
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="assets/img/icon-180.png">
  <link rel="manifest" href="site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="QuUp Games">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">{og_url}
  <meta property="og:image" content="{BASE}{OG_IMAGE[og]}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:locale:alternate" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400..800&amp;family=Saira+Condensed:wght@600;700;800&amp;display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@600&amp;text=uUp%20Games4&amp;display=swap">
  <link rel="stylesheet" href="assets/css/style.css">
  <script defer src="assets/js/main.js"></script>{ld_block}
</head>
<body data-page="{page_id}">
  {backdrop}
  {SPRITE}

  <a class="skip" href="#main" data-i18n="skip">İçeriğe geç</a>

  {header(active, page_id)}

  <main class="page page--{page_id}" id="main" tabindex="-1">
{content}
  </main>

  {FOOTER}

  <div class="toast" id="toast" role="status" aria-live="polite"></div>
</body>
</html>
'''


# ---------------------------------------------------------------- shared game data
# Case titles: English from the game's case files, Turkish in the game's own style
# (in the game "The Inside Man" is "İçerideki Adam", "The Quiet Neighbour" is "Sessiz Komşu").
CASES = [
    ('001', 'case.1', 'Kayıp Adam'),
    ('002', 'case.2', 'Kırık Pencere'),
    ('003', 'case.3', 'Son Mesaj'),
    ('004', None, '2317'),
    ('005', 'case.5', 'Kayıp Çanta'),
    ('006', 'case.6', 'Oda 307'),
    ('007', 'case.7', 'İki Tanık'),
    ('008', 'case.8', 'Karga'),
]

# The eight in-game screens, in the order a case is played: (file, i18n key, title, text, alt)
SHOTS = [
    ('01-precinct', 'p1', 'Karakol', 'Açık dosyalar seni bekliyor. Birini seç, teslim süresi dolmadan kapat.', 'Vaka listesi'),
    ('02-briefing', 'p2', 'Brifing', 'Dosyayı aç ve olayı öğren: şüpheliler, tanıklar, lokasyonlar.', 'Vaka brifingi'),
    ('03-crime-scene', 'p3', 'Olay yeri', 'Aranacak noktaları tek tek ara. Bulduğun deliller dosyaya girer.', 'Olay yeri araması'),
    ('04-people', 'p4', 'Kişiler', 'Şüpheliler ve tanıklar burada. Kiminle konuşacağını sen seçersin.', 'Şüpheli ve tanık listesi'),
    ('05-interrogation', 'p5', 'Sorgu', 'Baskı ile güveni dengede tut. Doğrudan, empatik ya da sert sor; zamanı gelince kanıtı sun.', 'Sorgu ekranı'),
    ('06-board', 'p6', 'Pano', 'Delilleri ve olayları panoya diz. İki kart seç; aralarında bağ varsa dosyaya yazılır.', 'Çıkarım panosu'),
    ('07-decision', 'p7', 'Karar', 'Tutukla, takibe al ya da soruşturmayı genişlet. Delilin zayıfsa savcılık da öyle görür.', 'Karar ekranı'),
    ('08-career', 'p8', 'Kariyer', 'Çözdüğün dosyalar rütbeni yükseltir: Aday Dedektif’ten Özel Birim Amiri’ne.', 'Kariyer ekranı'),
]
HOME_SHOTS = ['01-precinct', '03-crime-scene', '05-interrogation', '06-board', '07-decision']


def shot_imgs(names, alt=False):
    out = []
    for i, name in enumerate(names):
        cls = ' class="is-on"' if i == 0 else ''
        load = '' if i == 0 else ' loading="lazy"'
        if alt:
            key, label = next((s[1], s[4]) for s in SHOTS if s[0] == name)
            alt_text = f' alt="Oyundan ekran görüntüsü: {label}" data-i18n-alt="{key}.alt"'
        else:
            alt_text = ' alt=""'
        out.append(f'<img{cls} src="{DOD_IMG}shots/{name}.webp"{alt_text} width="540" height="960" decoding="async"{load}>')
    return out


def phone(el_id, imgs, extra_cls=''):
    joined = '\n                      '.join(imgs)
    id_attr = f' id="{el_id}"' if el_id else ''
    return f'''<div class="phone{(' ' + extra_cls) if extra_cls else ''}"{id_attr}>
                <div class="phone__body">
                  <div class="phone__screen">
                    <div class="phone__status" aria-hidden="true"><span>21:40</span><svg><use href="#i-sys"/></svg></div>
                    <div class="shots">
                      {joined}
                    </div>
                    <span class="phone__glare" aria-hidden="true"></span>
                  </div>
                  <span class="phone__island" aria-hidden="true"></span>
                </div>
              </div>'''


# ---------------------------------------------------------------- home
def ticker():
    def name(key, title):
        return f'<span data-i18n="{key}">{title}</span>' if key else f'<span>{title}</span>'
    back = ''.join(f'<li><b>#{no}</b> {name(key, title)}</li><li><svg><use href="#i-search"/></svg></li>' for no, key, title in CASES)
    front = ('<li lang="en">DETECTIVE ON DUTY</li><li class="q"><svg><use href="#q-mark"/></svg></li>'
             '<li data-i18n="tk.scene">OLAY YERİ</li><li class="q"><svg><use href="#q-mark"/></svg></li>'
             '<li data-i18n="tk.cross">GİRMEYİNİZ</li><li class="q"><svg><use href="#q-mark"/></svg></li>') * 2
    return f'''      <div class="ticker" aria-hidden="true">
        <div class="ticker__band ticker__band--back">
          <div class="ticker__track"><ul class="ticker__list">{back}</ul><ul class="ticker__list">{back}</ul></div>
        </div>
        <div class="ticker__band">
          <div class="ticker__track"><ul class="ticker__list">{front}</ul><ul class="ticker__list">{front}</ul></div>
        </div>
      </div>'''


def home():
    content = f'''    <div class="page__inner home">
      <section class="hero wrap" aria-labelledby="hero-title">
        <div class="hero__intro">
          <a class="new-pill" href="detective-on-duty.html"><b data-i18n="home.new">Yeni çıktı</b><span data-i18n="home.newText">İlk oyunumuz yayında</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></a>
          <h1 class="hero__title" id="hero-title" lang="en"><span class="line">Detective</span><span class="line"><span class="title-tape">on Duty</span></span></h1>
          <p class="hero__tagline" data-i18n="home.tagline">Rozetini tak. Dosya masanda.</p>
          <p class="hero__lead" data-i18n="home.lead">Olay yerini incele, şüphelileri sorgula, ifadelerdeki çelişkiyi yakala. Son kararı sen ver.</p>
        </div>

        <div class="hero__cta">
          <div class="cta-row">
            <a class="btn btn--lg" href="detective-on-duty.html"><span data-i18n="home.explore">Oyunu keşfet</span><svg class="btn__icon btn__icon--go" aria-hidden="true"><use href="#i-arrow"/></svg></a>
            {stores().replace('<div class="stores">', '<div class="stores stores--row">')}
          </div>
          <ul class="facts">
            <li class="fact"><svg class="fact__icon" aria-hidden="true"><use href="#i-trophy"/></svg><span data-i18n="fact.weekly">Haftalık sıralama</span></li>
            <li class="fact"><svg class="fact__icon" aria-hidden="true"><use href="#i-rank"/></svg><span data-i18n="fact.rank">Rütbe rütbe yüksel</span></li>
            <li class="fact"><svg class="fact__icon" aria-hidden="true"><use href="#i-shield"/></svg><span data-i18n="fact.noacc">Hesap gerekmez</span></li>
          </ul>
        </div>

        <div class="hero__stage" id="heroStage" aria-hidden="true">
          <div class="stage__glow"></div>
          <!-- --x/--y place a prop on big screens, --mx/--my on phones (there the props sit on the phone's corners) -->
          <div class="floaters">
            <span class="floater" style="--x:-2%;--y:8%;--mx:-5%;--my:68%;--s:62px;--d:1.6;--dur:7s;--delay:-1s;--r0:-10deg;--r1:4deg"><svg><use href="#f-magnifier"/></svg></span>
            <span class="floater" style="--x:82%;--y:4%;--mx:72%;--my:-5%;--s:66px;--d:2.4;--dur:8s;--delay:-3s;--r0:9deg;--r1:-4deg"><svg><use href="#f-badge"/></svg></span>
            <span class="floater" style="--x:88%;--y:54%;--mx:82%;--my:42%;--s:56px;--d:2;--dur:7.6s;--delay:-5s;--r0:10deg;--r1:-3deg"><svg><use href="#f-print"/></svg></span>
            <span class="floater" style="--x:-6%;--y:42%;--mx:-4%;--my:10%;--s:70px;--d:1.2;--dur:8.4s;--delay:-2.5s;--r0:-9deg;--r1:-2deg"><svg><use href="#f-photo"/></svg></span>
            <span class="floater" style="--x:8%;--y:76%;--mx:76%;--my:84%;--s:52px;--d:1.3;--dur:6.6s;--delay:-2s;--r0:-6deg;--r1:6deg"><svg><use href="#f-marker"/></svg></span>
          </div>
          <div class="phone-float">
              {phone('phone', shot_imgs(HOME_SHOTS), 'phone--hero')}
          </div>
        </div>
      </section>
{ticker()}
    </div>'''
    ld = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'QuUp Games',
        'url': BASE,
        'logo': BASE + 'assets/img/icon-512.png',
        'email': 'hello@quupgames.com',
        'contactPoint': [{'@type': 'ContactPoint', 'contactType': 'customer support', 'email': 'support@quupgames.com'}],
    }
    return document('home', '', 'QuUp Games',
                    'QuUp Games, telefonda oynanan, akılda kalan oyunlar yapan bağımsız bir mobil oyun stüdyosu. Yeni oyunumuz Detective on Duty çıktı.',
                    'home', content, BACKDROP_HOME, ld, og='dod')


# ---------------------------------------------------------------- games list
def games_page():
    cards = []
    for g in GAMES:
        new = '<span class="new-tag" data-i18n="games.new">Yeni çıktı</span>' if g['new'] else ''
        cards.append(f'''          <li class="gcard" data-theme="{g['id']}">
            <a class="gcard__media" href="{g['page']}" tabindex="-1" aria-hidden="true">
              {game_icon(g, 'gcard__icon', 'icon_l', 256)}
            </a>
            <div class="gcard__body">
              {new}
              <h2 class="gcard__title"><a href="{g['page']}" lang="en">{g['name']}</a></h2>
              <p class="gcard__genre" data-i18n="{g['genre'][0]}">{g['genre'][1]}</p>
              <p class="gcard__desc" data-i18n="{g['blurb'][0]}">{g['blurb'][1]}</p>
              <div class="gcard__actions">
                <a class="btn" href="{g['page']}"><span data-i18n="games.open">Oyunu incele</span><svg class="btn__icon btn__icon--go" aria-hidden="true"><use href="#i-arrow"/></svg></a>
                {stores()}
              </div>
            </div>
          </li>''')
    cards = '\n'.join(cards)
    content = f'''    <div class="page__inner">
      <div class="games wrap">
        <div class="games__head">
          <p class="eyebrow" data-i18n="games.eyebrow">Oyunlar</p>
          <h1 class="h1" data-i18n="games.title">Oyunlarımız</h1>
          <p class="lead" data-i18n="games.lead">Telefonda oynanan, akılda kalan oyunlar. Yayındaki her oyunumuz burada.</p>
        </div>
        <ul class="gcards">
{cards}
        </ul>
      </div>
    </div>'''
    return document('games', 'games.html', 'Oyunlar | QuUp Games',
                    "QuUp Games'in oyunları: telefonda oynanan, akılda kalan oyunlar.",
                    'games', content)


# ---------------------------------------------------------------- game page
TILTS = ['-1.2deg', '.8deg', '-.6deg', '1.1deg', '-1deg', '.6deg', '-.8deg', '1deg']
# "Gizli" stamps: scattered, never two in the same row or column of the three-column grid
STAMPS = {1: '--sx:14px;--sy:12px;--sr:-8deg', 5: '--sx:22%;--sy:30%;--sr:6deg', 6: '--sx:34%;--sy:10px;--sr:-13deg'}


def game():
    g = GAMES[0]
    steps = '\n'.join(
        f'''                  <li><button class="pstep{' is-on' if i == 0 else ''}" type="button" aria-pressed="{'true' if i == 0 else 'false'}" data-shot="{i}"><span class="pstep__no" aria-hidden="true">{i + 1:02d}</span><span class="pstep__text"><b data-i18n="{k}.t">{t}</b><span class="pstep__desc"><span data-i18n="{k}.d">{d}</span></span></span></button></li>'''
        for i, (_, k, t, d, _alt) in enumerate(SHOTS))
    files = []
    for i, (no, key, title) in enumerate(CASES):
        stamp = f'<span class="file__stamp" style="{STAMPS[i]}" aria-hidden="true" data-i18n="files.stamp">Gizli</span>' if i in STAMPS else ''
        i18n = f' data-i18n="{key}"' if key else ''
        files.append(f'''                <li class="file" style="--t:{TILTS[i]}">
                  <span class="file__tab"><span data-i18n="files.tab">Dosya</span> {no}</span>
                  <span class="file__paper" aria-hidden="true"><i></i><i></i><i></i></span>
                  <div class="file__cover"><span class="file__no" aria-hidden="true">{no}</span><h3 class="file__title"{i18n}>{title}</h3>{stamp}</div>
                </li>''')
    files = '\n'.join(files)
    content = f'''    <div class="page__inner game">
      <div class="game__grid wrap">
        <div class="game__side">
          <div class="game__top">{game_icon(g, 'game__icon', 'icon_m', 112)}<span class="new-tag" data-i18n="game.new">Yeni çıktı</span></div>
          <h1 class="game__title" lang="en">Detective<span>on Duty</span></h1>
          <p class="game__tagline" data-i18n="game.tagline">Her dosyanın içinde bir yalan var.</p>
          <p class="game__desc" data-i18n="game.desc">Karakolda dosyalar birikiyor. Olay yerini ara, şüphelileri sorgula, delilleri panoda bağla ve son kararı ver.</p>
          <dl class="meta">
            <div><dt data-i18n="game.genreL">Tür</dt><dd data-i18n="game.genre">Dedektif, soruşturma</dd></div>
            <div><dt data-i18n="game.boardL">Sıralama</dt><dd data-i18n="game.board">Haftalık</dd></div>
            <div class="meta__wide"><dt data-i18n="game.rankL">Kariyer</dt><dd data-i18n="game.rank">Aday Dedektif’ten Özel Birim Amiri’ne</dd></div>
          </dl>
          {stores()}
        </div>

        <section class="game__main" aria-label="Detective on Duty">
          <div class="tabs" role="tablist" aria-label="Detective on Duty">
            <button class="tab" role="tab" id="tab-gameplay" aria-controls="gameplay" aria-selected="true" type="button" data-i18n="tab.play">Oynanış</button>
            <button class="tab" role="tab" id="tab-cases" aria-controls="cases" aria-selected="false" tabindex="-1" type="button" data-i18n="tab.cases">Vakalar</button>
            <button class="tab" role="tab" id="tab-privacy" aria-controls="privacy" aria-selected="false" tabindex="-1" type="button" data-i18n="tab.privacy">Gizlilik</button>
            <span class="tabs__ink" aria-hidden="true"></span>
          </div>

          <div class="panels">
            <div class="panel" role="tabpanel" id="gameplay" aria-labelledby="tab-gameplay" tabindex="0">
              <div class="play" id="play">
                <div class="play__list">
                  <p class="play__kicker" data-i18n="play.kicker">Bir vaka nasıl çözülür?</p>
                  <ol class="play__steps">
{steps}
                  </ol>
                </div>
                <div class="play__stage">
              {phone('', shot_imgs([s[0] for s in SHOTS], alt=True), 'phone--play')}
                </div>
              </div>
            </div>

            <div class="panel" role="tabpanel" id="cases" aria-labelledby="tab-cases" tabindex="0">
              <ol class="files">
{files}
                <li class="file file--more">
                  <div class="file__stack" aria-hidden="true"><i></i><i></i><i></i></div>
                  <p class="file__more" data-i18n="files.more">Yeni dosyalar yolda</p>
                  <p class="file__moresub" data-i18n="files.moreSub">Arşiv büyüyor. Yeni vakalar oyuna eklenecek.</p>
                </li>
              </ol>
            </div>

            <div class="panel" role="tabpanel" id="privacy" aria-labelledby="tab-privacy" tabindex="0">
              <div class="gpriv">
                <div class="gpriv__head">
                  <span class="gpriv__icon" aria-hidden="true"><svg><use href="#i-shield"/></svg></span>
                  <div>
                    <h2 class="gpriv__title" data-i18n="gp.title">Gizlilik, kısaca</h2>
                    <p class="gpriv__sub" data-i18n="gp.sub">Detective on Duty verilerinle ne yapar, ne yapmaz.</p>
                  </div>
                </div>
                <ul class="checks">
                  <li><svg aria-hidden="true"><use href="#i-check"/></svg><span data-i18n="priv.1">Hesap, e-posta ya da kimlik gerekmez.</span></li>
                  <li><svg aria-hidden="true"><use href="#i-check"/></svg><span data-i18n="priv.2">Kaydın ve ilerlemen telefonunda saklanır.</span></li>
                  <li><svg aria-hidden="true"><use href="#i-check"/></svg><span data-i18n="priv.3">Sıralamada yalnızca takma adın, puanın, rütben ve avatarın görünür.</span></li>
                  <li><svg aria-hidden="true"><use href="#i-check"/></svg><span data-i18n="priv.4">Oyundaki Ayarlar ekranından hesabını ve verilerini silebilirsin.</span></li>
                </ul>
                <div class="gpriv__foot">
                  <a class="btn" href="privacy-policy.html"><span data-i18n="gp.full">Politikanın tamamı</span><svg class="btn__icon btn__icon--go" aria-hidden="true"><use href="#i-arrow"/></svg></a>
                  <p class="privacy__note" data-i18n="priv.note">Politikanın resmî ve eksiksiz metni İngilizcedir.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>'''
    ld = {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        'name': 'Detective on Duty',
        'description': 'Olay yerini ara, şüphelileri sorgula, delilleri panoda bağla ve kararını ver.',
        'genre': 'Detective',
        'image': BASE + g['icon_l'],
        'url': BASE + 'detective-on-duty.html',
        'publisher': {'@type': 'Organization', 'name': 'QuUp Games', 'url': BASE},
    }
    store_pages = [link for link in STORE_LINKS.values() if link]
    if store_pages:
        ld['gamePlatform'] = ['Android', 'iOS'] if STORE_LINKS['appstore'] else 'Android'
        ld['operatingSystem'] = ld['gamePlatform']
        ld['applicationCategory'] = 'GameApplication'
        ld['installUrl'] = store_pages[0]
        ld['sameAs'] = store_pages
    return document('game', 'detective-on-duty.html', 'Detective on Duty | QuUp Games',
                    "Detective on Duty: olay yeri, sorgu, çıkarım panosu ve karar. QuUp Games'in yeni dedektif oyunu.",
                    'games', content, BACKDROP_PAGE, ld, theme='dod', og='dod')


# ---------------------------------------------------------------- about
def about():
    content = f'''    <div class="page__inner">
      <div class="about__grid wrap">
        <div class="about__copy">
          <p class="eyebrow" data-i18n="about.eyebrow">Biz kimiz?</p>
          <h1 class="about__logo"><span class="sr-only">QuUp Games</span><span class="logo logo--xl" aria-hidden="true">{LOGO_INNER}</span></h1>
          <p class="about__kicker" data-i18n="about.kicker">Bağımsız mobil oyun stüdyosu</p>
          <p class="lead" data-i18n="about.lead">Telefonda oynanan, akılda kalan oyunlar yapıyoruz: kısa sürede öğrenilen, uzun süre bırakılamayan. Her oyunda aynı üç kurala bağlı kalıyoruz.</p>
          <ul class="values">
            <li class="value"><span class="value__icon" aria-hidden="true"><svg><use href="#i-smile"/></svg></span><h2 data-i18n="v1.t">Önce eğlence</h2><p data-i18n="v1.d">İlk dakikada keyif vermeyen hiçbir mekanik oyuna giremez.</p></li>
            <li class="value"><span class="value__icon" aria-hidden="true"><svg><use href="#i-gauge"/></svg></span><h2 data-i18n="v2.t">Her telefonda akıcı</h2><p data-i18n="v2.d">Eski telefonlarda bile hızlı açılan, pil dostu oyunlar.</p></li>
            <li class="value"><span class="value__icon" aria-hidden="true"><svg><use href="#i-shield"/></svg></span><h2 data-i18n="v3.t">Oyuncuya saygı</h2><p data-i18n="v3.d">Oynamak için hesap istemiyoruz. İlerlemen kendi telefonunda kalır.</p></li>
          </ul>
          <div class="about__cta">
            <a class="btn" href="games.html"><span data-i18n="about.games">Oyunlarımız</span><svg class="btn__icon btn__icon--go" aria-hidden="true"><use href="#i-arrow"/></svg></a>
            <a class="btn btn--ghost" href="contact.html"><svg class="btn__icon" aria-hidden="true"><use href="#i-mail"/></svg><span data-i18n="about.write">Bize yaz</span></a>
          </div>
        </div>

        <div class="about__stage" id="aboutStage">
          <div class="about__glow" aria-hidden="true"></div>
          <div class="emblem-float">
            <div class="emblem">
              <div class="emblem__orbit" aria-hidden="true"><span></span></div>
              <svg class="emblem__q" viewBox="0 0 638 619" aria-hidden="true">
                <defs>
                  <linearGradient id="qFace" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#ffffff"/>
                    <stop offset=".38" stop-color="#e6e9f2"/>
                    <stop offset=".56" stop-color="#a6adc2"/>
                    <stop offset=".74" stop-color="#eceff7"/>
                    <stop offset="1" stop-color="#8b93aa"/>
                  </linearGradient>
                </defs>
                <g>
                  <use href="#q-path" fill="#0a0c12" transform="translate(18 21)"/>
                  <use href="#q-path" fill="#0f121a" transform="translate(16 18.7)"/>
                  <use href="#q-path" fill="#141823" transform="translate(14 16.3)"/>
                  <use href="#q-path" fill="#191e2b" transform="translate(12 14)"/>
                  <use href="#q-path" fill="#1f2534" transform="translate(10 11.7)"/>
                  <use href="#q-path" fill="#252c3e" transform="translate(8 9.3)"/>
                  <use href="#q-path" fill="#2c3448" transform="translate(6 7)"/>
                  <use href="#q-path" fill="#353e55" transform="translate(4 4.7)"/>
                  <use href="#q-path" fill="#3f4963" transform="translate(2 2.3)"/>
                </g>
                <use href="#q-path" fill="url(#qFace)"/>
                <use href="#q-path" fill="none" stroke="#ffffff" stroke-opacity=".75" stroke-width="3"/>
              </svg>
              <div class="emblem__shine" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
    </div>'''
    return document('about', 'about.html', 'Biz kimiz? | QuUp Games',
                    'QuUp Games, telefonda oynanan, akılda kalan oyunlar yapan bağımsız bir mobil oyun stüdyosu.',
                    'about', content)


# ---------------------------------------------------------------- contact
def mail_card(icon, key, title, desc, addr):
    return f'''            <li class="mail-card">
              <span class="mail-card__icon" aria-hidden="true"><svg><use href="#{icon}"/></svg></span>
              <div>
                <h2 data-i18n="ct.{key}T">{title}</h2>
                <p data-i18n="ct.{key}D">{desc}</p>
                <a class="mail-card__addr" href="mailto:{addr}">{addr}</a>
              </div>
              <div class="mail-card__actions">
                <button class="icon-btn" type="button" data-copy="{addr}" aria-label="Adresi kopyala" data-i18n-aria="ct.copy"><svg aria-hidden="true"><use href="#i-copy"/></svg></button>
                <a class="icon-btn" href="mailto:{addr}" aria-label="E-posta gönder" data-i18n-aria="ct.send"><svg aria-hidden="true"><use href="#i-mail"/></svg></a>
              </div>
            </li>'''


def contact():
    content = f'''    <div class="page__inner">
      <div class="contact__grid wrap">
        <div class="contact__copy">
          <p class="eyebrow" data-i18n="ct.eyebrow">İletişim</p>
          <h1 class="h1" data-i18n="ct.title">Bize yaz</h1>
          <p class="lead" data-i18n="ct.lead">Destek, geri bildirim, basın ya da iş birliği. Doğru adrese yazarsan daha hızlı döneriz.</p>
        </div>
        <ul class="cards">
{mail_card('i-help', 'support', 'Destek', 'Oyunlarımızla ilgili sorunlar, hesap silme ve satın alımlar.', 'support@quupgames.com')}
{mail_card('i-hello', 'hello', 'Genel ve iş birliği', 'Basın, iş birliği ve her türlü merhaba.', 'hello@quupgames.com')}
          <li class="mail-card">
            <span class="mail-card__icon" aria-hidden="true"><svg><use href="#i-share"/></svg></span>
            <div>
              <h2 data-i18n="ct.shareT">Siteyi paylaş</h2>
              <p data-i18n="ct.shareD">QuUp Games'i bir arkadaşına gönder.</p>
            </div>
            <div class="mail-card__actions">
              <button class="btn btn--ghost" type="button" data-share="{BASE}"><svg class="btn__icon" aria-hidden="true"><use href="#i-share"/></svg><span data-i18n="ct.shareBtn">Paylaş</span></button>
            </div>
          </li>
        </ul>
      </div>
    </div>'''
    return document('contact', 'contact.html', 'İletişim | QuUp Games',
                    "QuUp Games'e yaz: destek için support@quupgames.com, diğer her şey için hello@quupgames.com.",
                    'contact', content)


# ---------------------------------------------------------------- privacy (belongs to Detective on Duty)
POLICY = open(os.path.join(SRC, 'policy.html'), encoding='utf-8').read()


def privacy():
    content = f'''    <div class="page__inner">
      <div class="privacy__grid wrap">
        <aside class="privacy__side">
          <nav class="crumbs" aria-label="Bulunduğun yer" data-i18n-aria="aria.crumbs">
            <a href="games.html" data-i18n="nav.games">Oyunlar</a><svg aria-hidden="true"><use href="#i-next"/></svg><a href="detective-on-duty.html" lang="en">Detective on Duty</a><svg aria-hidden="true"><use href="#i-next"/></svg><span aria-current="page" data-i18n="tab.privacy">Gizlilik</span>
          </nav>
          <h1 class="h1" data-i18n="priv.title">Gizlilik politikası</h1>
          <ul class="checks">
            <li><svg aria-hidden="true"><use href="#i-check"/></svg><span data-i18n="priv.1">Hesap, e-posta ya da kimlik gerekmez.</span></li>
            <li><svg aria-hidden="true"><use href="#i-check"/></svg><span data-i18n="priv.2">Kaydın ve ilerlemen telefonunda saklanır.</span></li>
            <li><svg aria-hidden="true"><use href="#i-check"/></svg><span data-i18n="priv.3">Sıralamada yalnızca takma adın, puanın, rütben ve avatarın görünür.</span></li>
            <li><svg aria-hidden="true"><use href="#i-check"/></svg><span data-i18n="priv.4">Oyundaki Ayarlar ekranından hesabını ve verilerini silebilirsin.</span></li>
          </ul>
          <p class="privacy__note" data-i18n="priv.note">Politikanın resmî ve eksiksiz metni İngilizcedir.</p>
          <a class="text-link" href="detective-on-duty.html"><span data-i18n="priv.back">Oyun sayfasına dön</span><svg aria-hidden="true"><use href="#i-arrow"/></svg></a>
        </aside>

{POLICY}
      </div>
    </div>'''
    return document('privacy', 'privacy-policy.html', 'Detective on Duty Gizlilik Politikası | QuUp Games',
                    'Detective on Duty gizlilik politikası: hesap gerekmez, kaydın telefonunda kalır, haftalık sıralamaya haftada tek satır gider.',
                    'games', content, BACKDROP_PAGE, theme='dod', og='dod')


# ---------------------------------------------------------------- 404 (the studio's page for a missing address)
def absolutize(html):
    """GitHub Pages serves 404.html for any missing address, however deep (/games/a/b/c),
    so its links and files cannot be relative: they all start from the site's root."""
    def fix(m):
        attr, url = m.group(1), m.group(2)
        if re.match(r'(?:[a-z][a-z0-9+.-]*:|//|/|#)', url):
            return m.group(0)
        return f'{attr}="{BASE_PATH}{"" if url == "./" else url}"'
    return re.sub(r'(?<![\w-])(href|src)="([^"]*)"', fix, html)


def not_found():
    content = '''    <div class="page__inner">
      <section class="nf wrap" aria-labelledby="nf-title">
        <p class="nf__code"><span class="nf__glyphs" aria-hidden="true"><span>4</span><svg class="nf__q" viewBox="0 0 638 619"><use href="#q-path"/></svg><span>4</span></span><span class="sr-only">404</span></p>
        <h1 class="h1 nf__title" id="nf-title" data-i18n="nf.title">Sayfa bulunamadı</h1>
        <p class="lead nf__lead" data-i18n="nf.lead">Aradığın sayfa taşınmış, adı değişmiş ya da hiç var olmamış olabilir.</p>
        <p class="nf__path" hidden><span data-i18n="nf.path">Aranan adres</span><code id="nfPath"></code></p>
        <div class="nf__actions">
          <a class="btn" href="./"><svg class="btn__icon" aria-hidden="true"><use href="#i-home"/></svg><span data-i18n="nf.home">Ana sayfaya dön</span></a>
          <a class="btn btn--ghost" href="games.html"><span data-i18n="nf.games">Oyunlarımız</span><svg class="btn__icon btn__icon--go" aria-hidden="true"><use href="#i-arrow"/></svg></a>
        </div>
      </section>
    </div>'''
    return absolutize(document('404', '404.html', 'Sayfa bulunamadı | QuUp Games',
                               'Aradığın sayfa bulunamadı. QuUp Games ana sayfasına ya da oyunlarımıza göz at.',
                               None, content, BACKDROP_PLAIN, index=False))


PAGES = {
    'index.html': home,
    'games.html': games_page,
    'detective-on-duty.html': game,
    'about.html': about,
    'contact.html': contact,
    'privacy-policy.html': privacy,
    '404.html': not_found,
}

if __name__ == '__main__':
    out_dir = sys.argv[1] if len(sys.argv) > 1 else ROOT
    os.makedirs(out_dir, exist_ok=True)
    for name, fn in PAGES.items():
        html = fn()
        with open(os.path.join(out_dir, name), 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'{name}: {len(html.encode()):,} bytes')
