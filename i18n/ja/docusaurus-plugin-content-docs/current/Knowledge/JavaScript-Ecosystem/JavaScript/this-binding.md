---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> JavaScript における `this` とは何ですか？

`this` は JavaScript のキーワードで、関数が実行される際のコンテキストオブジェクトを指します。`this` の値は関数が**どのように呼び出されるか**によって決まり、どこで定義されたかではありません。

### `this` のバインディングルール

JavaScript における `this` のバインディングには4つのルールがあります（優先度の高い順）：

1. **new バインディング**：`new` キーワードを使用してコンストラクタ関数を呼び出す
2. **明示的バインディング**：`call`、`apply`、`bind` を使用して `this` を明示的に指定する
3. **暗黙的バインディング**：オブジェクトメソッドとして呼び出す
4. **デフォルトバインディング**：その他の場合のデフォルト動作

## 2. Please explain the difference of `this` in different contexts

> 異なるコンテキストにおける `this` の違いを説明してください

### 1. グローバル環境における `this`

```javascript
console.log(this); // ブラウザ：window、Node.js：global

function globalFunction() {
  console.log(this); // 非strictモード：window/global、strictモード：undefined
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

### 2. 通常の関数（Function）における `this`

通常の関数の `this` は**呼び出し方**によって決まります：

```javascript
function regularFunction() {
  console.log(this);
}

// 直接呼び出し：this はグローバルオブジェクト（非strictモード）または undefined（strictモード）を指す
regularFunction(); // window (非strictモード) または undefined (strictモード)

// オブジェクトメソッドとして呼び出し：this はそのオブジェクトを指す
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// call/apply/bind を使用：this は指定されたオブジェクトを指す
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. アロー関数（Arrow Function）における `this`

**アロー関数は独自の `this` を持ちません**。**外側のスコープの `this` を継承します**（レキシカルスコープ）。

```javascript
const obj = {
  name: 'Object',

  // 通常の関数
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // 内部の通常の関数：this が変わる
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // 内部のアロー関数：this は外側から継承
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // アロー関数
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window（グローバルを継承）
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. オブジェクトメソッドにおける `this`

```javascript
const person = {
  name: 'John',
  age: 30,

  // 通常の関数：this は person を指す
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // ES6 省略メソッド：this は person を指す
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // アロー関数：this は外側（ここではグローバル）を継承
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm undefined"
  },
};

person.greet(); // "Hello, I'm John"
person.introduce(); // "I'm John, 30 years old"
person.arrowGreet(); // "Hello, I'm undefined"
```

### 5. コンストラクタ関数における `this`

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

### 6. Class における `this`

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // 通常のメソッド：this はインスタンスを指す
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // アロー関数プロパティ：this はインスタンスにバインドされる
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// メソッドを変数に代入すると this バインディングが失われる
const greet = john.greet;
greet(); // エラー：Cannot read property 'name' of undefined

// アロー関数プロパティは this バインディングを失わない
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> クイズ：以下のコードは何を出力しますか？

### 問題 1：オブジェクトメソッドとアロー関数

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
<summary>クリックして答えを見る</summary>

```javascript
// A: Object
// B: undefined
```

**解説**：
- `regularFunc` は通常の関数で、`obj.regularFunc()` として呼び出されるため、`this` は `obj` を指し、`"A: Object"` が出力されます
- `arrowFunc` はアロー関数で、独自の `this` を持たず、外側（グローバル）の `this` を継承します。グローバルに `name` プロパティがないため、`"B: undefined"` が出力されます

</details>

### 問題 2：関数を引数として渡す

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
<summary>クリックして答えを見る</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" またはエラー（strictモード）
// 3: "Hello, undefined" またはエラー（strictモード）
```

**解説**：
1. `person.greet()` - オブジェクト経由で呼び出すため、`this` は `person` を指す
2. `greet()` - メソッドを変数に代入して直接呼び出すと、`this` が失われ、グローバルまたは `undefined` を指す
3. `setTimeout(person.greet, 1000)` - メソッドがコールバック関数として渡されるため、`this` が失われる

</details>

### 問題 3：ネストされた関数

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
<summary>クリックして答えを見る</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**解説**：
- `A` - `method` は `obj` 経由で呼び出されるため、`this` は `obj` を指す
- `B` - `inner` は通常の関数で、直接呼び出されるため、`this` はグローバルまたは `undefined` を指す
- `C` - `arrow` はアロー関数で、外側の `method` の `this` を継承し、`obj` を指す

