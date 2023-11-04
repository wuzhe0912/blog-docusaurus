---
id: client-side-security
title: 📄 Client Side Security
slug: /client-side-security
---

## 1. Can you explain what CSP (Content Security Policy) is?

> 你能解釋什麼是 CSP (Content Security Policy) 嗎？

原則上，CSP 是一種增強網頁安全性的機制，可以透過設定 HTTP header，來限制網頁內容能夠載入的資料來源(白名單)，以防止惡意的攻擊者透過注入惡意的 script 來竊取使用者的資料。

從前端的角度，為了防止 XSS (Cross-site scripting) 攻擊，多會採用現代框架來做開發，主要在於他們提供了基本的保護機制，例如 React 的 JSX 會自動將進行 HTML 轉義，Vue 則是透過 `{{ data }}` 方式來綁定資料，同時進行自動轉義 HTML 標籤。

雖然前端在這塊能做的不多，但還是有些細部優化可以處理，例如：

1. 如果需要輸入內容的表單，可以透過驗證特殊字元來避免攻擊(但其實很難設想所有情境)，所以多採用限制長度來控制 client 端輸入的內容，或是限制輸入的類型。
2. 若需要引用外部連結時，迴避 http url 採用 https url。
3. 靜態頁面的網站，可以透過設定 meta tag 來限制，如下

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`：默認情況下，只允許從同一來源（即同一個域）載入資料。
- `img-src https://*`：只允許從 HTTPS 協議載入資料。
- `child-src 'none'`：不允許嵌入任何外部的子資料，例如 `<iframe>`。

## 2. What is XSS (Cross-site scripting) attack?

> 什麼是 XSS (Cross-site scripting) 攻擊？

XSS，即跨站腳本攻擊，是指攻擊者通過注入惡意的腳本，使之在用戶的瀏覽器上運行，從而獲取用戶的敏感資料，如 cookie，或者直接改變網頁內容將使用者導向惡意網站。

### 預防儲存型 XSS

攻擊方可能會透過留言的方式，故意將含有惡意的 html 或 script 塞入資料庫，這時候除了後端會進行轉義外，前端的現代框架如 React 的 JSX 或是 Vue 的 template `{{ data }}`，也會協助進行轉義，讓 XSS 攻擊機率降低。

### 預防反射型 XSS

避免使用 `innerHTML` 來操作 DOM，因為這樣有機會執行 HTML 標籤，一般推薦使用 `textContent` 來操作。

### 預防 DOM-based XSS

原則上，我們盡可能不讓使用者直接將 HTML 插入到頁面上，如果有情境上的需求，框架本身也有類似的指令可以協助，例如 React 的 `dangerouslySetInnerHTML`，Vue 的 `v-html`，盡可能自動防止 XSS，但如果需要使用原生 JS 開發，也盡量使用 `textContent`, `createElement`, `setAttribute` 來操作 DOM。
