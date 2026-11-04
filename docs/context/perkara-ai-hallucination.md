---
purpose: Lessons from Perkara AI (Ibrahim Arief) on reducing hallucination over thousands of pages, and how to bring them into a local-LLM prototype on Wednesday
source: X threads by @ibamarief (25 Oct, 31 Oct and 2 Nov 2026), 22-second feature video (Downloads/cOhV1nktObZN7A0x.mp4, no audio), Tirto interview "Perkara AI: Inovasi Ibam Arief Melawan Kriminalisasi Hukum" (2 Nov 2026)
last_updated: 2026-11-02
---

# Perkara AI: Reducing Hallucination, and Why It Matters for Wednesday

Language note: the analysis is in English. Anything meant to be **said to journalists, shown on screen, or sent to a model** stays in Bahasa Indonesia.

## In short

Perkara AI was built by **Ibrahim Arief (Ibam)**, former VP of AI at Bukalapak, to dissect his own case files in the Chromebook case: about **5,000 pages of files and BAP (witness examination records) from ~200 witnesses**, plus **~120 hours of trial recordings**. It's now a startup (@ainunnajib as founder, first paying users, pre-seed stage). They plan to release part of it as an **open-source Community Edition**, and to offer it free for pro bono cases at LBH (legal aid institutes).

The problem he's fighting is the same as the journalists' pain points: scattered, huge document sets, spoken testimony that has to be matched against documents, and off-the-shelf AI that hallucinates. In his 31 Oct thread he says ChatGPT/Claude/Gemini already hallucinate at around 150 pages.

The hallucination example he gave Tirto: a lawyer for another defendant put ~100 pages of the indictment into a chatbot to summarise. The summary said Ibam attended a meeting in 2019, when he was actually in London for job interviews.

## The recipe (from the video and the interview)

### 1. Don't throw raw documents at a chatbot. Build a "case brain" first

The feature video shows the **"Data › Temuan AI"** page. Its description reads:

> "Seluruh informasi perkara ini tersusun dalam 11 lapisan yang saling terhubung, satu lapisan untuk tiap tahap pengolahan. Fakta jadi lebih mudah ditelusuri sampai ke berkas asalnya. Ada 411.856 data dan 442.160 hubungan yang sudah dianalisis."

(All case information is organised into 11 connected layers, one per processing stage, so facts can be traced back to their source file. 411,856 data points and 442,160 relationships analysed.)

