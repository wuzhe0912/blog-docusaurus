---
id: basic-types
title: '[Easy] 基本型と型アノテーション'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> TypeScript の基本型にはどのようなものがありますか？

TypeScript は変数、関数のパラメータ、戻り値の型を定義するための多くの基本型を提供しています。

### 基本型

```typescript
// 1. number：数値（整数、浮動小数点数）
let age: number = 30;
let price: number = 99.99;

// 2. string：文字列
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean：真偽値
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null：空値
let data: null = null;

// 5. undefined：未定義
let value: undefined = undefined;

// 6. void：戻り値なし（主に関数で使用）
function logMessage(): void {
  console.log('Hello');
}

// 7. any：任意の型（使用を避けるべき）
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown：未知の型（any より安全）
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ エラー：先に型チェックが必要

// 9. never：決して発生しない値（決して返らない関数に使用）
function throwError(): never {
  throw new Error('Error');
}

// 10. object：オブジェクト（あまり使わない、interface の使用を推奨）
let user: object = { name: 'John' };

// 11. array：配列
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple：タプル（固定長・固定型の配列）
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> 型アノテーション vs 型推論

### 型アノテーション（Type Annotations）

**定義**：変数の型を明示的に指定すること。

```typescript
// 型を明示的に指定
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// 関数のパラメータと戻り値
function add(a: number, b: number): number {
  return a + b;
}
```

### 型推論（Type Inference）

**定義**：TypeScript が初期値に基づいて自動的に型を推論すること。

```typescript
// TypeScript が自動的に number と推論
let age = 30;        // age: number

// TypeScript が自動的に string と推論
let name = 'John';   // name: string

// TypeScript が自動的に boolean と推論
let isActive = true;  // isActive: boolean

// 関数の戻り値も自動的に推論される
function add(a: number, b: number) {
  return a + b;  // 戻り値を自動的に number と推論
}
```

### 型アノテーションを使用すべきとき

**型を明示的に指定すべき場合**：

```typescript
// 1. 変数宣言時に初期値がない場合
let value: number;
value = 10;

// 2. 関数パラメータ（指定必須）
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. 関数の戻り値（明示的な指定を推奨）
function calculate(): number {
  return 42;
}

// 4. 複雑な型で推論が正確でない可能性がある場合
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> よくある面接の質問

### 問題 1：型推論

以下のコードにおける各変数の型を説明してください。

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>クリックして回答を表示</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**解説**：
- TypeScript は初期値に基づいて自動的に型を推論する
- 配列は要素の型の配列として推論される
- オブジェクトはオブジェクトの構造型として推論される

</details>

### 問題 2：型エラー

以下のコードの型エラーを見つけてください。

```typescript
let age: number = 30;
age = 'thirty';

let name: string = 'John';
name = 42;

let isActive: boolean = true;
isActive = 'yes';

let numbers: number[] = [1, 2, 3];
numbers.push('4');
```

<details>
<summary>クリックして回答を表示</summary>

```typescript
let age: number = 30;
age = 'thirty'; // ❌ Type 'string' is not assignable to type 'number'

let name: string = 'John';
name = 42; // ❌ Type 'number' is not assignable to type 'string'

let isActive: boolean = true;
isActive = 'yes'; // ❌ Type 'string' is not assignable to type 'boolean'

let numbers: number[] = [1, 2, 3];
numbers.push('4'); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

**正しい書き方**：
```typescript
let age: number = 30;
age = 30; // ✅

let name: string = 'John';
name = 'Jane'; // ✅

let isActive: boolean = true;
isActive = false; // ✅

let numbers: number[] = [1, 2, 3];
numbers.push(4); // ✅
```

</details>

### 問題 3：any vs unknown

`any` と `unknown` の違いを説明し、どちらを使用すべきか説明してください。

```typescript
// ケース 1：any を使用
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// ケース 2：unknown を使用
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>クリックして回答を表示</summary>

**ケース 1：any を使用**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ コンパイルは通るが、実行時にエラーが発生する可能性あり
}

processAny('hello');  // ✅ 正常に実行
processAny(42);       // ❌ 実行時エラー：value.toUpperCase is not a function
```

**ケース 2：unknown を使用**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ コンパイルエラー：Object is of type 'unknown'

  // 先に型チェックが必要
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ 安全
  }
}
```

**違いの比較**：

| 特性 | any | unknown |
| --- | --- | --- |
| 型チェック | 完全に無効化 | 使用前にチェックが必要 |
| 安全性 | 安全でない | 安全 |
| 使用推奨 | 使用を避ける | 推奨 |

**ベストプラクティス**：
```typescript
// ✅ 推奨：unknown を使用し、型チェックを行う
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ 避ける：any を使用
function processValue(value: any): void {
  console.log(value.toUpperCase()); // 安全でない
}
```

