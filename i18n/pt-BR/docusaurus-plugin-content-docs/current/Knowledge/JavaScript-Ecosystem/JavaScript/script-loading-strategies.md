---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## Visão geral

No HTML, temos três formas principais de carregar arquivos JavaScript:

1. `<script>`
2. `<script async>`
3. `<script defer>`

Essas três formas possuem comportamentos diferentes ao carregar e executar scripts.

## Comparação detalhada

### `<script>`

- **Comportamento**: Quando o navegador encontra essa tag, ele para de analisar o HTML, baixa e executa o script, e depois continua analisando o HTML.
- **Quando usar**: Adequado para scripts essenciais à renderização da página.
- **Vantagem**: Garante que os scripts sejam executados em ordem.
- **Desvantagem**: Pode atrasar a renderização da página.

```html
<script src="important.js"></script>
```

### `<script async>`

- **Comportamento**: O navegador baixa o script em segundo plano enquanto continua analisando o HTML. Quando o download é concluído, o script é executado imediatamente, podendo interromper a análise do HTML.
- **Quando usar**: Adequado para scripts independentes, como scripts de analytics ou publicidade.
- **Vantagem**: Não bloqueia a análise do HTML e pode melhorar a velocidade de carregamento da página.
- **Desvantagem**: A ordem de execução não é garantida; pode ser executado antes que o DOM esteja totalmente carregado.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **Comportamento**: O navegador baixa o script em segundo plano, mas espera até que a análise do HTML esteja concluída antes de executá-lo. Múltiplos scripts defer são executados na ordem em que aparecem no HTML.
- **Quando usar**: Adequado para scripts que precisam da estrutura completa do DOM, mas que não são necessários imediatamente.
- **Vantagem**: Não bloqueia a análise do HTML, garante a ordem de execução e é ideal para scripts que dependem do DOM.
- **Desvantagem**: Se o script for importante, pode atrasar o tempo até a página se tornar interativa.

```html
<script defer src="ui-enhancements.js"></script>
```

## Exemplo

Imagine que você está se preparando para um encontro:

1. **`<script>`**:
   É como parar toda a sua preparação para ligar para o seu par e confirmar os detalhes do encontro. A comunicação fica garantida, mas o seu tempo de preparação pode atrasar.

2. **`<script async>`**:
   É como se preparar enquanto fala com o seu par pelo fone Bluetooth. A eficiência aumenta, mas você pode acabar vestindo a roupa errada por estar concentrado demais na ligação.

3. **`<script defer>`**:
   É como enviar uma mensagem para o seu par dizendo que vai retornar a ligação quando terminar de se preparar. Assim, você pode se concentrar na preparação e se comunicar com calma quando tudo estiver pronto.

## Uso atual

No desenvolvimento com frameworks modernos, geralmente não é necessário configurar o `<script>` manualmente. Por exemplo, o Vite usa module por padrão, que equivale ao comportamento do defer.

```javascript
<script type="module" src="/src/main.js"></script>
```

Exceto no caso de scripts de terceiros especiais, como o Google Analytics.

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
