---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> Interface와 Type Alias란 무엇인가요?

### Interface(인터페이스)

**정의**: 객체의 구조를 정의하며, 객체가 가져야 할 속성과 메서드를 기술합니다.

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // 선택적 속성
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias(타입 별칭)

**정의**: 타입에 별칭을 만들어, 객체에 한정되지 않고 모든 타입에 사용할 수 있습니다.

```typescript
type User = {
  name: string;
  age: number;
  email?: string;
};

const user: User = {
  name: 'John',
  age: 30,
};
```

## 2. Interface vs Type Alias: Key Differences

> Interface와 Type Alias의 주요 차이점

### 1. 확장 방식

**Interface: extends 사용**

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: 'Buddy',
  breed: 'Golden Retriever',
};
```

**Type Alias: 교차 타입(Intersection) 사용**

```typescript
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

const dog: Dog = {
  name: 'Buddy',
  breed: 'Golden Retriever',
};
```

### 2. 병합(Declaration Merging)

**Interface: 병합 지원**

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 자동으로 { name: string; age: number; }로 병합됨
const user: User = {
  name: 'John',
  age: 30,
};
```

**Type Alias: 병합 미지원**

```typescript
type User = {
  name: string;
};

type User = {  // ❌ 오류: Duplicate identifier 'User'
  age: number;
};
```

### 3. 적용 범위

**Interface: 주로 객체 구조에 사용**

```typescript
interface User {
  name: string;
  age: number;
}
```

**Type Alias: 모든 타입에 사용 가능**

```typescript
// 기본 타입
type ID = string | number;

// 함수 타입
type Greet = (name: string) => string;

// 유니온 타입
type Status = 'active' | 'inactive' | 'pending';

// 튜플
type Point = [number, number];

// 객체
type User = {
  name: string;
  age: number;
};
```

### 4. 계산된 속성

**Interface: 계산된 속성 미지원**

```typescript
interface User {
  [key: string]: any;  // 인덱스 시그니처
}
```

**Type Alias: 더 복잡한 타입 연산 지원**

```typescript
type Keys = 'name' | 'age' | 'email';

type User = {
  [K in Keys]: string;  // 매핑 타입
};
```

## 3. When to Use Interface vs Type Alias?

> 언제 Interface를 사용하고, 언제 Type Alias를 사용해야 할까요?

### Interface를 사용하는 경우

1. **객체 구조 정의**(가장 일반적)
   ```typescript
   interface User {
     name: string;
     age: number;
   }
   ```

2. **선언 병합이 필요한 경우**
   ```typescript
   // 서드파티 패키지의 타입 정의 확장
   interface Window {
     myCustomProperty: string;
   }
   ```

3. **클래스의 계약 정의**
   ```typescript
   interface Flyable {
     fly(): void;
   }

   class Bird implements Flyable {
     fly(): void {
       console.log('Flying');
     }
   }
   ```

### Type Alias를 사용하는 경우

1. **유니온 타입이나 교차 타입 정의**
   ```typescript
   type ID = string | number;
   type Status = 'active' | 'inactive';
   ```

2. **함수 타입 정의**
   ```typescript
   type EventHandler = (event: Event) => void;
   ```

3. **튜플 정의**
   ```typescript
   type Point = [number, number];
   ```

4. **매핑 타입이나 조건부 타입이 필요한 경우**
   ```typescript
   type Partial<T> = {
     [P in keyof T]?: T[P];
   };
   ```

## 4. Common Interview Questions

> 자주 나오는 면접 질문

### 문제 1: 기본적인 차이

다음 두 가지 정의 방식의 차이를 설명하세요.

```typescript
// 방식 1: Interface 사용
interface User {
  name: string;
  age: number;
}

// 방식 2: Type Alias 사용
type User = {
  name: string;
  age: number;
};
```

<details>
<summary>클릭하여 답변 보기</summary>

**공통점**:
- 둘 다 객체 구조를 정의하는 데 사용 가능
- 사용 방법이 완전히 동일
- 둘 다 확장 및 상속 가능

**차이점**:

1. **선언 병합**:
   ```typescript
   // Interface는 지원
   interface User {
     name: string;
   }
   interface User {
     age: number;
   }
   // 자동으로 { name: string; age: number; }로 병합

   // Type Alias는 미지원
   type User = { name: string; };
   type User = { age: number; }; // ❌ 오류
   ```

2. **적용 범위**:
   ```typescript
   // Interface는 주로 객체에 사용
   interface User { ... }

   // Type Alias는 모든 타입에 사용 가능
   type ID = string | number;
   type Handler = (event: Event) => void;
   type Point = [number, number];
   ```

**권장**:
- 객체 구조 정의 시 둘 다 사용 가능
- 선언 병합이 필요하면 Interface 사용
- 비객체 타입 정의에는 Type Alias 사용

</details>

### 문제 2: 확장 방식

다음 두 가지 확장 방식의 차이를 설명하세요.

```typescript
// 방식 1: Interface extends
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 방식 2: Type intersection
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};
```

<details>
<summary>클릭하여 답변 보기</summary>

**Interface extends**:
```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 동등함
interface Dog {
  name: string;
  breed: string;
}
```

**Type intersection**:
```typescript
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

// 동등함
type Dog = {
  name: string;
  breed: string;
};
```

**차이**:
- **구문**: Interface는 `extends` 사용, Type은 `&` 사용
- **결과**: 둘 다 결과는 동일
- **가독성**: Interface의 `extends`가 더 직관적
- **유연성**: Type의 `&`는 여러 타입 조합 가능

