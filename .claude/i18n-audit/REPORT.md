# i18n 翻譯審計報告

> 審計日期：2026-02-18
> 最後更新：2026-02-18
> 審計範圍：全 10 語系的 docs / blog / code.json / footer / navbar / sidebar

---

## 0. docs/en 英文化修復狀態（2026-02-18）

defaultLocale `en` 的 `docs/` 已完成 89/89 英文化修復，並依 batch 全數完成：

| Batch | 範圍 | 狀態 | commit |
|------|------|------|--------|
| 1 | Knowledge / JavaScript | ✅ | `f83e514` |
| 2 | Knowledge / Vue | ✅ | `fd7ebdd` |
| 3 | Knowledge / TypeScript + React | ✅ | `e04a843` |
| 4 | Knowledge / CSS | ✅ | `99bbf2e` |
| 5 | Knowledge / Engineering | ✅ | `3ca83a0` |
| 6 | Knowledge / Browser-Network + Security + index | ✅ | （既有完成） |
| 7 | Experience / SSR-SEO | ✅ | `6a48e7a` |
| 8 | Experience / State-Management + misc | ✅ | `899e045` |
| 9 | Coding + LeetCode | ✅ | （既有完成） |

驗證結果：

- 全 10 語系 `bun run build` 成功
- en 抽查 6 頁確認為英文（無中文殘留）
- zh-tw 抽查仍為繁中，其他語系（ja/de/es）抽查未受影響

---

## 1. Docs 翻譯覆蓋率

**源文件總數（en/default）：89 個**

| Locale | 已翻譯 | 覆蓋率 | 狀態 |
|--------|--------|--------|------|
| zh-tw | 89 | 100% | ✅ 完整 |
| zh-cn | 89 | 100% | ✅ 完整 |
| ja | 89 | 100% | ✅ 完整 |
| ko | 89 | 100% | ✅ 完整 |
| es | 89 | 100% | ✅ 完整 |
| pt-BR | 89 | 100% | ✅ 完整 |
| de | 89 | 100% | ✅ 完整 |
| fr | 89 | 100% | ✅ 完整 |
| vi | 89 | 100% | ✅ 完整 |

> 注：初次審計時 agent 報告多語系有缺口，經 `find` 逐一驗證後確認全語系 89/89 完整。

---

## 2. Blog 翻譯覆蓋率

**源文件總數：5 篇** — 全 9 語系 100% 完成。

---

## 3. code.json 未翻譯 key（與 en 完全相同的 message）

| Locale | 刻意保留 + 同形詞 | 實際未翻譯 | 狀態 |
|--------|-------------------|-----------|------|
| zh-tw | 6 | 0 | ✅ 完成 |
| zh-cn | 5 | 0 | ✅ 完成 |
| ja | 3 | 0 | ✅ 完成 |
| ko | 3 | 0 | ✅ 完成 |
| vi | 7 | 0 | ✅ 完成 |
| es | 10 | 0 | ✅ 完成 |
| fr | 19 | 0 | ✅ 完成 |
| pt-BR | 15 | 0 | ✅ 完成 |
| de | 19 | 0 | ✅ 完成 |

### 刻意保留英文的 key（DO NOT TRANSLATE）

以下 key 經確認為刻意保留英文，全語系均維持與 en 相同的值：

| Key | 值 | 保留原因 |
|-----|----|----------|
| `homepage.cta.title` | "Open to Opportunities" | 品牌用語 |
| `homepage.meta.description` | "Software / Product Engineer..." | 品牌用語 |
| `about.role` | "Software / Product Engineer" | 職稱保留英文 |
| `about.meta.title` | "About" | 品牌一致性 |
| `about.meta.description` | "About Pitt Wu - Software..." | 品牌用語 |
| `about.expertise.heading` | "Expertise" | UI 設計決定 |
| `about.workWithMe.heading` | "Work With Me" | UI 設計決定 |
| `about.expertise.vueNuxt.item1` | "Vue 3 / Nuxt 3" | 技術名詞 |
| `about.expertise.vueNuxt.item2` | "SSR / SSG / ISR" | 技術名詞 |
| `about.expertise.performance.item1` | "Core Web Vitals" | 技術名詞 |
| `about.expertise.performance.item3` | "Lazy Load / Code Splitting" | 技術名詞 |
| `about.expertise.performance.item4` | "CI/CD Pipeline" | 技術名詞 |
| `about.expertise.ai.item3` | "RAG / Prompt Engineering" | 技術名詞 |
| `theme.blog.author.pageTitle` | "{authorName} - {nPosts}" | 格式模板 |
| `projects.card.website` | "Website" | 通用英文 |

### 修復紀錄

- de: 翻譯 42 key + 修正 2 個中文殘留 + 新增 2 個缺失 key
- pt-BR: 翻譯 26 key + 修正 2 個中文殘留 + 新增 2 個缺失 key
- fr: 翻譯 11 key + 修正 2 個中文殘留 + 新增 2 個缺失 key
- es: 翻譯 7 key + 新增 2 個缺失 key
- vi: 修正 2 個中文殘留 + 新增 2 個缺失 key
- zh-cn / ko: 各新增 2 個缺失 key（theme.unlistedContent.*）

---

## 4. 其他翻譯檔案

| 檔案 | 狀態 |
|------|------|
| footer.json | 全 10 語系完整，無 copyright key |
| navbar.json | 全 10 語系存在 |
| sidebar*.json | 全 10 語系存在 |
| blog options.json | 全 10 語系存在 |

---

## 5. 翻譯品質

| 檢查項 | 結果 |
|--------|------|
| 非中文語系殘留中文 | 無（僅 SSR-SEO 中合法日文範例） |
| zh-cn 簡繁混用 | 已清理完成 |
| es 音標（á é í ó ú ñ） | 正確 |
| pt-BR 音標（ã ç ê ó） | 正確 |
| fr 重音（é è ê à ç） | 正確 |
| de 變音（ä ö ü ß） | 正確 |
| vi 聲調符號 | 正確 |
| frontmatter（id/slug/title） | 全部正確 |
| 技術名詞保留英文 | 正確（SSR、Hydration、Bundle 等） |

---

## 6. 非阻塞性項目

- macOS `._*` 資源 fork 檔案：61 個存在於磁碟，但已被 global gitignore 排除，不影響 repo。
