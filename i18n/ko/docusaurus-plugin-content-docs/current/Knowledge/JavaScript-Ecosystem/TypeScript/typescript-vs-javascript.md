---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> TypeScript란 무엇인가요?

TypeScript는 Microsoft가 개발한 오픈소스 프로그래밍 언어로, JavaScript의 **슈퍼셋(Superset)**입니다. 즉, 모든 유효한 JavaScript 코드는 유효한 TypeScript 코드입니다.

**핵심 특징**:

- JavaScript에 **정적 타입 시스템** 추가
- 컴파일 시 타입 검사 수행
- 컴파일 후 순수 JavaScript로 변환
- 더 나은 개발 경험과 도구 지원 제공

## 2. What are the differences between TypeScript and JavaScript?

> TypeScript와 JavaScript의 차이는 무엇인가요?

### 주요 차이

| 특성       | JavaScript             | TypeScript             |
| ---------- | ---------------------- | ---------------------- |
| 타입 시스템 | 동적 타입(런타임 검사) | 정적 타입(컴파일 시 검사) |
| 컴파일     | 불필요                 | JavaScript로 컴파일 필요 |
| 타입 어노테이션 | 미지원             | 타입 어노테이션 지원   |
| 오류 검출  | 런타임에 오류 발견     | 컴파일 시 오류 발견    |
| IDE 지원   | 기본 지원              | 강력한 자동 완성과 리팩토링 |
| 학습 곡선  | 낮음                   | 높음                   |

### 타입 시스템 차이

**JavaScript(동적 타입)**:

```javascript
let value = 10;
value = 'hello'; // 타입 변경 가능
function add(a, b) { return a + b; }
add(1, 2); // 3
add('1', '2'); // '12'(문자열 연결)
add(1, '2'); // '12'(타입 변환)
```

**TypeScript(정적 타입)**:

```typescript
let value: number = 10;
value = 'hello'; // ❌ 컴파일 오류

function add(a: number, b: number): number { return a + b; }
add(1, 2); // ✅ 3
add('1', '2'); // ❌ 컴파일 오류
```

### 컴파일 과정

```typescript
// TypeScript 소스 코드
let message: string = 'Hello World';
console.log(message);

// ↓ 컴파일 후 JavaScript로 변환
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> 왜 TypeScript를 사용하나요?

### 장점

1. **조기 오류 발견** - 컴파일 시 타입 오류 발견
2. **더 나은 IDE 지원** - 자동 완성과 리팩토링 기능
3. **코드 가독성** - 타입 어노테이션으로 함수 의도 명확화
4. **더 안전한 리팩토링** - 타입 변경 시 업데이트 필요한 곳 자동 감지

### 단점

1. **컴파일 단계 필요** - 개발 흐름 복잡도 증가
2. **학습 곡선** - 타입 시스템 학습 필요
3. **파일 크기** - 타입 정보가 소스 코드 크기 증가(컴파일 후에는 영향 없음)
4. **설정 복잡** - `tsconfig.json` 설정 필요

## 4. Common Interview Questions

> 자주 나오는 면접 질문

### 문제 1: 타입 검사 시점

JavaScript와 TypeScript에서의 동작 차이를 설명하세요.

<details>
<summary>클릭하여 답변 보기</summary>

- JavaScript는 **런타임**에 타입 변환을 수행하여 예상치 못한 결과가 발생할 수 있음
- TypeScript는 **컴파일 시**에 타입을 검사하여 사전에 오류를 발견

</details>

### 문제 2: 타입 추론

```typescript
let value1 = 10;
let value2 = 'hello';
value1 = 'world'; // ?
value2 = 20; // ?
```

<details>
<summary>클릭하여 답변 보기</summary>

TypeScript는 초기값에 따라 자동으로 타입을 추론합니다. 추론 후에는 타입을 변경할 수 없습니다(`any`나 `union` 타입으로 명시적으로 선언하지 않는 한). 두 경우 모두 컴파일 오류가 발생합니다.

</details>

### 문제 3: 런타임 동작

TypeScript 컴파일 후 JavaScript 코드와의 차이를 설명하세요.

<details>
<summary>클릭하여 답변 보기</summary>

- TypeScript의 **타입 어노테이션은 컴파일 후 완전히 사라짐**
- 컴파일 후 JavaScript는 순수 JavaScript와 완전히 동일
- TypeScript는 **개발 단계**에서만 타입 검사를 제공하며, 런타임 성능에는 영향 없음

</details>

### 문제 4: 타입 오류 vs 런타임 오류

<details>
<summary>클릭하여 답변 보기</summary>

- **TypeScript 컴파일 시 오류**: 개발 단계에서 발견, 컴파일 성공하지 않으면 실행 불가
- **JavaScript 런타임 오류**: 사용자 사용 시 발견, 프로그램 충돌 원인

TypeScript는 타입 검사를 통해 많은 런타임 오류를 사전에 방지할 수 있습니다.

</details>

## 5. Best Practices

> 모범 사례

### 권장 방법

```typescript
// 1. 함수 반환 타입 명시
function add(a: number, b: number): number { return a + b; }

// 2. interface로 복잡한 객체 구조 정의
interface User { name: string; age: number; email?: string; }

// 3. any 대신 unknown 우선 사용
function processValue(value: unknown): void {
  if (typeof value === 'string') { console.log(value.toUpperCase()); }
}

// 4. 타입 별칭으로 가독성 향상
type UserID = string;
```

### 피해야 할 방법

```typescript
// 1. any를 과도하게 사용하지 않기
// 2. 타입 오류를 @ts-ignore로 무시하지 않기
// 3. 타입 어노테이션과 추론 사용을 일관되게 유지
```

## 6. Interview Summary

> 면접 요약

### 빠른 참고

- JavaScript의 슈퍼셋, 정적 타입 시스템 추가
- 컴파일 시 타입 검사, 런타임은 JavaScript와 동일
- 더 나은 개발 경험과 오류 예방 제공

### 면접 답변 예시

**Q: TypeScript와 JavaScript의 주요 차이는 무엇인가요?**

> "TypeScript는 JavaScript의 슈퍼셋으로, 주요 차이는 정적 타입 시스템이 추가된 점입니다. JavaScript는 동적 타입 언어로 타입 검사가 런타임에 이루어지지만, TypeScript는 정적 타입 언어로 타입 검사가 컴파일 시에 이루어집니다. 이를 통해 개발 단계에서 타입 관련 오류를 발견할 수 있으며, 런타임까지 기다릴 필요가 없습니다. TypeScript는 컴파일 후 순수 JavaScript로 변환되므로, 런타임 동작은 JavaScript와 완전히 동일합니다."

**Q: 왜 TypeScript를 사용하나요?**

> "TypeScript의 주요 장점은: 1) 조기 오류 발견 - 컴파일 시 타입 오류 감지; 2) 더 나은 IDE 지원 - 자동 완성과 리팩토링 기능; 3) 코드 가독성 향상 - 타입 어노테이션으로 함수 의도 명확화; 4) 더 안전한 리팩토링 - 타입 변경 시 업데이트 필요 위치 자동 감지. 하지만 학습 곡선과 컴파일 단계의 추가 비용도 고려해야 합니다."

## Reference

- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
