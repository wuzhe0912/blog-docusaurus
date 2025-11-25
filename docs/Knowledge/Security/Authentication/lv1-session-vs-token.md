---
id: login-lv1-session-vs-token
title: '[Lv1] Session-based 和 Token-based 有什麼差異？'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> 面試時常見的追問：你了解傳統 Session 與現代 Token 的差別嗎？掌握下列重點，能快速整理思路。

---

## 1. 兩種驗證模式的核心概念

### Session-based Authentication

- **狀態保存在伺服器**：使用者第一次登入後，伺服器在記憶體或資料庫建立 Session，回傳 Session ID 存在 Cookie。
- **後續請求依賴 Session ID**：瀏覽器會在同網域自動帶上 Session Cookie，伺服器根據 Session ID 找出對應的使用者資訊。
- **常見於傳統 MVC / 單體應用**：伺服器負責渲染頁面並維持使用者狀態。

### Token-based Authentication（例如 JWT）

- **狀態保存在客戶端**：登入成功後產生 Token（可攜帶使用者資訊與權限），由前端保存。
- **每次請求帶上 Token**：通常放在 `Authorization: Bearer <token>`，伺服器驗證簽章即可取得使用者資訊。
- **常見於 SPA / 微服務**：後端只需驗證 Token，不需儲存使用者狀態。

---

## 2. 請求流程比較

| 流程步驟 | Session-based                                           | Token-based (JWT)                                                     |
| -------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| 登入成功 | 伺服器建立 Session，回傳 `Set-Cookie: session_id=...`    | 伺服器簽發 Token，回傳 JSON：`{ access_token, expires_in, ... }`      |
| 儲存位置 | 瀏覽器 Cookie（通常是 httponly）                         | 前端自行選擇：`localStorage`、`sessionStorage`、Cookie、Memory        |
| 後續請求 | 瀏覽器自動帶 Cookie，伺服器查表取得使用者資訊           | 前端手動在 Header 帶 `Authorization`                                  |
| 驗證方式 | 查詢 Session Store                                      | 驗證 Token 簽章，或比對黑名單 / 白名單                               |
| 登出     | 刪除伺服器 Session、回傳 `Set-Cookie` 清除 Cookie        | 前端刪除 Token；若要強制失效須記錄於黑名單或輪換密鑰                 |

---

## 3. 優缺點總整理

| 面向     | Session-based                                                                 | Token-based (JWT)                                                                 |
| -------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 優點     | - Cookie 自動帶入，瀏覽器端簡單<br />- Session 可儲存大量資料<br />- 易於撤銷與強制登出 | - 無狀態，可橫向擴充<br />- 適合 SPA、行動裝置、微服務<br />- Token 可跨網域、跨裝置使用 |
| 缺點     | - 伺服器需維護 Session Store，會吃記憶體<br />- 分散式部署需要 Session 同步 | - Token 體積較大，每次請求都會傳輸<br />- 無法輕易撤銷，需額外黑名單 / 旋轉密鑰機制       |
| 安全風險 | - 容易受 CSRF 攻擊（Cookie 會自動帶出）<br />- 若洩漏 Session ID，需立即清除 | - 容易受 XSS 影響（若保存在可被讀取的位置）<br />- 若 Token 過期前被竊取，可重放請求     |
| 使用情境 | - 傳統 Web (SSR) + 相同網域<br />- 伺服器負責渲染頁面                           | - RESTful API / GraphQL<br />- 行動 App、單頁應用、微服務                          |

---

## 4. 如何選擇？

### 先問自己三個問題

1. **是否需要跨網域或多端共用登入狀態？**  
   - 需要 → Token-based 較彈性。  
   - 不需要 → Session-based 較簡潔。

2. **部署是否為多台伺服器或微服務？**  
   - 是 → Token-based 可以減少 Session 複製或集中化的需求。  
   - 否 → Session-based 輕鬆又安全。

3. **是否有高安全性需求（銀行、企業系統）？**  
   - 較高需求 → Session-based + httponly Cookie + CSRF 防護仍是主流。  
   - 輕量 API 或行動服務 → Token-based + HTTPS + Refresh Token + 黑名單策略。

### 常見搭配策略

- **企業內部系統**：Session-based + Redis / Database 同步。  
- **現代 SPA + 行動 App**：Token-based（Access Token + Refresh Token）。  
- **大型微服務**：Token-based（JWT）搭配 API Gateway 驗證。

---

## 5. 面試回答模板

> 「傳統 Session 是把狀態放在伺服器，回傳 session id 存在 Cookie，瀏覽器每次請求會自動帶上 Cookie，所以很適合同網域的 Web App。缺點是伺服器要維護 Session Store，如果部署多台還要同步。  
> 相對地 Token-based（例如 JWT）則是把使用者資訊編碼成 Token 放在客戶端，每次請求由前端手動帶在 Header。這種方式是無狀態，適合 SPA 和微服務，擴充比較容易。  
> 安全考量上，Session 要重視 CSRF，Token 要注意 XSS。如果我要做跨網域、行動裝置或多服務整合，我會選 Token；如果是傳統企業系統、伺服器端渲染，我會選 Session 搭配 httponly Cookie。 」

---

## 6. 面試延伸備忘

- Session → 著重 **CSRF 防護、Session 同步策略、多久清除**。
- Token → 著重 **儲存位置（Cookie vs localStorage）**、**Refresh Token 機制**、**黑名單 / 旋轉密鑰**。
- 可以補充企業常用的折衷方案：`httpOnly Cookie` 儲存 Token，也能搭配 CSRF Token。

---

## 7. 參考資料

- [MDN：HTTP Cookies](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
- [Auth0：Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP：Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)

