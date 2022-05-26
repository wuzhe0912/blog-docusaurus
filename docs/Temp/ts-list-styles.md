---
id: 01-list-styles
title: '📹 List Styles'
slug: /list-styles
---

## Demo Structure

Folder structure

```js
📦src
 ┣ 📂api
 ┃ ┗ 📜fetch.ts
 ┣ 📂assets
 ┃ ┗ 📂images
 ┃ ┃ ┣ 📜close.png
 ┃ ┃ ┣ 📜fullscreen.png
 ┃ ┃ ┣ 📜play.png
 ┃ ┃ ┣ 📜stop.png
 ┃ ┃ ┗ 📜volume.png
 ┣ 📂components
 ┃ ┗ 📂Popup
 ┃ ┃ ┣ 📜Popup.css
 ┃ ┃ ┗ 📜Popup.ts
 ┣ 📂styles
 ┃ ┣ 📜main.css
 ┃ ┗ 📜video.css
 ┣ 📜index.html
 ┗ 📜main.ts
```

## HTML

```html
<div id="app">
  <header class="header-wrapper">
    <h1>Video use TypeScript</h1>
  </header>
  <main class="wrapper">
    <ul class="list-wrapper"></ul>
  </main>
</div>
```

## Init CSS

Initial styles

```css
// main.css

html {
  font-size: 100%;
}
* {
  outline: none;
  box-sizing: border-box;
  margin: 0;
}
body {
  width: 100%;
  height: 100%;
  font-size: 100%;
  font-family: -apple-system, 'Arial', 'BlinkMacSystemFont', 'Segoe UI',
    'Roboto', 'Helvetica Neue', 'Helvetica', 'Microsoft YaHei',
    'Microsoft JhengHei', 'Heiti', 'Microsoft YaHei Bold', sans-serif;
  font-weight: normal;
  line-height: 1;
}
a {
  text-decoration: none;
}
p,
h1,
h2,
h3,
h4,
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
img {
  max-width: 100%;
  height: auto;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
button {
  background-color: transparent;
  border: none;
}
input {
  margin: 0;
  padding: 0;
  border-radius: 0;
  border: none;
  background-color: transparent;
}
input:focus,
textarea:focus,
select:focus {
  outline: none;
}
```

## Movies Data

Video data use googleapis provide video.json.

> [source](http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/videos.json)

```js
// fetch.ts

const url =
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/videos.json';

async function fetchVideoData(url: string) {
  let data;
  try {
    const response = await fetch(url);
    data = response.json();
  } catch (error) {
    console.log('error', error);
  }
  return data;
}

const { categories } = await fetchVideoData(url);
const movies = categories[0];
const { videos } = movies;

export default { videos };
```

## Render HTML

When we get the video data, through operation DOM to render HTML.

Use `map()` will return array, so page is render comma, add `join()` return string.

Use HTML5 `data-*attribute` to store data. When click event you can use `getAttribute()` to get data.

```js
// main.ts

import fetchApi from './api/fetch';

const videoArray = fetchApi.videos;
const imgUrl =
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';

const listItem = videoArray
  .map((video) => {
    return `
      <li class="list" data-url="${video.sources[0]}" data-title="${video.title}">
        <div class="video-title">
          <h3>${video.title}</h3>
        </div>
        <div class="video-image">
          <img src="${imgUrl}${video.thumb}" alt="" />
          <i class="icon-play"></i>
        </div>
      </li>
    `;
  })
  .join('');

const listWrapper = document.querySelector('.list-wrapper');
listWrapper.innerHTML = listItem;

const liElement = document.querySelectorAll('.list-wrapper li');
liElement.forEach((item) => {
  let url = item.getAttribute('data-url');
  let title = item.getAttribute('data-title');
  item.addEventListener('click', (e) => {
    console.log(url, title);
  });
});
```

## Add Styles

Let the list styles have RWD.

```css
/* video.css */

.header-wrapper {
  text-align: center;
  line-height: 2;
  color: #444;
}

.wrapper {
  display: flex;
  justify-content: center;
}

.list-wrapper {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1140px;
}

.list {
  flex: 100%;
  margin: 15px 0;
  padding: 0 10px;
}

.video-title {
  color: #444;
  line-height: 2;
}

.video-image {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}

.video-image:hover {
  cursor: pointer;
  box-shadow: 10px 10px 10px rgb(0 0 0 / 30%);
}

.video-image img {
  width: 100%;
  height: 100%;
  transform: scale(1, 1);
  transition: all 0.5s ease-out;
}

.video-image img:hover {
  transform: scale(1.2, 1.2);
}

.video-image i {
  position: absolute;
  bottom: 12px;
  left: 20px;
  width: 20px;
  height: 20px;
  background-image: url('../assets/images/play.png');
  background-position: center;
}

@media (min-width: 750px) {
  .list {
    flex: 50%;
    max-width: 50%;
  }
}

@media (min-width: 1200px) {
  .list {
    flex: 33%;
    max-width: 33%;
  }
}
```
