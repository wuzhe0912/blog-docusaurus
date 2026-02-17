---
title: '[Lv2] Nuxt 3 Lifecycle과 Hydration 원리'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Nuxt 3의 생명주기(Lifecycle), 상태 관리(State Management), Hydration 메커니즘을 깊이 이해하고, 일반적인 Hydration Mismatch 문제를 방지합니다.

---

## 1. 면접 답변 핵심

1. **Lifecycle 차이**: Server-side와 Client-side에서 실행되는 Hooks를 구분. `setup`은 양쪽 모두 실행되고, `onMounted`는 Client 측에서만 실행.
2. **상태 관리**: SSR 시나리오에서 `useState`와 `ref`의 차이 이해. `useState`는 Server와 Client 간 상태를 동기화하여 Hydration Mismatch를 방지.
3. **Hydration 메커니즘**: Hydration이 정적 HTML을 인터랙티브 애플리케이션으로 변환하는 방법과 일반적인 Mismatch 원인(HTML 구조 불일치, 랜덤 콘텐츠 등) 설명.

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Lifecycle Hooks 실행 환경

Nuxt 3 (Vue 3 SSR)에서 다른 Hooks는 다른 환경에서 실행됩니다:

| Lifecycle Hook | Server-side | Client-side | 설명 |
|----------------|-------------|-------------|------|
| **setup()** | ✅ 실행 | ✅ 실행 | 컴포넌트 초기화 로직. **주의: setup에서 Client 전용 API(window, document 등)를 사용하지 않을 것**. |
| **onBeforeMount** | ❌ 실행 안 됨 | ✅ 실행 | 마운트 전. |
| **onMounted** | ❌ 실행 안 됨 | ✅ 실행 | 마운트 완료. **DOM 조작, Browser API 호출은 여기에서 수행**. |
| **onBeforeUpdate** | ❌ 실행 안 됨 | ✅ 실행 | 데이터 업데이트 전. |
| **onUpdated** | ❌ 실행 안 됨 | ✅ 실행 | 데이터 업데이트 후. |
| **onBeforeUnmount** | ❌ 실행 안 됨 | ✅ 실행 | 언마운트 전. |
| **onUnmounted** | ❌ 실행 안 됨 | ✅ 실행 | 언마운트 후. |

### 2.2 일반적인 면접 문제: onMounted가 Server에서 실행되나요?

**답변:**
아니요. `onMounted`는 Client 측(브라우저)에서만 실행됩니다. Server 측 렌더링은 HTML 문자열 생성만 담당하며, DOM 마운팅(Mounting)은 수행하지 않습니다.

**후속 질문: Server 측에서 특정 로직을 실행해야 하는 경우는?**
- `setup()` 또는 `useAsyncData` / `useFetch`를 사용.
- 환경을 구분해야 하는 경우, `process.server` 또는 `process.client`로 판별.

```typescript
<script setup>
// Server와 Client 모두 실행
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // Client에서만 실행
  console.log('Mounted (Client Only)');
  // 안전하게 window 사용
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 왜 Nuxt에 useState가 필요한가?

SSR 애플리케이션에서 Server 측이 HTML 렌더링을 완료한 후, 상태(State)를 직렬화하여 Client 측에 전송하고, Client 측에서 Hydration(상태 인수인계)을 수행합니다.

- **Vue `ref`**: 컴포넌트 내부의 로컬 상태입니다. SSR 과정에서 Server 측에서 생성된 `ref` 값은 Client 측에 **자동으로 전송되지 않습니다**. Client 측 초기화 시 `ref`가 다시 생성되어(보통 초기값으로 리셋), Server 렌더링 내용과 Client 초기 상태가 불일치하여 Hydration Mismatch가 발생합니다.
- **Nuxt `useState`**: SSR 친화적인 상태 관리입니다. 상태를 `NuxtPayload`에 저장하고 HTML과 함께 Client에 전송합니다. Client 측 초기화 시 이 Payload를 읽어 상태를 복원하여 Server와 Client 상태의 일관성을 보장합니다.

### 3.2 비교표

| 특성 | Vue `ref` / `reactive` | Nuxt `useState` |
|------|------------------------|-----------------|
| **스코프** | 컴포넌트 내부 / 모듈 내부 | 전역 (App 범위에서 key를 통해 공유 가능) |
| **SSR 상태 동기화** | ❌ 동기화 안 됨 | ✅ 자동 직렬화 후 Client에 동기화 |
| **적용 시나리오** | Client 측 인터랙션 상태만, SSR 동기화 불필요한 데이터 | 크로스 컴포넌트 상태, Server에서 Client로 가져와야 하는 데이터 (User Info 등) |

### 3.3 구현 예시

**잘못된 예시 (ref로 크로스 플랫폼 상태 관리):**

```typescript
// Server 측에서 랜덤 수 생성 -> HTML에 5 표시
const count = ref(Math.random());

