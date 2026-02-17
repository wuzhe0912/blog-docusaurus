---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> JavaScript에서 `this`란 무엇인가요?

`this`는 JavaScript의 키워드로, 함수가 실행될 때의 컨텍스트 객체를 가리킵니다. `this`의 값은 함수가 **어떻게 호출되는지**에 따라 결정되며, 어디에서 정의되었는지와는 관련이 없습니다.

### `this`의 바인딩 규칙

JavaScript에서 `this`의 바인딩에는 네 가지 규칙이 있습니다(우선순위 높은 순):

1. **new 바인딩**: `new` 키워드를 사용하여 생성자 함수를 호출
2. **명시적 바인딩**: `call`, `apply`, `bind`를 사용하여 `this`를 명시적으로 지정
3. **암시적 바인딩**: 객체 메서드로 호출
4. **기본 바인딩**: 기타 상황에서의 기본 동작

## 2. Please explain the difference of `this` in different contexts

> 서로 다른 컨텍스트에서 `this`의 차이를 설명해 주세요

### 1. 전역 환경에서의 `this`

```javascript
console.log(this); // 브라우저: window, Node.js: global

function globalFunction() {
  console.log(this); // 비엄격 모드: window/global, 엄격 모드: undefined
}

globalFunction();
```

```javascript
'use strict';

function strictFunction() {
  console.log(this); // undefined
}

strictFunction();
```

### 2. 일반 함수(Function)에서의 `this`

일반 함수의 `this`는 **호출 방식**에 따라 결정됩니다:

