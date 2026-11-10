<script>
  import StatusChip from '../../lib/StatusChip.svelte'

  /** @type {{ projects: { title: string, formats: string, updated: string, status: string }[] }} */
  let { projects } = $props()
</script>

<section>
  <h3>Project lain</h3>
  <div class="wrap">
    <table>
      <thead>
        <tr><th>Project</th><th>Format</th><th>Diperbarui</th><th>Status</th></tr>
      </thead>
      <tbody>
        {#each projects as p (p.title)}
          <tr>
            <td class="title">{p.title}</td>
            <td>{p.formats}</td>
            <td class="date">{p.updated}</td>
            <td><StatusChip status={p.status} /></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  section {
    display: grid;
    gap: 10px;
  }

  h3 {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .wrap {
    overflow-x: auto;
    background: var(--card);
    border: 1.5px solid var(--border);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  th {
    font: 400 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
    text-align: left;
    padding: 10px 14px;
    border-bottom: 1.5px solid var(--border);
  }

  td {
    padding: 11px 14px;
    border-top: 1px solid var(--fl);
    white-space: nowrap;
  }

  .title {
    font: 500 16px/1.3 var(--font-display);
    white-space: normal;
    min-width: 220px;
  }

  .date {
    font-family: var(--font-mono);
    font-size: 12px;
  }

  tbody tr:hover {
    background: var(--bg);
  }
</style>
