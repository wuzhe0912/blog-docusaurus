---
id: arrow-function
title: '📜 Arrow Function'
slug: /arrow-function
---

> _The palest ink is better than the best memory._

## Comparison the old and new methods of writing

Reduce `ES5` function writing, to make it more concise and convenient.

`ES5` function is writing as follows :

```html
<!-- html -->
<div class="click1">click1</div>
```

```javascript
// js
document.querySelector('.click1').addEventListener('click', function () {
  console.log('click1');
});
```

Arrow function :

```html
<!-- html -->
<div class="click2">click2</div>
```

```javascript
// js
document.querySelector('.click2').addEventListener('click', () => {
  console.log('click2');
});
```

Can be seen, change `function()` to `() =>`.

## this

In `ES5` function, `this` will direct to `DOM` element itself :

```javascript
document.querySelector('.click1').addEventListener('click', function () {
  console.log(this); // print HTML tag
});
```

But, in `Arrow function`, `this` direct will back to the previous level, enter the global environment. It can also be understood as not having `this`.

```javascript
document.querySelector('.click2').addEventListener('click', () => {
  console.log(this); // print window object
});
```

Therefore, if I wanted to find `DOM` element, need pass by parameter.

```javascript
document.querySelector('.click2').addEventListener('click', (e) => {
  console.log(e.target); // print HTML tag
});
```

## Designated Variable

If designated variable to function, can also be written as `arrow function`.

```javascript
// Notice, declare variable is require.
const plus = () => {
  console.log('test');
};
plus();
```

Pass by parameter :

```javascript
const plus = (val, subVal) => {
  return val + subVal;
};
console.log(plus(4, 14)); // print 18
```

If `return` is only one line, it can also be abbreviated with :

```javascript
const plus = (val, subVal) => val + subVal;
console.log(plus(2, 8)); // print 10
```
