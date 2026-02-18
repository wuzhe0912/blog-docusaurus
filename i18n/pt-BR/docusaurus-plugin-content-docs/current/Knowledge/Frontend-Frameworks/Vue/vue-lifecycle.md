---
id: vue-lifecycle
title: '[Medium] Hooks de Ciclo de Vida do Vue'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> Explique os hooks de ciclo de vida do Vue (incluindo Vue 2 e Vue 3)

Os componentes Vue passam por uma série de processos desde a criação até a destruição. Durante esses processos, funções específicas são chamadas automaticamente - essas funções são os "hooks de ciclo de vida". Entender o ciclo de vida é muito importante para compreender o comportamento dos componentes.

### Diagrama do Ciclo de Vida do Vue

```
Fase de Criação → Fase de Montagem → Fase de Atualização → Fase de Desmontagem
      ↓                ↓                  ↓                    ↓
   Created          Mounted            Updated             Unmounted
```

### Tabela Comparativa Vue 2 vs Vue 3

| Vue 2 (Options API) | Vue 3 (Options API) | Vue 3 (Composition API) | Descrição                         |
| ------------------- | ------------------- | ----------------------- | --------------------------------- |
| `beforeCreate`      | `beforeCreate`      | `setup()`               | Antes da inicialização da instância |
| `created`           | `created`           | `setup()`               | Instância do componente criada    |
| `beforeMount`       | `beforeMount`       | `onBeforeMount`         | Antes de montar no DOM            |
| `mounted`           | `mounted`           | `onMounted`             | Após montar no DOM                |
| `beforeUpdate`      | `beforeUpdate`      | `onBeforeUpdate`        | Antes da atualização dos dados    |
| `updated`           | `updated`           | `onUpdated`             | Após a atualização dos dados      |
| `beforeDestroy`     | `beforeUnmount`     | `onBeforeUnmount`       | Antes da desmontagem do componente |
| `destroyed`         | `unmounted`         | `onUnmounted`           | Após a desmontagem do componente  |
| `activated`         | `activated`         | `onActivated`           | Componente keep-alive ativado     |
| `deactivated`       | `deactivated`       | `onDeactivated`         | Componente keep-alive desativado  |
| `errorCaptured`     | `errorCaptured`     | `onErrorCaptured`       | Ao capturar erro de componente filho |

### 1. Fase de Criação (Creation Phase)

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // ❌ Neste momento data e methods ainda não foram inicializados
    console.log('beforeCreate');
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // ✅ Neste momento data, computed, methods e watch já foram inicializados
    console.log('created');
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined (ainda não montado no DOM)

    // ✅ Adequado para enviar requisições de API aqui
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**Quando usar:**

- `beforeCreate`: Raramente usado, geralmente para desenvolvimento de plugins
- `created`:
  - ✅ Enviar requisições de API
  - ✅ Inicializar dados não reativos
  - ✅ Configurar event listeners
  - ❌ Não é possível manipular o DOM (ainda não montado)

