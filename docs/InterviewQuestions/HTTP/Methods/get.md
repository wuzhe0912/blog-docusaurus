---
id: http-methods-get
title: 📄 GET
slug: /http-methods-get
---

## 1. If GET can also carry data in a request, why should we use POST?

> 既然 `GET` 也能傳送包含資料的請求，為什麼我們還需要使用 `POST` 呢？

主要基於這四點考量：

1. 安全性：因為 `GET` 的資料是附加在 URL 上面，自然也就容易曝露敏感資料，而 `POST` 則是將資料放在請求的 `body` 中，相對更為安全。
2. 資料大小限制：使用 `GET` 由於瀏覽器和服務器對 URL 長度有限制(雖然每個瀏覽器略有不同，但大體落在 2048 bytes 上下浮動)，因此資料量會受到限制。`POST` 雖然名義上沒有限制，但實務上為了避免被惡意攻擊灌入大量資料，通常還是會透過一些中間件的設置來限制資料大小。譬如 `express` 的 `body-parser`。
3. 語意清晰：確保開發者能夠清楚的知道這個請求的目的，`GET` 通常用於獲取資料，而 `POST` 則更適合用於新增或更新資料。
4. 不可變性(Immutability)：在 HTTP 協議中，`GET` 方法被設計為"安全的"，不管發出幾次請求，都不必擔心這會對 server 上的資料造成變動。
