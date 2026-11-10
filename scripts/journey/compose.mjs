// Lays the 7 journey screenshots side by side with an explanation per step, then renders one wide PNG.
import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
const require = createRequire(import.meta.url)
// playwright-core is not a project dependency. Point PLAYWRIGHT_CORE at any install of it, e.g. from the npx cache.
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core')

const HERE = new URL('./.out/', import.meta.url).pathname
const FONTS = new URL('../../node_modules', import.meta.url).pathname
const OUT_DIR = process.argv[2] ?? new URL('../../docs/journey', import.meta.url).pathname

const steps = [
  {
    shot: '1-dashboard', kicker: 'Dashboard', title: 'Mulai dari project aktif',
    text: 'Jurnalis melihat project yang sedang dikerjakan, tenggatnya, dan apa saja yang menunggu keputusannya.',
    human: 'Memilih project yang dikerjakan.',
  },
  {
    shot: '2-bank', kicker: 'Langkah 1 · Bank Informasi', title: 'Kumpulkan bahan, beri label',
    text: 'Semua bahan liputan masuk dan setiap bagiannya diberi ID. Jalur pemrosesan menunjukkan bahan mana yang boleh ke AI cloud dan mana yang hanya ke model lokal.',
    human: 'Memberi label Publik atau Sensitif. VIDEO-2 dilabel Sensitif, jadi hanya diproses model lokal.',
  },
  {
    shot: '3-brief', kicker: 'Langkah 2 · Brief & Guideline', title: 'Tetapkan tujuan dan aturan main',
    text: 'Tujuan, format, platform, audiens dan jumlah slide diisi di brief. Ringkasan di kanan bawah menunjukkan apa yang akan diterima AI.',
    human: 'Menulis aturan yang wajib dipatuhi AI, dengan kata-kata sendiri.',
  },
  {
    shot: '4-script', kicker: 'Langkah 3 · Script & Sumber', title: 'Setiap paragraf punya sumber',
    text: 'AI menyusun script. Setiap paragraf disorot dengan warna dokumen sumbernya, dan auditor otomatis menandai yang perlu dicek.',
    human: 'Memutuskan tiap paragraf. ¶4 diubah karena melebih-lebihkan data lab, ¶5 dibuang karena tidak ada sumbernya.',
  },
  {
    shot: '5-generate', kicker: 'Langkah 4 · Generate Media', title: 'AI merender slide',
    text: 'Script yang disetujui dirender menjadi Image Slides, lalu QC otomatis memeriksa hasilnya terhadap guideline.',
    human: 'Edit teks langsung, atau minta AI membuat ulang satu slide saja tanpa menyentuh slide lain.',
  },
  {
    shot: '6-qc', kicker: 'Langkah 5 · QC Editorial', title: 'Persetujuan akhir',
    text: 'Pratinjau final dengan sumber di bawah setiap slide, dan checklist yang dicek sebelum menyetujui.',
    human: 'Menyetujui untuk ekspor, atau mengirim revisi ke langkah yang memegang masalahnya. AI tidak bisa menyetujui.',
  },
  {
    shot: '7-ekspor', kicker: 'Langkah 6 · Ekspor & Atribusi', title: 'Ekspor dengan Jejak Sumber',
    text: 'Konten diunduh bersama credit, metadata karya dan Jejak Sumber, supaya editor bisa menelusuri setiap kalimat tanpa mengecek dari nol.',
    human: 'Memeriksa credit dan memilih berkas yang diunduh.',
  },
]

const panel = (s, i) => `
  <article>
    <header>
      <span class="n">${String(i + 1).padStart(2, '0')}</span>
      <div><p class="k">${s.kicker}</p><h2>${s.title}</h2></div>
    </header>
    <figure><img src="${HERE}shots/${s.shot}.png" alt=""></figure>
    <p class="t">${s.text}</p>
    <aside><span class="tag">Keputusan jurnalis</span><p>${s.human}</p></aside>
  </article>`

const summary = () => `
  <article class="summary">
    <header><span class="n">✓</span><div><p class="k">Rangkuman</p><h2>Jurnalis memutuskan di setiap langkah</h2></div></header>
    <ol>${steps.map((s, i) => `<li><span class="sn">${String(i + 1).padStart(2, '0')}</span><span><b>${s.kicker}</b>${s.human}</span></li>`).join('')}</ol>
    <aside><span class="tag">Prinsip</span><p>AI menyusun dan memeriksa. Manusia memberi label, menulis aturan, memutuskan tiap kalimat, dan menyetujui. Setiap kalimat bisa ditelusuri ke sumbernya.</p></aside>
  </article>`

