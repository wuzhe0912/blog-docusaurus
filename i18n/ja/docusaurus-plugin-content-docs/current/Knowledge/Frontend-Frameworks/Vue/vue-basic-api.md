---
id: vue-basic-api
title: '[Medium] 📄 Vue 基本と API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> Vue フレームワークのコア原理と優位性について説明してください

### コア原理

Vue はプログレッシブな JavaScript フレームワークであり、そのコア原理には以下の重要な概念が含まれます：

#### 1. 仮想 DOM（Virtual DOM）

仮想 DOM を使用してパフォーマンスを向上させます。DOM Tree 全体を再レンダリングするのではなく、変更のある DOM ノードのみを更新します。diff アルゴリズムにより新旧の仮想 DOM の差分を比較し、差分部分のみに対して実際の DOM 操作を行います。

```js
// 仮想 DOM の概念イメージ
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. データ双方向バインディング（Two-way Data Binding）

双方向データバインディングにより、モデル（Model）が変更されるとビュー（View）が自動的に更新され、逆も同様です。これにより開発者は手動で DOM を操作する必要がなく、データの変化に集中できます。

```vue
<!-- Vue 3 推奨の書き方：<script setup> -->
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

<details>
<summary>Options API の書き方</summary>

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },
};
</script>
```

</details>

#### 3. コンポーネントベース（Component-based）

アプリケーション全体をコンポーネントに分割することで、再利用性が向上し、メンテナンス・開発の工数を削減できます。各コンポーネントは独自の状態、スタイル、ロジックを持ち、独立して開発・テストできます。

```vue
<!-- Button.vue - Vue 3 <script setup> -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>
```

#### 4. ライフサイクル（Lifecycle Hooks）

独自のライフサイクルを持ち、データが変化した際に対応するライフサイクルフックがトリガーされ、特定のライフサイクルで適切な処理を行うことができます。

```vue
<!-- Vue 3 <script setup> の書き方 -->
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  // コンポーネントのマウント後に実行
  console.log('Component mounted!');
});

onUpdated(() => {
  // データ更新後に実行
  console.log('Component updated!');
});

onUnmounted(() => {
  // コンポーネントのアンマウント後に実行
  console.log('Component unmounted!');
});
</script>
```

#### 5. ディレクティブシステム（Directives）

`v-if`、`v-for`、`v-bind`、`v-model` など、よく使われるディレクティブを提供しており、開発者がより迅速に開発できるようにしています。

```vue
<template>
  <!-- 条件付きレンダリング -->
  <div v-if="isVisible">表示コンテンツ</div>

  <!-- リストレンダリング -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <!-- 属性バインディング -->
  <img :src="imageUrl" :alt="imageAlt" />

  <!-- 双方向バインディング -->
  <input v-model="username" />
</template>
```

#### 6. テンプレート構文（Template Syntax）

template を使用して HTML を記述し、データを補間の形で直接 template にレンダリングできます。

```vue
<template>
  <div>
    <!-- テキスト補間 -->
    <p>{{ message }}</p>

    <!-- 式 -->
    <p>{{ count + 1 }}</p>

    <!-- メソッド呼び出し -->
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Vue の独自の優位性（React との比較）

#### 1. 学習コストが低い

チームメンバー間のスキル格差が大きくなりにくく、また記述スタイルが公式によって統一されているため、自由すぎることを避けられます。異なるプロジェクトのメンテナンスにもすぐに慣れることができます。

```vue
<!-- Vue のシングルファイルコンポーネント構造は明確 -->
<template>
  <!-- HTML テンプレート -->
</template>

<script>
// JavaScript ロジック
</script>

<style>
/* CSS スタイル */
</style>
```

#### 2. 独自のディレクティブ構文を持つ

この点は好みが分かれるかもしれませんが、Vue のディレクティブシステムは一般的な UI ロジックを処理するためのより直感的な方法を提供しています：

```vue
<!-- Vue ディレクティブ -->
<div v-if="isLoggedIn">おかえりなさい</div>
<button @click="handleClick">クリック</button>

<!-- React JSX -->
<div>{isLoggedIn && 'おかえりなさい'}</div>
<button onClick="{handleClick}">クリック</button>
```

#### 3. データ双方向バインディングがより簡単

