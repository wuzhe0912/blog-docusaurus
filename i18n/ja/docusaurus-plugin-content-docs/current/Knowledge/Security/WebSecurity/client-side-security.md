---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Can you explain what CSP (Content Security Policy) is?

> CSP (Content Security Policy) とは何か説明できますか？

基本的に、CSP はウェブページのセキュリティを強化するメカニズムで、HTTP header を設定することで、ウェブページのコンテンツが読み込めるデータソース（ホワイトリスト）を制限し、悪意のある攻撃者が悪意のある script を注入してユーザーのデータを窃取することを防ぎます。

フロントエンドの観点から、XSS (Cross-site scripting) 攻撃を防ぐために、モダンフレームワークを使用して開発することが多くなっています。これは、基本的な保護メカニズムが提供されているためです。例えば、React の JSX は自動的に HTML エスケープを行い、Vue は `{{ data }}` でデータバインディングを行いながら HTML タグを自動エスケープします。

フロントエンドでできることは限られていますが、いくつかの細かな最適化は可能です。例えば：

1. 入力が必要なフォームでは、特殊文字のバリデーションで攻撃を防止できます（ただし全てのシナリオを想定するのは困難です）。そのため、入力長さの制限や入力タイプの制限でクライアント側の入力を制御することが多いです。
2. 外部リンクを参照する場合は、http url を避けて https url を使用します。
3. 静的ページのサイトでは、以下のように meta tag を設定して制限できます。

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`：デフォルトでは、同一オリジン（同一ドメイン）からのデータ読み込みのみを許可。
- `img-src https://*`：HTTPS プロトコルからのデータ読み込みのみを許可。
- `child-src 'none'`：`<iframe>` などの外部子コンテンツの埋め込みを禁止。

## 2. What is XSS (Cross-site scripting) attack?

> XSS (Cross-site scripting) 攻撃とは何ですか？

XSS、すなわちクロスサイトスクリプティング攻撃とは、攻撃者が悪意のあるスクリプトを注入し、ユーザーのブラウザ上で実行させることで、cookie などの機密データを取得したり、ウェブページの内容を直接改ざんしてユーザーを悪意のあるサイトへ誘導する攻撃です。

### 格納型 XSS の防止

攻撃者はコメント機能などを通じて、悪意のある HTML や script をデータベースに格納する可能性があります。この場合、バックエンドがエスケープ処理を行うほか、フロントエンドのモダンフレームワーク（React の JSX や Vue の template `{{ data }}`）もエスケープ処理を行い、XSS 攻撃の確率を低減します。

### 反射型 XSS の防止

`innerHTML` を使用した DOM 操作は避けてください。HTML タグが実行される可能性があるため、一般的には `textContent` を使用した操作を推奨します。

### DOM-based XSS の防止

基本的に、ユーザーが HTML を直接ページに挿入できないようにします。シナリオ上の必要がある場合、フレームワーク自体にも類似のディレクティブがあります。例えば React の `dangerouslySetInnerHTML` や Vue の `v-html` は、可能な限り XSS を自動的に防止します。ただし、ネイティブ JS で開発する場合は、`textContent`、`createElement`、`setAttribute` を使用して DOM を操作するようにしてください。
