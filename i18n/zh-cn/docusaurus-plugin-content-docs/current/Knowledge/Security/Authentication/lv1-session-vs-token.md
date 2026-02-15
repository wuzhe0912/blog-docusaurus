---
id: login-lv1-session-vs-token
title: '[Lv1] Session-based 和 Token-based 有什么差异？'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> 面试时常见的追问：你了解传统 Session 与现代 Token 的差别吗？掌握下列重点，能快速整理思路。

---

## 1. 两种验证模式的核心概念

### Session-based Authentication

- **状态保存在服务器**：用户第一次登录后，服务器在内存或数据库建立 Session，返回 Session ID 存在 Cookie。
- **后续请求依赖 Session ID**：浏览器会在同域名自动带上 Session Cookie，服务器根据 Session ID 找出对应的用户信息。
- **常见于传统 MVC / 单体应用**：服务器负责渲染页面并维持用户状态。

### Token-based Authentication（例如 JWT）

- **状态保存在客户端**：登录成功后产生 Token（可携带用户信息与权限），由前端保存。
- **每次请求带上 Token**：通常放在 `Authorization: Bearer <token>`，服务器验证签章即可取得用户信息。
- **常见于 SPA / 微服务**：后端只需验证 Token，不需储存用户状态。

---

## 2. 请求流程比较

| 流程步骤 | Session-based                                           | Token-based (JWT)                                                     |
| -------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| 登录成功 | 服务器建立 Session，返回 `Set-Cookie: session_id=...`    | 服务器签发 Token，返回 JSON：`{ access_token, expires_in, ... }`      |
| 存储位置 | 浏览器 Cookie（通常是 httponly）                         | 前端自行选择：`localStorage`、`sessionStorage`、Cookie、Memory        |
| 后续请求 | 浏览器自动带 Cookie，服务器查表取得用户信息             | 前端手动在 Header 带 `Authorization`                                  |
| 验证方式 | 查询 Session Store                                      | 验证 Token 签章，或比对黑名单 / 白名单                               |
| 登出     | 删除服务器 Session、返回 `Set-Cookie` 清除 Cookie        | 前端删除 Token；若要强制失效须记录于黑名单或轮换密钥                 |

---

## 3. 优缺点总整理

| 方面     | Session-based                                                                 | Token-based (JWT)                                                                 |
| -------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 优点     | - Cookie 自动带入，浏览器端简单<br />- Session 可存储大量数据<br />- 易于撤销与强制登出 | - 无状态，可横向扩展<br />- 适合 SPA、移动设备、微服务<br />- Token 可跨域、跨设备使用 |
| 缺点     | - 服务器需维护 Session Store，会占内存<br />- 分布式部署需要 Session 同步 | - Token 体积较大，每次请求都会传输<br />- 无法轻易撤销，需额外黑名单 / 轮换密钥机制       |
| 安全风险 | - 容易受 CSRF 攻击（Cookie 会自动带出）<br />- 若泄漏 Session ID，需立即清除 | - 容易受 XSS 影响（若保存在可被读取的位置）<br />- 若 Token 过期前被窃取，可重放请求     |
| 使用场景 | - 传统 Web (SSR) + 相同域名<br />- 服务器负责渲染页面                           | - RESTful API / GraphQL<br />- 移动 App、单页应用、微服务                          |

---

## 4. 如何选择？

### 先问自己三个问题

1. **是否需要跨域或多端共用登录状态？**
   - 需要 → Token-based 较灵活。
   - 不需要 → Session-based 较简洁。

2. **部署是否为多台服务器或微服务？**
   - 是 → Token-based 可以减少 Session 复制或集中化的需求。
   - 否 → Session-based 轻松又安全。

3. **是否有高安全性需求（银行、企业系统）？**
   - 较高需求 → Session-based + httponly Cookie + CSRF 防护仍是主流。
   - 轻量 API 或移动服务 → Token-based + HTTPS + Refresh Token + 黑名单策略。

### 常见搭配策略

- **企业内部系统**：Session-based + Redis / Database 同步。
- **现代 SPA + 移动 App**：Token-based（Access Token + Refresh Token）。
- **大型微服务**：Token-based（JWT）搭配 API Gateway 验证。

---

## 5. 面试回答模板

> 「传统 Session 是把状态放在服务器，返回 session id 存在 Cookie，浏览器每次请求会自动带上 Cookie，所以很适合同域名的 Web App。缺点是服务器要维护 Session Store，如果部署多台还要同步。
> 相对地 Token-based（例如 JWT）则是把用户信息编码成 Token 放在客户端，每次请求由前端手动带在 Header。这种方式是无状态，适合 SPA 和微服务，扩展比较容易。
> 安全考量上，Session 要重视 CSRF，Token 要注意 XSS。如果我要做跨域、移动设备或多服务整合，我会选 Token；如果是传统企业系统、服务端渲染，我会选 Session 搭配 httponly Cookie。」

---

## 6. 面试延伸备忘

- Session → 着重 **CSRF 防护、Session 同步策略、多久清除**。
- Token → 着重 **存储位置（Cookie vs localStorage）**、**Refresh Token 机制**、**黑名单 / 轮换密钥**。
- 可以补充企业常用的折中方案：`httpOnly Cookie` 存储 Token，也能搭配 CSRF Token。

---

## 7. 参考资料

- [MDN：HTTP Cookies](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
- [Auth0：Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP：Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