</details>

### 問題 4：setTimeout とアロー関数

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
<summary>クリックして答えを見る</summary>

```javascript
// A: undefined
// B: Object
```

**解説**：
- `A` - `setTimeout` のコールバックは通常の関数で、実行時に `this` はグローバルを指す
- `B` - `setTimeout` のコールバックはアロー関数で、外側の `method2` の `this` を継承し、`obj` を指す

</details>

### 問題 5：複雑な this バインディング

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
console.log('B:', getThis() === window); // ブラウザ環境を想定

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>クリックして答えを見る</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**解説**：
- `A` - `obj1` 経由で呼び出すため、`this` は `obj1` を指す
- `B` - 直接呼び出すため、`this` はグローバル（window）を指す
- `C` - `obj2` 経由で呼び出すため、`this` は `obj2` を指す
- `D` - `bind` を使用して `this` を `obj2` にバインド

</details>

### 問題 6：コンストラクタ関数とプロトタイプ

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
<summary>クリックして答えを見る</summary>

```javascript
// A: undefined
// B: John
```

**解説**：
- `A` - `setTimeout` の通常の関数コールバックで、`this` はグローバルを指す
- `B` - `setTimeout` のアロー関数コールバックで、外側の `arrowDelayedGreet` の `this` を継承し、`john` を指す

</details>

### 問題 7：グローバル変数 vs オブジェクトプロパティ

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
<summary>クリックして答えを見る</summary>

```javascript
// undefined
```

**解説**：

この問題の鍵は、**グローバル変数**と**オブジェクトプロパティ**の違いを理解することです：

1. **`obj.a()` の `this` の指す先**：
   - `obj.a()` として呼び出すため、`this` は `obj` を指す

2. **`name = 'john'` はグローバル変数を変更する**：
   ```javascript
   name = 'john'; // var/let/const なし、グローバル name を変更
   // 以下と同等
   window.name = 'john'; // ブラウザ環境
   ```

3. **`this.name` はオブジェクトプロパティにアクセスする**：
   ```javascript
   console.log(this.name); // console.log(obj.name) と同等
   ```

4. **`obj` オブジェクトには `name` プロパティがない**：
   ```javascript
   obj.name; // undefined（obj オブジェクト内に name が定義されていない）
   ```

**完全な実行過程**：

```javascript
// 初期状態
window.name = 'jjjj'; // グローバル変数
obj = {
  a: function () { /* ... */ },
  // 注意：obj には name プロパティがない！
};

// obj.a() を実行
obj.a();
  ↓
// 1. name = 'john' → グローバル window.name を変更
window.name = 'john'; // ✅ グローバル変数が変更された

// 2. this.name → obj.name にアクセス
this.name; // obj.name と同じ
obj.name; // undefined（obj に name プロパティがない）
```

**よくある誤解**：

多くの人が `'john'` が出力されると思いますが、それは：
- ❌ `name = 'john'` が `obj` にプロパティを追加すると誤解している
- ❌ `this.name` がグローバル変数にアクセスすると誤解している

**正しい理解**：
- ✅ `name = 'john'` はグローバル変数のみを変更し、`obj` には影響しない
- ✅ `this.name` がアクセスするのは `obj.name` であり、グローバルの `name` ではない

**`'john'` を出力するには、次のように書くべきです**：

```javascript
var obj = {
  a: function () {
    this.name = 'john'; // ✅ obj に name プロパティを追加
    console.log(this.name); // 'john'
  },
};

obj.a(); // 'john' を出力
console.log(obj.name); // 'john'
```

</details>

### 問題 8：グローバル変数の罠（応用）

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified'; // 注意：var/let/const なし
    console.log('1:', name); // グローバル変数にアクセス
    console.log('2:', this.name); // オブジェクトプロパティにアクセス
  },
};

obj.a();
console.log('3:', name); // グローバル変数
console.log('4:', obj.name); // オブジェクトプロパティ
```

<details>
<summary>クリックして答えを見る</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**解説**：

```javascript
// 初期状態
window.name = 'global'; // グローバル変数
obj.name = 'object'; // オブジェクトプロパティ

// obj.a() を実行
name = 'modified'; // グローバル window.name を変更

console.log('1:', name); // グローバルにアクセス：'modified'
console.log('2:', this.name); // obj.name にアクセス：'object'

