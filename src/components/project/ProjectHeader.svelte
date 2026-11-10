<script>
  import StatusChip from '../../lib/StatusChip.svelte'
  import { hrefFor } from '../../lib/router.js'

  /** @type {{ title: string, desk: string, deadline: string, status: string }} */
  let { title, desk, deadline, status } = $props()
</script>

<div class="head">
  <div class="text">
    <p class="kicker">
      <a href={hrefFor('projects')}>Project Saya</a> / {desk} · Tenggat {deadline}
    </p>
    <h1>{title}</h1>
  </div>
  <StatusChip {status} />
</div>

<style>
  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .text {
    display: grid;
    gap: 4px;
  }

  .kicker {
    font: 400 11px/1.3 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--muted);
  }

  a {
    color: inherit;
  }

  a:hover {
    color: var(--text);
  }

  h1 {
    font: 600 22px/1.2 var(--font-display);
    letter-spacing: -0.2px;
  }
</style>