// Client 측에서 재실행 -> 새로운 랜덤 수 3 생성
// 결과: Hydration Mismatch (Server: 5, Client: 3)
```

**올바른 예시 (useState 사용):**

```typescript
// Server 측에서 랜덤 수 생성 -> Payload에 저장 (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client 측에서 Payload 읽기 -> Server가 생성한 값 획득
// 결과: 상태 일치
```

---

## 4. Hydration과 Hydration Mismatch

### 4.1 Hydration이란?

Hydration(하이드레이션)은 Client 측 JavaScript가 Server 측에서 렌더링한 정적 HTML을 인수인계하는 과정입니다.

1. **Server Rendering**: Server가 Vue 애플리케이션을 실행하여 HTML 문자열(콘텐츠와 CSS 포함) 생성.
2. **HTML 다운로드**: 브라우저가 정적 HTML을 다운로드하고 표시 (First Paint).
3. **JS 다운로드 및 실행**: 브라우저가 Vue/Nuxt의 JS bundle 다운로드.
4. **Hydration**: Vue가 Client 측에서 가상 DOM (Virtual DOM)을 재구축하고 기존 실제 DOM과 비교. 구조가 일치하면 Vue가 이 DOM 요소들을 "활성화"하여 (이벤트 리스너 바인딩) 페이지를 인터랙티브하게 만듦.

### 4.2 Hydration Mismatch란?

Client 측에서 생성된 Virtual DOM 구조와 Server 측에서 렌더링된 HTML 구조가 **일치하지 않을** 때, Vue는 Hydration Mismatch 경고를 표시합니다. 이는 보통 Client 측이 Server의 HTML을 폐기하고 다시 렌더링해야 함을 의미하며, 성능 저하와 화면 깜박임을 초래합니다.

### 4.3 일반적인 Mismatch 원인과 해결법

#### 1. 잘못된 HTML 구조
브라우저가 잘못된 HTML 구조를 자동 수정하여 Vue의 기대와 불일치.
- **예시**: `<p>` 태그 안에 `<div>` 포함.
- **해결법**: HTML 구문을 확인하고 중첩 구조가 올바른지 확인.

#### 2. 랜덤 콘텐츠 또는 타임스탬프
Server와 Client 실행 시 다른 콘텐츠 생성.
- **예시**: `new Date()`, `Math.random()`.
- **해결법**:
    - `useState`로 값 고정.
    - 또는 이런 로직을 `onMounted`로 이동 (Client에서만 렌더링, Server에서는 빈 값 또는 Placeholder 표시).

```typescript
// 잘못됨
const time = new Date().toISOString();

// 올바름 (onMounted 사용)
const time = ref('');
onMounted(() => {
  time.value = new Date().toISOString();
});

// 또는 <ClientOnly> 사용
<ClientOnly>
  <div>{{ new Date() }}</div>
</ClientOnly>
```

#### 3. window/document에 의존하는 조건부 렌더링
- **예시**: `v-if="window.innerWidth > 768"`
- **원인**: Server 측에는 window가 없어 false로 판정, Client 측에서는 true로 판정.
- **해결법**: `onMounted`에서 상태 업데이트하거나, `useWindowSize` 등 Client-only hooks 사용.

---

## 5. 면접 요약

**이렇게 답변할 수 있습니다:**

> Server-side와 Client-side의 주요 차이점은 Lifecycle Hooks의 실행에 있습니다. Server 측은 주로 `setup`을 실행하고, `onMounted` 등 DOM 관련 Hooks는 Client 측에서만 실행됩니다. 이것이 Hydration 개념으로 이어집니다. 즉, Client 측이 Server HTML을 인수인계하는 과정입니다.
>
> Hydration Mismatch를 방지하려면 Server와 Client의 초기 렌더링 내용이 일치해야 합니다. 이것이 Nuxt가 `useState`를 제공하는 이유입니다. Vue의 `ref`와 달리 `useState`는 상태를 직렬화하여 Client에 전송하고 양쪽 상태를 동기화합니다. `ref`로 Server 측에서 생성된 데이터를 저장하면 Client 측 리셋 시 불일치가 발생합니다.
>
> 일반적인 Mismatch로는 랜덤 수, 타임스탬프, 잘못된 HTML 중첩 구조 등이 있습니다. 해결 방법은 변동 콘텐츠를 `onMounted`로 이동하거나 `<ClientOnly>` 컴포넌트를 사용하는 것입니다.

**핵심 포인트:**
- ✅ `onMounted`는 Client에서만 실행
- ✅ `useState`는 SSR 상태 동기화 지원, `ref`는 미지원
- ✅ Hydration Mismatch 원인(구조, 랜덤 값)과 해결법(`<ClientOnly>`, `onMounted`)
