---
id: ts-setting-environment
title: 'Setting Environment'
slug: /ts-setting-environment
---

## Init Project

> Require Node.js environment, I use node version v16.4.2, npm version v7.18.1.

Build package.json.

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

```js
 ┣ 📂src
 ┃ ┗ 📜index.js
 ┣ 📜.gitignore
 ┣ 📜package.json
 ┗ 📜webpack.config.js
```

## Setting

Use node.js path api to generate dist in output bundle and setting entry file.

```js
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

writing something

```js
// src/index.js

console.log('test webpack');
```

Setting scripts

```js
// package.json
{
  "scripts": {
    "build": "webpack"
  },
}
```

ok, you cna run `npm run build`, and you will see the dist folder is auto generated. And include `main.bundle.js`.

## DevServer

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

In `webpack.config.js` you can pass through the `devServer` setting parameter.

```js
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

And open browser inspect, you can see page is print `test webpack`.

## css-loader

Webpack can only read javascript, if you want to read css or other syntax, must rely on plugins.

install plugins

```bash
npm install css-loader style-loader -D
```

setting webpack.config.js

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

touch file and test style.

```bash
mkdir styles

cd  styles

touch index.css
```

`index.css`

```css
body {
  background: blue;
}
```

`index.js`

```js
import './styles/index.css';
```

restart `npm run dev` , can see page background is blue.

## Hash name

I will add `[hash]` in output, because need every `npm run build` can generate a hash name js file, avoid browser cache same file name, Cause client-side page is not update.

```js
module.exports = {
  output: {
    // ...
    filename: 'js/[name].[hash].bundle.js',
  },
};
```

## HtmlWebpackPlugin

Because everytime bundle js file name is different, we can't manually setting html file's src path. Must rely on plugin auto generate html file.

```bash
npm install html-webpack-plugin -D
```

Delete dist folder and return root directory, mkdir index.html and create content.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./styles/index.css" />
    <title>Document</title>
  </head>
  <body>
    <div class="app">This App Page</div>
  </body>
</html>
```

setting html-webpack-plugin

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
```

test `npm run build` you can see the dist folder will auto generated HTML, JS file.

## MiniCssExtractPlugin

`style-loader` will generate Inline Styles, I hope change to External Style Sheet.

```bash
npm install mini-css-extract-plugin -D
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
```

## CleanWebpackPlugin

After using hash, the file name generated will be different each time. After long time, much invalid files will appear in the dist folder. Here you can use plugin to automatically clear before each build.

```bash
npm install clean-webpack-plugin -D
```

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```

## Babel

If you want to use ES6+ syntax, sometime browser maybe can't support, so use babel plugin can help you compiler into to ES5.

For example, when you write `const a = 10;`, `const` will compiler to `var`.

```bash
npm install babel-loader @babel/core @babel/preset-env -D

touch babel.config.json
```

```js
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
```

setting babel.config.json

```json
{
  "presets": ["@babel/preset-env"]
}
```

## source map

The compiled file is difficult to read. If it runs normally before compilation, but an error occurs after compilation, then you need the source-map to view the source code.

```js
module.exports = {
  devtool: 'source-map',
};
```

## Asset Modules

Similarly, webpack cannot directly read files such as images, and these files are collectively classified into Assets and used through settings.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
```

## Support TypeScript

I hope this project can support TypeScript, so need install and setting typescript plugin.

```bash
npm install typescript ts-loader -D
```

change `index.js -> index.ts` and writing somthing.

```typescript
// index.ts

const target: string = 'Hello TypeScript';
console.log(target);
```

Webpack default it will look for files with the extension `.js` file, and the rule of TypeScript requires not to write the extension when importing file.

Between the two will conflict, so need to change the default search extension file in the resolve. The first pick for TypeScript.

In the rules, need to add node_modules to exclude is to avoid affecting. After all, not every plugin uses Typescript.

```js
module.exports = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      // ...
      {
        test: /\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
};
```

Finally, `mkdir tsconfig.json`, this file can write rules about TypeScript.

```json
{
  "compilerOptions": {
    "module": "ES6",
    "target": "ES5"
  }
}
```

Now, `npm run dev`, the content of `index.ts` printed in browser normally.
