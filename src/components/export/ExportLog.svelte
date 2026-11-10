<script>
  // Each export so far, newest first, as dispatch slips
  /** @type {{ entries: { at: string, version: number, files: string[] }[] }} */
  let { entries } = $props()
</script>

<section class="log" aria-label="Riwayat ekspor">
  <p class="kicker">Riwayat ekspor <span>{entries.length}</span></p>
  {#each entries as e, i (i)}
    <div class="slip">
      <span class="when">{e.at} · v{e.version}</span>
      <span class="files">{e.files.join(', ')}</span>
      <span class="sent">Diekspor</span>
    </div>
  {:else}
    <p class="empty">Belum ada ekspor. Status konten berubah menjadi Diekspor setelah Anda mengunduh.</p>
  {/each}
</section>

<style>
  .log {
    display: grid;
    gap: 8px;
  }

  .kicker {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .kicker span {
    color: var(--muted);
    margin-left: 4px;
  }

  .slip {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 10px;
    align-items: center;
    padding: 8px 10px;
    background: var(--card);
    border: 1.5px solid var(--border);
    border-left-width: 5px;
    border-left-color: var(--hijau);
    animation: drop 0.3s ease-out;
  }

  .when {
    font: 600 10px/1 var(--font-mono);
    white-space: nowrap;
  }

  .files {
    font: 400 11px/1.3 var(--font-mono);
    color: var(--muted);
    overflow-wrap: anywhere;
  }

  .sent {
    font: 600 9.5px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--hijau);
    border: 1.5px solid currentColor;
    padding: 3px 5px;
    transform: rotate(-2deg);
  }

  .empty {
    font-size: 12px;
    color: var(--muted);
    border: 1.5px dashed var(--border);
    padding: 10px 12px;
  }

  @keyframes drop {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .slip {
      animation: none;
    }
  }
</style>
