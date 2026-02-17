---
id: project-architecture-browser-compatibility
title: 'Tratamento de compatibilidade de navegadores'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Tratamento de problemas de compatibilidade entre navegadores, especialmente o tratamento especial para Safari e dispositivos moveis.

---

## Compatibilidade de navegadores

> Unidades de viewport pequeno (Small Viewport Units): svh
> Unidades de viewport grande (Large Viewport Units): lvh
> Unidades de viewport dinamico (Dynamic Viewport Units): dvh

Em cenarios especificos, e permitido usar a nova sintaxe dvh para resolver o problema da barra flutuante mal projetada no Safari. Se for necessaria compatibilidade forcada com navegadores incomuns ou antigos, JS e utilizado para detectar a altura.

## Prevenir ajuste automatico do tamanho do texto no iOS Safari

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## Prefixos de fornecedor

Os prefixos de fornecedor sao tratados atraves de configuracao manual e configuracao automatica do Autoprefixer.
