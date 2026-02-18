---
id: project-architecture-vite-setting
title: 'Configuracao do Vite e sistema multi-tenant'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Como gerenciar um sistema multi-tenant com 27 templates de marca usando Vite, implementando compilação dinâmica e isolamento de ambientes.

---

## 1. Carregamento dinâmico das rotas de template correspondentes via SiteKey

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

- Durante o build, as rotas de template correspondentes são carregadas dinamicamente via SiteKey
- A variável de ambiente `SITE_KEY` é utilizada para selecionar o template a ser compilado
- Um único repositorio gerencia múltiplos templates, evitando código duplicado

## 2. Sistema de injeção de variáveis de ambiente personalizadas

## 3. Integracao do TailwindCSS e design de breakpoints RWD

## 4. Configuracao de Proxy do ambiente de desenvolvimento

## 5. Integracao do plugin Vite Vue i18n

## 6. Configuracao de compatibilidade

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- Controle preciso de compatibilidade do navegador
- Equilibrio entre recursos modernos e compatibilidade
