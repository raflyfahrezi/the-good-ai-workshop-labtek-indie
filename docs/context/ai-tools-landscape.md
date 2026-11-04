---
purpose: Background research on existing AI tools per pain point, local AI, LLM-as-a-judge and evaluation metrics, and a rapid prototyping stack
source: web research on 2026-11-02 (subagent). Items marked [unverified] came from secondary sources or conflicting sources. Check before quoting on stage.
last_updated: 2026-11-02
---

# AI Tools Landscape (for the 4 Nov workshop)

Reference material. The short "what I actually say and build" version is in [ai-dev-playbook.md](ai-dev-playbook.md).

## 0. Context worth citing in the room

- **Dewan Pers Regulation No. 1/2025 on AI in journalism.** Journalists remain responsible for verifying anything AI touched, and AI content must be labelled. https://en.antaranews.com/news/342706/indonesia-sets-standards-for-ai-use-in-journalistic-works , https://www.hukumonline.com/berita/a/jaga-kualitas-jurnalistik--dewan-pers-terbitkan-panduan-penggunaan-ai-lt6793a8277fa7d
- **The "AI shifts work, doesn't remove it" finding has outside support.** Reuters Institute survey of 1,004 UK journalists (Nov 2025): daily AI users were *more* likely to report too much low-level work (59% vs 37%). Checking AI output can cancel the time saved. https://pressgazette.co.uk/news/gulf-between-ai-journalism-hype-and-concerns-at-the-coalface-revealed/
- **Free tools and privacy.** Data sent through the free tier of the Gemini API may be used to improve Google products, paid-tier data is not [secondary, check ai.google.dev terms]. Strongest argument for local AI on source material.
- **Big newsrooms.** NYT "Echo" (internal summarisation tool) and Reuters both treat AI output as a starting point that humans edit and are accountable for. https://www.ire.org/2025/12/06/inside-the-new-york-timess-a-i-toolkit/

## A. Per pain point: existing tools and demo patterns (~3 hours)

### 1. Information discovery & sense-making

Existing:
- **Google Pinpoint**: free document/audio search for journalists. Indonesian support [unverified].
- **ICIJ Datashare**: open source, runs locally/offline, named entity extraction, Neo4j graph plug-in (people to companies). https://www.icij.org/tags/datashare
- **Climate Policy Radar**: open, AI-searchable ~170k climate laws and policies.
- Indonesian public inputs: data.go.id, **BPS** (web API at webapi.bps.go.id), peraturan.go.id / **JDIH**, **Amdalnet** (environmental approvals via OSS, KLHK issues docs on Amdalnet), **SIGAP** (KLHK geospatial), **LPSE/SPSE** procurement. AHU company profiles are paid [unverified].

Demo patterns:
- **Company dossier card**: company name in, matches from 3-4 mock CSVs (AHU-like owners, LPSE tenders, AMDAL approvals). Every field shows source URL, retrieval date, "verified by journalist" checkbox. Fuzzy matches flagged "unverified".
- **Regulation explainer with citations**: Q&A over 5-10 public JDIH PDFs, answer quotes the exact pasal with page link, judge marks each sentence supported / not supported.
- **Permit timeline**: dates and events from AMDAL docs into a timeline, each event linked to its page, gaps labelled "no document found".

### 2. Source access, safety & emotional judgement

Existing:
- **Hush Line**: open source E2E encrypted tip line, lighter than SecureDrop.
- **SecureDrop**: on-prem, hardware ~USD 2.5-3k, often too much for small outlets.
- **Microsoft Presidio**: open source PII detection/redaction. Needs custom recognisers for NIK and Indonesian names. https://github.com/microsoft/presidio
- **Dart Center** trauma-reporting guides (human reference, not AI). https://dartcenter.org

Demo patterns:
- **Local redaction gate**: interview text goes through a local model + regex (NIK, phone, address, names). Journalist reviews highlighted spans. Only redacted text may go to a cloud LLM.
- **Source-risk checklist assistant**: form (vulnerability, retaliation risk, minor/survivor). LLM suggests questions and safety steps, editor signs off. AI never decides whether to publish a name.
- **Trauma-aware question reviewer**: flags leading or retraumatising questions, suggests rewording with a reason.