const page = (items, part, total, summaryLast) => `<!doctype html><html lang="id"><head><meta charset="utf-8"><style>
@font-face { font-family: 'Newsreader'; src: url('${FONTS}/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2') format('woff2'); font-weight: 200 800; }
@font-face { font-family: 'Plex Mono'; src: url('${FONTS}/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2') format('woff2'); font-weight: 400; }
@font-face { font-family: 'Plex Mono'; src: url('${FONTS}/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2') format('woff2'); font-weight: 600; }
:root { --text:#222; --muted:#6d6d6a; --bg:#f4f4f2; --card:#fff; --border:#999; --fl:#e6e6e3; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1920px; height: 1080px; overflow: hidden; }
body { background: var(--bg); color: var(--text); font: 17px/1.5 'Segoe UI', Helvetica, Arial, sans-serif; padding: 48px 64px 36px; display: flex; flex-direction: column; }
.mast { display: flex; justify-content: space-between; align-items: end; gap: 40px; padding-bottom: 18px; border-bottom: 1.5px solid var(--border); margin-bottom: 26px; }
.k, .tag, .foot, .n, .part, .sn { font-family: 'Plex Mono', monospace; }
.mast .k { font-size: 14px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); }
h1 { font: 500 40px/1.1 'Newsreader', serif; letter-spacing: -0.6px; margin-top: 6px; }
.part { font-size: 15px; letter-spacing: 1px; text-transform: uppercase; border: 1.5px solid var(--text); padding: 8px 12px; white-space: nowrap; }
.row { flex: 1; min-height: 0; display: flex; }
article { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 14px; }
.arrow { width: 64px; display: grid; place-items: center; font: 400 40px/1 'Newsreader', serif; color: var(--muted); }
article header { display: flex; gap: 16px; align-items: start; border-top: 5px solid var(--text); padding-top: 14px; }
.n { font-size: 40px; font-weight: 600; line-height: 1; }
.k { font-size: 13px; letter-spacing: 0.9px; text-transform: uppercase; color: var(--muted); }
h2 { font: 500 32px/1.12 'Newsreader', serif; margin-top: 4px; }
figure { flex: 1; min-height: 0; border: 1.5px solid var(--border); background: var(--card); box-shadow: 7px 7px 0 var(--fl); overflow: hidden; }
figure img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top left; }
.t { font-size: 18px; }
aside { display: grid; gap: 8px; border: 1.5px dashed var(--border); padding: 14px 16px; font-size: 17px; }
.tag { justify-self: start; font-size: 12px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; background: var(--text); color: #fff; padding: 5px 8px; }
.summary ol { flex: 1; list-style: none; padding: 0; display: grid; align-content: start; gap: 0; border: 1.5px solid var(--border); background: var(--card); }
.summary li { display: grid; grid-template-columns: 44px 1fr; gap: 12px; padding: 13px 18px; font-size: 16.5px; }
.summary li + li { border-top: 1px dashed var(--border); }
.summary li b { display: block; font: 600 12px/1.6 'Plex Mono', monospace; letter-spacing: 0.6px; text-transform: uppercase; color: var(--muted); }
.sn { font-size: 18px; font-weight: 600; }
.foot { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 14px; border-top: 1.5px solid var(--border); font-size: 14px; color: var(--muted); letter-spacing: 0.4px; }
</style></head><body>
  <div class="mast">
    <div>
      <p class="k">The Good AI! P012 · Prototype lo-fi · Satu perjalanan jurnalis</p>
      <h1>Dari bahan liputan ke konten siap unggah, setiap kalimat bisa ditelusuri</h1>
    </div>
    <span class="part">Bagian ${part} / ${total}</span>
  </div>
  <div class="row">${items.join(summaryLast ? '<div class="arrow"></div>' : '<div class="arrow">→</div>')}</div>
  <div class="foot"><span>raflyfahrezi.github.io/the-good-ai-workshop-labtek-indie</span><span>Data dummy. Semua nama, tempat, angka dan kutipan fiktif. AI disimulasikan.</span></div>
</body></html>`

// Two steps per image; step 7 shares the last image with the summary card
const groups = [[0, 1], [2, 3], [4, 5], [6]]
const browser = await chromium.launch({ channel: 'chrome' })
const tab = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 })
for (const [g, idx] of groups.entries()) {
  const items = idx.map((i) => panel(steps[i], i))
  if (idx.length === 1) items.push(summary())
  const file = `${HERE}journey-${g + 1}.html`
  writeFileSync(file, page(items, g + 1, groups.length, idx.length === 1))
  await tab.goto('file://' + file)
  await tab.evaluate(() => document.fonts.ready)
  await tab.waitForTimeout(300)
  const name = `${OUT_DIR}/journey-bagian-${g + 1}.png`
  await tab.screenshot({ path: name })
  console.log('saved', name)
}
await browser.close()
