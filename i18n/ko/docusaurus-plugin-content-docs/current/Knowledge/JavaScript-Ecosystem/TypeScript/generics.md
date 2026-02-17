---
id: generics
title: '[Medium] 제네릭(Generics)'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> 제네릭이란 무엇인가요?

제네릭(Generics)은 TypeScript의 강력한 기능으로, 단일 타입이 아닌 여러 타입을 처리할 수 있는 재사용 가능한 컴포넌트를 만들 수 있게 합니다.

**핵심 개념**: 함수, 인터페이스 또는 클래스를 정의할 때 구체적인 타입을 미리 지정하지 않고, 사용할 때 타입을 지정합니다.

### 왜 제네릭이 필요한가요?

**제네릭이 없는 경우의 문제**:

```typescript
// 문제: 각 타입마다 함수를 작성해야 함
function getStringItem(arr: string[]): string {
  return arr[0];
}

function getNumberItem(arr: number[]): number {
  return arr[0];
}

function getBooleanItem(arr: boolean[]): boolean {
  return arr[0];
}
```

**제네릭을 사용한 해결책**:

```typescript
// 하나의 함수로 모든 타입 처리
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> 기본 제네릭 구문

### 제네릭 함수

```typescript
// 구문: <T>는 타입 매개변수를 나타냄
function identity<T>(arg: T): T {
  return arg;
}

// 사용 방법 1: 타입을 명시적으로 지정
let output1 = identity<string>('hello');  // output1: string

// 사용 방법 2: TypeScript가 타입을 추론하도록 함
let output2 = identity('hello');  // output2: string(자동 추론)
```

### 제네릭 인터페이스

```typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = {
  value: 'hello',
};

const numberBox: Box<number> = {
  value: 42,
};
```

### 제네릭 클래스

```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

const stringContainer = new Container<string>();
stringContainer.add('hello');
stringContainer.add('world');

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
```

## 3. Generic Constraints

> 제네릭 제약 조건

### 기본 제약 조건

**구문**: `extends` 키워드를 사용하여 제네릭 타입을 제한합니다.

```typescript
// T는 length 속성을 가져야 함
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ 오류: number에는 length 속성이 없음
```

### keyof를 사용한 제약 조건

```typescript
// K는 T의 키여야 함
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

getProperty(user, 'name');  // ✅ 'John'
getProperty(user, 'age');   // ✅ 30
getProperty(user, 'id');    // ❌ 오류: 'id'는 user의 키가 아님
```

### 다중 제약 조건

```typescript
// T는 여러 조건을 동시에 만족해야 함
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ 오류: boolean은 제약 조건 범위 밖
```

## 4. Common Interview Questions

> 자주 나오는 면접 질문

### 문제 1: 제네릭 함수 구현

배열의 첫 번째 요소를 반환하는 제네릭 함수 `first`를 구현하세요.

```typescript
function first<T>(arr: T[]): T | undefined {
  // 구현
}
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// 사용 예시
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**설명**:
- `<T>`는 제네릭 타입 매개변수를 정의
- `arr: T[]`는 타입 T의 배열을 나타냄
- 반환값 `T | undefined`는 T 타입 또는 undefined일 수 있음을 나타냄

</details>

### 문제 2: 제네릭 제약 조건

두 객체를 병합하되, 첫 번째 객체에 존재하는 속성만 병합하는 함수를 구현하세요.

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // 구현
}
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// 사용 예시
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**고급 버전(첫 번째 객체의 속성만 병합)**:

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // obj1의 속성만 포함할 수 있음

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### 문제 3: 제네릭 인터페이스

데이터 접근 작업을 위한 제네릭 인터페이스 `Repository`를 정의하세요.

```typescript
interface Repository<T> {
  // 정의
}
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// 구현 예시
class UserRepository implements Repository<User> {
  private users: User[] = [];

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findAll(): User[] {
    return this.users;
  }

  save(entity: User): void {
    const index = this.users.findIndex(user => user.id === entity.id);
    if (index >= 0) {
      this.users[index] = entity;
    } else {
      this.users.push(entity);
    }
  }

  delete(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
```

</details>

### 문제 4: 제네릭 제약 조건과 keyof

