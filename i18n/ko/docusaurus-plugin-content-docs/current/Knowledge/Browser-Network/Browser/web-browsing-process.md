---
id: web-browsing-process
title: "\U0001F4C4 웹 브라우징 과정"
slug: /web-browsing-process
---

## 1. 브라우저가 서버에서 HTML을 가져오고 화면에 렌더링하는 과정을 설명해주세요

> 브라우저가 서버에서 HTML을 어떻게 가져오고, 화면에 어떻게 렌더링하는지 설명해주세요

### 1. 요청 시작

- **URL 입력**: 사용자가 브라우저에 URL을 입력하거나 링크를 클릭하면, 브라우저는 해당 URL을 파싱하여 어느 서버에 요청을 보낼지 확인합니다.
- **DNS 조회**: 브라우저가 DNS 조회를 실행하여 해당 서버의 IP 주소를 찾습니다.
- **연결 수립**: 브라우저는 인터넷을 통해 HTTP 또는 HTTPS 프로토콜을 사용하여 서버의 IP 주소로 요청을 보냅니다. HTTPS 프로토콜인 경우 SSL/TLS 연결도 수행해야 합니다.

### 2. 서버 응답

- **요청 처리**: 서버가 요청을 수신하면, 요청 경로와 매개변수에 따라 데이터베이스에서 해당 데이터를 읽어옵니다.
- **Response 전송**: 이후 HTML 파일을 HTTP Response의 일부로 브라우저에 반환합니다. Response에는 상태 코드나 기타 매개변수(CORS, content-type 등)도 포함됩니다.

### 3. HTML 파싱

- **DOM Tree 구축**: 브라우저가 HTML 파일을 읽기 시작하며, HTML 파일의 태그와 속성에 따라 DOM으로 변환하고 메모리에 DOM Tree를 구축합니다.
- **하위 리소스 요청(requesting subresources)**: HTML 파일을 파싱하는 과정에서 CSS, JavaScript, 이미지 등의 외부 리소스를 발견하면, 브라우저는 서버에 추가 요청을 보내 해당 리소스를 가져옵니다.

### 4. 페이지 렌더링(Render Page)

- **CSSOM Tree 구축**: 브라우저가 CSS 파일을 파싱하여 CSSOM Tree를 구축합니다.
- **Render Tree**: 브라우저가 DOM Tree와 CSSOM Tree를 합쳐 Render Tree를 생성합니다. 이 트리에는 렌더링할 모든 노드와 해당 스타일이 포함됩니다.
- **Layout(레이아웃)**: 브라우저가 레이아웃(Layout 또는 Reflow)을 수행하여 각 노드의 위치와 크기를 계산합니다.
- **Paint(페인팅)**: 마지막으로 브라우저가 페인팅(painting) 단계를 거쳐 각 노드의 내용을 페이지에 그립니다.

### 5. JavaScript 상호작용

- **JavaScript 실행**: HTML에 JavaScript가 포함되어 있으면 브라우저가 이를 파싱하고 실행합니다. 이 과정에서 DOM을 변경하거나 스타일을 수정할 수 있습니다.

전체 과정은 점진적으로 진행됩니다. 이론적으로 사용자는 먼저 일부 웹 페이지 내용을 보고, 마지막에 전체 웹 페이지를 보게 됩니다. 이 과정에서 여러 번의 Reflow와 Repaint가 발생할 수 있으며, 특히 복잡한 스타일이나 인터랙션 효과가 있는 웹 페이지에서 두드러집니다. 이때 브라우저 자체의 최적화 외에도 개발자는 보통 사용자 경험을 더 부드럽게 만들기 위한 다양한 방법을 적용합니다.

## 2. Reflow와 Repaint를 설명해주세요

### Reflow(리플로우)

웹 페이지의 DOM에 변화가 생겨 브라우저가 요소의 위치를 다시 계산하여 올바른 위치에 배치해야 하는 것을 말합니다. 쉽게 말하면, Layout을 다시 생성하여 요소를 재배치하는 것입니다.

#### Reflow 발생 조건

Reflow는 두 가지 시나리오가 있습니다. 하나는 전체 페이지에 변화가 생기는 것이고, 다른 하나는 일부 컴포넌트 영역에 변화가 생기는 것입니다.

