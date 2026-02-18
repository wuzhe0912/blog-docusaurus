---
id: 2023-experience
title: '2023 Experience'
slug: /2023-experience
---

## What is the most challenging technical problem you have solved?

A recent challenge was implementing WebAuthn login so web users could authenticate with a Face ID/Touch ID-like experience comparable to the native app.

### Context

- Goal: smoother and faster login UX on the web
- Constraint: limited prior production experience with WebAuthn
- Complexity: platform behavior differences across iOS and Android

### What made it difficult

- Parameter tuning and ceremony options were sensitive
- Documentation examples did not fully cover real product edge cases
- Android biometric triggering needed backend-side compatibility adjustments

### What I did

1. Validated feasibility with prototype references
2. Aligned registration/login decision flow with PM and backend
3. Iteratively tested authenticator options and fallback behavior
4. Worked with backend to adjust challenge and credential handling for cross-device consistency

### Outcome

- Web login experience became closer to native app flow
- Combined with PWA improvements, user friction was reduced
- Team gained reusable implementation knowledge for future authentication upgrades

### References used during implementation

- [webauthn.io](https://webauthn.io/)
- [Introduction to WebAuthn API](https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285)
