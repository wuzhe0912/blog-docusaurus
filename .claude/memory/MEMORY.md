# Memory Management Rules

**每次對話開始時**：讀取此檔 + CLAUDE.md，快速掌握現狀。
**每次對話結束時**：清理此檔，刪除已完成的項目，只保留活的資訊。

## 原則

- **CLAUDE.md**（repo 內）= 規則 + 現狀。硬性約束和當前狀態，跨電腦同步。
- **MEMORY.md**（本機）= 短期工作筆記。越短越好，過時就刪。
- 已完成的工作不記錄（commit history 已經有）
- 架構細節不記錄（直接讀程式碼比讀筆記準）
- 決策只留結論，不留過程

## Active Gotchas

- .claude/ 目錄要一起 commit，不然 git status 會一直卡著。**每次 commit 前都要 `git status` 檢查 .claude/ 有無未 commit 的變更**
- dev server 新增檔案後可能需要重啟才能解析 CSS modules
- 用戶說「建立文件」就是在 repo 裡建檔，不要用 plan mode 或寫到隱藏路徑
- 先聽完指令再動手，不要自作主張跳步驟
- Commit 訊息禁止 Co-Authored-By（已寫入 CLAUDE.md）
