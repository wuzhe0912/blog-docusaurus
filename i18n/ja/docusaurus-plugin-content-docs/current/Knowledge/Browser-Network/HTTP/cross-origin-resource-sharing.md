---
id: cross-origin-resource-sharing
title: 📄 CORS
slug: /cross-origin-resource-sharing
---

## 1. What is between JSONP and CORS ?

JSONP（JSON with Padding）と CORS（Cross-Origin Resource Sharing、クロスオリジンリソース共有）は、クロスオリジンリクエストを実現するための2つの技術で、ウェブページが異なるドメイン（ウェブサイト）からデータをリクエストすることを可能にします。

### JSONP

JSONP は比較的古い技術で、初期の同一オリジンポリシーの制限を解決するために使用され、ウェブページが異なるオリジン（ドメイン、プロトコル、ポート）からデータをリクエストできるようにします。`<script>` タグの読み込みは同一オリジンポリシーの制限を受けないため、JSONP は `<script>` タグを動的に追加し、JSON データを返す URL を指定することで動作します。その URL のレスポンスは関数呼び出しでラップされ、ウェブページ上の JavaScript がデータを受信するためにその関数を事前に定義します。

```javascript
// client-side
function receiveData(jsonData) {
  console.log(jsonData);
}

let script = document.createElement('script');
script.src = 'http://example.com/data?callback=receiveData';
document.body.appendChild(script);
```

```javascript
// server-side
receiveData({ name: 'PittWu', type: 'player' });
```

欠点は、セキュリティリスクが高いこと（任意の JavaScript を実行できるため）と、GET リクエストのみをサポートすることです。

### CORS

CORS は JSONP よりも安全で現代的な技術です。HTTP ヘッダー `Access-Control-Allow-Origin` を使用して、ブラウザにそのリクエストが許可されていることを伝えます。サーバーが関連する CORS ヘッダー情報を設定して、どのオリジンがリソースにアクセスできるかを決定します。

`http://client.com` のフロントエンドが `http://api.example.com` のリソースにアクセスしたい場合、`api.example.com` はそのレスポンスに以下の HTTP header を含める必要があります：

```http
Access-Control-Allow-Origin: http://client.com
```

または、任意のオリジンを許可する場合：

```http
Access-Control-Allow-Origin: *
```

CORS はあらゆる種類の HTTP リクエストに使用でき、クロスオリジンリクエストを実行するための標準化された安全な方法です。
