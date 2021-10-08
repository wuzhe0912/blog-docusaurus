---
id: 0-node-grammar
description: Node 基本語法 API
slug: /node-grammar
---

# Grammar

## Hello Node.js

建立一個 `Demo` 的 `folder`，並預先寫入一些基本的 `file`，使用 `vscode` 打開。

```bash
mkdir demo

cd demo

touch index.html app.js styles.css

code .
```

切到 `app.js` 試寫入以下內容:

```javascript
const app = 'Hello Node.js';

console.log(app);
```

打開 `terminal`，執行以下指令:

```bash
node app.js
```

我們可以看到終端機會印出 `Hello Node.js`，這就是最基本的使用 `node` 來運行 `js` 檔案。

再來我們嘗試套入迴圈:

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
};
```

同樣執行 `node app.js`，除了剛剛 `Hello Node.js`，還能看到數字 `0~4` 被依序印出來。

## __filename

```javascript
console.log(__filename);
```