# Plan: Lo-fi Demo for The Good AI! P012 Session 1

## Goal

Build a **clickable lo-fi demo** of my team's idea for the prototype card (field 7), using **dummy data only**. It has to be good enough for journalists from the other teams to answer: "Would I use this, and where would it break?"

It's not production software. The AI is **faked** (scripted outputs in `src/lib/data.js`), so the demo never breaks in front of the room. If the team wants one live step, run the prompt in Claude/ChatGPT on the dummy article and paste the result into `data.js`.

## The idea (from the team sketch, 4 Nov)

Pain point **#5 Audience & news distribution**: one story has to be reworked into reels, carousels, newsletters, and every rework is a mini editorial workflow. The tool turns a journalist's material into platform content **without losing the link to the source**.

Sketch: [docs/sketch/team-sketch-2026-11-04.jpg](docs/sketch/team-sketch-2026-11-04.jpg)

Prototype card one-liner (draft, for the team to edit):
> "Alat yang membantu jurnalis mengolah satu liputan menjadi konten media sosial, sehingga mereka tidak lagi menulis ulang dari nol dan tidak perlu mengecek ulang seluruh isi, karena setiap kalimat bisa diklik ke sumbernya."

## The flow (6 steps, adapted from the sketch)

```
 1 Bank Informasi ──► 2 Brief & Guideline
                              │
                              ▼
                     3 Script & Sumber
                (Word-style document, per paragraf,
                 sorotan = dokumen sumber)
                              │
                              ▼
          ┌───────── 4 Generate Media (+ auto QC)
          │                   │
          │                   ▼
        Revisi ◄──────── 5 QC Editorial
   (script → 3, visual → 4,   │
    fakta → 1)                ▼
                         6 Ekspor & Atribusi
```

| # | Screen | What the journalist does | What AI does (faked) | Human decision point |
|---|---|---|---|---|
| 1 | **Bank Informasi** | Adds material in two groups: **Karya Utama** (the draft article) and **Data Mentah** (photos, video, transcripts, research PDFs). Uploads material (dummy upload) and labels each item **Publik** or **Sensitif** | Every item gets an ID (e.g. `ART-P3`, `TR1-S2`, `FOTO-2`) so later output can point back to it. Video is analysed on two tracks: sound and **visual events** (e.g. `VID1-V1`), since not everything is in the audio | **Sensitivity label is set by the journalist, never the AI**, and an upload is only processed after it is labelled (cloud or local). The journalist confirms the AI's visual descriptions against the footage |
| 2 | **Brief & Guardrails** | Picks the format (Video Reels / Audio / Image Slides), audience, tone, length. Writes guardrail rules as free text (pre-filled examples are editable) | - | Rules are the journalist's: "Tidak boleh menambah fakta baru", "Kutipan harus persis", "Nama narasumber sensitif disamarkan", "Foto tidak boleh diubah isinya" |
| 3 | **Script & Sumber** (was 3b; the separate concept step was dropped on 4 Nov) | Reviews the script as a **Word-style document**, paragraph by paragraph. Each paragraph is highlighted in the colour of the document it quotes; clicking it shows the source passage. Marks each paragraph Setuju / Ubah / Buang | Writes the script straight from the brief; each paragraph carries source IDs and an **audit status**: 🟢 kutipan ditemukan, 🟡 parafrase (yellow wavy underline), 🔴 tidak ada di sumber (red wavy underline, no highlight). Brief feedback shows as "Catatan AI" at the top | **Counter "x dari y paragraf belum dicek".** "Setujui script" stays disabled until every paragraph is decided |
| 4 | **Generate Media** | Watches the preview build | Renders the slides (text + photo from the bank) and runs **auto QC**: new facts, quote mismatch, photo used out of context, text too long | - |
| 5 | **QC oleh Jurnalis** | Reviews the preview with the auto-QC flags. **Setujui** or **Revisi** (with a note, goes back to 3) | - | Final approval |
| 6 | **Ekspor** | Downloads the content | Produces the files plus a **Jejak Sumber** sheet: every line, its source, its audit status, who approved it | The source trail is for the editor (the "Galih" persona): they can see what AI touched |

## Alignment with the team PRD (IDEO PRD v1, 4 Nov)

The team wrote a PRD for the product, named **IDEO**. The demo follows its workflow, key screens and MVP scope (Image Slides only), within the lo-fi rules above:

