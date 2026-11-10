<script>
  // Human-in-the-loop callout: every screen shows where the journalist checks or decides
  /** @type {{ label?: string, children: import('svelte').Snippet }} */
  let { label = 'Keputusan jurnalis', children } = $props()
</script>

<aside class="human-note">
  <span class="tag">{label}</span>
  <p>{@render children()}</p>
</aside>

<style>
  .human-note {
    display: flex;
    align-items: baseline;
    gap: 12px;
    border: 1.5px dashed var(--border);
    padding: 10px 14px;
    font-size: 13px;
  }

  .tag {
    flex: none;
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    background: var(--accent);
    color: var(--on-solid);
    padding: 4px 6px;
  }

  @media (max-width: 560px) {
    .human-note {
      flex-direction: column;
      gap: 6px;
    }
  }
</style>
