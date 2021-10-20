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

## Self Modules

Sometimes, I want to create module for project use, but if there are need more than one module, how should I deal with that?

Build `player` folder and three file. Use index.js control folder index, and other js file will import to index.js.

```bash
mkdir player

cd player

touch index.js player1.js player2.js
```

```javascript
// player1.js
function barbarian(name) {
  console.log(`Hello Barbarin : ${name}`);
}
exports.barbarian = barbarian;

// player2.js
function witchDoctor(name) {
  console.log(`Hello Witch Doctor : ${name}`);
}
exports.witchDoctor = witchDoctor;

// index.js
const player1 = require('./player1');
const player2 = require('./player2');

exports.barbarian = player1.barbarian;
exports.witchDoctor = player2.witchDoctor;
```

Switch to `app.js`, import `player` folder, now can use all function in the `player` folder.

```javascript
// app.js
const player = require('./player');

player.barbarian('Mario');
player.witchDoctor('Paul');
```
