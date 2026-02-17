---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## 개요

HTML에서 JavaScript 파일을 로드하는 주요 방법은 세 가지가 있습니다:

1. `<script>`
2. `<script async>`
3. `<script defer>`

이 세 가지 방법은 스크립트를 로드하고 실행할 때 서로 다른 동작을 합니다.

## 상세 비교

### `<script>`

- **동작**: 브라우저가 이 태그를 만나면 HTML 파싱을 중단하고, 스크립트를 다운로드하여 실행한 후 HTML 파싱을 재개합니다.
- **사용 시점**: 페이지 렌더링에 필수적인 스크립트에 적합합니다.
- **장점**: 스크립트가 순서대로 실행되는 것을 보장합니다.
- **단점**: 페이지 렌더링이 지연될 수 있습니다.

```html
<script src="important.js"></script>
```

### `<script async>`

- **동작**: 브라우저가 백그라운드에서 스크립트를 다운로드하면서 HTML 파싱을 계속합니다. 스크립트 다운로드가 완료되면 즉시 실행되며, HTML 파싱이 중단될 수 있습니다.
- **사용 시점**: 분석 또는 광고 스크립트와 같은 독립적인 스크립트에 적합합니다.
- **장점**: HTML 파싱을 차단하지 않으며, 페이지 로딩 속도를 향상시킬 수 있습니다.
- **단점**: 실행 순서가 보장되지 않으며, DOM이 완전히 로드되기 전에 실행될 수 있습니다.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **동작**: 브라우저가 백그라운드에서 스크립트를 다운로드하지만, HTML 파싱이 완료된 후에 실행합니다. 여러 defer 스크립트는 HTML에서의 순서대로 실행됩니다.
- **사용 시점**: 완전한 DOM 구조가 필요하지만 즉시 필요하지는 않은 스크립트에 적합합니다.
- **장점**: HTML 파싱을 차단하지 않고, 실행 순서를 보장하며, DOM에 의존하는 스크립트에 적합합니다.
- **단점**: 스크립트가 중요한 경우 페이지의 인터랙션 가능 시간이 지연될 수 있습니다.

```html
<script defer src="ui-enhancements.js"></script>
```

## 사례

데이트를 준비하고 있다고 상상해 보세요:

1. **`<script>`**:
   모든 준비를 멈추고 상대방에게 전화해서 데이트 세부 사항을 확인하는 것과 같습니다. 소통은 확실하지만 준비 시간이 지연될 수 있습니다.

2. **`<script async>`**:
   블루투스 이어폰으로 상대방과 통화하면서 준비하는 것과 같습니다. 효율은 올라가지만, 통화에 너무 집중하다 옷을 잘못 입을 수 있습니다.

3. **`<script defer>`**:
   상대방에게 메시지를 보내 준비가 끝나면 다시 전화하겠다고 알리는 것과 같습니다. 이렇게 하면 준비에 집중할 수 있고, 모든 것이 준비된 후에 제대로 소통할 수 있습니다.

## 현재 사용 현황

모던 프레임워크 개발 환경에서는 일반적으로 `<script>`를 수동으로 설정할 필요가 없습니다. 예를 들어, Vite는 기본적으로 module, 즉 defer 동작을 채택합니다.

```javascript
<script type="module" src="/src/main.js"></script>
```

Google Analytics 등 특수한 서드파티 스크립트의 경우는 예외입니다.

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
