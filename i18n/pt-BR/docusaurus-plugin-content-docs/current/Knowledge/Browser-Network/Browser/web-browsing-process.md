---
id: web-browsing-process
title: "\U0001F4C4 Processo de Navegacao Web"
slug: /web-browsing-process
---

## 1. Explique como o navegador obtém o HTML do servidor e como o renderiza na tela

> Descreva como o navegador obtém o HTML do servidor e como renderiza o HTML na tela

### 1. Iniciando a Requisição

- **Entrada da URL**: O usuário digita uma URL no navegador ou clica em um link, e o navegador começa a analisar a URL para determinar a qual servidor enviar a requisição.
- **Consulta DNS**: O navegador executa uma consulta DNS para encontrar o endereço IP correspondente do servidor.
- **Estabelecendo a Conexão**: O navegador envia uma requisição ao endereço IP do servidor pela internet usando o protocolo HTTP ou HTTPS. Se for HTTPS, também é necessário estabelecer uma conexão SSL/TLS.

### 2. Resposta do Servidor

- **Processando a Requisição**: Após receber a requisição, o servidor lê os dados correspondentes do banco de dados com base no caminho e nos parâmetros da requisição.
- **Enviando a Response**: Em seguida, envia o documento HTML como parte da HTTP Response de volta ao navegador. A Response também inclui informações como código de status e outros parâmetros (CORS, content-type), entre outros.

### 3. Analisando o HTML

- **Construindo a DOM Tree**: O navegador começa a ler o documento HTML e, com base nas tags e atributos, converte-o em DOM e começa a construir a DOM Tree na memória.
- **Requisitando subresources (sub-recursos)**: Ao analisar o documento HTML, se encontrar recursos externos como CSS, JavaScript, imagens, etc., o navegador faz requisições adicionais ao servidor para obter esses recursos.

### 4. Renderizando a Página

- **Construindo a CSSOM Tree**: O navegador começa a analisar os arquivos CSS e constrói a CSSOM Tree.
- **Render Tree**: O navegador combina a DOM Tree e a CSSOM Tree em uma Render Tree, que contém todos os nós a serem renderizados e seus estilos correspondentes.
- **Layout**: O navegador executa o layout (Layout ou Reflow), calculando a posição e o tamanho de cada nó.
- **Paint (Pintura)**: Finalmente, o navegador passa pela fase de pintura (painting), desenhando o conteúdo de cada nó na página.

### 5. Interação com JavaScript

- **Executando JavaScript**: Se o HTML contém JavaScript, o navegador o analisa e executa, o que pode alterar o DOM e modificar estilos.

Todo o processo é progressivo. Em teoria, o usuário verá primeiro parte do conteúdo da página e, por fim, a página completa. Durante esse processo, podem ocorrer múltiplos reflows e repaints, especialmente quando a página contém estilos complexos ou efeitos de interação. Além das otimizações que o próprio navegador realiza, os desenvolvedores geralmente adotam algumas técnicas para tornar a experiência do usuário mais fluida.

## 2. Descreva Reflow e Repaint

### Reflow (Refluxo/Rearranjo)

Refere-se a mudanças no DOM de uma página web que fazem com que o navegador precise recalcular as posições dos elementos e colocá-los nos locais corretos. Em termos simples, o Layout precisa reorganizar os elementos.

#### Quando o Reflow é Acionado

O reflow ocorre em dois cenários: um é quando toda a página muda globalmente, e o outro é quando apenas uma parte dos componentes muda.

- Na entrada inicial da página, este é o reflow de maior impacto
- Adicionar ou remover elementos DOM
- Alterar o tamanho de um elemento, como aumento de conteúdo ou mudanças no tamanho da fonte
- Ajustar o layout de um elemento, como mover com margin ou padding
- Mudanças no tamanho da janela do próprio navegador
- Ativar pseudo-classes, como efeitos de hover

### Repaint (Repintura)

Sem alterar o Layout, apenas atualiza ou modifica elementos. Como os elementos estão contidos no Layout, se um reflow for acionado, inevitavelmente causará um repaint. Por outro lado, apenas acionar um repaint não necessariamente causa um reflow.

#### Quando o Repaint é Acionado

- Alterar a cor ou o fundo de um elemento, como adicionar color ou ajustar propriedades de background
- Alterar a sombra ou border de um elemento também é considerado repaint

### Como Otimizar Reflow ou Repaint

- Não use table para layout, pois as propriedades de table tendem a causar re-layouts quando modificadas. Se for necessário usar, recomenda-se adicionar as seguintes propriedades para renderizar apenas uma linha por vez, evitando afetar toda a tabela, como `table-layout: auto;` ou `table-layout: fixed;`.
- Não manipule o DOM para ajustar estilos um por um. Em vez disso, defina os estilos necessários por meio de classes e alterne-as via JS.
  - No framework Vue, por exemplo, você pode vincular classes para alternar estilos, em vez de modificar estilos diretamente com funções.
- Para cenários que requerem alternância frequente, como troca de abas, priorize o uso de `v-show` em vez de `v-if`. O primeiro apenas usa a propriedade CSS `display: none;` para ocultar, enquanto o último aciona o ciclo de vida, recriando ou destruindo elementos, o que naturalmente consome mais performance.
- Se realmente precisar acionar um reflow, você pode otimizar com `requestAnimationFrame` (principalmente porque essa API foi projetada para animações e pode sincronizar com a taxa de quadros de pintura do navegador), permitindo que múltiplos reflows sejam combinados em um, reduzindo o número de repaints.
  - Por exemplo, para uma animação que precisa mover em direção a um alvo na página, você pode usar `requestAnimationFrame` para calcular cada movimento.
  - Da mesma forma, algumas propriedades CSS3 podem ativar a aceleração de hardware no lado do cliente, melhorando a performance das animações, como `transform`, `opacity`, `filters` e `Will-change`.
- Se possível, modifique estilos em nós DOM de nível mais baixo para evitar que alterações de estilo em elementos pais afetem todos os elementos filhos.
- Se precisar executar animações, use-as em elementos com posicionamento absoluto `absolute` ou `fixed`, pois isso afeta pouco outros elementos e apenas aciona repaint, evitando reflow.

### Example

```js
// bad
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// good
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Reference

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)

## 3. Descreva quando o navegador envia uma requisição OPTIONS ao servidor

> Descreva quando o navegador enviará uma requisição OPTIONS ao servidor

Na maioria dos casos, isso se aplica em cenários de CORS. Antes de enviar a requisição real, há uma ação de preflight (pré-verificação), onde o navegador primeiro envia uma requisição OPTIONS perguntando ao servidor se a requisição cross-origin é permitida. Se o servidor responder permitindo, o navegador então envia a requisição real. Caso contrário, se não for permitida, o navegador exibe um erro.

Além disso, se o método da requisição não for `GET`, `HEAD` ou `POST`, uma requisição OPTIONS também será acionada.
