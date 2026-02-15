---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Voce pode explicar o que e CSP (Content Security Policy)?

> Can you explain what CSP (Content Security Policy) is?

Basicamente, CSP e um mecanismo para melhorar a seguranca de paginas web. Atraves da configuracao de headers HTTP, e possivel restringir as fontes de dados que o conteudo da pagina pode carregar (whitelist), prevenindo que atacantes maliciosos roubem dados dos usuarios injetando scripts maliciosos.

Do ponto de vista do front-end, para prevenir ataques XSS (Cross-site scripting), frameworks modernos sao geralmente adotados no desenvolvimento, pois eles fornecem mecanismos basicos de protecao. Por exemplo, o JSX do React realiza automaticamente o escape de HTML, e o Vue faz o escape automatico de tags HTML ao vincular dados com `{{ data }}`.

Embora o front-end tenha opcoes limitadas nessa area, ainda existem algumas otimizacoes de detalhe que podem ser feitas:

1. Para formularios que exigem entrada de conteudo, voce pode validar caracteres especiais para evitar ataques (mas e dificil prever todos os cenarios), entao geralmente se adota limitacao de comprimento para controlar o conteudo de entrada no client, ou limitar o tipo de entrada.
2. Ao referenciar links externos, evite URLs http e utilize URLs https.
3. Para sites de paginas estaticas, voce pode configurar meta tags para restringir, como a seguir:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: por padrao, permite carregar dados apenas da mesma origem (mesmo dominio).
- `img-src https://*`: permite carregar imagens apenas via protocolo HTTPS.
- `child-src 'none'`: nao permite incorporar nenhum recurso filho externo, como `<iframe>`.

## 2. O que e um ataque XSS (Cross-site scripting)?

> What is XSS (Cross-site scripting) attack?

XSS, ou Cross-site Scripting, refere-se ao ataque em que o invasor injeta scripts maliciosos que sao executados no navegador do usuario, obtendo dados sensiveis como cookies, ou alterando diretamente o conteudo da pagina para redirecionar o usuario a sites maliciosos.

### Prevencao de XSS armazenado

O atacante pode, atraves de comentarios, inserir intencionalmente HTML ou scripts maliciosos no banco de dados. Nesse caso, alem do back-end realizar o escape, frameworks modernos do front-end como JSX do React ou template `{{ data }}` do Vue tambem auxiliam no escape, reduzindo a probabilidade de ataques XSS.

### Prevencao de XSS refletido

Evite usar `innerHTML` para manipular o DOM, pois isso pode executar tags HTML. A recomendacao geral e usar `textContent` para manipulacao.

### Prevencao de XSS baseado em DOM

Como principio, evitamos ao maximo que usuarios insiram HTML diretamente na pagina. Se houver necessidade no cenario, os proprios frameworks possuem diretivas semelhantes para auxiliar, como `dangerouslySetInnerHTML` do React e `v-html` do Vue, que ajudam a prevenir XSS automaticamente. Porem, se for necessario desenvolver com JavaScript nativo, prefira usar `textContent`, `createElement` e `setAttribute` para manipular o DOM.
