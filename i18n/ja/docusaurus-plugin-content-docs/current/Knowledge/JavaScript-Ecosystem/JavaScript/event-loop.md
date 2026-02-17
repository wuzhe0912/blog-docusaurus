---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> なぜ JavaScript には非同期処理が必要なのか？また、callback と event loop について説明してください

JavaScript は本質的にシングルスレッドの言語です。その役割の一つにブラウザの DOM 構造の操作がありますが、マルチスレッドで同じノードを同時に変更すると状況が非常に複雑になるため、これを回避するためにシングルスレッドが採用されています。

非同期処理とは、シングルスレッドという制約の中での解決策です。ある処理に 2 秒の待ち時間が必要な場合、ブラウザがその場で 2 秒待つわけにはいきません。そこで、すべての同期処理を先に実行し、非同期の処理は task queue（タスク待ちキュー）に入れておきます。

ブラウザが同期処理を実行する環境は call stack として理解できます。ブラウザはまず call stack 内の処理を順番に実行し、call stack が空になったことを検知すると、task queue にある待機中の処理を call stack に移して順番に実行します。

1. ブラウザが call stack が空かどうか確認 => 空でない => call stack 内の処理を続行
2. ブラウザが call stack が空かどうか確認 => 空 => task queue に待機中の処理があるか確認 => ある => call stack に移して実行

この繰り返しのプロセスが event loop の概念です。

```js
console.log(1);

// 這個非同步的函式就是 callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// 依序印出 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> なぜ `setInterval` のタイミングは正確ではないのか？

1. JavaScript がシングルスレッドのプログラミング言語であるため（一度に 1 つのタスクしか実行できず、他のタスクは Queue で待機が必要）、setInterval の callback の実行時間が設定された間隔を超えると、次の callback の実行が遅延します。例えば、setInterval を 1 秒ごとに実行するよう設定していても、関数内に 2 秒かかる処理がある場合、次の実行は 1 秒遅延します。蓄積されると、実行タイミングはますます不正確になります。

2. ブラウザや実行環境の制限もあります。現在の主要ブラウザ（Chrome、Firefox、Safari など）の最小間隔時間はおよそ 4 ミリ秒です。1 ミリ秒ごとの実行を設定しても、実際には 4 ミリ秒ごとにしか実行されません。

3. システムがメモリや CPU を大量に消費するタスク実行時も、実行時間の遅延を引き起こします。動画編集や画像処理のような操作では遅延の可能性が高くなります。

4. JavaScript には Garbage Collection の仕組みがあるため、setInterval の関数内で大量のオブジェクトを生成し、使用されなくなった場合、GC によって回収されます。これも実行時間の遅延要因となります。

### 代替手段

#### requestAnimationFrame

`setInterval` をアニメーション実装目的で使用している場合は、`requestAnimationFrame` での置き換えを検討できます。

- ブラウザの再描画と同期：ブラウザが新しいフレームを描画する準備ができた時に実行されます。setInterval や setTimeout でタイミングを推測するより遥かに正確です。
- パフォーマンス：ブラウザの再描画と同期しているため、再描画不要時には実行されません。タブが非アクティブや最小化時に特に効果的です。
- 自動スロットリング：デバイスや状況に応じて実行頻度を自動調整し、通常は毎秒 60 フレームです。
- 高精度の時間パラメータ：DOMHighResTimeStamp 型のマイクロ秒精度の時間パラメータを受け取れ、時間に敏感な操作をより正確に制御できます。

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // 如果元素還沒有到達目的地，繼續動畫
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` は各フレーム（通常は毎秒 60 フレーム）で要素の位置を更新し、500 pixel に達するまで続けます。この方法は `setInterval` より滑らかで自然なアニメーション効果を実現します。
