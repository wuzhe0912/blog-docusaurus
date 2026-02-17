---
id: web-browsing-process
title: 📄 Web ブラウジングプロセス
slug: /web-browsing-process
---

## 1. Please explain how the browser obtains HTML from the server and how the browser renders the HTML on the screen

> ブラウザがサーバーから HTML を取得し、画面に HTML をレンダリングする仕組みを説明してください

### 1. リクエストの発行

- **URL 入力**：ユーザーがブラウザに URL を入力するか、リンクをクリックすると、ブラウザはその URL を解析し、どのサーバーにリクエストを送信するかを確認します。
- **DNS ルックアップ**：ブラウザは DNS ルックアップを実行し、対応するサーバーの IP アドレスを取得します。
- **接続の確立**：ブラウザはインターネットを介して HTTP または HTTPS プロトコルを使用し、サーバーの IP アドレスにリクエストを送信します。HTTPS プロトコルの場合は、SSL/TLS 接続も必要です。

### 2. サーバー側のレスポンス

- **リクエスト処理**：サーバーはリクエストを受信した後、リクエストのパスとパラメータに基づいて、データベースから対応するデータを読み取ります。
- **Response の送信**：続いて HTML ファイルを HTTP Response の一部としてブラウザに返送します。Response にはステータスコードやその他のパラメータ（cors, content-type）なども含まれます。

### 3. HTML の解析

- **DOM Tree の構築**：ブラウザは HTML ファイルを読み取り、HTML のタグと属性に基づいて DOM に変換し、メモリ内で DOM Tree の構築を開始します。
- **requesting subresources（サブリソースの要求）**：HTML ファイルの解析中に、CSS、JavaScript、画像などの外部リソースに遭遇した場合、ブラウザはさらにサーバーにリクエストを送信してこれらのリソースを取得します。

### 4. Render Page（ページのレンダリング）

- **CSSOM Tree の構築**：ブラウザは CSS ファイルを解析し、CSSOM Tree を構築します。
- **Render Tree**：ブラウザは DOM Tree と CSSOM Tree を統合して Render Tree を生成します。これにはレンダリングすべきすべてのノードと対応するスタイルが含まれます。
- **Layout（レイアウト）**：ブラウザはレイアウト処理（Layout または Reflow）を開始し、各ノードの位置とサイズを計算します。
- **Paint（描画）**：最後にブラウザは描画（painting）フェーズを経て、各ノードの内容をページに描画します。

### 5. JavaScript インタラクション

- **JavaScript の実行**：HTML に JavaScript が含まれている場合、ブラウザはそれを解析して実行します。この操作によって DOM の変更やスタイルの修正が行われる場合があります。

全体のプロセスは段階的に進行します。理論上、ユーザーはまず部分的なウェブページコンテンツを目にし、最終的に完全なウェブページを見ることになります。このプロセス中に、特にウェブページに複雑なスタイルやインタラクション効果が含まれている場合は、複数回のリフローとリペイントがトリガーされる可能性があります。この時、ブラウザ自体の最適化に加えて、開発者も通常、ユーザー体験をよりスムーズにするためにさまざまな手法を採用します。

## 2. Please describe Reflow and Repaint

### Reflow（リフロー/再配置）

ウェブページ内の DOM に変更が発生し、ブラウザが要素の位置を再計算して正しい場所に配置する必要があることを指します。簡単に言えば、Layout が要素を再配置する必要がある状態です。

#### Reflow のトリガー

リフローには2つのシナリオがあります。ページ全体に変更が発生するグローバルなケースと、一部の component ブロックに変更が発生するケースです。

- ページへの初回アクセス時は、最も影響の大きいリフローが発生します
- DOM 要素の追加または削除
- 要素のサイズ変更（テキストの増加やフォントサイズの変更など）
- 要素のレイアウト方式の調整（margin や padding による位置調整など）
- ブラウザのウィンドウサイズの変更
- 疑似クラスのトリガー（hover 効果など）

### Repaint（リペイント/再描画）

Layout を変更せず、単純に要素を更新または変更することです。要素は Layout に内包されているため、リフローがトリガーされると必ずリペイントも発生します。逆に、リペイントのみがトリガーされた場合はリフローが発生するとは限りません。

#### Repaint のトリガー

- 要素の色や背景の変更（color の追加や background 属性の調整など）
- 要素のシャドウや border の変更もリペイントに該当します

### Reflow や Repaint の最適化方法

- table レイアウトを使用しないこと。table の属性は変更によってレイアウトが再配置されやすいためです。やむを得ず使用する場合は、一度に1行のみレンダリングするように以下の属性を追加し、テーブル全体への影響を避けることを推奨します（例：`table-layout: auto;` or `table-layout: fixed;`）。
- DOM を操作してスタイルを個別に調整するのではなく、変更が必要なスタイルを class で事前に定義し、JS で切り替えるべきです。
  - Vue フレームワークを例に挙げると、class のバインディングでスタイルを切り替え、function で直接スタイルを変更しないようにします。
- 頻繁に切り替えが必要なシーン（タブ切り替えなど）では、`v-if` ではなく `v-show` を優先的に使用すべきです。前者は CSS の `display: none;` 属性で非表示にするだけですが、後者はライフサイクルをトリガーし、要素の再作成や破棄を行うため、パフォーマンスへの影響が大きくなります。
- やむを得ずリフローをトリガーする必要がある場合は、`requestAnimationFrame` を使用して最適化できます（この API はアニメーション用に設計されており、ブラウザの描画フレームと同期できるため）。これにより複数回のリフローを1回にまとめ、リペイントの回数を減らすことができます。
  - 例えば、ページ上でターゲットに向かって移動するアニメーションでは、`requestAnimationFrame` を使用して各移動を計算できます。
  - 同様に、CSS3 の一部のプロパティはクライアント側のハードウェアアクセラレーションをトリガーでき、アニメーションのパフォーマンスを向上させます（例：`transform` `opacity` `filters` `Will-change`）。
- 条件が許す限り、できるだけ低い階層の DOM ノードでスタイルを変更し、親要素のスタイル変更によってその下のすべての子要素が影響を受けることを避けます。
- アニメーションを実行する必要がある場合は、絶対位置指定の要素（`absolute`、`fixed`）上で使用できます。これにより他の要素への影響が少なく、リペイントのみがトリガーされ、リフローを回避できます。

### Example

```js
// bad
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// good
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Reference

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [ブラウザのReflowとRepaint](https://juejin.cn/post/6844903569087266823)
- [ReflowとRepaintの紹介と最適化方法](https://juejin.cn/post/7064077572132323365)

## 3. Please describe when will the browser send the options to the server

> ブラウザがサーバーに OPTIONS を送信するタイミングを説明してください

多くの場合、CORS のシナリオで使用されます。実際のリクエストを送信する前に、preflight（プリフライト）というアクションがあり、ブラウザはまず OPTIONS リクエストを送信して、サーバーがそのクロスオリジンリクエストを許可するかどうかを確認します。サーバーが許可を返した場合、ブラウザは実際のリクエストを送信します。許可されない場合は、ブラウザがエラーを表示します。

また、リクエストのメソッドが `GET`、`HEAD`、`POST` でない場合にも OPTIONS リクエストがトリガーされます。
