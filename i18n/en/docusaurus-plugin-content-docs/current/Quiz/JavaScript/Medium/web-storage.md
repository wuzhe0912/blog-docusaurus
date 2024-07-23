---
id: web-storage
title: 📄 Please explain the differences between cookie, sessionStorage, and localStorage
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Comparison

| Property       | `cookie`                                                                                                             | `sessionStorage`                | `localStorage`                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------- |
| Lifespan       | Unless an expiration time (Expires) or maximum age (Max-Age) is set, it's deleted when the page is closed by default | Deleted when the page is closed | Permanently stored until manually deleted |
| HTTP Request   | Yes, can be sent to the server via Cookie header                                                                     | No                              | No                                        |
| Total capacity | 4KB                                                                                                                  | 5MB                             | 5MB                                       |
| Access scope   | Across windows/tabs                                                                                                  | Same tab                        | Across windows/tabs                       |
| Security       | JavaScript cannot access `HttpOnly cookies`                                                                          | None                            | None                                      |

## Term Explanation

> What are Persistent cookies?

Persistent cookies, also known as permanent cookies, are a method of storing data in the user's browser for an extended period. This is achieved by setting an expiration time (`Expires` or `Max-Age`) as mentioned in the previous question.

## Personal Implementation Experience

### `cookie`

#### 1. Security Verification

Some older projects had poor security, leading to frequent account theft issues, which significantly increased operational costs. We first chose to use the [Fingerprint](https://fingerprint.com/) package (the community version is stated to have about 60% accuracy, with a free monthly quota of 20,000 for the paid version). It identifies each logged-in user as a unique visitID based on device and geolocation parameters. Then, using the characteristic of cookies being sent with every HTTP request, the backend checks the user's current status for any changes in device or significant location shifts. If an anomaly is detected, it forcibly triggers OTP verification (via email or SMS, depending on company requirements) during the login process.

#### 2. Promotional Code URLs

When operating product websites, affiliate marketing strategies are often used, providing exclusive URLs to promotional partners for traffic and promotion. To ensure that customers who enter through these channels are credited to the respective promoter, I chose to implement this using the expires feature of cookies. This ensures that the promotional code remains valid for 24 hours (or a time limit decided by the operations team) from when the user enters the site through the referral link. Even if the user intentionally clears the promotional code parameter from the URL, the corresponding parameter will still be retrieved from the cookie during registration until it automatically expires after 24 hours.

### `localStorage`

#### 1. Storing User Preferences

- Commonly used to store personal user preferences, such as dark mode, i18n language settings, etc.
- Or to store login tokens.
