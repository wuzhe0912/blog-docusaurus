---
id: project-architecture-vite-setting
title: 'Configuracion de Vite y sistema multi-tenant'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Como gestionar un sistema multi-tenant de 27 plantillas de marca con Vite, implementando compilacion dinamica y aislamiento de entornos.

---

## 1. Carga dinamica de las rutas de plantilla correspondientes mediante SiteKey

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

- Durante el build, las rutas de plantilla correspondientes se cargan dinamicamente mediante SiteKey
- Se utiliza la variable de entorno `SITE_KEY` para seleccionar la plantilla a compilar
- Un unico repositorio gestiona multiples plantillas, evitando codigo duplicado

## 2. Sistema de inyeccion de variables de entorno personalizadas

## 3. Integracion de TailwindCSS y diseno de breakpoints RWD

## 4. Configuracion de Proxy del entorno de desarrollo

## 5. Integracion del plugin Vite de Vue i18n

## 6. Configuracion de compatibilidad

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- Control preciso de compatibilidad del navegador
- Equilibrio entre caracteristicas modernas y compatibilidad
