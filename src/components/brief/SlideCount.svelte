<script>
  // Number of slides, with - and + so it works without typing
  /** @type {{ value: number, min?: number, max?: number }} */
  let { value = $bindable(), min = 3, max = 12 } = $props()

  const clamp = (n) => Math.min(max, Math.max(min, n))
</script>

<div class="count">
  <button aria-label="Kurangi slide" disabled={value <= min} onclick={() => (value = clamp(value - 1))}>−</button>
  <input type="number" {min} {max} bind:value aria-label="Jumlah slide" onchange={() => (value = clamp(value || min))} />
  <button aria-label="Tambah slide" disabled={value >= max} onclick={() => (value = clamp(value + 1))}>+</button>
  <span class="unit">slide</span>
</div>

<style>
  .count {
    display: flex;
    align-items: stretch;
  }

  button {
    width: 34px;
    padding: 0;
    font: 600 15px/1 var(--font-mono);
  }

  input {
    width: 58px;
    margin: 0 -1.5px;
    text-align: center;
    font: 500 18px/1 var(--font-display);
    appearance: textfield;
    -moz-appearance: textfield;
  }

  input::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }

  .unit {
    align-self: center;
    margin-left: 10px;
    font: 400 11px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }
</style>
