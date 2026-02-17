---
id: project-architecture-vite-setting
title: 'Vite 設定とマルチテナントシステム'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Vite を使用して 27 ブランドテンプレートのマルチテナントシステムを管理し、動的コンパイルと環境分離を実現する方法。

---

## 1. SiteKey によるテンプレートルーティングの動的読み込み

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

- ビルド時に SiteKey を通じて対応するテンプレートルーティングを動的に読み込み
- 環境変数 `SITE_KEY` を使用してコンパイルするテンプレートを選択
- 単一リポジトリで複数のテンプレートを管理し、コードの重複を回避

## 2. カスタム環境変数注入システム

## 3. TailwindCSS & RWD ブレークポイントデザインの統合

## 4. 開発環境 Proxy 設定

## 5. Vue i18n Vite プラグインの統合

## 6. 互換性設定

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- 正確なブラウザ互換性制御
- モダンな機能と互換性のバランス
