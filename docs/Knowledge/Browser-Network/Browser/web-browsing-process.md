---
id: web-browsing-process
title: 📄 Web Browsing Process
slug: /web-browsing-process
---

## 1. Please explain how the browser obtains HTML from the server and how the browser renders the HTML on the screen

> Explain how the browser fetches HTML from the server and renders it on the screen.

### 1. Initiating the Request

- **URL Input**: When a user enters a URL in the browser or clicks a link, the browser begins parsing the URL to determine which server to send the request to.
- **DNS Lookup**: The browser performs a DNS lookup to resolve the corresponding server IP address.
- **Establishing a Connection**: The browser sends a request to the server's IP address over the internet using the HTTP or HTTPS protocol. If it's HTTPS, an SSL/TLS connection must also be established.

### 2. Server Response

- **Processing the Request**: After receiving the request, the server reads the corresponding data from the database based on the request path and parameters.
- **Sending the Response**: The server then sends the HTML document as part of the HTTP response back to the browser. The response also includes information such as status codes and other parameters (CORS, content-type, etc.).

### 3. Parsing HTML

- **Building the DOM Tree**: The browser reads the HTML document and converts it into DOM nodes based on HTML tags and attributes, building the DOM Tree in memory.
- **Requesting Subresources**: While parsing the HTML, if the browser encounters external resources such as CSS, JavaScript, or images, it sends additional requests to the server to fetch those resources.

### 4. Rendering the Page

- **Building the CSSOM Tree**: The browser parses CSS files to construct the CSSOM Tree.
- **Render Tree**: The browser merges the DOM Tree and CSSOM Tree into a Render Tree, which contains all visible nodes and their corresponding styles.
- **Layout**: The browser performs layout (also called Reflow), calculating the position and size of each node.
- **Paint**: Finally, the browser goes through the painting stage, drawing each node's content onto the page.

### 5. JavaScript Interaction

- **Executing JavaScript**: If the HTML contains JavaScript, the browser parses and executes it. This may modify the DOM and update styles.

The entire process is progressive in nature. In theory, users will first see partial page content before the complete page loads. During this process, multiple reflows and repaints may be triggered, especially when the page contains complex styles or interactive effects. In addition to the browser's own optimizations, developers typically employ various techniques to make the user experience smoother.

## 2. Please describe Reflow and Repaint

### Reflow

Reflow refers to changes in the DOM of a web page that cause the browser to recalculate element positions and place them in the correct locations. In simpler terms, the layout needs to be regenerated to rearrange elements.

#### Triggering Reflow

Reflow occurs in two scenarios: one is a global change affecting the entire page, and the other is a partial change affecting specific component areas.

- The initial page load is the most significant reflow.
- Adding or removing DOM elements.
- Changing an element's dimensions, such as increasing content or changing font size.
- Adjusting element layout, such as modifying margin or padding.
- Resizing the browser window.
- Triggering pseudo-classes, such as hover effects.

### Repaint

Repaint occurs when an element's appearance changes without affecting the layout. Since elements are contained within the layout, a reflow will always trigger a repaint. However, a repaint alone does not necessarily cause a reflow.

#### Triggering Repaint

- Changing an element's color or background, such as adding a color or modifying background properties.
- Changing an element's box-shadow or border also qualifies as a repaint.

### How to Optimize Reflow and Repaint

- Avoid using table layouts. Table properties tend to cause layout recalculations when modified. If tables are unavoidable, consider adding properties like `table-layout: auto;` or `table-layout: fixed;` to render one row at a time and limit the affected area.
- Instead of manipulating the DOM to change styles one by one, define the required styles in a CSS class and toggle it via JavaScript.
  - For example, in Vue, you can use class binding to toggle styles rather than directly modifying styles through a function.
- For scenarios requiring frequent toggling (e.g., tab switching), prefer `v-show` over `v-if`. The former simply uses CSS `display: none;` to hide elements, while the latter triggers the component lifecycle by creating or destroying elements, resulting in greater performance overhead.
- If reflow is unavoidable, use `requestAnimationFrame` for optimization (since this API is designed for animations and syncs with the browser's frame rate). This can batch multiple reflows into one, reducing the number of repaints.
  - For example, if an animation needs to move toward a target on the page, you can use `requestAnimationFrame` to calculate each movement step.
  - Similarly, certain CSS3 properties can trigger hardware acceleration on the client side, improving animation performance, such as `transform`, `opacity`, `filters`, and `Will-change`.
- When possible, modify styles on lower-level DOM nodes to avoid triggering parent element style changes that cascade to all child elements.
- For animations, use elements with `absolute` or `fixed` positioning. This minimizes impact on other elements, only triggering repaint without reflow.

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

> Explain when the browser sends an OPTIONS request to the server.

In most cases, this applies to CORS scenarios. Before sending the actual request, a preflight check occurs where the browser first sends an OPTIONS request to ask the server whether the cross-origin request is allowed. If the server responds with permission, the browser proceeds to send the actual request. Otherwise, the browser throws an error.

Additionally, if the request method is not `GET`, `HEAD`, or `POST`, it will also trigger an OPTIONS request.