키 이름을 기반으로 객체의 속성 값을 가져오는 함수를 구현하고, 타입 안전성을 보장하세요.

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // 구현
}
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 사용 예시
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ 오류: 'id'는 user의 키가 아님
```

**설명**:
- `K extends keyof T`는 K가 T의 키 중 하나임을 보장
- `T[K]`는 T 객체에서 K 키에 해당하는 값의 타입을 나타냄
- 이를 통해 타입 안전성이 보장되며, 컴파일 시점에서 오류를 발견할 수 있음

</details>

### 문제 5: 조건부 타입과 제네릭

다음 코드의 타입 추론 결과를 설명하세요.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**설명**:
- `NonNullable<T>`은 조건부 타입(Conditional Type)
- T가 `null | undefined`에 할당 가능하면 `never`를 반환하고, 아니면 `T`를 반환
- `string | null`에서 `string`은 조건에 해당하지 않고 `null`은 해당하므로, 결과는 `string`
- `string | number`에서 둘 다 조건에 해당하지 않으므로, 결과는 `string | number`

**실제 적용**:
```typescript
function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined');
  }
  return value as NonNullable<T>;
}

const result = processValue<string | null>('hello');  // string
```

</details>

## 5. Advanced Generic Patterns

> 고급 제네릭 패턴

### 기본 타입 매개변수

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // 기본 타입 string 사용
const container2: Container<number> = { value: 42 };
```

### 다중 타입 매개변수

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### 제네릭 유틸리티 타입

```typescript
// Partial: 모든 속성을 선택적으로 만듦
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required: 모든 속성을 필수로 만듦
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick: 특정 속성을 선택
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit: 특정 속성을 제외
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> 모범 사례

### 권장 방법

```typescript
// 1. 의미 있는 제네릭 이름 사용
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. 제약 조건으로 제네릭 범위 제한
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. 기본 타입 매개변수 제공
interface Config<T = string> {
  value: T;
}

// 4. 제네릭 유틸리티 타입 사용
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### 피해야 할 방법

```typescript
// 1. 제네릭을 과도하게 사용하지 않기
function process<T>(value: T): T {  // ⚠️ 하나의 타입만 있다면 제네릭 불필요
  return value;
}

// 2. 단일 문자 제네릭 이름 사용하지 않기(단순한 경우 제외)
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ 의미가 불명확
  // ...
}

// 3. 제약 조건 무시하지 않기
function process<T>(value: T) {  // ⚠️ 제한이 있다면 제약 조건을 추가해야 함
  return value.length;  // 오류 가능
}
```

## 7. Interview Summary

> 면접 요약

### 빠른 참고

**제네릭 핵심 개념**:
- 정의 시 구체적인 타입을 지정하지 않고, 사용 시 지정
- 구문: `<T>`로 타입 매개변수 정의
- 함수, 인터페이스, 클래스에 적용 가능

**제네릭 제약 조건**:
- `extends`를 사용하여 제네릭 범위 제한
- `K extends keyof T`로 K가 T의 키임을 보장
- 여러 제약 조건 조합 가능

**일반적인 패턴**:
- 제네릭 함수: `function identity<T>(arg: T): T`
- 제네릭 인터페이스: `interface Box<T> { value: T; }`
- 제네릭 클래스: `class Container<T> { ... }`

### 면접 답변 예시

**Q: 제네릭이란 무엇인가요? 왜 필요한가요?**

> "제네릭은 TypeScript에서 재사용 가능한 컴포넌트를 만드는 메커니즘으로, 정의 시 구체적인 타입을 지정하지 않고 사용 시 지정할 수 있습니다. 제네릭의 주요 장점은: 1) 코드 재사용성 향상 - 하나의 함수로 여러 타입 처리 가능; 2) 타입 안전성 유지 - 컴파일 시 타입 오류 검사 가능; 3) 중복 코드 감소 - 각 타입마다 함수를 작성할 필요 없음. 예를 들어 `function identity<T>(arg: T): T`는 어떤 타입이든 처리할 수 있으며, string, number 등 각각에 대해 함수를 작성할 필요가 없습니다."

**Q: 제네릭 제약 조건이란 무엇인가요? 어떻게 사용하나요?**

> "제네릭 제약 조건은 `extends` 키워드를 사용하여 제네릭 타입의 범위를 제한합니다. 예를 들어 `function getLength<T extends { length: number }>(arg: T)`는 T가 length 속성을 가져야 함을 보장합니다. 또 다른 일반적인 제약 조건은 `K extends keyof T`로, K가 T의 키 중 하나임을 보장하여 타입 안전한 속성 접근을 구현합니다. 제약 조건은 제네릭 사용 시 타입 안전성을 유지하면서 필요한 타입 정보를 제공하는 데 도움이 됩니다."

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
