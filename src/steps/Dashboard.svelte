<script>
  import { recentProjects, script, story } from '../lib/data.js'
  import { flow, steps, goTo, contentStatus } from '../lib/flow.svelte.js'
  import StatusChip from '../lib/StatusChip.svelte'

  let status = $derived(contentStatus())
  let openLines = $derived(script.filter((l) => !flow.decisions[l.id]).length)
  let progress = $derived(Math.round((flow.furthest / (steps.length - 1)) * 100))
  // North Star metric from the PRD: derivative content approved by the journalist from one story
  let approvedCount = $derived(flow.approved || flow.exported ? 1 : 0)
</script>

<div class="screen-head">
  <h2>Halo, Faris</h2>
  <p class="muted">Semua liputan dan konten turunannya ada di satu tempat. Lanjutkan dari langkah terakhir.</p>
  <p class="human">
    <strong>Keputusan jurnalis:</strong> status konten hanya berubah menjadi Disetujui setelah jurnalis menyetujuinya di
    QC Editorial. AI tidak pernah menyetujui sendiri.
  </p>
</div>

<div class="stats">
  <div class="card stat"><span class="num">{1 + recentProjects.length}</span><span class="small muted">project liputan</span></div>
  <div class="card stat">
    <span class="num">{status === 'Perlu Review' ? 1 : 0}</span><span class="small muted">konten perlu review</span>
  </div>
  <div class="card stat">
    <span class="num">{approvedCount}</span><span class="small muted">konten turunan disetujui dari liputan aktif</span>
  </div>
</div>

<div class="cols">
  <section class="card active">
    <div class="row">
      <span class="small muted">Project aktif</span>
      <StatusChip {status} />
    </div>
    <h3>{story.title}</h3>
    <p class="small muted">Tenggat {story.deadline}</p>

    <div class="bar"><span style:width="{progress}%"></span></div>
    <p class="small">
      Langkah terakhir: <strong>{steps[flow.step].id} · {steps[flow.step].label}</strong>
      {#if flow.furthest >= 3 && openLines > 0}· {openLines} baris script belum dicek{/if}
    </p>
    {#if flow.history[0]}
      <p class="small muted">Terakhir: {flow.history[0].text} ({flow.history[0].at})</p>
    {/if}

    <div class="actions">
      <button class="primary" onclick={() => goTo(flow.step)}>Lanjutkan project →</button>
      <button onclick={() => goTo(0)}>Unggah bahan</button>
      <button disabled title="Di demo hanya ada satu project">+ Project baru</button>
    </div>
  </section>

  <section class="card">
    <h3>Aktivitas terakhir</h3>
    {#each flow.history.slice(0, 6) as entry, i (i)}
      <p class="small entry"><span class="muted">{entry.at}</span> {entry.text}</p>
    {:else}
      <p class="small muted">Belum ada aktivitas di sesi ini.</p>
    {/each}
  </section>
</div>

<h3 class="recent-title">Project lain</h3>
<div class="table-wrap">
  <table>
    <thead>
      <tr><th>Project</th><th>Format</th><th>Diperbarui</th><th>Status</th></tr>
    </thead>
    <tbody>
      {#each recentProjects as p (p.title)}
        <tr>
          <td>{p.title}</td>
          <td>{p.formats}</td>
          <td>{p.updated}</td>
          <td><StatusChip status={p.status} /></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .stat {
    display: grid;
  }

  .stat .num {
    font-size: 28px;
    font-weight: 700;
  }

  .cols {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 16px;
    align-items: start;
  }

  section {
    display: grid;
    gap: 8px;
  }

  .active {
    border-color: var(--accent);
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .bar {
    height: 6px;
    background: #ececea;
    border-radius: 3px;
    overflow: hidden;
  }

  .bar span {
    display: block;
    height: 100%;
    background: var(--accent);
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .entry {
    border-bottom: 1px solid var(--border);
    padding-bottom: 6px;
  }

  .recent-title {
    margin: 24px 0 10px;
  }

  .table-wrap {
    overflow-x: auto;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  th,
  td {
    text-align: left;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
  }

  th {
    background: #f1f1ee;
    font-size: 13px;
  }

  @media (max-width: 760px) {
    .stats,
    .cols {
      grid-template-columns: 1fr;
    }
  }
</style>
