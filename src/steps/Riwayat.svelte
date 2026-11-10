<script>
  import { contentHistory, story } from '../lib/data.js'
  import { flow } from '../lib/flow.svelte.js'
  import StatusChip from '../lib/StatusChip.svelte'

  // Exports from this session come first, then the dummy history of other projects
  let rows = $derived([
    ...flow.exports.map((e) => ({
      content: `${story.title}, Image Slides v${e.version}`,
      format: e.files.join(', '),
      status: 'Diekspor',
      date: `Hari ini, ${e.at}`,
    })),
    ...contentHistory,
  ])
</script>

<div class="screen-head">
  <h2>Riwayat Konten</h2>
  <p class="muted">Semua konten turunan yang pernah diekspor, beserta statusnya.</p>
</div>

<div class="table-wrap">
  <table>
    <thead>
      <tr><th>Konten</th><th>Format</th><th>Status</th><th>Tanggal</th></tr>
    </thead>
    <tbody>
      {#each rows as r, i (i)}
        <tr>
          <td>{r.content}</td>
          <td>{r.format}</td>
          <td>
            <StatusChip status={r.status} />
            {#if r.status === 'Gagal'}<button class="retry" disabled title="Simulasi">Coba lagi</button>{/if}
          </td>
          <td>{r.date}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-wrap {
    overflow-x: auto;
    background: var(--card);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid var(--border);
    padding: 6px;
    text-align: left;
    font-size: 13px;
  }

  .retry {
    margin-left: 6px;
    font-size: 12px;
    padding: 2px 8px;
  }
</style>