### 3. Transcription inaccuracy

Numbers:
- Whisper large-v3 on FLEURS Indonesian: about **7.8% WER** (large-v2 ~7.1 in the MMS paper) [column alignment uncertain]. https://arxiv.org/pdf/2503.20212 , https://arxiv.org/pdf/2305.13516
- **Javanese and Sundanese zero-shot are poor**: large-v3 ~60% WER on Dataocean, large-v2 Javanese FLEURS 68.5% WER.
- **Fine-tuning helps a lot**: Whisper large-v2 fine-tuned on Javanese reached 13.77% WER vs 89.40% base. https://ejournal.nusamandiri.ac.id/index.php/pilar/article/view/4633 . EMNLP/WiNLP 2025 paper fine-tuned up to large-v3-turbo on OpenSLR SLR35/36 with noise-aware training. https://arxiv.org/html/2509.25878v1
- Older open model: wav2vec2 Indonesian/Javanese/Sundanese from indonesian-nlp. https://github.com/indonesian-nlp/multilingual-asr
- No Indonesian-specific large-v3 vs turbo comparison found. Turbo generally close to large-v3 and faster [unverified for Indonesian].

Tooling:
- **WhisperX**: forced alignment gives word-level timestamps, pyannote diarization (gated on Hugging Face, accept terms first). Needs a language-specific alignment model. https://github.com/m-bain/whisperx
- **faster-whisper**: CTranslate2 Whisper, int8 runs on CPU. https://github.com/SYSTRAN/faster-whisper
- **noScribe**: GPL-3.0 local desktop app for journalists, with diarization, ~3.7 GB model. https://github.com/kaixxx/noScribe
- **Buzz**: local Whisper GUI. https://github.com/chidiwilliams/buzz
- TurboScribe, Otter: cloud, audio leaves the device.

Demo patterns:
- **Quote-to-audio linker**: each quote in the draft is a chip that plays the exact word span. Low-confidence or Sundanese/Javanese words underlined "cek". Journalist confirms each quote before it's marked verified.
- **Dual-transcript diff**: two engines, highlight where they disagree. Only disagreements need human ears.
- **Glossary-primed transcription**: local names, places, NGO acronyms as Whisper `initial_prompt`, show before/after on a 2-minute public clip.

### 4. Interruptions & reporting continuity

Existing:
- **NotebookLM**: cited Q&A over sources, free plan keeps core features, ~50 sources per notebook on free [secondary]. Cloud only.
- **AnythingLLM**: MIT, desktop RAG on Ollama, can run fully offline. https://github.com/Mintplex-Labs/anything-llm
- **Open WebUI**: knowledge bases on Ollama. Licence changed in 2025 to a branding-restricted BSD-3 variant [check].

Demo patterns:
- **Story case file**: one page per story (sources contacted, claims with status verified/pending/disputed, documents, open questions, next steps). "Lanjutkan dari terakhir" generates a cited 5-line briefing.
- **Handover note generator**: case file into a handover for a colleague, every line linked to evidence, unlinked items in red.
- **Claim ledger**: each claim in a draft tied to a source ID (feeds the AI judge).

### 5. Audience & news distribution

Existing:
- Washington Post "Ask The Post AI" (cited answers from archive), NYT Echo [WaPo details from memory, verify].
- Opus Clip, Canva, CapCut: generic repurposing, no traceability.
- **Overtone**: scores article quality from text, English (Spanish in progress).

Demo patterns:
- **Traceable repurposer**: article in, 5-slide carousel + 30s Reels script + WhatsApp newsletter blurb out. Each output sentence links back to its paragraph. Diff view shows simplified/reordered/added. Anything not in the article is blocked.
- **Register switcher**: formal Indonesian to casual/code-mixed (Jaksel, Sundanese) social style. Judge checks facts, numbers, names unchanged.

### 6. Revenue & content value

