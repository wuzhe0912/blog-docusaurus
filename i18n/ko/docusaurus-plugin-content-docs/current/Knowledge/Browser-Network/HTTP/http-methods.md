---
id: http-methods
title: "\U0001F4C4 HTTP Methods"
slug: /http-methods
---

## 1. RESTful API란 무엇인가요?

RESTful API는 표준화된 디자인 스타일을 채택하여, 네트워크 상의 서로 다른 시스템 간 통신을 용이하게 합니다. REST 원칙을 따르기 위해 API는 예측 가능하고 이해하기 쉬워야 합니다. 프론트엔드 개발자로서 다음 세 가지에 주로 관심을 가집니다:

- **URL 경로(url path)**: 클라이언트 측 요청의 범위를 확인합니다. 예:
  - `/products`: 제품 목록을 반환할 수 있음
  - `/products/abc`: 제품 ID가 abc인 제품의 상세 정보를 제공
- **HTTP 메서드**: 구체적인 실행 방식을 정의합니다:
  - `GET`: 데이터 조회에 사용
  - `POST`: 새 데이터 생성에 사용
  - `PUT`: 기존 데이터 업데이트에 사용
  - `DELETE`: 데이터 삭제에 사용
- **상태 코드(status code)**: 요청의 성공 여부와 실패 시 문제의 원인을 빠르게 알려줍니다. 주요 상태 코드:
  - `200`: 성공
  - `404`: 요청한 리소스를 찾을 수 없음
  - `500`: 서버 오류

## 2. GET으로도 데이터를 전송할 수 있는데, 왜 POST를 사용해야 하나요?

> `GET`으로도 데이터를 포함한 요청을 보낼 수 있는데, 왜 `POST`를 사용해야 하나요?

주로 다음 네 가지 고려사항에 기반합니다:

1. 보안성: `GET`의 데이터는 URL에 첨부되어 민감한 데이터가 노출되기 쉬운 반면, `POST`는 데이터를 요청의 `body`에 넣어 상대적으로 더 안전합니다.
2. 데이터 크기 제한: `GET`은 브라우저와 서버의 URL 길이 제한(브라우저마다 약간 다르지만 대략 2048 bytes 전후)으로 인해 데이터 양이 제한됩니다. `POST`는 명목상 제한이 없지만, 실제로는 악의적인 대량 데이터 공격을 방지하기 위해 미들웨어 설정으로 데이터 크기를 제한합니다. 예를 들어 `express`의 `body-parser`.
3. 의미적 명확성: 개발자가 요청의 목적을 명확히 알 수 있도록 합니다. `GET`은 보통 데이터 조회에, `POST`는 데이터 생성 또는 업데이트에 더 적합합니다.
4. 불변성(Immutability): HTTP 프로토콜에서 `GET` 메서드는 "안전한" 것으로 설계되어, 몇 번의 요청을 보내든 서버의 데이터에 변동을 일으키지 않습니다.

## 3. HTTP에서 PUT 메서드의 역할은 무엇인가요?

> `PUT` 메서드의 용도는 무엇인가요?

주로 두 가지 용도입니다:

1. 이미 존재하는 데이터를 업데이트 (예: 사용자 정보 수정)
2. 데이터가 존재하지 않으면 새로 생성

### Example

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // api URL
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // PUT 요청 실행
    console.log('User updated:', response.data); // 업데이트된 사용자 정보 출력
  } catch (error) {
    console.log('Error updating user:', error); // 에러 정보 출력
  }
}

updateUser(1, 'Pitt Wu');
```
