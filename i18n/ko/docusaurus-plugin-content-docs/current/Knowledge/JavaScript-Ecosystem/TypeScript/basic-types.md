---
id: basic-types
title: '[Easy] 기본 타입과 타입 어노테이션'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> TypeScript의 기본 타입에는 어떤 것들이 있나요?

TypeScript는 변수, 함수 매개변수 및 반환값의 타입을 정의하기 위한 다양한 기본 타입을 제공합니다.

### 기본 타입

```typescript
// 1. number: 숫자(정수, 부동소수점)
let age: number = 30;
let price: number = 99.99;

// 2. string: 문자열
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean: 불리언
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null: 빈 값
let data: null = null;

// 5. undefined: 미정의
let value: undefined = undefined;

// 6. void: 반환값 없음(주로 함수에서 사용)
function logMessage(): void {
  console.log('Hello');
}

// 7. any: 임의의 타입(사용을 피해야 함)
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown: 알 수 없는 타입(any보다 안전)
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ 오류: 먼저 타입을 확인해야 함

// 9. never: 절대 발생하지 않는 값(절대 반환하지 않는 함수에 사용)
function throwError(): never {
  throw new Error('Error');
}

// 10. object: 객체(자주 사용하지 않음, interface 사용 권장)
let user: object = { name: 'John' };

// 11. array: 배열
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple: 튜플(고정 길이와 타입의 배열)
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> 타입 어노테이션 vs 타입 추론

### 타입 어노테이션(Type Annotations)

**정의**: 변수의 타입을 명시적으로 지정하는 것.

```typescript
// 타입을 명시적으로 지정
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// 함수 매개변수와 반환값
function add(a: number, b: number): number {
  return a + b;
}
```

### 타입 추론(Type Inference)

**정의**: TypeScript가 초기값에 따라 자동으로 타입을 추론하는 것.

```typescript
// TypeScript가 자동으로 number로 추론
let age = 30;        // age: number

// TypeScript가 자동으로 string으로 추론
let name = 'John';   // name: string

// TypeScript가 자동으로 boolean으로 추론
let isActive = true;  // isActive: boolean

// 함수 반환값도 자동으로 추론
function add(a: number, b: number) {
  return a + b;  // 반환값을 자동으로 number로 추론
}
```

### 타입 어노테이션을 사용해야 할 때

**타입을 명시적으로 지정해야 하는 경우**:

```typescript
// 1. 변수 선언 시 초기값이 없는 경우
let value: number;
value = 10;

// 2. 함수 매개변수(반드시 지정)
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. 함수 반환값(명시적 지정 권장)
function calculate(): number {
  return 42;
}

// 4. 복잡한 타입으로 추론이 정확하지 않을 수 있는 경우
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> 자주 나오는 면접 질문

### 문제 1: 타입 추론

다음 코드에서 각 변수의 타입을 설명하세요.

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**설명**:
- TypeScript는 초기값에 따라 자동으로 타입을 추론합니다
- 배열은 요소 타입의 배열로 추론됩니다
- 객체는 객체의 구조 타입으로 추론됩니다

</details>

### 문제 2: 타입 오류

다음 코드에서 타입 오류를 찾으세요.

```typescript
let age: number = 30;
age = 'thirty';

let name: string = 'John';
name = 42;

let isActive: boolean = true;
isActive = 'yes';

let numbers: number[] = [1, 2, 3];
numbers.push('4');
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
let age: number = 30;
age = 'thirty'; // ❌ Type 'string' is not assignable to type 'number'

let name: string = 'John';
name = 42; // ❌ Type 'number' is not assignable to type 'string'

let isActive: boolean = true;
isActive = 'yes'; // ❌ Type 'string' is not assignable to type 'boolean'

let numbers: number[] = [1, 2, 3];
numbers.push('4'); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

**올바른 작성법**:
```typescript
let age: number = 30;
age = 30; // ✅

let name: string = 'John';
name = 'Jane'; // ✅

let isActive: boolean = true;
isActive = false; // ✅

let numbers: number[] = [1, 2, 3];
numbers.push(4); // ✅
```

</details>

### 문제 3: any vs unknown

`any`와 `unknown`의 차이를 설명하고, 어떤 것을 사용해야 하는지 설명하세요.

```typescript
// 케이스 1: any 사용
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// 케이스 2: unknown 사용
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>클릭하여 답변 보기</summary>

**케이스 1: any 사용**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ 컴파일은 통과하지만, 런타임에 오류가 발생할 수 있음
}

processAny('hello');  // ✅ 정상 실행
processAny(42);       // ❌ 런타임 오류: value.toUpperCase is not a function
```

**케이스 2: unknown 사용**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ 컴파일 오류: Object is of type 'unknown'

  // 먼저 타입을 확인해야 함
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ 안전
  }
}
```

**차이 비교**:

| 특성 | any | unknown |
| --- | --- | --- |
| 타입 검사 | 완전히 비활성화 | 사용 전 확인 필요 |
| 안전성 | 안전하지 않음 | 안전 |
| 사용 권장 | 사용 회피 | 권장 |

**모범 사례**:
```typescript
// ✅ 권장: unknown을 사용하고 타입 검사를 수행
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ 회피: any 사용
function processValue(value: any): void {
  console.log(value.toUpperCase()); // 안전하지 않음
}
```

</details>

