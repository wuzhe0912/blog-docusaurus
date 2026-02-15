---
id: css-box-model
title: '[Easy] 🏷️ Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## Default

`Box Model` は `CSS` においてレイアウト設計を議論するための用語です。これは `HTML` 要素を包み込むボックスとして理解でき、4つの主要な属性があります：

- content：要素のコンテンツ（テキストなど）を表示するために使用
- padding：要素のコンテンツと要素の境界との間の距離
- margin：要素と外部の他の要素との距離
- border：要素自体の境界線

## box-sizing

`Box Model` のタイプを決定するには、`box-sizing` プロパティを使用します。

これは、要素の幅と高さを計算する際に、`padding` と `border` の2つの属性が内側に充填されるか、外側に拡張されるかを指定するものです。

デフォルト値は `content-box` で、外側に拡張されます。この条件下では、要素自体の幅と高さに加えて、追加の `padding` と `border` も計算に含める必要があります。以下の例を参照してください：

```css
div {
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

この `div` の幅の計算は `100px(width)` + `20px(左右の padding)` + `2px(左右の border)` = `122px` となります。

## border-box

上記の方式は明らかに信頼性に欠け、フロントエンド開発時に常に要素の幅と高さを計算し続ける必要があります。開発体験を改善するために、別のモード、すなわち `border-box` を採用する必要があります。

以下の例のように、スタイルの初期化時にすべての要素の `box-sizing` の値を `border-box` に設定します：

```css
* {
  box-sizing: border-box; // global style
}
```

これにより、内側に充填する形式に変わり、要素の幅と高さの設計がより直感的になり、`padding` や `border` のために数値を増減する必要がなくなります。

## 比較問題

以下の同じスタイル設定があると仮定します：

```css
.box {
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid #000;
  margin: 20px;
}
```

### content-box（デフォルト値）

- **実際の占有幅** = `100px(width)` + `20px(左右の padding)` + `10px(左右の border)` = `130px`
- **実際の占有高さ** = `100px(height)` + `20px(上下の padding)` + `10px(上下の border)` = `130px`
- **content 領域** = `100px × 100px`
- **注意**：`margin` は要素の幅に含まれませんが、他の要素との距離に影響します

### border-box

- **実際の占有幅** = `100px`（padding と border が内側に圧縮）
- **実際の占有高さ** = `100px`
- **content 領域** = `100px` - `20px(左右の padding)` - `10px(左右の border)` = `70px × 70px`
- **注意**：`margin` は同様に要素の幅に含まれません

### ビジュアル比較

```
content-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (100×100)       │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
合計幅：130px（margin を除く）

border-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (70×70)         │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
合計幅：100px（margin を除く）
```

## よくある落とし穴

### 1. margin の扱い

`content-box` でも `border-box` でも、**margin は要素の幅と高さに含まれません**。2つのモードは `padding` と `border` の計算方法にのみ影響します。

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 5px solid;
  margin: 20px; /* width に含まれない */
}
/* 要素の実際の占有幅は 100px のままだが、他の要素との距離が 20px 増える */
```

### 2. パーセンテージ幅

パーセンテージ幅を使用する場合、計算方法も `box-sizing` の影響を受けます：

```css
.parent {
  width: 200px;
}

.child {
  width: 50%; /* 親要素の 50% = 100px を継承 */
  padding: 10px;
  border: 5px solid;
}

/* content-box: 実際の占有幅 130px（親要素を超える可能性あり） */
/* border-box: 実際の占有幅 100px（ちょうど親要素の 50%） */
```

### 3. inline 要素

`box-sizing` は `inline` 要素には効果がありません。inline 要素の `width` と `height` の設定自体が無効だからです。

```css
span {
  display: inline;
  width: 100px; /* 無効 */
  box-sizing: border-box; /* これも無効 */
}
```

### 4. min-width / max-width

`min-width` と `max-width` も同様に `box-sizing` の影響を受けます：

```css
.box {
  box-sizing: border-box;
  min-width: 100px; /* padding と border を含む */
  padding: 10px;
  border: 5px solid;
}
/* content の最小幅 = 100 - 20 - 10 = 70px */
```

## Reference

- [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [学習 CSS レイアウト](https://zh-tw.learnlayout.com/box-sizing.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
