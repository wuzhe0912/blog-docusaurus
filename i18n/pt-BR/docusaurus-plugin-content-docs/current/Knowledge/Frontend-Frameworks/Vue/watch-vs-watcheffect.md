---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> O que são watch e watchEffect?

`watch` e `watchEffect` são duas APIs da Composition API do Vue 3 usadas para observar mudanças em dados reativos.

### watch

**Definição**: Específica explicitamente a fonte de dados a ser observada, executando uma função callback quando os dados mudam.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Observar uma única fonte de dados
watch(count, (newValue, oldValue) => {
  console.log(`count mudou de ${oldValue} para ${newValue}`);
});

// Observar múltiplas fontes de dados
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count ou message mudou');
});
</script>
```

### watchEffect

**Definição**: Rastreia automaticamente os dados reativos usados na função callback, executando automaticamente quando esses dados mudam.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Rastreia automaticamente count é message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // Quando count ou message muda, executa automaticamente
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> Principais diferenças entre watch e watchEffect

### 1. Específicacao da Fonte de Dados

**watch**: Específica explicitamente os dados a observar

```typescript
const count = ref(0);
const message = ref('Hello');

// Específica explicitamente observar count
watch(count, (newVal, oldVal) => {
  console.log('count mudou');
});

// Específica explicitamente observar múltiplos dados
watch([count, message], ([newCount, newMessage]) => {
  console.log('count ou message mudou');
});
```

**watchEffect**: Rastreia automaticamente os dados usados

```typescript
const count = ref(0);
const message = ref('Hello');

// Rastreia automaticamente count é message (pois são usados no callback)
watchEffect(() => {
  console.log(count.value); // Rastreia count automaticamente
  console.log(message.value); // Rastreia message automaticamente
});
```

### 2. Momento de Execução

**watch**: Execução lazy por padrão, executa apenas quando os dados mudam

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('Executou'); // Executa apenas quando count muda
});

count.value = 1; // Dispara execução
```

**watchEffect**: Executa imediatamente, depois rastreia mudanças

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('Executou'); // Executa imediatamente uma vez
  console.log(count.value);
});

count.value = 1; // Executa novamente
```

### 3. Acesso ao Valor Antigo

**watch**: Pode acessar o valor antigo

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Mudou de ${oldVal} para ${newVal}`);
});
```

**watchEffect**: Não pode acessar o valor antigo

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // só pode acessar o valor atual
  // Não é possível obter o valor antigo
});
```

### 4. Parar de Observar

**watch**: Retorna função de parada

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// Parar de observar
stopWatch();
```

**watchEffect**: Retorna função de parada

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// Parar de observar
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> Quando usar watch? Quando usar watchEffect?

### Quando Usar watch

1. **Necessidade de especificar explicitamente os dados a observar**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **Necessidade de acessar o valor antigo**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`Mudou de ${oldVal} para ${newVal}`);
   });
   ```

3. **Necessidade de execução lazy (apenas quando muda)**
   ```typescript
   watch(searchQuery, (newQuery) => {
     if (newQuery.length > 2) {
       search(newQuery);
     }
   });
   ```

4. **Necessidade de controle mais fino**
   ```typescript
   watch(
     () => user.value.id,
     (newId) => {
       fetchUser(newId);
     },
     { immediate: true, deep: true }
   );
   ```

### Quando Usar watchEffect

1. **Rastreamento automático de múltiplos dados relacionados**
   ```typescript
   watchEffect(() => {
     // Rastreia automaticamente todos os dados reativos usados
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **Não necessita do valor antigo**
   ```typescript
   watchEffect(() => {
     console.log(`Contagem atual: ${count.value}`);
   });
   ```

3. **Necessidade de execução imediata**
   ```typescript
   watchEffect(() => {
     // Executa imediatamente, depois rastreia mudanças
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> Perguntas Comuns de Entrevista

### Pergunta 1: Diferença Básica

Explique a ordem de execução e resultado do seguinte código.

```typescript
const count = ref(0);
const message = ref('Hello');

// watch
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
const count = ref(0);
const message = ref('Hello');

// watch: execução lazy, não executa imediatamente
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect: executa imediatamente
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // Saída imediata: watchEffect: 0 Hello
});

count.value = 1;
// Dispara watch: watch: 1
// Dispara watchEffect: watchEffect: 1 Hello

message.value = 'World';
// watch não observa message, não executa
// watchEffect observa message, executa: watchEffect: 1 World
```

**Ordem de saída**:
1. `watchEffect: 0 Hello` (execução imediata)
2. `watch: 1` (count mudou)
3. `watchEffect: 1 Hello` (count mudou)
4. `watchEffect: 1 World` (message mudou)

**Diferenças-chave**:
- `watch` execução lazy, executa apenas quando os dados observados mudam
- `watchEffect` executa imediatamente, depois rastreia todos os dados usados

</details>

### Pergunta 2: Acesso ao Valor Antigo

Explique como obter o valor antigo ao usar `watchEffect`.

<details>
<summary>Clique para ver a resposta</summary>

**Problema**: `watchEffect` não pode acessar o valor antigo diretamente

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // só pode acessar o valor atual
  // Não é possível obter o valor antigo
});
```

**Solução 1: Usar ref para armazenar o valor antigo**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`Mudou de ${prevCount.value} para ${count.value}`);
  prevCount.value = count.value; // Atualizar valor antigo
});
```

