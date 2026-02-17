---
id: project-architecture-vite-setting
title: 'Configuration Vite et système multi-tenant'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Comment gérer un système multi-tenant de 27 modèles de marque avec Vite, en implémentant la compilation dynamique et l'isolation des environnements.

---

## 1. Chargement dynamique des routes de modèle correspondantes via SiteKey

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

- Lors du build, les routes de modèle correspondantes sont chargées dynamiquement via SiteKey
- La variable d'environnement `SITE_KEY` est utilisée pour sélectionner le modèle à compiler
- Un seul dépôt gère plusieurs modèles, évitant la duplication de code

## 2. Système d'injection de variables d'environnement personnalisées

## 3. Intégration de TailwindCSS et conception de breakpoints RWD

## 4. Configuration du Proxy de l'environnement de développement

## 5. Intégration du plugin Vite Vue i18n

## 6. Configuration de compatibilité

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- Contrôle précis de la compatibilité navigateur
- Équilibre entre fonctionnalités modernes et compatibilité
