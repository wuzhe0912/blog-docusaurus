---
id: state-management-vue-pinia-setup
title: 'Настройка и конфигурация Pinia'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> Практическая настройка Pinia для масштабируемых Vue 3-проектов.

---

## 1. Фокус на интервью

1. Почему Pinia вместо Vuex во Vue 3
2. Базовые шаги интеграции
3. Рекомендуемая структура проекта

## 2. Почему Pinia

- Официальный state management для Vue 3
- Более чистый API (без обязательных mutations)
- Сильный TypeScript inference
- Лучшая модульная архитектура и DX

## 3. Базовая настройка

```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

### С плагином персистентности

```ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

## 4. Рекомендация по структуре store

```text
src/stores/
  auth/
    auth.store.ts
  user/
    user.store.ts
  catalog/
    catalog.store.ts
```

Организуйте по доменам, а не по техническим типам.

## 5. Командные конвенции

- ID store должны быть стабильными и уникальными
- Экспортируйте один `useXxxStore` на файл
- Держите чистые производные значения в getters
- Держите API-оркестрацию в composable'ах/services

## 6. Краткое резюме для интервью

> Я настраиваю Pinia как модульный state-слой с ориентацией на домены, добавляю персистентность только там, где нужно, и стандартизирую именование и границы store для масштабируемости команды.
