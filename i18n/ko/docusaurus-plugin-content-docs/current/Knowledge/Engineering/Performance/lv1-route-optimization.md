---
id: performance-lv1-route-optimization
title: '[Lv1] 라우트 레벨 최적화: 3단계 Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> 3단계 라우트 Lazy Loading을 통해 최초 로딩을 12.5MB에서 850KB로 줄이고, 첫 화면 시간을 70% 단축했습니다.

---

## 문제 배경 (Situation)

프로젝트 특성:

- **27+ 개의 멀티 테넌트 템플릿** (멀티 테넌트 아키텍처)
- **각 템플릿에 20-30개 페이지** (홈, 로비, 프로모션, 에이전트, 뉴스 등)
- **모든 코드를 한 번에 로드하면**: 최초 진입 시 **10MB+의 JS 파일** 다운로드 필요
- **사용자 대기 시간 10초 이상** (특히 모바일 네트워크 환경에서)

## 최적화 목표 (Task)

1. **최초 로딩 JavaScript 크기 감소** (목표: < 1MB)
2. **첫 화면 시간 단축** (목표: < 3초)
3. **필요에 따른 로딩** (사용자가 필요한 콘텐츠만 다운로드)
4. **개발 경험 유지** (개발 효율에 영향 없음)

## 솔루션 (Action)

**3단계 라우트 Lazy Loading** 전략을 채택하여 "템플릿" → "페이지" → "권한" 세 레벨에서 최적화했습니다.

### 1단계: 동적 템플릿 로딩

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // 환경 변수에 따라 해당 템플릿 라우트를 동적으로 로딩
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

설명:

- 프로젝트에 27개 템플릿이 있지만, 사용자는 그 중 1개만 사용
- environment.json으로 현재 브랜드를 판단
- 해당 브랜드의 라우트 설정만 로드하고, 나머지 26개 템플릿은 전혀 로드하지 않음

효과:

- 최초 로딩 시 라우트 설정 코드 약 85% 감소

### 2단계: 페이지 Lazy Loading

```typescript
// 기존 방식 (X - 비추천)
import HomePage from './pages/HomePage.vue';
component: HomePage; // 모든 페이지가 main.js에 번들됨

// 우리의 방식 (✓ - 추천)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- 각 라우트에 화살표 함수 + import()를 사용
- 사용자가 실제로 해당 페이지에 방문할 때만 대응하는 JS chunk를 다운로드
- Vite가 자동으로 각 페이지를 독립 파일로 번들링

### 3단계: 주문형 로딩 전략

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // 미로그인 사용자는 "에이전트 센터" 등 로그인 필요 페이지를 로드하지 않음
    return next({ name: 'HomePage' });
  }
  next();
});
```

## 최적화 성과 (Result)

**최적화 전:**

```
최초 로딩: main.js (12.5 MB)
첫 화면 시간: 8-12초
모든 27개 템플릿 + 모든 페이지 포함
```

**최적화 후:**

```markdown
최초 로딩: main.js (850 KB) ↓ 93%
첫 화면 시간: 1.5-2.5초 ↑ 70%
핵심 코드 + 현재 홈페이지만 포함
```

**구체적 수치:**

- JavaScript 크기 감소: **12.5 MB → 850 KB (93% 감소)**
- 첫 화면 시간 단축: **10초 → 2초 (70% 향상)**
- 후속 페이지 로딩: **평균 300-500 KB per page**
- 사용자 경험 점수: **45점에서 92점으로 향상 (Lighthouse)**

**비즈니스 가치:**

- 이탈률 35% 감소
- 페이지 체류 시간 50% 증가
- 전환율 25% 향상

## 면접 포인트

**자주 묻는 확장 질문:**

1. **Q: React.lazy()나 Vue의 비동기 컴포넌트를 사용하지 않는 이유는?**
   A: Vue의 비동기 컴포넌트(`() => import()`)를 실제로 사용하고 있지만, 핵심은 **3단계 아키텍처**입니다:

   - 1단계(템플릿): 빌드 시 결정 (Vite 설정)
   - 2단계(페이지): 런타임 Lazy Loading
   - 3단계(권한): Navigation Guard 제어

   단순한 Lazy Loading은 2단계까지만 하지만, 우리는 템플릿 레벨의 분리까지 추가했습니다.

2. **Q: 어떤 코드를 main.js에 넣어야 할지 어떻게 결정하나요?**
   A: Vite의 `manualChunks` 설정을 사용합니다:

   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['vue', 'pinia', 'vue-router'],
           'ui': ['element-plus'],
         }
       }
     }
   }
   ```

   원칙: "모든 페이지에서 사용되는 것"만 vendor chunk에 넣습니다.

3. **Q: Lazy Loading이 사용자 경험(대기 시간)에 영향을 미치지 않나요?**
   A: 두 가지 전략으로 대응합니다:

   - **Prefetch**: 유휴 시간에 방문할 가능성 있는 페이지를 미리 로드
   - **Loading 상태**: Skeleton Screen으로 빈 화면 대체

   실제 테스트: 후속 페이지 평균 로딩 시간 < 500ms, 사용자가 인지하지 못함.

4. **Q: 최적화 효과를 어떻게 측정하나요?**
   A: 여러 도구를 사용합니다:

   - **Lighthouse**: Performance Score (45 → 92)
   - **Webpack Bundle Analyzer**: chunk 크기 시각화 분석
   - **Chrome DevTools**: Network waterfall, Coverage
   - **Real User Monitoring (RUM)**: 실제 사용자 데이터

5. **Q: Trade-off(절충)는 무엇인가요?**
   A:
   - 개발 시 순환 의존성 문제 발생 가능 (모듈 구조 조정 필요)
   - 최초 라우트 전환 시 잠깐 로딩 시간 발생 (prefetch로 해결)
   - 하지만 전체적으로 장점이 단점보다 크며, 특히 모바일 사용자 경험 향상이 뚜렷함
