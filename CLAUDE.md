# Project Instructions

## What this repo is

A **lo-fi prototype demo** built live during **The Good AI! P012 Session 1** (Wed 4 Nov 2026, Jakarta, 09:00-16:00), a co-creation workshop run by Labtek Indie with 9 Journocoders journalists in 3 teams. I'm the **full-stack AI developer** in one team (replacing Luthfi Salman), working with a UI/UX designer, 3 journalists and a co-facilitator.

**Read [PLAN.md](PLAN.md) first.** It has the goal, the team's idea, the 6-step flow, the build order and the deploy steps.

## The team's idea in one line

Pain point **#5 Audience & news distribution**: turn one story's material (article draft + raw data) into platform content (carousel, reels script, newsletter), where **every line of the output links back to its source** and the journalist approves line by line. Team sketch: [docs/sketch/team-sketch-2026-11-04.jpg](docs/sketch/team-sketch-2026-11-04.jpg).

## Hard rules

- **Dummy or public data only.** No real source material, personal data or unpublished reporting. All demo content lives in [src/lib/data.js](src/lib/data.js) and is fictional.
- **Fake the AI.** Outputs are scripted in `data.js`. The demo must never depend on a live API call during the session.
- **Human in the loop must be visible.** Every screen shows where the journalist checks, corrects or decides (prototype card field 6).
- **Lo-fi.** Clarity over polish. No auth, no backend, no state persistence. Navigation uses the small hash router in `src/lib/router.js` (`#/`, `#/riwayat`, `#/project/3`), no router library.
- **The repo is public** (the owner's call, 10 Nov 2026), so anything committed is visible, including `docs/`. Only the `dist/` build is deployed, to GitHub Pages via `.github/workflows/pages.yml`.

## Tech

- Vite + Svelte 5 (JavaScript, no SvelteKit). Run with `npm run dev`, build with `npm run build`.
- `vite.config.js` uses `base: './'`.
- When writing or editing `.svelte` files, use the Svelte 5 runes syntax (`$state`, `$derived`, `$props`), and use the `svelte-code-writer` skill if it's available.

## Language

- **UI text: Bahasa Indonesia** (the participants are Indonesian journalists).
- Code, comments and docs: English.
- No em dashes in docs or UI copy. Use commas, periods or restructure.

## Knowledge base (`docs/context/`)

Copied from my prep notes on 4 Nov. Read on demand:

| File | When to read |
|---|---|
| [source-excerpts-for-session-1.md](docs/context/source-excerpts-for-session-1.md) | Verbatim passages from the ToR, workshop deck, Phase 1 report and handbook. Start here for anything about the rules of the day or the prototype card |
| [ai-dev-playbook.md](docs/context/ai-dev-playbook.md) | My role, the framing for the day (claims linked to source, routing data by sensitivity, per-persona ideas), the metrics for card field 10 |
| [p012-tor-recap.md](docs/context/p012-tor-recap.md) | The ToR: lo-fi definition, session flow, prototype card fields, principles |
| [workshop-method.md](docs/context/workshop-method.md) | Dea's method: HMW, Crazy 8s, the idea-mapping matrix and its 4 zones, fake it or make it |
| [phase1-research-recap.md](docs/context/phase1-research-recap.md) | The research behind the 7 pain points, personas (Faris, Galih, Galuh), quotes |
| [perkara-ai-hallucination.md](docs/context/perkara-ai-hallucination.md) | Anti-hallucination pattern: claims tied to source IDs, a deterministic quote auditor, local LLM with JSON schema |
| [prompts.md](docs/context/prompts.md) | 10 Bahasa prompt templates, including the traceable repurposer (#6) that matches this idea |
| [international-ai-journalism-examples.md](docs/context/international-ai-journalism-examples.md) | How newsrooms abroad use AI, the 2026 failures, lines to use in the room |
| [ai-tools-landscape.md](docs/context/ai-tools-landscape.md) | Existing tools per pain point, local models, LLM-as-judge |
| [project-the-good-ai.md](docs/context/project-the-good-ai.md), [background-research.md](docs/context/background-research.md) | The parent project, the organisations, Indonesian regulation |

Images in `docs/sketch/`: the team sketch, the idea-mapping matrix, the Phase 1 friction map.

## After the session

Write `docs/session-1-notes.md`: which pain point and idea the team chose, the final prototype card (all 10 fields), feedback from the other teams, and what to carry into later sessions.
