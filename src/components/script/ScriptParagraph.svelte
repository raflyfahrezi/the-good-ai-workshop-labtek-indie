<script>
  // One paragraph of the script on the proof page. The margin carries the slide number and the machine's audit mark;
  // the highlight colour is the cited document; the stamp at the end is the journalist's decision.
  import { decisionLabel, flow } from '../../lib/flow.svelte.js'
  import { auditMark, docColor, docOf, textOf } from '../../lib/script.js'
  import ParagraphEditor from './ParagraphEditor.svelte'

  /**
   * @type {{
   *   line: any, selected: boolean, editing: boolean,
   *   onselect: (source?: string | null) => void, onsave: (text: string) => void, oncancel: () => void
   * }}
   */
  let { line, selected, editing, onselect, onsave, oncancel } = $props()

  let decision = $derived(flow.decisions[line.id])
  let edited = $derived(!!flow.edits[line.id])
  let primary = $derived(docOf(line.sources[0]))
  let tint = $derived(primary && line.audit !== 'merah' && decision !== 'buang' ? docColor(primary.id) : null)

  function onkey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onselect()
    }
  }
</script>

<div class="para {line.audit}" class:selected class:discarded={decision === 'buang'} data-line={line.id}>
  <span class="margin" aria-hidden="true">
    <span class="slide">¶{line.slide}</span>
    <span class="code">{auditMark[line.audit].code}</span>
  </span>

  {#if editing}
    <ParagraphEditor initial={textOf(line)} {onsave} {oncancel} />
  {:else}
    <p class="text">
      <span
        class="mark"
        class:edited
        style:background={tint}
        role="button"
        tabindex="0"
        aria-label="Paragraf {line.slide}: {textOf(line)}"
        onclick={() => onselect()}
        onkeydown={onkey}>{textOf(line)}</span
      >{#each line.sources as id (id)}<sup
          ><button class="ref" style:background={docColor(docOf(id).id)} onclick={() => onselect(id)}>{id}</button></sup
        >{:else}<sup><span class="ref none">tanpa sumber</span></sup>{/each}
      {#if decision}<span class="stamp {decision}">{decisionLabel[decision]}</span>{/if}
      {#if decision === 'setuju' && line.audit === 'merah'}<span class="stamp risk">Tanpa sumber</span>{/if}
    </p>
  {/if}
</div>

<style>
  .para {
    position: relative;
    padding: 6px 10px 6px 0;
    margin-bottom: 10px;
    scroll-margin: 120px 0 90px;
  }

  /* The selected paragraph gets a bracket in the margin, like a proofreader's mark */
  .para::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 4px;
    bottom: 4px;
    width: 6px;
    border: 2px solid transparent;
    border-right: 0;
    transition: border-color 0.15s;
  }

  .para.selected::before {
    border-color: var(--text);
  }

  .margin {
    position: absolute;
    left: -76px;
    top: 9px;
    width: 44px;
    display: grid;
    justify-items: end;
    gap: 4px;
  }

  .slide {
    font: 600 11px/1 var(--font-mono);
    color: var(--muted);
  }

  .code {
    font: 600 9px/1 var(--font-mono);
    padding: 2px 4px;
    border: 1px solid currentColor;
  }

  .hijau .code {
    color: var(--hijau);
  }
  .kuning .code {
    color: var(--kuning);
    background: var(--kuning-bg);
  }
  .merah .code {
    color: var(--on-solid);
    background: var(--merah);
    border-color: var(--merah);
  }

  .text {
    margin: 0;
  }

  .mark {
    cursor: pointer;
    padding: 1px 2px;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }

  .mark:hover {
    box-shadow: inset 0 -2px 0 var(--text);
  }

  .mark:focus-visible {
    outline: 2px solid var(--text);
  }

  .kuning .mark {
    text-decoration: underline wavy var(--kuning);
    text-underline-offset: 5px;
  }

  .merah .mark {
    text-decoration: underline wavy var(--merah);
    text-underline-offset: 5px;
  }

  .mark.edited {
    border-bottom: 1.5px dashed var(--text);
  }

  .discarded .mark {
    text-decoration: line-through var(--merah);
    color: var(--muted);
  }

  sup {
    line-height: 0;
  }

  .ref {
    font: 600 10px/1 var(--font-mono);
    padding: 2px 4px;
    margin-left: 3px;
    border: 1px solid var(--border);
    color: var(--text);
  }

  .ref.none {
    display: inline-block;
    background: var(--merah-bg);
    color: var(--merah);
    border-color: var(--merah);
  }

  /* Rubber-stamp decision, slightly askew */
  .stamp {
    display: inline-block;
    margin-left: 8px;
    font: 600 10px/1 var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    padding: 3px 6px;
    border: 1.5px solid currentColor;
    transform: rotate(-2deg);
    vertical-align: 2px;
    white-space: nowrap;
    animation: stamp 0.22s ease-out;
  }

  .stamp.setuju {
    color: var(--hijau);
  }
  .stamp.ubah {
    color: var(--kuning);
  }
  .stamp.buang {
    color: var(--merah);
  }
  .stamp.risk {
    color: var(--on-solid);
    background: var(--merah);
    border-color: var(--merah);
  }

  @keyframes stamp {
    from {
      transform: rotate(-2deg) scale(1.6);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .stamp {
      animation: none;
    }
  }

  @media (max-width: 560px) {
    .margin {
      left: -50px;
      width: 32px;
    }

    .para::before {
      left: -8px;
    }
  }
</style>
