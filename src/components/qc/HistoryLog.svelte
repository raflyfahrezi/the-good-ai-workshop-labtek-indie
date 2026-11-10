<script>
  // Every version and decision so far, newest first, as a timeline
  /** @type {{ entries: { at: string, text: string }[] }} */
  let { entries } = $props()
</script>

<section class="log" aria-label="Riwayat versi dan revisi">
  <p class="kicker">Riwayat versi & revisi <span>{entries.length}</span></p>
  {#if entries.length}
    <ol>
      {#each entries as e, i (i)}
        <li class:latest={i === 0}>
          <time>{e.at}</time>
          <span>{e.text}</span>
        </li>
      {/each}
    </ol>
  {:else}
    <p class="empty">Belum ada riwayat.</p>
  {/if}
</section>

<style>
  .log {
    display: grid;
    gap: 10px;
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

  ol {
    list-style: none;
    margin: 0;
    padding: 0 0 0 14px;
    border-left: 1.5px solid var(--border);
    display: grid;
    gap: 10px;
    max-height: 300px;
    overflow: auto;
  }

  li {
    position: relative;
    display: grid;
    gap: 2px;
    font-size: 12.5px;
  }

  li::before {
    content: '';
    position: absolute;
    left: -19px;
    top: 3px;
    width: 7px;
    height: 7px;
    background: var(--bg);
    border: 1.5px solid var(--border);
  }

  li.latest::before {
    background: var(--text);
    border-color: var(--text);
  }

  time {
    font: 400 10px/1 var(--font-mono);
    color: var(--muted);
  }

  .empty {
    font-size: 12px;
    color: var(--muted);
  }
</style>
