---
id: performance-lv3-web-worker
title: '[Lv3] Web Worker на практике: фоновые вычисления без блокировки UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> Web Worker переносит ресурсоёмкую логику с основного потока, чтобы UI оставался отзывчивым.

## 1. Зачем нужен Web Worker?

JavaScript в основном потоке является однопоточным для задач UI. Тяжёлые вычисления могут заморозить взаимодействие.

Типичные кандидаты:

- Парсинг и преобразование больших JSON
- Агрегация/статистика по большим массивам
- Сжатие, шифрование или обработка изображений

## 2. Базовое использование

### Основной поток

```ts
const worker = new Worker(new URL('./report.worker.ts', import.meta.url), { type: 'module' });

worker.postMessage({ type: 'AGGREGATE', payload: data });

worker.onmessage = (event) => {
  renderChart(event.data);
};
```

### Поток worker'а

```ts
self.onmessage = (event) => {
  const { type, payload } = event.data;
  if (type === 'AGGREGATE') {
    const result = compute(payload);
    self.postMessage(result);
  }
};
```

## 3. Паттерны обмена сообщениями

- Запрос/ответ с `requestId`
- События прогресса для долгих задач
- Канал ошибок со структурированным payload

```ts
self.postMessage({ requestId, progress: 60 });
```

## 4. Transferable objects для больших бинарных данных

Для больших `ArrayBuffer` передайте владение, чтобы избежать дорогостоящего копирования.

```ts
worker.postMessage({ bytes: buffer }, [buffer]);
```

## 5. Паттерн пула worker'ов

Для нескольких тяжёлых задач создайте небольшой пул worker'ов вместо неограниченного порождения.

Преимущества:

- Предсказуемое потребление CPU
- Лучший контроль планирования
- Меньшие накладные расходы на запуск

## 6. Ограничения и предостережения

- Worker'ы не могут напрямую обращаться к DOM
- Существуют затраты на сериализацию при structured clone
- Отладка сложнее, чем кода основного потока
- Не каждую задачу стоит переносить в worker'ы

## 7. Очистка

Всегда завершайте, когда worker больше не нужен.

```ts
worker.terminate();
```

## Краткое резюме для собеседования

> Я использую Web Worker для ресурсоёмких задач, которые блокировали бы взаимодействие. Я проектирую протоколы сообщений, использую transferable objects для больших бинарных данных и контролирую жизненный цикл worker'а с помощью очистки и ограничений пула.
