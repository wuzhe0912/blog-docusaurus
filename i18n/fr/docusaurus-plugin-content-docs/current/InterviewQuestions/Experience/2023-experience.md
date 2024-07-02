---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> 你解決過最困難的技術問題是什麼？

### Webauthn

近期處理起來比較新且相關經驗較少的技術問題，是實作 Webauthn 的登入。需求方希望，能讓使用者在登入網頁端的網站時，能觸發和 App 相同的 Face ID / Touch ID 機制，讓使用體驗更為平滑順暢。

實作前教學內容參考如下：

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

初步確認應該可行後，和 PM 端確認整個登入註冊流程，包含首次登入時是否觸發生物驗證，以及判定機制等。實作過程中，遇到最大的難題是，需要不斷微調各種傳入參數，因為可參考的資料畢竟還是太少，很多參數的意義都不是很清楚，只能不斷嘗試。在裝置上，ios 手機相對好處理，但 android 手機則出現不易觸發 Touch ID，需要後端協助配合修改部分參數兼容。最後功能完成後，搭配此前已導入的 PWA，讓整個網頁有更貼近 App 的使用體驗。