```javascript
function regularFunction() {
  console.log(this);
}

// 직접 호출: this는 전역 객체(비엄격 모드) 또는 undefined(엄격 모드)를 가리킴
regularFunction(); // window (비엄격 모드) 또는 undefined (엄격 모드)

// 객체 메서드로 호출: this는 해당 객체를 가리킴
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// call/apply/bind 사용: this는 지정된 객체를 가리킴
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. 화살표 함수(Arrow Function)에서의 `this`

**화살표 함수는 자체 `this`를 가지지 않으며**, **외부 스코프의 `this`를 상속합니다**(렉시컬 스코프).

```javascript
const obj = {
  name: 'Object',

  // 일반 함수
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // 내부 일반 함수: this가 변경됨
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // 내부 화살표 함수: this는 외부에서 상속
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // 화살표 함수
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window(전역에서 상속)
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. 객체 메서드에서의 `this`

```javascript
const person = {
  name: 'John',
  age: 30,

  // 일반 함수: this는 person을 가리킴
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // ES6 축약 메서드: this는 person을 가리킴
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // 화살표 함수: this는 외부(여기서는 전역)에서 상속
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm undefined"
  },
};

person.greet(); // "Hello, I'm John"
person.introduce(); // "I'm John, 30 years old"
person.arrowGreet(); // "Hello, I'm undefined"
```

### 5. 생성자 함수에서의 `this`

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const john = new Person('John', 30);
john.greet(); // "Hello, I'm John"
console.log(john.name); // "John"
```

### 6. Class에서의 `this`

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // 일반 메서드: this는 인스턴스를 가리킴
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // 화살표 함수 속성: this는 인스턴스에 바인딩됨
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// 메서드를 변수에 할당하면 this 바인딩이 사라짐
const greet = john.greet;
greet(); // 오류: Cannot read property 'name' of undefined

// 화살표 함수 속성은 this 바인딩을 잃지 않음
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> 퀴즈: 다음 코드는 무엇을 출력할까요?

### 문제 1: 객체 메서드와 화살표 함수

```javascript
const obj = {
  name: 'Object',
  regularFunc: function () {
    console.log('A:', this.name);
  },
  arrowFunc: () => {
    console.log('B:', this.name);
  },
};

obj.regularFunc();
obj.arrowFunc();
```

<details>
<summary>클릭하여 정답 보기</summary>

```javascript
// A: Object
// B: undefined
```

**설명**:
- `regularFunc`는 일반 함수로, `obj.regularFunc()`로 호출되므로 `this`는 `obj`를 가리키며, `"A: Object"`가 출력됩니다
- `arrowFunc`는 화살표 함수로, 자체 `this`가 없고 외부(전역)의 `this`를 상속합니다. 전역에 `name` 속성이 없으므로 `"B: undefined"`가 출력됩니다

</details>

### 문제 2: 함수를 인자로 전달

```javascript
const person = {
  name: 'John',
  greet: function () {
    console.log(`Hello, ${this.name}`);
  },
};

person.greet(); // 1

const greet = person.greet;
greet(); // 2

setTimeout(person.greet, 1000); // 3
```

<details>
<summary>클릭하여 정답 보기</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" 또는 오류(엄격 모드)
// 3: "Hello, undefined" 또는 오류(엄격 모드)
```

**설명**:
1. `person.greet()` - 객체를 통해 호출하므로 `this`는 `person`을 가리킴
2. `greet()` - 메서드를 변수에 할당한 후 직접 호출하면 `this`가 사라지고, 전역 또는 `undefined`를 가리킴
3. `setTimeout(person.greet, 1000)` - 메서드가 콜백 함수로 전달되어 `this`가 사라짐

</details>

### 문제 3: 중첩 함수

```javascript
const obj = {
  name: 'Outer',
  method: function () {
    console.log('A:', this.name);

    function inner() {
      console.log('B:', this.name);
    }
    inner();

    const arrow = () => {
      console.log('C:', this.name);
    };
    arrow();
  },
};

obj.method();
```

<details>
<summary>클릭하여 정답 보기</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**설명**:
- `A` - `method`가 `obj`를 통해 호출되므로 `this`는 `obj`를 가리킴
- `B` - `inner`는 일반 함수로 직접 호출되므로 `this`는 전역 또는 `undefined`를 가리킴
- `C` - `arrow`는 화살표 함수로 외부 `method`의 `this`를 상속하여 `obj`를 가리킴

</details>

### 문제 4: setTimeout과 화살표 함수

```javascript
const obj = {
  name: 'Object',

  method1: function () {
    setTimeout(function () {
      console.log('A:', this.name);
    }, 100);
  },

  method2: function () {
    setTimeout(() => {
      console.log('B:', this.name);
    }, 100);
  },
};

obj.method1();
obj.method2();
```

<details>
<summary>클릭하여 정답 보기</summary>

```javascript
// A: undefined
// B: Object
```

**설명**:
- `A` - `setTimeout`의 콜백이 일반 함수이므로, 실행 시 `this`는 전역을 가리킴
- `B` - `setTimeout`의 콜백이 화살표 함수이므로, 외부 `method2`의 `this`를 상속하여 `obj`를 가리킴

</details>

### 문제 5: 복잡한 this 바인딩

```javascript
const obj1 = {
  name: 'obj1',
  getThis: function () {
    return this;
  },
};

const obj2 = {
  name: 'obj2',
};

console.log('A:', obj1.getThis().name);

const getThis = obj1.getThis;
console.log('B:', getThis() === window); // 브라우저 환경 가정

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>클릭하여 정답 보기</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**설명**:
- `A` - `obj1`을 통해 호출하므로 `this`는 `obj1`을 가리킴
- `B` - 직접 호출하므로 `this`는 전역(window)을 가리킴
- `C` - `obj2`를 통해 호출하므로 `this`는 `obj2`를 가리킴
- `D` - `bind`를 사용하여 `this`를 `obj2`로 바인딩

</details>

### 문제 6: 생성자 함수와 프로토타입

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log(`Hello, I'm ${this.name}`);
};

Person.prototype.delayedGreet = function () {
  setTimeout(function () {
    console.log('A:', this.name);
  }, 100);
};

Person.prototype.arrowDelayedGreet = function () {
  setTimeout(() => {
    console.log('B:', this.name);
  }, 100);
};

const john = new Person('John');
john.delayedGreet();
john.arrowDelayedGreet();
```

<details>
<summary>클릭하여 정답 보기</summary>

```javascript
// A: undefined
// B: John
```

**설명**:
- `A` - `setTimeout`의 일반 함수 콜백으로, `this`는 전역을 가리킴
- `B` - `setTimeout`의 화살표 함수 콜백으로, 외부 `arrowDelayedGreet`의 `this`를 상속하여 `john`을 가리킴

</details>

### 문제 7: 전역 변수 vs 객체 속성

```javascript
var name = 'jjjj';

