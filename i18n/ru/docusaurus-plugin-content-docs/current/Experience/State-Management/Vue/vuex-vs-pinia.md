---
id: state-management-vue-vuex-vs-pinia
title: 'Сравнение Vuex и Pinia'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Vuex и Pinia решают одну и ту же задачу, но отличаются по удобству и уровню современности.

---

## 1. Фокус на интервью

1. Ключевые архитектурные различия
2. Когда уместен каждый вариант
3. Стратегия миграции с Vuex на Pinia

## 2. Сравнение верхнего уровня

| Topic | Vuex | Pinia |
| --- | --- | --- |
| Vue ecosystem era | Vue 2 primary | Vue 3 official |
| Mutations required | Yes | No |
| TypeScript ergonomics | Heavier setup | Better inference |
| Module design | Nested modules common | Flat independent stores |
| DX and maintainability | Good | Better in modern Vue 3 apps |

## 3. Контраст API

### Стиль Vuex

```ts
mutations: {
  increment(state) {
    state.count++;
  }
}
```

### Стиль Pinia

```ts
actions: {
  increment() {
    this.count++;
  }
}
```

Pinia убирает boilerplate вокруг mutation.

## 4. Руководство по выбору

Используйте Vuex, когда:

- Стабильная legacy-кодовая база на Vue 2
- Стоимость миграции сейчас слишком высока

Используйте Pinia, когда:

- Новая разработка на Vue 3
- Сильный фокус на TS + maintainability
- Команде нужен меньший объем boilerplate

## 5. Подход к миграции

1. Подключите Pinia рядом с существующим Vuex
2. Сначала переносите модули с низким риском
3. Переносите общий бизнес-флоу в composable'ы
4. Удаляйте Vuex после достижения паритета и покрытия тестами

## 6. Краткое резюме для интервью

> Для проектов на Vue 3 я рекомендую Pinia из-за более чистого API и удобства TypeScript. Для legacy-баз на Vuex применяю инкрементальную миграцию, чтобы снизить риски.
