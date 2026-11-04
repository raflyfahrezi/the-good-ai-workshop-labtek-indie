---
purpose: How newsrooms outside Indonesia actually use AI (late 2025 to 2026), mapped to the 7 P012 pain points, plus the failures and lessons. Background for the 4 Nov workshop
source: web research on 2026-11-03. Mostly trade press (Reuters Institute, Nieman Lab, Press Gazette, GIJN). Items marked [secondary] or [unverified] come from directories, vendor blogs or summaries
last_updated: 2026-11-03
---

# AI in Journalism Abroad: What Newsrooms Actually Do

Language note: analysis in English. Lines to say in the room are in Bahasa.

## The big picture in 5 points

1. **Adoption is wide, payoff is modest.** The Reuters Institute *Trends and Predictions 2026* report (280 media leaders, 51 countries) describes ongoing adjustment, not a revolution. Secondary summaries say ~42% of leaders call AI's impact "limited so far" vs ~13% "transformational" [secondary]. Confidence in journalism's prospects is at an all-time low. https://reutersinstitute.politics.ox.ac.uk/sites/default/files/2026-01/Newman%20-%20Trends%20and%20Predictions%202026%20FINAL.pdf
2. **Big newsrooms use AI behind the scenes, not to write stories.** NYT, Reuters, the Guardian and the BBC all keep a human sign-off. The NYT allows AI for things like SEO headline ideas but not for writing articles.
3. **The biggest wins are in "reading a lot" tasks:** document dumps, financial data, public meetings, archives. That matches pain points 1 and 4.
4. **The scandals are almost always skipped verification**, not bad tools. Same as the Phase 1 finding: AI moves work to verification, and when nobody does that work, things break.
5. **Search traffic is collapsing and AI licensing is mostly for big publishers.** Small independents are largely left out of the deals, the same "value capture" problem as pain point 6.

## Examples mapped to the 7 pain points

### 1. Information discovery & sense-making

| Who | What | Note |
|---|---|---|
| **New York Times** | An ~8-person AI team works with reporters on specific stories and large document dumps (e.g. the Epstein files), and builds internal tools. **Echo** summarises long reports and background documents | https://www.thewrap.com/media-platforms/journalism/ai-in-newsrooms-2026/ , https://www.ire.org/2025/12/06/inside-the-new-york-timess-a-i-toolkit/ |
| **Reuters** | **Lynx Insight** analyses financial data in real time. **Fact Genie** processes corporate press releases. Some breaking financial alerts go out in 6-8 seconds. Its Syria atrocities investigation used custom AI tools to translate and search documents | Same sources as above |
| **Washington Post** | **Haystacker**, a news-discovery tool that pushes alerts to reporters and editors so they can evaluate leads fast [secondary] | https://innovation.media/insights/ai-powered-newsrooms-the-top-tools-and-case-studies-to-get-you-started |
| **ICIJ** | Built a machine-learning detector inside its open-source **Datashare** to flag passport information across millions of leaked records. **But:** ICIJ's Isabella Cota says she would never put a leaked document into online LLMs | https://gijn.org/stories/gijn-top-investigative-tools-2025/ |
| **OCCRP** | Prototype open-access AI tool to classify documents and prioritise information-rich pages, using data from its **Aleph** platform. Code on GitHub | https://www.tandfonline.com/doi/full/10.1080/17512786.2025.2465894 |
| **Document Q&A tools** | NotebookLM-style tools with line-level citations produce far fewer hallucinations. Also Trove, Arkham Mirror, Presswork.ai [secondary] | https://businessjournalism.org/2026/03/sabew-ai/ |

**Lesson for Wednesday:** even the most AI-forward investigative outfit (ICIJ) keeps sensitive documents away from cloud LLMs. Strong support for "local AI for data privacy".

### 2. Source access, safety & emotional judgement

Almost no AI examples found. The real-world tools are secure tip lines (SecureDrop, Hush Line, see [ai-tools-landscape.md](ai-tools-landscape.md)) and human guidance (Dart Center). It's a real finding: **abroad too, this is still mostly "Hanya Manusia" territory.** AI's role is at most to protect data (redaction), not to judge people.

### 3. Transcription

| Who | What | Note |
|---|---|---|
| **LocalLens** (US) | AI database that transcribes and summarises local government meetings. Reporters use it to find sources and follow meetings they can't attend. **Can't produce publishable stories or transcripts by itself.** Chalkbeat: "a supplement, not a replacement for reporters" | https://www.niemanlab.org/2025/03/local-newsrooms-are-using-ai-to-listen-in-on-public-meetings/ |
| **Civic Sunlight** (US) | Multi-model AI summaries of local government livestreams, started as a public newsletter | Same |
| **Tiny News Collective** (US small newsrooms) | Otter.ai for interviews and public meetings, ChatGPT for AP-style copy edits and summaries, AI to search city and school district documents | https://www.tinynewsco.org/how-tiny-newsrooms-are-using-ai-and-their-tips-on-effective-use/ |
| **Google Pinpoint** | Called the best free transcription option in a 2026 review, but no speaker ID and weaker on noisy, overlapping audio. whisper.cpp runs on-device so recordings never upload | https://mediacopilot.ai/the-best-ai-transcription-tools-for-journalists-hands-on-review/ |
| **American Journalism Project** | Quarterly-updated AI vendor guide for local newsrooms, starting with meeting transcription | https://theajp.org/introducing-a-new-ai-guide-for-local-news-editorial-teams/ |

