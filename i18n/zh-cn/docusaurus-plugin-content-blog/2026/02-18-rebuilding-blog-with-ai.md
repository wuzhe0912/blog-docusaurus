---
slug: rebuilding-blog-with-ai
title: '使用 Claude Code 重构整个 Blog'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

在 2023-2024 年以前，传统的技术 Blog 个人觉得还是挺有价值的，毕竟可以汇整自己的笔记，面试经验与遇到题目，甚至可能踩过的坑与细节。

但随着 2025 年中以降，模型迭代的速度越来越快，同时也越来越强，甚至连 Cursor 这种在 2025 年上半年我觉得还挺好用的 AI Code Editor，都在下半年明显感受到无力抗衡 Claude Code，我就知道得配合时代，把整个 Blog 翻新重构了(期许能保留价值)。

<!--truncate-->

## 数据

开头先列出数据，因为这个量单纯以人力来说，旷日费时，而且我能笃定，大概率会被拖延症彻底击垮。但在 AI 工具的辅助下，10 天内完成(且还是在农历春节期间)，品质尚可，算是个小奇迹。

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

## 实际做了什么

### Phase 1：基础建设（Feb 8–9）— 8 commits

从头重新设计首页和 About 页面。建立 `CLAUDE.md` 作为项目的宪法——commit 格式、i18n 规则、文件结构惯例。把语系从 4 个扩充到 6 个。全程都是跟 Claude Code 互动完成的。

这个阶段主要在做架构决策：首页要长什么样？About 页面怎么规划？整个项目要遵守什么惯例？这些问题都是透过跟 Claude 交互后，尤其制定执行计划，我仅负责 Review 与调整。

### Phase 2：规模扩展（Feb 11–12）— 14 commits

再加入 4 个语系（pt-BR、de、fr、vi），凑满 10 个。产生主题翻译文件。重新设计 navbar 和 sidebar 以改善内容组织。把 `defaultLocale` 切换成 `en` 并设定 Vercel i18n routing。升级相依套件。语系扩展几乎全是机械式的工作——正是 AI 擅长的领域，虽然非常消耗 Token，但以人力来说，几乎不可能在极短时间内完成。

### Phase 3：内容（Feb 13–14）— 14 commits

清理旧的 blog 文章。写了一篇年度回顾。把所有 blog 文章翻译成 10 个语系。建立 Projects 展示页。完成首页 i18n。修复 UI 组件的 bug（ShowcaseCard 按钮对齐、dropdown 裁切问题）。

这个阶段遇到的状况是，其实 AI 并不善于第一时间发现破版问题(UI 问题)，而需要透过多次的交互后，由人(也就是我)来持续指出修正方向，才能将画面修到正确。

### Phase 4：Sidebar + Blog（Feb 15）— 7 commits

重新整理整个 docs 的 sidebar 结构。翻译所有 10 个语系的 sidebar category 标签。清掉之前重构遗留的 206 个无用翻译 key。撰写并翻译资遣谈判的 blog 文章到所有语系。

### Phase 5：Docs i18n（Feb 16–17）— 14 commits

最大的 Batch：把 89 篇文件翻译成 9 个非英文语系，产出 801 个翻译文件。涵盖 Knowledge（JavaScript、TypeScript、CSS、Vue、React、Browser、Security、Engineering）、Experience 和 Coding 区块。

这一阶段和下一阶段都是极度消耗 Token，将高度机械化的翻译工作，全数砸到 AI 身上，让它尽情发挥(毕竟我也看不懂诸多语系)。

### Phase 6：品质修复（Feb 17–18）— 24 commits

这个阶段的存在，是因为 Phase 5 的产出不够干净。整整 24 个 commits 都在修 AI 产生的翻译：

- **German**：变音符号被渲染成 ASCII（`ue` 而不是 `ü`、`ae` 而不是 `ä`）
- **French**：重音符号被去掉（`e` 而不是 `é`、`a` 而不是 `à`）
- **Vietnamese**：声调符号完全消失（没有声调的越南文几乎无法阅读）
- **Spanish/Portuguese**：全文的重音符号都掉了
- **Chinese Simplified**：繁体中文字元混入（AI 有时分不清这两种书写系统）
- **CJK 残留**：es、pt-BR、ja、ko、vi 的程序码区块里留有未翻译的中文注释

每修一个问题就会冒出更多问题。修正 Portuguese 的重音符号时，过度修正导致 frontmatter 的 `id` 和 `slug` 字段坏掉。修复 Vietnamese 声调时漏掉了一个文件。Spanish 的重音修正出现误判，需要再补一个修正 commit。

其实这阶段，除非你懂某一种语言，不然人力是真的无法介入，只能完全仰赖不同模型交叉验证。

**AI 不擅长辨识的事**：

```markdown
// Example：

- 第一次就把变音符号和声调符号处理正确（accents、umlauts、tonal marks）
- 稳定区分繁体中文和简体中文
- 判断程序码里的注释该保持原文还是翻译
- 在内容转换过程中保留 frontmatter 字段不被动到
```

## 踩坑

**重音和声调的灾难。** AI 在五种语言中把非 ASCII 字元都用 ASCII 近似值取代。这导致了 24 个修正 commits——将近总数的四分之一。越南文是最惨的案例：少了声调符号，整个语言几乎无法辨识。

**繁简中文混用。** `zh-cn` 的翻译里，程序码注释和行内引用出现了繁体中文字元。AI 没办法稳定区分这两种书写系统。

**Frontmatter 损坏。** 翻译文件时，AI 有时会动到 frontmatter 里的 `id` 和 `slug` 字段，导致 Docusaurus routing 坏掉。有一个 commit 就是专门修复 Portuguese 在重音修正过程中被搞坏的 `id` 和 `slug`。

**过度修正的连锁反应。** 修一个问题常常会引发另一个。Portuguese 的重音修正过度修正了一些技术名词。Vietnamese 的声调修复漏掉了一个文件。每个「修正」commit 都有一定机率制造新问题。

## 人类还能介入的地方

**架构决策。** 要支持哪 10 个语系。Sidebar 要怎么组织。什么东西放在 navbar dropdown、什么放在顶层。这些决策影响了所有下游的工作。

**品质判断。** UI 是否破版，是否符合设计规范。语系翻译有没有明显错误，例如调整预设语系是否有正确对应。

**`CLAUDE.md` 文件。** 本质上是一份 Repo 宪法，用来教 AI 你的项目惯例：commit 格式、文件结构、i18n 规则、哪些事绝对不能做。这份文件写得越完善，AI 犯的错就越少，人力介入的机会就越少，所以需要频繁迭代与更新。

## 心得

**从一份完善的 `CLAUDE.md` 开始。** 每一条写进去的惯例，后面都能省下几十次修正循环。从几行字长到一份完整的文件，涵盖 commit 格式、i18n 规则、项目结构，还有明确的禁止事项。

**批次处理类似的工作，批次审查结果。** 不要一次翻译一个文件。一次丢 15 个类似的文件给 AI，然后整批审查，可以避免人力需要核可太多细节。

**尽可能平行使用工具。** 同时让 Claude Code 处理互动式工作，再将工作移交给 Gemini, Codex 等处理批次工作，是最大的效率提升。别把可以平行化的工作串行化。

**记录一切。** 每个 commit message、每个阶段分界、每次修正——全部都在历史纪录里。如果在做大型 AI 辅助项目，commit history 就是文件。