var obj = {
  a: function () {
    name = 'john';
    console.log(this.name);
  },
};

obj.a();
```

<details>
<summary>클릭하여 정답 보기</summary>

```javascript
// undefined
```

**설명**:

이 문제의 핵심은 **전역 변수**와 **객체 속성**의 차이를 이해하는 것입니다:

1. **`obj.a()`의 `this`가 가리키는 것**:
   - `obj.a()`로 호출하므로 `this`는 `obj`를 가리킴

2. **`name = 'john'`은 전역 변수를 수정함**:
   ```javascript
   name = 'john'; // var/let/const 없이, 전역 name을 수정
   // 다음과 동일
   window.name = 'john'; // 브라우저 환경
   ```

3. **`this.name`은 객체 속성에 접근함**:
   ```javascript
   console.log(this.name); // console.log(obj.name)과 동일
   ```

4. **`obj` 객체에는 `name` 속성이 없음**:
   ```javascript
   obj.name; // undefined(obj 객체 내에 name이 정의되지 않음)
   ```

**전체 실행 과정**:

```javascript
// 초기 상태
window.name = 'jjjj'; // 전역 변수
obj = {
  a: function () { /* ... */ },
  // 주의: obj에는 name 속성이 없음!
};

// obj.a() 실행
obj.a();
  ↓
// 1. name = 'john' → 전역 window.name 수정
window.name = 'john'; // ✅ 전역 변수가 수정됨

// 2. this.name → obj.name에 접근
this.name; // obj.name과 동일
obj.name; // undefined(obj에 name 속성이 없음)
```

**흔한 오해**:

많은 사람들이 `'john'`이 출력될 것이라고 생각하는데, 이는:
- ❌ `name = 'john'`이 `obj`에 속성을 추가한다고 오해
- ❌ `this.name`이 전역 변수에 접근한다고 오해

**올바른 이해**:
- ✅ `name = 'john'`은 전역 변수만 수정하며 `obj`에는 영향을 주지 않음
- ✅ `this.name`이 접근하는 것은 `obj.name`이지, 전역 `name`이 아님

**`'john'`을 출력하려면 다음과 같이 작성해야 합니다**:

```javascript
var obj = {
  a: function () {
    this.name = 'john'; // ✅ obj에 name 속성 추가
    console.log(this.name); // 'john'
  },
};

obj.a(); // 'john' 출력
console.log(obj.name); // 'john'
```

</details>

### 문제 8: 전역 변수 함정(심화)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified'; // 주의: var/let/const 없음
    console.log('1:', name); // 전역 변수에 접근
    console.log('2:', this.name); // 객체 속성에 접근
  },
};

obj.a();
console.log('3:', name); // 전역 변수
console.log('4:', obj.name); // 객체 속성
```

<details>
<summary>클릭하여 정답 보기</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**설명**:

```javascript
// 초기 상태
window.name = 'global'; // 전역 변수
obj.name = 'object'; // 객체 속성

// obj.a() 실행
name = 'modified'; // 전역 window.name 수정

console.log('1:', name); // 전역 접근: 'modified'
console.log('2:', this.name); // obj.name 접근: 'object'

// 실행 완료 후
console.log('3:', name); // 전역: 'modified'
console.log('4:', obj.name); // 객체: 'object'(수정되지 않음)
```

**핵심 개념**:
- `name`(`this.` 없이) → 전역 변수에 접근
- `this.name`(`this.` 있음) → 객체 속성에 접근
- 이 둘은 **완전히 다른 변수**입니다!

</details>

## 4. How to preserve `this` in callbacks?

> 콜백 함수에서 `this`를 유지하는 방법은?

### 방법 1: 화살표 함수 사용

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ 화살표 함수는 외부의 this를 상속함
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### 방법 2: `bind()` 사용

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ bind로 this 바인딩
    setTimeout(
      function () {
        console.log(this.name); // "Object"
      }.bind(this),
      1000
    );
  },
};

obj.method();
```

### 방법 3: `this`를 변수에 저장(이전 방법)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ this를 변수에 저장
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### 방법 4: `call()` 또는 `apply()` 사용

```javascript
function greet() {
  console.log(`Hello, I'm ${this.name}`);
}

