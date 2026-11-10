<script>
  // Sticky Kembali / Lanjut bar. blocked says why the journalist cannot continue yet.
  /** @type {{ canBack: boolean, onback: () => void, onnext?: () => void, nextLabel: string, blocked: string | null, isLast: boolean }} */
  let { canBack, onback, onnext, nextLabel, blocked, isLast } = $props()
</script>

<footer>
  <button onclick={onback} disabled={!canBack}>← Kembali</button>
  <div class="next">
    {#if blocked}<span class="blocked" role="status">{blocked}</span>{/if}
    {#if !isLast}
      <button class="primary" disabled={!!blocked} onclick={onnext}>{nextLabel}</button>
    {/if}
  </div>
</footer>

<style>
  footer {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 22px;
    background: var(--bg);
    border-top: 1.5px solid var(--border);
  }

  .next {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .blocked {
    font-size: 12px;
    color: var(--kuning);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .blocked::before {
    content: '';
    width: 7px;
    height: 7px;
    flex: none;
    background: var(--kuning);
  }

  button {
    flex: none;
    white-space: nowrap;
  }

  .primary {
    padding: 8px 16px;
  }

  @media (max-width: 720px) {
    footer {
      padding: 10px 14px;
    }
  }
</style>