- **Dashboard** (screen 01): active project with content status, deadline, last step, activity, other projects.
- **Content status** (PRD 13.1): Draf, Diproses, Perlu Review, Revisi, Disetujui, Diekspor.
- **Step 1**: categories, source/credit per file, processing status, one upload that fails with retry.
- **Step 2**: objective, multi-format (Video Reels and Audio marked as later phase), platform, guideline templates.
- **Step 3**: the brief goes straight to a Word-style script document, highlighted per source document, decided paragraph by paragraph.
- **Step 4**: per-slide edit and regenerate. Later passes only reprocess changed slides (PRD 6.1).
- **Step 5**: source verification per slide, revision routed by type (script to 3, visual to 4, facts to 1), version history.
- **Step 6**: export format choice, credit, metadata, export history.

- **Look and layout** follow the designer's low-fi wireframe (`public/ideo-lowfi-prototype-v2.html`): left sidebar, grey square boxes with 1.5px lines, dashed notes, striped image placeholders, connected stepper, light and dark theme. Riwayat Konten, Guideline Saya and Pengaturan exist as simple pages; Pengaturan has a live theme switch for the projector.

Left out on purpose: login, autosave or persistence, creating a real new project, and the article editor.

## Why it's built this way (the argument for the room)

- Every 2026 AI scandal in newsrooms had the same shape: **a claim cut off from its source, then not checked**. So the core of the demo is step 3 (Script & Sumber): every line clickable to its source, colour-coded.
- Phase 1 found AI **moves** work to verification. The counter and the per-line decisions make that verification **visible and cheap**, which is the answer to card field 10 ("does it reduce TOTAL workload?").
- **Yellow exists on purpose**: a code auditor can check that words match, not that meaning is right. Meaning stays the journalist's job.
- **Sensitivity routing**: public material can go to a big cloud model, sensitive material (e.g. a source interview) to a small local model. The journalist decides which is which.
- **Jejak Sumber** answers the editor's complaint: "when journalists use AI without disclosure, editing workload doubles."

## Prototype card mapping

| Field | Content |
|---|---|
| 1 Pain point | #5 Audience & news distribution |
| 2 Who has it | Journalist (also Editor for the source trail) |
| 3 Workflow stage | Distribute |
| 5 What AI does | Writes a script from the bank with source tags, renders slides, auto-checks against guardrails. Dummy data only |
| 6 Where the human decides | Sensitivity labels, guardrails, per-paragraph approval (3), final QC (5) |
| 7 Demo | Link to the deployed build |
| 9 Risks | Accuracy (meaning drift in paraphrase), source safety (sensitive material sent to cloud), moves work to QC |
| 10 Test next | Seconds to verify one line vs manual; how many 🔴 lines journalists catch; whether the source trail cuts editor time |

## Build order (each step is demo-able on its own)

1. **Shell**: one page, step indicator on top, `step` state, Next/Back. Bahasa Indonesia UI.
2. **Step 3 (then 3b) first** (it's the heart of the demo): script lines with source chips and colour, side panel showing the source passage on click, Setuju/Ubah/Buang, counter, disabled "Lanjut".
3. **Step 1**: bank list in two columns, sensitivity badges.
4. **Step 2 + 3**: brief form with guardrail checkboxes, angle cards, "Revisi brief" loop.
5. **Step 4 + 5**: carousel preview (cards with text + photo placeholder), QC flags, Setujui / Revisi (back to 3).
6. **Step 6**: "Unduh" button (fake) and the Jejak Sumber table.
7. If time: a small timer on step 3 showing seconds per line checked (evidence for field 10).

If time runs out, steps 1, 3 and 5 alone tell the story.

## Tech

- **Vite + Svelte 5**, no SvelteKit, no backend. A small hash router (`src/lib/router.js`) gives each screen a URL that works on Netlify Drop, e.g. `#/project/3` to jump to step 3. Already initialised.
- All dummy content in **`src/lib/data.js`**, so the designer or journalists can edit text without touching components.
- `vite.config.js` has `base: './'` so the build works from any subpath.

```bash
npm run dev
```

## Deploy (for card field 7)

The repo is **private**, and GitHub Pages on a private repo needs a paid plan. The `docs/` folder holds internal workshop material, so **don't make this repo public**. Fastest option instead:

```bash
npm run build
```

Then drag the `dist/` folder into https://app.netlify.com/drop for a public link to the demo only.

## Rules

- **Dummy or public data only.** No real source material, personal data or unpublished reporting (ToR principle "Do no harm").
- UI text in Bahasa Indonesia. Code, comments and docs in English.
- Fake it before you make it. A scripted demo that works beats a live one that might not.
