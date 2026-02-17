---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> 为什么 JavaScript 需要异步？并请解释 callback 和 event loop

JS 的本质是单线程的语言，因为它的工作之一就是修改浏览器的 DOM 结构，如果多线程但同时修改同一个节点，会让整体情况变得相当复杂，所以为了避免这种状况发生，才会采用单线程。

而异步就是在单线程的背景下，一种可行的解决方案，假设某个动作需要等待 2 秒，浏览器当然不可能等在原地 2 秒，因此会先执行所有同步性的工作，而所有异步性的工作则先放到 task queue（任务等待序列）。

而浏览器先执行同步性工作的环境，可以理解为包在 call stack 区间，浏览器先依序把 call stack 内的工作执行完毕，当它检查到 call stack 为空时，接着前往 task queue 中将等待序列的工作丢到 call stack 依序执行。

1. 浏览器检查 call stack 是否为空 => 否 => 继续执行 call stack 内的工作
2. 浏览器检查 call stack 是否为空 => 是 => 前往 task queue 检查是否有等待序列的工作 => 有 => 将工作丢到 call stack 执行

这样不断循环的过程，就是 event loop 的概念。

```js
console.log(1);

// 这个异步函数就是 callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// 依次打印 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> 为什么 `setInterval` 在时间上不精确？

1. 受限于 JavaScript 本身是单线程的程序语言（一次只能执行一个任务，其他任务必须在 Queue 中等待），所以当 setInterval 的 callback 执行时间超过了设定的时间间隔时，就会导致下一次的 callback 执行时间延迟。举例来说，如果 setInterval 设定为每隔一秒执行一次 function，但是 function 内有某个动作需要花费两秒的时间，那么下一次 setInterval 的执行时间就会延迟一秒。日积月累之下，就会导致 setInterval 的执行时间越来越不准确。

2. 浏览器或运行环境也会限制或影响，目前多数主流浏览器（如 Chrome、Firefox、Safari 等）中，最小间隔时间大致为 4 毫秒。所以即使设定为每隔 1 毫秒执行一次，实际上也只会每隔 4 毫秒执行一次。

3. 系统在执行非常占用内存或 CPU 的任务时，也会导致执行时间延迟。譬如像是剪视频或是做图像处理之类的动作时，很大概率会导致执行时间延迟。

4. 因为 JavaScript 本身也有 Garbage Collection 的机制，假设执行 setInterval 的 function 内建立了大量 object，如果执行完毕后就没有被使用到，那这些对象就会被 GC 回收，这也会导致执行时间延迟。

### 替代方案

#### requestAnimationFrame

如果目前使用 `setInterval` 是以动画实现为考量，那么可以考虑使用 `requestAnimationFrame` 来取代。

- 同步于浏览器重绘：会在浏览器准备绘制新一帧的时候执行，这意味着它是与浏览器重绘（repaint）同步的。这比用 setInterval 或 setTimeout 来猜测什么时候会发生重绘要精确得多。
- 性能：由于是与浏览器重绘同步的，因此它不会在浏览器认为不需要重绘的时候运行。这节省了计算资源，尤其是当该标签页不是当前焦点或者最小化时。
- 自动节流：能自动调整执行频率以匹配不同的设备和情况，通常是每秒 60 帧。这避免了过度使用 CPU 和 GPU 资源。
- 高精度的时间参数：允许接收一个高精度的时间参数（DOMHighResTimeStamp 类型，能精确到微秒），这可以用来更精确地控制动画或其他时间敏感的操作。

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // 如果元素还没有到达目的地，继续动画
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` 会在每一帧（通常是每秒 60 帧）更新元素的位置，直到达到 500 pixel。这种做法通常会比使用 `setInterval` 达到更平滑、更自然的动画效果。