AI crawler control:
- **Cloudflare AI Crawl Control** on all plans including free: block/allow per crawler, analytics, robots.txt compliance tracking. **Pay Per Crawl** (HTTP 402) still private/closed beta. Cloudflare blocks AI crawlers by default for new domains since 1 Jul 2025. https://developers.cloudflare.com/ai-crawl-control/
- **robots.txt** user-agents: GPTBot, ClaudeBot, Google-Extended, CCBot. Compliance is voluntary.
- **llms.txt**: major AI crawlers not shown to read it, one 300k-domain audit found ~10% adoption and no effect on citations. Cheap, but don't sell it as revenue.

Grants:
- **EarthCheckr** (Earth Journalism Network): gen-AI tool helping editors/mentors review grantees' stories. https://earthjournalism.net/what-we-do/project-updates/ejn-launches-earthcheckr-a-generative-ai-assisted-tool-for-fact-checking

Demo patterns:
- **Grant report builder**: published stories, reach numbers, outcomes from a mock sheet into a donor template. Every number cites its row. Untraceable impact claims flagged "butuh bukti".
- **AI-crawler policy wizard**: a few questions generate robots.txt + llms.txt, show a mock Cloudflare dashboard.

### 7. Operational & administrative load

Existing (all local/self-hosted):
- **Docling** (MIT, PDF to structured output). https://github.com/docling-project/docling
- **PaddleOCR** (good on text, weaker on tables), **Donut CORD-v2** (receipt image to JSON), **Paperless-ngx** (self-hosted OCR archive).
- Common pipeline: OCR then small local LLM returns JSON fields.

Demo patterns:
- **Receipt-to-ledger**: photo of a kuitansi, local OCR + local LLM extract vendor, date, amount, NPWP. Low-confidence fields highlighted, human confirms before the row is written to Google Sheets.
- **Contributor payment tracker**: story marked published triggers a pending fee (n8n). Editor approves, reminder for unpaid fees after 14 days.

## B. Local, privacy-preserving AI (late 2026)

Runtimes (offline once models are downloaded):
- **llama.cpp** (MIT): the engine underneath.
- **Ollama** (MIT): CLI + local API at `localhost:11434`. Easiest to plug into a prototype.
- **LM Studio**: GUI, free for work use since Jul 2025, **not open source**.
- **Jan**: open-source desktop app [licence sources conflict].

Models with Indonesian ability:
- **Gemma 4** (Apache 2.0, 2 Apr 2026): E2B, E4B, 26B MoE, 31B dense, plus a 12B (3 Jun 2026). **E4B is the laptop sweet spot.**
- **Qwen3**: 0.6B to 235B, 100+ languages. `ollama run qwen3:8b`.
- **SEA-LION v4** (AI Singapore): Gemma-SEA-LION-v4-27B, Qwen-SEA-LION-v4-32B-IT, 8B/4B VL variants.
- **Sahabat-AI** (GoTo/Indosat): v1 8B (Llama 3) and 9B (Gemma 2) cover Indonesian, Javanese, Sundanese. v2 70B is too big for a laptop.
- **GoTo's new open 27B model** (Indonesian, Javanese, Sundanese, Balinese, Batak), announced 21 Oct 2026 at Bali Tech Week [name/licence/download unverified]. Nice fresh talking point.
- **Komodo-7B** (Yellow.ai, 2024): older.

Hardware (Q4 quantisation, rules of thumb):
- 8 GB RAM: 1-4B models (Gemma 4 E2B/E4B, Qwen3 4B). Fine for redaction and extraction.
- **16 GB Apple Silicon (my M4 Air): 7-9B models** (Qwen3 8B, Sahabat-AI 8B) at a few to ~20 tokens/s [estimate]. Demo-grade. Fanless, so it throttles on long runs.
- 24-32 GB+ or GPU: 26-32B models.
- Whisper: faster-whisper int8 runs on CPU slowly. Apple Silicon makes it practical.

Demo framing: **"Langkah sensitif (wawancara mentah, nama narasumber) jalan di laptop. Hanya teks yang sudah diredaksi atau data publik yang boleh ke model cloud."**

## C. LLM-as-a-judge and evaluation metrics

Plain idea: a second model grades the first model's output against a written rubric, like a junior fact-checker doing a first pass before the editor. Step-by-step rubrics (G-Eval style) agree with humans better than "rate this 1-10".