独自のディレクティブがあるため、開発者はデータ双方向バインディングを非常に簡単に実現できます（`v-model`）。React でも同様の機能を実装できますが、Vue ほど直感的ではありません。

```vue
<!-- Vue 双方向バインディング -->
<input v-model="username" />

<!-- React では手動処理が必要 -->
<input value={username} onChange={(e) => setUsername(e.target.value)} />
```

#### 4. テンプレートとロジックの分離

React の JSX は一部の開発者から批判されることがあり、一部の開発シーンでは、ロジックと UI を分離する方が読みやすく、メンテナンスしやすくなります。

```vue
<!-- Vue：構造が明確 -->
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: 'John',
        email: 'john@example.com',
      },
    };
  },
};
</script>
```

#### 5. 公式エコシステムが充実

Vue 公式は完全なソリューション（Vue Router、Vuex/Pinia、Vue CLI）を提供しており、多数のサードパーティパッケージから選択する必要がありません。

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> `v-model`、`v-bind`、`v-html` の使い方を説明してください

### `v-model`：データ双方向バインディング

データを変更すると同時に template 上のレンダリング内容も変更され、逆に template の内容を変更するとデータも更新されます。

```vue
<template>
  <div>
    <!-- テキスト入力欄 -->
    <input v-model="message" />
    <p>入力内容：{{ message }}</p>

    <!-- チェックボックス -->
    <input type="checkbox" v-model="checked" />
    <p>チェック状態：{{ checked }}</p>

    <!-- セレクトリスト -->
    <select v-model="selected">
      <option value="A">オプション A</option>
      <option value="B">オプション B</option>
    </select>
    <p>選択したオプション：{{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### `v-model` の修飾子

```vue
<!-- .lazy：change イベント後に更新 -->
<input v-model.lazy="msg" />

<!-- .number：自動的に数値に変換 -->
<input v-model.number="age" type="number" />

<!-- .trim：先頭・末尾の空白を自動除去 -->
<input v-model.trim="msg" />
```

### `v-bind`：動的属性バインディング

class やリンク、画像などのバインディングによく使用されます。`v-bind` で class をバインドすると、データの変動によって該当の class スタイルが適用されるかどうかを制御できます。同様に、API から返された画像パスやリンク URL も、バインディングにより動的な更新を維持できます。

```vue
<template>
  <div>
    <!-- class のバインディング（:class と省略可能） -->
    <div :class="{ active: isActive, 'text-danger': hasError }">動的 class</div>

    <!-- style のバインディング -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">動的スタイル</div>

    <!-- 画像パスのバインディング -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- リンクのバインディング -->
    <a :href="linkUrl">リンクへ移動</a>

    <!-- カスタム属性のバインディング -->
    <div :data-id="userId" :data-name="userName"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      textColor: 'red',
      fontSize: 16,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: '画像の説明',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### `v-bind` の省略形

```vue
<!-- 完全な書き方 -->
<img v-bind:src="imageUrl" />

<!-- 省略形 -->
<img :src="imageUrl" />

<!-- 複数の属性をバインド -->
<div v-bind="objectOfAttrs"></div>
```

### `v-html`：HTML 文字列のレンダリング

データの返却内容に HTML タグが含まれている場合、このディレクティブでレンダリングできます。例えば Markdown 構文の表示や、`<img>` タグを含む画像パスが直接返される場合などです。

```vue
<template>
  <div>
    <!-- 通常の補間：HTML タグがそのまま表示される -->
    <p>{{ rawHtml }}</p>
    <!-- 出力：<span style="color: red">赤いテキスト</span> -->

    <!-- v-html：HTML をレンダリング -->
    <p v-html="rawHtml"></p>
    <!-- 出力：赤いテキスト（実際に赤色でレンダリングされる） -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">赤いテキスト</span>',
    };
  },
};
</script>
```

#### ⚠️ セキュリティ警告

**ユーザーが提供するコンテンツに対して絶対に `v-html` を使用しないでください**。XSS（クロスサイトスクリプティング）脆弱性の原因となります！

```vue
<!-- ❌ 危険：ユーザーが悪意のあるスクリプトを注入できる -->
<div v-html="userProvidedContent"></div>

<!-- ✅ 安全：信頼できるコンテンツにのみ使用 -->
<div v-html="markdownRenderedContent"></div>
```

