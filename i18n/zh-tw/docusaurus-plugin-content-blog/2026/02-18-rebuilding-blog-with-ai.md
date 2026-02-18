---
slug: rebuilding-blog-with-ai
title: '使用 Claude Code 重構整個 Blog'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

在 2023-2024 年以前，傳統的技術 Blog 個人覺得還是挺有價值的，畢竟可以彙整自己的筆記，面試經驗與遇到題目，甚至可能踩過的坑與細節。

但隨著 2025 年中以降，模型迭代的速度越來越快，同時也越來越強，甚至連 Cursor 這種在 2025 年上半年我覺得還挺好用的 AI Code Editor，都在下半年明顯感受到無力抗衡 Claude Code，我就知道得配合時代，把整個 Blog 翻新重構了(期許能保留價值)。

<!--truncate-->

## 數據

開頭先列出數據，因為這個量單純以人力來說，曠日費時，而且我能篤定，大概率會被拖延症徹底擊垮。但在 AI 工具的輔助下，10 天內完成(且還是在農曆春節期間)，品質尚可，算是個小奇蹟。

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

## 實際做了什麼

### Phase 1：基礎建設（Feb 8–9）— 8 commits

從頭重新設計首頁和 About 頁面。建立 `CLAUDE.md` 作為專案的憲法——commit 格式、i18n 規則、檔案結構慣例。把語系從 4 個擴充到 6 個。全程都是跟 Claude Code 互動完成的。

這個階段主要在做架構決策：首頁要長什麼樣？About 頁面怎麼規劃？整個專案要遵守什麼慣例？這些問題 都是透過跟 Claude 交互後，尤其制定執行計劃，我僅負責 Review 與調整。

### Phase 2：規模擴展（Feb 11–12）— 14 commits

再加入 4 個語系（pt-BR、de、fr、vi），湊滿 10 個。產生主題翻譯檔案。重新設計 navbar 和 sidebar 以改善內容組織。把 `defaultLocale` 切換成 `en` 並設定 Vercel i18n routing。升級相依套件。語系擴展幾乎全是機械式的工作——正是 AI 擅長的領域，雖然非常消耗 Token，但以人力來說，幾乎不可能在極短時間內完成。

### Phase 3：內容（Feb 13–14）— 14 commits

清理舊的 blog 文章。寫了一篇年度回顧。把所有 blog 文章翻譯成 10 個語系。建立 Projects 展示頁。完成首頁 i18n。修復 UI 元件的 bug（ShowcaseCard 按鈕對齊、dropdown 裁切問題）。

這個階段遇到的狀況是，其實 AI 並不善於第一時間發現破版問題(UI 問題)，而需要透過多次的交互後，由人(也就是我)來持續指出修正方向，才能將畫面修到正確。

### Phase 4：Sidebar + Blog（Feb 15）— 7 commits

重新整理整個 docs 的 sidebar 結構。翻譯所有 10 個語系的 sidebar category 標籤。清掉之前重構遺留的 206 個無用翻譯 key。撰寫並翻譯資遣談判的 blog 文章到所有語系。

### Phase 5：Docs i18n（Feb 16–17）— 14 commits

最大的 Batch：把 89 篇文件翻譯成 9 個非英文語系，產出 801 個翻譯檔案。涵蓋 Knowledge（JavaScript、TypeScript、CSS、Vue、React、Browser、Security、Engineering）、Experience 和 Coding 區塊。

這一階段和下一階段都是極度消耗 Token，將高度機械化的翻譯工作，全數砸到 AI 身上，讓它盡情發揮(畢竟我也看不懂諸多語系)。

### Phase 6：品質修復（Feb 17–18）— 24 commits

這個階段的存在，是因為 Phase 5 的產出不夠乾淨。整整 24 個 commits 都在修 AI 產生的翻譯：

