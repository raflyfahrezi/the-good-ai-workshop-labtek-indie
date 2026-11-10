<script>
  /** @type {{ kicker?: string, title: string, lede?: string, children?: import('svelte').Snippet }} */
  let { kicker, title, lede, children } = $props()
</script>

<header class="masthead">
  {#if kicker}<p class="kicker">{kicker}</p>{/if}
  <h2>{title}</h2>
  {#if lede}<p class="lede">{lede}</p>{/if}
  {@render children?.()}
</header>

<style>
  .masthead {
    display: grid;
    gap: 6px;
    padding-bottom: 16px;
    border-bottom: 1.5px solid var(--border);
  }

  .kicker {
    font: 400 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--muted);
  }

  h2 {
    font: 500 40px/1.05 var(--font-display);
    letter-spacing: -0.8px;
  }

  .lede {
    color: var(--muted);
    font-size: 15px;
    max-width: 60ch;
  }

  @media (max-width: 560px) {
    h2 {
      font-size: 32px;
    }
  }
</style>
