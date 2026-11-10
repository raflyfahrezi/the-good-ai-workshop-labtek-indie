<script>
  // Dummy drop zone: each click adds the next fictional sample from data.js
  /** @type {{ next: { id: string, label: string } | null, onupload: () => void }} */
  let { next, onupload } = $props()
</script>

<section class="drop">
  <div class="text">
    <h3>Seret berkas ke sini</h3>
    <p>Video, foto, audio wawancara, PDF. Di demo ini, berkas contoh fiktif yang ditambahkan.</p>
  </div>
  <button class="primary" disabled={!next} onclick={onupload}>
    {#if next}Unggah bahan <span class="id">{next.id}</span>{:else}Semua contoh sudah diunggah{/if}
  </button>
</section>

<style>
  .drop {
    display: grid;
    gap: 12px;
    padding: 16px;
    border: 2px dashed var(--border);
    background: repeating-linear-gradient(135deg, transparent 0 10px, var(--fl) 10px 11px);
  }

  h3 {
    font: 600 17px/1.2 var(--font-display);
  }

  p {
    font-size: 12px;
    color: var(--muted);
    margin-top: 2px;
  }

  button {
    justify-self: start;
    padding: 8px 14px;
  }

  .id {
    font: 600 12px/1 var(--font-mono);
    margin-left: 4px;
  }
</style>
