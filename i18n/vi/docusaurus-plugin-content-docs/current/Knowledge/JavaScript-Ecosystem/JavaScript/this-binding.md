---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> `this` trong JavaScript là gì?

`this` là một từ khóa trong JavaScript, trỏ đến đối tượng ngữ cảnh khi hàm được thực thi. Giá trị của `this` phụ thuộc vào **cách hàm được gọi**, chứ không phải nơi nó được định nghĩa.

### Các quy tắc binding của `this`

Có bốn quy tắc binding cho `this` trong JavaScript (theo thứ tự ưu tiên từ cao đến thấp):

1. **Binding new**: Sử dụng từ khóa `new` để gọi hàm khởi tạo
2. **Binding tường minh**: Sử dụng `call`, `apply`, `bind` để chỉ định `this` một cách rõ ràng
3. **Binding ngầm định**: Gọi thông qua phương thức của đối tượng
4. **Binding mặc định**: Hành vi mặc định trong các trường hợp khác

## 2. Please explain the difference of `this` in different contexts

> Vui lòng giải thích sự khác biệt của `this` trong các ngữ cảnh khác nhau

### 1. `this` trong môi trường toàn cục

```javascript
console.log(this); // Trình duyệt: window, Node.js: global

function globalFunction() {
  console.log(this); // Chế độ không nghiêm ngặt: window/global, chế độ nghiêm ngặt: undefined
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

### 2. `this` trong hàm thông thường (Function)

`this` của hàm thông thường phụ thuộc vào **cách gọi**:

```javascript
function regularFunction() {
  console.log(this);
}

// Gọi trực tiếp: this trỏ đến đối tượng toàn cục (chế độ không nghiêm ngặt) hoặc undefined (chế độ nghiêm ngặt)
regularFunction(); // window (chế độ không nghiêm ngặt) hoặc undefined (chế độ nghiêm ngặt)

// Gọi như phương thức của đối tượng: this trỏ đến đối tượng đó
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// Sử dụng call/apply/bind: this trỏ đến đối tượng được chỉ định
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. `this` trong Arrow Function

**Arrow Function không có `this` riêng**, nó sẽ **kế thừa `this` từ phạm vi bên ngoài** (phạm vi từ vựng).

```javascript
const obj = {
  name: 'Object',

  // Hàm thông thường
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // Hàm thông thường bên trong: this sẽ thay đổi
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // Arrow Function bên trong: this kế thừa từ bên ngoài
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // Arrow Function
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window (kế thừa từ toàn cục)
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. `this` trong phương thức của đối tượng

```javascript
const person = {
  name: 'John',
  age: 30,

  // Hàm thông thường: this trỏ đến person
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // Phương thức viết tắt ES6: this trỏ đến person
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // Arrow Function: this kế thừa từ bên ngoài (ở đây là toàn cục)
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm undefined"
  },
};

person.greet(); // "Hello, I'm John"
person.introduce(); // "I'm John, 30 years old"
person.arrowGreet(); // "Hello, I'm undefined"
```

### 5. `this` trong hàm khởi tạo

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

### 6. `this` trong Class

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // Phương thức thông thường: this trỏ đến instance
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // Thuộc tính Arrow Function: this được gắn kết với instance
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// Gán phương thức cho biến sẽ mất binding của this
const greet = john.greet;
greet(); // Lỗi: Cannot read property 'name' of undefined

// Thuộc tính Arrow Function không mất binding của this
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> Câu đố: Đoạn mã sau sẽ in ra gì?

### Câu 1: Phương thức đối tượng và Arrow Function

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
<summary>Nhấn để xem đáp án</summary>

```javascript
// A: Object
// B: undefined
```

**Giải thích**:
- `regularFunc` là hàm thông thường, được gọi qua `obj.regularFunc()`, `this` trỏ đến `obj`, nên in ra `"A: Object"`
- `arrowFunc` là Arrow Function, không có `this` riêng, kế thừa `this` từ bên ngoài (toàn cục). Toàn cục không có thuộc tính `name`, nên in ra `"B: undefined"`

</details>

### Câu 2: Hàm được truyền như tham số

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
<summary>Nhấn để xem đáp án</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" hoặc lỗi (chế độ nghiêm ngặt)
// 3: "Hello, undefined" hoặc lỗi (chế độ nghiêm ngặt)
```

**Giải thích**:
1. `person.greet()` - Gọi thông qua đối tượng, `this` trỏ đến `person`
2. `greet()` - Sau khi gán phương thức cho biến và gọi trực tiếp, `this` bị mất, trỏ đến toàn cục hoặc `undefined`
3. `setTimeout(person.greet, 1000)` - Phương thức được truyền như callback, `this` bị mất

</details>

### Câu 3: Hàm lồng nhau

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
<summary>Nhấn để xem đáp án</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**Giải thích**:
- `A` - `method` được gọi qua `obj`, `this` trỏ đến `obj`
- `B` - `inner` là hàm thông thường, được gọi trực tiếp, `this` trỏ đến toàn cục hoặc `undefined`
- `C` - `arrow` là Arrow Function, kế thừa `this` từ `method` bên ngoài, trỏ đến `obj`

