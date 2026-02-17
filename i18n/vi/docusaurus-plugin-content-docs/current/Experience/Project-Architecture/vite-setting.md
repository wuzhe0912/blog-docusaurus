---
id: project-architecture-vite-setting
title: 'Cau hinh Vite va he thong multi-tenant'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Cach su dung Vite de quan ly he thong multi-tenant voi 27 mau thuong hieu, thuc hien bien dich dong va cach ly moi truong.

---

## 1. Tai dong cac route template tuong ung thong qua SiteKey

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

- Khi build, tai dong cac route template tuong ung thong qua SiteKey
- Su dung bien moi truong `SITE_KEY` de chon template can bien dich
- Mot repo duy nhat quan ly nhieu template, tranh trung lap ma nguon

## 2. He thong tiem bien moi truong tuy chinh

## 3. Tich hop TailwindCSS & thiet ke breakpoint RWD

## 4. Cau hinh Proxy moi truong phat trien

## 5. Tich hop plugin Vue i18n Vite

## 6. Cau hinh tuong thich

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- Kiem soat tuong thich trinh duyet chinh xac
- Can bang giua tinh nang hien dai va tuong thich
