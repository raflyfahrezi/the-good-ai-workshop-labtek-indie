<script>
  // The approval slip. The checklist informs, it does not block: only the journalist can approve, never the AI.
  import { journalist } from '../../lib/data.js'

  /** @type {{ checks: { label: string, value: string, ok: boolean }[], version: number, onapprove: () => void }} */
  let { checks, version, onapprove } = $props()

  let warnings = $derived(checks.filter((c) => !c.ok).length)
</script>

<section class="slip" aria-label="Persetujuan akhir">
  <header>
    <p class="kicker">Lembar persetujuan</p>
    <p class="ver">Image Slides · v{version}</p>
  </header>

  <ul class="checks">
    {#each checks as c (c.label)}
      <li class:warn={!c.ok}>
        <span class="mark" aria-hidden="true">{c.ok ? '✓' : '!'}</span>
        <span class="label">{c.label}</span>
        <span class="value">{c.value}</span>
      </li>
    {/each}
  </ul>

  {#if warnings > 0}
    <p class="advice">Masih ada {warnings} hal yang perlu dicek. Sebaiknya minta revisi dulu.</p>
  {/if}

  <button class="approve" onclick={onapprove}>Setujui untuk ekspor</button>

  <div class="sign">
    <span class="line">{journalist.name}</span>
    <span class="caption">Jurnalis penanggung jawab. AI tidak bisa menyetujui.</span>
  </div>
</section>

<style>
  .slip {
    display: grid;
    gap: 12px;
    background: var(--card);
    border: 1.5px solid var(--border);
    box-shadow: 5px 5px 0 var(--fl);
    padding: 14px 16px 16px;
  }

  header {
    display: grid;
    gap: 6px;
    padding-bottom: 10px;
    border-bottom: 1.5px solid var(--border);
  }

  .kicker {
    font: 500 22px/1.1 var(--font-display);
  }

  .ver {
    font: 400 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }

  .checks {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
  }

  .checks li {
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr) auto;
    gap: 8px;
    align-items: baseline;
    padding: 6px 0;
    border-bottom: 1px dashed var(--border);
    font-size: 13px;
  }

  .mark {
    font: 600 12px/1 var(--font-mono);
    color: var(--hijau);
  }

  .value {
    font: 600 11px/1.3 var(--font-mono);
    text-align: right;
  }

  .warn .mark,
  .warn .value {
    color: var(--merah);
  }

  .advice {
    font-size: 12px;
    font-weight: 600;
    color: var(--merah);
  }

  .approve {
    padding: 12px;
    font: 600 15px/1 var(--font-ui);
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
  }

  .approve:hover {
    box-shadow: 3px 3px 0 var(--border);
    transform: translate(-1px, -1px);
  }

  /* A signature line, so the sign-off reads as a person's act */
  .sign {
    display: grid;
    gap: 4px;
    margin-top: 4px;
  }

  .line {
    border-bottom: 1px solid var(--text);
    padding: 0 4px 2px;
    font: italic 400 22px/1 var(--font-display);
  }

  .caption {
    font: 400 10px/1.3 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--muted);
  }
</style>
