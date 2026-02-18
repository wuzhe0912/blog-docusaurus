---
id: project-architecture-vite-setting
title: 'Configuración de Vite y sistema multi-tenant'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Cómo gestionar un sistema multi-tenant de 27 plantillas de marca con Vite, implementando compilación dinámica y aislamiento de entornos.

---

## 1. Carga dinámica de las rutas de plantilla correspondientes mediante SiteKey

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

- Durante el build, las rutas de plantilla correspondientes se cargan dinámicamente mediante SiteKey
- Se utiliza la variable de entorno `SITE_KEY` para seleccionar la plantilla a compilar
- Un único repositorio gestiona múltiples plantillas, evitando código duplicado

## 2. Sistema de inyección de variables de entorno personalizadas

## 3. Integración de TailwindCSS y diseño de breakpoints RWD

## 4. Configuración de Proxy del entorno de desarrollo

## 5. Integración del plugin Vite de Vue i18n

## 6. Configuración de compatibilidad

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- Control preciso de compatibilidad del navegador
- Equilibrio entre características modernas y compatibilidad
