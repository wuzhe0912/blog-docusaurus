---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> HTTP キャッシュとは何か？なぜ重要なのか？

HTTP キャッシュとは、クライアント（ブラウザ）や中間サーバーに HTTP レスポンスを一時的に保存する技術です。後続のリクエスト時にキャッシュされたデータを直接使用でき、サーバーに再度リクエストする必要がなくなります。

### キャッシュ vs 一時保存：何が違うのか？

技術文書では、この2つの用語がしばしば混同されますが、実際には異なる意味を持っています。

#### Cache（キャッシュ）

**定義**：**パフォーマンス最適化**のために保存されるデータのコピーで、「再利用」と「アクセスの高速化」を重視します。

**特徴**：

- ✅ パフォーマンス向上が目的
- ✅ データを繰り返し使用可能
- ✅ 明確な有効期限ポリシーがある
- ✅ 通常は元データのコピー

**例**：

```javascript
// HTTP Cache - API レスポンスのキャッシュ
Cache-Control: max-age=3600  // 1時間キャッシュ

// Memory Cache - 計算結果のキャッシュ
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // キャッシュを再利用
  const result = /* 計算 */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage（一時保存）

**定義**：**一時的に保存**されるデータで、「一時性」と「削除される」ことを重視します。

**特徴**：

- ✅ 一時的な保存が目的
- ✅ 必ずしも再利用されるとは限らない
- ✅ ライフサイクルが通常短い
- ✅ 中間状態を含む場合がある

**例**：

```javascript
// sessionStorage - ユーザー入力の一時保存
sessionStorage.setItem('formData', JSON.stringify(form)); // タブを閉じると削除

// ファイルアップロードの一時保存
const tempFile = await uploadToTemp(file); // 処理後に削除
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### 比較表

| 特性         | Cache（キャッシュ）      | Temporary Storage（一時保存） |
| ------------ | ------------------------ | ----------------------------- |
| **主な目的** | パフォーマンス最適化     | 一時的な保存                  |
| **再利用**   | はい、複数回の読み取り   | 必ずしもそうではない          |
| **ライフサイクル** | ポリシーに基づく   | 通常は短い                    |
| **典型的な用途** | HTTP Cache, Memory Cache | sessionStorage, 一時ファイル |
| **英語対応** | Cache                    | Temp / Temporary / Buffer     |

#### 実際の使用における違い

```javascript
// ===== Cache（キャッシュ）の使用シーン =====

// 1. HTTP キャッシュ：API レスポンスの再利用
fetch('/api/users') // 初回リクエスト
  .then((response) => response.json());

fetch('/api/users') // 2回目はキャッシュから読み取り
  .then((response) => response.json());

// 2. 計算結果のキャッシュ
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // 再利用
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Temporary Storage（一時保存）の使用シーン =====

// 1. フォームデータの一時保存（誤って閉じることを防止）
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. アップロードファイルの一時保存
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // 一時保存
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // 使用後に削除
  return processed;
}

// 3. 中間計算結果の一時保存
const tempResults = []; // 中間結果を一時保存
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // 使用後は不要
```

#### Web 開発での応用

```javascript
// HTTP Cache（キャッシュ）- 長期保存、繰り返し使用
Cache-Control: public, max-age=31536000, immutable
// → ブラウザはこのファイルを1年間キャッシュし、繰り返し使用

// sessionStorage（一時保存）- 一時的な保存、閉じたら削除
sessionStorage.setItem('tempData', data);
// → 現在のタブでのみ有効、閉じると削除

// localStorage（長期保存）- 両者の中間
localStorage.setItem('userPreferences', prefs);
// → 永続的に保存されるが、パフォーマンス最適化のためではない
```

### なぜこの2つの概念を区別することが重要なのか？

1. **設計上の判断**：

   - パフォーマンス最適化が必要？ → キャッシュを使用
   - 一時的な保存が必要？ → 一時保存を使用

2. **リソース管理**：

   - キャッシュ：ヒット率、有効期限ポリシーを重視
   - 一時保存：クリーンアップのタイミング、容量制限を重視

3. **面接での回答**：

   - 「パフォーマンスをどう最適化するか」→ キャッシュ戦略について話す
   - 「一時データをどう扱うか」→ 一時保存の方法について話す

本記事では、主に **Cache（キャッシュ）**、特に HTTP キャッシュの仕組みについて説明します。

### キャッシュのメリット

