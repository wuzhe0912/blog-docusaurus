---
id: 00-setting-environment
title: '📹 Setting Environment'
slug: /setting-environment
---

## Init Project

> Require Node.js environment, I use node version v16.4.2, npm version v7.18.1.

Build package.json

```bash
cd project-name

npm init -y
```

Install webpack & webpack-cli in devDependencies, there not install global, avoid polluting other project webpack version.

```bash
npm install webpack webpack-cli -D
```

```bash
mkdir src

touch src/index.js webpack.config.js
```

Now you can see the structure as follows.

```javascript
 ┣ 📂src
 ┃ ┗ 📜index.js
 ┣ 📜.gitignore
 ┣ 📜package.json
 ┗ 📜webpack.config.js
```

## Setting

Use node.js path api to generate dist in output bundle and setting entry file.

```javascript
// webpack.config.js

const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.bundle.js',
  },
};
```

Writting something.

```javascript
// src/index.js

console.log('test webpack');
```

Setting scripts.

```javascript
// package.json
{
  "scripts": {
    "build": "webpack"
  },
}
```

ok, you cna run `npm run build`, and you will see the dist folder is auto generated. And include `main.bundle.js`.

## webpack dev server

When we development, need server to running in browser, so we install `webpack-dev-server` plugin.

```bash
npm install webpack-dev-server -D
```

`touch index.html` in dist folder.

And content is follows as:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=\, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./main.bundle.js"></script>
  </body>
</html>
```

In `webpack.config.js`, you can pass through the `devServer` setting parameter.

```javascript
module.exports = {
  mode: 'development',
  // ...
  devServer: {
    static: path.join(__dirname, 'dist'), // root
    open: true, // auto open browsers
    compress: true,
    port: 3002,
  },
};
```

Of the above, when `npm run dev`, your project can auto caught dist folder, open in browser port 3002. Because default have hotreload effect, so you don't need to manually setting.