**Lesson:** transcription is the most adopted AI use in small newsrooms abroad, and they still treat it as a **finding aid, not a final transcript**. Same as Yulia and Alin in the Phase 1 report.

### 4. Interruptions & reporting continuity

| Who | What |
|---|---|
| **The Guardian** | Moved from building products to training journalists and giving them internal tools, including **a chatbot that finds insights in the Guardian's own archive** |
| **NYT Echo** | Summaries of background documents, which helps re-entry into a story |

**Lesson:** "AI over our own material, with citations" is the common pattern. That's the "buku liputan" idea.

### 5. Audience & news distribution

| Who | What | Note |
|---|---|---|
| **Washington Post** | "Ask The Post AI", a reader chatbot answering from the archive [secondary] | |
| **BBC** | "At a Glance" summaries and Style Assist [headline-level only] | |
| **Daily Maverick** (South Africa) | Generative AI to summarise top stories and improve headlines | https://medium.com/damian-radcliffe/ai-and-journalism-in-the-global-south-moving-forward-79e866045245 |
| **India** | Virtual anchors on screen. A newsroom AI lab building a multilingual text-to-video tool, since video is huge in India | https://reutersinstitute.politics.ox.ac.uk/news/these-pioneers-are-working-keep-their-countries-languages-alive-age-ai-news |
| **CITE** (Zimbabwe) | AI news presenter "Alice" | https://reutersinstitute.politics.ox.ac.uk/news/journalismai-festival-2025-four-projects-caught-our-eye-and-few-rising-trends |
| **Legit.ng** (Nigeria) | Reportedly halved article production time in Hausa [secondary] | https://aifornewsroom.in/reports |

**Lesson:** the Global South cases are most relevant to Indonesia. Low-resource languages (Hausa, Indian languages) mirror Sundanese/Javanese. Video-first audiences mirror AyoBandung's "audiences prefer audio and video".

### 6. Revenue & content value

| What | Detail | Note |
|---|---|---|
| **Search traffic collapse** | Google organic referrals to 2,500+ news sites reportedly fell 33% globally (38% US) year over year. Publishers expect a further ~43% fall in 3 years [secondary] | https://www.politics.ox.ac.uk/news/news-publishers-expect-search-traffic-fall-more-40-next-three-years-new-risj-report-finds |
| **Microsoft Publisher Content Marketplace** | Announced 4 Feb 2026. Broker between AI developers and publishers, usage-based pay, publisher-set terms. Reported participants: AP, Condé Nast, Hearst, Business Insider, USA Today, Vox Media [secondary] | https://mediacopilot.ai/microsoft-publisher-content-marketplace-ai-licensing/ |
| **Amazon** | Reportedly exploring a content marketplace, not confirmed | |
| **Cloudflare** | Pay per crawl, moving toward pay-per-use (paid when content appears in an AI answer) | |
| **RSL (Really Simple Licensing)** | Sets licensing terms in robots.txt. Only works if AI companies honour it | |
| **TollBit** | Says it's on 7,000+ publisher sites | |
| **Lawsuits** | NYT and Daily News suing over scraping. US papers suing Brave, Canadian publishers suing Anthropic | https://pressgazette.co.uk/platforms/news-publisher-ai-deals-lawsuits-openai-google |
| **The catch** | Direct deals are mostly for big publishers. Independent publishers often aren't eligible. Nieman Lab calls it a "double bind" | https://niemanlab.org/2026/05/the-emerging-ai-content-licensing-market-puts-news-publishers-in-a-double-bind-a-new-report-warns |

