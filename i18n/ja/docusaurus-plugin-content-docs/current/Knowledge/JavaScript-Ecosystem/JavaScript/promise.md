---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## Promiseとは？

PromiseはES6の新機能で、主にcallback hellの問題を解決し、コードをより読みやすくするために使用されます。Promiseは非同期操作の最終的な完了または失敗、およびその結果値を表します。

Promiseには3つの状態があります：

- **pending**（保留中）：初期状態
- **fulfilled**（完了）：操作が正常に完了
- **rejected**（拒否）：操作が失敗

## 基本的な使い方

### Promiseの作成

```js
const myPromise = new Promise((resolve, reject) => {
  // 非同期操作
  const success = true;

  if (success) {
    resolve('成功！'); // Promiseの状態をfulfilledに変更
  } else {
    reject('失敗！'); // Promiseの状態をrejectedに変更
  }
});

myPromise
  .then((result) => {
    console.log(result); // '成功！'
  })
  .catch((error) => {
    console.log(error); // '失敗！'
  });
```

### 実践的な応用：APIリクエストの処理

```js
// APIリクエストを処理する共通functionを作成
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // responseが200〜299の範囲にあるか確認
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // responseをJSONに変換して返す
    })
    .catch((error) => {
      // ネットワーク異常やリクエスト拒否を確認
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // エラーをスロー
    });
}

fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then((userData) => {
    console.log('User data received:', userData);
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });
```

## Promiseのメソッド

### .then() / .catch() / .finally()

```js
promise
  .then((result) => {
    // 成功時の処理
    return result;
  })
  .catch((error) => {
    // エラー処理
    console.error(error);
  })
  .finally(() => {
    // 成功・失敗に関わらず常に実行
    console.log('Promise完了');
  });
```

### Promise.all()

すべてのPromiseが完了した時にのみ完了し、1つでも失敗すると失敗します。

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('foo'), 100)
);
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 'foo', 42]
});
```

**使用タイミング**：複数のAPIリクエストがすべて完了するのを待ってから続行する必要がある場合。

### Promise.race()

最初に完了した（成功・失敗問わず）Promiseの結果を返します。

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('1番'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('2番'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // '2番'（より早く完了したため）
});
```

**使用タイミング**：リクエストタイムアウトの設定、最速のレスポンス結果のみ取得。

### Promise.allSettled()

すべてのPromiseが完了（成功・失敗問わず）するのを待ち、すべての結果を返します。

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('エラー');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'エラー' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**使用タイミング**：一部が失敗しても処理を続ける必要があり、すべてのPromiseの実行結果を知りたい場合。

### Promise.any()

最初に成功したPromiseを返します。すべて失敗した場合のみ失敗します。

```js
const promise1 = Promise.reject('エラー 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('成功'), 100)
);
const promise3 = Promise.reject('エラー 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // '成功'
});
```

**使用タイミング**：複数のバックアップリソースがあり、1つ成功すれば十分な場合。

## 面接問題

### 問題1：Promiseチェーンとエラー処理

以下のコードの出力結果を判断してください：

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch((e) => console.log('This will not run'));
```

#### 解析

実行過程をステップごとに分析しましょう：

```js
Promise.resolve(1) // 戻り値：1
  .then((x) => x + 1) // x = 1、2を返す
  .then(() => {
    throw new Error('My Error'); // エラーをスロー、catchへ
  })
  .catch((e) => 1) // エラーをキャッチ、1を返す（重要：ここで正常値を返している）
  .then((x) => x + 1) // x = 1、2を返す
  .then((x) => console.log(x)) // 2を出力
  .catch((e) => console.log('This will not run')); // 実行されない
```

**答え：2**

#### 重要な概念

1. **catchはエラーをキャッチして正常値を返す**：`catch()`が正常値を返すと、Promiseチェーンは後続の`.then()`を続けて実行します
2. **catch後のthenは続けて実行される**：エラーが処理済みのため、Promiseチェーンは正常状態に戻ります
3. **最後のcatchは実行されない**：新しいエラーがスローされていないため

エラーを伝播し続けたい場合は、`catch`内でエラーを再スローする必要があります：

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('エラーをキャッチ');
    throw e; // エラーを再スロー
  })
  .then((x) => x + 1) // 実行されない
  .then((x) => console.log(x)) // 実行されない
  .catch((e) => console.log('This will run')); // 実行される
```

### 問題2：Event Loopと実行順序

> この問題にはEvent Loopの概念が含まれます

以下のコードの出力結果を判断してください：