#### 安全な代替手段

```vue
<template>
  <div>
    <!-- ライブラリを使用して HTML をサニタイズ -->
    <div v-html="sanitizedHtml"></div>
  </div>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>',
    };
  },
  computed: {
    sanitizedHtml() {
      // DOMPurify で HTML をクリーニング
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### 三者の比較まとめ

| ディレクティブ | 用途                     | 省略形 | 例                          |
| -------------- | ------------------------ | ------ | --------------------------- |
| `v-model`      | フォーム要素の双方向バインディング | なし   | `<input v-model="msg">`     |
| `v-bind`       | 属性の単方向バインディング         | `:`    | `<img :src="url">`          |
| `v-html`       | HTML 文字列のレンダリング          | なし   | `<div v-html="html"></div>` |

## 3. How to access HTML elements (Template Refs)?

> Vue で HTML 要素を操作する場合、例えば input 要素を取得してフォーカス (focus) するにはどうすればよいか？

Vue では、`document.querySelector` で DOM 要素を取得することは推奨されておらず、代わりに **Template Refs** を使用します。

### Options API (Vue 2 / Vue 3)

テンプレートで `ref` 属性を使って要素をマークし、`this.$refs` でアクセスします。

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      // DOM 要素にアクセス
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    // コンポーネントのマウント後にアクセスを確認
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

`<script setup>` では、同名の `ref` 変数を宣言して要素を取得します。

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. template ref と同名の変数を宣言、初期値は null
const inputElement = ref(null);

const focusInput = () => {
  // 2. .value で DOM にアクセス
  inputElement.value?.focus();
};

onMounted(() => {
  // 3. コンポーネントのマウント後にアクセスを確認
  console.log(inputElement.value);
});
</script>
```

**注意**：

- 変数名は template 中の `ref` 属性値と完全に一致する必要があります。
- コンポーネントのマウント (`onMounted`) 後でなければ DOM 要素にアクセスできず、それ以前は `null` になります。
- `v-for` ループ内で使用する場合、ref は配列になります。

## 4. Please explain the difference between `v-show` and `v-if`

> `v-show` と `v-if` の違いを説明してください

### 共通点（Similarities）

両方とも DOM 要素の表示・非表示を操作するために使用され、条件に応じてコンテンツを表示するかどうかを決定します。

```vue
<template>
  <!-- isVisible が true の場合、両方ともコンテンツを表示 -->
  <div v-if="isVisible">v-if を使用</div>
  <div v-show="isVisible">v-show を使用</div>
</template>
```

### 相違点（Differences）

#### 1. DOM 操作方式が異なる

```vue
<template>
  <div>
    <!-- v-show：CSS の display プロパティで制御 -->
    <div v-show="false">この要素は DOM に存在するが display: none</div>

    <!-- v-if：DOM から直接削除または追加 -->
    <div v-if="false">この要素は DOM に出現しない</div>
  </div>
</template>
```

実際のレンダリング結果：

```html
<!-- v-show のレンダリング結果 -->
<div style="display: none;">この要素は DOM に存在するが display: none</div>

<!-- v-if のレンダリング結果：false の場合は完全に存在しない -->
<!-- DOM ノードなし -->
```

#### 2. パフォーマンスの違い

**`v-show`**：

- ✅ 初回レンダリングコストが大きい（要素は必ず作成される）
- ✅ 切り替えコストが小さい（CSS の変更のみ）
- ✅ **頻繁な切り替え**に適している

**`v-if`**：

- ✅ 初回レンダリングコストが小さい（条件が false の場合はレンダリングしない）
- ❌ 切り替えコストが大きい（要素の破棄/再作成が必要）
- ✅ **条件がめったに変わらない**場景に適している

```vue
<template>
  <div>
    <!-- 頻繁な切り替え：v-show を使用 -->
    <button @click="toggleModal">モーダル切り替え</button>
    <div v-show="showModal" class="modal">
      モーダル内容（頻繁に開閉するため、v-show の方がパフォーマンスが良い）
    </div>

    <!-- めったに切り替えない：v-if を使用 -->
    <div v-if="userRole === 'admin'" class="admin-panel">
      管理者パネル（ログイン後はほぼ変わらない、v-if を使用）
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      userRole: 'user',
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>
```

