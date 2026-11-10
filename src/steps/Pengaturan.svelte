<script>
  // Pengaturan: a settings sheet. Only the theme switch works; the rest shows what a real product would offer.
  import { story } from '../lib/data.js'
  import { applyTheme, currentTheme, themes } from '../lib/theme.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import SettingsSection from '../components/settings/SettingsSection.svelte'

  let theme = $state(currentTheme())

  function setTheme(id) {
    theme = id
    applyTheme(id)
  }
</script>

<div class="page">
  <PageHeader kicker="Akun" title="Pengaturan" lede="Profil, keamanan, preferensi tampilan dan pengelolaan data liputan." />

  <HumanNote>
    Data liputan milik redaksi, bukan milik AI. Izin memakai data untuk melatih model selalu mati, kecuali jurnalis
    sendiri yang menyalakannya.
  </HumanNote>

  <div class="sheet">
    <SettingsSection title="Profil" desc="Nama ini muncul di credit dan Jejak Sumber setiap ekspor.">
      <dl class="fields">
        <div><dt>Nama</dt><dd>{story.author}</dd></div>
        <div><dt>Redaksi</dt><dd>{story.newsroom}</dd></div>
        <div><dt>Desk</dt><dd>{story.desk}</dd></div>
      </dl>
    </SettingsSection>

    <SettingsSection title="Keamanan" desc="Akses ke bahan sensitif butuh login yang kuat.">
      <dl class="fields">
        <div><dt>Kata sandi</dt><dd class="unset">••••••••</dd></div>
        <div><dt>Verifikasi dua langkah</dt><dd class="unset">Belum diatur</dd></div>
      </dl>
    </SettingsSection>

    <SettingsSection title="Tampilan" desc="Pilih Terang saat demo di proyektor." live>
      <div class="seg" role="group" aria-label="Tema tampilan">
        {#each themes as t (t.id)}
          <button aria-pressed={theme === t.id} onclick={() => setTheme(t.id)}>{t.label}</button>
        {/each}
      </div>
      <p class="small">Bahasa antarmuka: Bahasa Indonesia</p>
    </SettingsSection>

    <SettingsSection title="Pengelolaan data" desc="Ke mana bahan liputan boleh pergi.">
      <ul class="rules">
        <li><span class="k publik">Publik</span> Boleh diproses model AI di cloud.</li>
        <li><span class="k sensitif">Sensitif</span> Hanya model lokal, tidak keluar dari komputer redaksi.</li>
      </ul>
      <label class="optin">
        <input type="checkbox" disabled />
        <span class="switch" aria-hidden="true"></span>
        <span>
          <strong>Izinkan data liputan dipakai melatih model AI</strong>
          <span class="small">Opt-in. Bawaan: mati.</span>
        </span>
      </label>
      <p class="small">Retensi data dan hapus project belum ada di demo lo-fi.</p>
    </SettingsSection>
  </div>
</div>

<style>
  .page {
    max-width: 980px;
    display: grid;
    gap: 20px;
  }

  .sheet {
    border-top: 1.5px solid var(--border);
  }

  .fields {
    margin: 0;
    display: grid;
    border: 1.5px solid var(--border);
    background: var(--card);
  }

  .fields div {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 12px;
    padding: 10px 12px;
  }

  .fields div + div {
    border-top: 1px dashed var(--border);
  }

  dt {
    font: 400 10px/1.6 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--muted);
  }

  dd {
    margin: 0;
    font: 400 15px/1.35 var(--font-display);
  }

  dd.unset {
    color: var(--muted);
  }

  .seg {
    display: flex;
  }

  .seg button {
    padding: 8px 14px;
    color: var(--muted);
  }

  .seg button + button {
    margin-left: -1.5px;
  }

  .seg button[aria-pressed='true'] {
    position: relative;
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-solid);
    font-weight: 600;
  }

  .small {
    font-size: 12px;
    color: var(--muted);
  }

  .rules {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;
    font-size: 13px;
  }

  .k {
    display: inline-block;
    min-width: 66px;
    margin-right: 6px;
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 4px 6px;
    border: 1px solid currentColor;
  }

  .k.publik {
    color: var(--hijau);
    background: var(--hijau-bg);
  }

  .k.sensitif {
    color: var(--merah);
    background: var(--merah-bg);
  }

  .optin {
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1.5px dashed var(--border);
    padding: 10px 12px;
    cursor: not-allowed;
  }

  .optin input {
    position: absolute;
    opacity: 0;
  }

  .optin > span:last-child {
    display: grid;
    gap: 2px;
    font-size: 13px;
  }

  /* An "off" switch, drawn rather than native, so its default state is obvious from across the room */
  .switch {
    flex: none;
    position: relative;
    width: 38px;
    height: 20px;
    border: 1.5px solid var(--border);
    background: var(--fl);
  }

  .switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 13px;
    height: 13px;
    background: var(--muted);
  }

  @media (max-width: 560px) {
    .fields div {
      grid-template-columns: 1fr;
      gap: 2px;
    }
  }
</style>