```js
function a() {
  console.log('Warlock');
}

function b() {
  console.log('Druid');
  Promise.resolve().then(() => {
    console.log('Rogue');
  });
}

function c() {
  console.log('Mage');
}

function d() {
  setTimeout(c, 100);
  const temp = Promise.resolve().then(a);
  console.log('Warrior');
  setTimeout(b, 0);
}

d();
```

#### 実行順序の理解

まず`d()`を見ましょう：

```js
function d() {
  setTimeout(c, 100); // 4. Macro task、100ms遅延、最後に実行
  const temp = Promise.resolve().then(a); // 2. Micro task、同期コード完了後に実行
  console.log('Warrior'); // 1. 同期実行、即時出力
  setTimeout(b, 0); // 3. Macro task、0ms遅延だがmacro taskのまま
}
```

実行順序分析：

1. **同期コード**：`console.log('Warrior')` → `Warrior`を出力
2. **Micro task**：`Promise.resolve().then(a)` → `a()`を実行、`Warlock`を出力
3. **Macro task**：
   - `setTimeout(b, 0)`が先に実行（0ms遅延）
   - `b()`を実行、`Druid`を出力
   - `b()`内の`Promise.resolve().then(...)`はmicro task、即時実行、`Rogue`を出力
4. **Macro task**：`setTimeout(c, 100)`が最後に実行（100ms遅延）、`Mage`を出力

#### 答え

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### 重要な概念

- **同期コード** > **Micro task (Promise)** > **Macro task (setTimeout)**
- Promiseの`.then()`はmicro taskに属し、現在のmacro task終了後、次のmacro task開始前に実行されます
- `setTimeout`は遅延時間が0でもmacro taskに属し、すべてのmicro taskの後に実行されます

### 問題3：Promiseコンストラクタの同期と非同期

以下のコードの出力結果を判断してください：

```js
function printing() {
  console.log(1);
  setTimeout(function () {
    console.log(2);
  }, 1000);
  setTimeout(function () {
    console.log(3);
  }, 0);

  new Promise((resolve, reject) => {
    console.log(4);
    resolve(5);
  }).then((foo) => {
    console.log(6);
  });

  console.log(7);
}

printing();

// output ?
```

#### Promiseブロックに注意

この問題のポイント：**Promiseコンストラクタ内のコードは同期的に実行される**ということです。`.then()`と`.catch()`のみが非同期です。

実行順序分析：

```js
console.log(1); // 1. 同期、1を出力
setTimeout(() => console.log(2), 1000); // 5. Macro task、1000ms遅延
setTimeout(() => console.log(3), 0); // 4. Macro task、0ms遅延

new Promise((resolve, reject) => {
  console.log(4); // 2. 同期！Promiseコンストラクタ内は同期、4を出力
  resolve(5);
}).then((foo) => {
  console.log(6); // 3. Micro task、6を出力
});

console.log(7); // 3. 同期、7を出力
```

実行フロー：

1. **同期実行**：1 → 4 → 7
2. **Micro task**：6
3. **Macro task**（遅延時間順）：3 → 2

#### 答え

```
1
4
7
6
3
2
```

#### 重要な概念

1. **Promiseコンストラクタ内のコードは同期的に実行される**：`console.log(4)`は非同期ではない
2. **`.then()`と`.catch()`のみが非同期**：micro taskに属する
3. **実行順序**：同期コード → micro task → macro task

## よくある落とし穴

### 1. returnの忘れ

Promiseチェーンで`return`を忘れると、後続の`.then()`が`undefined`を受け取ります：

```js
// ❌ 間違い
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // returnを忘れている
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ 正しい
fetchUser()
  .then((user) => {
    return fetchPosts(user.id); // returnを忘れない
  })
  .then((posts) => {
    console.log(posts); // 正しいデータ
  });
```

### 2. catchによるエラー処理の忘れ

キャッチされないPromiseエラーはUnhandledPromiseRejectionを引き起こします：

```js
// ❌ キャッチされないエラーの可能性
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ catchを追加
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('エラーが発生:', error);
  });
```

### 3. Promiseコンストラクタの濫用

すでにPromiseを返す関数をPromiseで再ラップする必要はありません：

```js
// ❌ 不要なラッピング
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ 直接返す
function fetchData() {
  return fetch(url);
}
```

### 4. 複数のcatchの連鎖

各`catch()`はそれ以前のエラーのみをキャッチします：

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('キャッチ:', e.message); // キャッチ: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('キャッチ:', e.message); // キャッチ: Error 2
  });
```

## 関連トピック

- [async/await](/docs/async-await) - より優雅なPromiseのシンタックスシュガー
- [Event Loop](/docs/event-loop) - JavaScriptの非同期メカニズムを深く理解する

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