#### 3. ライフサイクルのトリガー

**`v-if`**：

- コンポーネントの**完全なライフサイクル**をトリガーする
- 条件が false の場合、`unmounted` フックが実行される
- 条件が true の場合、`mounted` フックが実行される

```vue
<template>
  <child-component v-if="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('コンポーネントがマウントされた'); // v-if が false から true になった時に実行
  },
  unmounted() {
    console.log('コンポーネントがアンマウントされた'); // v-if が true から false になった時に実行
  },
};
</script>
```

**`v-show`**：

- コンポーネントのライフサイクルは**トリガーされない**
- コンポーネントは常にマウント状態を維持
- CSS で非表示にするだけ

```vue
<template>
  <child-component v-show="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('コンポーネントがマウントされた'); // 最初のレンダリング時に一度だけ実行
  },
  unmounted() {
    console.log('コンポーネントがアンマウントされた'); // 実行されない（親コンポーネントが破棄されない限り）
  },
};
</script>
```

#### 4. 初期レンダリングコスト

```vue
<template>
  <div>
    <!-- v-if：初期が false の場合、まったくレンダリングしない -->
    <heavy-component v-if="false" />

    <!-- v-show：初期が false の場合、レンダリングするが非表示 -->
    <heavy-component v-show="false" />
  </div>
</template>
```

`heavy-component` が重いコンポーネントの場合：

- `v-if="false"`：初期読み込みが速い（レンダリングしない）
- `v-show="false"`：初期読み込みが遅い（レンダリングするが非表示）

#### 5. 他のディレクティブとの組み合わせ

`v-if` は `v-else-if` と `v-else` と組み合わせ可能：

```vue
<template>
  <div>
    <div v-if="type === 'A'">タイプ A</div>
    <div v-else-if="type === 'B'">タイプ B</div>
    <div v-else>その他のタイプ</div>
  </div>
</template>
```

`v-show` は `v-else` と組み合わせ不可：

```vue
<!-- ❌ エラー：v-show では v-else を使用できない -->
<div v-show="type === 'A'">タイプ A</div>
<div v-else>その他のタイプ</div>

<!-- ✅ 正しい：それぞれ条件を設定する必要がある -->
<div v-show="type === 'A'">タイプ A</div>
<div v-show="type !== 'A'">その他のタイプ</div>
```

### computed と watch の使用ガイド

#### `v-if` を使用する場面

1. ✅ 条件がめったに変わらない
2. ✅ 初期条件が false で、true になる可能性が低い
3. ✅ `v-else-if` や `v-else` と組み合わせて使用する必要がある
4. ✅ コンポーネント内にクリーンアップが必要なリソースがある（タイマー、イベントリスナーなど）

```vue
<template>
  <!-- 権限制御：ログイン後はほぼ変わらない -->
  <admin-panel v-if="isAdmin" />

  <!-- ルーティング関連：ページ切り替え時のみ変更 -->
  <home-page v-if="currentRoute === 'home'" />
  <about-page v-else-if="currentRoute === 'about'" />
</template>
```

#### `v-show` を使用する場面

1. ✅ 表示状態を頻繁に切り替える必要がある
2. ✅ コンポーネントの初期化コストが高く、状態を保持したい
3. ✅ ライフサイクルフックをトリガーする必要がない

```vue
<template>
  <!-- タブ切り替え：ユーザーが頻繁に切り替える -->
  <div v-show="activeTab === 'profile'">プロフィール</div>
  <div v-show="activeTab === 'settings'">設定</div>

  <!-- モーダル：頻繁に開閉 -->
  <modal v-show="isModalVisible" />

  <!-- ローディングアニメーション：頻繁に表示/非表示 -->
  <loading-spinner v-show="isLoading" />
</template>
```

### パフォーマンス比較まとめ

| 特性             | v-if                            | v-show               |
| ---------------- | ------------------------------- | -------------------- |
| 初回レンダリングコスト | 小（条件が false ならレンダリングしない） | 大（必ずレンダリングする） |
| 切り替えコスト   | 大（要素の破棄/再作成）         | 小（CSS の変更のみ） |
| 適用場面         | 条件がめったに変わらない        | 頻繁な切り替えが必要 |
| ライフサイクル   | トリガーされる                  | トリガーされない     |
| 組み合わせ       | v-else-if, v-else               | なし                 |

