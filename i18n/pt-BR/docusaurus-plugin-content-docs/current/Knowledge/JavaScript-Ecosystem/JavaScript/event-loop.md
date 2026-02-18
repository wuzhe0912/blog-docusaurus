---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> Por que o JavaScript precisa de processamento assíncrono? Explique callback e event loop

O JavaScript é essencialmente uma linguagem single-thread, pois uma de suas tarefas é modificar a estrutura DOM do navegador. Se múltiplas threads modificassem o mesmo nó simultaneamente, a situação se tornaria muito complexa. Para evitar isso, o modelo single-thread foi adotado.

O processamento assíncrono é uma solução viável no contexto single-thread. Se uma ação precisa esperar 2 segundos, o navegador não pode ficar parado esperando. Portanto, executa primeiro todo o trabalho síncrono, enquanto as tarefas assíncronas são colocadas na task queue (fila de tarefas).

O ambiente onde o navegador executa o trabalho síncrono pode ser entendido como o call stack. O navegador executa sequencialmente as tarefas no call stack. Quando detecta que o call stack está vazio, pega as tarefas em espera da task queue é as coloca no call stack para execução sequencial.

1. O navegador verifica se o call stack está vazio => Não => Continua executando tarefas no call stack
2. O navegador verifica se o call stack está vazio => Sim => Verifica se há tarefas em espera na task queue => Sim => Move para o call stack para execução

Esse processo de repetição contínua é o conceito do event loop.

```js
console.log(1);

// Esta função assíncrona é o callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// Imprime sequencialmente 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> Por que o `setInterval` não é preciso em termos de tempo?

1. Como o JavaScript é uma linguagem single-thread (só pode executar uma tarefa por vez, as outras devem esperar na Queue), quando o tempo de execução do callback do setInterval excede o intervalo configurado, a próxima execução é atrasada. Por exemplo, se o setInterval está configurado para executar uma função a cada segundo, mas uma ação dentro da função leva dois segundos, a próxima execução será atrasada em um segundo. Com o acúmulo, o timing do setInterval se torna cada vez mais impreciso.

2. Os navegadores ou ambientes de execução também impõem limitações. Na maioria dos navegadores principais (Chrome, Firefox, Safari, etc.), o intervalo mínimo é de aproximadamente 4 milissegundos. Mesmo configurando para 1 milissegundo, a execução real ocorre apenas a cada 4 milissegundos.

3. Quando o sistema executa tarefas que consomem muita memória ou CPU, isso também causa atrasos. Ações como edição de vídeo ou processamento de imagens têm alta probabilidade de causar atrasos.

4. O JavaScript possui um mecanismo de Garbage Collection. Se dentro da função do setInterval forem criados muitos objetos que não são mais usados após a execução, eles serão coletados pelo GC, o que também causa atrasos.

### Alternativas

#### requestAnimationFrame

Se atualmente o `setInterval` é usado para implementação de animações, pode-se considerar usar `requestAnimationFrame` como substituto.

- Sincronizado com o repaint do navegador: Executado quando o navegador está pronto para desenhar um novo frame. É muito mais preciso do que tentar adivinhar o momento do repaint com setInterval ou setTimeout.
- Performance: Por estar sincronizado com o repaint, não é executado quando o navegador considera que não precisa repintar. Isso economiza recursos de computação, especialmente quando a aba não está em foco ou está minimizada.
- Limitação automática: Ajusta automaticamente a frequência de execução de acordo com o dispositivo é a situação, normalmente 60 frames por segundo.
- Parâmetro temporal de alta precisão: Pode receber um parâmetro temporal de alta precisão (tipo DOMHighResTimeStamp, com precisão de microssegundos) para controlar animações ou outras operações sensíveis ao tempo com maior precisão.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Se o elemento ainda não chegou ao destino, continuar a animação
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` atualiza a posição do elemento a cada frame (normalmente 60 frames por segundo) até atingir 500 pixels. Este método alcança um efeito de animação mais suave e natural do que o `setInterval`.
