---
id: css-box-model
title: '[Easy] \U0001F3F7️ Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## Default

`Box Model`은 `CSS`에서 레이아웃 설계를 논의할 때 사용하는 용어입니다. `HTML` 요소를 감싸는 박스로 이해할 수 있으며, 네 가지 주요 속성이 있습니다:

- content: 주로 요소의 내용을 표시하는 데 사용됩니다. 예를 들어 텍스트.
- padding: 요소의 내용과 요소 경계 사이의 간격
- margin: 요소와 외부 다른 요소 사이의 간격
- border: 요소 자체의 테두리 선

## box-sizing

`Box Model`의 유형을 결정하는 것은 `box-sizing` 속성을 통해 이루어집니다.

이는 요소의 너비와 높이를 계산할 때, `padding`과 `border` 두 속성이 안쪽으로 채울지 바깥쪽으로 확장할지를 의미합니다.

기본값은 `content-box`로 바깥쪽 확장을 채택합니다. 이 조건에서는 요소 자체의 너비와 높이 외에 추가적인 `padding`과 `border`도 계산에 포함해야 합니다. 아래와 같습니다:

```css
div {
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

이 `div`의 너비 계산은 `100px(width)` + `20px(좌우 padding)` + `2px(좌우 border)` = `122px`입니다.

## border-box

위의 방식은 분명히 신뢰할 수 없으며, 프론트엔드 개발 시 요소의 너비와 높이를 계속 계산해야 합니다. 개발 경험을 개선하기 위해 다른 모드인 `border-box`를 채택해야 합니다.

아래 예시처럼, 스타일 초기화 시 모든 요소의 `box-sizing` 값을 `border-box`로 설정합니다:

```css
* {
  box-sizing: border-box; // global style
}
```

이렇게 하면 안쪽 채움 형태로 변경되어, 요소의 너비와 높이 설계가 더 직관적이 되며, `padding`이나 `border`를 위해 수치를 더하거나 빼지 않아도 됩니다.

## 비교 예제

다음과 같은 동일한 스타일 설정이 있다고 가정합니다:

```css
.box {
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid #000;
  margin: 20px;
}
```

### content-box (기본값)

- **실제 차지 너비** = `100px(width)` + `20px(좌우 padding)` + `10px(좌우 border)` = `130px`
- **실제 차지 높이** = `100px(height)` + `20px(상하 padding)` + `10px(상하 border)` = `130px`
- **content 영역** = `100px x 100px`
- **참고**: `margin`은 요소 너비에 포함되지 않지만, 다른 요소와의 간격에 영향을 미칩니다

### border-box

- **실제 차지 너비** = `100px` (padding과 border가 안쪽으로 압축)
- **실제 차지 높이** = `100px`
- **content 영역** = `100px` - `20px(좌우 padding)` - `10px(좌우 border)` = `70px x 70px`
- **참고**: `margin`은 마찬가지로 요소 너비에 포함되지 않습니다

### 시각적 비교

```
content-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (100×100)       │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
총 너비: 130px (margin 제외)

border-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (70×70)         │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
총 너비: 100px (margin 제외)
```

## 자주 빠지는 함정

### 1. margin 처리

`content-box`이든 `border-box`이든, **margin은 요소의 너비와 높이에 포함되지 않습니다**. 두 모드는 `padding`과 `border`의 계산 방식에만 영향을 미칩니다.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 5px solid;
  margin: 20px; /* width에 포함되지 않음 */
}
/* 요소의 실제 차지 너비는 여전히 100px이지만, 다른 요소와의 거리는 20px 더 늘어남 */
```

### 2. 백분율 너비

백분율 너비를 사용할 때, 계산 방식도 `box-sizing`의 영향을 받습니다:

```css
.parent {
  width: 200px;
}

.child {
  width: 50%; /* 부모 요소의 50% 상속 = 100px */
  padding: 10px;
  border: 5px solid;
}

/* content-box: 실제 차지 130px (부모 요소를 초과할 수 있음) */
/* border-box: 실제 차지 100px (부모 요소의 정확히 50%) */
```

### 3. inline 요소

`box-sizing`은 `inline` 요소에 적용되지 않습니다. inline 요소의 `width`와 `height` 설정 자체가 무효하기 때문입니다.

```css
span {
  display: inline;
  width: 100px; /* 무효 */
  box-sizing: border-box; /* 역시 무효 */
}
```

### 4. min-width / max-width

`min-width`와 `max-width`도 `box-sizing`의 영향을 받습니다:

```css
.box {
  box-sizing: border-box;
  min-width: 100px; /* padding과 border 포함 */
  padding: 10px;
  border: 5px solid;
}
/* content 최소 너비 = 100 - 20 - 10 = 70px */
```

## Reference

- [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [學習 CSS 版面配置](https://zh-tw.learnlayout.com/box-sizing.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
