<script>
  // Under each slide in step 4: the journalist edits the text directly, or asks the AI to redo this one slide only
  /** @type {{ busy: boolean, editing: boolean, text: string, onedit: () => void, onsave: (text: string) => void, oncancel: () => void, onregenerate: () => void }} */
  let { busy, editing, text, onedit, onsave, oncancel, onregenerate } = $props()

  // Writable derived: starts from the slide text, then follows the journalist's typing
  let draft = $derived(text)
</script>

{#if editing}
  <div class="edit">
    <textarea {@attach (node) => node.focus()} bind:value={draft} aria-label="Teks slide"></textarea>
    <div class="row">
      <button class="primary" disabled={!draft.trim()} onclick={() => onsave(draft.trim())}>Simpan</button>
      <button onclick={oncancel}>Batal</button>
    </div>
  </div>
{:else}
  <div class="row tools">
    <button disabled={busy} onclick={onedit}>Edit teks</button>
    <button disabled={busy} onclick={onregenerate}><span aria-hidden="true">↻</span> Generate ulang</button>
  </div>
{/if}

<style>
  .edit {
    display: grid;
    gap: 6px;
  }

  textarea {
    field-sizing: content;
    min-height: 3lh;
    font: 500 15px/1.35 var(--font-display);
    border-color: var(--text);
  }

  .row {
    display: flex;
    gap: 4px;
  }

  button {
    flex: 1;
    font-size: 12px;
    padding: 5px 8px;
    white-space: nowrap;
  }

  .tools button + button {
    margin-left: -1.5px;
  }
</style>
