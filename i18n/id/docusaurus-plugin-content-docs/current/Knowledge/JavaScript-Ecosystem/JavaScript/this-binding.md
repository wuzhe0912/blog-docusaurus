---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. Apa itu `this` di JavaScript?

> Apa itu `this` di JavaScript?

`this` adalah kata kunci di JavaScript yang menunjuk ke objek konteks eksekusi dari sebuah fungsi.
Nilai `this` bergantung pada **bagaimana fungsi dipanggil**, bukan di mana fungsi didefinisikan.

### Aturan binding `this`

Ada empat aturan binding untuk `this` di JavaScript (prioritas tertinggi ke terendah):

1. **new binding**: fungsi dipanggil dengan `new`
2. **explicit binding**: `call`, `apply`, atau `bind` secara eksplisit mengatur `this`
3. **implicit binding**: dipanggil sebagai metode objek
4. **default binding**: perilaku fallback di call site lainnya

## 2. Jelaskan perbedaan `this` di berbagai konteks

> Jelaskan bagaimana `this` berperilaku di berbagai konteks.

### 1. `this` dalam konteks global

```javascript
console.log(this); // browser: window, Node.js: global

function globalFunction() {
  console.log(this); // non-strict: window/global, strict: undefined
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

### 2. `this` dalam fungsi biasa

Untuk fungsi biasa, `this` bergantung pada **call site**:

```javascript
function regularFunction() {
  console.log(this);
}

// pemanggilan langsung
regularFunction(); // window (non-strict) atau undefined (strict)

// pemanggilan metode
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// call/apply/bind
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. `this` dalam arrow function

**Arrow function tidak memiliki `this` sendiri**.
Mereka **mewarisi `this` dari scope leksikal luar**.

```javascript
const obj = {
  name: 'Object',

  // metode biasa
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // fungsi biasa di dalam: this berubah
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // arrow function di dalam: this diwarisi
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // arrow function sebagai properti objek
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window/scope leksikal global
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. `this` dalam metode objek

```javascript
const person = {
  name: 'John',
  age: 30,

  // fungsi biasa: this -> person
  greet: function () {
    console.log(`Halo, saya ${this.name}`); // "Halo, saya John"
  },

  // singkatan metode ES6: this -> person
  introduce() {
    console.log(`Saya ${this.name}, umur ${this.age} tahun`);
  },

  // arrow function: this diwarisi dari scope luar
  arrowGreet: () => {
    console.log(`Halo, saya ${this.name}`); // biasanya undefined untuk name
  },
};

person.greet();
person.introduce();
person.arrowGreet();
```

### 5. `this` dalam fungsi konstruktor

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(`Halo, saya ${this.name}`);
  };
}

const john = new Person('John', 30);
john.greet();
console.log(john.name); // "John"
```

### 6. `this` dalam class

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // metode biasa: this -> instance
  greet() {
    console.log(`Halo, saya ${this.name}`);
  }

  // arrow function class field: this terikat permanen ke instance
  arrowGreet = () => {
    console.log(`Hai, saya ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Halo, saya John"

// ekstraksi metode kehilangan this
const greet = john.greet;
greet(); // error di strict mode

// arrow field mempertahankan this
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hai, saya John"
```

## 3. Kuis: Apa yang akan dicetak?

> Kuis: apa yang akan dicetak oleh kode berikut?

### Pertanyaan 1: metode objek vs arrow function

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
<summary>Klik untuk melihat jawaban</summary>

```javascript
// A: Object
// B: undefined
```

**Penjelasan:**

- `regularFunc` dipanggil sebagai `obj.regularFunc()`, jadi `this` adalah `obj`
- `arrowFunc` tidak punya `this` sendiri; mewarisi `this` leksikal luar/global

</details>

### Pertanyaan 2: meneruskan fungsi sebagai argumen

```javascript
const person = {
  name: 'John',
  greet: function () {
    console.log(`Halo, ${this.name}`);
  },
};

person.greet(); // 1

const greet = person.greet;
greet(); // 2

setTimeout(person.greet, 1000); // 3
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// 1: "Halo, John"
// 2: "Halo, undefined" atau error di strict mode
// 3: "Halo, undefined" atau error di strict mode
```

**Penjelasan:**

1. `person.greet()` -> implicit binding, `this` adalah `person`
2. Fungsi yang diekstrak -> `this` hilang
3. Callback diteruskan ke `setTimeout` -> `this` bukan `person`

</details>

### Pertanyaan 3: fungsi bersarang

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
<summary>Klik untuk melihat jawaban</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**Penjelasan:**

- `A`: `method` dipanggil oleh `obj`
- `B`: `inner` adalah pemanggilan langsung biasa
- `C`: arrow function mewarisi `this` dari `method` luar

</details>

### Pertanyaan 4: `setTimeout` dan arrow function

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
<summary>Klik untuk melihat jawaban</summary>

```javascript
// A: undefined
// B: Object
```

**Penjelasan:**

- `A`: callback biasa di `setTimeout` kehilangan konteks metode
- `B`: callback arrow mewarisi `this` dari `method2`

</details>

### Pertanyaan 5: binding `this` yang kompleks

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
console.log('B:', getThis() === window); // asumsi browser

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**Penjelasan:**

- `A`: dipanggil dari `obj1`
- `B`: pemanggilan langsung menggunakan default binding (window di browser non-strict)
- `C`: dipanggil dari `obj2`
- `D`: secara eksplisit di-bind dengan `bind(obj2)`

</details>

### Pertanyaan 6: konstruktor dan prototype

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log(`Halo, saya ${this.name}`);
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
<summary>Klik untuk melihat jawaban</summary>

```javascript
// A: undefined
// B: John
```

**Penjelasan:**

- `A`: callback timeout biasa menggunakan binding default/global
- `B`: callback timeout arrow mewarisi `this` instance

</details>

### Pertanyaan 7: variabel global vs properti objek

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
<summary>Klik untuk melihat jawaban</summary>

```javascript
// undefined
```

**Penjelasan:**

Kuncinya adalah perbedaan antara **variabel global** dan **properti objek**.

1. `this` di `obj.a()` menunjuk ke `obj`
2. `name = 'john'` (tanpa deklarasi) memperbarui variabel global
3. `this.name` membaca `obj.name`
4. `obj` tidak punya properti `name`, jadi hasilnya `undefined`

**Alur eksekusi:**

```javascript
// awal
window.name = 'jjjj';
obj = {
  a: function () {
    /* ... */
  },
  // obj tidak punya properti name
};

obj.a();
  ↓
window.name = 'john'; // nilai global berubah
this.name; // sama dengan obj.name
obj.name; // undefined
```

Jika Anda ingin `'john'`, tugaskan via `this.name = 'john'`.

```javascript
var obj = {
  a: function () {
    this.name = 'john';
    console.log(this.name); // 'john'
  },
};

obj.a();
console.log(obj.name); // 'john'
```

</details>

### Pertanyaan 8: jebakan variabel global (lanjutan)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified';
    console.log('1:', name); // variabel global
    console.log('2:', this.name); // properti objek
  },
};