### 実際の例の比較

```vue
<template>
  <div>
    <!-- 例 1：管理者パネル（v-if を使用） -->
    <!-- 理由：ログイン後はほぼ変わらず、権限制御がある -->
    <div v-if="userRole === 'admin'">
      <h2>管理者パネル</h2>
      <button @click="deleteUser">ユーザーを削除</button>
    </div>

    <!-- 例 2：モーダル（v-show を使用） -->
    <!-- 理由：ユーザーが頻繁にモーダルを開閉する -->
    <div v-show="isModalOpen" class="modal">
      <h2>モーダルタイトル</h2>
      <p>モーダル内容</p>
      <button @click="isModalOpen = false">閉じる</button>
    </div>

    <!-- 例 3：ローディングアニメーション（v-show を使用） -->
    <!-- 理由：API リクエスト時に頻繁に表示/非表示 -->
    <div v-show="isLoading" class="loading">
      <spinner />
    </div>

    <!-- 例 4：エラーメッセージ（v-if を使用） -->
    <!-- 理由：頻繁に出現せず、出現時は再レンダリングが必要 -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: 'user',
      isModalOpen: false,
      isLoading: false,
      errorMessage: '',
    };
  },
};
</script>
```

### v-if と v-show の覚え方

> - `v-if`：表示しない時はレンダリングしない、条件がめったに変わらない場合に適している
> - `v-show`：最初からレンダリングしておき、いつでも表示できる状態に、頻繁な切り替えに適している

## 5. What's the difference between `computed` and `watch`?

> `computed` と `watch` の違いは？

これは Vue における非常に重要な2つのリアクティブ機能で、どちらもデータの変化を監視できますが、使用場面と特性は大きく異なります。

### `computed`（算出プロパティ）

#### コア特性（computed）

1. **キャッシュ機構**：`computed` の計算結果はキャッシュされ、依存するリアクティブデータが変更された場合のみ再計算される
2. **自動的な依存追跡**：計算過程で使用されるリアクティブデータを自動追跡する
3. **同期計算**：同期操作でなければならず、戻り値が必須
4. **簡潔な構文**：template 内で data のプロパティと同様に直接使用可能

#### よくある使用場面（computed）

```vue
<!-- Vue 3 <script setup> の書き方 -->
<template>
  <div>
    <!-- 例 1：データのフォーマット -->
    <p>フルネーム：{{ fullName }}</p>
    <p>メール：{{ emailLowerCase }}</p>

    <!-- 例 2：ショッピングカートの合計を計算 -->
    <ul>
      <li v-for="item in cart" :key="item.id">
        {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
      </li>
    </ul>
    <p>合計：${{ cartTotal }}</p>

    <!-- 例 3：リストのフィルタリング -->
    <input v-model="searchText" placeholder="検索..." />
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const email = ref('JOHN@EXAMPLE.COM');
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);
const searchText = ref('');
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]);

// 例 1：データの結合
const fullName = computed(() => {
  console.log('fullName を計算'); // 依存が変更された時のみ実行
  return `${firstName.value} ${lastName.value}`;
});

// 例 2：データのフォーマット
const emailLowerCase = computed(() => {
  return email.value.toLowerCase();
});

// 例 3：合計の計算
const cartTotal = computed(() => {
  console.log('cartTotal を計算'); // cart が変更された時のみ実行
  return cart.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// 例 4：リストのフィルタリング
const filteredItems = computed(() => {
  if (!searchText.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});
</script>
```

#### `computed` の利点：キャッシュ機構

```vue
<template>
  <div>
    <!-- computed を複数回使用しても、計算は一度だけ -->
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>

    <!-- method を使用すると、毎回再計算 -->
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed 実行'); // 一度だけ実行
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('method 実行'); // 呼び出すたびに再計算
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### `computed` の getter と setter

```vue
<script setup>
import { computed, onMounted, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  // getter：読み取り時に実行
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  // setter：設定時に実行
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});

