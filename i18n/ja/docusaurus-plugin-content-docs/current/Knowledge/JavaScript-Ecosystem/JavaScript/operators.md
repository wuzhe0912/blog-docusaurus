---
id: operators
title: '[Easy] 📄 JavaScript Operators'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. What is the difference between `==` and `===` ?

> `==` と `===` の違いは何ですか？

どちらも比較演算子ですが、`==` は2つの値が等しいかを比較し、`===` は2つの値が等しく、かつ型も同じかを比較します。そのため、後者は厳密モードとも言えます。

前者は JavaScript の設計上、自動的に型変換を行うため、直感に反する結果が多く生じます。例えば：

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

これは開発者にとって大きな認知的負担となるため、`==` の代わりに `===` を使用することが一般的に推奨されており、予期しないバグを防ぐことができます。

**ベストプラクティス**：`==` を使う明確な理由がない限り、常に `===` と `!==` を使用しましょう。

### 面接問題

#### 問題 1：基本型の比較

以下の式の結果を判断してください：

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**答え：**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**解説：**

- **`==`（等値演算子）**：型変換を行う
  - 文字列 `'1'` が数値 `1` に変換される
  - その後 `1 == 1` を比較し、結果は `true`
- **`===`（厳密等値演算子）**：型変換を行わない
  - `number` と `string` は型が異なるため、直接 `false` を返す

**型変換のルール：**

```javascript
// == の型変換の優先順位
// 1. number がある場合、もう一方を number に変換
'1' == 1; // '1' → 1、結果 true
'2' == 2; // '2' → 2、結果 true
'0' == 0; // '0' → 0、結果 true

// 2. boolean がある場合、boolean を number に変換
true == 1; // true → 1、結果 true
false == 0; // false → 0、結果 true
'1' == true; // '1' → 1, true → 1、結果 true

// 3. 文字列から数値への変換の落とし穴
'' == 0; // '' → 0、結果 true
' ' == 0; // ' ' → 0、結果 true（空白文字列は 0 に変換される）
```

#### 問題 2：null と undefined の比較

以下の式の結果を判断してください：

```javascript
undefined == null; // ?
undefined === null; // ?
```

**答え：**

```javascript
undefined == null; // true
undefined === null; // false
```

**解説：**

これは JavaScript の**特殊ルール**です：

- **`undefined == null`**：`true`
  - ES 仕様で特別に規定：`null` と `undefined` は `==` で比較すると等しい
  - これが `==` が有用な唯一の場面：変数が `null` または `undefined` かを確認する
- **`undefined === null`**：`false`
  - 異なる型である（`undefined` は `undefined` 型、`null` は `object` 型）
  - 厳密比較では等しくない

**実務での応用：**

```javascript
// 変数が null または undefined かを確認
function isNullOrUndefined(value) {
  return value == null; // null と undefined を同時に確認
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// 同等だが、より簡潔
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**注意すべき落とし穴：**

```javascript
// null と undefined は互いにのみ等しい
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// ただし === では、自分自身とのみ等しい
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### 問題 3：総合比較

以下の式の結果を判断してください：

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**答え：**

```javascript
0 == false; // true（false → 0）
0 === false; // false（型が異なる：number vs boolean）
'' == false; // true（'' → 0, false → 0）
'' === false; // false（型が異なる：string vs boolean）
null == false; // false（null は null と undefined にのみ等しい）
undefined == false; // false（undefined は null と undefined にのみ等しい）
```

**変換フロー図：**

```javascript
// 0 == false の変換過程
0 == false;
0 == 0; // false を数値 0 に変換
true; // 結果

// '' == false の変換過程
'' == false;
'' == 0; // false を数値 0 に変換
0 == 0; // '' を数値 0 に変換
true; // 結果

// null == false の特殊ケース
null == false;
// null は変換されない！仕様により、null は null と undefined にのみ等しい
false; // 結果
```

#### 問題 4：オブジェクトの比較

以下の式の結果を判断してください：

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**答え：**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**解説：**