**Lesson:** abroad, value capture is being solved by size (deals) or courts (lawsuits). Small newsrooms like Bandung Bergerak have neither. Collective bargaining (like AMSI's AMSInews.id plan) or Indonesia's Publisher Rights regulation is the realistic route. A prototype here would be more about **control and visibility** (who crawls us) than revenue.

### 7. Operational & administrative load

No journalism-specific examples found abroad. The tools are generic (OCR, invoice extraction, see [ai-tools-landscape.md](ai-tools-landscape.md)). Also a finding: **nobody has solved this for newsrooms yet**, so it's open space.

## Fact-checking (cuts across pain points 1 and 5)

- **Reuters Institute AI and the Future of News 2026:** at Spain's Maldita, 16% of the 619 claims fact-checked in 2025 involved AI-generated content, up from 7% the year before. AI made the job harder but also enabled new tools. https://reutersinstitute.politics.ox.ac.uk/news/ai-and-future-news-2026-what-we-learnt-about-its-impact-newsrooms-fact-checking-and-news
- **Full Fact AI** (UK): monitors TV, radio and social media for claims worth checking, live transcription, reportedly triages 300k+ sentences a day, subsidised licences for small newsrooms [secondary]
- **Aos Fatos** (Brazil): Busca Fatos for real-time fact-checking of live coverage
- **Tama Media** (francophone Africa): AKILI Check, an AI fact-checking assistant drawing on 50 trusted news sources
- **Google Fact Check Explorer**: has this claim already been checked?
- **BBC/EBU study (Oct 2025):** AI assistants misrepresented news content **45% of the time** (bad sourcing, invented details, outdated info)

## Environmental journalism (the project's focus)

- **Mongabay Forest Trackers** use Global Forest Watch "Places to Watch": near-real-time satellite data + automated algorithms + field intelligence to spot new deforestation. **Reporters then ground-truth it.** "You can't detect corruption from space." https://mongabay.org/impact/mongabay-investigates-tracking-deforestation-with-data-driven-journalism/
- **United Cacao case** (Peru): satellite imagery analysis showed the company misled the public about the land. Imagery helped secure prison sentences. https://www.esri.com/about/newsroom/publications/wherenext/united-cacao-and-amazon-imagery-analysis
- **Amazonía Traficada** (Bolivia, Oct 2026): Pulitzer Center, Mongabay, RAI Bolivia and Asuntos Centrales cross-referenced satellite imagery across 8 databases, plus 30+ interviews with Indigenous leaders. Built the **VISTA** platform. https://news.mongabay.com/2026/10/new-tool-reveals-siege-on-indigenous-lands-in-bolivias-amazon/
- **PrevisIA** (Brazil): AI forecasting deforestation risk from ESA satellite imagery, co-developed with Microsoft and Imazon. https://news.mongabay.com/2021/08/new-artificial-intelligence-tool-helps-forecast-amazon-deforestation/
- **Deforestation driver classification:** a ResNet model classified 7 drivers of tree cover loss, 2001-2022. https://india.mongabay.com/2025/08/satellite-data-and-ai-identify-deforestation-drivers/

**Lesson:** environmental AI journalism works as **AI flags + journalist verifies on the ground**. That's exactly "Interpretasi Terpandu". The Bolivia case (databases + satellite + Indigenous interviews) is a great model for West Java and the project's focus on indigenous knowledge. Journocoders already do forest-fire hotspot mapping, so this will resonate.

## Failures and what went wrong

From Press Gazette's live tracker and related reporting (https://pressgazette.co.uk/publishers/digital-journalism/ai-journalism-mistakes/):

| Case | What happened | Root cause |
|---|---|---|
| **Ars Technica** | Reporter fired after publishing quotes attributed to a real person who never said them. He said he trusted AI summaries without checking the originals | Skipped verification |
| **New York Times** (May 2026) | A politician "quote" was actually an AI-generated summary | Summary treated as source |
| **Financial Times** (Aug 2026) | Opinion article broke the FT's own AI guidelines | Policy not followed |
| **Dawn** (Pakistan) | A routine auto-industry report printed the full AI prompt | No final human read |
| **The Telegraph** | An AI editing note appeared inside a Trump/Xi story, removed after publication | No final human read |
| **Two Ohio newspapers** | An AI chatbot reportedly misidentified a murder suspect. Unionised staff withheld bylines over who's responsible | Accountability unclear |

Analysis: these come from pressure to "publish faster, with fewer people" (INMA, https://www.inma.org/blogs/ideas/post.cfm/why-ai-fails-when-newsrooms-need-it-most). Safeguards that work: BBC's rule that **no AI-assisted story is published until a journalist reviews and approves it**, disclosure, clear policies and contributor training.

**Lesson for Wednesday:** almost every failure is a **quote or claim cut off from its source**. This is the strongest argument for the "quote linked to audio" and "AI judge per claim" prototypes. Also: only **13%** of newsrooms in a Thomson Reuters Foundation Global South survey had an AI policy (https://reutersinstitute.politics.ox.ac.uk/news/many-journalists-global-south-are-already-using-ai-and-they-want-guidance-how-do-ethically). Bandung Bergerak already having one is ahead of the curve.

## Lines to use in the room

- *"Di luar negeri, redaksi besar seperti New York Times dan Reuters pakai AI paling banyak untuk membaca dokumen dalam jumlah besar, bukan untuk menulis berita. NYT bahkan melarang AI menulis artikel."*
- *"Hampir semua skandal AI di media luar negeri tahun ini sama polanya: kutipan atau klaim yang terputus dari sumber aslinya, lalu tidak dicek. Jadi prototipe kita harus selalu nyambung ke sumber."*
- *"ICIJ, konsorsium investigasi Panama Papers, tidak mau memasukkan dokumen bocoran ke AI online. Itu alasan kenapa AI lokal penting."*
- *"Di liputan lingkungan, polanya AI menandai lewat citra satelit, jurnalis memverifikasi di lapangan. Seperti kata Mongabay, korupsi tidak bisa dideteksi dari luar angkasa."*

## Gaps

No details found for AP's 2026 internal tools, the BBC's tools beyond names, InfoAmazonia's AI use, or a confirmed Rappler AI tool. Most figures come from trade press, some from secondary summaries.