### 문제 4: 배열 타입

다음 배열 타입 선언의 차이를 설명하세요.

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
// 1. number[]: 숫자 배열(권장 작성법)
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ 오류

// 2. Array<number>: 제네릭 배열(number[]과 동일)
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ 오류

// 3. [number, string]: 튜플(Tuple) - 고정 길이와 타입
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ 오류: 길이가 2를 초과
arr3.push('test');   // ⚠️ TypeScript는 허용하지만 권장하지 않음

// 4. any[]: 임의 타입 배열(비권장)
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅(하지만 타입 검사를 잃음)
```

**사용 권장 사항**:
- 일반 배열: `number[]` 또는 `Array<number>` 사용
- 고정 구조: 튜플 `[type1, type2]` 사용
- `any[]` 사용을 피하고, 구체적인 타입이나 `unknown[]` 우선 사용

</details>

### 문제 5: void vs never

`void`와 `never`의 차이와 사용 시나리오를 설명하세요.

```typescript
// 케이스 1: void
function logMessage(): void {
  console.log('Hello');
}

// 케이스 2: never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // 무한 루프
  }
}
```

<details>
<summary>클릭하여 답변 보기</summary>

**void**:
- **용도**: 함수가 값을 반환하지 않음을 나타냄
- **특징**: 함수가 정상적으로 종료되지만 값을 반환하지 않음
- **사용 시나리오**: 이벤트 핸들러, 부수 효과 함수

```typescript
function logMessage(): void {
  console.log('Hello');
  // 함수가 정상적으로 종료되고 값을 반환하지 않음
}

function onClick(): void {
  // 클릭 이벤트 처리, 반환값 불필요
}
```

**never**:
- **용도**: 함수가 절대 정상적으로 종료되지 않음을 나타냄
- **특징**: 함수가 오류를 던지거나 무한 루프에 진입
- **사용 시나리오**: 오류 처리, 무한 루프, 타입 가드

```typescript
function throwError(): never {
  throw new Error('Error');
  // 여기에 도달하지 않음
}

function infiniteLoop(): never {
  while (true) {
    // 절대 종료되지 않음
  }
}

// 타입 가드에서 사용
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**차이 비교**:

| 특성 | void | never |
| --- | --- | --- |
| 함수 종료 | 정상 종료 | 절대 종료되지 않음 |
| 반환값 | undefined | 반환값 없음 |
| 사용 시나리오 | 반환값 없는 함수 | 오류 처리, 무한 루프 |

</details>

## 4. Best Practices

> 모범 사례

### 권장 방법

```typescript
// 1. 타입 추론 우선 사용
let age = 30;  // ✅ TypeScript에게 추론을 맡김
let name = 'John';  // ✅

// 2. 함수 매개변수와 반환값은 타입을 명시적으로 지정
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. any 대신 unknown 사용
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. 구체적인 배열 타입 사용
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. 튜플로 고정 구조 표현
let person: [string, number] = ['John', 30];  // ✅
```

### 피해야 할 방법

```typescript
// 1. any 사용을 피함
let value: any = 'hello';  // ❌

// 2. 불필요한 타입 어노테이션을 피함
let age: number = 30;  // ⚠️ let age = 30;으로 간소화 가능

// 3. object 타입 사용을 피함
let user: object = { name: 'John' };  // ❌ interface 사용이 더 나음

// 4. 혼합 타입 배열을 피함(필요하지 않은 경우)
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ 정말 필요한지 고려
```

## 5. Interview Summary

> 면접 요약

### 빠른 참고

**기본 타입**:
- `number`, `string`, `boolean`, `null`, `undefined`
- `void`(반환값 없음), `never`(절대 반환하지 않음)
- `any`(임의의 타입, 사용 회피), `unknown`(알 수 없는 타입, 사용 권장)

**타입 어노테이션 vs 추론**:
- 타입 어노테이션: 명시적으로 지정 `let age: number = 30`
- 타입 추론: 자동 추론 `let age = 30`

**배열 타입**:
- `number[]` 또는 `Array<number>`: 일반 배열
- `[number, string]`: 튜플(고정 구조)

### 면접 답변 예시

**Q: TypeScript에는 어떤 기본 타입이 있나요?**

> "TypeScript는 number, string, boolean, null, undefined를 포함한 다양한 기본 타입을 제공합니다. 또한 몇 가지 특수 타입이 있습니다: void는 반환값이 없음을 나타내며 주로 함수에서 사용됩니다. never는 절대 발생하지 않는 값을 나타내며 절대 반환하지 않는 함수에 사용됩니다. any는 임의의 타입이지만 사용을 피해야 합니다. unknown은 알 수 없는 타입으로 any보다 안전하며 사용 전에 타입 확인이 필요합니다. 또한 배열 타입 number[]과 튜플 타입 [number, string]도 있습니다."

**Q: any와 unknown의 차이는 무엇인가요?**

> "any는 타입 검사를 완전히 비활성화하여 어떤 속성이나 메서드든 직접 사용할 수 있지만, 이는 안전하지 않습니다. unknown은 사용 전에 타입 검사를 수행해야 하므로 더 안전합니다. 예를 들어 unknown을 사용할 때는 먼저 typeof로 타입을 확인한 후에야 해당 메서드를 호출할 수 있습니다. any보다 unknown 사용을 우선적으로 권장합니다."

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
