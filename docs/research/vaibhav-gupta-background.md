# Vaibhav Gupta: background and interview preparation

Research checked September 13, 2026, for a Builders@UVA interview on Thursday, September 17, 2026. This is host preparation, not public event copy. The proposed running time below is an editorial recommendation; the event's start time, venue and attendance format are not established here.

The strongest conversation is about judgment: an engineer who worked on demanding computer-vision systems repeatedly changed startup direction, then committed to the unusually difficult task of building a programming language. For a student audience, keep returning to concrete decisions, evidence from users and what someone can build this week. That framing is our interpretation, not a claim he has made about his life.

## Identity and public introduction

**Vaibhav Gupta is co-founder and CEO of Boundary, the company behind BAML.** Boundary's current team page identifies his previous work on Google Pixel 4 depth and face-unlock systems and Microsoft HoloLens. BAML is the product/language; Boundary is the company. No reviewed primary source establishes “WebHuff” as his name, project or handle. Treat that wording as an unresolved transcription, not something to publish. [Boundary team](https://boundaryml.com/who-are-we).

Suggested spoken introduction:

> Vaibhav Gupta is the co-founder and CEO of Boundary, the team behind BAML. Before Boundary, he worked on Google’s Pixel 4 and Microsoft’s HoloLens. Today we’ll talk about what he learned building those systems, how he found a problem worth committing to, and what that means for people starting to build now.