### 2. Fase de Montagem (Mounting Phase)

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Vue Lifecycle',
    };
  },

  beforeMount() {
    // ❌ Virtual DOM criado, mas ainda não renderizado no DOM real
    console.log('beforeMount');
    console.log(this.$el); // Existe, mas o conteúdo é antigo (se houver)
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    // ✅ Componente montado no DOM, pode manipular elementos DOM
    console.log('mounted');
    console.log(this.$el); // Elemento DOM real
    console.log(this.$refs.myElement); // Pode acessar ref

    // ✅ Adequado para manipular o DOM aqui
    this.initCanvas();

    // ✅ Adequado para usar bibliotecas DOM de terceiros
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // Desenhar no canvas...
    },

    initChart() {
      // Inicializar biblioteca de gráficos (como Chart.js, ECharts)
      new Chart(this.$refs.myCanvas, {
        type: 'bar',
        data: {
          /* ... */
        },
      });
    },
  },
};
</script>
```

**Quando usar:**

- `beforeMount`: Raramente usado
- `mounted`:
  - ✅ Manipular elementos DOM
  - ✅ Inicializar bibliotecas DOM de terceiros (como gráficos, mapas)
  - ✅ Configurar event listeners que necessitam do DOM
  - ✅ Iniciar timers
  - ⚠️ **Atenção**: O `mounted` dos componentes filhos executa antes do `mounted` do componente pai

### 3. Fase de Atualização (Updating Phase)

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>Contagem: {{ count }}</p>
    <button @click="count++">Incrementar</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  beforeUpdate() {
    // ✅ Dados atualizados, mas DOM ainda não atualizado
    console.log('beforeUpdate');
    console.log('data count:', this.count); // Novo valor
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Valor antigo

    // Pode acessar o estado do DOM antes da atualização aqui
  },

  updated() {
    // ✅ Dados e DOM atualizados
    console.log('updated');
    console.log('data count:', this.count); // Novo valor
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Novo valor

    // ⚠️ Atenção: não modifique dados aqui, causa loop infinito
    // this.count++; // ❌ Errado! Causa atualização infinita
  },
};
</script>
```

**Quando usar:**

- `beforeUpdate`: Necessita acessar o estado antigo do DOM antes da atualização
- `updated`:
  - ✅ Operações necessárias após atualização do DOM (como recalcular dimensões de elementos)
  - ❌ **Não modifique dados aqui**, causa loop de atualização infinito
  - ⚠️ Se precisa executar operações após mudança de dados, use `watch` ou `nextTick`

### 4. Fase de Desmontagem (Unmounting Phase)

#### `beforeUnmount` / `unmounted` (Vue 3) / `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    // Configurar timer
    this.timer = setInterval(() => {
      console.log('Timer executando...');
    }, 1000);

    // Criar conexão WebSocket
    this.ws = new WebSocket('ws://example.com');
    this.ws.onmessage = (event) => {
      console.log('Mensagem recebida:', event.data);
    };

    // Configurar event listeners
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },

  beforeUnmount() {
    // Vue 3 usa beforeUnmount
    // Vue 2 usa beforeDestroy
    console.log('beforeUnmount');
    // Componente prestes a ser destruído, mas ainda pode acessar dados é DOM
  },

  unmounted() {
    // Vue 3 usa unmounted
    // Vue 2 usa destroyed
    console.log('unmounted');

    // ✅ Limpar timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // ✅ Fechar conexão WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // ✅ Remover event listeners
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },

  methods: {
    handleResize() {
      console.log('Tamanho da janela mudou');
    },
    handleClick() {
      console.log('Evento de clique');
    },
  },
};
</script>
```

**Quando usar:**

- `beforeUnmount` / `beforeDestroy`: Raramente usado
- `unmounted` / `destroyed`:
  - ✅ Limpar timers (`setInterval`, `setTimeout`)
  - ✅ Remover event listeners
  - ✅ Fechar conexões WebSocket
  - ✅ Cancelar requisições API pendentes
  - ✅ Limpar instâncias de bibliotecas de terceiros

### 5. Componente Especial: KeepAlive

#### O que é `<KeepAlive>`?

`<KeepAlive>` é um componente built-in do Vue, cuja função principal e **cachear instâncias de componentes**, evitando que sejam destruídos ao trocar.

- **Comportamento padrão**: Quando um componente troca (por exemplo, troca de rota ou `v-if`), o Vue destroi o componente antigo e cria um novo.
- **Comportamento KeepAlive**: Componentes envolvidos por `<KeepAlive>` têm seu estado preservado em memória ao trocar, sem serem destruídos.

#### Funcionalidades e Características Principais

1. **Cache de estado**: Preserva conteúdo de formulários, posição de scroll, etc.
2. **Otimização de performance**: Evita renderização repetida e requisições de API duplicadas.
3. **Ciclo de vida exclusivo**: Fornece dois hooks exclusivos: `activated` e `deactivated`.

#### Cenários de Uso

1. **Troca entre abas**: Como tabs em sistemas de administração.
2. **Troca entre lista e detalhes**: Ao retornar da página de detalhes, preservar posição de scroll e filtros da lista.
3. **Formulários complexos**: Ao trocar de página durante preenchimento, o conteúdo do formulário não deve ser perdido.

#### Exemplo de Uso

```vue
<template>
  <KeepAlive include="UserList,ProductList">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

