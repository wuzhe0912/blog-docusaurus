---
id: css-units
title: '[Medium] \U0001F3F7️ CSS 단위'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. `px`, `em`, `rem`, `vw`, `vh`의 차이를 설명해주세요

### 빠른 비교표

| 단위  | 유형     | 기준                     | 부모 요소 영향 여부 | 주요 용도                          |
| ----- | -------- | ------------------------ | ------------------- | ---------------------------------- |
| `px`  | 절대 단위 | 화면 픽셀                | ❌                  | 테두리, 그림자, 세부 사항          |
| `em`  | 상대 단위 | **부모 요소**의 font-size | ✅                  | 패딩, 마진 (폰트 크기에 따라야 할 때) |
| `rem` | 상대 단위 | **루트 요소**의 font-size | ❌                  | 폰트, 간격, 범용 크기             |
| `vw`  | 상대 단위 | 뷰포트 너비의 1%         | ❌                  | 반응형 너비, 전체 너비 요소        |
| `vh`  | 상대 단위 | 뷰포트 높이의 1%         | ❌                  | 반응형 높이, 전체 화면 영역        |

### 상세 설명

#### `px` (Pixels)

**정의**: 절대 단위, 1px = 화면의 하나의 픽셀 포인트

**특성**:

- 고정 크기, 어떤 설정으로도 변경되지 않음
- 정밀한 제어가 가능하지만 유연성이 부족
- 반응형 디자인과 접근성 디자인에 불리

**사용 시기**:

```css
/* ✅ 적합한 사용처 */
border: 1px solid #000; /* 테두리 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 */
border-radius: 4px; /* 작은 둥근 모서리 */

/* ❌ 권장하지 않는 사용처 */
font-size: 16px; /* 폰트는 rem 사용 권장 */
width: 1200px; /* 너비는 % 또는 vw 사용 권장 */
```

#### `em`

**정의**: **부모 요소** font-size의 배수

**특성**:

- 누적 상속됨 (중첩 구조에서 겹겹이 쌓임)
- 유연성이 높지만 제어하기 어려울 수 있음
- 부모 요소에 따라 확대/축소해야 하는 시나리오에 적합

**계산 예시**:

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 1em; /* 24px × 1 = 24px (자신의 font-size 기준) */
}

.grandchild {
  font-size: 1.5em; /* 24px × 1.5 = 36px (누적 효과!) */
}
```

**사용 시기**:

```css
/* ✅ 적합한 사용처 */
.button {
  font-size: 1rem;
  padding: 0.5em 1em; /* 패딩이 버튼 폰트 크기를 따름 */
}

.card-title {
  font-size: 1.2em; /* 카드의 기본 폰트 크기 기준 */
  margin-bottom: 0.5em; /* 간격이 제목 크기를 따름 */
}

/* ⚠️ 중첩 누적에 주의 */
```

#### `rem` (Root em)

**정의**: **루트 요소**(`<html>`) font-size의 배수

**특성**:

- 누적 상속되지 않음 (항상 루트 요소 기준)
- 관리와 유지보수가 용이
- 전역 스케일링 구현이 편리
- 가장 추천하는 단위 중 하나

**계산 예시**:

```css
html {
  font-size: 16px; /* 브라우저 기본값 */
}

.element {
  font-size: 1.5rem; /* 16px × 1.5 = 24px */
  padding: 2rem; /* 16px × 2 = 32px */
  margin: 1rem 0; /* 16px × 1 = 16px */
}

.nested .element {
  font-size: 1.5rem; /* 여전히 24px, 누적되지 않음! */
}
```

**사용 시기**:

```css
/* ✅ 가장 추천하는 사용처 */
html {
  font-size: 16px; /* 기준 설정 */
}

body {
  font-size: 1rem; /* 본문 16px */
}

h1 {
  font-size: 2.5rem; /* 40px */
}

p {
  font-size: 1rem; /* 16px */
  margin-bottom: 1rem; /* 16px */
}

.container {
  padding: 2rem; /* 32px */
  max-width: 75rem; /* 1200px */
}

/* ✅ 다크 모드 또는 접근성 조정 구현이 편리 */
@media (prefers-reduced-motion: reduce) {
  html {
    font-size: 18px; /* 모든 rem 단위가 자동으로 확대 */
  }
}
```

#### `vw` (Viewport Width)

**정의**: 뷰포트 너비의 1% (100vw = 뷰포트 너비)

**특성**:

- 진정한 반응형 단위
- 브라우저 뷰포트 크기에 따라 실시간으로 변경
- 참고: 100vw는 스크롤바 너비를 포함

**계산 예시**:

```css
/* 뷰포트 너비 1920px 가정 */
.element {
  width: 50vw; /* 1920px × 50% = 960px */
  font-size: 5vw; /* 1920px × 5% = 96px */
}