// 実行完了後
console.log('3:', name); // グローバル：'modified'
console.log('4:', obj.name); // オブジェクト：'object'（変更されていない）
```

**キーコンセプト**：
- `name`（`this.` なし）→ グローバル変数にアクセス
- `this.name`（`this.` あり）→ オブジェクトプロパティにアクセス
- この2つは**まったく異なる変数**です！

</details>

## 4. How to preserve `this` in callbacks?

> コールバック関数で `this` を保持するには？

### 方法 1：アロー関数を使用する

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ アロー関数は外側の this を継承する
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### 方法 2：`bind()` を使用する

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ bind で this をバインド
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

### 方法 3：`this` を変数に保存する（古い方法）

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ this を変数に保存
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### 方法 4：`call()` または `apply()` を使用する

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

> よくある `this` の落とし穴

### 落とし穴 1：オブジェクトメソッドを変数に代入

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ undefined（this が失われる）

// 解決方法：bind を使用
const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### 落とし穴 2：イベントリスナーにおける `this`

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ アロー関数：this は button を指さない
  handleClick1: () => {
    console.log(this); // window
  },

  // ✅ 通常の関数：this はイベントをトリガーした要素を指す
  handleClick2: function () {
    console.log(this); // button 要素
  },

  // ✅ オブジェクトの this にアクセスする必要がある場合、アロー関数でラップ
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### 落とし穴 3：配列メソッドのコールバック

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ 通常の関数コールバックは this を失う
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // undefined 1, undefined 2, undefined 3
    });
  },

  // ✅ アロー関数コールバックは this を保持する
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    });
  },

  // ✅ forEach の thisArg パラメータを使用
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    }, this); // 第2引数で this を指定
  },
};
```

## 6. `this` binding rules summary

> `this` バインディングルールのまとめ

### 優先度（高い順）

```javascript
// 1. new バインディング（最高優先度）
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. 明示的バインディング（call/apply/bind）
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. 暗黙的バインディング（オブジェクトメソッド）
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. デフォルトバインディング（最低優先度）
greet(); // undefined（strictモード）または window.name
```

### Function vs Arrow Function 比較表

| 特性 | Function | Arrow Function |
| --- | --- | --- |
| 独自の `this` を持つ | ✅ はい | ❌ いいえ |
| `this` の決定要因 | 呼び出し方 | 定義位置（レキシカルスコープ）|
| `call`/`apply`/`bind` で `this` を変更可能 | ✅ 可能 | ❌ 不可能 |
| コンストラクタとして使用可能 | ✅ 可能 | ❌ 不可能 |
| `arguments` オブジェクトを持つ | ✅ はい | ❌ いいえ |
| 適した場面 | オブジェクトメソッド、コンストラクタ | コールバック関数、外側の this 継承が必要な場面 |

### 覚え方

> **「アロー関数は継承、通常の関数は呼び出し」**
>
> - **アロー関数**：`this` は外側のスコープから継承され、定義時に決定される
> - **通常の関数**：`this` は呼び出し方によって決まり、実行時に決定される

## 7. Best practices

> ベストプラクティス

### ✅ 推奨される方法

```javascript
// 1. オブジェクトメソッドには通常の関数または ES6 メソッド省略記法を使用
const obj = {
  name: 'Object',

  // ✅ 良い：通常の関数
  greet: function () {
    console.log(this.name);
  },

  // ✅ 良い：ES6 省略記法
  introduce() {
    console.log(this.name);
  },
};

// 2. コールバック関数にはアロー関数を使用
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    // ✅ 良い：アロー関数は this を保持する
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. 動的な this が必要な場合は通常の関数を使用
const button = {
  label: 'Click me',

  // ✅ 良い：DOM 要素の this にアクセスする必要がある
  handleClick: function () {
    console.log(this); // button DOM 要素
  },
};
```

### ❌ 推奨されない方法

```javascript
// 1. オブジェクトメソッドにアロー関数を使用しない
const obj = {
  name: 'Object',

  // ❌ 悪い：this が obj を指さない
  greet: () => {
    console.log(this.name); // undefined
  },
};

// 2. コンストラクタにアロー関数を使用しない
// ❌ 悪い：アロー関数はコンストラクタとして使用できない
const Person = (name) => {
  this.name = name; // エラー！
};

// 3. arguments にアクセスする必要がある場合、アロー関数を使用しない
// ❌ 悪い：アロー関数には arguments がない
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
