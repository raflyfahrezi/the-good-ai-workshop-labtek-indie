---
purpose: My own prep for being the full-stack AI developer in one team on 4 Nov. What to say, what to build, what to bring
last_updated: 2026-11-03
---

# AI Developer Playbook (Session 1, Wed 4 Nov 2026)

## My job in one line

Per the ToR: **"advise on what AI can realistically do and build quick AI demos or workflows"**, one per team, together with the UI/UX designer. Journalists lead and decide. I make their idea tangible and honest.

## What Salman told me (31 Oct)

- "Just be yourself aja."
- They will ask **my opinion about what solution could be applied to the problem**.
- **Don't be too technical.** Other stakeholders aren't engineers. They won't understand "context engineering" or "context caching".
- Keywords that will be useful: **AI Judge**, **Local AI for data privacy**, **Evaluation metric**.
- My take: focus on the **product side** (what it does for the journalist, where they decide), and keep the tech underneath.

## The 5 rules I keep in my head all day

1. **Total workload, not speed.** Every idea gets the question: "Ini ngurangin kerja total, atau cuma mindahin ke editor?" (prototype card field 10, and the Y axis "beban bersih").
2. **Every output links back to its source.** Transcript to audio timestamp, summary to document page, carousel slide to article paragraph.
3. **Show what's unverified.** AI output has visible states: belum dicek / sudah dicek / bertentangan.
4. **The human decision point must be on screen.** "If field 6 is empty, the idea has a problem."
5. **Dummy or public data only.** Nothing a journalist says about real sources goes into a cloud AI tool, not even to demo.

## Salman's 3 keywords, explained for journalists

Lines I can say almost word for word. Bahasa first, since the session is in Bahasa.

### 1. AI Judge (LLM-as-a-judge)

> "Bayangin ada dua AI. AI pertama bikin draf atau ringkasan. AI kedua tugasnya cuma ngecek: setiap klaim di draf itu ada buktinya nggak di dokumen sumber? Kayak fact-checker junior yang ngecek duluan sebelum sampai ke editor. Hasilnya bukan 'lulus/gagal', tapi daftar: klaim ini didukung, klaim ini tidak ditemukan, klaim ini bertentangan, lengkap dengan kutipan buktinya. Editor tetap yang memutuskan, tapi dia cukup fokus ke yang merah."

Why it fits this room: it directly attacks Kresna's complaint that AI just shifts work to verification. The judge doesn't remove verification, it **ranks** it, so the editor checks 3 red items instead of rereading 30 paragraphs.

Honest caveats (say them, the room respects honesty):
- The judge also makes mistakes. It tends to trust confident, long text, and to favour answers from its own model family.
- So: judge per claim (yes/no with quoted evidence), not a vague "skor 8/10". Use a different model than the one that wrote the draft. Check its work against ~20 examples a human has labelled before trusting it.
- Log every time the editor overrules the judge. That becomes our evaluation data.

Where it shows up in a prototype: a third column "Verdict AI Judge" next to the draft, and a Publish button that stays disabled until a human clears every red item.

### 2. Local AI for data privacy

> "Kalau pakai ChatGPT atau Gemini gratisan, teks yang kita masukin keluar dari laptop dan diproses di server mereka, dan untuk versi gratis bisa dipakai untuk melatih model. Untuk wawancara dengan narasumber rentan, itu risiko. Local AI artinya modelnya jalan di laptop sendiri, internet bisa dimatikan, datanya nggak ke mana-mana. Gratis, open source, nggak ada biaya lisensi. Kekurangannya: lebih kecil, lebih lambat, dan kurang pintar dibanding yang besar."

Why it fits: it hits three project principles at once (Do no harm, Open and sustainable, Local context first) and Faris's "constant worry about data security on free tools", the Coder's "protect sensitive data sovereignty", and the friction sticky "Informasi sensitif membatasi penggunaan tools AI".

