---
id: login-lv1-session-vs-token
title: '[Lv1] What Are the Differences Between Session-based and Token-based Authentication?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> A common interview follow-up: Do you understand the differences between traditional Session and modern Token? Master the following key points to quickly organize your thoughts.

---

## 1. Core Concepts of Both Authentication Models

### Session-based Authentication

- **State is stored on the server**: After the user's first login, the server creates a Session in memory or a database and returns a Session ID stored in a Cookie.
- **Subsequent requests rely on the Session ID**: The browser automatically sends the Session Cookie for the same domain, and the server looks up the corresponding user information using the Session ID.
- **Common in traditional MVC / monolithic applications**: The server is responsible for rendering pages and maintaining user state.

### Token-based Authentication (e.g., JWT)

- **State is stored on the client**: After a successful login, a Token (which can carry user information and permissions) is generated and stored by the frontend.
- **Token is sent with every request**: Typically placed in `Authorization: Bearer <token>`. The server verifies the signature to retrieve user information.
- **Common in SPA / microservices**: The backend only needs to verify the Token without storing user state.

---

## 2. Request Flow Comparison

| Step           | Session-based                                           | Token-based (JWT)                                                     |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Login success  | Server creates Session, returns `Set-Cookie: session_id=...` | Server issues Token, returns JSON: `{ access_token, expires_in, ... }` |
| Storage        | Browser Cookie (usually httpOnly)                       | Frontend's choice: `localStorage`, `sessionStorage`, Cookie, Memory   |
| Subsequent requests | Browser automatically sends Cookie; server looks up user info | Frontend manually adds `Authorization` header                        |
| Verification   | Query Session Store                                     | Verify Token signature, or check blacklist/whitelist                  |
| Logout         | Delete server Session; return `Set-Cookie` to clear Cookie | Frontend deletes Token; forced invalidation requires blacklist or key rotation |

---

## 3. Pros and Cons Summary

| Aspect         | Session-based                                                                 | Token-based (JWT)                                                                 |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Pros           | - Cookie is sent automatically, simple on the browser side<br />- Session can store large amounts of data<br />- Easy to revoke and force logout | - Stateless, horizontally scalable<br />- Suitable for SPA, mobile, microservices<br />- Token works across domains and devices |
| Cons           | - Server must maintain Session Store, consuming memory<br />- Distributed deployments require Session synchronization | - Token is larger, transmitted with every request<br />- Cannot be easily revoked; requires blacklist/key rotation mechanisms |
| Security Risks | - Vulnerable to CSRF attacks (Cookie is sent automatically)<br />- If Session ID is leaked, it must be cleared immediately | - Vulnerable to XSS (if stored in a readable location)<br />- If Token is stolen before expiration, requests can be replayed |
| Use Cases      | - Traditional Web (SSR) + same domain<br />- Server-rendered pages            | - RESTful API / GraphQL<br />- Mobile apps, SPA, microservices                    |

---

## 4. How to Choose?

### Ask Yourself Three Questions

1. **Do you need cross-domain or multi-platform shared login state?**
   - Yes → Token-based is more flexible.
   - No → Session-based is simpler.

2. **Is the deployment multi-server or microservices?**
   - Yes → Token-based reduces the need for Session replication or centralization.
   - No → Session-based is easy and secure.

3. **Are there high security requirements (banking, enterprise systems)?**
   - Higher requirements → Session-based + httpOnly Cookie + CSRF protection remains mainstream.
   - Lightweight API or mobile services → Token-based + HTTPS + Refresh Token + blacklist strategy.

### Common Combination Strategies

- **Enterprise internal systems**: Session-based + Redis / Database synchronization.
- **Modern SPA + Mobile App**: Token-based (Access Token + Refresh Token).
- **Large-scale microservices**: Token-based (JWT) with API Gateway verification.

---

## 5. Interview Answer Template

> "Traditional Session stores state on the server and returns a session ID in a Cookie. The browser automatically sends the Cookie with each request, making it well-suited for same-domain Web Apps. The downside is that the server must maintain a Session Store, and multi-server deployments require synchronization.
> In contrast, Token-based (e.g., JWT) encodes user information into a Token stored on the client, and the frontend manually includes it in the Header with each request. This approach is stateless, making it suitable for SPA and microservices, and easier to scale.
> Regarding security, Session needs to guard against CSRF, while Token needs to watch for XSS. If I need cross-domain, mobile device, or multi-service integration, I'd choose Token. For traditional enterprise systems with server-side rendering, I'd choose Session with httpOnly Cookies."

---

## 6. Interview Follow-up Notes

- Session → Focus on **CSRF protection, Session synchronization strategies, and cleanup frequency**.
- Token → Focus on **storage location (Cookie vs localStorage)**, **Refresh Token mechanism**, and **blacklist / key rotation**.
- You can mention the common compromise approach used in enterprises: storing the Token in an `httpOnly Cookie`, which can also be paired with a CSRF Token.

---

## 7. References

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
