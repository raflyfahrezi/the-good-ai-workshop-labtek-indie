<script>
  // Content status from PRD 13.1, in Bahasa Indonesia
  let { status } = $props()

  const tone = {
    Draf: 'neutral',
    Diproses: 'busy',
    'Perlu Review': 'review',
    Revisi: 'review',
    Disetujui: 'ok',
    Diekspor: 'ok',
    Gagal: 'bad',
  }
</script>

<span class="status {tone[status]}">{status}</span>

<style>
  .status {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    padding: 1px 8px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--fl);
    color: var(--text);
    white-space: nowrap;
  }

  .busy {
    border-style: dashed;
  }

  .review {
    background: var(--kuning-bg);
  }

  .ok {
    background: var(--hijau-bg);
  }

  .bad {
    background: var(--merah-bg);
  }
</style>
