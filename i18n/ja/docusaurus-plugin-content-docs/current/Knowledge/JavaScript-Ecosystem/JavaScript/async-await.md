---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 先に [Promise](/docs/promise) を読んで基本概念を理解することをお勧めします

## async/await とは？

`async/await` は ES2017 (ES8) で導入されたシンタックスシュガーで、Promise の上に構築されており、非同期コードを同期コードのように見せることで、より読みやすく保守しやすくなります。

**コアコンセプト**：

- `async` 関数は常に Promise を返す
- `await` は `async` 関数内でのみ使用可能
- `await` は関数の実行を一時停止し、Promise の完了を待つ

## 基本構文

### async 関数

`async` キーワードにより、関数は自動的に Promise を返します：

```js
// 従来の Promise の書き方
function fetchData() {
  return Promise.resolve('データ');
}

// async の書き方（等価）
async function fetchData() {
  return 'データ'; // 自動的に Promise.resolve('データ') にラップされる
}

// 呼び出し方は同じ
fetchData().then((data) => console.log(data)); // 'データ'
```

### await キーワード

`await` は Promise の完了を待ち、結果を返します：

```js
async function getData() {
  const result = await Promise.resolve('完了');
  console.log(result); // '完了'
}
```

## Promise vs async/await の比較

### 例 1：シンプルな API リクエスト

**Promise の書き方**：

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('エラー:', error);
      throw error;
    });
}
```

**async/await の書き方**：

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
}
```

### 例 2：複数の非同期操作の連鎖

**Promise の書き方**：

```js
function processUserData(userId) {
  return fetchUser(userId)
    .then((user) => {
      return fetchPosts(user.id);
    })
    .then((posts) => {
      return fetchComments(posts[0].id);
    })
    .then((comments) => {
      console.log(comments);
      return comments;
    })
    .catch((error) => {
      console.error('エラー:', error);
    });
}
```

**async/await の書き方**：

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('エラー:', error);
  }
}
```

## エラーハンドリング

### try/catch vs .catch()

**async/await では try/catch を使用**：

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('リクエスト失敗:', error);
    // ここで異なるタイプのエラーを処理できる
    if (error.name === 'NetworkError') {
      // ネットワークエラーの処理
    }
    throw error; // 再スローまたはデフォルト値を返す
  }
}
```

**混合使用（非推奨だが有効）**：

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('リクエスト失敗:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### 多層 try/catch

異なる段階のエラーに対して、多層の try/catch を使用できます：

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('ユーザー取得失敗:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('記事取得失敗:', error);
    return []; // デフォルト値として空配列を返す
  }
}
```

## 実用的な応用例

### 例：テスト採点フロー

> フロー：テスト採点 → 報酬確認 → 報酬付与 → 退学または処罰

```js
// テスト採点
function correctTest(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const score = Math.round(Math.random() * 100);
      if (score >= 60) {
        resolve({
          name,
          score,
        });
      } else {
        reject('退学基準に達しました');
      }
    }, 2000);
  });
}

// 報酬確認
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} は映画チケットを獲得`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} は表彰を獲得`);
      } else {
        reject('賞品はありません');
      }
    }, 2000);
  });
}
```

**Promise の書き方**：

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**async/await での書き換え**：

```js
async function processStudent(name) {
  try {
    const data = await correctTest(name);
    const reward = await checkReward(data);
    console.log(reward);
    return reward;
  } catch (error) {
    console.log(error);
    return null;
  }
}

processStudent('John Doe');
```

### 例：複数リクエストの並行実行

複数のリクエスト間に依存関係がない場合、並行実行すべきです：

**❌ 誤り：順次実行（遅い）**：

```js
async function fetchAllData() {
  const users = await fetchUsers(); // 1秒待機
  const posts = await fetchPosts(); // さらに1秒待機
  const comments = await fetchComments(); // さらに1秒待機
  // 合計3秒
  return { users, posts, comments };
}
```

**✅ 正解：並行実行（速い）**：

```js
async function fetchAllData() {
  // 3つのリクエストを同時に発行
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // 1秒だけ必要（最も遅いリクエストの時間）
  return { users, posts, comments };
}
```

**Promise.allSettled() で部分的な失敗を処理**：

```js
async function fetchAllData() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);

  const users = results[0].status === 'fulfilled' ? results[0].value : [];
  const posts = results[1].status === 'fulfilled' ? results[1].value : [];
  const comments = results[2].status === 'fulfilled' ? results[2].value : [];

  return { users, posts, comments };
}
```

## よくある落とし穴

### 1. ループ内での await の使用（順次実行）

**❌ 誤り：毎回のループで待機するため非効率**：

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // 順次実行、非常に遅い！
    results.push(user);
  }
  return results;
}
// ユーザーが10人で各リクエスト1秒なら、合計10秒必要
```

