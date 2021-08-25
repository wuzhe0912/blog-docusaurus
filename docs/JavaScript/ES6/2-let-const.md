---
id: 2-let-const
description: 關於變數作用域
slug: /let-const
---

# let & const (變數作用域)

> 關於變數作用域。

## var

在 ES6 之前，過往的變數宣告方式，採用 `var`，但其本身容易污染全域環境。

- example 1:

```javascript
if (true) {
  var name = 'Pitt';
}
console.log(name); // 印出 Pitt
```

- example 2:

```javascript
var array = [2, 4, 6];
if (true) {
  var array = [2];
}
console.log(array); // 印出 [2]
```

承前面的案例，可以看到 `var` 宣告的變數，衝出判斷式的界線，污染了外面的變數。

## let

與之相反，當我使用了 `let`，則會變成如下：

- example 1:

```javascript
if (true) {
  let name = 'Pitt';
}
console.log(name); // 印出 name is not defined
```

- example 2:

```javascript
let array = [2, 4, 6];
if (true) {
  let array = [2];
}
console.log(array); // 印出 [2, 4, 6]
```

判斷式內的變數，僅在當中作用，而不會傳到外面進行污染。

## const

和 `let` 相同，都會受到 `function` 的侷限作用，但不同於 `let`，一經宣告即不得變更。

- example:

```javascript
if (true) {
  const text = 'game';
  text = 'new game';
  console.log(text); // error Assignment to constant variable.
}
```

## 型別特性

雖然在 `JS` 中，`array`、`object` 兩個型別，在 `const` 的宣告下，一樣不可改變其本質：

- example：

```javascript
const a = { player: 'Pitt' };
a = 'Yuki';
console.log(a); // error Assignment to constant variable.
```

但卻可以填充資料進入這兩種型別：

- example 1：

```javascript
const a = { player: 'Pitt' };
a.newPlayer = 'Kuki';
console.log(a); // { player: "Pitt", newPlayer: "Kuki" }
```

- example 2：

```javascript
const b = [1, 2, 3];
b.push(4);
console.log(b); // [1, 2, 3, 4]
```
