<script>
  // The journalist rewrites one paragraph in their own words. Starts from the current text.
  /** @type {{ initial: string, onsave: (text: string) => void, oncancel: () => void }} */
  let { initial, onsave, oncancel } = $props()

  // Writable derived: starts from the paragraph text, then follows the journalist's typing
  let draft = $derived(initial)
</script>

<div class="editor">
  <textarea {@attach (node) => node.focus()} bind:value={draft} aria-label="Teks paragraf"></textarea>
  <div class="actions">
    <button class="primary" disabled={!draft.trim()} onclick={() => onsave(draft)}>Simpan perubahan</button>
    <button onclick={oncancel}>Batal</button>
    <span class="hint">Teks Anda menggantikan versi AI. Sumbernya tetap sama.</span>
  </div>
</div>

<style>
  .editor {
    display: grid;
    gap: 6px;
  }

  textarea {
    field-sizing: content;
    min-height: 3lh;
    font: inherit;
    border: 1.5px solid var(--text);
    background: var(--bg);
    padding: 6px 8px;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    font: 400 13px/1.3 var(--font-ui);
  }

  .hint {
    font-size: 12px;
    color: var(--muted);
  }
</style>
