---
id: project-architecture-vite-setting
title: 'Vite-Konfiguration und Multi-Tenant-System'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Wie man mit Vite ein Multi-Tenant-System mit 27 Markenvorlagen verwaltet und dynamische Kompilierung sowie Umgebungsisolierung implementiert.

---

## 1. Dynamisches Laden der entsprechenden Vorlagenrouten ueber SiteKey

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

- Beim Build werden die entsprechenden Vorlagenrouten ueber SiteKey dynamisch geladen
- Die Umgebungsvariable `SITE_KEY` wird verwendet, um die zu kompilierende Vorlage auszuwaehlen
- Ein einzelnes Repo verwaltet mehrere Vorlagen und vermeidet doppelten Code

## 2. Benutzerdefiniertes Umgebungsvariablen-Injektionssystem

## 3. Integration von TailwindCSS & RWD-Breakpoint-Design

## 4. Proxy-Einstellungen fuer die Entwicklungsumgebung

## 5. Integration des Vue i18n Vite-Plugins

## 6. Kompatibilitaetseinstellungen

```js
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },
```

- Praezise Browser-Kompatibilitaetssteuerung
- Ausgewogenes Verhaeltnis zwischen modernen Funktionen und Kompatibilitaet
