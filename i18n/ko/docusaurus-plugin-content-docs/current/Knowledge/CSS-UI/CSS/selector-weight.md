---
id: selector-weight
title: '[Easy] \U0001F3F7️ 선택자 우선순위'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. 선택자의 우선순위는 어떻게 계산하나요?

> 선택자의 우선순위(가중치)는 어떻게 계산하나요?

CSS 선택자의 우선순위 판단은 요소가 최종적으로 어떤 스타일을 적용할지 결정하기 위한 것입니다. 아래와 같이:

```html
<div id="app" class="wrapper">What color ?</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

이 예시에서는 최종적으로 파란색이 나타납니다. 여기서 ID와 class 두 가지 선택자를 적용했는데, ID의 우선순위가 class보다 크기 때문에 class의 스타일이 덮어씌워집니다.

### Weight Sequence

> inline style > ID > class > tag

HTML 코드에서 태그 내에 인라인 스타일이 작성되어 있다면, 기본적으로 그 우선순위가 가장 높아서 CSS 파일의 스타일을 덮어씌웁니다. 아래와 같이:

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

하지만 일반적인 개발에서는 이런 작성 방식을 사용하지 않습니다. 유지보수가 어렵고, 스타일 오염 문제가 발생하기 쉽기 때문입니다.

### 특수 케이스

인라인 스타일을 만났고 제거할 수 없는 경우, CSS 파일을 통해 덮어씌우고 싶다면 `!important`를 사용할 수 있습니다:

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

```css
#app {
  color: blue !important;
}
```

물론, 가능하다면 `!important`도 사용하지 않는 것이 좋습니다. 인라인 스타일에도 마찬가지로 `!important`를 추가할 수 있지만, 개인적으로는 그런 스타일 작성 방식은 고려하지 않습니다. 또한, 특수한 상황이 아닌 이상 ID 선택자도 사용하지 않으며, 기본적으로 class를 기반으로 전체 스타일시트를 구성합니다.

