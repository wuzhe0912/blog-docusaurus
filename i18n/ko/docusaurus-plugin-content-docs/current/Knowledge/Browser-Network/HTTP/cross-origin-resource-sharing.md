---
id: cross-origin-resource-sharing
title: "\U0001F4C4 CORS"
slug: /cross-origin-resource-sharing
---

## 1. JSONP와 CORS의 차이점은 무엇인가요?

JSONP(JSON with Padding)와 CORS(교차 출처 리소스 공유)는 교차 출처 요청을 구현하는 두 가지 기술로, 웹 페이지가 다른 도메인(웹사이트)에서 데이터를 요청할 수 있게 해줍니다.

### JSONP

JSONP는 초기의 동일 출처 정책 제한을 해결하기 위해 사용된 비교적 오래된 기술로, 웹 페이지가 다른 출처(도메인, 프로토콜 또는 포트)에서 데이터를 요청할 수 있게 합니다. `<script>` 태그의 로딩은 동일 출처 정책의 제한을 받지 않기 때문에, JSONP는 동적으로 `<script>` 태그를 추가하고 JSON 데이터를 반환하는 URL을 지정하여 동작합니다. 해당 URL의 응답은 함수 호출로 감싸져 있으며, 웹 페이지의 JavaScript에서 이 함수를 미리 정의하여 데이터를 수신합니다.

```javascript
// client-side
function receiveData(jsonData) {
  console.log(jsonData);
}

let script = document.createElement('script');
script.src = 'http://example.com/data?callback=receiveData';
document.body.appendChild(script);
```

```javascript
// server-side
receiveData({ name: 'PittWu', type: 'player' });
```

단점은 보안 위험이 높고(임의의 JavaScript를 실행할 수 있기 때문) GET 요청만 지원한다는 것입니다.

### CORS

CORS는 JSONP보다 더 안전하고 현대적인 기술입니다. HTTP 헤더 `Access-Control-Allow-Origin`을 통해 브라우저에 해당 요청이 허용됨을 알려줍니다. 서버에서 관련 CORS 헤더 정보를 설정하여 어떤 출처가 리소스에 접근할 수 있는지 결정합니다.

만약 `http://client.com`의 프론트엔드가 `http://api.example.com`의 리소스에 접근하려면, `api.example.com`은 응답에 다음 HTTP header를 포함해야 합니다:

```http
Access-Control-Allow-Origin: http://client.com
```

또는 모든 출처를 허용하는 경우:

```http
Access-Control-Allow-Origin: *
```

CORS는 모든 유형의 HTTP 요청에 사용할 수 있으며, 교차 출처 요청을 수행하는 표준화되고 안전한 방법입니다.