Known biases: **position** (prefers first or second answer), **verbosity** (longer looks better), **self-preference** (favours its own model family), authority/citation bias, swayed by confident tone. Surveys: https://arxiv.org/pdf/2411.15594 , https://arxiv.org/pdf/2412.05579 , CALM 12-bias framework https://arxiv.org/abs/2410.02736

Mitigations: swap order and average, judge from a different model family, **binary per-claim checks instead of holistic scores**, require the judge to quote evidence, calibrate on ~20 human-labelled examples and report agreement (Cohen's kappa).

Frameworks (all can point at a local Ollama model as judge):
- **Ragas** (Apache-2.0): faithfulness, response relevancy, context precision/recall. Pin the version. https://docs.ragas.io
- **DeepEval** (Apache-2.0): pytest-style, GEval, faithfulness, hallucination. https://github.com/confident-ai/deepeval
- **promptfoo** (MIT): YAML, `llm-rubric`, side-by-side model comparison. Reportedly acquired by OpenAI Mar 2026 [secondary].
- **OpenAI Evals**, **Langfuse** (MIT, self-hostable, judge evaluators + human annotation queues), **LangSmith** (hosted, free dev tier).

Metrics:
- **Faithfulness / groundedness**: share of output claims supported by sources
- **Answer relevance**: does it address the question
- **Citation accuracy**: share of citations that actually support their sentence (not the same as "has a citation")
- **Hallucination rate**: unsupported claims per output or per 100 claims
- **WER** = (substitutions + deletions + insertions) / reference words. **CER** at character level, fairer for code-mixing and affixes. Normalise first (case, punctuation, "dua puluh" vs "20")
- **Quote accuracy** (journalism): quote in draft matches transcript span at its timestamp: exact / minor edit / meaning changed
- **Source attribution correctness**: right speaker or document credited
- **Change transparency**: share of AI edits surfaced in the diff
- **Workload**: (time to draft + time to verify) with AI vs without. Also "items needing human check" per story

How to show the AI judge in a lo-fi prototype:
- **Three columns**: AI draft | judge verdict per claim (Didukung / Tidak ditemukan / Bertentangan, with quoted evidence and source link) | editor action (Terima / Edit / Tolak / Perlu liputan tambahan)
- **Header metrics**: "12 klaim, 9 didukung, 2 tidak ditemukan, 1 bertentangan, faithfulness 75%". Publish button disabled until a human clears every non-green item
- **Disagreement log**: each time the editor overrules the judge. Gives a live "judge-editor agreement" metric and shows the judge is a filter, not the decider

## D. Rapid prototyping stack (2-4 hours)

| Tool | One-liner |
|---|---|
| **Google AI Studio** | Fastest Gemini prompting + "Build" app generator. Free tier may train on data, dummy data only |
| **Claude artifacts** | Quick clickable HTML/React mockups from a prompt. Great for pairing with the designer |
| **v0** (Vercel) | Polished React UI, small free credit |
| **Bolt.new** | Full-stack in the browser, generous free tokens [figures conflict] |
| **Lovable** | Nicest default UX + Supabase, tightest free tier |
| **Streamlit / Gradio** | Python, open source, runs locally with Ollama + faster-whisper. Best fit for "open, maintainable, offline". Gradio has an audio component |
| **n8n** | Visual workflows (OCR, LLM, Sheets), self-hostable. "Sustainable Use License", not OSI open source |
| **NotebookLM** | Zero-build scripted demo of cited RAG. Cloud only, no custom UI |
| **Figma** (designer) | Clickable mockup when the AI part is a scripted demo |

Suggested combo: **Gradio/Streamlit + Ollama (Gemma 4 E4B or Qwen3 8B) + faster-whisper/WhisperX, judge step as one rubric prompt.** Backup: a Claude artifact or v0 mockup in case the local setup or venue Wi-Fi fails.

Gaps: no 2025 JournalismAI fellowship list, no Indonesian large-v3 vs turbo WER, no Sundanese FLEURS WER for large-v3, Pinpoint Indonesian support unconfirmed.
