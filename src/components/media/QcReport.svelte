<script>
  // Auto QC findings for the rendered slides. Each finding links to its frame. The AI only flags; the journalist decides in step 5.
  import { flagMark, frameId } from '../../lib/media.js'

  /** @type {{ flags: any[], rules: string[], version: number }} */
  let { flags, rules, version } = $props()

  let counts = $derived(Object.keys(flagMark).map((level) => ({ level, n: flags.filter((f) => f.level === level).length })))

  function show(n) {
    const el = document.getElementById(frameId(n))
    if (!el) return
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    el.classList.add('flash')
    setTimeout(() => el.classList.remove('flash'), 1200)
  }
</script>

<aside class="report" aria-label="Laporan QC otomatis">
  <header>
    <p class="kicker">Laporan QC otomatis · v{version}</p>
    <ul class="counts">
      {#each counts as c (c.level)}
        <li class={c.level}><span class="code">{flagMark[c.level].code}</span>{c.n}</li>
      {/each}
    </ul>
  </header>

  {#if !flags.some((f) => f.level === 'merah')}
    <p class="clean">Tidak ada temuan merah.</p>
  {/if}

  <ol class="flags">
    {#each flags as flag, i (i)}
      <li class={flag.level}>
        <button onclick={() => show(flag.n)} aria-label="Lihat slide {flag.n}">
          <span class="code">{flagMark[flag.level].code}</span>
          <span class="where">Slide {flag.n}</span>
        </button>
        <p>{flag.text}</p>
        {#if flag.edited}<p class="edited">Baris ini sudah diubah jurnalis. Cek apakah temuan masih berlaku.</p>{/if}
      </li>
    {/each}
  </ol>

  <details>
    <summary>Diperiksa terhadap {rules.length} aturan dari jurnalis</summary>
    <ol class="rules">
      {#each rules as rule, i (i)}<li><span>A{i + 1}</span>{rule}</li>{/each}
    </ol>
  </details>
</aside>

<style>
  .report {
    position: sticky;
    top: 16px;
    display: grid;
    gap: 12px;
    background: var(--card);
    border: 1.5px solid var(--border);
    padding: 14px 16px 16px;
  }

  header {
    display: grid;
    gap: 8px;
    padding-bottom: 10px;
    border-bottom: 1.5px solid var(--border);
  }

  .kicker {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .counts {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 14px;
    font: 500 20px/1 var(--font-display);
  }

  .counts li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .code {
    flex: none;
    font: 600 9px/1 var(--font-mono);
    padding: 2px 4px;
    border: 1px solid currentColor;
  }

  .merah {
    color: var(--merah);
  }
  .kuning {
    color: var(--kuning);
  }
  .info {
    color: var(--muted);
  }

  .clean {
    font-size: 13px;
    font-weight: 600;
    color: var(--hijau);
  }

  .flags {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 8px;
  }

  .flags li {
    display: grid;
    gap: 4px;
    padding: 8px 10px;
    border-left: 3px solid currentColor;
    background: var(--fl);
  }

  .flags li.merah {
    background: var(--merah-bg);
  }
  .flags li.kuning {
    background: var(--kuning-bg);
  }

  .flags button {
    justify-self: start;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
  }

  .where {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .flags p {
    font-size: 12.5px;
    color: var(--text);
  }

  .flags .edited {
    font-style: italic;
    color: var(--muted);
  }

  summary {
    cursor: pointer;
    font-size: 12px;
    color: var(--muted);
  }

  .rules {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
    display: grid;
    gap: 4px;
    font-size: 12px;
  }

  .rules li {
    display: grid;
    grid-template-columns: 26px minmax(0, 1fr);
  }

  .rules span {
    font: 600 10px/1.6 var(--font-mono);
    color: var(--muted);
  }

  @media (max-width: 900px) {
    .report {
      position: static;
    }
  }
</style>
