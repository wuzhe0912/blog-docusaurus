---
id: web-browsing-process
title: 📄 网页浏览流程
slug: /web-browsing-process
---

## 1. Please explain how the browser obtains HTML from the server and how the browser renders the HTML on the screen

> 请说明浏览器如何从 server 端取得 HTML，并如何在浏览器上渲染 HTML

### 1. 发起请求

- **网址输入**：用户在浏览器上输入网址，或是点击一个链接，浏览器会开始解析这串 URL，确认要向哪个服务器发起请求。
- **DNS 查找**：浏览器开始执行查找 DNS，以及对应的服务器 IP 地址。
- **建立连接**：浏览器通过互联网使用 HTTP 或 HTTPS 协议，向服务器的 IP 地址发出请求，同时如果是 HTTPS 协议，还需要进行 SSL/TLS 连接。

### 2. Server 端响应

- **处理请求**：服务器接收到请求后，会根据请求的路径与参数，从数据库中读取对应的数据。
- **发送 Response**：接着会将 HTML 文件作为 HTTP Response 的一部分发送回浏览器，Response 本身还会包含诸如状态码或其他参数(cors, content-type)等。

### 3. 解析 HTML

- **构建 DOM Tree**：浏览器开始读取 HTML 文件，并根据 HTML 文件的标签与属性，转换成 DOM 并开始在内存中构建 DOM Tree。
- **requesting subresources(请求子资源)**：解析 HTML 文件时，如果遇到外部资源，例如 CSS、JavaScript、图片等，浏览器会进一步向服务器发起请求，获取这些资料。

### 4. Render Page(渲染页面)

- **构建 CSSOM Tree**：浏览器开始解析 CSS 文件，构建 CSSOM Tree。
- **Render Tree**：浏览器将 DOM Tree 和 CSSOM Tree 合并成一个 Render Tree，包含所有要渲染的节点与对应样式。
- **Layout(布局)**：浏览器开始进行版面设定(Layout 或 Reflow)，计算每个节点的位置与大小。
- **Paint(绘制)**：最后浏览器经过绘制(painting)阶段，将每个节点的内容画到页面上。

### 5. JavaScript 交互

- **执行 JavaScript**：如果 HTML 中包含有 JavaScript，则浏览器会解析并执行，这个动作可能会改变 DOM 和修改样式。

整个流程上是一种渐进的状态，理论上，用户会先看到部分网页内容，最后才看到完整的网页，这个过程中，可能会触发多次回流与重绘，尤其是网页本身包含复杂的样式或是交互效果尤为明显。这时除了浏览器本身执行的优化外，开发者通常也会尽可能采用一些手段，让使用体验更为平滑。

## 2. Please describe Reflow and Repaint

### Reflow(回流/重排)

泛指网页中的 DOM 产生变化，导致浏览器需要重新计算元素的位置，将其摆放到正确位置，比较白话来说，就是 Layout 要重新产生排列元素。

#### 触发 Reflow

回流存在两种情境，一种是全局整个页面都出现变化，另一，则是部分 component 区块产生变化。

- 初始进入页面时，是影响最大的一次回流
- 添加或删除 DOM 元素。
- 针对元素改变它的尺寸大小，譬如内文增加，或是文字大小变化等等。
- 元素的排版方式调整，譬如通过 margin 或 padding 来调整移动。
- 浏览器本身的视窗大小出现变化。
- 触发伪类，例如 hover 效果。

### Repaint(重绘)

没有改变 Layout，单纯更新或改变元素，因为元素本身是内含在 Layout 中，所以如果触发回流必然会导致重绘，反之，仅触发重绘则不一定会回流。

#### 触发 Repaint

- 改变元素的颜色或背景，譬如添加 color 或是调整 background 的属性等等。
- 改变元素的阴影或是 border 也属于重绘。

### 如何优化 Reflow 或 Repaint

- 不要使用 table 排版，table 的属性容易因为改动属性，而导致排版会重新排列，若不得已需要使用的话，建议添加以下属性，使其每次仅渲染一行，避免影响整个表单范围，例如 `table-layout: auto;` or `table-layout: fixed;`。
- 不应该操作 DOM 去逐一调整样式，而是应该将需要改变的样式通过 class 定义好之后，再通过 JS 进行切换。
  - 以 Vue 框架为例，可以用绑定 class 的方式来切换样式，而不是用 function 来直接修改样式。
- 如果是一个需要频繁切换的场景，譬如 tab 切换，应该优先考虑使用 `v-show` 而非 `v-if`，前者仅使用 css 的 `display: none;` 属性来做隐藏，而后者却会触发生命周期，重新创建或销毁元素，自然会有更大的性能消耗。
- 如果真的不得已需要触发回流，可以通过 `requestAnimationFrame` 来进行优化(主要是因为这个 api 有针对动画来设计，可以和浏览器绘制的帧数同步)，这样可以将多次回流合并成一次，减少重绘的次数。
  - 譬如某个动画，需要在页面上向目标移动，这边就可以通过 `requestAnimationFrame` 来计算每一次移动。
  - 同样的，CSS3 的部分属性，可以触发 client 端的硬件加速，可以提升动画的效能，例如 `transform` `opacity` `filters` `Will-change`。
- 如果条件允许，尽可能在较低层级的 DOM 节点上来改动样式，避免因为触发父元素样式变动，导致其下所有子元素全部被影响。
- 如果需要执行动画，可以在绝对定位的元素 `absolute` , `fixed` 上使用，这样对其他元素影响不大，仅会触发重绘，可以避免回流。

### Example

```js
// bad
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// good
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Reference

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)

## 3. Please describe when will the browser send the options to the server

> 请说明浏览器何时会向 server 端发送 options

多数情况下，是应用在 CORS 场景，在实际送出请求之前，会先有一个 preflight(预检) 的动作，浏览器会先发送一个 OPTIONS 请求，询问 server 是否允许这个跨域请求，如果 server 回应允许，浏览器才会发送真正的请求，反之，如果不允许，则浏览器跳出 error。

另外，假如请求的 method 不是 `GET`, `HEAD`, `POST` 也会触发 OPTIONS 请求。
