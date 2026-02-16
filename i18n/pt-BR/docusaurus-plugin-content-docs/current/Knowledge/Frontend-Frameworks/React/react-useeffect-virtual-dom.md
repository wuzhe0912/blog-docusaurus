---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect e Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> O que é `useEffect`?

### Conceito Central

`useEffect` é o Hook responsável por gerenciar efeitos colaterais (side effects) em componentes funcionais do React. Ele executa requisições de dados assíncronas, assinaturas, manipulações do DOM ou sincronização manual de estado após a renderização do componente, correspondendo aos métodos de ciclo de vida `componentDidMount`, `componentDidUpdate` e `componentWillUnmount` de componentes de classe.

### Usos Comuns

- Buscar dados remotos e atualizar o estado do componente
- Manter assinaturas ou listeners de eventos (como `resize`, `scroll`)
- Interagir com APIs do navegador (como atualizar `document.title`, operar `localStorage`)
- Limpar recursos deixados pela renderização anterior (como cancelar requisições, remover listeners)

<details>
<summary>Clique para expandir o exemplo de uso básico</summary>

```javascript
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Cliques: ${count}`;
  });

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      Clique aqui
    </button>
  );
}
```

</details>

## 2. When does `useEffect` run?

> Quando o `useEffect` é executado?

O segundo parâmetro do `useEffect` é o **array de dependências (dependency array)**, usado para controlar o momento de execução do efeito colateral. O React compara cada valor do array um por um e, ao detectar mudanças, executa novamente o efeito colateral, acionando a função de limpeza antes da próxima execução.

### 2.1 Padrões Comuns de Dependência

```javascript
// 1. Executar após cada renderização (incluindo a primeira)
useEffect(() => {
  console.log('Qualquer mudança de state aciona este efeito');
});

// 2. Executar apenas uma vez na montagem inicial
useEffect(() => {
  console.log('Executado apenas quando o componente é montado');
}, []);

// 3. Especificar variáveis de dependência
useEffect(() => {
  console.log('Acionado apenas quando selectedId muda');
}, [selectedId]);
```

### 2.2 Função de Limpeza e Liberação de Recursos

```javascript
useEffect(() => {
  const handler = () => {
    console.log('Monitorando');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('Listener removido');
  };
}, []);
```

O exemplo acima usa a função de limpeza para remover o listener de eventos. O React executa a função de limpeza antes da desmontagem do componente ou antes da atualização das variáveis de dependência, garantindo que não haja vazamentos de memória nem listeners duplicados.

## 3. What is the difference between Real DOM and Virtual DOM?

> Qual é a diferença entre Real DOM e Virtual DOM?

| Aspecto | Real DOM | Virtual DOM |
| -------- | -------------------------------- | ------------------------------ |
| Estrutura | Nós físicos mantidos pelo navegador | Nós descritos por objetos JavaScript |
| Custo de atualização | Manipulação direta aciona layout e repaint, custo alto | Calcula diferenças primeiro e aplica em lote, custo baixo |
| Estratégia de atualização | Reflete imediatamente na tela | Cria nova árvore em memória e compara diferenças |
| Extensibilidade | Requer controle manual do fluxo de atualização | Pode inserir lógica intermediária (Diff, lote) |

### Por que o React usa Virtual DOM

```javascript
// Ilustração simplificada do fluxo (não é código-fonte real do React)
function renderWithVirtualDOM(newVNode, container) {
  const prevVNode = container.__vnode;
  const patches = diff(prevVNode, newVNode);
  applyPatches(container, patches);
  container.__vnode = newVNode;
}
```

O Virtual DOM permite que o React faça o Diff em memória, obtenha a lista mínima de atualizações e depois sincronize uma única vez com o DOM real, evitando reflows e repaints frequentes.

## 4. How to coordinate `useEffect` and Virtual DOM?

> Como o `useEffect` e o Virtual DOM trabalham juntos?

O fluxo de renderização do React é dividido em Render Phase e Commit Phase. O ponto-chave da cooperação entre `useEffect` e Virtual DOM é: os efeitos colaterais devem esperar a atualização do DOM real ser concluída antes de serem executados.

### Render Phase (Fase de Renderização)

- O React cria o novo Virtual DOM e calcula as diferenças com o Virtual DOM anterior
- Esta fase é uma computação pura, que pode ser interrompida ou re-executada

### Commit Phase (Fase de Commit)

- O React aplica as diferenças ao DOM real
- `useLayoutEffect` é executado de forma síncrona nesta fase, garantindo que o DOM já foi atualizado

### Effect Execution (Momento de Execução dos Efeitos)

- `useEffect` é executado após o término da Commit Phase, quando o navegador termina a pintura
- Isso evita que efeitos colaterais bloqueiem a atualização da tela, melhorando a experiência do usuário

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/profile', { signal: controller.signal })
    .then((res) => res.json())
    .then(setProfile)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Falha ao carregar', error);
      }
    });

  return () => {
    controller.abort(); // Garante o cancelamento da requisição quando as dependências mudam ou o componente desmonta
  };
}, [userId]);
```

