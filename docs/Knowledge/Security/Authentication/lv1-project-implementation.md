---
id: login-lv1-project-implementation
title: '[Lv1] How Was Authentication Implemented in Past Projects?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Goal: Clearly explain "how the frontend handles login, state management, and page protection" in 3–5 minutes, making it easy to recall during interviews.

---

## 1. Interview Answer Key Points

1. **Three Stages of Login Flow**: Submit form → Backend verification → Store token and redirect.
2. **State and Token Management**: Pinia with persistence, Axios Interceptor to automatically attach Bearer Token.
3. **Post-login Handling and Protection**: Initialize shared data, route guards, logout, and edge cases (OTP, forced password change).

Lead with these three key points, then expand into details as needed, showing the interviewer that you have a holistic perspective.

---

## 2. System Components and Responsibilities

| Module           | Location                            | Role                                                     |
| ---------------- | ----------------------------------- | -------------------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Stores login state, persists token, provides getters     |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Encapsulates login/logout flow, unified return format    |
| Login API        | `src/api/login.ts`                  | Calls backend `POST /login`, `POST /logout`              |
| Axios Utility    | `src/common/utils/request.ts`       | Request/Response Interceptor, unified error handling     |
| Route Guard      | `src/router/index.ts`               | Checks `meta` to determine if login is required          |
| Initialization   | `src/common/composables/useInit.ts` | Checks for existing token on app startup, loads required data |

> Mnemonic: **"Store manages state, Hook manages flow, Interceptor manages the channel, Guard manages the pages."**

---

## 3. Login Flow (Step by Step)

### Step 0. Form and Pre-validation

- Supports two login methods: password and SMS verification code.
- Basic validation before submission (required fields, format, debounce).

### Step 1. Call the Login API

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` handles error management and loading state uniformly.
- On success, `data` returns the token and core user information.

### Step 2. Handle Backend Response

| Scenario                                            | Behavior                                                         |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| **Additional verification required** (e.g., first login identity confirmation) | Set `authStore.onBoarding` to `true`, redirect to verification page |
| **Forced password change**                          | Redirect to password change flow with necessary parameters        |
| **Normal success**                                  | Call `authStore.$patch()` to store token and user information     |

### Step 3. Shared Actions After Login

1. Fetch user profile and wallet list.
2. Initialize personalized content (e.g., gift list, notifications).
3. Redirect to the inner page based on `redirect` or predefined route.

> A successful login is only half the job — **shared data should be loaded at this point** to avoid each page making separate API calls.

---

## 4. Token Lifecycle Management

### 4.1 Storage Strategy

- `authStore` enables `persist: true`, writing key fields to `localStorage`.
- Pros: State automatically recovers after page refresh. Cons: Must be mindful of XSS and security.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- APIs requiring authorization automatically include the Bearer Token.
- APIs explicitly marked with `needToken: false` (login, registration, etc.) skip the token attachment.

### 4.3 Expiration and Exception Handling

- If the backend returns a token-expired or invalid-token response, the Response Interceptor uniformly converts it to an error notification and triggers the logout flow.
- A Refresh Token mechanism can be added as an extension, but the current project uses a simplified strategy.

---

## 5. Route Protection and Initialization

### 5.1 Route Guard

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- Uses `meta.needAuth` to determine whether to check login status.
- Redirects to the login page or a designated public page when not logged in.

### 5.2 App Startup Initialization

`useInit` handles the following on app startup:

1. Checks if the URL contains `login_token` or `platform_token` — if so, performs automatic login or sets the token.
2. If the Store already has a token, loads user information and shared data.
3. If there's no token, stays on the public page and waits for the user to log in manually.

---

## 6. Logout Flow (Cleanup)

1. Call `POST /logout` to notify the backend.
2. Execute `reset()`:
   - `authStore.$reset()` clears login information.
   - Related stores (user info, favorites, invitation codes, etc.) are also reset.
3. Clear browser-side caches (e.g., localStorage caches).
4. Redirect to the login page or homepage.

> Logout is the mirror image of login: it's not just about deleting the token — you must ensure all dependent state is cleared to avoid data leaks.

---

## 7. Common Questions and Best Practices

- **Flow Decomposition**: Separate login and post-login initialization to keep hooks concise.
- **Error Handling**: Unified through `useApi` and Response Interceptor to ensure consistent UI behavior.
- **Security**:
  - Always use HTTPS.
  - When storing tokens in `localStorage`, be cautious of XSS for sensitive operations.
  - Consider extending with httpOnly Cookies or Refresh Token as needed.
- **Extensibility**: Edge cases like OTP and forced password changes are handled flexibly — the hook returns status for the view layer to process.

---

## 8. Interview Quick Reference Mnemonics

1. **"Input → Validate → Store → Redirect"**: Use this order to describe the overall flow.
2. **"Store manages state, Interceptor handles headers, Guard blocks unauthorized access"**: Highlight architectural separation.
3. **"Load shared data immediately after login"**: Demonstrates sensitivity to user experience.
4. **"Logout is a one-click reset + redirect to a safe page"**: Covers security and flow completion.
