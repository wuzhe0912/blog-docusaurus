---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> O que sao watch e watchEffect?

`watch` e `watchEffect` sao duas APIs da Composition API do Vue 3 usadas para observar mudancas em dados reativos.

### watch

**Definicao**: Especifica explicitamente a fonte de dados a ser observada, executando uma funcao callback quando os dados mudam.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Observar uma unica fonte de dados
watch(count, (newValue, oldValue) => {
  console.log(`count mudou de ${oldValue} para ${newValue}`);
});

// Observar multiplas fontes de dados
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count ou message mudou');
});
</script>
```

### watchEffect

**Definicao**: Rastreia automaticamente os dados reativos usados na funcao callback, executando automaticamente quando esses dados mudam.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Rastreia automaticamente count e message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // Quando count ou message muda, executa automaticamente
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> Principais diferencas entre watch e watchEffect

### 1. Especificacao da Fonte de Dados

**watch**: Especifica explicitamente os dados a observar

```typescript
const count = ref(0);
const message = ref('Hello');

// Especifica explicitamente observar count
watch(count, (newVal, oldVal) => {
  console.log('count mudou');
});

// Especifica explicitamente observar multiplos dados
watch([count, message], ([newCount, newMessage]) => {
  console.log('count ou message mudou');
});
```

**watchEffect**: Rastreia automaticamente os dados usados

```typescript
const count = ref(0);
const message = ref('Hello');

// Rastreia automaticamente count e message (pois sao usados no callback)
watchEffect(() => {
  console.log(count.value); // Rastreia count automaticamente
  console.log(message.value); // Rastreia message automaticamente
});
```

### 2. Momento de Execucao

**watch**: Execucao lazy por padrao, executa apenas quando os dados mudam

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('Executou'); // Executa apenas quando count muda
});

count.value = 1; // Dispara execucao
```

**watchEffect**: Executa imediatamente, depois rastreia mudancas

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

**watchEffect**: Nao pode acessar o valor antigo

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // So pode acessar o valor atual
  // Nao e possivel obter o valor antigo
});
```

### 4. Parar de Observar

**watch**: Retorna funcao de parada

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// Parar de observar
stopWatch();
```

**watchEffect**: Retorna funcao de parada

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

3. **Necessidade de execucao lazy (apenas quando muda)**
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

1. **Rastreamento automatico de multiplos dados relacionados**
   ```typescript
   watchEffect(() => {
     // Rastreia automaticamente todos os dados reativos usados
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **Nao necessita do valor antigo**
   ```typescript
   watchEffect(() => {
     console.log(`Contagem atual: ${count.value}`);
   });
   ```

3. **Necessidade de execucao imediata**
   ```typescript
   watchEffect(() => {
     // Executa imediatamente, depois rastreia mudancas
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> Perguntas Comuns de Entrevista

### Pergunta 1: Diferenca Basica

Explique a ordem de execucao e resultado do seguinte codigo.

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

// watch: execucao lazy, nao executa imediatamente
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect: executa imediatamente
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // Saida imediata: watchEffect: 0 Hello
});

count.value = 1;
// Dispara watch: watch: 1
// Dispara watchEffect: watchEffect: 1 Hello

message.value = 'World';
// watch nao observa message, nao executa
// watchEffect observa message, executa: watchEffect: 1 World
```

**Ordem de saida**:
1. `watchEffect: 0 Hello` (execucao imediata)
2. `watch: 1` (count mudou)
3. `watchEffect: 1 Hello` (count mudou)
4. `watchEffect: 1 World` (message mudou)

**Diferencas-chave**:
- `watch` execucao lazy, executa apenas quando os dados observados mudam
- `watchEffect` executa imediatamente, depois rastreia todos os dados usados

</details>

### Pergunta 2: Acesso ao Valor Antigo

Explique como obter o valor antigo ao usar `watchEffect`.

<details>
<summary>Clique para ver a resposta</summary>

**Problema**: `watchEffect` nao pode acessar o valor antigo diretamente

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // So pode acessar o valor atual
  // Nao e possivel obter o valor antigo
});
```

