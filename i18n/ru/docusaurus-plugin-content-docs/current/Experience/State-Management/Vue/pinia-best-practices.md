---
id: state-management-vue-pinia-best-practices
title: 'Лучшие практики Pinia и частые ошибки'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> Как поддерживать Pinia store'ы в удобном состоянии в средних и больших Vue-приложениях.

---

## 1. Фокус на интервью

1. Границы дизайна store
2. Подводные камни реактивности
3. Практики поддерживаемости на уровне команды

## 2. Принципы дизайна store

### Одна ответственность на store

```ts
useAuthStore();
useUserStore();
useCatalogStore();
```

Избегайте одного mega store, смешивающего несвязанные зоны ответственности.

### Держите store как контейнеры состояния

Предпочитайте:

- state
- детерминированные getters
- сфокусированные actions

Тяжелые бизнес-процессы выносите в composable'ы/services.

### По возможности держите side effects снаружи

Вместо размещения всей API-оркестрации прямо в store actions используйте composable'ы для workflow, а store actions оставляйте сфокусированными на обновлениях состояния.

## 3. Частые ошибки

### Ошибка 1: прямое деструктурирование state/getters

```ts
// bad: reactivity can be lost
const { token, isLoggedIn } = authStore;

// good
const { token, isLoggedIn } = storeToRefs(authStore);
```

### Ошибка 2: доступ к store вне валидного контекста

Вызывайте store в `setup`, composable'ах или других безопасных местах жизненного цикла приложения.

### Ошибка 3: циклические зависимости между store

Store A импортирует Store B и Store B импортирует Store A, что приводит к хрупкому runtime-поведению.

### Ошибка 4: мутация нереактивных копий

Всегда обновляйте данные через реактивные ссылки или actions.

## 4. Практические стандарты

- Используйте TypeScript-типы для state и payload
- Давайте actions явные имена (`setUserProfile`, `resetSession`)
- Группируйте store по бизнес-доменам
- Добавляйте методы reset для logout/switch account
- Явно фиксируйте политику персистентности по полям

## 5. Краткое резюме для интервью

> Я держу store небольшими и сфокусированными на домене, избегаю ловушек реактивности через `storeToRefs`, выношу сложную оркестрацию в composable'ы и соблюдаю явную типизацию и reset-стратегии.
