---
id: node-crawler
description: About Crawler with Node.js
slug: /node-crawler
---

# Crawler

## Install Plugin

```bash
yarn add selenium-webdriver
```

## 建立 `driver`

`Mac` 環境不需要下載額外 `driver`，因此以下內容是兼容 `Windows` 環境。

### Check Chrome version

打開 `chrome://settings/help`，查看目前本機 `chrome` 版本，接著前往 [ChromeDriver](https://chromedriver.chromium.org/)，找到對應的版本下載。將下載後的 `chromedriver.exe` 放入專案下，並加入 `.gitignore`。

## Running Driver

在 `index.js` 下寫入以下內容，測試自動運行

```js
const webdriver = require('selenium-webdriver');

async function openCrawlerWeb() {
  let driver = await new webdriver.Builder().forBrowser('chrome').build();

  const web = 'https://www.gamer.com.tw/';

  driver.get(web);
}

openCrawlerWeb();
```
