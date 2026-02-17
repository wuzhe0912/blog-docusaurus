---
id: element-properties
title: '[Easy] \U0001F3F7️ 요소 속성'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. inline 요소와 block 요소는 무엇인가요? 차이점은 무엇인가요?

> 인라인(inline)과 블록(block) 요소는 무엇이며, 그 차이점은 무엇인가요?

### Block Elements

> 아래의 인라인 또는 블록 요소는 자주 사용하는 태그만 나열하며, 잘 사용하지 않는 태그는 필요할 때 검색합니다

블록 레벨 요소는 기본적으로 한 줄을 차지합니다. 따라서 여러 블록 요소가 있을 경우, CSS 레이아웃을 적용하지 않은 상태에서는 기본적으로 위에서 아래로 수직 배열됩니다. 블록 요소는 `<body></body>` 안에서만 작성할 수 있습니다.

#### 자주 사용하는 블록 요소 목록

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

인라인 요소는 전체 줄을 차지하지 않으므로, 여러 인라인 요소가 인접할 때 수평으로 배열됩니다. 블록 요소는 인라인 요소 안에 배치할 수 없으며, 인라인 요소는 데이터나 정보를 표시하는 데만 사용됩니다. 하지만 `CSS`를 통해 인라인 요소의 속성을 변경할 수 있습니다. 예를 들어 `span`에 `display: block;`을 추가할 수 있습니다.

#### 자주 사용하는 인라인 요소 목록

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

display에는 `inline-block`이라는 속성이 있으며, 블록 요소를 인라인 요소로 변환하되 블록 요소의 특성은 유지합니다. 예를 들어 너비, 높이, margin, padding 등의 속성을 설정할 수 있습니다. 이는 이 요소가 레이아웃에서 인라인 요소처럼 수평으로 배열되지만, block 속성을 사용하여 다른 요소를 밀어내는 레이아웃 효과를 낼 수 있음을 의미합니다.

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [CSS 튜토리얼 - display: inline, block, inline-block의 차이점](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. `* { box-sizing: border-box; }`는 무엇을 하나요?