- 페이지 초기 진입 시가 가장 큰 영향을 미치는 Reflow입니다
- DOM 요소 추가 또는 삭제
- 요소의 크기 변경, 예를 들어 내용 추가나 글자 크기 변경 등
- 요소의 레이아웃 조정, 예를 들어 margin이나 padding을 통한 이동
- 브라우저 자체의 창 크기 변경
- 의사 클래스 트리거, 예를 들어 hover 효과

### Repaint(리페인트)

Layout의 변경 없이 순수하게 요소를 업데이트하거나 변경하는 것입니다. 요소 자체가 Layout에 포함되어 있으므로, Reflow가 발생하면 반드시 Repaint도 발생하지만, Repaint만 발생한다고 해서 반드시 Reflow가 발생하는 것은 아닙니다.

#### Repaint 발생 조건

- 요소의 색상이나 배경 변경, 예를 들어 color를 추가하거나 background 속성을 조정하는 것 등
- 요소의 그림자나 border를 변경하는 것도 Repaint에 해당

### Reflow 또는 Repaint 최적화 방법

- table 레이아웃을 사용하지 마세요. table 속성은 속성 변경으로 인해 레이아웃이 재배치되기 쉽습니다. 부득이하게 사용해야 할 경우, 매번 한 행만 렌더링하도록 다음 속성을 추가하여 전체 테이블 범위에 영향을 주지 않도록 하세요. 예: `table-layout: auto;` 또는 `table-layout: fixed;`
- DOM을 직접 조작하여 스타일을 하나씩 조정하지 말고, 변경이 필요한 스타일을 class로 정의한 후 JS를 통해 전환해야 합니다.
  - Vue 프레임워크를 예로 들면, class 바인딩 방식으로 스타일을 전환할 수 있으며, function으로 직접 스타일을 수정하는 것은 피해야 합니다.
- 자주 전환이 필요한 시나리오, 예를 들어 탭 전환의 경우, `v-if`보다 `v-show`를 우선적으로 사용해야 합니다. 전자는 CSS의 `display: none;` 속성만 사용하여 숨기지만, 후자는 생명주기를 트리거하여 요소를 재생성하거나 소멸시키므로 더 큰 성능 소비가 발생합니다.
- 부득이하게 Reflow를 트리거해야 하는 경우, `requestAnimationFrame`을 통해 최적화할 수 있습니다(이 API는 애니메이션을 위해 설계되어 브라우저의 프레임 속도와 동기화할 수 있기 때문입니다). 이렇게 하면 여러 번의 Reflow를 한 번으로 합치고 Repaint 횟수를 줄일 수 있습니다.
  - 예를 들어 특정 애니메이션이 페이지에서 목표를 향해 이동해야 할 때, `requestAnimationFrame`을 통해 매번의 이동을 계산할 수 있습니다.
  - 마찬가지로, CSS3의 일부 속성은 클라이언트 측 하드웨어 가속을 트리거하여 애니메이션 성능을 향상시킬 수 있습니다. 예: `transform` `opacity` `filters` `Will-change`
- 가능하다면 하위 레벨의 DOM 노드에서 스타일을 변경하여, 부모 요소의 스타일 변경으로 인해 모든 하위 요소가 영향을 받는 것을 방지하세요.
- 애니메이션을 실행해야 하는 경우, 절대 위치(`absolute`, `fixed`) 요소에서 사용하면 다른 요소에 대한 영향이 적으며, Repaint만 트리거하여 Reflow를 피할 수 있습니다.

### Example

```js
// bad
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// good
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Reference

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)

## 3. 브라우저가 서버에 OPTIONS 요청을 보내는 시점을 설명해주세요

> 브라우저가 언제 서버에 OPTIONS 요청을 보내는지 설명해주세요

대부분의 경우, CORS 시나리오에 적용됩니다. 실제 요청을 보내기 전에 preflight(사전 검사) 과정이 있으며, 브라우저가 먼저 OPTIONS 요청을 보내 서버가 이 교차 출처 요청을 허용하는지 확인합니다. 서버가 허용한다고 응답하면 브라우저가 실제 요청을 보내고, 허용하지 않으면 브라우저가 에러를 발생시킵니다.

또한, 요청의 method가 `GET`, `HEAD`, `POST`가 아닌 경우에도 OPTIONS 요청이 트리거됩니다.