**Solucao 1: Usar ref para armazenar o valor antigo**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`Mudou de ${prevCount.value} para ${count.value}`);
  prevCount.value = count.value; // Atualizar valor antigo
});
```

**Solucao 2: Usar watch (se precisar do valor antigo)**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Mudou de ${oldVal} para ${newVal}`);
});
```

**Recomendacao**:
- Se precisar do valor antigo, prefira usar `watch`
- `watchEffect` e adequado para cenarios que nao necessitam do valor antigo

</details>

### Pergunta 3: Escolher watch ou watchEffect?

Explique qual deve ser usado nos seguintes cenarios: `watch` ou `watchEffect`.

```typescript
// Cenario 1: Observar mudanca de ID do usuario, recarregar dados
const userId = ref(1);
// ?

// Cenario 2: Quando validacao do formulario passa, habilitar botao de envio automaticamente
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// Cenario 3: Observar palavra-chave de busca, executar busca (com debounce)
const searchQuery = ref('');
// ?
```

<details>
<summary>Clique para ver a resposta</summary>

**Cenario 1: Observar ID do Usuario**

```typescript
const userId = ref(1);

// ✅ Usar watch: especifica explicitamente os dados a observar
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Cenario 2: Validacao de Formulario**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// ✅ Usar watchEffect: rastreia automaticamente dados relacionados
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Cenario 3: Busca (com debounce)**

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

**Principios de escolha**:
- Especificar explicitamente dados a observar → `watch`
- Rastrear automaticamente multiplos dados relacionados → `watchEffect`
- Necessita valor antigo ou controle fino → `watch`
- Necessita execucao imediata → `watchEffect`

</details>

## 5. Best Practices

> Melhores Praticas

### Praticas Recomendadas

```typescript
// 1. Usar watch ao especificar explicitamente dados a observar
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. Usar watchEffect ao rastrear automaticamente multiplos dados relacionados
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

### Praticas a Evitar

```typescript
// 1. Nao realizar operacoes assincronas no watchEffect sem tratar limpeza
watchEffect(async () => {
  const data = await fetchData(); // ❌ Pode causar vazamento de memoria
  // ...
});

// 2. Nao usar watchEffect excessivamente
// Se so precisa observar dados especificos, watch e mais explicito
watchEffect(() => {
  console.log(count.value); // ⚠️ Se so precisa observar count, watch e mais adequado
});

// 3. Nao modificar dados observados no watchEffect (pode causar loop infinito)
watchEffect(() => {
  count.value++; // ❌ Pode causar loop infinito
});
```

## 6. Interview Summary

> Resumo para Entrevista

### Memorizacao Rapida

**watch**:
- Especifica explicitamente dados a observar
- Execucao lazy (padrao)
- Pode acessar valor antigo
- Adequado para cenarios que necessitam controle fino

**watchEffect**:
- Rastreia automaticamente dados usados
- Executa imediatamente
- Nao pode acessar valor antigo
- Adequado para rastrear automaticamente multiplos dados relacionados

**Principios de escolha**:
- Especificar observacao explicitamente → `watch`
- Rastreamento automatico → `watchEffect`
- Necessita valor antigo → `watch`
- Necessita execucao imediata → `watchEffect`

### Exemplo de Resposta para Entrevista

**P: Qual e a diferenca entre watch e watchEffect?**

> "watch e watchEffect sao ambas APIs do Vue 3 para observar mudancas em dados reativos. As principais diferencas incluem: 1) Fonte de dados: watch necessita especificar explicitamente os dados a observar, watchEffect rastreia automaticamente dados reativos usados no callback; 2) Momento de execucao: watch executa lazy por padrao, apenas quando os dados mudam, watchEffect executa imediatamente e depois rastreia mudancas; 3) Acesso ao valor antigo: watch pode acessar o valor antigo, watchEffect nao; 4) Cenarios de uso: watch e adequado para cenarios que necessitam especificar dados ou valor antigo, watchEffect e adequado para rastrear automaticamente multiplos dados relacionados."

**P: Quando usar watch? Quando usar watchEffect?**

> "Usar watch quando: 1) Necessita especificar explicitamente dados a observar; 2) Necessita acessar valor antigo; 3) Necessita execucao lazy; 4) Necessita controle mais fino (como opcoes immediate, deep). Usar watchEffect quando: 1) Rastrear automaticamente multiplos dados relacionados; 2) Nao necessita valor antigo; 3) Necessita execucao imediata. Em geral, se so precisa observar dados especificos, watch e mais explicito; se precisa rastrear automaticamente multiplos dados, watchEffect e mais conveniente."

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