**예시**:
```typescript
// Interface: 하나만 extends 가능
interface Dog extends Animal {
  breed: string;
}

// Type: 여러 개 조합 가능
type Dog = Animal & Canine & {
  breed: string;
};
```

</details>

### 문제 3: 선언 병합

다음 코드의 동작을 설명하세요.

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

const user: User = {
  name: 'John',
  // age가 빠지면 어떻게 되나요?
};
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 두 선언이 자동으로 병합됨:
// interface User {
//   name: string;
//   age: number;
// }

const user: User = {
  name: 'John',
  // ❌ 오류: Property 'age' is missing in type '{ name: string; }' but required in type 'User'
};
```

**올바른 작성법**:
```typescript
const user: User = {
  name: 'John',
  age: 30,  // ✅ age를 포함해야 함
};
```

**선언 병합의 활용 시나리오**:
```typescript
// 서드파티 패키지의 타입 정의 확장
interface Window {
  myCustomProperty: string;
}

// 이제 사용 가능
window.myCustomProperty = 'value';
```

**주의**: Type Alias는 선언 병합을 지원하지 않음
```typescript
type User = { name: string; };
type User = { age: number; }; // ❌ 오류: Duplicate identifier
```

</details>

### 문제 4: 구현(implements)

Interface와 Type Alias의 클래스 구현에서의 차이를 설명하세요.

```typescript
// 케이스 1: Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}

// 케이스 2: Type Alias
type Flyable = {
  fly(): void;
};

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}
```

<details>
<summary>클릭하여 답변 보기</summary>

**둘 다 implements에 사용 가능**:

```typescript
// Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}

// Type Alias(객체 타입)
type Flyable = {
  fly(): void;
};

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}
```

**차이**:
- **Interface**: 전통적으로 클래스의 계약 정의에 더 많이 사용
- **Type Alias**: 사용 가능하지만, 의미적으로 Interface가 더 적합

**권장**:
- 클래스 계약 정의 시 Interface 우선 사용
- Type Alias로 이미 정의된 경우에도 구현 가능

**주의**: Type Alias로 정의한 함수 타입은 구현 불가
```typescript
type Flyable = () => void;

class Bird implements Flyable {  // ❌ 오류: 객체 타입만 구현 가능
  // ...
}
```

</details>

## 5. Best Practices

> 모범 사례

### 권장 방법

```typescript
// 1. 객체 구조 정의 시 Interface 우선 사용
interface User {
  name: string;
  age: number;
}

// 2. 유니온 타입 정의 시 Type Alias 사용
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// 3. 함수 타입 정의 시 Type Alias 사용
type EventHandler = (event: Event) => void;

// 4. 선언 병합이 필요하면 Interface 사용
interface Window {
  customProperty: string;
}

// 5. 클래스 계약 정의 시 Interface 사용
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {}
}
```

### 피해야 할 방법

```typescript
// 1. Interface와 Type Alias를 혼용하여 동일한 구조를 정의하지 않기
interface User { ... }
type User = { ... };  // ❌ 혼란을 야기

// 2. Type Alias로 단순한 객체 구조를 정의하지 않기(특별한 요구가 없는 경우)
type User = {  // ⚠️ Interface가 더 적합
  name: string;
};

// 3. Interface로 비객체 타입을 정의하지 않기
interface ID extends string {}  // ❌ 지원되지 않음
type ID = string | number;  // ✅ 올바름
```

## 6. Interview Summary

> 면접 요약

### 빠른 참고

**Interface(인터페이스)**:
- 주로 객체 구조 정의에 사용
- 선언 병합(Declaration Merging) 지원
- `extends`로 확장
- 클래스 계약 정의에 적합

**Type Alias(타입 별칭)**:
- 모든 타입에 사용 가능
- 선언 병합 미지원
- `&` 교차 타입으로 확장
- 유니온 타입, 함수 타입, 튜플 정의에 적합

### 면접 답변 예시

**Q: Interface와 Type Alias의 차이는 무엇인가요?**

> "Interface와 Type Alias는 둘 다 객체 구조를 정의하는 데 사용할 수 있지만, 몇 가지 핵심 차이가 있습니다: 1) Interface는 선언 병합을 지원하여, 동일한 Interface를 여러 번 선언하면 자동으로 병합됩니다. Type Alias는 지원하지 않습니다. 2) Interface는 주로 객체 구조에 사용됩니다. Type Alias는 유니온 타입, 함수 타입, 튜플 등 모든 타입에 사용할 수 있습니다. 3) Interface는 extends로 확장하고, Type Alias는 교차 타입 &로 확장합니다. 4) Interface는 클래스의 계약 정의에 더 적합합니다. 일반적으로 객체 구조 정의에는 둘 다 사용 가능하지만, 선언 병합이 필요하면 Interface, 비객체 타입 정의에는 Type Alias를 사용해야 합니다."

**Q: 언제 Interface를 사용하고, 언제 Type Alias를 사용해야 하나요?**

> "Interface를 사용하는 경우: 객체 구조 정의, 선언 병합이 필요한 경우(서드파티 패키지 타입 확장 등), 클래스 계약 정의. Type Alias를 사용하는 경우: 유니온 타입이나 교차 타입 정의, 함수 타입 정의, 튜플 정의, 매핑 타입이나 조건부 타입이 필요한 경우. 간단히 말해, 객체 구조에는 Interface를 우선 고려하고, 나머지 타입에는 Type Alias를 사용합니다."

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
