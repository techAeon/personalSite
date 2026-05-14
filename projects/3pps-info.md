---
title: 3PPS.info
description: A plain-English guide to the USPTO Third-Party Preissuance Submission process — deadline calculator, drafting guide, filing checklist, and a /for/agents playbook for AI-assisted submissions.
date: 2026-05-14
featured: true
status: "Live"
stack: ["Eleventy", "Nunjucks", "Vanilla JS", "Netlify"]
liveUrl: "https://3pps.info"
github: "https://github.com/techAeon/3pps"
---

## Overview

3PPS.info is an educational resource explaining the USPTO Third-Party Preissuance Submission process under 35 U.S.C. § 122(e) — the statutory mechanism that lets anyone submit prior art to a patent examiner before a patent is granted. The site exists because the AIA created this public crowdsourcing window in 2011, but plain-English explanations of how to actually use it are almost nonexistent.

## What it covers

- **Process guide** — A four-step workflow covering how to identify the target application, gather prior art documents, draft compliant Concise Descriptions of Relevance, and file through EFS-Web
- **Deadline calculator** — The 3PPS window is brittle (whichever comes first: six months after publication, or first office action on the merits). The calculator makes that concrete
- **Drafting guide** — The line between a factual description and a legal argument is subtle and consequential. The guide explains what examiners are actually looking for
- **Strategic analysis** — When a 3PPS makes sense versus holding art for an Inter Partes Review, with tradeoff analysis
- **International comparison** — USPTO vs. EPO opposition vs. PCT third-party observations
- **22-item filing checklist** — Interactive pre-submission review
- **[/for/agents](https://3pps.info/for/agents)** — A plain-text playbook for AI coding agents to walk users through the full submission process end-to-end

## The /for/agents page

Modeled on how Laravel exposes documentation for AI agents, this page gives any AI assistant a structured playbook for guiding a user through 3PPS — from identifying the application to drafting descriptions to running the checklist. Designed for situations where getting procedural details wrong has real consequences and working from general patent knowledge isn't good enough.

## Tech stack

Eleventy static site generator with Nunjucks templates, vanilla JS for the calculator and checklist, deployed on Netlify.
