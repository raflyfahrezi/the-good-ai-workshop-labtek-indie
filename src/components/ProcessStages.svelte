<script>
  // Fake AI processing of an upload, one stage at a time
  /** @type {{ stages: string[], current: number }} */
  let { stages, current } = $props()
</script>

<ol class="stages" aria-live="polite">
  {#each stages as label, i (i)}
    <li class={i < current ? 'done' : i === current ? 'now' : 'todo'}>
      <span class="mark" aria-hidden="true">{i < current ? '✓' : i === current ? '›' : '·'}</span>
      {label}
    </li>
  {/each}
</ol>

<style>
  .stages {
    list-style: none;
    margin: 0;
    padding: 8px 10px;
    display: grid;
    gap: 3px;
    background: var(--bg);
    border: 1px solid var(--fl);
    font-size: 12px;
  }

  li {
    display: flex;
    gap: 8px;
    color: var(--muted);
  }

  .mark {
    font-family: var(--font-mono);
    width: 10px;
  }

  .done {
    color: var(--hijau);
  }

  .now {
    color: var(--text);
    font-weight: 600;
  }

  .now .mark {
    animation: blink 0.9s steps(2) infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0.2;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .now .mark {
      animation: none;
    }
  }
</style>
