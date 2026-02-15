---
id: css-pseudo-elements
title: '[Easy] \U0001F3F7️ 의사 요소 (Pseudo-elements)'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## 의사 요소란 무엇인가

의사 요소(Pseudo-elements)는 CSS의 키워드로, 요소의 특정 부분을 선택하거나 요소 앞뒤에 내용을 삽입하는 데 사용됩니다. **이중 콜론** `::` 구문(CSS3 표준)을 사용하며, 의사 클래스(pseudo-classes)의 단일 콜론 `:` 구문과 구분됩니다.

## 자주 사용되는 의사 요소

### 1. ::before와 ::after

가장 많이 사용되는 의사 요소로, 요소 내용의 앞이나 뒤에 내용을 삽입하는 데 사용됩니다.

```css
.icon::before {
  content: '\U0001F4CC';
  margin-right: 8px;
}

.external-link::after {
  content: ' ↗';
  font-size: 0.8em;
}
```

**특징**:

- 반드시 `content` 속성을 포함해야 합니다 (빈 문자열이라도)
- 기본적으로 `inline` 요소입니다
- DOM에 나타나지 않으며, JavaScript로 선택할 수 없습니다

### 2. ::first-letter

요소의 첫 글자를 선택하며, 잡지 스타일의 첫 글자 확대 효과에 자주 사용됩니다.

```css
.article::first-letter {
  font-size: 3em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
}
```

### 3. ::first-line

요소의 첫 번째 줄 텍스트를 선택합니다.

```css
.intro::first-line {
  font-weight: bold;
  color: #333;
}
```

**참고**: `::first-line`은 블록 레벨 요소에만 사용할 수 있습니다.

### 4. ::selection

사용자가 텍스트를 선택할 때의 스타일을 커스터마이징합니다.

```css
::selection {
  background-color: #ffeb3b;
  color: #000;
}

/* Firefox는 접두사가 필요 */
::-moz-selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### 5. ::placeholder

폼 placeholder의 스타일을 커스터마이징합니다.

```css
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### 6. ::marker

목록 마커(list marker)의 스타일을 커스터마이징합니다.

```css
li::marker {
  content: '✓ ';
  color: green;
  font-size: 1.2em;
}
```

### 7. ::backdrop

전체 화면 요소(`<dialog>` 또는 전체 화면 영상 등)의 배경 오버레이에 사용됩니다.

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}
```

## 실제 활용 시나리오

### 1. 장식용 아이콘과 아이콘

추가 HTML 요소 없이 순수 CSS로 구현:

```css
.success::before {
  content: '✓';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: green;
  color: white;
  border-radius: 50%;
  text-align: center;
  margin-right: 8px;
}
```

**사용 시기**: HTML에 순수 장식용 요소를 추가하고 싶지 않을 때.

### 2. 플로트 해제 (Clearfix)

클래식한 플로트 해제 기법:

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

**사용 시기**: 부모 요소 안에 플로트된 자식 요소가 있어 부모 요소의 높이를 펼쳐야 할 때.

### 3. 인용 부호 장식

인용 텍스트에 자동으로 인용 부호를 추가:

```css
blockquote::before {
  content: open-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote::after {
  content: close-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote {
  quotes: '"' '"' '' ' ' '';
}
```

**사용 시기**: 인용 블록을 꾸미며 수동으로 인용 부호를 입력하고 싶지 않을 때.

### 4. 순수 CSS 도형

의사 요소를 활용한 기하학적 도형 생성:

```css
.arrow {
  position: relative;
  width: 100px;
  height: 40px;
  background: #3498db;
}

.arrow::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  width: 0;
  height: 0;
  border-left: 20px solid #3498db;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
}
```

**사용 시기**: 화살표, 삼각형 등 간단한 도형을 만들 때, 이미지나 SVG가 필요 없음.

### 5. 필수 필드 표시

필수 입력 폼 필드에 빨간 별표 추가:

```css
.required::after {
  content: ' *';
  color: red;
  font-weight: bold;
}
```

**사용 시기**: 필수 필드를 표시하며 HTML의 시맨틱을 깔끔하게 유지.

### 6. 외부 링크 표시

외부 링크에 자동으로 아이콘 추가:

```css
a[href^='http']::after {
  content: ' 🔗';
  font-size: 0.8em;
  opacity: 0.6;
}

/* 또는 icon font 사용 */
a[target='_blank']::after {
  content: '\f08e'; /* Font Awesome 외부 링크 아이콘 */
  font-family: 'FontAwesome';
  margin-left: 4px;
}
```

**사용 시기**: 사용자 경험을 향상시켜 새 탭이 열릴 것임을 사용자에게 알릴 때.

### 7. 카운터 번호 매기기

CSS 카운터를 사용한 자동 번호 매기기:

```css
.faq-list {
  counter-reset: faq-counter;
}

.faq-item::before {
  counter-increment: faq-counter;
  content: 'Q' counter(faq-counter) '. ';
  font-weight: bold;
  color: #3498db;
}
```

**사용 시기**: 자동으로 번호를 생성하며 수동으로 관리할 필요 없음.

### 8. 오버레이 효과

이미지에 hover 오버레이 추가:

```css
.image-card {
  position: relative;
}

.image-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s;
}