**Solução 2: Usar watch (se precisar do valor antigo)**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Mudou de ${oldVal} para ${newVal}`);
});
```

**Recomendação**:
- Se precisar do valor antigo, prefira usar `watch`
- `watchEffect` é adequado para cenários que não necessitam do valor antigo

</details>

### Pergunta 3: Escolher watch ou watchEffect?

Explique qual deve ser usado nós seguintes cenários: `watch` ou `watchEffect`.

```typescript
// Cenário 1: Observar mudança de ID do usuario, recarregar dados
const userId = ref(1);
// ?

// Cenário 2: Quando validação do formulário passa, habilitar botão de envio automaticamente
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// Cenário 3: Observar palavra-chave de busca, executar busca (com debounce)
const searchQuery = ref('');
// ?
```

<details>
<summary>Clique para ver a resposta</summary>

**Cenário 1: Observar ID do Usuario**

```typescript
const userId = ref(1);

// ✅ Usar watch: específica explicitamente os dados a observar
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Cenário 2: Validação de Formulário**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// ✅ Usar watchEffect: rastreia automaticamente dados relacionados
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Cenário 3: Busca (com debounce)**

```typescript
const searchQuery = ref('');

// ✅ Usar watch: necessita controle mais fino (debounce)
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

**Princípios de escolha**:
- Especificar explicitamente dados a observar → `watch`
- Rastrear automaticamente múltiplos dados relacionados → `watchEffect`
- Necessita valor antigo ou controle fino → `watch`
- Necessita execução imediata → `watchEffect`

</details>

## 5. Best Practices

> Melhores Práticas

### Práticas Recomendadas

```typescript
// 1. Usar watch ao especificar explicitamente dados a observar
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. Usar watchEffect ao rastrear automaticamente múltiplos dados relacionados
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. Usar watch quando precisar do valor antigo
watch(count, (newVal, oldVal) => {
  console.log(`Mudou de ${oldVal} para ${newVal}`);
});

// 4. Lembrar de limpar observadores
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Práticas a Evitar

```typescript
// 1. Não realizar operações assíncronas no watchEffect sem tratar limpeza
watchEffect(async () => {
  const data = await fetchData(); // ❌ Pode causar vazamento de memória
  // ...
});

// 2. Não usar watchEffect excessivamente
// Se só precisa observar dados específicos, watch é mais explícito
watchEffect(() => {
  console.log(count.value); // ⚠️ Se só precisa observar count, watch é mais adequado
});

// 3. Não modificar dados observados no watchEffect (pode causar loop infinito)
watchEffect(() => {
  count.value++; // ❌ Pode causar loop infinito
});
```

## 6. Interview Summary

> Resumo para Entrevista

### Memorização Rápida

**watch**:
- Específica explicitamente dados a observar
- Execução lazy (padrão)
- Pode acessar valor antigo
- Adequado para cenários que necessitam controle fino

**watchEffect**:
- Rastreia automaticamente dados usados
- Executa imediatamente
- Não pode acessar valor antigo
- Adequado para rastrear automaticamente múltiplos dados relacionados

**Princípios de escolha**:
- Especificar observação explicitamente → `watch`
- Rastreamento automático → `watchEffect`
- Necessita valor antigo → `watch`
- Necessita execução imediata → `watchEffect`

### Exemplo de Resposta para Entrevista

**P: Qual é a diferença entre watch e watchEffect?**

> "watch e watchEffect são ambas APIs do Vue 3 para observar mudanças em dados reativos. As principais diferenças incluem: 1) Fonte de dados: watch necessita especificar explicitamente os dados a observar, watchEffect rastreia automaticamente dados reativos usados no callback; 2) Momento de execução: watch executa lazy por padrão, apenas quando os dados mudam, watchEffect executa imediatamente e depois rastreia mudanças; 3) Acesso ao valor antigo: watch pode acessar o valor antigo, watchEffect não; 4) Cenários de uso: watch é adequado para cenários que necessitam especificar dados ou valor antigo, watchEffect é adequado para rastrear automaticamente múltiplos dados relacionados."

**P: Quando usar watch? Quando usar watchEffect?**

> "Usar watch quando: 1) Necessita especificar explicitamente dados a observar; 2) Necessita acessar valor antigo; 3) Necessita execução lazy; 4) Necessita controle mais fino (como opções immediate, deep). Usar watchEffect quando: 1) Rastrear automaticamente múltiplos dados relacionados; 2) Não necessita valor antigo; 3) Necessita execução imediata. Em geral, se só precisa observar dados específicos, watch é mais explícito; se precisa rastrear automaticamente múltiplos dados, watchEffect é mais conveniente."

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