obj.a();
console.log('3:', name); // variabel global
console.log('4:', obj.name); // properti objek
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**Poin kunci:**

- `name` tanpa `this.` -> variabel global
- `this.name` -> properti objek
- Keduanya adalah nilai yang berbeda

</details>

## 4. Bagaimana cara mempertahankan `this` di callback?

> Bagaimana cara mempertahankan `this` di dalam fungsi callback?

### Metode 1: arrow function

```javascript
const obj = {
  name: 'Object',

  method: function () {
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Metode 2: `bind()`

```javascript
const obj = {
  name: 'Object',

  method: function () {
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

### Metode 3: simpan `this` di variabel (pola legacy)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Metode 4: `call()` / `apply()`

```javascript
function greet() {
  console.log(`Halo, saya ${this.name}`);
}

const person1 = { name: 'John' };
const person2 = { name: 'Jane' };

greet.call(person1); // "Halo, saya John"
greet.apply(person2); // "Halo, saya Jane"
```

## 5. Jebakan `this` yang umum

> Jebakan `this` yang umum

### Jebakan 1: mengekstrak metode objek

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ this hilang

const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### Jebakan 2: `this` di event listener

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ arrow function di sini tidak bind ke button
  handleClick1: () => {
    console.log(this); // window/leksikal global
  },

  // ✅ fungsi biasa di listener mendapat event target sebagai this
  handleClick2: function () {
    console.log(this); // elemen button
  },

  // ✅ gunakan pembungkus arrow ketika Anda memerlukan this objek di dalam callback
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### Jebakan 3: callback di metode array

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ callback biasa kehilangan this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item);
    });
  },

  // ✅ callback arrow mempertahankan this leksikal
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item);
    });
  },

  // ✅ gunakan thisArg
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item);
    }, this);
  },
};
```

## 6. Ringkasan aturan binding `this`

> Ringkasan aturan binding `this`

### Prioritas (tinggi -> rendah)

```javascript
// 1. new binding (tertinggi)
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. explicit binding (call/apply/bind)
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. implicit binding (metode objek)
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. default binding (terendah)
greet(); // undefined (strict) atau nama global (non-strict)
```

### Function vs Arrow Function

| Fitur | Function | Arrow Function |
| --- | --- | --- |
| Punya `this` sendiri | ✅ Ya | ❌ Tidak |
| `this` ditentukan oleh | Call site | Scope definisi leksikal |
| `call`/`apply`/`bind` bisa mengubah `this` | ✅ Ya | ❌ Tidak |
| Bisa jadi konstruktor | ✅ Ya | ❌ Tidak |
| Punya `arguments` | ✅ Ya | ❌ Tidak |
| Terbaik untuk | Metode objek, konstruktor | Callback, warisan `this` luar |

### Frasa untuk diingat

> **"Arrow mewarisi, function bergantung pada pemanggilan."**
>
> - Arrow function: `this` diwarisi dari scope leksikal luar
> - Fungsi biasa: `this` ditentukan saat runtime oleh call site

## 7. Best practice

> Best practice

### ✅ Direkomendasikan

```javascript
// 1. Gunakan fungsi biasa atau singkatan metode untuk metode objek
const obj = {
  name: 'Object',

  // ✅ baik
  greet: function () {
    console.log(this.name);
  },

  // ✅ baik
  introduce() {
    console.log(this.name);
  },
};

// 2. Gunakan arrow function untuk callback yang harus mempertahankan this luar
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. Gunakan fungsi biasa ketika this dinamis diperlukan
const button = {
  label: 'Klik saya',

  handleClick: function () {
    console.log(this); // event target / objek penerima
  },
};
```

### ❌ Tidak direkomendasikan

```javascript
// 1. Hindari arrow function sebagai metode objek
const obj = {
  name: 'Object',

  greet: () => {
    console.log(this.name); // undefined dalam kebanyakan kasus
  },
};

// 2. Hindari arrow function sebagai konstruktor
const Person = (name) => {
  this.name = name; // salah
};

// 3. Hindari arrow ketika Anda memerlukan objek arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Referensi

- [MDN - this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
