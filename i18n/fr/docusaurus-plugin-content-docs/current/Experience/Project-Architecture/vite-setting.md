---
id: project-architecture-vite-setting
title: 'Configuration Vite et systeme multi-tenant'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Comment gerer un systeme multi-tenant de 27 modeles de marque avec Vite, en implementant la compilation dynamique et l'isolation des environnements.

---

## 1. Chargement dynamique des routes de modele correspondantes via SiteKey

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

- Lors du build, les routes de modele correspondantes sont chargees dynamiquement via SiteKey
- La variable d'environnement `SITE_KEY` est utilisee pour selectionner le modele a compiler
- Un seul depot gere plusieurs modeles, evitant la duplication de code

## 2. Systeme d'injection de variables d'environnement personnalisees

## 3. Integration de TailwindCSS et conception de breakpoints RWD

## 4. Configuration du Proxy de l'environnement de developpement

## 5. Integration du plugin Vite Vue i18n

## 6. Configuration de compatibilite

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- Controle precis de la compatibilite navigateur
- Equilibre entre fonctionnalites modernes et compatibilite
