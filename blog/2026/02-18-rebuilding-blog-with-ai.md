---
slug: rebuilding-blog-with-ai
title: 'Rebuilding My Entire Blog with Claude Code'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

Before 2023–2024, I still thought the traditional tech blog had real value. You could consolidate your notes, interview experiences, problems you'd encountered, traps you'd fallen into. A personal knowledge base that actually meant something.

But from mid-2025 onward, models started iterating faster and getting significantly stronger. Even Cursor — which I genuinely liked in early 2025 as an AI code editor — felt noticeably outclassed by Claude Code by the second half of the year. That's when I knew it was time to tear down the whole blog and rebuild it from scratch (hoping to preserve whatever value was still in there).

<!--truncate-->

## The Numbers

Let me start with the data, because the sheer volume here would have been absolutely devastating to do by hand. I can say with full confidence that my procrastination would have killed this project ten times over. But with AI tooling, it got done in 10 days (during Lunar New Year, no less) — quality was decent, a small miracle honestly.

| Metric                      | Value                     |
| --------------------------- | ------------------------- |
| Duration                    | 10 days (Feb 8–18, 2026)  |
| Total commits               | 104                       |
| Files changed               | 1,078                     |
| Lines inserted              | 263,000+                  |
| Lines deleted               | 21,000+                   |
| Locales                     | 4 → 10                    |
| Docs translated to English  | 89                        |
| Translation files generated | 801 (89 docs × 9 locales) |
| Blog posts with full i18n   | 5                         |
| Tools used                  | Claude Code               |

## What I Actually Did

### Phase 1: Foundation (Feb 8–9) — 8 commits

Redesigned the homepage and About page from scratch. Set up `CLAUDE.md` as the project constitution — commit format, i18n rules, file structure conventions. Expanded locales from 4 to 6. All done interactively with Claude Code.

This phase was mostly architectural decisions: What should the homepage look like? How should the About page be structured? What conventions should the whole project follow? These questions were all worked out through back-and-forth with Claude — especially the execution plan. I just did the reviewing and adjusting.

### Phase 2: Scale Up (Feb 11–12) — 14 commits

Added 4 more locales (pt-BR, de, fr, vi) to hit 10 total. Generated theme translation files. Redesigned the navbar and sidebar for better content organization. Switched `defaultLocale` to `en` with Vercel i18n routing. Upgraded dependencies. The locale expansion was almost entirely mechanical work — exactly the kind of thing AI is good at. Burned through a lot of Token, but doing this by hand in such a short window would have been basically impossible.

### Phase 3: Content (Feb 13–14) — 14 commits

Cleaned up old blog posts. Wrote a year-end reflection. Translated all blog posts across 10 locales. Built a Projects showcase page. Completed homepage i18n. Fixed UI component bugs (ShowcaseCard button alignment, dropdown clipping).

The thing I ran into here: AI isn't great at catching broken layouts on the first pass. It took multiple rounds of me pointing out exactly what was wrong with the UI before things got fixed properly. You still need a human pair of eyes for visual stuff.

### Phase 4: Sidebar + Blog (Feb 15) — 7 commits

Reorganized the entire docs sidebar structure. Translated sidebar category labels for all 10 locales. Cleaned out 206 dead translation keys left over from previous restructuring. Wrote and translated the layoff negotiation blog post across all locales.

### Phase 5: Docs i18n (Feb 16–17) — 14 commits

The big batch: translated 89 docs across 9 non-English locales, producing 801 translation files. Covered Knowledge (JavaScript, TypeScript, CSS, Vue, React, Browser, Security, Engineering), Experience, and Coding sections.

This phase and the next one were both massive Token sinks — just dumping highly mechanical translation work onto AI and letting it go wild (I can't read most of those languages anyway).

### Phase 6: Quality Fixes (Feb 17–18) — 24 commits

This phase exists because Phase 5's output wasn't clean enough. Twenty-four commits, all fixing AI-generated translations:

- **German**: Umlauts rendered as ASCII (`ue` instead of `ü`, `ae` instead of `ä`)
- **French**: Accents stripped (`e` instead of `é`, `a` instead of `à`)
- **Vietnamese**: Diacritics completely missing (Vietnamese without diacritics is barely readable)
- **Spanish/Portuguese**: Accent marks dropped throughout
- **Chinese Simplified**: Traditional characters mixed in (the AI sometimes can't tell the two writing systems apart)
- **CJK residuals**: Chinese comments left untranslated in code blocks across es, pt-BR, ja, ko, vi

Each fix spawned more fixes. Correcting Portuguese accents overcorrected things and broke frontmatter `id` and `slug` fields. Fixing Vietnamese diacritics missed one file. The Spanish accent fix had false positives that needed yet another correction commit.

Honestly, unless you actually speak a given language, there's no way a human can meaningfully intervene here. You're fully dependent on cross-validating with different models.

**Things AI is not good at:**

```markdown
// Examples:

- Getting diacritics right on the first pass (accents, umlauts, tonal marks)
- Reliably distinguishing Traditional Chinese from Simplified Chinese
- Deciding whether code comments should stay in the original language or get translated
- Preserving frontmatter fields during content transformation
```

## What Went Wrong

**The accent and diacritic disaster.** AI replaced non-ASCII characters with ASCII approximations across five languages. This produced 24 fix commits — nearly a quarter of the total. Vietnamese was the worst case: without diacritics, the entire language is basically unrecognizable.

**Traditional/Simplified Chinese mixing.** `zh-cn` translations had Traditional Chinese characters showing up in code comments and inline references. The AI just couldn't reliably tell the two writing systems apart.

**Frontmatter corruption.** When translating docs, AI sometimes modified `id` and `slug` fields in the frontmatter, breaking Docusaurus routing. One commit exists solely to fix Portuguese `id` and `slug` values that got mangled during accent corrections.

**Overcorrection chain reactions.** Fixing one problem often created another. The Portuguese accent fix overcorrected some technical terms. The Vietnamese diacritic fix missed a file. Every single "fix" commit had a non-zero chance of introducing a new problem.

## Where Humans Still Matter

**Architectural decisions.** Which 10 locales to support. How to organize the sidebar. What goes in a navbar dropdown vs. top-level. These decisions shaped all downstream work.

**Quality judgment.** Is the UI broken? Does the layout match the design spec? Are there obvious translation errors — like checking whether the default locale switch actually maps correctly? You need eyes for this.

**The `CLAUDE.md` file.** This is essentially a repo constitution that teaches AI your project conventions: commit format, file structure, i18n rules, things that must never happen. The more thorough this file gets, the fewer mistakes AI makes and the less human intervention is needed. It requires frequent iteration and updates.

## Takeaways

**Start with a solid `CLAUDE.md`.** Every convention you put in there saves you dozens of correction cycles down the line. Mine grew from a few lines into a full document covering commit format, i18n rules, project structure, and explicit prohibitions.

**Batch similar work, review in batches.** Don't translate one file at a time. Throw 15 similar files at AI at once, then review the output as a batch. Saves you from having to approve every little detail individually.

**Parallelize your tools whenever possible.** Running Claude Code for interactive work while handing off batch jobs to Gemini, Codex, etc. — that was the single biggest efficiency gain. Don't serialize what can be parallelized.

**Document everything.** Every commit message, every phase boundary, every fix — it's all in the history. If you're doing a large AI-assisted project, your commit history is your documentation.