/* 뷰포트 너비 375px (모바일) 가정 */
.element {
  width: 50vw; /* 375px × 50% = 187.5px */
  font-size: 5vw; /* 375px × 5% = 18.75px */
}
```

**사용 시기**:

```css
/* ✅ 적합한 사용처 */
.hero {
  width: 100vw; /* 전체 너비 배너 */
  margin-left: calc(-50vw + 50%); /* 컨테이너 제한 돌파 */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 5rem); /* 반응형 폰트 */
}

.responsive-box {
  width: 80vw;
  max-width: 1200px; /* 최대 너비 제한 추가 */
}

/* ❌ 피해야 할 사용 */
body {
  width: 100vw; /* 수평 스크롤바가 발생 (스크롤바 너비 포함) */
}
```

#### `vh` (Viewport Height)

**정의**: 뷰포트 높이의 1% (100vh = 뷰포트 높이)

**특성**:

- 전체 화면 효과 제작에 적합
- 모바일 기기에서 주소창 문제에 주의 필요
- 키보드 팝업의 영향을 받을 수 있음

**사용 시기**:

```css
/* ✅ 적합한 사용처 */
.hero-section {
  height: 100vh; /* 전체 화면 홈페이지 */
}

.fullscreen-modal {
  height: 100vh;
  width: 100vw;
}

.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
}

/* ⚠️ 모바일 기기 대안 */
.hero-section {
  height: 100vh;
  height: 100dvh; /* 동적 뷰포트 높이 (최신 단위) */
}

/* ✅ 수직 가운데 정렬 */
.center-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 실무 조언과 모범 사례

#### 1. 반응형 폰트 시스템 구축

```css
/* 기준 설정 */
html {
  font-size: 16px; /* 데스크톱 기본값 */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* 태블릿 */
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px; /* 모바일 */
  }
}

/* rem을 사용하는 모든 요소가 자동 스케일링 */
h1 {
  font-size: 2.5rem;
} /* 데스크톱 40px, 모바일 30px */
p {
  font-size: 1rem;
} /* 데스크톱 16px, 모바일 12px */
```

#### 2. 다양한 단위 혼합 사용

```css
.card {
  /* 반응형 너비 + 범위 제한 */
  width: 90vw;
  max-width: 75rem;

  /* rem으로 간격 */
  padding: 2rem;
  margin: 1rem auto;

  /* px로 세부 사항 */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  /* clamp로 여러 단위 결합, 부드러운 스케일링 구현 */
  font-size: clamp(1.25rem, 3vw, 2rem);
}
```

### 면접 답변 예시

**답변 구조**:

```markdown
1. **px**: 픽셀 세부 사항 → 테두리, 그림자, 작은 둥근 모서리
2. **rem**: 루트 기반으로 안정적 → 폰트, 간격, 주요 크기
3. **em**: 부모 요소를 따름
4. **vw**: 뷰포트 너비 변경 → 반응형 너비
5. **vh**: 뷰포트 높이 채움 → 전체 화면 영역
```

1. **빠른 정의**

   - px는 절대 단위, 나머지는 모두 상대 단위
   - em은 부모 요소 기준, rem은 루트 요소 기준
   - vw/vh는 뷰포트 크기 기준

2. **핵심 차이점**

   - rem은 누적되지 않고, em은 누적됨 (이것이 주요 차이점)
   - vw/vh는 진정한 반응형이지만, 스크롤바 문제에 주의 필요

3. **실무 적용**

   - **px**: 1px 테두리, 그림자 등 세부 사항
   - **rem**: 폰트, 간격, 컨테이너 (가장 많이 사용, 유지보수 용이)
   - **em**: 버튼 패딩 (폰트에 따라 스케일링이 필요할 때)
   - **vw/vh**: 전체 너비 배너, 전체 화면 영역, clamp와 함께 반응형 폰트

4. **모범 사례**
   - html font-size를 기준으로 설정
   - clamp()로 다양한 단위 결합
   - 모바일 기기의 vh 문제에 주의 (dvh 사용 가능)

### Reference

- [MDN - CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Units - A Complete Guide](https://www.freecodecamp.org/news/css-unit-guide/)
- [Modern CSS Solutions](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
