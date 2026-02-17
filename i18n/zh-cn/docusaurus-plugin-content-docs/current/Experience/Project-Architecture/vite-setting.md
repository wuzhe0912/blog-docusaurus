---
id: project-architecture-vite-setting
title: 'Vite 配置与多租户系统'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> 如何用 Vite 管理 27 个品牌版型的多租户系统，实现动态编译与环境隔离。

---

## 1. 通过 SiteKey 动态载入对应的版型路由

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

- Build 时，通过 SiteKey 动态载入对应的版型路由
- 利用 `SITE_KEY` 环境变量来选择要编译的版型
- 单一 Repo 管理多个版型，避免重复的代码

## 2. 自定义环境变量注入系统

## 3. 集成 TailwindCSS & RWD 断点设计

## 4. 开发环境 Proxy 设定

## 5. Vue i18n Vite 插件整合

## 6. 兼容设定

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- 精确的浏览器兼容性控制
- 平衡现代特性与兼容性
