<script>
  /** @type {{ entries: { at: string, text: string }[], limit?: number }} */
  let { entries, limit = 6 } = $props()

  let shown = $derived(entries.slice(0, limit))
</script>

<section class="panel">
  <h3>Aktivitas terakhir</h3>
  {#if shown.length}
    <ol class="feed">
      {#each shown as entry, i (i)}
        <li>
          <time>{entry.at}</time>
          <span>{entry.text}</span>
        </li>
      {/each}
    </ol>
  {:else}
    <p class="empty">Belum ada aktivitas di sesi ini. Setiap keputusan jurnalis akan tercatat di sini.</p>
  {/if}
</section>

<style>
  .panel {
    background: var(--card);
    border: 1.5px solid var(--border);
    padding: 14px 16px;
    display: grid;
    gap: 10px;
    align-content: start;
  }

  h3 {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .feed {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .feed li {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 8px;
    padding: 7px 0;
    border-top: 1px solid var(--fl);
    font-size: 13px;
  }

  .feed li:first-child {
    border-top: 0;
    padding-top: 0;
  }

  time {
    font: 400 12px/1.45 var(--font-mono);
    color: var(--muted);
  }

  .empty {
    font-size: 13px;
    color: var(--muted);
  }
</style>