**✅ 正解：Promise.all() で並行実行**：

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// 10人のユーザーを並行リクエスト、1秒だけ必要
```

**妥協案：並行数を制限**：

```js
async function processUsersWithLimit(userIds, limit = 3) {
  const results = [];
  for (let i = 0; i < userIds.length; i += limit) {
    const batch = userIds.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((id) => fetchUser(id)));
    results.push(...batchResults);
  }
  return results;
}
// 毎回3つずつ処理し、一度に大量のリクエストを発行するのを避ける
```

### 2. await の付け忘れ

`await` を忘れると、実際の値ではなく Promise が得られます：

```js
// ❌ 誤り
async function getUser() {
  const user = fetchUser(1); // await 忘れ、user は Promise
  console.log(user.name); // undefined（Promise には name プロパティがない）
}

// ✅ 正解
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // 正しい名前
}
```

### 3. async なしで await を使用

`await` は `async` 関数内でのみ使用できます：

```js
// ❌ 誤り：構文エラー
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ 正解
async function getData() {
  const data = await fetchData();
  return data;
}
```

**トップレベル await（Top-level await）**：

ES2022 とモジュール環境では、モジュールのトップレベルで await を使用できます：

```js
// ES2022 module
const data = await fetchData(); // モジュールのトップレベルで使用可能
console.log(data);
```

### 4. エラーハンドリングの漏れ

try/catch がないとエラーがキャッチされません：

```js
// ❌ キャッチされないエラーの可能性
async function fetchData() {
  const response = await fetch('/api/data'); // 失敗するとエラーがスローされる
  return response.json();
}

// ✅ エラーハンドリングを追加
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('エラー:', error);
    return null; // またはデフォルト値を返す
  }
}
```

### 5. async 関数は常に Promise を返す

`await` を使用しなくても、`async` 関数は Promise を返します：

```js
async function getValue() {
  return 42; // 実際には Promise.resolve(42) を返す
}

// .then() または await を使用して値を取得する必要がある
getValue().then((value) => console.log(value)); // 42

// または
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## 応用テクニック

### タイムアウト処理

Promise.race() を使用してタイムアウト機構を実装：

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('リクエストタイムアウト')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('リクエスト失敗:', error.message);
    throw error;
  }
}

// 使用例
fetchWithTimeout('/api/data', 3000); // 3秒タイムアウト
```

### リトライ機構

失敗時の自動リトライを実装：

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // 最後のリトライが失敗したらエラーをスロー

      console.log(`${i + 1} 回目の試行が失敗、${delay}ms 後にリトライ...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// 使用例
fetchWithRetry('/api/data', 3, 2000); // 最大3回リトライ、間隔2秒
```

### 順次処理で状態を保持

順次実行が必要だがすべての結果を保持したい場合：

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // 前の結果に基づいて次のステップを決定できる
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## Event Loop における async/await

async/await は本質的に Promise であるため、同じ Event Loop のルールに従います：

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// 出力順序：1, 2, 4, 3
```

解析：

1. `console.log('1')` - 同期実行
2. `test()` が呼ばれ、`console.log('2')` - 同期実行
3. `await Promise.resolve()` - 後続のコードを micro task に入れる
4. `console.log('4')` - 同期実行
5. micro task が実行され、`console.log('3')`

## 面接のポイント

1. **async/await は Promise のシンタックスシュガー**：より読みやすいが本質は同じ
2. **エラーハンドリングには try/catch を使用**：`.catch()` ではなく
3. **並行 vs 順次実行に注意**：ループ内で無条件に await を使わない
4. **async 関数は常に Promise を返す**：明示的に return Promise しなくても
5. **await は async 関数内でのみ使用可能**：トップレベル await（ES2022）を除く
6. **Event Loop を理解する**：await 後のコードは micro task

## 関連トピック

- [Promise](/docs/promise) - async/await の基礎
- [Event Loop](/docs/event-loop) - 実行順序の理解

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
