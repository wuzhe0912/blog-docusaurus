---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> 你解决过最困难的技术问题是什么？

### Webauthn

近期处理起来比较新且相关经验较少的技术问题，是实作 Webauthn 的登入。需求方希望，能让使用者在登入网页端的网站时，能触发和 App 相同的 Face ID / Touch ID 机制，让使用体验更为平滑顺畅。

实作前教学内容参考如下：

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

初步确认应该可行后，和 PM 端确认整个登入注册流程，包含首次登入时是否触发生物验证，以及判定机制等。实作过程中，遇到最大的难题是，需要不断微调各种传入参数，因为可参考的资料毕竟还是太少，很多参数的意义都不是很清楚，只能不断尝试。在装置上，iOS 手机相对好处理，但 Android 手机则出现不易触发 Touch ID，需要后端协助配合修改部分参数兼容。最后功能完成后，搭配此前已导入的 PWA，让整个网页有更贴近 App 的使用体验。