</details>

### Câu 4: setTimeout và Arrow Function

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
<summary>Nhấn để xem đáp án</summary>

```javascript
// A: undefined
// B: Object
```

**Giải thích**:
- `A` - Callback của `setTimeout` là hàm thông thường, khi thực thi `this` trỏ đến toàn cục
- `B` - Callback của `setTimeout` là Arrow Function, kế thừa `this` từ `method2` bên ngoài, trỏ đến `obj`

</details>

### Câu 5: Binding phức tạp của this

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
console.log('B:', getThis() === window); // Giả sử trong môi trường trình duyệt

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**Giải thích**:
- `A` - Gọi qua `obj1`, `this` trỏ đến `obj1`
- `B` - Gọi trực tiếp, `this` trỏ đến toàn cục (window)
- `C` - Gọi qua `obj2`, `this` trỏ đến `obj2`
- `D` - Sử dụng `bind` để gắn `this` với `obj2`

</details>

### Câu 6: Hàm khởi tạo và prototype

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
<summary>Nhấn để xem đáp án</summary>

```javascript
// A: undefined
// B: John
```

**Giải thích**:
- `A` - Callback hàm thông thường của `setTimeout`, `this` trỏ đến toàn cục
- `B` - Callback Arrow Function của `setTimeout`, kế thừa `this` từ `arrowDelayedGreet` bên ngoài, trỏ đến `john`

</details>

### Câu 7: Biến toàn cục vs thuộc tính đối tượng

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
<summary>Nhấn để xem đáp án</summary>

```javascript
// undefined
```

**Giải thích**:

Chìa khóa của câu hỏi này nằm ở việc hiểu sự khác biệt giữa **biến toàn cục** và **thuộc tính đối tượng**:

1. **`this` trong `obj.a()` trỏ đến đâu**:
   - Gọi qua `obj.a()`, `this` trỏ đến `obj`

2. **`name = 'john'` sửa đổi biến toàn cục**:
   ```javascript
   name = 'john'; // Không có var/let/const, sửa đổi name toàn cục
   // Tương đương với
   window.name = 'john'; // Môi trường trình duyệt
   ```

3. **`this.name` truy cập thuộc tính đối tượng**:
   ```javascript
   console.log(this.name); // Tương đương với console.log(obj.name)
   ```

4. **Đối tượng `obj` không có thuộc tính `name`**:
   ```javascript
   obj.name; // undefined (name không được định nghĩa trong đối tượng obj)
   ```

**Quá trình thực thi đầy đủ**:

```javascript
// Trạng thái ban đầu
window.name = 'jjjj'; // Biến toàn cục
obj = {
  a: function () { /* ... */ },
  // Lưu ý: obj không có thuộc tính name!
};

// Thực thi obj.a()
obj.a();
  ↓
// 1. name = 'john' → Sửa đổi window.name toàn cục
window.name = 'john'; // ✅ Biến toàn cục đã được sửa đổi

// 2. this.name → Truy cập obj.name
this.name; // Bằng obj.name
obj.name; // undefined (obj không có thuộc tính name)
```

**Hiểu lầm phổ biến**:

Nhiều người nghĩ sẽ in ra `'john'`, vì:
- ❌ Nhầm tưởng rằng `name = 'john'` sẽ thêm thuộc tính vào `obj`
- ❌ Nhầm tưởng rằng `this.name` sẽ truy cập biến toàn cục

**Hiểu đúng**:
- ✅ `name = 'john'` chỉ sửa đổi biến toàn cục, không ảnh hưởng đến `obj`
- ✅ `this.name` truy cập `obj.name`, không phải `name` toàn cục

**Nếu muốn in ra `'john'`, nên viết như sau**:

```javascript
var obj = {
  a: function () {
    this.name = 'john'; // ✅ Thêm thuộc tính name cho obj
    console.log(this.name); // 'john'
  },
};

obj.a(); // In ra 'john'
console.log(obj.name); // 'john'
```

</details>

### Câu 8: Bẫy biến toàn cục (mở rộng)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified'; // Lưu ý: không có var/let/const
    console.log('1:', name); // Truy cập biến toàn cục
    console.log('2:', this.name); // Truy cập thuộc tính đối tượng
  },
};

obj.a();
console.log('3:', name); // Biến toàn cục
console.log('4:', obj.name); // Thuộc tính đối tượng
```

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**Giải thích**:

```javascript
// Trạng thái ban đầu
window.name = 'global'; // Biến toàn cục
obj.name = 'object'; // Thuộc tính đối tượng

// Thực thi obj.a()
name = 'modified'; // Sửa đổi window.name toàn cục

console.log('1:', name); // Truy cập toàn cục: 'modified'
console.log('2:', this.name); // Truy cập obj.name: 'object'

