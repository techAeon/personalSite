---
title: Why Pulverhorn Keeps Three Copies of Every Submission
date: 2026-06-24
excerpt: The most important design decision in the filing platform I'm building isn't visible in the interface. It's a data model shaped by a question no engineer would think to ask — "what will I need to prove in five years?"
---

I'm building Pulverhorn, a platform for preparing USPTO Third-Party Preissuance Submissions — the filing mechanism I wrote about [when I launched 3PPS.info](/posts/building-3pps-info/). The guide explains the process; Pulverhorn is the workbench for actually doing it. And the most consequential design decision in it is one no user will ever see.

The data model keeps three separate copies of every matter, and refuses to collapse them.

## The obvious design, and why it's wrong

If you asked a good engineer to model this workflow, you'd get something sensible: one submission record, a status field, an edit history. The client drafts it, the attorney revises it, the record moves through states until it's filed. Clean, normalized, one source of truth.

For most software, that's right. For software where an attorney takes over work product from a client, it buries the single most important question the system will ever be asked: **what did the client actually send, before the practitioner touched it?**

That question doesn't come up during normal operation. It comes up years later, when something has gone wrong — a missed deadline, a submission the client says was mangled, a dispute about who introduced an error. At that point, "we can reconstruct it from the edit log" is a much weaker answer than "here is the exact artifact, and the system is physically incapable of altering it."

## Three drafts, one matter

So Pulverhorn stores three representations of the same submission:

The **client working draft** is exactly what it sounds like — editable, saved across sessions, owned by the client until they submit.

The moment they submit, the system creates an **immutable snapshot**. Not immutable by convention or by policy — immutable in the code. The model layer throws an exception if anything, including my own future code, attempts to update or delete it. It is the permanent record of what the client sent, frozen at the moment of sending.

Then a **practitioner draft** is seeded from that snapshot. This is the copy I edit — fixing citation formats, tightening descriptions of relevance, catching compliance problems. Everything downstream, including the structured projection that mirrors the Patent Center filing form field for field, derives from the practitioner draft. The snapshot stays behind it, untouched, as the baseline every change can be measured against.

It's a little more storage and a little more code. In exchange, the provenance question has a mechanical answer instead of a forensic one.

## The same principle, applied to conflicts

The other place this philosophy shows up is conflicts checking. Before a matter reaches my review queue, the system normalizes the applicant's name and screens it against a conflicts list. That part is automated, and automation is good at it.

What the system will not do is clear a matter on its own. A confident match freezes the matter. A partial match flags it red. And a completely clean result *still* requires me to look at it and attest, on the record, that I checked — with my name and a timestamp attached. There is no code path where a conflicts check passes silently.

That's deliberate. The automation gathers and remembers; the human decides and signs. A conflicts check that clears itself is a conflicts check nobody performed.

## Not filing is a feature

The version I'm building doesn't transmit anything to the USPTO. It produces a filing projection that mirrors the Patent Center web form exactly, and I file it myself, by hand, from that projection.

I could automate that last step, and eventually some version of it may make sense. But the last mile is where the liability lives, and a solo practitioner's filing platform should earn trust in the boring parts first: never losing what a client sent, never blurring who changed what, never letting a safety check wave itself through. The unglamorous machinery is the product.

Legal software gets designed around scale problems it doesn't have and skips the professional-responsibility problems it definitely does. Building this as the person who carries the registration number concentrates the mind wonderfully.
