---
id: variable-scope
title: '📜 Variable and Scope'
slug: /variable-scope
---

## var, let, const

在理解變數作用域之前，需要先知道目前 JS 宣告變數的方式

`var` : 在 es6 之前宣告變數的方法。
`let` : 和 var 頗為類似，差別在於作用範圍，var 僅被侷限在 function，在 if loop 外仍會汙染 global 環境。而 let 則被限縮於 block scope。
`const` : 作為常數宣告使用，強制必須指定值，而且無法被重新賦值。

為了理解上面這段解釋，透過下面的 code 來查看 :

```javascript
// function scope
```