</details>

### 問題 4：配列の型

以下の配列の型宣言の違いを説明してください。

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>クリックして回答を表示</summary>

```typescript
// 1. number[]：数値配列（推奨される書き方）
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ エラー

// 2. Array<number>：ジェネリック配列（number[] と同等）
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ エラー

// 3. [number, string]：タプル（Tuple）- 固定長・固定型
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ エラー：長さが 2 を超えている
arr3.push('test');   // ⚠️ TypeScript は許可するが、非推奨

// 4. any[]：任意の型の配列（非推奨）
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅（ただし型チェックが失われる）
```

**使用に関するアドバイス**：
- 一般的な配列：`number[]` または `Array<number>` を使用
- 固定構造：タプル `[type1, type2]` を使用
- `any[]` の使用を避け、具体的な型または `unknown[]` を優先

</details>

### 問題 5：void vs never

`void` と `never` の違いと使用シーンを説明してください。

```typescript
// ケース 1：void
function logMessage(): void {
  console.log('Hello');
}

// ケース 2：never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // 無限ループ
  }
}
```

<details>
<summary>クリックして回答を表示</summary>

**void**：
- **用途**：関数が値を返さないことを表す
- **特徴**：関数は正常に終了するが、値を返さない
- **使用シーン**：イベントハンドラ、副作用関数

```typescript
function logMessage(): void {
  console.log('Hello');
  // 関数は正常に終了し、値を返さない
}

function onClick(): void {
  // クリックイベントを処理、戻り値は不要
}
```

**never**：
- **用途**：関数が決して正常に終了しないことを表す
- **特徴**：関数がエラーをスローするか、無限ループに入る
- **使用シーン**：エラー処理、無限ループ、型ガード

```typescript
function throwError(): never {
  throw new Error('Error');
  // ここには到達しない
}

function infiniteLoop(): never {
  while (true) {
    // 終了しない
  }
}

// 型ガードでの使用
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**違いの比較**：

| 特性 | void | never |
| --- | --- | --- |
| 関数の終了 | 正常に終了 | 決して終了しない |
| 戻り値 | undefined | 戻り値なし |
| 使用シーン | 戻り値のない関数 | エラー処理、無限ループ |

</details>

## 4. Best Practices

> ベストプラクティス

### 推奨される方法

```typescript
// 1. 型推論を優先的に使用
let age = 30;  // ✅ TypeScript に推論させる
let name = 'John';  // ✅

// 2. 関数のパラメータと戻り値は型を明示的に指定
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. any ではなく unknown を使用
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. 具体的な配列型を使用
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. タプルで固定構造を表現
let person: [string, number] = ['John', 30];  // ✅
```

### 避けるべき方法

```typescript
// 1. any の使用を避ける
let value: any = 'hello';  // ❌

// 2. 不要な型アノテーションを避ける
let age: number = 30;  // ⚠️ let age = 30; に簡略化できる

// 3. object 型の使用を避ける
let user: object = { name: 'John' };  // ❌ interface を使用する方がよい

// 4. 混合型配列を避ける（必要でない限り）
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ 本当に必要かどうか検討
```

## 5. Interview Summary

> 面接のまとめ

### クイックリファレンス

**基本型**：
- `number`, `string`, `boolean`, `null`, `undefined`
- `void`（戻り値なし）, `never`（決して返らない）
- `any`（任意の型、使用を避ける）, `unknown`（未知の型、使用推奨）

**型アノテーション vs 推論**：
- 型アノテーション：明示的に指定 `let age: number = 30`
- 型推論：自動推論 `let age = 30`

**配列の型**：
- `number[]` または `Array<number>`：一般的な配列
- `[number, string]`：タプル（固定構造）

### 面接の回答例

**Q: TypeScript にはどのような基本型がありますか？**

> "TypeScript は多くの基本型を提供しています。number、string、boolean、null、undefined が含まれます。さらに特殊な型もあります。void は戻り値がないことを表し、主に関数で使用されます。never は決して発生しない値を表し、決して返らない関数に使用されます。any は任意の型ですが、使用を避けるべきです。unknown は未知の型で、any より安全であり、使用前に型チェックが必要です。また、配列型 number[] とタプル型 [number, string] もあります。"

**Q: any と unknown の違いは何ですか？**

> "any は型チェックを完全に無効にし、任意のプロパティやメソッドを直接使用できますが、これは安全ではありません。unknown は使用前に型チェックを行う必要があり、より安全です。例えば unknown を使用する場合、まず typeof で型をチェックし、確認後に対応するメソッドを呼び出す必要があります。any よりも unknown の使用を優先することを推奨します。"

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