- オブジェクト（配列、オブジェクトを含む）の比較は**参照比較**である
- 内容が同じでも、異なるオブジェクトインスタンスであれば等しくない
- `==` と `===` はオブジェクトに対して同じ動作をする（どちらも参照を比較する）

```javascript
// 参照が同じ場合のみ等しい
const arr1 = [];
const arr2 = arr1; // 同じ配列への参照
arr1 == arr2; // true
arr1 === arr2; // true

// 内容が同じでも、異なるインスタンス
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false（異なる参照）
arr3 === arr4; // false（異なる参照）

// オブジェクトも同様
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### 面接クイックメモリー

**`==` の型変換ルール（上から優先）：**

1. `null == undefined` → `true`（特殊ルール）
2. `number == string` → string を number に変換
3. `number == boolean` → boolean を number に変換
4. `string == boolean` → 両方を number に変換
5. オブジェクトは参照を比較、変換なし

**`===` のルール（シンプル）：**

1. 型が異なる → `false`
2. 型が同じ → 値（基本型）または参照（オブジェクト型）を比較

**ベストプラクティス：**

```javascript
// ✅ 常に === を使用
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ 唯一の例外：null/undefined のチェック
if (value == null) {
  // value は null または undefined
}

// ❌ == の使用を避ける（上記の例外を除く）
if (value == 0) {
} // 非推奨
if (name == 'Alice') {
} // 非推奨
```

**面接回答の例：**

> "`==` は型変換を行うため、`0 == '0'` が `true` になるような直感に反する結果を引き起こす可能性があります。`===` は厳密比較で、型変換を行わず、型が異なれば直接 `false` を返します。
>
> ベストプラクティスは常に `===` を使用することで、唯一の例外は `value == null` で `null` と `undefined` を同時にチェックできることです。
>
> 特に注意すべきは `null == undefined` が `true` ですが、`null === undefined` は `false` であることで、これは JavaScript の特殊な仕様です。"

---

## 2. What is the difference between `&&` and `||` ? Please explain short-circuit evaluation

> `&&` と `||` の違いは何ですか？短絡評価について説明してください

### 基本概念

- **`&&`（AND）**：左辺が `falsy` の場合、左辺の値をそのまま返し、右辺は実行されない
- **`||`（OR）**：左辺が `truthy` の場合、左辺の値をそのまま返し、右辺は実行されない

### 短絡評価の例

```js
// && 短絡評価
const user = null;
const name = user && user.name; // user が falsy なので、null を直接返し、user.name にはアクセスしない
console.log(name); // null（エラーにならない）

// || 短絡評価
const defaultName = 'Guest';
const userName = user || defaultName; // user が falsy なので、右辺の defaultName を返す
console.log(userName); // 'Guest'

// 実務での応用
function greet(name) {
  const displayName = name || 'Anonymous'; // name が渡されなければデフォルト値を使用
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### よくある落とし穴 ⚠️

```js
// 問題：0 と '' も falsy
const count = 0;
const result = count || 10; // 0 は falsy なので、10 を返す
console.log(result); // 10（望んだ結果ではないかもしれない）

// 解決策：?? (Nullish Coalescing) を使用
const betterResult = count ?? 10; // null/undefined の場合のみ 10 を返す
console.log(betterResult); // 0
```

---

## 3. What is the `?.` (Optional Chaining) operator ?

> Optional Chaining 演算子 `?.` とは何ですか？

### 問題のシナリオ

従来の書き方はエラーが起きやすい：

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ 危険：address が存在しない場合エラーになる
console.log(user.address.city); // 正常
console.log(otherUser.address.city); // TypeError: Cannot read property 'city' of undefined

// ✅ 安全だが冗長
const city = user && user.address && user.address.city;
```

### Optional Chaining の使用

```js
// ✅ 簡潔で安全
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined（エラーにならない）

// メソッド呼び出しにも使用可能
user?.getName?.(); // getName が存在する場合のみ実行

// 配列にも使用可能
const firstItem = users?.[0]?.name; // 最初のユーザーの名前に安全にアクセス
```

### 実務での応用

```js
// API レスポンスの処理
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Unknown User';
  const email = response?.data?.user?.email ?? 'No email';

  console.log(`User: ${userName}`);
  console.log(`Email: ${email}`);
}