Public professional profiles: [Boundary](https://boundaryml.com/), [LinkedIn](https://www.linkedin.com/in/vaigup/), [GitHub: hellovai](https://github.com/hellovai), [BAML source](https://github.com/BoundaryML/baml). The GitHub profile lists BoundaryML and pins BAML and AI That Works. Personal contact details are deliberately omitted.

The event displays **Vaibhav Gupta (YC W23)**: [YC's company record](https://www.ycombinator.com/companies/boundary) confirms Boundary's Winter 2023 batch.

Portrait provenance: the event portrait comes from Boundary's [official team page](https://boundaryml.com/who-are-we), source asset `/profile-vbv.jpeg`, using its 384-pixel optimized variant. The event's outbound speaker link is his [LinkedIn profile](https://www.linkedin.com/in/vaigup/).

## Background and chronology

| Period | Supported background | Evidence and confidence |
| --- | --- | --- |
| December 2011–August 2012 | His public profile lists OneApp, an application-form builder for K–12 organizations, with messaging, administration and statistics. | [His LinkedIn project entry](https://www.linkedin.com/in/vaigup/). Self-reported historical project; not evidence of adoption or a continuing company. |
| University / 2015 | Studied computer science and electrical engineering at UT Austin. In a later interview he says he and Aaron Villalpando met around their 2015 graduation. | [Data Day Texas 2026 speaker bio](https://datadaytexas.com/2026/speakers), [SuperDataScience interview, 10:07](https://www.superdatascience.com/podcast/sds-859-baml-the-programming-language-for-ai-with-vaibhav-gupta). Organizer bio plus first-person account; degree combination is supported, but exact degree count and enrollment dates are not verified. |
| Early career; exact job dates unverified | Worked on real-time 3D reconstruction for HoloLens at Microsoft, and performance work on ARCore and Pixel face unlock at Google. | [YC founder profile](https://www.ycombinator.com/companies/boundary), [Boundary team](https://boundaryml.com/who-are-we). Do not describe him as sole creator of either product. |
| Before Boundary; exact dates unverified | D. E. Shaw work involved predictive pipelines. Founded LifePlusPlus, a computer-science bootcamp for people entering tech through nontraditional routes. | [Data Day Texas 2026 speaker bio](https://datadaytexas.com/2026/speakers). Published professional biography; no employer employment-date record or bootcamp outcomes independently checked. |
| Before Gloo | Experiments: bootcamp, Twitch ads, multiplayer tooling, creator financing, employee surveys. | [First-person retrospective](https://boundaryml.com/blog/5-years-12-pivots). |
| April 2022–February 2023 | Built, then abandoned Gloo voice collaboration; joined YC W23. | [Retrospective](https://boundaryml.com/blog/5-years-12-pivots); [YC](https://www.ycombinator.com/companies/boundary). |
| Later in 2023 | Tried API-key tooling, drive-through AI, embeddings and extraction. | [Retrospective](https://boundaryml.com/blog/5-years-12-pivots). YC preserves a later Gloo retrieval product's [launch](https://www.ycombinator.com/companies/boundary). |
| August 10, 2023 | Recalls sketching BAML; first compiler followed that weekend. | [Retrospective](https://boundaryml.com/blog/5-years-12-pivots); not an independently reconstructed commit timeline. |
| November 25, 2023 | Public BAML launch positioned it around typed prompting, testing and observability. | [Launch announcement](https://boundaryml.com/blog/typesafe-llm-baml-launch); date from the [official blog index](https://boundaryml.com/blog). |
| June 2024 | The team documented its C++-to-Rust migration, language interoperability, editor integration and playground. | [Sam Lijin's engineering account](https://boundaryml.com/blog/building-a-new-programming-language). This is team work, not all Vaibhav's individual implementation. |
| January–February 2025 | Gave the Data Day Texas LLM keynote; appeared on The Altered Perception and SuperDataScience. | [Conference program](https://datadaytexas.com/2025/sessions), [TAP episode](https://www.buzzsprout.com/1974728/episodes/16461643-making-llms-like-chatgpt-gemini-reliable-accurate-for-any-industry-w-vaibhav-gupta), [SDS episode](https://www.superdatascience.com/podcast/sds-859-baml-the-programming-language-for-ai-with-vaibhav-gupta). |
| 2025–2026 | Co-hosts AI That Works with Dex Horthy, with public recordings and working examples. Topics include evaluations, context, agent tools and production debugging. | [Show repository](https://github.com/ai-that-works/ai-that-works). Use the dated episode archive, not relative social-media timestamps. |
| 2026 | Presented “fighting slop with slop” at AI Engineer World's Fair, describing how the team works with coding agents. | [Organizer's recording and timestamped transcript](https://ai.engineer/talks/AMiyLItEtLA-fighting-slop-slop). A firsthand account of their process, not an independent audit of results. |

He reports **rejecting a proposed $15,000/month contract**, not losing that amount in existing revenue. Gloo collaboration and Gloo retrieval were distinct product phases. [Retrospective](https://boundaryml.com/blog/5-years-12-pivots), [YC launch](https://www.ycombinator.com/companies/boundary).

## Early projects: useful evidence beyond the founder biography

His public repositories offer more concrete starting points than a résumé. The dates below are GitHub repository creation dates, retrieved from the [first-party repositories API](https://api.github.com/users/hellovai/repos?per_page=100). They do not establish release dates, adoption, sole authorship or whether a project was coursework.

| Repository created | Artifact | Useful interview angle |
| --- | --- | --- |
| December 28, 2012 | [resume-online](https://github.com/hellovai/resume-online): a résumé generator described as using CodeIgniter. | What problem did he first build for someone else? |
| January 31–April 29, 2013 | [tic-tac-toe](https://github.com/hellovai/tic-tac-toe), [race-track](https://github.com/hellovai/race-track), [blackjack](https://github.com/hellovai/blackjack): reinforcement-learning experiments; race-track names Monte Carlo and TD(lambda). | What did he learn from agents before modern LLMs? |
| February 20, 2013 | [online-compiler](https://github.com/hellovai/online-compiler): a web interface whose [compile script](https://github.com/hellovai/online-compiler/blob/master/compile.sh) invokes existing compilers such as GCC/G++. | Distinguish building a compiler service from inventing a language/compiler; ask what drew him to developer tools. |
| February 27, 2013 | [know-events](https://github.com/hellovai/know-events): README proposes a graphical interface for UT's daily event emails. The public tree is sparse; it does not prove a working launch. | A direct student-community connection: was this ever used, and what did he learn trying to make campus information useful? |
| October 8, 2013 | [simplepad](https://github.com/hellovai/simplepad): described as a collaborative text editor. | Ask whether collaboration tools were a recurring interest long before Gloo. |

An optional opening within question 1: “Your GitHub goes back to campus-event tooling and game-playing agents in 2013. Which early project taught you the most?” An optional followup within question 8: “What did teaching at LifePlusPlus reveal about how people actually learn to program?” These are alternatives within the eight-question plan, not extra questions to squeeze into the schedule. [Project archive](https://github.com/hellovai?tab=repositories), [LifePlusPlus background](https://datadaytexas.com/2026/speakers).

## Projects and ideas worth knowing before the interview

**BAML's central bet.** His January 2025 essay argues that prompts belong in typed functions, alongside explicit model choices, testing and streaming behavior. He wants interoperability with existing languages and ordinary files/version control. He also admits having built his own React-like system before accepting that React was better; the essay links the old project. That gives a useful tension between justified invention and an engineer's urge to rebuild everything. [Vaibhav, “AI Agents Need a New Syntax”](https://boundaryml.com/blog/ai-agents-need-new-syntax), [linked SecretSanta code](https://github.com/vaibhav-trq/SecretSanta/blob/main/public/src/js/models/page.ts).

**A language is much more than syntax.** Sam Lijin's June 2024 account explains the compiler, runtime, bindings, package distribution, diagnostics and playground required for adoption. The team originally expected the Rust port to take four days and reported six weeks. This is a historical team estimate, not a universal productivity claim. [“Building a New Programming Language in 2024”](https://boundaryml.com/blog/building-a-new-programming-language).

**Valid structure is not correct meaning.** Sam Lijin's December 2025 article argues that enforcing an output shape can hide semantic errors. It includes receipt extraction examples and reproduction code. Attribute the argument to Sam/the team, not to Vaibhav as author. Treat the examples as demonstrations, not proof that constrained output is always worse: the shown comparisons also change prompts and reasoning instructions. A useful interview asks what evidence would settle a particular application's choice. [“Structured Outputs Create False Confidence”](https://boundaryml.com/blog/structured-outputs-create-false-confidence).

**Making AI-generated code reviewable.** In the 2026 AI Engineer talk, Vaibhav describes a shared architecture document, executable dependency rules, and agents writing BAML programs to expose problems. Humans triage the resulting issue suggestions. The transcript anchors are roughly 1:45 for shared rules, 4:00 for dependency checks, and 5:05 for the agent testing loop. Ask him to distinguish catching architectural violations from proving program correctness. [Recording and transcript](https://ai.engineer/talks/AMiyLItEtLA-fighting-slop-slop).

**The preparation behind apparent speed.** Sam's July 24, 2026 post reports six engineers building six additional SDK bridges in one week, after roughly two months of shared technical groundwork. It describes recursive type translation failures that adding isolated tests did not resolve. The interesting point is the work that made parallel implementation possible; the headline alone omits that cost. These are team-reported timings. [“Software Factories Still Need Human Operators”](https://boundaryml.com/blog/software-factories-need-human-operators).

**Teaching and taste.** The original TAP episode's show notes discuss his early coding experiences, an eBay internship and a C++ bootcamp. The audio was not transcribed or independently reviewed for this memo, so use these as open-ended prompts, not detailed biographical assertions. His conference bio also mentions table tennis and board games; those are suitable light closing topics without inventing rankings or achievements. [TAP producer's episode page](https://www.buzzsprout.com/1974728/episodes/16461643-making-llms-like-chatgpt-gemini-reliable-accurate-for-any-industry-w-vaibhav-gupta), [Data Day Texas 2025 bio](https://datadaytexas.com/2025/speakers).

## Eight questions, in recommended interview order

Use questions 1, 2, 4, 5 and 8 for a short interview. Keep 3, 6 and 7 available if an answer opens that thread. The followups are options, not a script to read in full.

### 1. Start with something he built

**“You worked on HoloLens and the Pixel 4. Pick one problem from that period that looked straightforward and turned out to be hard. What was actually going wrong?”**

Followups: “How did you isolate it?” “What did that teach you that you still use at Boundary?” Ask for an example he can discuss publicly; keep it understandable without specialist terminology. [Background: official team bio](https://boundaryml.com/who-are-we).

### 2. Recognizing demand

**“You loved using Gloo yourselves, but eventually stopped building it. What evidence did you dismiss for too long—and what finally changed your mind?”**

Followups: “What would you measure earlier now?” “For a student whose friends love their demo, what should they test next?” [Background: Vaibhav's retrospective](https://boundaryml.com/blog/5-years-12-pivots).

### 3. Working with a cofounder

**“You and Aaron knew each other before starting a company. What disagreement taught you whether you could make difficult decisions together?”**

Followups: “How did you resolve it?” “What should two students try together before becoming cofounders?” [Background: SDS interview, 10:07 and 48:34](https://www.superdatascience.com/podcast/sds-859-baml-the-programming-language-for-ai-with-vaibhav-gupta).

### 4. Why invent a language?

**“You once built your own React-like framework before adopting React. What made BAML a case where inventing something new was justified?”**

Followups: “Show us one task that made the case for a language.” “What would have convinced you to keep it a library?” Allow a brief whiteboard example, without making the event a setup tutorial. [Background: his syntax essay](https://boundaryml.com/blog/ai-agents-need-new-syntax).

### 5. A demo that survives real use

**“Say a student builds an AI tool to extract dates and locations from campus flyers. It works on their examples. What would you make them test before other people rely on it?”**

Followups: “What should happen when the flyer is ambiguous or the date is missing?” “What can a type system catch, and what still needs evidence from real users?” This is our hypothetical; it does not imply BAML was tested on this task. [Related team argument about structure and correctness](https://boundaryml.com/blog/structured-outputs-create-false-confidence).

### 6. What the human still owns

**“Your team wrote about building six SDK bridges in a week after months of groundwork. What did the humans have to understand before the agents could be useful?”**

Followups: “Which mistake survived the first tests?” “What would you tell a student tempted to skip learning the underlying system?” [Background: Sam Lijin's SDK account](https://boundaryml.com/blog/software-factories-need-human-operators).

### 7. Make the current engineering claim concrete

**“In your AI Engineer talk, you showed checks that stop agents crossing architectural boundaries. What is one rule you enforce, and one important failure those checks still cannot catch?”**

Followups: “What do you personally inspect before release?” “What has changed your mind about how much code a human needs to read?” [Background: talk, 4:00–5:05](https://ai.engineer/talks/AMiyLItEtLA-fighting-slop-slop).

### 8. End with something students can act on

**“You’ve said you look for technical depth and clear communication when hiring. What could a student build over the next month that would show you both?”**

Followups: “What should they explain in the writeup?” “Which impressive-looking projects tell you very little?” His February 2025 hiring process is historical, so ask what he values now rather than presenting it as current recruiting instructions. [Background: SDS interview, 44:04–45:54](https://www.superdatascience.com/podcast/sds-859-baml-the-programming-language-for-ai-with-vaibhav-gupta).

## Proposed short interview and audience Q&A

This is a suggested **30-minute slot**, not a confirmed event duration.

| Elapsed time | Plan |
| --- | --- |
| 0:00–1:00 | Brief introduction; invite people to note questions as they listen. |
| 1:00–5:00 | Question 1: one engineering story. |
| 5:00–9:00 | Question 2: what changed his judgment about users. |
| 9:00–13:00 | Question 4: why BAML deserved a new language. |
| 13:00–17:00 | Question 5: move a student project beyond a demo. |
| 17:00–20:00 | Question 8: practical advice for the next month. |
| 20:00–29:00 | Audience questions; aim for three or four with short followups. |
| 29:00–30:00 | Thank Vaibhav and point to the public BAML repository and AI That Works archive. |

Moderator opening for the Q&A: “Let’s take questions. Give us one sentence of context and one question.” Repeat questions so everyone can hear, especially if the guest joins remotely. Invite first-time questioners, group duplicates, and redirect long product pitches toward the actual question. If the room is quiet, seed one of these:

- “What is something you would build now if you were back in college?”
- “How do you choose between learning a new tool and finishing the project you already started?”
- “What would make you tell a team that BAML is unnecessary for their use case?”
- “Which problem in your own workflow would you most like someone in this room to solve?”

For a 20-minute total slot, use questions 1, 2 and 5, then reserve seven minutes for audience questions and one minute to close. Do not rush all eight questions into the shorter format.

## Best preparation links

1. [Vaibhav's startup retrospective](https://boundaryml.com/blog/5-years-12-pivots): read for decision points; don't turn its pivot count into the entire introduction.
2. [SDS 859, February 4, 2025](https://www.superdatascience.com/podcast/sds-859-baml-the-programming-language-for-ai-with-vaibhav-gupta): transcript anchors 10:07 (cofounder/background), 15:41 (changing his view of AI engineering), 44:04 (hiring), 48:34 (working together).
3. [AI Agents Need a New Syntax](https://boundaryml.com/blog/ai-agents-need-new-syntax): his own explanation of why ordinary libraries felt insufficient.
4. [AI Engineer recording](https://ai.engineer/talks/AMiyLItEtLA-fighting-slop-slop): his more recent engineering process; use the actual transcript rather than only the organizer's summary.
5. [AI That Works archive](https://github.com/ai-that-works/ai-that-works): dated recordings and code, including June 23, 2026's language-testing loop and July 7's agent observability episode.

## Limits and checks before going on stage

- **Identity collisions:** searches return unrelated founders, authors and professionals named Vaibhav Gupta. The Boundary/YC/UT Austin/Microsoft/Google chain is the relevant person. “WebHuff” remains unverified.
- **Employment dates:** the reviewed sources establish work areas but not a complete month-by-month résumé. Do not invent ordering or precise tenure beyond what is stated above.
- **Pivot counts differ:** his retrospective says 12; SDS says 13. The discrepancy is unresolved; avoid asserting a definitive count. [Retrospective](https://boundaryml.com/blog/5-years-12-pivots), [SDS](https://www.superdatascience.com/podcast/sds-859-baml-the-programming-language-for-ai-with-vaibhav-gupta).
- **Attribution:** the compiler, structured-output and SDK articles cited here are by Sam Lijin. They describe the team's work, not achievements to assign solely to Vaibhav.
- **Business and performance claims:** no independently audited current revenue, funding total, active-user count or model benchmark is established here. GitHub stars, historical customer quotes and vendor demonstrations are not substitutes.
- **Dates:** BAML article dates use the official blog index. TAP's producer page says January 18, 2025, while some distributors say January 19; cite it as January 2025 unless the precise day matters. No source dated after September 13, 2026 is used as evidence of an event that already happened.
- **Before the session:** confirm pronunciation directly, final start time, location/remote link and agreed duration. Ask whether he prefers a purely conversational interview or a short demonstration. These are logistics to settle, not reasons to delay a coming-soon page with date and speaker.
