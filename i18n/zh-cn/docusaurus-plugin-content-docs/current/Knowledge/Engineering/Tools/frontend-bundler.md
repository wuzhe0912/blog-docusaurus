---
id: frontend-bundler
title: Bundler
slug: /frontend-bundler
---

## Why is a bundler necessary for front-end development? What is its primary function?

> 为什么前端开发需要 bundler？它主要的作用是什么？

### module & plugin management

过去在没有前端打包工具前，我们会使用 CDN 或 `<script>` 标签来加载我们的文件（可能包含 js, css, html），但这样的做法除了性能上的浪费（http 可能需要请求多次），同时也容易出现因为顺序上的差异，导致错误频发或是难以排查。而 bundler 会协助开发者将多个文件合并为单一或少数几个文件，这种模块化的管理，除了让开发上更易维护外，同时在未来的扩展上也更加方便。另一方面，因为文件的合并也同时减少 http 的请求次数，自然也提升性能。

### translation & compatibility

浏览器厂商在实现上，不太可能完全跟上新语法的发布，而新旧语法的差异可能会导致实现上的错误，为了更好兼容两者的差异，我们需要通过 bundler 来将新语法转换为旧语法，以确保代码能够正常运行。典型的案例就是 babel 会将 ES6+ 的语法转换为 ES5 的语法。

### Resource Optimization

为了有效减轻项目本身的体积，提升性能优化，通过设置 bundler 进行处理是目前主流的做法：

- Minification（最小化, 丑化）：压缩 JavaScript、CSS 和 HTML 代码，删除不必要的空格、注释和缩进，以减少文件大小（毕竟是给机器阅读而非给人阅读）。
- Tree Shaking：去除未被使用或无法访问的代码，进一步减少 bundle 的大小。
- Code Splitting：将代码分割成多个小块（chunks）实现按需加载，尽可能提升页面加载速度。
- Lazy Loading：延迟加载，当用户需要时才加载，减少初始加载时间（同样都是为了用户体验）。
- 长期 caching：将 bundle 的内容 hash 化，并将其加入文件名中，这样只要 bundle 的内容没有改变，就可以永久使用浏览器缓存，减少请求次数。同时也能达到每次上线时，只变动有变化的文件，而不是全部重新加载。

### Deploy Environment

在实际的部署上，会拆分开发、测试、正式等环境，为了确保行为是一致的，通常会通过 bundler 来进行设置，促使在对应的环境下，能够正确的加载。
