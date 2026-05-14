---
title: Building 3PPS.info
date: 2026-05-14
excerpt: Why I built a plain-English guide to the USPTO's Third-Party Preissuance Submission process, and what I learned trying to explain a legal procedure to people who don't want to become lawyers.
---

The America Invents Act of 2011 created something genuinely useful and almost entirely unknown: a statutory window where any member of the public can submit prior art directly to a patent examiner before a patent issues. The mechanism is called a Third-Party Preissuance Submission — 3PPS for short — and it's codified under 35 U.S.C. § 122(e).

I knew about it professionally. I've used it. But when I started looking for plain-English explanations I could point a non-lawyer founder toward, I mostly found either dense practitioner guides or law firm blog posts that existed to generate leads. What didn't exist was a resource that actually explained the process — the real constraints, the real workflow, the realistic impact — in terms a technically literate person without a JD could act on. So I built one.

## What the process actually is

A 3PPS lets anyone file prior art documents with the USPTO while a patent application is pending. The examiner is required to consider them. If the submitted art is good, it can prevent a patent from issuing entirely or force its claims to be narrowed. The filing window closes at whichever comes first: six months after publication, or the date a first office action on the merits is mailed. Outside that window, the mechanism doesn't exist.

A few constraints that matter enormously in practice:

**You file and walk away.** This isn't a pre-grant opposition — you don't get to argue with the examiner, respond to office actions, or participate in the prosecution. You file your documents and a concise description of their relevance, and then you're done. The examiner takes it from there.

**Factual descriptions only.** The USPTO requires a "Concise Description of Relevance" for each submitted document. That description must be factual — it cannot include legal arguments. You're explaining what the document teaches, not arguing that it anticipates a claim. That distinction is harder to operationalize than it sounds.

**The window is brittle.** The deadline depends on prosecution status that isn't always obvious from public data. You can miss it by a few days if you're not paying attention to the application's docket history.

Those constraints shape every design decision on the site.

## The design challenge

The hardest part of building 3PPS.info wasn't the technology — Eleventy, Nunjucks, vanilla JS, Netlify, nothing exotic — it was figuring out how to explain things like "estoppel" and "concise description of relevance" to someone who has never read a patent claim.

The tension I kept running into is between completeness and accessibility. Lawyers want precision; they want every qualifier and exception spelled out. Non-lawyers need enough context to act, but will disengage if they feel they're reading a statute. The temptation with a legal process is to document every edge case. The problem is that edge cases in legal writing tend to be written in a way that makes the whole document feel inaccessible before you get to anything actionable.

My approach was to lead with the workflow and put the nuance downstream. Get someone to understand the four-step process first — identify the application, gather the prior art, draft the descriptions, file through EFS-Web — and then let the deeper explainers be available when they hit a specific question. The strategic analysis (when a 3PPS makes sense versus holding art for an Inter Partes Review) lives behind a clear heading, not in the middle of the process guide. The international comparison (USPTO vs. EPO opposition vs. PCT third-party observations) is its own section, because it serves a different reader.

The drafting guide for the Concise Description was the piece I spent the most time on. The line between "factual description of relevance" and "legal argument" is genuinely subtle, and crossing it risks having your submission rejected on procedural grounds. I wanted to give readers a real understanding of what examiners are looking for — not just a template, but enough conceptual grounding to apply judgment.

## The /for/agents page

One of the more interesting features is something I borrowed from how Laravel exposes documentation for AI coding agents: a `/for/agents` page that provides a plain-text playbook the model can use to walk a user through the full 3PPS process end-to-end.

It covers the complete workflow in a format designed for agents rather than humans — structured steps for identifying the application by publication number, mapping claims to prior art documents, drafting compliant Concise Descriptions, running the 22-item filing checklist, and executing the EFS-Web submission. The goal is that a user who doesn't know anything about the process can tell their AI assistant "help me file a 3PPS" and the agent has a structured, authoritative playbook to work from rather than hallucinating procedural details from training data.

This felt like a natural fit for the problem. 3PPS is a process with real legal constraints, a specific form of required language, and a brittle deadline — exactly the kind of thing where getting details wrong has real consequences. An agent with a reliable reference document is considerably more useful than one working from general knowledge about patent law.

## Honest notes on impact

The early AIA data told an interesting story: in the first two years after the 3PPS provisions took effect, the USPTO received about 2,116 submissions — roughly three per day. The acceptance rate was 76%. But examiners actively cited submitted art in only 12.96% of accepted cases.

That last number is worth sitting with. It doesn't mean the other 87% of submissions were wasted — an examiner reading art and deciding not to cite it isn't the same as an examiner ignoring it. But it's a useful corrective to any notion that filing a 3PPS is a reliable way to stop a patent. It's a probabilistic tool, and a niche one.

The population of people who need to file a 3PPS at any given moment is genuinely small. Startup founders who've identified a competitor patent application that threatens their market. Open source projects watching an application that would let someone claim their code. Companies that have prior art the examiner probably hasn't seen. The tool is not for everyone.

But when you're in that situation, the cost of not having good information is high. You can miss the window. You can file a submission that gets rejected for including legal arguments. You can submit without a coherent description of relevance and waste the examiner's time and your own. The downside of bad information in a legal process with hard deadlines is real in a way that makes a good reference resource worth having.

That asymmetry — small audience, high cost of bad information — is what made it worth building.