- **German**：變音符號被渲染成 ASCII（`ue` 而不是 `ü`、`ae` 而不是 `ä`）
- **French**：重音符號被去掉（`e` 而不是 `é`、`a` 而不是 `à`）
- **Vietnamese**：聲調符號完全消失（沒有聲調的越南文幾乎無法閱讀）
- **Spanish/Portuguese**：全文的重音符號都掉了
- **Chinese Simplified**：繁體中文字元混入（AI 有時分不清這兩種書寫系統）
- **CJK 殘留**：es、pt-BR、ja、ko、vi 的程式碼區塊裡留有未翻譯的中文註解

每修一個問題就會冒出更多問題。修正 Portuguese 的重音符號時，過度修正導致 frontmatter 的 `id` 和 `slug` 欄位壞掉。修復 Vietnamese 聲調時漏掉了一個檔案。Spanish 的重音修正出現誤判，需要再補一個修正 commit。

其實這階段，除非你懂某一種語言，不然人力是真的無法介入，只能完全仰賴不同模型交叉驗證。

**AI 不擅長辨識的事**：

```markdown
// Example：

- 第一次就把變音符號和聲調符號處理正確（accents、umlauts、tonal marks）
- 穩定區分繁體中文和簡體中文
- 判斷程式碼裡的註解該保持原文還是翻譯
- 在內容轉換過程中保留 frontmatter 欄位不被動到
```

## 踩坑

**重音和聲調的災難。** AI 在五種語言中把非 ASCII 字元都用 ASCII 近似值取代。這導致了 24 個修正 commits——將近總數的四分之一。越南文是最慘的案例：少了聲調符號，整個語言幾乎無法辨識。

**繁簡中文混用。** `zh-cn` 的翻譯裡，程式碼註解和行內引用出現了繁體中文字元。AI 沒辦法穩定區分這兩種書寫系統。

**Frontmatter 損壞。** 翻譯文件時，AI 有時會動到 frontmatter 裡的 `id` 和 `slug` 欄位，導致 Docusaurus routing 壞掉。有一個 commit 就是專門修復 Portuguese 在重音修正過程中被搞壞的 `id` 和 `slug`。

**過度修正的連鎖反應。** 修一個問題常常會引發另一個。Portuguese 的重音修正過度修正了一些技術名詞。Vietnamese 的聲調修復漏掉了一個檔案。每個「修正」commit 都有一定機率製造新問題。

## 人類還能介入的地方

**架構決策。** 要支援哪 10 個語系。Sidebar 要怎麼組織。什麼東西放在 navbar dropdown、什麼放在頂層。這些決策影響了所有下游的工作。

**品質判斷。** UI 是否破版，是否符合設計規範。語系翻譯有沒有明顯錯誤，例如調整預設語系是否有正確對應。

**`CLAUDE.md` 檔案。** 本質上是一份 Repo 憲法，用來教 AI 你的專案慣例：commit 格式、檔案結構、i18n 規則、哪些事絕對不能做。這份檔案寫得越完善，AI 犯的錯就越少，人力介入的機會就越少，所以需要頻繁迭代與更新。

## 心得

**從一份完善的 `CLAUDE.md` 開始。** 每一條寫進去的慣例，後面都能省下幾十次修正循環。從幾行字長到一份完整的文件，涵蓋 commit 格式、i18n 規則、專案結構，還有明確的禁止事項。

**批次處理類似的工作，批次審查結果。** 不要一次翻譯一個檔案。一次丟 15 個類似的檔案給 AI，然後整批審查，可以避免人力需要核可太多細節。

**盡可能平行使用工具。** 同時讓 Claude Code 處理互動式工作，再將工作移交給 Gemini, Codex 等處理批次工作，是最大的效率提升。別把可以平行化的工作串行化。

**記錄一切。** 每個 commit message、每個階段分界、每次修正——全部都在歷史紀錄裡。如果在做大型 AI 輔助專案，commit history 就是文件。
