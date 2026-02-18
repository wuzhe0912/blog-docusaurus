---
id: client-side-security
title: "[Easy] 📄 Client Side Security"
slug: /client-side-security
---

## 1. Can you explain what CSP (Content Security Policy) is?

> Can you explain what CSP (Content Security Policy) is?

In principle, CSP is a mechanism that enhances web page security. By configuring HTTP headers, it restricts the sources from which page content can be loaded (whitelist), preventing malicious attackers from stealing user data through injected scripts.

From a frontend perspective, to prevent XSS (Cross-Site Scripting) attacks, modern frameworks are commonly used for development because they provide built-in protection mechanisms. For example, React's JSX automatically escapes HTML, and Vue uses `{{ data }}` binding which also auto-escapes HTML tags.

While there's limited action the frontend can take in this area, there are still some optimizations:

1. For forms that accept user input, you can validate special characters to prevent attacks (though it's difficult to cover all scenarios). It's more common to limit input length to control client-side content, or restrict input types.
2. When referencing external links, prefer HTTPS URLs over HTTP URLs.
3. For static websites, you can restrict content through a meta tag, as follows:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: By default, only allow loading resources from the same origin (same domain).
- `img-src https://*`: Only allow loading images over HTTPS.
- `child-src 'none'`: Disallow embedding any external child resources, such as `<iframe>`.

## 2. What is XSS (Cross-site scripting) attack?

> What is an XSS (Cross-Site Scripting) attack?

XSS, or Cross-Site Scripting, is an attack where attackers inject malicious scripts that execute in the user's browser, allowing them to steal sensitive data such as cookies, or directly modify page content to redirect users to malicious websites.

### Preventing Stored XSS

Attackers may intentionally inject malicious HTML or scripts into a database through comment forms. In addition to backend escaping, modern frontend frameworks like React's JSX and Vue's template `{{ data }}` syntax also perform escaping to reduce the risk of XSS attacks.

### Preventing Reflected XSS

Avoid using `innerHTML` to manipulate the DOM, as it can execute HTML tags. It is recommended to use `textContent` instead.

### Preventing DOM-based XSS

In principle, we should avoid letting users directly insert HTML into the page. If required by a specific use case, frameworks provide directives to assist — for example, React's `dangerouslySetInnerHTML` and Vue's `v-html` — which help prevent XSS automatically. If native JavaScript is required, prefer using `textContent`, `createElement`, and `setAttribute` to manipulate the DOM.