The pattern to sell: **"Gerbang lokal"**. Sensitive steps (raw interview, source names, receipts with NPWP) run locally. A local model redacts names, NIK, phone numbers, the journalist checks the highlights, and only the redacted text may go to a big cloud model.

What runs locally today: transcription (Whisper), redaction, simple extraction and classification, Q&A over a few documents. My M4 Air (16 GB) can run 7-9B models like Qwen3 8B or Gemma 4 E4B, plus Whisper.

Indonesian-specific talking points: SEA-LION (AI Singapore), Sahabat-AI (GoTo/Indosat, covers Javanese and Sundanese), GoTo's new open 27B model announced 21 Oct 2026. But: Whisper is good at Indonesian (~8% word error on a benchmark) and **bad at Sundanese/Javanese without fine-tuning (60%+ error)**. That's the honest answer for the "mixed languages" pain point.

### 3. Evaluation metric

> "Gimana kita tahu AI-nya beneran membantu? Bukan dari 'kayaknya lebih cepat'. Kita ukur. Ada ukuran teknis, misalnya berapa persen kata yang salah di transkrip, atau berapa persen klaim di ringkasan yang benar-benar ada di sumbernya. Tapi yang paling penting buat redaksi: total waktu dari draf sampai siap terbit, dengan AI dibanding tanpa AI. Kalau drafnya lebih cepat tapi verifikasinya lebih lama, ya nggak menang."

Metrics I can offer the team for card field 10 ("Test next"):

| Metric | Plain meaning | Fits pain point |
|---|---|---|
| WER / CER | % kata / huruf yang salah di transkrip | 3. Transkripsi |
| Quote accuracy | Kutipan di draf sama persis dengan rekaman? exact / edit kecil / makna berubah | 3. Transkripsi |
| Faithfulness | % klaim di output yang ada buktinya di sumber | 1, 4, 5 |
| Citation accuracy | % rujukan yang beneran mendukung kalimatnya (bukan sekadar ada link) | 1, 4 |
| Hallucination rate | Berapa klaim "ngarang" per output | All |
| Items to check | Berapa hal yang tetap harus dicek manusia per berita | All |
| **Total workload** | (waktu bikin + waktu verifikasi) pakai AI vs tanpa AI | **All, this is the one** |
| Judge-editor agreement | Seberapa sering editor setuju dengan AI judge | Any idea with a judge |
| Field extraction accuracy | % kolom kuitansi yang terbaca benar | 7. Admin |

The three keywords connect: **local AI keeps data safe, the AI judge makes checking cheaper, metrics prove whether total workload really dropped.** That's a one-sentence summary I can use when introducing myself.

## My framing for the day (worked out 3 Nov)

### The core problem

Nearly every 2026 AI scandal in newsrooms (Ars Technica, NYT, Dawn, Telegraph) has the same shape: **a quote or claim cut off from its source, then not checked.** Two layers:

1. **Disconnected from source.** The AI writes a claim without showing where it came from.
2. **Checking is expensive.** If finding one quote means replaying an hour of audio, the check gets skipped. This is the Phase 1 finding: AI speeds up early steps and moves the burden to verification.

Hallucination can't be brought to zero, not even with the best models (Opus 5.5, GPT). A source link alone isn't enough either: the BBC/EBU study found assistants misrepresenting news content 45% of the time even with sources available. So the goal is not "AI that never hallucinates" but **every claim checkable in seconds**.

> "Masalahnya bukan AI salah, tapi salahnya AI susah dicek. Prototipe kita harus bikin ngecek jadi murah."

### The solution shape: AI produces the links, UI makes them one click

- **AI side (me):** every claim comes out with its source (`segmen_id`, page number, timestamp), and a deterministic auditor labels it.
- **UI side (designer):**
  1. Click a claim, the source sentence lights up in the transcript or PDF.
  2. Colour per claim: green "kutipan ditemukan", yellow "parafrase, cek makna", red "tidak ada di sumber". Yellow exists because the auditor only checks that the words match, not that the meaning is right.
  3. Counter on top: "7 dari 12 klaim belum dicek".
  4. Per-claim decision buttons: setuju / ubah / buang (card field 6).