| Group | Layer | Count | My reading |
|---|---|---|---|
| **L1** Input | Berkas | 144 | Uploaded files |
| | Segmen | 5,661 | File chunks (likely per page or section) |
| | Pindaian | 11,322 | Scans/OCR (2x the segments, maybe two scan versions per segment) |
| **L2** Recognition | Teks | 237,947 | Extracted text units (sentences/paragraphs) |
| | Klasifikasi | 410 | Content-type labels |
| | Dokumen | 480 | Recognised logical documents (witness A's BAP, indictment, etc.) |
| **L3** Structure | Struktur | 140,792 | Entities and relations: people, events, times, places |
| **L4** Knowledge | Pernyataan | 6,946 | "Who said what, where" |
| | Fakta | 6,916 | Facts supported by statements/evidence |
| **L5** Reasoning | Premis | 967 | Argument premises built from facts |
| | Sintesa | 271 | Conclusions/findings (irregularities, contradictions) |
| | Lintas lapisan | 163,729 | Cross-layer links: the trail from a synthesis down to the original file |

The right panel shows a timeline (21:13, 21:23 ... "30 Okt 2026, 14:48, Kini") with entries like "Sintesa +2 · Premis +3, percakapan". So **every user conversation adds new premises and syntheses to the case brain**. Knowledge accumulates and persists instead of being lost each chat session.

Key point: **out of 5,000 pages, what the AI ends up "reasoning over" is only ~7,000 small facts and statements**, each traceable down to its segment and source file. The AI never has to "read 5,000 pages at once".

Frame saved at [sources/perkara-ai-temuan-ai-layers.png](sources/perkara-ai-temuan-ai-layers.png).

### 2. Layered agents, including an auditor and a judge

From the Tirto interview:
- **Analyst agents** look at the question from several angles
- An **auditor AI** checks whether the generated answer actually exists in the original source ("ngeverifikasi jawaban yang dihasilkan, benar enggak sih ada di sumber aslinya")
- A **judge AI** merges all the inputs and checks again whether the analysis is accurate
- For complex questions the system **plans the search first**, splits the work across agents, searches documents, re-checks sources, then writes the answer

This is exactly Salman's keyword: **AI Judge**.

### 3. "Not found" is an allowed answer

The system can answer that information isn't found in the available data. It's not forced to produce an answer when the source doesn't exist. This is one of the cheapest and most effective ways to reduce hallucination.

### 4. Every claim links to the original document

"Semua hal-hal yang disebut dalam bedah saksi itu, itu pasti ada link untuk ngecek dokumen aslinya." The point is that lawyers don't just receive conclusions, they can check the basis. This is Implication 1 from the Phase 1 research.

### 5. Deliberately slower

- Normal answer: **30 seconds to 3 minutes**
- "Bedah Saksi" (witness deep-dive, the most expensive feature): **tens of minutes to ~1 hour** per witness
- Processing a ~5,000-page case from scratch: **~10-12 hours**

Slowness is the price of verification. In Phase 1 terms: extra machine time cuts human verification time later, so **total workload goes down**.

### 6. Trial recordings feed the same brain

120 hours of recordings are transcribed, speakers identified by voice characteristics, then linked into the knowledge structure. Result: search for statements without relistening to everything, and **compare a witness's statement in the BAP vs in court**.

### 7. Humans still decide

"AI Bukan Menggantikan Advokat" (AI doesn't replace lawyers). AI finds, connects, looks for contradictions, prepares material. Legal decisions, strategy and accountability stay with humans. Same as The Good AI's Human in the Loop principle.

## Update 2 Nov: the secret is the "semantic model"

The 2 Nov 11:00 WIB post (https://x.com/ibamarief/status/2117104412824944848) spells out the recipe.

**The common mistake.** A company gave its AI agent direct database access and expected the model to decide and execute its own SQL queries to answer users. Answers came out circular and off-topic. Ibam's view: even 2026 frontier models often fail when one question can be interpreted as thousands of different queries over raw data. **Step one: know the limits of your model.**

**The "aha moment":** designing a **semantic model** as a bridge between the AI models and the data. For Perkara AI that's a **multi-layered knowledge graph**, where some layers use an **ontology** designed specifically for the semantics of legal case investigation. That's the 11 layers in the video. One case can hold ~1 million entities and relationships.

**Why raw queries fail.** Question: "list every meeting that a given witness claims his employees held with Official Z". An agent might write:

```sql
SELECT DISTINCT k.nama
FROM karyawan k
JOIN dokumen d ON d.isi LIKE '%' || k.nama || '%'
WHERE d.isi LIKE '%Pejabat Z%'
  AND d.isi LIKE '%meeting%';
```

Looks fine, but the sentence "Tolong sampaikan ke Pak Z, Budi tidak bisa ikut meeting" ("Please tell Mr Z that Budi can't join the meeting") becomes a false positive. The query can't understand the meaning of "can't join".

**With a semantic model**, agents never hit raw data. They use high-level graph queries like:

> "Siapa saja <orang <tipe karyawan>> yang <bekerja di> <perusahaan X> dan <mengikuti> <event <tipe meeting> <pada tanggal Y> <bersama <orang <tipe pejabat>> Z>>?"

Semantic relations like `<mengikuti>` (attends) are what the model uses to pick the right predicate. The graph results then power case analysis, witness deep-dives, and RAG for chat answers.

**Implementation**: Perkara AI uses an **event-driven ETL pipeline** to reorganise raw data. In some cases **PostgreSQL materialized views** are enough. His advice: ask your coding agent which approach fits.

**Just as important: design the ontology.** An export-import business needs a different ontology from a hospital or a court case.

### Why this reduces hallucination (and suits local models)

Understanding meaning moves to the **extraction stage**, where the model reads one small chunk and fills predefined categories. "Budi tidak bisa ikut meeting" gets extracted once as `Budi <tidak hadir di> rapat` and stored with its source ID. At question time, the model doesn't write free-form SQL. It picks a question type and relations from an existing list.

Both tasks are narrow and checkable, exactly what 7-9B models are good at. "Read everything, then invent a query" is the task that makes small models hallucinate most.

### The ontology is an editorial decision, not an engineering one

This is the best co-creation angle for Wednesday. **An ontology is the list of "kinds of things" and "kinds of relationships" that matter to the reporting.** Journalists know that better than the AI developer. How to explain it to journalists:

> "Sebelum AI bisa menjawab dengan benar, kita sepakati dulu kategorinya, mirip rubrik atau tag di redaksi. Apa saja 'jenis hal' yang penting di liputan lingkungan, dan apa saja 'jenis hubungannya'? AI kemudian cuma bertugas mengisi kategori itu dari dokumen, satu potong demi satu potong, dan setiap isian ada alamat sumbernya."

A mini ontology for environmental journalism (a conversation starter only, journalists should revise it). Labels stay in Bahasa because they'd appear on screen:

| Entity type | Example |
|---|---|
| Orang (warga, pejabat, karyawan, ahli) | Kepala desa, Direktur PT X |
| Organisasi (perusahaan, instansi, LSM) | PT X, DLH Kabupaten Y |
| Lokasi | Desa, DAS, kawasan hutan |
| Izin/dokumen hukum | AMDAL, IUP, persetujuan lingkungan |
| Peristiwa | Konsultasi publik, banjir, pencemaran, demonstrasi |
| Data | BPS figures, water quality test results |
| Pernyataan | Quotes from interviews, press releases, documents |

| Relation | Example |
|---|---|
| `<menyatakan>` (states) | Direktur PT X menyatakan "limbah sudah diolah" |
| `<memiliki izin>` / `<mengajukan izin>` (holds / applied for permit) | PT X memiliki AMDAL nomor ... |
| `<terjadi di>` / `<pada tanggal>` (happened at / on) | Banjir terjadi di Desa A, 3 Maret |
| `<hadir di>` / `<tidak hadir di>` (attended / did not attend) | Warga hadir di konsultasi publik |
| `<didukung oleh>` (supported by) | Klaim didukung data uji air |
| `<bertentangan dengan>` (contradicts) | Pernyataan PT X bertentangan dengan uji lab |
| `<bersumber dari>` (sourced from) | Every entity and relation points to a source segment ID |

### Lo-fi version without a graph database

For a 3-hour demo, no Neo4j needed:
- Tables (SQLite, Google Sheets, or JSON) for `entitas` and `relasi` (subject, predicate, object, quote, `segmen_id`)
- A local model extracts relations per paragraph **using only predicates from the ontology list** (JSON schema with an `enum` for predicates)
- Journalist questions are answered through **3-5 prepared question templates** ("semua pernyataan [orang] tentang [topik]", "siapa yang hadir di [peristiwa]", "pernyataan yang bertentangan dengan [data]"). The model only picks a template and fills its parameters. It never writes SQL.
- Auditor and judge (below) check the quotes

On the prototype card this gives a strong answer to field 6 (where the human decides): **journalists approve the ontology, and journalists decide which `<bertentangan dengan>` relations are worth following up.**

## Why this matters for Wednesday

The analogy works directly in the room, because data journalists get it:

| Perkara AI | Newsroom |
|---|---|
| 5,000-page case file | AMDAL documents, BPS data, JDIH regulations, past coverage |
| Witness BAP | Interview transcripts |
| Trial recordings | Field interview recordings, DPR hearing recordings |
| "Bedah Saksi" (witness deep-dive) | **"Bedah Narasumber"** (source deep-dive): compare what one source said across interviews against official documents |
| BAP vs testimony in court | Quote in the draft vs the original recording, or an official's claim vs the documents |
| Case brain that keeps growing | A "buku liputan" (story case file) that survives interruptions (pain point 4) |
| Analyst agents → auditor → judge | **Reporter → fact-checker → editor** |

Best-matching pain points: **1 (information discovery & sense-making)**, **3 (transcription)**, **4 (reporting continuity)**. Journocoders do a lot of data-driven investigative work, so "find contradictions across sources" will likely appeal to them.

A line I can use:
> "Pendekatan yang terbukti di berkas hukum ribuan halaman: jangan suruh AI membaca semuanya sekaligus. Pecah dulu jadi fakta-fakta kecil yang masing-masing punya alamat sumbernya. Lalu ada AI kedua yang tugasnya cuma ngecek, mirip pemeriksa fakta, dan AI boleh bilang 'tidak ditemukan'. Ini sama dengan alur reporter, pemeriksa fakta, editor yang sudah teman-teman jalani."

## How to reduce hallucination with a local LLM

This matters even more locally. A 7-9B model on a laptop **hallucinates sooner than a large model**, especially on long input. So Ibam's recipe fits local best: **break the work into small tasks**, because small models are good at narrow tasks (extract, classify, match) and weak at "read 300 pages and conclude".

Techniques, ordered from highest impact and lowest cost:

1. **Split, label, store.** Chunk documents per page/paragraph with IDs (`DokA-h12-p3`). Every later step must cite these IDs.
2. **Small extractions, not big summaries.** One model call per chunk: who, said what, when, exact quote, chunk ID. Use **structured output** (Ollama supports `format` with a JSON schema) and **temperature 0**.
3. **Answer only from retrieved material.** For a question, first retrieve the relevant chunks/facts (keyword or embedding search), then the model may only answer from those, citing IDs. Better still, go through the semantic model and question templates above.
4. **Allow "tidak ditemukan".** Say it explicitly in the prompt. Small models really need this permission.
5. **Deterministic auditor first, AI second.** Use plain code to check that every cited quote **exists verbatim** in its source chunk. No AI, can't hallucinate, and catches the most common errors (invented quotes, wrong IDs). Example below.
6. **Per-claim judge.** For what passes the auditor, a judge model checks whether the quote actually supports the claim: DIDUKUNG / TIDAK DITEMUKAN / BERTENTANGAN (judge prompt in [prompts.md](prompts.md) #2). Ideally use a different model family (e.g. Qwen writes, Gemma judges).
7. **Show the status to humans.** Green/yellow/red, source links, and the editor decides. Log every time the editor overrules the judge (evaluation data).

Honest caveats:
- This **reduces** hallucination, it doesn't eliminate it. The judge can be wrong too, especially a small local one. That's why step 5 (code check) matters.
- Up-front extraction takes time (Ibam: 10-12 hours for 5,000 pages, with large models). For a laptop demo, 3-5 short documents is enough.
- All Perkara AI figures and claims above come from its founder (X threads and the Tirto interview), not independently verified.

### Deterministic auditor (Python, no AI)

```python
import re

def norm(s):
    return re.sub(r"\s+", " ", s).strip().lower()

def audit(claims, segments):
    """claims: [{"kutipan": "...", "segmen_id": "DokA-h12-p3"}]
       segments: {"DokA-h12-p3": "original chunk text"}"""
    for c in claims:
        src = segments.get(c["segmen_id"])
        if src is None:
            c["audit"] = "ID SUMBER TIDAK ADA"
        elif norm(c["kutipan"]) in norm(src):
            c["audit"] = "KUTIPAN DITEMUKAN"
        else:
            c["audit"] = "KUTIPAN TIDAK ADA DI SUMBER"
    return claims
```

### Structured extraction on Ollama (local)

Field names and the prompt stay in Bahasa because they're model input and on-screen output.

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3:8b",
  "stream": false,
  "options": {"temperature": 0},
  "format": {
    "type": "object",
    "properties": {
      "pernyataan": {"type": "array", "items": {"type": "object",
        "properties": {"siapa": {"type": "string"}, "isi": {"type": "string"},
                       "kutipan": {"type": "string"}, "segmen_id": {"type": "string"}},
        "required": ["siapa", "isi", "kutipan", "segmen_id"]}}
    },
    "required": ["pernyataan"]
  },
  "messages": [{"role": "user", "content": "Ambil setiap pernyataan narasumber dari segmen berikut. Kutip persis. Jika tidak ada pernyataan, kembalikan daftar kosong.\n\n[DokA-h12-p3] ..."}]
}'
```

## Lo-fi demo for Wednesday (if the team heads this way)

**Mini "Bedah Narasumber"**, for pain points 1/3/4. Dummy/public data only.

1. **L1**: 3-4 short public documents (an old article, a company press release, a public AMDAL excerpt) + 1 dummy interview transcript. Chunk per paragraph with IDs.
2. **L2-L4**: the local model extracts "who said what" into JSON, using only ontology predicates (curl example above).
3. **Journalist question**: "Apa saja yang dikatakan Pak X soal limbah, dan apakah bertentangan dengan dokumen?"
4. **Auditor**: the Python script checks quotes exist in the source.
5. **Judge**: per claim, DIDUKUNG / TIDAK DITEMUKAN / BERTENTANGAN.
6. **Screen** (designer, Figma or a Claude artifact): three columns, finding | evidence + source link | journalist action (Terima / Cek ulang / Butuh liputan tambahan). A small "trail" visual from finding down to source paragraph, inspired by Perkara AI's layer view.
7. **Human decision point** (card field 6): the journalist decides which contradictions are worth pursuing. The AI never concludes that a source is lying.

Remember: ideas still come from the journalists. This is only a building block if the team heads here.

## Careful when using this example in the room

The Chromebook case is ongoing. Ibam was sentenced to 4 years by the Jakarta Tipikor Court (May 2026) with two judges dissenting, the High Court added a Rp 5 billion restitution obligation (the sentence was reportedly made heavier), and he has filed a cassation appeal. In front of journalists, present it as **a technical example**, not a position on the case. Enough to say: "ada contoh di dunia hukum, Perkara AI, yang menangani berkas ribuan halaman dengan pendekatan ini."

## Sources

- X thread 25 Oct 2026: https://x.com/ibamarief/status/2114332828326580447
- X thread 31 Oct 2026 (feature video): https://x.com/ibamarief/status/2116500288467321058
- X thread 2 Nov 2026, first "rahasia dapur" post (semantic model, knowledge graph, ontology): https://x.com/ibamarief/status/2117104412824944848 . The 31 Oct post said he'd share more, so watch for follow-ups.
- Tirto interview (published 2 Nov 2026): https://tirto.id/perkara-ai-inovasi-ibam-arief-melawan-kriminalisasi-hukum-hEti
- Case context: https://nasional.kompas.com/read/2026/05/13/06400591/saat-hakim-terpecah-dalam-vonis-ibrahim-arief-diputus-bersalah-tetapi?page=all , https://www.hukumonline.com/berita/a/ibam-ajukan-kasasi-di-kasus-chromebook-lt6aa7a5d879b2b/
