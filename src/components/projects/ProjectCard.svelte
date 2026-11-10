<script>
  import StatusChip from '../../lib/StatusChip.svelte'
  import StepRail from '../StepRail.svelte'

  /** @type {{ project: ReturnType<typeof import('../../lib/projects.js').projectList>[number], onOpen?: () => void }} */
  let { project, onOpen } = $props()

  let current = $derived(project.rail.find((s) => s.state === 'current'))
</script>

<article class="card" class:active={project.active}>
  <header>
    <span class="desk">{project.active ? 'Project aktif' : project.desk}</span>
    <StatusChip status={project.status} />
  </header>

  <h3>{project.title}</h3>

  <dl class="meta">
    <div><dt>Tenggat</dt><dd>{project.deadline}</dd></div>
    <div><dt>Format</dt><dd>{project.formats}</dd></div>
    <div><dt>Diperbarui</dt><dd>{project.updated}</dd></div>
  </dl>

  <div class="progress">
    <StepRail rail={project.rail} compact />
    <p class="step">Langkah {current.id} dari {project.rail.length} · {current.label}</p>
  </div>

  <p class="note">{project.note}</p>

  <footer>
    {#if project.active}
      <button class="primary" onclick={onOpen}>Buka project →</button>
    {:else}
      <span class="demo">Contoh. Tidak bisa dibuka di demo.</span>
    {/if}
  </footer>
</article>

<style>
  .card {
    background: var(--card);
    border: 1.5px solid var(--border);
    padding: 14px 16px 16px;
    display: grid;
    grid-template-rows: auto auto auto auto 1fr auto;
    gap: 12px;
  }

  .active {
    border-top: 5px solid var(--accent);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .desk {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--muted);
  }

  .active .desk {
    color: var(--text);
  }

  h3 {
    font: 600 20px/1.2 var(--font-display);
    letter-spacing: -0.2px;
    text-wrap: balance;
  }

  .meta {
    margin: 0;
    display: grid;
    gap: 3px;
    font-size: 12px;
  }

  .meta div {
    display: grid;
    grid-template-columns: 80px 1fr;
  }

  dt {
    font: 400 11px/1.6 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--muted);
  }

  dd {
    margin: 0;
  }

  .progress {
    display: grid;
    gap: 6px;
  }

  .step {
    font: 400 11px/1.3 var(--font-mono);
    color: var(--muted);
  }

  /* The next human decision on this project */
  .note {
    align-self: start;
    border-left: 3px solid var(--border);
    padding: 2px 0 2px 10px;
    font-size: 13px;
  }

  footer {
    border-top: 1.5px dashed var(--border);
    padding-top: 12px;
  }

  .demo {
    font-size: 12px;
    color: var(--muted);
  }
</style>
