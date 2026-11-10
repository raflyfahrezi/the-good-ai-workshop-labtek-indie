<script>
  // One item in the bank: its ID, the journalist's sensitivity label and the AI processing state
  import { flow, retryUpload, setSensitivity } from '../../lib/flow.svelte.js'
  import { cardId, itemStatus, statusLabel, typeLabel } from '../../lib/bank.js'
  import SensitivityToggle from './SensitivityToggle.svelte'
  import ProcessStages from '../ProcessStages.svelte'
  import PartList from './PartList.svelte'

  /** @type {{ item: any }} */
  let { item } = $props()

  let level = $derived(flow.sensitivity[item.id])
  let status = $derived(itemStatus(item))
</script>

<article class="source {status === 'gagal' ? 'failed' : (level ?? 'unset')}" id={cardId(item.id)}>
  <header>
    <span class="id">{item.id}</span>
    <span class="meta">
      {typeLabel[item.type]}
      <span class="state {status}">{statusLabel[status]}</span>
      {#if item.status}<span class="fresh">baru diunggah</span>{/if}
    </span>
    {#if status !== 'gagal'}
      <SensitivityToggle {level} onchange={(l) => setSensitivity(item.id, l)} />
    {/if}
  </header>

  <h4>{item.label}</h4>
  <p class="credit">{item.credit}</p>

  {#if status === 'gagal'}
    <div class="alert bad">
      <span>Unggahan gagal: koneksi terputus (simulasi). Berkas asli Anda tidak berubah.</span>
      <button onclick={() => retryUpload(item.id)}>Coba lagi</button>
    </div>
  {:else if status === 'label'}
    <p class="alert ask">Belum dilabel. Pilih Publik atau Sensitif. AI baru memproses bahan ini setelah Anda memilih.</p>
  {:else if status === 'proses'}
    <ProcessStages stages={item.stages} current={item.stage} />
  {:else}
    {#if level === 'sensitif'}
      <p class="local">Model lokal. Tidak dikirim ke AI cloud.</p>
    {/if}
    {#if item.parts}<PartList {item} />{/if}
  {/if}
</article>

<style>
  .source {
    background: var(--card);
    border: 1.5px solid var(--border);
    border-left: 6px solid var(--hijau);
    padding: 12px 14px 14px;
    display: grid;
    gap: 6px;
    scroll-margin-top: 16px;
    animation: rise 0.3s ease-out both;
  }

  .source.sensitif {
    border-left-color: var(--merah);
  }

  .source.unset {
    border-left-color: var(--kuning);
    background: var(--kuning-bg);
  }

  .source.failed {
    border-left-color: var(--merah);
    border-style: dashed;
  }

  /* Highlight when the routing board scrolls to this card */
  .source:global(.flash) {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
  }

  header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .id {
    font: 600 12px/1 var(--font-mono);
    padding: 4px 6px;
    background: var(--text);
    color: var(--bg);
    letter-spacing: 0.3px;
  }

  .meta {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font: 400 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--muted);
  }

  .state {
    color: var(--hijau);
  }

  .state.label,
  .state.proses {
    color: var(--kuning);
  }

  .state.gagal {
    color: var(--merah);
  }

  .fresh {
    color: var(--text);
    border: 1px solid var(--border);
    padding: 2px 4px;
  }

  h4 {
    margin: 4px 0 0;
    font: 600 17px/1.25 var(--font-display);
  }

  .credit {
    font-size: 12px;
    color: var(--muted);
  }

  .alert {
    font-size: 12px;
    font-weight: 600;
  }

  .ask {
    color: var(--kuning);
  }

  .bad {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    color: var(--merah);
  }

  .local {
    font: 600 11px/1.4 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--merah);
  }

  @media (prefers-reduced-motion: reduce) {
    .source {
      animation: none;
    }
  }

  @media (max-width: 560px) {
    header {
      flex-wrap: wrap;
    }
  }
</style>
