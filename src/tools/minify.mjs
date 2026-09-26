// Compresses the built site in place: every page at the root, the stylesheet
// and the script. Readable originals stay in src/.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { minify as minifyHtml } from 'html-minifier-terser';
import { transform as transformCss } from 'lightningcss';
import JavaScriptObfuscator from 'javascript-obfuscator';

const SRC = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ROOT = path.dirname(SRC);

const HTML_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: false, // inline style attributes carry custom properties; leave them as written
  minifyJS: true,
};

const OBFUSCATOR_OPTIONS = {
  compact: true,
  target: 'browser',
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  simplify: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 1,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  splitStrings: false,
  controlFlowFlattening: false, // keeps the animation loops fast
  deadCodeInjection: false,
  selfDefending: false,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
};

// "View source" shows a sealed block instead of the page: the body travels XOR-scrambled
// and base64-encoded, and a tiny loader writes it back while the page is parsed. The head
// (title, description, share tags, structured data) stays plain for search engines and link previews.
const NOSCRIPT = '<noscript><p style="margin:40px 16px;color:#9ea3b6;font:16px/1.5 system-ui,sans-serif;text-align:center">'
  + 'Bu siteyi görmek için JavaScript’i açın. · Please turn on JavaScript to view this site.</p></noscript>';

function seal(html) {
  const m = html.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
  if (!m) throw new Error('no <body> found');
  const key = randomBytes(24);
  const bytes = Buffer.from(m[2], 'utf8');
  for (let i = 0; i < bytes.length; i++) bytes[i] ^= key[i % key.length];
  const loader = '<script>(function(k,s){k=atob(k);s=atob(s);var b=new Uint8Array(s.length);'
    + 'for(var i=0;i<s.length;i++)b[i]=s.charCodeAt(i)^k.charCodeAt(i%k.length);'
    + `document.write(new TextDecoder().decode(b))})("${key.toString('base64')}","${bytes.toString('base64')}")</script>`;
  return html.replace(m[0], `<body${m[1]}>${loader}${NOSCRIPT}</body>`);
}

async function pages() {
  const names = (await readdir(ROOT)).filter((f) => f.endsWith('.html'));
  // the 404 page is written by hand in src/
  const sources = names.filter((f) => f !== '404.html').map((f) => [path.join(ROOT, f), f]);
  sources.push([path.join(SRC, '404.html'), '404.html']);
  for (const [from, name] of sources) {
    const html = await readFile(from, 'utf8');
    const out = seal(await minifyHtml(html, HTML_OPTIONS));
    await writeFile(path.join(ROOT, name), out);
    console.log(`${name.padEnd(24)} ${html.length.toLocaleString()} → ${out.length.toLocaleString()} bytes`);
  }
}

async function styles() {
  const code = await readFile(path.join(SRC, 'css/style.css'));
  const { code: out, warnings } = transformCss({ filename: 'style.css', code, minify: true, errorRecovery: true });
  warnings.forEach((w) => console.warn('css:', w.message));
  await writeFile(path.join(ROOT, 'assets/css/style.css'), out);
  console.log(`style.css                ${code.length.toLocaleString()} → ${out.length.toLocaleString()} bytes`);
}

async function script() {
  const code = await readFile(path.join(SRC, 'js/main.js'), 'utf8');
  const out = JavaScriptObfuscator.obfuscate(code, OBFUSCATOR_OPTIONS).getObfuscatedCode();
  await writeFile(path.join(ROOT, 'assets/js/main.js'), out);
  console.log(`main.js                  ${code.length.toLocaleString()} → ${out.length.toLocaleString()} bytes`);
}

await pages();
await styles();
await script();