onMounted(() => {
  console.log(fullName.value); // 'John Doe'（getter をトリガー）
  fullName.value = 'Jane Smith'; // setter をトリガー
  console.log(firstName.value); // 'Jane'
  console.log(lastName.value); // 'Smith'
});
</script>
```

### `watch`（監視プロパティ）

#### コア特性（watch）

1. **手動でデータ変化を追跡**：監視するデータを明示的に指定する必要がある
2. **非同期操作が可能**：API 呼び出し、タイマー設定などに適している
3. **戻り値不要**：主に副作用（side effects）の実行に使用
4. **複数のデータを監視可能**：配列やオブジェクトの深い監視が可能
5. **新旧の値を提供**：変更前後の値を取得できる

#### よくある使用場面（watch）

```vue
<!-- Vue 3 <script setup> の書き方 -->
<template>
  <div>
    <!-- 例 1：リアルタイム検索 -->
    <input v-model="searchQuery" placeholder="ユーザーを検索..." />
    <div v-if="isSearching">検索中...</div>
    <ul>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.name }}
      </li>
    </ul>

    <!-- 例 2：フォームバリデーション -->
    <input v-model="username" placeholder="ユーザー名" />
    <p v-if="usernameError" class="error">{{ usernameError }}</p>

    <!-- 例 3：自動保存 -->
    <textarea v-model="content" placeholder="内容を入力..."></textarea>
    <p v-if="isSaving">保存中...</p>
    <p v-if="lastSaved">最終保存：{{ lastSaved }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const username = ref('');
const usernameError = ref('');
const content = ref('');
const isSaving = ref(false);
const lastSaved = ref(null);

let searchTimer = null;
let saveTimer = null;

// 例 1：リアルタイム検索（デバウンス）
watch(searchQuery, async (newQuery, oldQuery) => {
  console.log(`検索が "${oldQuery}" から "${newQuery}" に変更`);

  // 前のタイマーをクリア
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  // デバウンス設定：500ms 後に検索を実行
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } catch (error) {
      console.error('検索失敗', error);
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// 例 2：フォームバリデーション
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = 'ユーザー名は3文字以上必要です';
  } else if (newUsername.length > 20) {
    usernameError.value = 'ユーザー名は20文字以内にしてください';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value = 'ユーザー名は英数字とアンダースコアのみ使用可能です';
  } else {
    usernameError.value = '';
  }
});

