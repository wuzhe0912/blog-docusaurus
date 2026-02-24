---
id: state-management-vue-pinia-store-patterns
title: 'Паттерны реализации Pinia Store'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> Выбирайте стиль store по сложности: Options API для простых store, Setup-синтаксис для сценариев с активной композицией.

---

## 1. Фокус на интервью

1. Синтаксис Options vs Setup store
2. Особенности реактивности и типизации
3. Выбор паттерна под сценарий

## 2. Паттерн Options store

```ts
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubled: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count += 1;
    },
  },
});
```

Подходит для простых и явных state-модулей.

## 3. Паттерн Setup store

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value += 1;
  }

  return { count, doubled, increment };
});
```

Подходит, когда нужны примитивы composition API напрямую (`watch`, `computed`, общие composable'ы).

## 4. Руководство по выбору паттерна

Используйте Options-синтаксис, когда:

- Логика store прямолинейная
- Команда предпочитает консистентность object-style

Используйте Setup-синтаксис, когда:

- Нужны продвинутые композиционные паттерны
- Состояние строится из нескольких composable'ов
- Нужен более тонкий контроль реактивных примитивов

## 5. Частые подводные камни

- Случайный возврат нереактивных примитивов в setup store
- Смешение слишком многих зон ответственности в одном store
- Случайное повторное использование ID store

## 6. Краткое резюме для интервью

> Я выбираю синтаксис store по сложности и командной ясности. Options-синтаксис хорош для простых доменных store, а setup-синтаксис лучше для логики с активным использованием composable'ов.