// Sau khi thực thi
console.log('3:', name); // Toàn cục: 'modified'
console.log('4:', obj.name); // Đối tượng: 'object' (không bị sửa đổi)
```

**Khái niệm chính**:
- `name` (không có `this.`) → Truy cập biến toàn cục
- `this.name` (có `this.`) → Truy cập thuộc tính đối tượng
- Hai cái này là **hai biến hoàn toàn khác nhau**!

</details>

## 4. How to preserve `this` in callbacks?

> Làm thế nào để giữ `this` trong hàm callback?

### Phương pháp 1: Sử dụng Arrow Function

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ Arrow Function kế thừa this từ bên ngoài
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Phương pháp 2: Sử dụng `bind()`

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ bind gắn kết this
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

### Phương pháp 3: Lưu `this` vào biến (phương pháp cũ)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ Lưu this vào biến
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Phương pháp 4: Sử dụng `call()` hoặc `apply()`

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

> Các bẫy phổ biến của `this`

### Bẫy 1: Gán phương thức đối tượng cho biến

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ undefined (this bị mất)

// Giải pháp: sử dụng bind
const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### Bẫy 2: `this` trong event listener

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ Arrow Function: this không trỏ đến button
  handleClick1: () => {
    console.log(this); // window
  },

  // ✅ Hàm thông thường: this trỏ đến phần tử kích hoạt sự kiện
  handleClick2: function () {
    console.log(this); // phần tử button
  },

  // ✅ Nếu cần truy cập this của đối tượng, bọc bằng Arrow Function
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### Bẫy 3: Callback trong phương thức mảng

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ Callback hàm thông thường sẽ mất this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // undefined 1, undefined 2, undefined 3
    });
  },

  // ✅ Callback Arrow Function giữ được this
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    });
  },

  // ✅ Sử dụng tham số thisArg của forEach
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    }, this); // Tham số thứ hai chỉ định this
  },
};
```

## 6. `this` binding rules summary

> Tóm tắt quy tắc binding của `this`

### Thứ tự ưu tiên (từ cao đến thấp)

```javascript
// 1. Binding new (ưu tiên cao nhất)
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. Binding tường minh (call/apply/bind)
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. Binding ngầm định (phương thức đối tượng)
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. Binding mặc định (ưu tiên thấp nhất)
greet(); // undefined (chế độ nghiêm ngặt) hoặc window.name
```

### Bảng so sánh Function vs Arrow Function

| Đặc điểm | Function | Arrow Function |
| --- | --- | --- |
| Có `this` riêng | ✅ Có | ❌ Không |
| `this` phụ thuộc vào | Cách gọi | Vị trí định nghĩa (phạm vi từ vựng) |
| Có thể thay đổi `this` bằng `call`/`apply`/`bind` | ✅ Có thể | ❌ Không thể |
| Có thể dùng làm hàm khởi tạo | ✅ Có thể | ❌ Không thể |
| Có đối tượng `arguments` | ✅ Có | ❌ Không |
| Phù hợp cho | Phương thức đối tượng, hàm khởi tạo | Callback, khi cần kế thừa this bên ngoài |

### Cách ghi nhớ

> **"Arrow kế thừa, hàm gọi"**
>
> - **Arrow Function**: `this` kế thừa từ phạm vi bên ngoài, được xác định khi định nghĩa
> - **Hàm thông thường**: `this` phụ thuộc vào cách gọi, được xác định khi thực thi

## 7. Best practices

> Các phương pháp tốt nhất

### ✅ Cách làm được khuyến nghị

```javascript
// 1. Sử dụng hàm thông thường hoặc cú pháp viết tắt ES6 cho phương thức đối tượng
const obj = {
  name: 'Object',

  // ✅ Tốt: Hàm thông thường
  greet: function () {
    console.log(this.name);
  },

  // ✅ Tốt: Viết tắt ES6
  introduce() {
    console.log(this.name);
  },
};

// 2. Sử dụng Arrow Function cho callback
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    // ✅ Tốt: Arrow Function giữ được this
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. Sử dụng hàm thông thường khi cần this động
const button = {
  label: 'Click me',

  // ✅ Tốt: Cần truy cập this của phần tử DOM
  handleClick: function () {
    console.log(this); // phần tử DOM button
  },
};
```

### ❌ Cách làm không được khuyến nghị

```javascript
// 1. Không sử dụng Arrow Function cho phương thức đối tượng
const obj = {
  name: 'Object',

  // ❌ Xấu: this không trỏ đến obj
  greet: () => {
    console.log(this.name); // undefined
  },
};

// 2. Không sử dụng Arrow Function làm hàm khởi tạo
// ❌ Xấu: Arrow Function không thể dùng làm hàm khởi tạo
const Person = (name) => {
  this.name = name; // Lỗi!
};

// 3. Không sử dụng Arrow Function khi cần truy cập arguments
// ❌ Xấu: Arrow Function không có arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
