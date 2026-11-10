// Drives one journalist journey through the local demo (npm run dev) and screenshots each step.
// Usage: node scripts/journey/capture.mjs, then node scripts/journey/compose.mjs
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
// playwright-core is not a project dependency. Point PLAYWRIGHT_CORE at any install of it, e.g. from the npx cache.
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core')

const BASE = 'http://localhost:5173/'
import { mkdirSync } from 'node:fs'
const OUT = new URL('./.out/shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' })

// Inside a step the sidebar is an empty strip, so those shots start at its right border (192 CSS px)
const SIDEBAR = 192
const shot = async (name, scrollTo = 0, { sidebar = false } = {}) => {
  await page.evaluate((y) => window.scrollTo(0, y), scrollTo)
  await wait(900) // let reveal animations settle
  const x = sidebar ? 0 : SIDEBAR
  await page.screenshot({ path: `${OUT}${name}.png`, clip: { x, y: 0, width: 1440 - x, height: 900 } })
  console.log('saved', name)
}
const click = (sel, text) =>
  page.evaluate(
    ([s, t]) => [...document.querySelectorAll(s)].find((el) => !t || el.textContent.trim().includes(t)).click(),
    [sel, text],
  )
const top = (sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + window.scrollY - 16, sel)

// 1 Dashboard
await page.goto(BASE + '#/')
await wait(1200)
await shot('1-dashboard', 0, { sidebar: true })

// 2 Bank Informasi: upload a sample, label it Sensitif, let it process
await page.goto(BASE + '#/project/1')
await wait(600)
await click('button', 'Unggah bahan')
await wait(300)
await page.evaluate(() => {
  const card = document.getElementById('bahan-VIDEO-2') // the first dummy upload
  ;[...card.querySelectorAll('.toggle button')].find((b) => b.textContent === 'Sensitif').click()
})
await wait(3500)
await shot('2-bank', await top('.layout'))

// 3 Brief & Guideline
await click('footer .primary')
await wait(500)
await shot('3-brief', await top('.layout'))

// 4 Script & Sumber: approve 1-3, edit 4, discard 5, approve the rest, then select paragraph 4
await click('footer .primary')
await wait(3500)
const decide = (label) => click('.slip .buttons button', label)
for (let i = 0; i < 3; i++) (await decide('Setuju'), await wait(150))
await decide('Ubah')
await wait(200)
await page.fill('[data-line="L4"] textarea', 'Hasil lab: di satu titik sampel, kadar COD tiga kali di atas baku mutu.')
await click('[data-line="L4"] button', 'Simpan')
await wait(200)
await decide('Buang')
await wait(150)
await decide('Setuju')
await wait(150)
await decide('Setuju')
await wait(150)
await page.evaluate(() => document.querySelectorAll('.cells .cell')[3].click())
await wait(400)
await shot('4-script', await top('.ledger'))

// 5 Generate Media
await click('footer .primary')
await wait(3600)
await shot('5-generate', await top('.layout'))

// 6 QC Editorial
await click('footer .primary')
await wait(600)
await shot('6-qc', await top('.layout'))

// 7 Ekspor: approve, export (the CSV download is swallowed), show the package and colophon
await click('.approve')
await wait(600)
await page.evaluate(() => {
  URL.createObjectURL = () => 'blob:none'
  HTMLAnchorElement.prototype.click = () => {}
})
await click('.send')
await wait(500)
await shot('7-ekspor', await top('.layout'))

await browser.close()
