---
id: 02-let-const
title: 'ð Let & Const'
slug: /let-const
---

éæ¼è®æ¸ä½ç¨åçå·®ç°ã

## var

å¨ ES6 ä¹åï¼éå¾çè®æ¸å®£åæ¹å¼ï¼æ¡ç¨ `var`ï¼ä½å¶æ¬èº«å®¹ææ±¡æå¨åç°å¢ã

- example 1:

```js
if (true) {
  var name = 'Pitt';
}
console.log(name); // å°åº Pitt
```

- example 2:

```js
var array = [2, 4, 6];
if (true) {
  var array = [2];
}
console.log(array); // å°åº [2]
```

æ¿åé¢çæ¡ä¾ï¼å¯ä»¥çå° `var` å®£åçè®æ¸ï¼è¡åºå¤æ·å¼ççç·ï¼æ±¡æäºå¤é¢çè®æ¸ã

## let

èä¹ç¸åï¼ç¶æä½¿ç¨äº `let`ï¼åæè®æå¦ä¸ï¼

- example 1:

```js
if (true) {
  let name = 'Pitt';
}
console.log(name); // å°åº name is not defined
```

- example 2:

```js
let array = [2, 4, 6];
if (true) {
  let array = [2];
}
console.log(array); // å°åº [2, 4, 6]
```

å¤æ·å¼å§çè®æ¸ï¼åå¨ç¶ä¸­ä½ç¨ï¼èä¸æå³å°å¤é¢é²è¡æ±¡æã

## const

å `let` ç¸åï¼é½æåå° `function` çä¾·éä½ç¨ï¼ä½ä¸åæ¼ `let`ï¼ä¸ç¶å®£åå³ä¸å¾è®æ´ã

- example:

```js
if (true) {
  const text = 'game';
  text = 'new game';
  console.log(text); // error Assignment to constant variable.
}
```

## åå¥ç¹æ§

éç¶å¨ `JS` ä¸­ï¼`array`ã`object` å©ååå¥ï¼å¨ `const` çå®£åä¸ï¼ä¸æ¨£ä¸å¯æ¹è®å¶æ¬è³ªï¼

- exampleï¼

```js
const a = { player: 'Pitt' };
a = 'Yuki';
console.log(a); // error Assignment to constant variable.
```

ä½å»å¯ä»¥å¡«åè³æé²å¥éå©ç¨®åå¥ï¼

- example 1ï¼

```js
const a = { player: 'Pitt' };
a.newPlayer = 'Kuki';
console.log(a); // { player: "Pitt", newPlayer: "Kuki" }
```

- example 2ï¼

```js
const b = [1, 2, 3];
b.push(4);
console.log(b); // [1, 2, 3, 4]
```
