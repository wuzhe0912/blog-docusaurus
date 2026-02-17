---
id: project-architecture-vite-setting
title: 'Cấu hình Vite và hệ thống multi-tenant'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Cách sử dụng Vite để quản lý hệ thống multi-tenant với 27 mẫu thương hiệu, thực hiện biên dịch động và cách ly môi trường.

---

## 1. Tải động các route template tương ứng thông qua SiteKey

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

- Khi build, tải động các route template tương ứng thông qua SiteKey
- Sử dụng biến môi trường `SITE_KEY` để chọn template cần biên dịch
- Một repo duy nhất quản lý nhiều template, tránh trùng lặp mã nguồn

## 2. Hệ thống tiêm biến môi trường tùy chỉnh

## 3. Tích hợp TailwindCSS & thiết kế breakpoint RWD

## 4. Cấu hình Proxy môi trường phát triển

## 5. Tích hợp plugin Vue i18n Vite

## 6. Cấu hình tương thích

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- Kiểm soát tương thích trình duyệt chính xác
- Cân bằng giữa tính năng hiện đại và tương thích