- `include`: Apenas componentes com nomes correspondentes serão cacheados.
- `exclude`: Componentes com nomes correspondentes **não serão** cacheados.
- `max`: Número máximo de instâncias de componentes cacheadas.

### 6. Hooks de Ciclo de Vida Especiais

#### `activated` / `deactivated` (usados com `<KeepAlive>`)

```vue
<template>
  <div>
    <button @click="toggleComponent">Trocar Componente</button>

    <!-- keep-alive cacheia o componente, não recria -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
// ChildComponent.vue
export default {
  name: 'ChildComponent',

  mounted() {
    console.log('mounted - executa apenas uma vez');
  },

  activated() {
    console.log('activated - executa cada vez que o componente e ativado');
    // ✅ Adequado para recarregar dados aqui
    this.refreshData();
  },

  deactivated() {
    console.log('deactivated - executa cada vez que o componente e desativado');
    // ✅ Adequado para pausar operações aqui (como reprodução de vídeo)
    this.pauseVideo();
  },

  unmounted() {
    console.log('unmounted - não executa (cacheado pelo keep-alive)');
  },

  methods: {
    refreshData() {
      // Recarregar dados
    },
    pauseVideo() {
      // Pausar reprodução de vídeo
    },
  },
};
</script>
```

#### `errorCaptured` (Tratamento de Erros)

```vue
<script>
// ParentComponent.vue
export default {
  errorCaptured(err, instance, info) {
    console.error('Erro capturado do componente filho:', err);
    console.log('Componente de origem do erro:', instance);
    console.log('Informação do erro:', info);

    // Retornar false impede que o erro continue propagando
    return false;
  },
};
</script>
```

### Ciclo de Vida com Composition API do Vue 3

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() em si equivale a beforeCreate + created
console.log('setup executando');

onBeforeMount(() => {
  console.log('onBeforeMount');
});

onMounted(() => {
  console.log('onMounted');
  // ✅ Manipular DOM, inicializar bibliotecas
});

onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});

onUpdated(() => {
  console.log('onUpdated');
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
});

onUnmounted(() => {
  console.log('onUnmounted');
  // ✅ Limpar recursos
});

onActivated(() => {
  console.log('onActivated');
});

onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err, instance, info) => {
  console.error('Erro:', err);
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> Qual é a ordem de execução dos hooks de ciclo de vida de componentes pai e filho?

Esta é uma pergunta de entrevista muito importante. Entender a ordem de execução do ciclo de vida entre componentes pai e filho ajuda a compreender a interação entre componentes.

### Ordem de Execução

```
Pai beforeCreate
→ Pai created
→ Pai beforeMount
→ Filho beforeCreate
→ Filho created
→ Filho beforeMount
→ Filho mounted
→ Pai mounted
```

**Ponto de memorização: "Criação de fora para dentro, montagem de dentro para fora"**

### Exemplo Prático

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Componente Pai</h1>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: { ChildComponent },

  beforeCreate() {
    console.log('1. Pai beforeCreate');
  },
  created() {
    console.log('2. Pai created');
  },
  beforeMount() {
    console.log('3. Pai beforeMount');
  },
  mounted() {
    console.log('8. Pai mounted');
  },
  beforeUpdate() {
    console.log('Pai beforeUpdate');
  },
  updated() {
    console.log('Pai updated');
  },
  beforeUnmount() {
    console.log('9. Pai beforeUnmount');
  },
  unmounted() {
    console.log('12. Pai unmounted');
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>Componente Filho</h2>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',

  beforeCreate() {
    console.log('4. Filho beforeCreate');
  },
  created() {
    console.log('5. Filho created');
  },
  beforeMount() {
    console.log('6. Filho beforeMount');
  },
  mounted() {
    console.log('7. Filho mounted');
  },
  beforeUpdate() {
    console.log('Filho beforeUpdate');
  },
  updated() {
    console.log('Filho updated');
  },
  beforeUnmount() {
    console.log('10. Filho beforeUnmount');
  },
  unmounted() {
    console.log('11. Filho unmounted');
  },
};
</script>
```

### Ordem de Execução por Fase

#### 1. Fase de Criação e Montagem

```
1. Pai beforeCreate
2. Pai created
3. Pai beforeMount
4. Filho beforeCreate
5. Filho created
6. Filho beforeMount
7. Filho mounted        ← Componente filho monta primeiro
8. Pai mounted          ← Componente pai monta depois
```

**Motivo**: O componente pai precisa esperar que os componentes filhos completem a montagem para garantir que toda a árvore de componentes foi renderizada completamente.

#### 2. Fase de Atualização

```
Mudança de dados do componente pai:
1. Pai beforeUpdate
2. Filho beforeUpdate  ← Se o componente filho usa dados do pai
3. Filho updated
4. Pai updated

Mudança de dados do componente filho:
1. Filho beforeUpdate
2. Filho updated
(Componente pai não dispara atualização)
```

#### 3. Fase de Desmontagem

```
9. Pai beforeUnmount
10. Filho beforeUnmount
11. Filho unmounted     ← Componente filho desmonta primeiro
12. Pai unmounted       ← Componente pai desmonta depois
```

### Caso com Múltiplos Componentes Filhos

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-a />
    <child-b />
    <child-c />
  </div>
</template>
```

Ordem de execução:

```
1. Pai beforeCreate
2. Pai created
3. Pai beforeMount
4. FilhoA beforeCreate
5. FilhoA created
6. FilhoA beforeMount
7. FilhoB beforeCreate
8. FilhoB created
9. FilhoB beforeMount
10. FilhoC beforeCreate
11. FilhoC created
12. FilhoC beforeMount
13. FilhoA mounted
14. FilhoB mounted
15. FilhoC mounted
16. Pai mounted
```

### Por que está ordem?

#### Fase de Montagem (Mounting)

O processo de montagem do Vue é semelhante a uma "travessia em profundidade":

1. Componente pai inicia a criação
2. Ao analisar o template, descobre componentes filhos
3. Completa a montagem dos componentes filhos primeiro
4. Após todos os filhos serem montados, o pai completa a montagem

```
Componente pai prepara montagem
    ↓
Descobre componente filho
    ↓
Componente filho monta completamente (beforeMount → mounted)
    ↓
Componente pai completa montagem (mounted)
```

#### Fase de Desmontagem (Unmounting)

A ordem de desmontagem e "primeiro notifica o pai, depois desmonta os filhos em ordem":

```
Componente pai prepara desmontagem (beforeUnmount)
    ↓
Notifica componentes filhos (beforeUnmount)
    ↓
Componentes filhos completam desmontagem (unmounted)
    ↓
Componente pai completa desmontagem (unmounted)
```

### Cenários de Aplicação Prática

#### Cenário 1: Componente pai precisa esperar que dados dos filhos sejam carregados

```vue
<!-- ParentComponent.vue -->
<script>
export default {
  data() {
    return {
      childrenReady: false,
    };
  },

  mounted() {
    // ✅ Neste ponto todos os componentes filhos já foram montados
    console.log('Todos os componentes filhos estao prontos');
    this.childrenReady = true;
  },
};
</script>
```

#### Cenário 2: Componente filho precisa acessar dados fornecidos pelo pai

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  inject: ['parentData'], // Recebe dados fornecidos pelo componente pai

  created() {
    // ✅ Neste ponto pode acessar dados do pai (created do pai já executou)
    console.log('Dados do pai:', this.parentData);
  },
};
</script>
```

#### Cenário 3: Evitar acessar componentes filhos não montados no `mounted`

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="child" />
</template>

<script>
export default {
  mounted() {
    // ✅ Neste ponto o componente filho já está montado, acesso seguro
    this.$refs.child.someMethod();
  },
};
</script>
```