## 5. Quiz Time

> Hora do Quiz
> Simulação de cenário de entrevista

### Pergunta: Explique a ordem de execução do código abaixo e escreva o resultado da saída

```javascript
import { useEffect, useState } from 'react';

function Demo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('effect 1');
    return () => {
      console.log('cleanup 1');
    };
  });

  useEffect(() => {
    console.log('effect 2');
  }, [visible]);

  return (
    <>
      <p>Estado: {visible ? 'visível' : 'oculto'}</p>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        Alternar
      </button>
    </>
  );
}
```

<details>
<summary>Clique para ver a resposta</summary>

- Após a renderização inicial, a saída é `effect 1`, `effect 2` em sequência. O primeiro `useEffect` não tem array de dependências, o segundo `useEffect` depende de `visible`, mas o valor inicial `false` ainda faz com que seja executado uma vez.
- Após clicar no botão, `setVisible` é acionado, e na próxima renderização, a função de limpeza da renderização anterior é executada primeiro, produzindo `cleanup 1`, seguido por `effect 1` e `effect 2`.
- Como `visible` muda a cada alternância, `effect 2` é re-executado após cada alternância.

A ordem final de saída é: `effect 1` -> `effect 2` -> (após clicar) `cleanup 1` -> `effect 1` -> `effect 2`.

</details>

## 6. Best Practices

> Melhores Práticas

### Práticas Recomendadas

- Manter o array de dependências com cuidado, usando a regra ESLint `react-hooks/exhaustive-deps`.
- Dividir múltiplos `useEffect` por responsabilidade, reduzindo o acoplamento causado por efeitos colaterais grandes.
- Liberar listeners ou cancelar requisições assíncronas na função de limpeza para evitar vazamentos de memória.
- Usar `useLayoutEffect` quando precisar ler informações de layout imediatamente após a atualização do DOM, mas avaliar o impacto na performance.

### Exemplo: Separando diferentes responsabilidades

```javascript
useEffect(() => {
  document.title = `Usuário atual: ${user.name}`;
}, [user.name]); // Gerencia document.title

useEffect(() => {
  const subscription = chatClient.subscribe(roomId);
  return () => subscription.unsubscribe();
}, [roomId]); // Gerencia conexão da sala de chat
```

## 7. Interview Summary

> Resumo para Entrevistas

### Revisão Rápida

1. `useEffect` controla o momento de execução através do array de dependências, e a função de limpeza é responsável pela liberação de recursos.
2. O Virtual DOM encontra o conjunto mínimo de atualizações através do algoritmo Diff, reduzindo o custo de operações no DOM real.
3. Compreender Render Phase e Commit Phase permite responder com precisão sobre a relação entre efeitos colaterais e o fluxo de renderização.
4. Em entrevistas, pode-se complementar com estratégias de otimização de performance, como atualização em lote, lazy loading e memoization.

### Modelo de Resposta para Entrevistas

> "O React primeiro cria o Virtual DOM durante a renderização, calcula as diferenças e então entra na Commit Phase para atualizar o DOM real. O `useEffect` é executado após o commit ser concluído e o navegador terminar a pintura, sendo adequado para lidar com requisições assíncronas ou listeners de eventos. Basta manter o array de dependências correto e lembrar da função de limpeza para evitar vazamentos de memória e problemas de race condition."

## Reference

> Referências

- [Documentação oficial do React: Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [Documentação oficial do React: Rendering](https://react.dev/learn/rendering)
- [Documentação oficial do React: Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
