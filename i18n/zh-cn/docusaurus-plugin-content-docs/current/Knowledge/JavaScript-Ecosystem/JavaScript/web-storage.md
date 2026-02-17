---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## 比对

| 属性 | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| 生命周期 | 除非设定过期时间(Expires)或最大保存时间(Max-Age)，否则默认关闭页面即删除 | 关闭页面即删除 | 永久保存直到执行删除 |
| HTTP Request | 是，可以通过 Cookie header 带给 Server 端 | 否 | 否 |
| 总容量 | 4KB | 5MB | 5MB |
| 存取(访问)范围 | 跨窗口/分页 | 同一分页 | 跨窗口/分页 |
| 安全性 | JavaScript 无法存取 `HttpOnly cookies` | 无 | 无 |

## 名词解释

> 什么是 Persistent cookies？

持久性 cookie 或称永久性 cookie，是一种将数据长时间储存在用户浏览器上的做法，具体做法就是上题所提到，通过设定过期时间来达成（`Expires` 或 `Max-Age`）。

## 个人实践经验

### `cookie`

#### 1. 安全验证

某些旧项目的安全状况不佳，频繁发生盗号问题，导致运营成本大幅提升。先选择采用 [Fingerprint](https://fingerprint.com/) 套件（社区版官方给出的说明是准确度大约 60%，付费版的月免费额度 2 万），将每个登录的用户通过设备和地理位置参数标识成独立的 visitID，再利用 cookie 每次 HTTP 请求都会带上的特性，让后端检查该用户目前的状况，是否出现更换手机或所在地位置出现偏离，一旦发现异常，就在登录流程下强制触发 OTP 验证（视公司需求，可能是 email 或短信）。

#### 2. 推广码网址

运营产品网站时，常会提供一些联盟营销的策略，提供专属的网址给合作的推广者，方便其进行导流与推广。为了确保这些通过导流进入的客户属于该推广者的业绩，当时选择采用 `cookie` 的 `expires` 特性来实现，让用户从导流进入网站起，24 小时内（限制时间可以由运营方决定）强制该推广码是有效的，即使用户故意清除 URL 上的推广码参数，注册时仍会从 `cookie` 抓对应参数带入，直到 24 小时后才会自动失效。

### `localStorage`

#### 1. 储存用户偏好设定

- 常用于储存用户的个人偏好设定，例如 dark mode、i18n 语系等。
- 或者储存 login 的 token。
