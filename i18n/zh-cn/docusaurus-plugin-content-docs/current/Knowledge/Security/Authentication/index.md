---
id: login-interview-index
title: '登录机制面试题总览'
slug: /experience/login
tags: [Experience, Interview, Login]
---

> 持续累积登录相关的面试题与应答重点，依难度由浅入深整理。

---

## Lv1 基础

- [过往项目的登录机制是怎么实现的？](/docs/experience/login/lv1-project-implementation)
- [Session-based 和 Token-based 有什么差异？](/docs/experience/login/lv1-session-vs-token)
- [JWT 的结构是什么？](/docs/experience/login/lv1-jwt-structure)

## Lv2 进阶

- Token 可能存放在哪些位置？需要注意哪些安全问题？（待整理）
- 前端如何自动在每个 API 请求中带上 Token？（待整理）
- Token 过期应如何处理？（待整理）

## Lv3 系统设计题

- 为何微服务架构偏好使用 JWT？（待整理）
- JWT 有哪些缺点？要如何处理主动登出？（待整理）
- 如何减少或阻止 Token 被盗用？（待整理）

## Lv4 进阶延伸题

- 若要实现「强制登出所有设备」，Session 与 Token 架构分别怎么做？（待整理）
- SSO（Single Sign-On）常见搭配哪种登录策略？（待整理）
