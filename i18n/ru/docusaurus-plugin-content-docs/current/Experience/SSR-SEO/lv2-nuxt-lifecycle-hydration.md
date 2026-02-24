---
title: '[Lv2] Основы Lifecycle и Hydration в Nuxt 3'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Понимание границ lifecycle и поведения hydration критично, чтобы избегать проблем рассинхронизации SSR и клиента.

---

## 1. Фокус на интервью

1. Различия lifecycle на сервере и на клиенте
2. `useState` vs `ref` в SSR
3. Типичные причины hydration mismatch и их исправления

## 2. Границы lifecycle в Nuxt 3

В SSR-режиме:

- `setup()` выполняется на сервере и на клиенте
- `onMounted()` выполняется только на клиенте
- Browser API должны быть защищены для клиентского выполнения

```ts
<script setup lang="ts">
if (process.server) {
  console.log('Server render phase');
}

onMounted(() => {
  // Client only
  console.log(window.location.href);
});
</script>
```

## 3. Почему возникает hydration mismatch

Типичные причины:

- Рендер случайных значений (`Math.random()`) во время SSR
- Рендер time-dependent значений (`new Date()`) без синхронизации
- Обращение к browser-only API во время серверного рендера
- Разные условные ветки на сервере и клиенте

## 4. `useState` vs `ref` в SSR

- `ref` — локальное реактивное состояние экземпляра компонента
- `useState` сериализует и гидратирует состояние через SSR-границу

```ts
const counter = useState<number>('counter', () => 0);
```

Для общего состояния с учетом SSR предпочтителен `useState`.

## 5. Практика предотвращения mismatch

- При необходимости оборачивайте browser-only UI в `ClientOnly`
- Переносите browser API в `onMounted`
- Обеспечивайте детерминированные начальные значения рендера
- Явно разделяйте ветки SSR и клиента (`process.server`, `process.client`)

## 6. Процесс отладки

- Воспроизводите mismatch при полном обновлении страницы
- Сравнивайте серверный HTML и hydrated DOM
- Поэтапно отключайте подозрительные динамические фрагменты
- Подтверждайте стабильность финального рендера при медленной сети и cold load

## Краткое резюме для интервью

> Я рассматриваю SSR и клиент как две фазы выполнения. Делаю начальный output детерминированным, использую `useState` для общего SSR-состояния и изолирую browser-only логику в клиентские хуки. Это предотвращает hydration mismatch и делает рендер предсказуемым.
