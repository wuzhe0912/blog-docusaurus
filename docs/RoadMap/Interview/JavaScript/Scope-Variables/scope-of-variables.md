---
id: scope-of-variables
title: '☕ Scope of Variables'
slug: /scope-of-variables
---

### What’s the difference between var, let, const ?

在理解變數作用域之前，需要先知道目前 JS 宣告變數的方式

- `var` : 在 es6 之前宣告變數的方法。
- `let` : 和 var 頗為類似，差別在於作用範圍，var 僅被侷限在 function，在 if loop 外仍會汙染 global 環境。而 let 則被限縮於 block scope。
- `const` : 作為常數宣告使用，強制必須指定值，而且無法被重新賦值。

為了理解上面這段解釋，透過下面的 code 來查看 :

```javascript
// function scope

function checkScope() {
  var a = 10;
}
if (true) {
  var b = 20;
}

console.log(a); // print a is not defined
console.log(b); // print 20
```

```javascript
// block scope

function checkScope() {
  const a = 10;
}
if (true) {
  const b = 20;
}

console.log(a); // print a is not defined
console.log(b); // print b is not defined
```

顯然，當使用 var 來做變數宣告時，會衝出判斷式的界線，導致汙染變數的問題，反之，let and const 則沒有這個問題，因此目前開發建議僅採用 let or const。

### About `const`

在前面有提到，當使用 const 宣告的常數，雖然無法被重新賦值。但在`object` 和 `array` 中，仍可以額外塞入資料。

```javascript
const a = { player: 'Pitt' };
a.newPlayer = 'Kuki';
console.log(a); // { player: "Pitt", newPlayer: "Kuki" }
```

```javascript
const b = [1, 2, 3];
b.push(4);
console.log(b); // [1, 2, 3, 4]
```
