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
    padding: 2px 10px;
    border-radius: 999px;
    background: #ececea;
    color: var(--muted);
    white-space: nowrap;
  }

  .busy {
    background: var(--accent-bg);
    color: var(--accent);
  }

  .review {
    background: var(--kuning-bg);
    color: var(--kuning);
  }

  .ok {
    background: var(--hijau-bg);
    color: var(--hijau);
  }

  .bad {
    background: var(--merah-bg);
    color: var(--merah);
  }
</style>
