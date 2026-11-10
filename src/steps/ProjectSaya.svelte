<script>
  // Project Saya: every project of the journalist. Only the active one opens the workflow; the rest are dummies.
  import { flow, goTo } from '../lib/flow.svelte.js'
  import { projectList, statusFilters } from '../lib/projects.js'
  import PageHeader from '../components/PageHeader.svelte'
  import HumanNote from '../components/HumanNote.svelte'
  import FilterTabs from '../components/FilterTabs.svelte'
  import ProjectCard from '../components/projects/ProjectCard.svelte'

  let filter = $state('semua')

  let projects = $derived(projectList())
  let filters = $derived(statusFilters.map((f) => ({ ...f, count: projects.filter((p) => f.match(p.status)).length })))
  let shown = $derived(projects.filter((p) => statusFilters.find((f) => f.id === filter).match(p.status)))
</script>

<div class="page">
  <PageHeader
    kicker="Project Saya"
    title="Liputan yang sedang diolah"
    lede="Setiap liputan menjadi satu project. Lihat sampai langkah mana konten turunannya, dan keputusan apa yang menunggu Anda."
  />

  <HumanNote>
    Catatan di setiap kartu adalah keputusan berikutnya untuk jurnalis. Hanya jurnalis yang bisa memindahkan project ke
    <strong>Disetujui</strong>.
  </HumanNote>

  <div class="toolbar">
    <FilterTabs label="Saring berdasarkan status" {filters} bind:value={filter} />
    <button disabled title="Di demo hanya ada satu project yang bisa dibuka">+ Project liputan baru</button>
  </div>

  {#if shown.length}
    <div class="grid">
      {#each shown as project (project.id)}
        <ProjectCard {project} onOpen={() => goTo(flow.step)} />
      {/each}
    </div>
  {:else}
    <p class="empty">Tidak ada project dengan status ini.</p>
  {/if}
</div>

<style>
  .page {
    max-width: 1080px;
    display: grid;
    gap: 20px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 16px;
  }

  .empty {
    border: 1.5px dashed var(--border);
    padding: 24px;
    text-align: center;
    color: var(--muted);
  }
</style>
