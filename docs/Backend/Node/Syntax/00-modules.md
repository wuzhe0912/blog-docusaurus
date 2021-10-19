---
id: 00-modules
title: Modules
slug: /modules
---

> _My child, I watched with pride as you grew into a weapon of righteousness._

## Hello Node.js

Create a folder name is Demo, and include html, js file, and use `VSCode` open.

```bash
mkdir demo

cd demo

touch index.html app.js

code .
```

Switch to `app.js` writing something like this :

```javascript
const app = 'Hello Node.js';

console.log(app);
```

Open terminal and run command like this :

```bash
node app.js
```

We can see terminal print `Hello Node.js`, this is most basic use node.js run js file.

Now, try to run loop.

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
};
```

Run `node app.js`，now except print `Hello Node.js`，and seen number `0~4` is printed in order.

## filename and dirname

node.js api provide `__filename` to check current file position. And `__dirname` can check folder position.

Notice, these can't run in browser, terminal only.

```javascript
console.log(__filename);
console.log(__dirname);
```

```bash
node app.js
```
