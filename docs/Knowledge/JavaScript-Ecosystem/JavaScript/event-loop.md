---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> Why does JavaScript need asynchronous behavior? Please explain callback and event loop.

JavaScript is fundamentally single-threaded. One of its core jobs is manipulating the browser DOM. If multiple threads modified the same node at the same time, the behavior would become very complex. To avoid that, JavaScript runs in a single-threaded model.

Asynchronous behavior is the practical solution on top of that model.  
If an operation needs to wait 2 seconds, the browser cannot just freeze. It executes synchronous tasks first, while asynchronous tasks are queued in a task queue.

The synchronous execution context can be understood as the call stack.  
The browser executes tasks in the call stack first. When the call stack becomes empty, it pulls waiting tasks from the task queue into the call stack.

1. Browser checks whether the call stack is empty => No => continue executing call stack tasks.
2. Browser checks whether the call stack is empty => Yes => check task queue => if tasks exist, move one into the call stack.

This repeated cycle is the concept of the event loop.

```js
console.log(1);

// This asynchronous function is the callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// Output order: 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> Why is `setInterval` not accurate in timing?

1. JavaScript is single-threaded (one task at a time, others wait in a queue). If a `setInterval` callback takes longer than the interval itself, the next callback is delayed.  
   Example: interval is 1 second, but one callback takes 2 seconds. The next run is already late by 1 second. This drift accumulates over time.

2. Browsers and runtimes also enforce limits. In most major browsers (Chrome, Firefox, Safari), the practical minimum interval is usually around 4ms.  
   So even if you set 1ms, it often runs around every 4ms.

3. Heavy CPU or memory usage can delay execution. Tasks like video editing or image processing often cause timer delays.

4. JavaScript has garbage collection. If the interval callback creates many objects, GC work can introduce additional delays.

### Alternative

#### requestAnimationFrame

If you are using `setInterval` for animation, consider replacing it with `requestAnimationFrame`.

- Synchronized with repaint: runs when the browser is ready to draw the next frame. This is much more accurate than guessing repaint timing with `setInterval` or `setTimeout`.
- Better performance: because it aligns with repaint cycles, it will not run when repaint is unnecessary (for example, background tabs), saving computation.
- Automatic throttling: adjusts execution frequency based on device conditions, typically around 60 FPS.
- High-precision timestamp: receives a `DOMHighResTimeStamp` parameter (microsecond precision), useful for precise animation timing.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Continue animation until the element reaches the target position
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` updates position on each frame (typically 60 FPS) until it reaches 500 pixels.  
This usually gives smoother and more natural animation than `setInterval`.
