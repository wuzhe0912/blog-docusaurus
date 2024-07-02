---
id: web-storage
title: 📄 Web Storage
slug: /web-storage
---

## 1. Please explain the difference between `cookie`, `localStorage` and `sessionStorage`

> 請解釋 `cookie`、`localStorage` 和 `sessionStorage` 的區別

這三者都是前端在瀏覽器儲存的方式，sessionStorage 和 cookie 預設都是關閉瀏覽器失效，但 cookie 可以透過設定 expires 或 max-age 來延長儲存時間，localStorage 則是永久儲存，除非使用者手動清除。

cookie 是比較早期的做法，儲存的容量有限，只有 4KB，預設保存時效是瀏覽器關閉時就失效。但因為本身是儲存在 http 中，所以每次發送請求時，都會帶上 cookie，這樣就能在 server 端識別使用者，缺點是會增加負載影響效能。再者本身儲存的容量太小，所以目前較少使用。

### cookie personal experience

#### 資安驗證

遇到過某些舊專案的資安狀況不佳，頻發盜帳號的問題，這導致營運成本大幅提升。先選擇採用 Fingerprint 套件(社群版官方給出的說明是，準確度大約 60%，付費版的月免費額度 2 萬)，將每個登入的使用者透過裝置和地理位置參數，標識成獨立的 visitID，再利用 cookie 每次 http 請求都會帶上的特性，讓後端檢查該使用者目前的狀況，是否出現更換手機，或所在地的位置出現偏離，一但發現異常，就在登入流程下，強制觸發 OTP 驗證(視公司需求，可能是 email 或是簡訊)。

### localStorage 使用情境

- 常用於儲存使用者的個人偏好設定，例如 dark mode、i18n 語系等。
- 或者儲存 login 的 token。

## 2. What is Persistent cookies ?

持久性 cookie 或稱永久性 cookie，是一種將資料長時間儲存在使用者瀏覽器上的做法，具體做法就是上題所提到，透過設定過期時間來達成(`Expires` or `Max-Age`)。

### personal experience(推廣碼網址)

營運方希望推廣產品網址時，將導流的客戶鎖定在 24 小時內，註冊推廣碼都存在效果，確保這些客戶屬於該推廣者的業績。這個情境下，我選擇使用 cookie 的 expires 特性，讓使用者從導流進入網站起， 24 小時內強制該推廣碼是有效的，即使使用者故意清除 url 上的推廣碼參數，註冊時仍會從 cookie 抓對應參數帶入，直到 24 小時後才會自動失效。
