<script>
  // Live view of where each item is processed. The lane follows the journalist's label, never the AI.
  import { cardId } from '../../lib/bank.js'

  /** @type {{ routing: { cloud: string[], local: string[], unlabelled: string[] } }} */
  let { routing } = $props()

  let lanes = $derived([
    { id: 'cloud', title: 'AI cloud', hint: 'Bahan Publik. Boleh diproses model besar.', ids: routing.cloud },
    { id: 'local', title: 'Model lokal', hint: 'Bahan Sensitif. Tidak keluar dari komputer redaksi.', ids: routing.local },
    ...(routing.unlabelled.length
      ? [{ id: 'wait', title: 'Menunggu label', hint: 'Belum diproses AI sama sekali.', ids: routing.unlabelled }]
      : []),
  ])

  function show(id) {
    const el = document.getElementById(cardId(id))
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('flash')
    setTimeout(() => el.classList.remove('flash'), 1200)
  }
</script>

<section class="board" aria-label="Jalur pemrosesan bahan">
  <h3>Jalur pemrosesan</h3>
  {#each lanes as lane (lane.id)}
    <div class="lane {lane.id}">
      <div class="head">
        <strong>{lane.title}</strong>
        <span class="count">{lane.ids.length}</span>
      </div>
      <p class="hint">{lane.hint}</p>
      <div class="tags">
        {#each lane.ids as id (id)}
          <button class="tag" onclick={() => show(id)} title="Lihat {id}">{id}</button>
        {:else}
          <span class="none">Belum ada bahan.</span>
        {/each}
      </div>
    </div>
  {/each}
</section>

<style>
  .board {
    border: 1.5px solid var(--border);
    background: var(--card);
  }

  h3 {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 12px 14px;
    border-bottom: 1.5px solid var(--border);
  }

  .lane {
    padding: 12px 14px;
    border-left: 6px solid var(--hijau);
    display: grid;
    gap: 4px;
  }

  .lane + .lane {
    border-top: 1px solid var(--fl);
  }

  .lane.local {
    border-left-color: var(--merah);
  }

  .lane.wait {
    border-left-color: var(--kuning);
    background: var(--kuning-bg);
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 13px;
  }

  .count {
    font: 500 22px/1 var(--font-display);
  }

  .hint {
    font-size: 12px;
    color: var(--muted);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
  }

  .tag {
    font: 600 11px/1 var(--font-mono);
    padding: 4px 6px;
    animation: pop 0.25s ease-out both;
  }

  @keyframes pop {
    from {
      transform: scale(0.85);
      opacity: 0;
    }
  }

  .none {
    font-size: 12px;
    color: var(--muted);
  }

  @media (prefers-reduced-motion: reduce) {
    .tag {
      animation: none;
    }
  }
</style>
