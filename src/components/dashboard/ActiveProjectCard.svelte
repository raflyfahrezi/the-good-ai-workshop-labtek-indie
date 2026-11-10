<script>
  import StatusChip from '../../lib/StatusChip.svelte'

  /** @type {{ project: ReturnType<typeof import('../../lib/dashboard.js').activeProject>, onContinue: () => void }} */
  let { project, onContinue } = $props()
</script>

<article class="lead">
  <header>
    <span class="kicker">Project aktif</span>
    <StatusChip status={project.status} />
  </header>

  <h3>{project.title}</h3>
  <p class="meta">Tenggat {project.deadline}</p>

  <ol class="progress" aria-label="Progres alur kerja">
    {#each project.steps as step (step.id)}
      <li class={step.state} aria-current={step.state === 'current' ? 'step' : undefined}>
        <span class="num">{step.id}</span>
        <span class="label">{step.label}</span>
      </li>
    {/each}
  </ol>

  <footer>
    <div class="where">
      <p>
        Langkah terakhir: <strong>{project.current.label}</strong>
        {#if project.openLines > 0}<span class="todo">· {project.openLines} paragraf script belum dicek</span>{/if}
      </p>
      {#if project.lastActivity}
        <p class="last">{project.lastActivity.at} · {project.lastActivity.text}</p>
      {/if}
    </div>
    <button class="primary" onclick={onContinue}>Lanjutkan project →</button>
  </footer>
</article>

<style>
  .lead {
    background: var(--card);
    border: 1.5px solid var(--border);
    border-top: 5px solid var(--accent);
    padding: 16px 18px 18px;
    display: grid;
    gap: 10px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .kicker {
    font: 600 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  h3 {
    font: 600 26px/1.15 var(--font-display);
    letter-spacing: -0.3px;
    max-width: 30ch;
    text-wrap: balance;
  }

  .meta {
    font: 400 12px/1.4 var(--font-mono);
    color: var(--muted);
  }

  /* Six workflow steps as one segmented rail */
  .progress {
    list-style: none;
    margin: 6px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 4px;
  }

  .progress li {
    border-top: 4px solid var(--fl);
    padding-top: 6px;
    display: grid;
    gap: 2px;
    color: var(--muted);
  }

  .progress li.done {
    border-top-color: var(--muted);
  }

  .progress li.current {
    border-top-color: var(--accent);
    color: var(--text);
  }

  .num {
    font: 600 11px/1 var(--font-mono);
  }

  .label {
    font-size: 11px;
    line-height: 1.25;
  }

  footer {
    margin-top: 6px;
    padding-top: 12px;
    border-top: 1.5px dashed var(--border);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
    flex-wrap: wrap;
  }

  .where {
    display: grid;
    gap: 4px;
    font-size: 13px;
  }

  .todo {
    color: var(--kuning);
  }

  .last {
    font-size: 12px;
    color: var(--muted);
  }

  footer button {
    padding: 9px 16px;
  }

  @media (max-width: 560px) {
    .progress {
      grid-template-columns: repeat(3, 1fr);
      row-gap: 10px;
    }
  }
</style>