// 例 3：自動保存
watch(content, (newContent) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    isSaving.value = true;
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: newContent }),
      });
      lastSaved.value = new Date().toLocaleTimeString();
    } catch (error) {
      console.error('保存失敗', error);
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  // タイマーのクリーンアップ
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### `watch` のオプション

```vue
<!-- Vue 3 <script setup> の書き方 -->
<script setup>
import { ref, watch, onMounted } from 'vue';

const user = ref({
  name: 'John',
  profile: {
    age: 30,
    city: 'Taipei',
  },
});
const items = ref([1, 2, 3]);

// オプション 1：immediate（即時実行）
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`名前が ${oldName} から ${newName} に変更`);
  },
  { immediate: true } // コンポーネント作成時に即座に一度実行
);

// オプション 2：deep（深い監視）
watch(
  user,
  (newUser, oldUser) => {
    console.log('user オブジェクト内部に変化が発生');
    console.log('新しい値：', newUser);
  },
  { deep: true } // オブジェクト内部のすべてのプロパティの変化を監視
);

// オプション 3：flush（実行タイミング）
watch(
  items,
  (newItems) => {
    console.log('items が変化');
  },
  { flush: 'post' } // DOM 更新後に実行（デフォルトは 'pre'）
);

onMounted(() => {
  // 深い監視のテスト
  setTimeout(() => {
    user.value.profile.age = 31; // deep watch をトリガー
  }, 1000);
});
</script>
```

#### 複数のデータソースを監視

```vue
<!-- Vue 3 <script setup> の書き方 -->
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// Vue 3 Composition API：複数のデータを監視
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`名前が ${oldFirst} ${oldLast} から ${newFirst} ${newLast} に変更`);
});
</script>
```

### `computed` vs `watch` の比較

| 特性              | computed                     | watch                        |
| ----------------- | ---------------------------- | ---------------------------- |
| **主な用途**      | 既存データから新しいデータを計算 | データ変化を監視して副作用を実行 |
| **戻り値**        | 戻り値が必須                 | 戻り値不要                   |
| **キャッシュ**    | ✅ キャッシュ機構あり        | ❌ キャッシュなし            |
| **依存追跡**      | ✅ 自動追跡                  | ❌ 手動指定                  |
| **非同期操作**    | ❌ 非対応                    | ✅ 対応                      |
| **新旧値**        | ❌ 取得不可                  | ✅ 取得可能                  |
| **Template 使用** | ✅ 直接使用可能              | ❌ 直接使用不可              |
| **実行タイミング**| 依存が変更された時           | 監視データが変更された時     |

### 使用場面の推奨

#### `computed` を使用する場面

1. ✅ **既存データから新しいデータを計算**する必要がある
2. ✅ 計算結果を template 内で**複数回使用**する（キャッシュを活用）
3. ✅ **同期計算**で、非同期操作が不要
4. ✅ データの**フォーマット、フィルタリング、ソート**が必要

```vue
<script setup>
import { computed, ref } from 'vue';

const timestamp = ref(Date.now());
const users = ref([
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Carol', isActive: true },
]);
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);

// ✅ データのフォーマット
const formattedDate = computed(() => {
  return new Date(timestamp.value).toLocaleDateString();
});

// ✅ リストのフィルタリング
const activeUsers = computed(() => {
  return users.value.filter((user) => user.isActive);
});

// ✅ 合計の計算
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});
</script>
```

#### `watch` を使用する場面

1. ✅ **非同期操作の実行**が必要（API リクエストなど）
2. ✅ **副作用の実行**が必要（localStorage の更新など）
3. ✅ **デバウンスやスロットル**が必要
4. ✅ **新旧値の比較**が必要
5. ✅ **条件付きで複雑なロジック**を実行する必要がある

```vue
<script setup>
import { ref, watch } from 'vue';

const userId = ref(1);
const user = ref(null);

// ✅ API リクエスト
watch(userId, async (newId) => {
  user.value = await fetch(`/api/users/${newId}`).then((response) =>
    response.json()
  );
});

const settings = ref({
  theme: 'dark',
  notifications: true,
});

// ✅ localStorage 同期
watch(
  settings,
  (newSettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings));
  },
  { deep: true }
);

const searchQuery = ref('');
let searchTimer = null;

const performSearch = (keyword) => {
  console.log(`検索：${keyword}`);
};

// ✅ デバウンス検索
watch(searchQuery, (newQuery) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    performSearch(newQuery);
  }, 500);
});
</script>
```

### 実際のケース比較

#### 間違った使い方 ❌

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

// ❌ 間違い：watch ではなく computed を使うべき
watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### 正しい使い方 ✅

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// ✅ 正しい：computed で派生データを計算
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
</script>
```

### computed と watch の覚え方

> **「`computed` はデータを計算、`watch` はアクションを実行」**
>
> - `computed`：**新しいデータを計算**するために使う（フォーマット、フィルタリング、合計など）
> - `watch`：**アクションを実行**するために使う（API リクエスト、データ保存、通知表示など）

### 実践練習問題：x \* y の計算

> 問題：x=0, y=5 で、ボタンを1回クリックするたびに x が 1 増える。Vue の computed または watch のいずれかの機能を使って「x \* y の結果」を実装してください。

#### 解法一：`computed` を使用（推奨）

これが最も適したシーンです。結果は x と y に依存して計算される新しいデータだからです。

```vue
<template>
  <div>
    <p>X: {{ x }}, Y: {{ y }}</p>
    <p>Result (X * Y): {{ result }}</p>
    <button @click="x++">Increment X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const x = ref(0);
const y = ref(5);

// ✅ 推奨：シンプル、直感的、依存を自動追跡
const result = computed(() => x.value * y.value);
</script>
```

#### 解法二：`watch` を使用（やや煩雑）

実現は可能ですが、`result` 変数を手動で管理する必要があり、初期値の問題も考慮しなければなりません。

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

// ❌ あまり推奨しない：手動更新が必要で、immediate を設定しないと初期時に計算されない
watch(
  [x, y],
  ([newX, newY]) => {
    result.value = newX * newY;
  },
  { immediate: true }
);
</script>
```

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