- **Metric (card field 10):** seconds to verify one claim, and how many wrong claims slip through, versus the manual way.

Proprietary models can do this today: Claude has a built-in Citations feature (returns the exact cited text plus page or character location; can't be combined with JSON structured output in the same call), and OpenAI file search returns file citations. For the demo, a cloud model on public or dummy data is fine. Note on the card that sensitive material moves to a local model in production.

### The tradeoff: privacy vs capability vs cost

You can't have a smart, private and cheap model all at once, but you don't pick once for the whole system. **Pick per task:**

1. **Route by sensitivity.** Most material is public (government reports, court rulings, press releases, analytics for donor reports), so it can go to a cloud model. Only the small sensitive slice (confidential interviews, victim identities, leaks) stays local. Hybrid: a small local model redacts identities, then the safe text goes to the big model.
2. **Shrink the task so a small model is enough.** Small models are bad at open-ended "analyse and conclude" but decent at narrow extraction with a forced JSON schema plus a code auditor. The harness (prompt, schema, small steps, auditor) makes up for the model.
3. **The journalist labels sensitivity on upload, never the AI. When unsure, default to local.** Sending a source recording out can't be undone. Processing a public document locally only costs a bit of speed.

> "Kita nggak perlu satu AI yang pintar dan aman sekaligus. Data publik pakai model besar, data sensitif pakai model kecil di laptop dengan tugas yang sempit. Dan yang menentukan file mana yang sensitif adalah jurnalisnya."

The bigger point: AI stays a tool. The journalist still decides where data goes and how the flow works. What changes is the shape of the job, from collecting and writing to checking and deciding. A good prototype makes that checking light and makes the decision point obvious.

### How this lands for each persona

| Persona | Their version of the problem | Prototype idea | Success measure |
|---|---|---|---|
| **Faris** (junior, small newsroom) | Double-checks all AI output himself, worried about free tools and sensitive data | One-click claim check on his own draft, sensitive files routed local | Seconds per claim, wrong claims caught |
| **Galih / Iskandar** (editor, de facto tech lead, closest to Journocoders) | Receives drafts and doesn't know **which parts** used AI, so he rechecks everything. Disclosure alone doesn't help, he needs it per section | **AI trail on the draft:** every AI-assisted section marked with its source and check status, so he reviews only red and yellow. Same view as Faris, from the editor's chair. A Journocoders team may want to build the local version themselves | Editing time per draft |
| **Galuh / Ratih** (executive director) | Not news production at all. Time goes into copying and assembling: monthly donor reports (CMS article list, analytics numbers, receipts from WhatsApp), emails, admin. Pain points #5, #6, #7 | **Grant report builder** (every number clickable to its raw data, because a wrong number in front of a donor is embarrassing), **traceable repurposing** for distribution, **receipt extraction**. Templates in [prompts.md](prompts.md) | Admin hours saved per month, not accuracy per claim |

The thread across all three: **output stays linked to its source.** Only the material changes (interview transcripts, colleagues' drafts, data and receipts).

## Plain-language glossary (avoid the jargon, use these)

| Don't say | Say |
|---|---|
| Hallucination | "AI ngarang" / "jawaban yang kelihatan meyakinkan tapi nggak ada sumbernya" |
| RAG | "AI jawab hanya dari dokumen yang kita kasih, plus nunjukin halamannya" |
| Context window | "Seberapa banyak bahan yang bisa dibaca AI sekaligus" |
| Context engineering / prompt engineering | "Cara kita ngasih instruksi dan bahan ke AI" |
| Fine-tuning | "Melatih ulang AI dengan contoh kita sendiri, misalnya rekaman berbahasa Sunda" |
| Embedding / vector search | "Pencarian berdasarkan makna, bukan kata yang persis sama" |
| Diarization | "AI membedakan siapa yang ngomong" |
| Word-level timestamp | "Setiap kata di transkrip nyambung ke detik di rekaman" |
| Agent | "AI yang bisa menjalankan beberapa langkah sendiri, misalnya buka dokumen, cari, lalu rangkum" |
| Structured output / JSON | "AI isi tabel atau formulir, bukan nulis paragraf" |
| Token / rate limit | "Kuota pemakaian" (they already know this pain: "pindah akun kalau limit gratis habis") |
| Open-weight model | "Model AI gratis yang bisa diunduh dan dijalankan sendiri" |

## Idea starters per pain point

Only to unblock a stuck team, never to pre-decide. Each one already has the human decision point and source link baked in.

| # | Pain point | Idea starter | What AI does | Where the human decides | Map zone | Fastest build |
|---|---|---|---|---|---|---|
| 1 | Info discovery & sense-making | **"Kartu data"**: paste links/PDFs from BPS, JDIH, Amdalnet, LPSE. AI pulls every number and claim into a table with source, page, data date, "masih mutakhir?" and "bisa dikutip?" | Extract, date-check, connect entities across docs | Journalist ticks "sudah dicek" per row, opens the original page from each row | Interpretasi Terpandu | NotebookLM or AI Studio + Figma table |
| 1 | | **Permit timeline**: AMDAL docs into a timeline, gaps marked "tidak ada dokumen" | Extract dates and events | Journalist judges what the gaps mean | Interpretasi Terpandu | AI Studio structured output |
| 2 | Source access & safety | **"Gerbang lokal"**: redact names/NIK/phone/locations from notes on the laptop before anything touches a cloud tool | Local model + regex highlights PII | Journalist confirms each redaction | AI Otomatis (with spot check) | Ollama + simple page |
| 2 | | **Interview question reviewer**: flags leading or retraumatising questions for a sensitive interview, suggests gentler wording, plus a Sundanese/Javanese greeting cheat sheet | Review and suggest | Journalist keeps or rejects each suggestion | Bantuan AI / Interpretasi | Claude/Gemini prompt + mockup |
| 3 | Transcription | **"Kutipan yang bisa diklik"**: each quote in the draft plays its exact audio span. Unclear or mixed-language words underlined "cek" | Transcribe with word timestamps, flag low confidence | Journalist listens and confirms each quote before it's "terverifikasi" | Interpretasi Terpandu | Whisper + Gradio, or Figma mockup with real transcript |
| 3 | | **Two-engine diff**: two transcriptions, only disagreements highlighted for re-listening | Compare | Journalist resolves the highlighted parts only | AI Otomatis | Two transcripts + diff view |
| 4 | Continuity | **"Buku liputan"**: per-story case file. "Lanjutkan dari terakhir" gives a 5-line brief: what we know, open questions, sources not yet contacted, last reasoning, each linked to the material | Summarise across materials with citations | Journalist edits the brief, marks claims verified/pending/disputed | Interpretasi Terpandu | **NotebookLM** (works today) + mockup of the brief |
| 5 | Distribution | **"Repurposer dengan jejak"**: article into carousel + Reels script + WA newsletter. Every sentence links to its paragraph, numbers and quotes locked, link back to the site with UTM | Draft formats, keep traceability | Editor approves each format. AI judge blocks anything not in the article | AI Otomatis | AI Studio prompt + Figma carousel |
| 6 | Revenue & value | **Grant report builder**: published stories + reach numbers into a donor template, every number cites its row, untraceable claims flagged "butuh bukti" | Assemble, cite | Leader signs off claims | Interpretasi Terpandu | Sheets + AI Studio |
| 6 | | **AI crawler policy wizard**: a few questions generate robots.txt (GPTBot, ClaudeBot, Google-Extended, CCBot), mock dashboard of who crawls | Generate config | Leader picks the policy | Bantuan AI | Simple page, no heavy AI |
| 7 | Admin load | **"Foto kuitansi"**: contributor sends a receipt photo on WhatsApp, AI reads vendor, date, amount, NPWP into the sheet, low-confidence fields highlighted, reminders for missing receipts | OCR + extract + remind | Coordinator approves each row before payment | AI Otomatis (with spot check) | Gemini vision on dummy receipt + Sheets mockup |

Bonus hooks from the friction map that aren't in the 7 clusters but are very buildable: "Menunggu antrian approval pemred" (review queue with an AI pre-check so the EIC only sees ready drafts), "Format ulang draf dari Word/GDocs ke CMS".

Remember the Lusia quote: if contributors have to learn a new app ("If the fellows had to get into Asana...") it fails. Meet people in WhatsApp, email, photos.

## How I behave in each step

Detail in [workshop-method.md](workshop-method.md). Short version:

| Step | Me |
|---|---|
| Opening | 20-second intro (below). Learn the 3 journalists' names, newsroom, beat |
| Understand pain point | Listen, ask "boleh contoh konkretnya?", write their exact words (card field 1 needs a quote) |
| Frame problem (HMW) | Check the HMW isn't secretly a solution. Push for the "tanpa menambah beban..." clause |
| Generate ideas | Journalists lead. Quick feasibility read without killing ideas: "bisa banget" / "bisa, tapi..." / "susah, tapi bisa kita fake". Offer an idea starter only if they're stuck |
| Idea mapping | Help rate "seberapa bahaya kalau salah" honestly. A "Hanya Manusia" result is a valid finding, say so |
| Choose one | Help fill fields 5 (what AI does, which data) and 6 (where the human decides) |
| Build | First 10 minutes with the designer: decide **which one step is real, everything else faked**. Use public/dummy data. Timebox: something showable by the halfway mark |
| Test | When others test ours: don't defend, don't over-explain, watch where they hesitate. When testing theirs: give the AI-side view (accuracy, data safety, maintenance) in plain words |
| Capture feedback | Help fill field 9 risks honestly, and field 10 with one measurable thing to test next |
| Closing | Let a journalist present if they want to. Co-creator credit is theirs |

## Build plan options (decide with the designer)

| Option | When | Stack |
|---|---|---|
| **A. Scripted demo** (default) | Most ideas | Designer's Figma flow + real AI output pasted in from Gemini/Claude/NotebookLM on public data |
| **B. Tiny working app** | When the "aha" is interaction (clickable quotes, live judge column) | Claude artifact or AI Studio "Build" for a quick HTML app, or Gradio/Streamlit if local |
| **C. Local AI live** | When the idea is about privacy | Ollama + a 7-9B model on my laptop, Wi-Fi off, to prove the point |
| **D. Paper / Wizard of Oz** | When the idea is mostly human process | Paper screens, I play the AI |

Prompt templates ready to paste: [prompts.md](prompts.md).

Real-world reference for reducing hallucination (layered knowledge base, auditor, judge, "tidak ditemukan", local-LLM recipe): [perkara-ai-hallucination.md](perkara-ai-hallucination.md).

## 20-second intro

> "Halo, saya Farhan, dari Bandung. Sehari-hari saya frontend engineer di startup AI, bikin aplikasi chat dan tampilan yang menampilkan jawaban AI. Hari ini saya bantu menerjemahkan ide teman-teman jadi prototipe. Saya lebih tertarik ke tiga hal: gimana data narasumber tetap aman, gimana hasil AI bisa dicek dengan cepat, dan gimana kita tahu AI-nya beneran ngurangin kerja, bukan cuma mindahin."

## Prep checklist

### Before Wednesday (Mon 2 - Tue 3 Nov)
- [x] Jek (Labtek Indie) has contacted me. Travel is covered and arranged by them
- [ ] Confirm with Jek: start time and arrival time, whether there's a team briefing, which team I'm in, whether P012 provides AI tool accounts (the ToR says that budget line was empty)
- [ ] Join / check the P012 Slack (the "Context P012" canvas) for the latest agenda and team list
- [ ] Install local AI so it's not downloaded on venue Wi-Fi:

```bash
brew install ollama
```

```bash
ollama pull qwen3:8b
```

```bash
ollama pull gemma4:e4b
```

(Check the exact Gemma 4 tag on ollama.com first. Optional for transcription demos: `brew install whisper-cpp` plus a downloaded model, or the Buzz app.)
- [ ] Log in and test: Google AI Studio, NotebookLM, Gemini, ChatGPT, Claude, Figma (so I can view the designer's file)
- [ ] Prepare a **dummy/public data pack** in a folder on the laptop (see below)
- [ ] Skim [phase1-research-recap.md](phase1-research-recap.md) once more, especially the quotes and personas

### Dummy / public data pack
- 1-2 public BPS tables on an environmental topic (e.g. forest area or air quality in Jawa Barat)
- 1 public regulation from JDIH / peraturan.go.id (e.g. on AMDAL or waste)
- 1 public news article on an environmental issue (from Mongabay, Ekuatorial, or Bandung Bergerak)
- 1-2 min of public audio with Indonesian, ideally with some Sundanese mixed in (a public hearing, podcast or YouTube talk), plus its rough transcript
- A fake interview transcript with fake names, NIK, phone numbers (for the redaction demo)
- 2-3 photos of fake/blank receipts (kuitansi)
- A fake contributor payment sheet

### Bring on Wednesday
- [ ] Laptop + charger + a small extension cord (12 laptops, few outlets)
- [ ] **USB-C to HDMI adapter.** The venue ToR says the projector needs an HDMI cable, and the closing has each team present its prototype. The M4 Air has no HDMI port
- [ ] Phone hotspot as Wi-Fi backup (the venue ToR: "Teams use AI tools online to build demos")
- [ ] Phone with camera and storage free: card field 7 asks for "a photo of the paper sketch, a screenshot, or a link to the mock-up"
- [ ] A way to share a demo link fast (GitHub Pages / Vercel / a shared Google Drive folder), so the team can paste it into field 7
- [ ] KTP
- [ ] Any travel tickets or bookings Labtek Indie sends
- [ ] Water, a jacket for AC rooms

P012 brings paper, sticky notes, markers and **printed prototype cards** (venue ToR), so no need to bring those. The same table lists "Laptops, AI tool accounts" as P012's, but the main ToR says the token/subscription budget line is empty. Assume I use my own laptop and accounts unless Jek says otherwise.

### Things from the PDFs worth knowing on the day
- **Names (ToR, Sessions 1-2 core team):** lead facilitator Dea Chandra Marella; co-facilitators Nurizka Fitrianingrum, Radiva Nida Nabila, Shafaa Nidaa; other AI devs Rian Cintiyo, Irfan Yas; designers Rizza Pratama Putra, Mizan Ash Shidiq, Ardhiya Febrian Rachman; local consultant (QA/QC) Amanda Mita; project lead and PM Jek
- **The ToR planned a briefing for AI devs and designers** on the research and lo-fi methods. I joined late as Salman's replacement, so ask Jek if there were slides or notes from it
- **Journocoders participants are expected to understand AI tools** (Bahasa ToR v2), so I can go one level more technical than with a general room
- **Dea's own HMW example** is about pain point #1: "menilai kelayakan dan kemutakhiran data dari banyak portal pemerintah di tahap research... tanpa menambah beban editor untuk mengecek ulang sumbernya". Expect at least one team near that problem
- **"We do not arrive with ideas; the teams generate them."** Prep building blocks (data pack, prompts, a blank demo page), never a finished solution to pitch
- **Recording and photos are by consent, asked at the start.** Prototype documentation is published openly with co-creator credit, licence TBC

## After the session
- Write my own notes the same evening: what each team built, what journalists rejected and why, what I'd build differently. Add a `session-1-notes.md` here
- Thank Salman, tell him how it went ("I owe you one" goes both ways)
- If it went well, tell Jek I live in Bandung and am available for Sessions 3-5 at Fragment Project (the ToR says that team "will be confirmed separately"), and interested in the 2027 working-model and pilot phase
- Ask whether the session summary (due 11 Nov) and prototype cards can be shared with me