### Erros Comuns

#### Erro 1: Acessar ref de componente filho no `created` do pai

```vue
<!-- ❌ Errado -->
<script>
export default {
  created() {
    // Neste momento o componente filho ainda não foi criado
    console.log(this.$refs.child); // undefined
  },
};
</script>

<!-- ✅ Correto -->
<script>
export default {
  mounted() {
    // Neste momento o componente filho já está montado
    console.log(this.$refs.child); // Pode acessar
  },
};
</script>
```

#### Erro 2: Assumir que o componente filho monta antes do pai

```vue
<!-- ❌ Errado -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // Assumir que o pai já está montado (errado!)
    this.$parent.someMethod(); // Pode dar erro
  },
};
</script>

<!-- ✅ Correto -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // Usar $nextTick para garantir que o pai também está montado
    this.$nextTick(() => {
      this.$parent.someMethod();
    });
  },
};
</script>
```

## 3. When should we use each lifecycle hook?

> Quando devemos usar cada hook de ciclo de vida?

Aqui está um resumo dos melhores cenários de uso para cada hook de ciclo de vida.

### Tabela Resumo de Cenários de Uso

| Ciclo de Vida | Uso Comum                    | Conteúdo Acessível                |
| ------------- | ---------------------------- | --------------------------------- |
| `created`     | Requisições API, inicializar dados | ✅ data, methods ❌ DOM        |
| `mounted`     | Manipular DOM, inicializar bibliotecas | ✅ data, methods, DOM        |
| `updated`     | Operações após atualização do DOM | ✅ Novo DOM                    |
| `unmounted`   | Limpar recursos              | ✅ Limpar timers, eventos         |
| `activated`   | Ativação do keep-alive       | ✅ Recarregar dados               |

### Exemplos de Aplicação Prática

#### 1. `created`: Enviar Requisições API

```vue
<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null,
    };
  },

  created() {
    // ✅ Adequado para enviar requisições de API aqui
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2. `mounted`: Inicializar Bibliotecas de Terceiros

```vue
<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartInstance: null,
    };
  },

  mounted() {
    // ✅ Adequado para inicializar bibliotecas que necessitam do DOM
    this.initChart();
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: 'Dados de Vendas' },
        xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: {},
        series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
      });
    },
  },

  unmounted() {
    // ✅ Lembre-se de limpar a instância do gráfico
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>
```

#### 3. `unmounted`: Limpar Recursos

```vue
<script>
export default {
  data() {
    return {
      intervalId: null,
      observer: null,
    };
  },

  mounted() {
    // Iniciar timer
    this.intervalId = setInterval(() => {
      console.log('Executando...');
    }, 1000);

    // Criar Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries);
    });
    this.observer.observe(this.$el);

    // Escutar eventos globais
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    // ✅ Limpar timer
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // ✅ Limpar Observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // ✅ Remover event listeners
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      console.log('Tamanho da janela mudou');
    },
  },
};
</script>
```

### Dicas de Memorização

1. **`created`**: "Criação concluída, pode usar dados" → Requisições API
2. **`mounted`**: "Montagem concluída, pode usar DOM" → Manipulação DOM, bibliotecas de terceiros
3. **`updated`**: "Atualização concluída, DOM sincronizado" → Operações após atualização do DOM
4. **`unmounted`**: "Desmontagem concluída, lembre de limpar" → Limpar recursos

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)
- [Composition API: Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