1. **ネットワークリクエストの削減**：ローカルキャッシュから直接読み取り、HTTP リクエストの送信が不要
2. **サーバー負荷の軽減**：サーバーが処理するリクエスト数を削減
3. **ページ読み込み速度の向上**：ローカルキャッシュの読み取り速度はネットワークリクエストよりはるかに速い
4. **帯域幅の節約**：データ転送量を削減
5. **ユーザー体験の改善**：ページの応答が速く、よりスムーズに使用できる

### キャッシュの種類

```text
┌─────────────────────────────────────┐
│        ブラウザキャッシュの階層       │
├─────────────────────────────────────┤
│  1. Memory Cache（メモリキャッシュ） │
│     - 最速、容量は小さい             │
│     - タブを閉じると削除             │
├─────────────────────────────────────┤
│  2. Disk Cache（ディスクキャッシュ） │
│     - より遅い、容量は大きい         │
│     - 永続的に保存                   │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - 開発者が完全にコントロール     │
│     - オフラインアプリのサポート     │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> HTTP キャッシュ戦略にはどのようなものがあるか？

### キャッシュ戦略の分類

```text
HTTP キャッシュ戦略
├── 強キャッシュ (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── ネゴシエーションキャッシュ (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. 強キャッシュ（Strong Cache / Fresh）

**特徴**：ブラウザがローカルキャッシュから直接読み取り、サーバーへのリクエストを送信しません。

#### Cache-Control（HTTP/1.1）

```http
Cache-Control: max-age=3600
```

**よく使用されるディレクティブ**：

```javascript
// 1. max-age：キャッシュの有効時間（秒）
Cache-Control: max-age=3600  // 1時間キャッシュ

// 2. no-cache：サーバーへの検証が必要（ネゴシエーションキャッシュを使用）
Cache-Control: no-cache

// 3. no-store：まったくキャッシュしない
Cache-Control: no-store

// 4. public：どのキャッシュでも保存可能（ブラウザ、CDN）
Cache-Control: public, max-age=31536000

// 5. private：ブラウザのみキャッシュ可能
Cache-Control: private, max-age=3600

// 6. immutable：リソースは変更されない（hash ファイル名と併用）
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate：期限切れ後はサーバーで検証が必要
Cache-Control: max-age=3600, must-revalidate
```

#### Expires（HTTP/1.0、非推奨）

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**問題点**：

- 絶対時間を使用し、クライアント時間に依存する
- クライアント時間が不正確だとキャッシュが正しく動作しない
- `Cache-Control` に置き換えられた

### 2. ネゴシエーションキャッシュ（Negotiation Cache / Validation）

**特徴**：ブラウザがサーバーにリクエストを送信し、リソースが更新されたかどうかを確認します。

#### Last-Modified / If-Modified-Since

```http
# サーバーレスポンス（初回リクエスト）
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# ブラウザリクエスト（後続リクエスト）
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**フロー**：

1. 初回リクエスト：サーバーが `Last-Modified` を返す
2. 後続リクエスト：ブラウザが `If-Modified-Since` を付与
3. リソース未変更：サーバーが `304 Not Modified` を返す
4. リソース変更済み：サーバーが `200 OK` と新しいリソースを返す

#### ETag / If-None-Match

```http
# サーバーレスポンス（初回リクエスト）
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# ブラウザリクエスト（後続リクエスト）
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**メリット**：

- `Last-Modified` より正確
- 時間に依存せず、コンテンツの hash を使用
- 秒以下の変更も検出可能

### Last-Modified vs ETag

| 特性       | Last-Modified    | ETag                     |
| ---------- | ---------------- | ------------------------ |
| 精度       | 秒単位           | コンテンツ hash、より正確 |
| パフォーマンス | より速い      | hash の計算が必要、より遅い |
| 適用シーン | 一般的な静的リソース | 精密な制御が必要なリソース |
| 優先度     | 低               | 高（ETag が優先）        |

## 3. How does browser caching work?

> ブラウザキャッシュの動作フローとは？

### 完全なキャッシュフロー

```text
┌──────────────────────────────────────────────┐
│        ブラウザのリソースリクエストフロー       │
└──────────────────────────────────────────────┘
                    ↓
         1. Memory Cache を確認
                    ↓
            ┌───────┴────────┐
            │ キャッシュあり？ │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. Disk Cache を確認
                    ↓
            ┌───────┴────────┐
            │ キャッシュあり？ │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. Service Worker を確認
                    ↓
            ┌───────┴────────┐
            │ キャッシュあり？ │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. キャッシュの期限切れを確認
                    ↓
            ┌───────┴────────┐
            │   期限切れ？     │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. ネゴシエーションキャッシュで検証
                    ↓
            ┌───────┴────────┐
            │ リソース変更？   │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. サーバーに新リソースをリクエスト
                    ↓
            ┌───────┴────────┐
            │ 新リソースを返す │
            │  (200 OK)       │
            └────────────────┘
```

### 実際の例

```javascript
// 初回リクエスト
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== 1時間以内に再度リクエスト ==========
// 強キャッシュ：ローカルから直接読み取り、リクエストを送信しない
// Status: 200 OK (from disk cache)

// ========== 1時間後に再度リクエスト ==========
// ネゴシエーションキャッシュ：検証リクエストを送信
GET /api/data.json
If-None-Match: "abc123"

// リソース未変更
Response:
  304 Not Modified
  (body を返さず、ローカルキャッシュを使用)

// リソース変更済み
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> よく使われるキャッシュ戦略にはどのようなものがあるか？

### 1. 永続キャッシュ戦略（静的リソースに適用）

```javascript
// HTML：キャッシュしない、毎回チェック
Cache-Control: no-cache

// CSS/JS（hash 付き）：永続キャッシュ
Cache-Control: public, max-age=31536000, immutable
// ファイル名：main.abc123.js
```

**原理**：

- HTML はキャッシュしない、ユーザーが最新版を取得することを保証
- CSS/JS は hash ファイル名を使用し、内容が変わるとファイル名も変わる
- 旧バージョンは使用されず、新バージョンが再ダウンロードされる

### 2. 頻繁に更新されるリソースの戦略

```javascript
// API データ：短期間キャッシュ + ネゴシエーションキャッシュ
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. 画像リソースの戦略

```javascript
// ユーザーアバター：中期キャッシュ
Cache-Control: public, max-age=86400  // 1日

// ロゴ、アイコン：長期キャッシュ
Cache-Control: public, max-age=2592000  // 30日

// 動的画像：ネゴシエーションキャッシュ
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. リソースタイプ別のキャッシュ推奨事項

```javascript
const cachingStrategies = {
  // HTML ファイル
  html: 'Cache-Control: no-cache',

  // hash 付きの静的リソース
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // あまり更新されない静的リソース
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // API データ
  apiData: 'Cache-Control: private, max-age=60',

  // ユーザー固有のデータ
  userData: 'Cache-Control: private, no-cache',

  // 機密データ
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Service Worker キャッシュ

Service Worker は最も柔軟なキャッシュ制御を提供し、開発者がキャッシュロジックを完全にコントロールできます。

### 基本的な使い方

```javascript
// Service Worker の登録
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - Service Worker ファイル
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// インストールイベント：静的リソースをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// リクエストインターセプト：キャッシュ戦略を使用
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュ優先戦略
      return response || fetch(event.request);
    })
  );
});

// 更新イベント：古いキャッシュをクリーンアップ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### よく使われるキャッシュ戦略

#### 1. Cache First（キャッシュ優先）

```javascript
// 適用：静的リソース
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First（ネットワーク優先）

```javascript
// 適用：API リクエスト
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // キャッシュを更新
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // ネットワーク失敗、キャッシュを使用
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate（期限切れ後に再検証）

```javascript
// 適用：高速なレスポンスが必要だが、更新も維持したいリソース
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // キャッシュを返し、バックグラウンドで更新
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> Cache Busting をどう実装するか？

Cache Busting は、ユーザーが最新のリソースを取得することを保証する技術です。

### 方法 1：ファイル名 Hash（推奨）

```javascript
// Webpack/Vite などのバンドルツールを使用
// 出力：main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- 参照を自動更新 -->
<script src="/js/main.abc123.js"></script>
```

**メリット**：

- ✅ ファイル名が変わり、新しいファイルのダウンロードを強制
- ✅ 旧バージョンはキャッシュのまま、無駄にならない
- ✅ ベストプラクティス

### 方法 2：Query String バージョン番号

```html
<!-- バージョン番号を手動で更新 -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**デメリット**：

- ❌ 一部の CDN は query string 付きのリソースをキャッシュしない
- ❌ バージョン番号の手動管理が必要

### 方法 3：タイムスタンプ

```javascript
// 開発環境で使用
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**用途**：

- 開発環境でキャッシュを回避
- 本番環境には不向き（毎回新しいリクエストになる）

## 7. Common caching interview questions

> よくあるキャッシュの面接問題

### 問題 1：HTML をキャッシュさせないようにするには？

<details>
<summary>クリックして回答を表示</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

または meta タグを使用：

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### 問題 2：なぜ Last-Modified だけでなく ETag を使うべきなのか？

<details>
<summary>クリックして回答を表示</summary>

**ETag の利点**：

1. **より正確**：秒以下の変更も検出可能
2. **コンテンツ駆動**：時間ではなく、コンテンツの hash に基づく
3. **時間の問題を回避**：
   - ファイル内容は変わっていないが時間が変わった場合（再デプロイなど）
   - 周期的に同じ内容に戻るリソース
4. **分散システム**：異なるサーバー間で時間が同期していない可能性がある

**例**：

```javascript
// ファイル内容は変わっていないが、Last-Modified が変わった
// 2024-01-01 12:00 - バージョン A をデプロイ（内容：abc）
// 2024-01-02 12:00 - バージョン A を再デプロイ（内容：abc）
// Last-Modified は変わったが、内容は同じ！

// ETag にはこの問題がない
ETag: 'hash-of-abc'; // 常に同じ
```

</details>

### 問題 3：from disk cache と from memory cache の違いは？

<details>
<summary>クリックして回答を表示</summary>

| 特性       | Memory Cache       | Disk Cache    |
| ---------- | ------------------ | ------------- |
| 保存場所   | メモリ（RAM）      | ハードディスク |
| 速度       | 非常に高速         | より遅い      |
| 容量       | 小（MB レベル）    | 大（GB レベル）|
| 持続性     | タブを閉じると削除 | 永続的に保存  |
| 優先度     | 高（優先的に使用） | 低            |

**読み込みの優先順序**：

```text
1. Memory Cache（最速）
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. ネットワークリクエスト（最も遅い）
```

**トリガー条件**：

- **Memory Cache**：直近にアクセスしたリソース（ページの再読み込みなど）
- **Disk Cache**：しばらく前にアクセスしたリソース、またはサイズが大きいリソース

</details>

### 問題 4：ブラウザにリソースを強制的に再読み込みさせるには？

<details>
<summary>クリックして回答を表示</summary>

**開発段階**：

```javascript
// 1. Hard Reload（Ctrl/Cmd + Shift + R）
// 2. キャッシュをクリアして再読み込み

// 3. コードにタイムスタンプを追加
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**本番環境**：

```javascript
// 1. ファイル名 hash を使用（ベストプラクティス）
main.abc123.js  // Webpack/Vite が自動生成

// 2. バージョン番号を更新
<script src="/js/main.js?v=2.0.0"></script>

// 3. Cache-Control を設定
Cache-Control: no-cache  // 強制検証
Cache-Control: no-store  // まったくキャッシュしない
```

</details>

### 問題 5：PWA オフラインキャッシュはどう実装するか？

<details>
<summary>クリックして回答を表示</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// インストール時にオフラインページをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/styles/offline.css',
        '/images/offline-icon.png',
      ]);
    })
  );
});

// リクエストインターセプト
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // ネットワーク失敗、オフラインページを表示
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**完全な PWA キャッシュ戦略**：

```javascript
// 1. 静的リソースをキャッシュ
caches.addAll(['/css/', '/js/', '/images/']);

// 2. API リクエスト：Network First
// 3. 画像：Cache First
// 4. HTML：Network First、失敗時にオフラインページを表示
```

</details>

## 8. Best practices

> ベストプラクティス

### ✅ 推奨される方法

```javascript
// 1. HTML - キャッシュしない、ユーザーが最新版を取得することを保証
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS（hash 付き）- 永続キャッシュ
// ファイル名：main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. 画像 - 長期キャッシュ
Cache-Control: public, max-age=2592000  // 30日

// 4. API データ - 短期キャッシュ + ネゴシエーションキャッシュ
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Service Worker を使用してオフラインサポートを実装
```

### ❌ 避けるべき方法

```javascript
// ❌ 悪い例：HTML に長期キャッシュを設定
Cache-Control: max-age=31536000  // ユーザーが古いバージョンを見る可能性がある

// ❌ 悪い例：Cache-Control の代わりに Expires を使用
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0、非推奨

// ❌ 悪い例：キャッシュをまったく設定しない
// キャッシュヘッダーがなく、ブラウザの動作が不定

// ❌ 悪い例：すべてのリソースに同じ戦略を使用
Cache-Control: max-age=3600  // リソースタイプに応じて調整すべき
```

### キャッシュ戦略の決定木

```text
静的リソースか？
├─ はい → ファイル名に hash があるか？
│        ├─ はい → 永続キャッシュ（max-age=31536000, immutable）
│        └─ いいえ → 中長期キャッシュ（max-age=2592000）
└─ いいえ → HTML か？
           ├─ はい → キャッシュしない（no-cache）
           └─ いいえ → API か？
                  ├─ はい → 短期キャッシュ + ネゴシエーション（max-age=60, ETag）
                  └─ いいえ → 更新頻度に応じて決定
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/ja/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/ja/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
