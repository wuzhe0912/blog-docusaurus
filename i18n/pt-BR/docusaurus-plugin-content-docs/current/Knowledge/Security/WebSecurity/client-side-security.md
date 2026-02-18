---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Você pode explicar o que é CSP (Content Security Policy)?

> Can you explain what CSP (Content Security Policy) is?

Basicamente, CSP é um mecanismo para melhorar a segurança de páginas web. Através da configuração de headers HTTP, é possível restringir as fontes de dados que o conteúdo da página pode carregar (whitelist), prevenindo que atacantes maliciosos roubem dados dos usuários injetando scripts maliciosos.

Do ponto de vista do front-end, para prevenir ataques XSS (Cross-site scripting), frameworks modernos são geralmente adotados no desenvolvimento, pois eles fornecem mecanismos básicos de proteção. Por exemplo, o JSX do React realiza automaticamente o escape de HTML, e o Vue faz o escape automático de tags HTML ao vincular dados com `{{ data }}`.

Embora o front-end tenha opções limitadas nessa area, ainda existem algumas otimizações de detalhe que podem ser feitas:

1. Para formularios que exigem entrada de conteúdo, você pode validar caracteres especiais para evitar ataques (mas é difícil prever todos os cenários), então geralmente se adota limitação de comprimento para controlar o conteúdo de entrada no client, ou limitar o tipo de entrada.
2. Ao referenciar links externos, evite URLs http e utilize URLs https.
3. Para sites de páginas estáticas, você pode configurar meta tags para restringir, como a seguir:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: por padrão, permite carregar dados apenas da mesma origem (mesmo domínio).
- `img-src https://*`: permite carregar imagens apenas via protocolo HTTPS.
- `child-src 'none'`: não permite incorporar nenhum recurso filho externo, como `<iframe>`.

## 2. O que é um ataque XSS (Cross-site scripting)?

> What is XSS (Cross-site scripting) attack?

XSS, ou Cross-site Scripting, refere-se ao ataque em que o invasor injeta scripts maliciosos que são executados no navegador do usuário, obtendo dados sensíveis como cookies, ou alterando diretamente o conteúdo da página para redirecionar o usuário a sites maliciosos.

### Prevencao de XSS armazenado

O atacante pode, através de comentários, inserir intencionalmente HTML ou scripts maliciosos no banco de dados. Nesse caso, além do back-end realizar o escape, frameworks modernos do front-end como JSX do React ou template `{{ data }}` do Vue também auxiliam no escape, reduzindo a probabilidade de ataques XSS.

### Prevencao de XSS refletido

Evite usar `innerHTML` para manipular o DOM, pois isso pode executar tags HTML. A recomendação geral e usar `textContent` para manipulação.

### Prevencao de XSS baseado em DOM

Como princípio, evitamos ao máximo que usuários insiram HTML diretamente na página. Se houver necessidade no cenário, os próprios frameworks possuem diretivas semelhantes para auxiliar, como `dangerouslySetInnerHTML` do React e `v-html` do Vue, que ajudam a prevenir XSS automaticamente. Porem, se for necessário desenvolver com JavaScript nativo, prefira usar `textContent`, `createElement` e `setAttribute` para manipular o DOM.