// DOM 操作
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. What is the `??` (Nullish Coalescing) operator ?

> Nullish Coalescing 演算子 `??` とは何ですか？

### `||` との違い

```js
// || はすべての falsy 値を偽として扱う
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? は null と undefined のみを空値として扱う
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### 実務での応用

```js
// 0 の可能性がある数値の処理
function updateScore(newScore) {
  // ✅ 正しい：0 は有効なスコア
  const score = newScore ?? 100; // 0 の場合は 0 を保持、null/undefined の場合のみ 100 を使用
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// 設定値の処理
const config = {
  timeout: 0, // 0 ミリ秒は有効な設定
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0（0 の設定を保持）
const retries = config.maxRetries ?? 3; // 3（null の場合はデフォルト値を使用）
```

### 組み合わせて使用

```js
// ?? と ?. はよく一緒に使用される
const userAge = user?.profile?.age ?? 18; // 年齢データがなければデフォルト 18

// 実務の例：フォームのデフォルト値
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0, // 0 は有効な年齢
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. What is the difference between `i++` and `++i` ?

> `i++` と `++i` の違いは何ですか？

### 基本的な違い

- **`i++`（後置）**：現在の値を先に返してから、1 を加える
- **`++i`（前置）**：先に 1 を加えてから、新しい値を返す

### 例

```js
let a = 5;
let b = a++; // b = 5, a = 6（先に b に代入してから、自己増分）
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6（先に自己増分してから、d に代入）
console.log(c, d); // 6, 6
```

### 実務への影響

```js
// ループ内では通常違いはない（戻り値を使用しないため）
for (let i = 0; i < 5; i++) {} // ✅ 一般的
for (let i = 0; i < 5; ++i) {} // ✅ こちらも可、わずかに速いと考える人もいる（実際には現代の JS エンジンでは差はない）

// しかし式の中では違いがある
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1（先に i=0 で値を取得、その後 i が 1 になる）
console.log(arr[++i]); // 3（i が先に 2 になり、その後値を取得）
```

### ベストプラクティス

```js
// ✅ 明確：分けて書く
let count = 0;
const value = arr[count];
count++;

// ⚠️ 非推奨：混乱しやすい
const value = arr[count++];
```

---

## 6. What is the Ternary Operator ? When should you use it ?

> 三項演算子とは何ですか？いつ使うべきですか？

### 基本構文

```js
condition ? valueIfTrue : valueIfFalse;
```

### 簡単な例

```js
// 従来の if-else
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ 三項演算子：より簡潔
const message = age >= 18 ? 'Adult' : 'Minor';
```

### 適切な使用場面

```js
// 1. シンプルな条件代入
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. JSX/テンプレートでの条件付きレンダリング
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. デフォルト値の設定（他の演算子と組み合わせて）
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. 関数の戻り値
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### 使用を避けるべき場面

```js
// ❌ ネストが深すぎて、読みにくい
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ if-else や switch の方が明確
let result;
if (condition1) result = value1;
else if (condition2) result = value2;
else if (condition3) result = value3;
else result = value4;

// ❌ 複雑なロジック
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ 複数行に分解
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess = isAdmin || hasReadPermission;
```

---

## クイックメモリーカード

| 演算子        | 用途         | 覚え方                                       |
| ------------- | ------------ | -------------------------------------------- |
| `===`         | 厳密等値     | 常にこれを使い、`==` は忘れる                  |
| `&&`          | 短絡 AND     | 左が偽なら停止、偽値を返す                     |
| `\|\|`        | 短絡 OR      | 左が真なら停止、真値を返す                     |
| `?.`          | Optional Chaining | 安全なアクセス、エラーなし                |
| `??`          | Nullish Coalescing | null/undefined のみ対象              |
| `++i` / `i++` | 自己増分     | 前置は先に加算、後置は後で加算                 |
| `? :`         | 三項演算子   | シンプルな条件に使用、ネストは避ける            |

## Reference

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