.image-card:hover::after {
  background: rgba(0, 0, 0, 0.5);
}
```

**사용 시기**: 오버레이 효과를 구현하기 위해 추가 HTML 요소를 넣고 싶지 않을 때.

## 의사 요소 vs 의사 클래스

| 특성     | 의사 요소 (::)                          | 의사 클래스 (:)                       |
| -------- | --------------------------------------- | ------------------------------------- |
| **구문** | 이중 콜론 `::before`                     | 단일 콜론 `:hover`                    |
| **기능** | 요소의 특정 부분을 생성/선택             | 요소의 특정 상태를 선택               |
| **예시** | `::before`, `::after`, `::first-letter` | `:hover`, `:active`, `:nth-child()`   |
| **DOM**  | DOM에 존재하지 않음                      | 실제 DOM 요소를 선택                  |

## 자주 빠지는 함정

### 1. content 속성은 반드시 존재해야 함

`::before`와 `::after`는 반드시 `content` 속성이 있어야 하며, 없으면 표시되지 않습니다:

```css
/* ❌ 표시되지 않음 */
.box::before {
  width: 20px;
  height: 20px;
  background: red;
}

/* ✅ 올바른 방법 */
.box::before {
  content: ''; /* 빈 문자열이라도 추가해야 함 */
  display: block;
  width: 20px;
  height: 20px;
  background: red;
}
```

### 2. 대체 요소에는 사용 불가

일부 요소(`<img>`, `<input>`, `<iframe>` 등)에는 `::before`와 `::after`를 사용할 수 없습니다:

```css
/* ❌ 무효 */
img::before {
  content: 'Photo:';
}

/* ✅ 래핑 요소를 사용 */
.image-wrapper::before {
  content: 'Photo:';
}
```

### 3. 기본값이 inline 요소

`::before`와 `::after`는 기본적으로 `inline` 요소이므로, 너비와 높이를 설정할 때 주의해야 합니다:

```css
.box::before {
  content: '';
  display: block; /* 또는 inline-block */
  width: 100px;
  height: 100px;
}
```

### 4. z-index 레이어 문제

의사 요소의 `z-index`는 부모 요소에 상대적입니다:

```css
.parent {
  position: relative;
}

.parent::before {
  content: '';
  position: absolute;
  z-index: -1; /* 부모 요소 아래에 위치하지만, 부모 요소의 배경 위에 위치 */
}
```

### 5. 단일 콜론의 하위 호환성

CSS3 규격은 이중 콜론 `::`을 사용하여 의사 요소와 의사 클래스를 구분하지만, 단일 콜론 `:`도 여전히 작동합니다(CSS2 하위 호환):

```css
/* CSS3 표준 표기법 (권장) */
.box::before {
}

/* CSS2 표기법 (여전히 작동) */
.box:before {
}
```

## 면접 핵심 포인트

1. **의사 요소의 이중 콜론 구문**: 의사 요소 `::`와 의사 클래스 `:`를 구분
2. **content 속성은 반드시 존재해야 함**: `::before`와 `::after`의 핵심
3. **DOM에 존재하지 않음**: JavaScript로 직접 선택하거나 조작할 수 없음
4. **대체 요소에는 사용 불가**: `<img>`, `<input>` 등의 요소에 무효
5. **실제 활용 시나리오**: 장식용 아이콘, 플로트 해제, 도형 그리기 등

## Reference

- [Pseudo-elements - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Pseudo-elements - W3Schools](https://www.w3schools.com/css/css_pseudo_elements.asp)
- [A Whole Bunch of Amazing Stuff Pseudo Elements Can Do](https://css-tricks.com/pseudo-element-roundup/)
