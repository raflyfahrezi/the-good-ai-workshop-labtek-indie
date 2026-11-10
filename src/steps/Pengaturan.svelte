<script>
  // The theme switch is the one live setting: useful on a projector. Not saved, like the rest of the demo.
  let theme = $state(document.documentElement.dataset.theme ?? 'sistem')

  function setTheme(value) {
    theme = value
    if (value === 'sistem') delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = value
  }

  const themes = [
    { id: 'sistem', label: 'Ikuti sistem' },
    { id: 'light', label: 'Terang' },
    { id: 'dark', label: 'Gelap' },
  ]
</script>

<div class="screen-head">
  <h2>Pengaturan</h2>
  <p class="muted">Profil, keamanan, preferensi, dan pengelolaan data.</p>
</div>

<div class="grid">
  <section class="card">
    <h3>Profil</h3>
    <div class="ph box">form profil</div>
  </section>
  <section class="card">
    <h3>Keamanan</h3>
    <div class="ph box">password · 2FA</div>
  </section>
  <section class="card">
    <h3>Preferensi</h3>
    <p class="small muted">Tema tampilan</p>
    <div class="seg" role="group" aria-label="Tema">
      {#each themes as t (t.id)}
        <button aria-pressed={theme === t.id} onclick={() => setTheme(t.id)}>{t.label}</button>
      {/each}
    </div>
    <p class="small muted">Bahasa: Bahasa Indonesia</p>
  </section>
  <section class="card">
    <h3>Pengelolaan data</h3>
    <p class="small muted">Retensi data, hapus project, dan perlindungan informasi narasumber.</p>
    <label class="small opt">
      <input type="checkbox" disabled />
      Izinkan data liputan dipakai melatih model AI (opt-in, default mati)
    </label>
  </section>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  section {
    display: grid;
    gap: 8px;
    align-content: start;
  }

  .box {
    height: 50px;
  }

  .seg {
    display: flex;
  }

  .seg button {
    font-size: 12px;
    padding: 4px 10px;
    color: var(--muted);
  }

  .seg button + button {
    margin-left: -1.5px;
  }

  .seg button[aria-pressed='true'] {
    background: var(--fl);
    color: var(--text);
    font-weight: 600;
  }

  .opt {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  @media (max-width: 720px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
