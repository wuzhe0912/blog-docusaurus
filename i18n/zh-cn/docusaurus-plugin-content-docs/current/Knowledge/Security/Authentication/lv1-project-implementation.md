---
id: login-lv1-project-implementation
title: '[Lv1] 过往项目的登录机制是怎么实现的？'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> 目标：用 3 ~ 5 分钟清楚交代「前端如何处理登录、状态维护与保护页面」，方便面试时快速回想。

---

## 1. 面试回答主轴

1. **登录流程三阶段**：提交表单 → 后端验证 → 存储 Token 与导航。
2. **状态与 Token 管理**：Pinia 搭配持久化，Axios Interceptor 自动附加 Bearer Token。
3. **后续处理与保护**：初始化共用数据、路由守卫、登出与例外情境（OTP、强制改密码）。

先以这三个重点破题，再依需求展开细节，让面试官感受到你具备整体视角。

---

## 2. 系统组成与职责分工

| 模块           | 位置                                | 角色                                         |
| -------------- | ----------------------------------- | -------------------------------------------- |
| `authStore`    | `src/stores/authStore.ts`           | 存储登录状态、持久化 Token、提供 getter      |
| `useAuth` Hook | `src/common/hooks/useAuth.ts`       | 封装登录 / 登出流程、统一返回格式            |
| 登录 API       | `src/api/login.ts`                  | 调用后端 `POST /login`、`POST /logout`       |
| Axios 工具     | `src/common/utils/request.ts`       | Request / Response Interceptor、统一错误处理 |
| 路由守卫       | `src/router/index.ts`               | 依 `meta` 判断是否需要登录、导向登录页       |
| 初始化流程     | `src/common/composables/useInit.ts` | App 启动时判断是否已有 Token、载入必要数据   |

> 记忆法：**「Store 管状态、Hook 管流程、Interceptor 管通道、Guard 管页面」**。

---

## 3. 登录流程（逐步拆解）

### Step 0. 表单与前置验证

- 支持一般密码与 SMS 验证码两种登录方式。
- 提交前先做基本验证（必填、格式、防重复提交）。

### Step 1. 调用登录 API

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` 统一错误处理与 loading 管理。
- 成功时 `data` 会带回 Token 与用户核心信息。

### Step 2. 处理后端响应

| 情况                                     | 行为                                              |
| ---------------------------------------- | ------------------------------------------------- |
| **需要补验证**（例如首次登录要身份确认） | 将 `authStore.onBoarding` 设为 `true`，导向验证页 |
| **强制修改密码**                         | 依返回标志导向变更密码流程并带入必要参数          |
| **一般成功**                             | 调用 `authStore.$patch()` 存储 Token 与用户信息   |

### Step 3. 登录完成后的共用动作

1. 获取用户基本资料与钱包列表。
2. 初始化个性化内容（例如礼物列表、通知）。
3. 依 `redirect` 或既定路由导向内页。

> 登录成功只是一半，**后续共用数据要在这个时机补齐**，避免每个页面再各自调一次 API。

---

## 4. Token 生命周期管理

### 4.1 存储策略

- `authStore` 启用 `persist: true`，将关键字段写入 `localStorage`。
- 优点：刷新后状态自动恢复；缺点：需自行注意 XSS 与安全性。

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- 需要授权的 API 会自动带入 Bearer Token。
- 若 API 明确标记 `needToken: false`（登录、注册等），则跳过带入流程。

### 4.3 过期与例外处理

- 后端若返回 Token 过期或无效，Response Interceptor 会统一转为错误提示并触发登出流程。
- 若要延伸可加入 Refresh Token 机制，目前项目采用简化策略。

---

## 5. 路由保护与初始化

### 5.1 路由守卫

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- 通过 `meta.needAuth` 决定是否检查登录状态。
- 未登录时导向登录页或指定公共页面。

### 5.2 应用启动初始化

`useInit` 在 App 启动时处理：

1. 检查 URL 是否带有 `login_token` 或 `platform_token`，若有就自动登录或设置 Token。
2. 如果 Store 已有 Token，就载入用户信息与共用数据。
3. 没有 Token 则停留在公共页面，等待用户手动登录。

---

## 6. 登出流程（收尾与清理）

1. 调用 `POST /logout` 告知后端。
2. 执行 `reset()`：
   - `authStore.$reset()` 清除登录信息。
   - 相关 Store（用户信息、收藏、邀请码等）一并重置。
3. 清理浏览器端缓存（例如 localStorage 中的缓存）。
4. 导回登录页或首页。

> 登出是登录的镜像：不只是删 Token，还要确保所有依赖状态被清除，避免残留数据。

---

## 7. 常见问题与最佳实践

- **流程拆解**：登录与登录后初始化分开，让 hook 保持精简。
- **错误处理**：统一通过 `useApi` 与 Response Interceptor，确保 UI 显示一致。
- **安全性**：
  - 全程使用 HTTPS。
  - Token 放在 `localStorage` 时，敏感操作需留意 XSS。
  - 视情况延伸 httpOnly Cookie 或 Refresh Token。
- **延伸备案**：OTP、强制改密码等情境保留弹性，由 hook 返回状态交由页面处理。

---

## 8. 面试快速备忘口诀

1. **「输入 → 验证 → 存储 → 导航」**：用这个顺序描述整体流程。
2. **「Store 记状态、Interceptor 帮带头、Guard 挡路人」**：凸显架构分工。
3. **「登录后立刻补齐共用数据」**：展现对用户体验的敏感度。
4. **「登出是一键重置 + 导回安全页」**：顾到安全与流程收敛。
