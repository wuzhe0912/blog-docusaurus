---
id: project-architecture-vite-setting
title: 'Vite 설정과 멀티 테넌트 시스템'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Vite를 사용하여 27개 브랜드 템플릿의 멀티 테넌트 시스템을 관리하고, 동적 컴파일과 환경 격리를 구현하는 방법.

---

## 1. SiteKey를 통한 템플릿 라우팅 동적 로딩

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

- 빌드 시 SiteKey를 통해 해당 템플릿 라우팅을 동적으로 로딩
- 환경 변수 `SITE_KEY`를 사용하여 컴파일할 템플릿 선택
- 단일 리포지토리에서 여러 템플릿을 관리하여 코드 중복 방지

## 2. 커스텀 환경 변수 주입 시스템

## 3. TailwindCSS & RWD 브레이크포인트 설계 통합

## 4. 개발 환경 Proxy 설정

## 5. Vue i18n Vite 플러그인 통합

## 6. 호환성 설정

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- 정밀한 브라우저 호환성 제어
- 현대적 기능과 호환성 간의 균형
