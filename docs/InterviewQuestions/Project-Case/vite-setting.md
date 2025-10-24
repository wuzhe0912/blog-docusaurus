---
id: vite-setting
title: '📄 Vite 配置與優化'
slug: /vite-setting
---

# Vite 配置與多租戶架構

> 如何用 Vite 管理 27 個品牌版型的多租戶系統，實現動態編譯與環境隔離。

---

## 1. 透過 SiteKey 動態載入對應的版型路由

```typescript
function writeBuildRouter() {
  const sourceFile = path.resolve(
    __dirname,
    `../../template/${siteKey}/router/routes.ts`
  );
  const destinationFile = path.resolve(__dirname, '../../src/router/build.ts');

  fs.readFile(sourceFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    fs.writeFile(destinationFile, data, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }
      console.log(
        `File copied successfully from ${sourceFile} to ${destinationFile}`
      );
      buildFile(siteKey);
    });
  });
}
```

- Build 時，透過 SiteKey 動態載入對應的版型路由
- 利用 `SITE_KEY` 環境變數來選擇要編譯的版型
- 單一 Repo 管理多個版型，避免重複的程式碼

## 2. 自定義環境變數注入系統

## 3. 集成 TailwindCSS & RWD 斷點設計

## 4. 開發環境 Proxy 設定

## 5. Vue i18n Vite 插件整合

## 6. 兼容設定

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- 精確的瀏覽器兼容性控制
- 平衡現代特性與兼容性
