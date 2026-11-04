---
purpose: Recap of the workshop deck the lead facilitator will run on the day, so I know every step and my role in it
source: sources/workshop-deck-dea-chandra-marella.pdf ("Seni Membedah Masalah dengan Design Thinking", Dea Chandra Marella, The Good AI, 35 slides)
last_updated: 2026-11-02
---

# Workshop Method: "Seni Membedah Masalah dengan Design Thinking"

The deck is labelled "Mei 2026, The Good AI, Hack your Innovation, PPSDM Kemnaker", so it's adapted from an earlier design thinking training. Slide 3 introduces the **"Co-fas, AI Eng & UI/UX Designer"** roles, so the team (me included) may be introduced at the start.

## Lead facilitator: Dea Chandra Marella

Research Manager and Innovation & Productivity Training Program Manager with an independent research and policy consultancy supporting a national-level government institution. Advisory board member for an engineering major at a university. 9+ years leading research, human-centred design, consumer insights across health tech, education, public services, digital products. Contact on the slide: deachandramarella@gmail.com.

## "Today's menu" (the 4 promises to journalists)

1. **Rough prototypes, not finished products.** Sketch, clickable mock-up or simple demo.
2. **Built around your experience.** Journalists choose problems and judge ideas. The AI dev, designer and facilitator help make it tangible quickly.
3. **Humans stay in charge.** Every prototype shows where the journalist checks, corrects or decides.
4. **Credited and open.** Prototype card, shared within the project, credited as co-creator.

## Ground rules (Kesepakatan)

1. Contribute actively
2. Questions are welcome while explanations are running
3. Respect whoever is speaking

## Frameworks used

- **Design Thinking**: Empathize, Define, Ideate, Prototype, Test. An iterative space for understanding, exploration, execution.
- **Double Diamond**: diverge and converge ("melebar dan mengerucut"), first on the problem, then on the solution.

## Step by step, with what I do

### DEFINE: why it matters
"A problem well-defined is a problem half-solved." Focus energy on what matters, avoid irrelevant solutions, set measurable outcomes.

**Menyaring masalah (filtering)**
- Study the pain points in front of you
- Pick 3 clusters that relate to you
- Write reasons/examples on sticky notes
- Share in the group

**Memilih masalah (choosing)**: group similar problems, **dot vote**, then sanity-check with:

| Question | Answer |
|---|---|
| Does this happen in your newsroom? | Yes / No |
| Which persona feels it most? | Write the role on a sticky |
| When does it usually happen? | Pick the workflow stage (1-8) |
| How heavy? | 1 (light) to 5 (very heavy) |
| Routine or situational? | Pick one |

**My job here:** listen hard, ask "boleh contoh konkretnya?" and note the exact words. Concrete stories make the prototype and fill card field 1 (the quote). Don't propose solutions yet.

### Kalimat tantangan (How Might We)
Turn the problem statement into a challenge addressed to the group. HMW opens exploration, doesn't restrict it.

Structure on the slide: **BAGAIMANA KITA BISA + [predikat me-] + membantu jurnalis + [kebutuhan user] + [konteks & keterangan]**

Example from the deck:
> "Bagaimana kita bisa menilai kelayakan dan kemutakhiran data dari banyak portal pemerintah di tahap research, dalam deep mode, tanpa menambah beban editor untuk mengecek ulang sumbernya?"

ToR template: "How might we help [who] with [problem] at [workflow stage]?"

Tips for a strong HMW:
- Start from insight, not assumption
- Use active verbs: meningkatkan, mengurangi, memperkuat, mempermudah
- HMW is a direction to explore, not a solution

**My job here:** check the HMW isn't secretly a solution ("Bagaimana kita bisa bikin chatbot..." is a solution, not a problem). Nudge toward the "tanpa menambah beban..." clause, because that's the total-workload test.

### IDEATE
Rules: no judging ideas, "yes, and" (add or modify), weird/crazy/receh ideas very welcome, focus on the HMW, draw it, as many as possible.

Techniques listed: Mind Mapping, **SCAMPER** (Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse), **Crazy 8s** (8 ideas in 8 minutes, 1 per minute on a paper folded into 8), Worst Possible Idea.

