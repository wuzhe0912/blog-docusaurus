---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## 문제 설명

`clamp` 함수를 구현하여 숫자를 지정된 범위 내로 제한합니다.

## 요구 사항

- `clamp`는 세 개의 매개변수를 받습니다: `number`(숫자), `lower`(하한), `upper`(상한).
- `number`가 `lower`보다 작으면 `lower`를 반환합니다.
- `number`가 `upper`보다 크면 `upper`를 반환합니다.
- 그 외에는 `number`를 반환합니다.

## I. 브루트포스 해법, `if` 조건문 사용

```javascript
function clamp(number, lower, upper) {
  if (number < lower) {
    return lower;
  } else if (number > upper) {
    return upper;
  } else {
    return number;
  }
}
```

## II. `Math.min`과 `Math.max` 함수 사용

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
