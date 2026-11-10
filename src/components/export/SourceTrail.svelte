<script>
  // Jejak Sumber: every line the AI wrote, its sources, the machine's audit and the journalist's decision.
  // The editor reads this instead of re-checking everything from scratch.
  import { story } from '../../lib/data.js'
  import { decisionLabel } from '../../lib/flow.svelte.js'
  import { auditMark } from '../../lib/script.js'

  /** @type {{ rows: any[] }} */
  let { rows } = $props()
</script>

<section class="trail" aria-label="Jejak Sumber">
  <header>
    <div>
      <p class="kicker">Jejak Sumber</p>
      <p class="sub">Untuk editor: setiap baris yang ditulis AI, sumbernya, hasil audit dan keputusan jurnalis.</p>
    </div>
    <span class="by">Diputuskan oleh {story.author}</span>
  </header>

  <div class="wrap">
    <table>
      <thead>
        <tr>
          <th scope="col">Slide</th>
          <th scope="col">Teks akhir</th>
          <th scope="col">Sumber</th>
          <th scope="col">Audit AI</th>
          <th scope="col">Keputusan</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as r (r.id)}
          <tr class:discarded={r.decision === 'buang'}>
            <td class="n">{r.slide ? `¶${r.slide}` : '·'}</td>
            <td>
              <span class="text">{r.text}</span>
              {#if r.decision === 'ubah'}<span class="ai"><b>Versi AI</b> {r.aiText}</span>{/if}
            </td>
            <td class="src">
              {#each r.sources as id (id)}<span class="id">{id}</span>{:else}<span class="none">tanpa sumber</span>{/each}
            </td>
            <td><span class="code {r.audit}">{auditMark[r.audit].code}</span> {auditMark[r.audit].label}</td>
            <td>
              {#if r.decision}<span class="stamp {r.decision}">{decisionLabel[r.decision]}</span>{/if}
              {#if r.decision === 'setuju' && r.audit === 'merah'}<span class="stamp risk">Tanpa sumber</span>{/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  .trail {
    display: grid;
    gap: 12px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 16px;
    flex-wrap: wrap;
    padding-bottom: 8px;
    border-bottom: 1.5px solid var(--border);
  }

  .kicker {
    font: 500 22px/1.1 var(--font-display);
  }

  .sub {
    font-size: 13px;
    color: var(--muted);
  }

  .by {
    font: 400 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }

  .wrap {
    overflow-x: auto;
    background: var(--card);
    border: 1.5px solid var(--border);
  }

  table {
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
  }

  th {
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    text-align: left;
    padding: 10px;
    background: var(--fl);
    border-bottom: 1.5px solid var(--border);
  }

  td {
    vertical-align: top;
    padding: 10px;
    border-bottom: 1px dashed var(--border);
    font-size: 12.5px;
  }

  tr:last-child td {
    border-bottom: 0;
  }

  .n {
    font: 600 11px/1.6 var(--font-mono);
    color: var(--muted);
    white-space: nowrap;
  }

  .text {
    font: 400 15px/1.4 var(--font-display);
  }

  .discarded .text {
    text-decoration: line-through var(--merah);
    color: var(--muted);
  }

  .ai {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--muted);
    text-decoration: line-through;
  }

  .ai b {
    font: 600 9px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 4px;
    text-decoration: none;
    display: inline-block;
  }

  .src {
    white-space: nowrap;
  }

  .id,
  .none {
    display: inline-block;
    font: 600 10px/1 var(--font-mono);
    padding: 3px 5px;
    margin: 0 3px 3px 0;
    border: 1px solid var(--border);
  }

  .none {
    color: var(--merah);
    border-color: var(--merah);
    background: var(--merah-bg);
  }

  .code {
    font: 600 9px/1 var(--font-mono);
    padding: 2px 4px;
    border: 1px solid currentColor;
    margin-right: 4px;
  }

  .code.hijau {
    color: var(--hijau);
  }
  .code.kuning {
    color: var(--kuning);
    background: var(--kuning-bg);
  }
  .code.merah {
    color: var(--on-solid);
    background: var(--merah);
    border-color: var(--merah);
  }

  /* Same rubber stamps as step 3, so the decision reads the same everywhere */
  .stamp {
    display: inline-block;
    margin: 0 4px 4px 0;
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding: 3px 6px;
    border: 1.5px solid currentColor;
    transform: rotate(-2deg);
    white-space: nowrap;
  }

  .stamp.setuju {
    color: var(--hijau);
  }
  .stamp.ubah {
    color: var(--kuning);
  }
  .stamp.buang {
    color: var(--merah);
  }
  .stamp.risk {
    color: var(--on-solid);
    background: var(--merah);
    border-color: var(--merah);
  }
</style>
