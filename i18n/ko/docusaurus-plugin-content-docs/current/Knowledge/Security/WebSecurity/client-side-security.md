---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. CSP(Content Security Policy)란 무엇인지 설명해 주세요.

> Can you explain what CSP (Content Security Policy) is?

기본적으로 CSP는 웹 페이지의 보안을 강화하는 메커니즘으로, HTTP header를 설정하여 웹 페이지 콘텐츠가 로드할 수 있는 데이터 소스(화이트리스트)를 제한함으로써, 악의적인 공격자가 악성 script를 주입하여 사용자 데이터를 탈취하는 것을 방지합니다.

프론트엔드 관점에서 XSS(Cross-site scripting) 공격을 방지하기 위해 현대 프레임워크를 사용하여 개발하는 경우가 많습니다. 이는 기본적인 보호 메커니즘을 제공하기 때문입니다. 예를 들어 React의 JSX는 HTML을 자동으로 이스케이프 처리하고, Vue는 `{{ data }}` 방식으로 데이터를 바인딩하며 동시에 HTML 태그를 자동 이스케이프합니다.

프론트엔드에서 할 수 있는 것이 많지는 않지만, 세부적인 최적화를 할 수 있습니다:

1. 콘텐츠 입력이 필요한 폼의 경우, 특수 문자를 검증하여 공격을 방지할 수 있습니다(모든 시나리오를 상정하기 어려우므로) 주로 길이 제한으로 클라이언트 측 입력 내용을 제어하거나, 입력 유형을 제한합니다.
2. 외부 링크를 참조할 때 http URL 대신 https URL을 사용합니다.
3. 정적 페이지 웹사이트의 경우, meta tag를 설정하여 제한할 수 있습니다:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: 기본적으로 동일 출처(같은 도메인)에서만 데이터 로드를 허용합니다.
- `img-src https://*`: HTTPS 프로토콜에서만 이미지 로드를 허용합니다.
- `child-src 'none'`: `<iframe>` 등 외부 자식 리소스의 삽입을 허용하지 않습니다.

## 2. XSS(Cross-site scripting) 공격이란 무엇인가요?

> What is XSS (Cross-site scripting) attack?

XSS, 즉 크로스 사이트 스크립팅 공격은 공격자가 악성 스크립트를 주입하여 사용자의 브라우저에서 실행되게 하고, 이를 통해 cookie 같은 민감한 데이터를 획득하거나 웹 페이지 내용을 직접 변경하여 사용자를 악성 사이트로 유도하는 것을 말합니다.

### 저장형 XSS 방지

공격자가 댓글을 통해 악성 HTML이나 script를 데이터베이스에 주입할 수 있습니다. 이때 백엔드의 이스케이프 처리 외에도, React의 JSX나 Vue의 template `{{ data }}` 같은 프론트엔드 현대 프레임워크도 이스케이프를 수행하여 XSS 공격 가능성을 낮춥니다.

### 반사형 XSS 방지

`innerHTML`로 DOM을 조작하는 것을 피해야 합니다. HTML 태그가 실행될 수 있기 때문입니다. 일반적으로 `textContent`를 사용하여 조작하는 것을 권장합니다.

### DOM-based XSS 방지

원칙적으로 사용자가 HTML을 직접 페이지에 삽입하지 못하게 해야 합니다. 시나리오상 필요한 경우, 프레임워크 자체에 유사한 기능이 있습니다. 예를 들어 React의 `dangerouslySetInnerHTML`, Vue의 `v-html`은 가능한 한 자동으로 XSS를 방지합니다. 네이티브 JS로 개발해야 하는 경우에도 `textContent`, `createElement`, `setAttribute`를 사용하여 DOM을 조작하는 것이 바람직합니다.
