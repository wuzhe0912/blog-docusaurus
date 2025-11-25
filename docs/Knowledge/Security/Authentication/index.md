---
id: login-interview-index
title: '登入機制面試題總覽'
slug: /experience/login
tags: [Experience, Interview, Login]
---

> 持續累積登入相關的面試題與應答重點，依難度由淺入深整理。

---

## Lv1 基礎

- [過往專案的登入機制是怎麼實作的？](/docs/experience/login/lv1-project-implementation)
- [Session-based 和 Token-based 有什麼差異？](/docs/experience/login/lv1-session-vs-token)
- [JWT 的結構是什麼？](/docs/experience/login/lv1-jwt-structure)

## Lv2 進階

- Token 可能存放在哪些位置？需要注意哪些安全議題？（待整理）
- 前端如何自動在每個 API 請求中帶上 Token？（待整理）
- Token 過期應如何處理？（待整理）

## Lv3 系統設計題

- 為何微服務架構偏好使用 JWT？（待整理）
- JWT 有哪些缺點？要如何處理主動登出？（待整理）
- 如何減少或阻止 Token 被盜用？（待整理）

## Lv4 進階延伸題

- 若要實作「強制登出所有裝置」，Session 與 Token 架構分別怎麼做？（待整理）
- SSO（Single Sign-On）常見搭配哪種登入策略？（待整理）
