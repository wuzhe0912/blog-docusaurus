---
id: project-architecture-vite-setting
title: 'Konfigurasi Vite dalam Sistem Multi-tenant'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Cara menggunakan Vite untuk mendukung banyak template brand dalam satu repository dengan routing build dinamis dan isolasi environment.

---

## 1. Pemilihan template route dinamis berdasarkan `SITE_KEY`

Saat build, resolve file route tenant yang sesuai lalu hasilkan entry router yang aktif.

```ts
function writeBuildRouter(siteKey: string) {
  const sourceFile = path.resolve(__dirname, `../../template/${siteKey}/router/routes.ts`);
  const destinationFile = path.resolve(__dirname, '../../src/router/build.ts');

  const data = fs.readFileSync(sourceFile, 'utf8');
  fs.writeFileSync(destinationFile, data, 'utf8');
}
```

Manfaat:

- Satu repo untuk banyak template tenant
- Duplikasi kode lebih rendah
- Output build disesuaikan untuk satu tenant dalam satu waktu

## 2. Strategi environment variable

Gunakan file environment yang eksplisit dan validasi saat runtime.

- `.env.development`
- `.env.staging`
- `.env.production`

Ekspos hanya variabel client-safe yang diperlukan dengan kebijakan prefix.

## 3. Konfigurasi proxy development

Gunakan proxy Vite untuk domain API pada development lokal agar menghindari friksi CORS.

## 4. Integrasi i18n dan plugin

Integrasikan Vue i18n dan plugin terkait dalam pipeline plugin Vite yang terpusat agar perilaku environment tetap konsisten.

## 5. Konfigurasi target browser

```js
target: {
  browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
  node: 'node16',
}
```

Ini menyeimbangkan sintaks modern dan kompatibilitas yang praktis.

## Ringkasan siap wawancara

> Dalam sistem multi-tenant, saya menggunakan komposisi build berbasis `SITE_KEY`, isolasi env yang ketat, dan kebijakan target browser yang eksplisit agar setiap build tenant tetap terprediksi dan mudah dipelihara.