const person1 = { name: 'John' };
const person2 = { name: 'Jane' };

greet.call(person1); // "Hello, I'm John"
greet.apply(person2); // "Hello, I'm Jane"
```

## 5. Common `this` pitfalls

> 흔한 `this` 함정

### 함정 1: 객체 메서드를 변수에 할당

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ undefined(this가 사라짐)

// 해결 방법: bind 사용
const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### 함정 2: 이벤트 리스너에서의 `this`

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ 화살표 함수: this가 button을 가리키지 않음
  handleClick1: () => {
    console.log(this); // window
  },

  // ✅ 일반 함수: this는 이벤트를 트리거한 요소를 가리킴
  handleClick2: function () {
    console.log(this); // button 요소
  },

  // ✅ 객체의 this에 접근해야 하는 경우 화살표 함수로 래핑
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### 함정 3: 배열 메서드의 콜백

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ 일반 함수 콜백은 this를 잃음
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // undefined 1, undefined 2, undefined 3
    });
  },

  // ✅ 화살표 함수 콜백은 this를 유지함
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    });
  },

  // ✅ forEach의 thisArg 매개변수 사용
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    }, this); // 두 번째 인자로 this 지정
  },
};
```

## 6. `this` binding rules summary

> `this` 바인딩 규칙 요약

### 우선순위(높은 순)

```javascript
// 1. new 바인딩(최고 우선순위)
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. 명시적 바인딩(call/apply/bind)
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. 암시적 바인딩(객체 메서드)
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. 기본 바인딩(최저 우선순위)
greet(); // undefined(엄격 모드) 또는 window.name
```

### Function vs Arrow Function 비교표

| 특성 | Function | Arrow Function |
| --- | --- | --- |
| 자체 `this` 보유 | ✅ 있음 | ❌ 없음 |
| `this` 결정 요인 | 호출 방식 | 정의 위치(렉시컬 스코프) |
| `call`/`apply`/`bind`로 `this` 변경 가능 | ✅ 가능 | ❌ 불가능 |
| 생성자로 사용 가능 | ✅ 가능 | ❌ 불가능 |
| `arguments` 객체 보유 | ✅ 있음 | ❌ 없음 |
| 적합한 상황 | 객체 메서드, 생성자 | 콜백 함수, 외부 this 상속이 필요한 경우 |

### 기억법

> **"화살표는 상속, 함수는 호출"**
>
> - **화살표 함수**: `this`는 외부 스코프에서 상속되며, 정의 시점에 결정됨
> - **일반 함수**: `this`는 호출 방식에 따라 결정되며, 실행 시점에 결정됨

## 7. Best practices

> 모범 사례

### ✅ 권장 방법

```javascript
// 1. 객체 메서드에는 일반 함수 또는 ES6 메서드 축약 사용
const obj = {
  name: 'Object',

  // ✅ 좋음: 일반 함수
  greet: function () {
    console.log(this.name);
  },

  // ✅ 좋음: ES6 축약
  introduce() {
    console.log(this.name);
  },
};

// 2. 콜백 함수에는 화살표 함수 사용
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    // ✅ 좋음: 화살표 함수가 this를 유지함
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. 동적 this가 필요한 경우 일반 함수 사용
const button = {
  label: 'Click me',

  // ✅ 좋음: DOM 요소의 this에 접근해야 함
  handleClick: function () {
    console.log(this); // button DOM 요소
  },
};
```

### ❌ 비권장 방법

```javascript
// 1. 객체 메서드에 화살표 함수를 사용하지 않음
const obj = {
  name: 'Object',

  // ❌ 나쁨: this가 obj를 가리키지 않음
  greet: () => {
    console.log(this.name); // undefined
  },
};

// 2. 생성자에 화살표 함수를 사용하지 않음
// ❌ 나쁨: 화살표 함수는 생성자로 사용할 수 없음
const Person = (name) => {
  this.name = name; // 오류!
};

// 3. arguments에 접근해야 할 때 화살표 함수를 사용하지 않음
// ❌ 나쁨: 화살표 함수에는 arguments가 없음
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
