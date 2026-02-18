---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Comparison

| Property       | `cookie`                                                                                           | `sessionStorage`              | `localStorage`                  |
| -------------- | -------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------- |
| Lifetime       | Deleted when the page closes unless an expiration (`Expires`) or max age (`Max-Age`) is set      | Deleted when the tab closes   | Persists until manually removed |
| HTTP Request   | Yes, sent to the server through the Cookie header                                                  | No                            | No                              |
| Storage limit  | 4KB                                                                                                | 5MB                           | 5MB                             |
| Access scope   | Across windows/tabs                                                                                | Same tab only                 | Across windows/tabs             |
| Security       | JavaScript cannot access `HttpOnly cookies`                                                        | No special protection by default | No special protection by default |

## Terminology

> What are persistent cookies?

A persistent cookie (also called a permanent cookie) stores data in the user's browser for a long period.  
As mentioned above, this is done by setting an expiration value (`Expires` or `Max-Age`).

## Practical Experience

### `cookie`

#### 1. Security verification

Some legacy projects had weak security and frequent account theft, which significantly increased operational costs.  
I used [Fingerprint](https://fingerprint.com/) first (the community version is officially described as around 60% accurate, and the paid version includes 20,000 free monthly requests).  
Each logged-in user was identified as a unique visit ID based on device and geolocation parameters. Then, taking advantage of the fact that cookies are sent with every HTTP request, the backend could verify whether the user had switched devices or showed suspicious location drift. If an anomaly was detected, the login flow forcibly triggered OTP verification (email or SMS, depending on company policy).

#### 2. Referral-code URLs

When operating a product website, affiliate marketing is common: each promoter gets a dedicated URL for attribution.  
To ensure users acquired through that traffic were still credited to the promoter, I implemented a solution with the cookie `expires` attribute. Once a user entered via a referral link, the referral code stayed valid for 24 hours (the time window can be configured by operations). Even if the user removed referral parameters from the URL, registration still read the value from `cookie` until it expired automatically.

### `localStorage`

#### 1. Storing user preferences

- Commonly used to store user preferences such as dark mode and i18n locale.
- Can also store login tokens.
