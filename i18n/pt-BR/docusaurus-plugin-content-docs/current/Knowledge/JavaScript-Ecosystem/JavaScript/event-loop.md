---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> Por que o JavaScript precisa de processamento assincrono? Explique callback e event loop

O JavaScript e essencialmente uma linguagem single-thread, pois uma de suas tarefas e modificar a estrutura DOM do navegador. Se multiplas threads modificassem o mesmo no simultaneamente, a situacao se tornaria muito complexa. Para evitar isso, o modelo single-thread foi adotado.

O processamento assincrono e uma solucao viavel no contexto single-thread. Se uma acao precisa esperar 2 segundos, o navegador nao pode ficar parado esperando. Portanto, executa primeiro todo o trabalho sincrono, enquanto as tarefas assincronas sao colocadas na task queue (fila de tarefas).

O ambiente onde o navegador executa o trabalho sincrono pode ser entendido como o call stack. O navegador executa sequencialmente as tarefas no call stack. Quando detecta que o call stack esta vazio, pega as tarefas em espera da task queue e as coloca no call stack para execucao sequencial.

1. O navegador verifica se o call stack esta vazio => Nao => Continua executando tarefas no call stack
2. O navegador verifica se o call stack esta vazio => Sim => Verifica se ha tarefas em espera na task queue => Sim => Move para o call stack para execucao

Esse processo de repeticao continua e o conceito do event loop.

```js
console.log(1);

// 這個非同步的函式就是 callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// 依序印出 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> Por que o `setInterval` nao e preciso em termos de tempo?

1. Como o JavaScript e uma linguagem single-thread (so pode executar uma tarefa por vez, as outras devem esperar na Queue), quando o tempo de execucao do callback do setInterval excede o intervalo configurado, a proxima execucao e atrasada. Por exemplo, se o setInterval esta configurado para executar uma funcao a cada segundo, mas uma acao dentro da funcao leva dois segundos, a proxima execucao sera atrasada em um segundo. Com o acumulo, o timing do setInterval se torna cada vez mais impreciso.

2. Os navegadores ou ambientes de execucao tambem impoem limitacoes. Na maioria dos navegadores principais (Chrome, Firefox, Safari, etc.), o intervalo minimo e de aproximadamente 4 milissegundos. Mesmo configurando para 1 milissegundo, a execucao real ocorre apenas a cada 4 milissegundos.

3. Quando o sistema executa tarefas que consomem muita memoria ou CPU, isso tambem causa atrasos. Acoes como edicao de video ou processamento de imagens tem alta probabilidade de causar atrasos.

4. O JavaScript possui um mecanismo de Garbage Collection. Se dentro da funcao do setInterval forem criados muitos objetos que nao sao mais usados apos a execucao, eles serao coletados pelo GC, o que tambem causa atrasos.

### Alternativas

#### requestAnimationFrame

Se atualmente o `setInterval` e usado para implementacao de animacoes, pode-se considerar usar `requestAnimationFrame` como substituto.

- Sincronizado com o repaint do navegador: Executado quando o navegador esta pronto para desenhar um novo frame. E muito mais preciso do que tentar adivinhar o momento do repaint com setInterval ou setTimeout.
- Performance: Por estar sincronizado com o repaint, nao e executado quando o navegador considera que nao precisa repintar. Isso economiza recursos de computacao, especialmente quando a aba nao esta em foco ou esta minimizada.
- Limitacao automatica: Ajusta automaticamente a frequencia de execucao de acordo com o dispositivo e a situacao, normalmente 60 frames por segundo.
- Parametro temporal de alta precisao: Pode receber um parametro temporal de alta precisao (tipo DOMHighResTimeStamp, com precisao de microssegundos) para controlar animacoes ou outras operacoes sensiveis ao tempo com maior precisao.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // 如果元素還沒有到達目的地，繼續動畫
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` atualiza a posicao do elemento a cada frame (normalmente 60 frames por segundo) ate atingir 500 pixels. Este metodo alcanca um efeito de animacao mais suave e natural do que o `setInterval`.
