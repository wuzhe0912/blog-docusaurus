---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> TypeScript とは何ですか？

TypeScript は Microsoft が開発したオープンソースのプログラミング言語で、JavaScript の**スーパーセット（Superset）**です。つまり、有効な JavaScript コードはすべて有効な TypeScript コードです。

**コア特徴**：

- JavaScript に**静的型システム**を追加
- コンパイル時に型チェックを実行
- コンパイル後に純粋な JavaScript に変換
- より良い開発体験とツールサポートを提供

## 2. What are the differences between TypeScript and JavaScript?

> TypeScript と JavaScript の違いは何ですか？

### 主な違い

| 特性       | JavaScript                 | TypeScript                 |
| ---------- | -------------------------- | -------------------------- |
| 型システム | 動的型付け（実行時チェック）| 静的型付け（コンパイル時チェック）|
| コンパイル | 不要                       | JavaScript へのコンパイルが必要 |
| 型アノテーション | 非対応               | 型アノテーション対応       |
| エラー検出 | 実行時にエラー発見         | コンパイル時にエラー発見   |
| IDE サポート | 基本的なサポート          | 強力な自動補完とリファクタリング |
| 学習曲線   | 低い                       | 高い                       |

### 型システムの違い

**JavaScript（動的型付け）**：

```javascript
let value = 10;
value = 'hello'; // 型を変更可能
value = true; // 型を変更可能

function add(a, b) {
  return a + b;
}

add(1, 2); // 3
add('1', '2'); // '12'（文字列連結）
add(1, '2'); // '12'（型変換）
```

**TypeScript（静的型付け）**：

```typescript
let value: number = 10;
value = 'hello'; // ❌ コンパイルエラー

function add(a: number, b: number): number {
  return a + b;
}

add(1, 2); // ✅ 3
add('1', '2'); // ❌ コンパイルエラー
add(1, '2'); // ❌ コンパイルエラー
```

### コンパイルプロセス

```typescript
// TypeScript ソースコード
let message: string = 'Hello World';
console.log(message);

// ↓ コンパイル後 JavaScript に変換
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> なぜ TypeScript を使うのか？

### メリット

1. **早期のエラー発見** - コンパイル時に型エラーを発見
2. **より良い IDE サポート** - 自動補完とリファクタリング機能
3. **コードの可読性** - 型アノテーションで関数の意図が明確
4. **より安全なリファクタリング** - 型変更時に更新が必要な箇所を自動検出

### デメリット

1. **コンパイルステップが必要** - 開発フローの複雑化
2. **学習曲線** - 型システムの学習が必要
3. **ファイルサイズ** - 型情報がソースコードサイズを増加（コンパイル後は影響なし）
4. **設定の複雑さ** - `tsconfig.json` の設定が必要

## 4. Common Interview Questions

> よくある面接の質問

### 問題 1：型チェックのタイミング

JavaScript と TypeScript での動作の違いを説明してください。

<details>
<summary>クリックして回答を表示</summary>

- JavaScript は**実行時**に型変換を行い、予期しない結果が生じる可能性がある
- TypeScript は**コンパイル時**に型をチェックし、事前にエラーを発見

</details>

### 問題 2：型推論

```typescript
let value1 = 10;
let value2 = 'hello';
value1 = 'world'; // ?
value2 = 20; // ?
```

<details>
<summary>クリックして回答を表示</summary>

TypeScript は初期値に基づいて自動的に型を推論します。推論後に型を変更することはできません（`any` や `union` 型として明示的に宣言しない限り）。両方ともコンパイルエラーになります。

</details>

### 問題 3：実行時の動作

TypeScript コンパイル後の JavaScript コードとの違いを説明してください。

<details>
<summary>クリックして回答を表示</summary>

- TypeScript の**型アノテーションはコンパイル後に完全に消える**
- コンパイル後の JavaScript は純粋な JavaScript と完全に同じ
- TypeScript は**開発段階**でのみ型チェックを提供し、実行時のパフォーマンスには影響しない

</details>

### 問題 4：型エラー vs 実行時エラー

<details>
<summary>クリックして回答を表示</summary>

- **TypeScript コンパイル時エラー**：開発段階で発見、コンパイル成功しないと実行不可
- **JavaScript 実行時エラー**：ユーザー使用時に発見、プログラムクラッシュの原因に

TypeScript は型チェックにより実行時エラーの多くを事前に防止できます。

</details>

## 5. Best Practices

> ベストプラクティス

### 推奨される方法

```typescript
// 1. 関数の戻り値の型を明示
function add(a: number, b: number): number {
  return a + b;
}

// 2. interface で複雑なオブジェクト構造を定義
interface User {
  name: string;
  age: number;
  email?: string;
}

// 3. any を避け、unknown を優先使用
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. 型エイリアスで可読性を向上
type UserID = string;
```

### 避けるべき方法

```typescript
// 1. any を多用しない
// 2. 型エラーを @ts-ignore で無視しない
// 3. 型アノテーションと推論の使い方を一貫させる
```

## 6. Interview Summary

> 面接のまとめ

### クイックリファレンス

- JavaScript のスーパーセット、静的型システムを追加
- コンパイル時に型チェック、実行時は JavaScript と同じ
- より良い開発体験とエラー予防を提供

### 面接の回答例

**Q: TypeScript と JavaScript の主な違いは何ですか？**

> "TypeScript は JavaScript のスーパーセットで、主な違いは静的型システムが追加されている点です。JavaScript は動的型付け言語で型チェックは実行時に行われますが、TypeScript は静的型付け言語で型チェックはコンパイル時に行われます。これにより開発段階で型関連のエラーを発見でき、実行時まで待つ必要がありません。TypeScript はコンパイル後に純粋な JavaScript に変換されるため、実行時の動作は JavaScript と完全に同じです。"

**Q: なぜ TypeScript を使うのですか？**

> "TypeScript の主な利点は：1) 早期のエラー発見 - コンパイル時に型エラーを検出；2) より良い IDE サポート - 自動補完とリファクタリング機能；3) コードの可読性向上 - 型アノテーションで関数の意図が明確；4) より安全なリファクタリング - 型変更時に更新箇所を自動検出。ただし学習曲線とコンパイルステップの追加コストも考慮する必要があります。"

## Reference

- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
