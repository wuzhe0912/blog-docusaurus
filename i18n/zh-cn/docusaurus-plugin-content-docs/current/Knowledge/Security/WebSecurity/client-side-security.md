---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Can you explain what CSP (Content Security Policy) is?

> 你能解释什么是 CSP (Content Security Policy) 吗？

原则上，CSP 是一种增强网页安全性的机制，可以通过设置 HTTP header，来限制网页内容能够加载的数据来源（白名单），以防止恶意的攻击者通过注入恶意的 script 来窃取用户的数据。

从前端的角度，为了防止 XSS (Cross-site scripting) 攻击，多会采用现代框架来做开发，主要在于它们提供了基本的保护机制，例如 React 的 JSX 会自动进行 HTML 转义，Vue 则是通过 `{{ data }}` 方式来绑定数据，同时进行自动转义 HTML 标签。

虽然前端在这块能做的不多，但还是有些细节优化可以处理，例如：

1. 如果需要输入内容的表单，可以通过验证特殊字符来避免攻击（但其实很难设想所有情境），所以多采用限制长度来控制 client 端输入的内容，或是限制输入的类型。
2. 若需要引用外部链接时，避免 http url 采用 https url。
3. 静态页面的网站，可以通过设置 meta tag 来限制，如下

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`：默认情况下，只允许从同一来源（即同一个域）加载数据。
- `img-src https://*`：只允许从 HTTPS 协议加载数据。
- `child-src 'none'`：不允许嵌入任何外部的子数据，例如 `<iframe>`。

## 2. What is XSS (Cross-site scripting) attack?

> 什么是 XSS (Cross-site scripting) 攻击？

XSS，即跨站脚本攻击，是指攻击者通过注入恶意的脚本，使之在用户的浏览器上运行，从而获取用户的敏感数据，如 cookie，或者直接改变网页内容将用户导向恶意网站。

### 预防存储型 XSS

攻击方可能会通过留言的方式，故意将含有恶意的 html 或 script 塞入数据库，这时候除了后端会进行转义外，前端的现代框架如 React 的 JSX 或是 Vue 的 template `{{ data }}`，也会协助进行转义，让 XSS 攻击几率降低。

### 预防反射型 XSS

避免使用 `innerHTML` 来操作 DOM，因为这样有机会执行 HTML 标签，一般推荐使用 `textContent` 来操作。

### 预防 DOM-based XSS

原则上，我们尽可能不让用户直接将 HTML 插入到页面上，如果有场景上的需求，框架本身也有类似的指令可以协助，例如 React 的 `dangerouslySetInnerHTML`，Vue 的 `v-html`，尽可能自动防止 XSS，但如果需要使用原生 JS 开发，也尽量使用 `textContent`, `createElement`, `setAttribute` 来操作 DOM。
