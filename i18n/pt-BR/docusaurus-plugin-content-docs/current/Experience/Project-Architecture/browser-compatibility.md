---
id: project-architecture-browser-compatibility
title: 'Tratamento de compatibilidade de navegadores'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Tratamento de problemas de compatibilidade entre navegadores, especialmente o tratamento especial para Safari e dispositivos móveis.

---

## Compatibilidade de navegadores

> Unidades de viewport pequeno (Small Viewport Units): svh
> Unidades de viewport grande (Large Viewport Units): lvh
> Unidades de viewport dinâmico (Dynamic Viewport Units): dvh

Em cenários específicos, é permitido usar a nova sintaxe dvh para resolver o problema da barra flutuante mal projetada no Safari. Se for necessária compatibilidade forçada com navegadores incomuns ou antigos, JS é utilizado para detectar a altura.

## Prevenir ajuste automático do tamanho do texto no iOS Safari

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## Prefixos de fornecedor

Os prefixos de fornecedor são tratados através de configuração manual e configuração automática do Autoprefixer.
