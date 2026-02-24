---
id: performance-lv2-js-optimization
title: '[Lv2] Оптимизация времени выполнения JavaScript: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Оптимизация затрат на выполнение JavaScript путём управления частотой, планирования тяжёлых задач и предотвращения блокировки основного потока.

---

## 1. Debounce для пакетного ввода

Используйте debounce, когда частые обновления должны выполняться только после паузы пользователя.

```ts
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
```

Сценарии использования:

- Фильтрация поискового ввода
- Подсказки API
- Валидация в реальном времени

## 2. Throttle для непрерывных событий

Используйте throttle, когда события непрерывны и должны выполняться с фиксированной частотой.

```ts
function throttle<T extends (...args: any[]) => void>(fn: T, wait = 100) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```

Сценарии использования:

- Обновление позиции прокрутки
- Пересчёт при изменении размера окна
- Отслеживание перемещения мыши

## 3. `requestAnimationFrame` для визуальных обновлений

```ts
let rafId = 0;
window.addEventListener('scroll', () => {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    updateStickyHeader();
  });
});
```

Синхронизация визуальных обновлений с циклами отрисовки браузера.

## 4. Time slicing для больших циклов

```ts
async function processInChunks<T>(items: T[], chunkSize = 500) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(handleItem);
    await new Promise((r) => setTimeout(r, 0));
  }
}
```

Сохраняет отзывчивость интерфейса при тяжёлой обработке.

## 5. Перенос тяжёлой работы в Web Worker

```ts
const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.postMessage({ action: 'aggregate', payload: largeData });
worker.onmessage = (event) => {
  renderResult(event.data);
};
```

Основной поток остаётся интерактивным, пока вычисления выполняются в фоне.

## 6. Сначала измерение

Отслеживайте улучшения с помощью:

- Панели Performance (долгие задачи)
- Web Vitals
- Пользовательских меток и измерений

```ts
performance.mark('filter-start');
runFilter();
performance.mark('filter-end');
performance.measure('filter-cost', 'filter-start', 'filter-end');
```

## Краткое резюме для собеседования

> Я использую debounce для пакетного ввода, throttle для непрерывных событий, `requestAnimationFrame` для визуальных обновлений, time slicing для больших циклов и Web Worker для ресурсоёмких задач. Я проверяю улучшения с помощью конкретных метрик производительности.