Flow on the day: write ideas for your HMW (8 min), tell them in the group (10 min), cluster similar ideas (5 min).

**My job here (ToR: "the AI developer says what is feasible"):**
- Do my own Crazy 8s too, but don't dominate. Journalists lead.
- When an idea comes up, give a quick feasibility read **without killing it**: "bisa banget, ini mirip X" / "bisa, tapi butuh Y" / "susah hari ini, tapi kita bisa fake it".
- Offer "AI building blocks" as prompts when the team gets stuck (see [ai-dev-playbook.md](ai-dev-playbook.md)).

### Memetakan ide (idea mapping), the key decision tool

Ideas get rated 1-5 on two axes:

**Y axis, "Pengurangan beban bersih" (net workload reduction)**, average of:
- If chosen, how much time saved?
- Will it improve the quality of the news?
- How much cost saved?
- How much financial gain?

**X axis, "Kepekaan penilaian manusia" (how much human judgment/sensitivity is needed)**, average of:
- How much judgment/sensitivity/human assessment does it need?
- How dangerous is it if the result is wrong?

Image: [idea-mapping-matrix.png](sources/idea-mapping-matrix.png)

| Zone | Position | Meaning | Next step |
|---|---|---|---|
| **AI Otomatis** | High load reduction, low sensitivity | AI runs, human supervises | Main candidate. **Must show how the human checks a sample of the output** |
| **Interpretasi Terpandu** (Guided Interpretation) | High load reduction, high sensitivity | AI searches and assembles, human interprets and decides | Main candidate. **Must show the human control point and how to access the original source** |
| **Bantuan AI** | Low load reduction, low sensitivity | AI speeds up, human tidies | Backup. Pick only if nothing in the top half. "Coba naikkan Y dulu" |
| **Hanya Manusia** | Low load reduction, high sensitivity | High risk, little reward | Not prototyped. Logged as a finding: "AI belum diperlukan di sini" |

Note "net" (bersih) in the Y axis: this is Implication 2, total workload. An idea that saves the reporter an hour but adds an hour for the editor scores low.

**My job here:**
- Help the team rate "how dangerous if wrong" honestly. Engineers tend to underrate it. Journalists tend to overrate it for unfamiliar tech.
- For a **Guided Interpretation** idea, think ahead: where's the "open original source" button, where's the "verified by" checkpoint.
- For an **AI Otomatis** idea, think ahead: how does a human spot-check? This is where an **AI judge + human sample review** fits.
- If an idea lands in **Hanya Manusia**, say it out loud as a valid result, not a failure. The project explicitly wants those findings.

### PROTOTYPE
"Prototype is not the final solution, it's a question made tangible." (IDEO)
- Test feasibility before full build, get early feedback, reduce risk

A prototype must answer two questions:
1. **Will users use it?** Would they use it, would they "buy" it, would they choose it over other providers?
2. **How does it work?** Do users get what we mean and how it works? How does it feel when they try it?

**FAKE IT or MAKE IT**
- **Fake it**: the deck shows "Speedy System Kitchen" (a famous design-thinking reference: a fake/role-played version of the service). Paper prototype, Wizard of Oz (a human plays the AI behind the curtain), slides that look like screens.
- **Make it**: a working, minimal version.

Principles: start simple, test fast revise fast, use feedback (other teams as early testers), measure success (define an indicator that shows real impact).

**My job here:** decide with the designer, in the first 10 minutes of the build, **which single step is real and which is faked**. Usually: designer builds the clickable flow (Figma), I make the one AI step real with real (public/dummy) input so the output is genuine, and the rest is faked. A real AI output, even rough, gets much better feedback than a mocked one, because journalists can see where it breaks.

### TESTING
"The goal of testing is not validation, it's learning." (IDEO)
- See how users understand and respond
- Find what to simplify, strengthen, change
- Raises the chance of successful implementation

Tips: **don't be defensive, don't over-explain.**

Every participant gives feedback on:
- What's already good
- What needs fixing
- What questions came up while trying it
- What ideas came up while trying it

**My job here:** when other teams test ours, shut up and watch. Write down where they hesitate. When we test theirs, give honest feedback from the AI side (accuracy risk, data safety, maintenance cost), phrased simply.
