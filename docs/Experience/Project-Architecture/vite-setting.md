---
id: project-architecture-vite-setting
title: 'Vite Configuration in a Multi-tenant System'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> How to use Vite to support many brand templates in one repository with dynamic build routing and environment isolation.

---

## 1. Dynamic route template selection by `SITE_KEY`

At build time, resolve the matching tenant route file and generate the active router entry.

```ts
function writeBuildRouter(siteKey: string) {
  const sourceFile = path.resolve(__dirname, `../../template/${siteKey}/router/routes.ts`);
  const destinationFile = path.resolve(__dirname, '../../src/router/build.ts');

  const data = fs.readFileSync(sourceFile, 'utf8');
  fs.writeFileSync(destinationFile, data, 'utf8');
}
```

Benefits:

- One repo for many tenant templates
- Lower code duplication
- Build output tailored to one tenant at a time

## 2. Environment variable strategy

Use explicit environment files and runtime validation.

- `.env.development`
- `.env.staging`
- `.env.production`

Expose only necessary client-safe vars with prefix policy.

## 3. Development proxy configuration

Use Vite proxy for API domains in local development to avoid CORS friction.

## 4. i18n and plugin integration

Integrate Vue i18n and related plugins in a centralized Vite plugin pipeline to keep environment behavior consistent.

## 5. Browser target configuration

```js
target: {
  browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
  node: 'node16',
}
```

This balances modern syntax and practical compatibility.

## Interview-ready summary

> In multi-tenant systems, I use `SITE_KEY`-driven build composition, strict env isolation, and explicit browser target policy so each tenant build stays predictable and maintainable.
