---
id: vue-lifecycle
title: '[Medium] 📄 Vue ライフサイクルフック'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> Vue のライフサイクルフックについて説明してください（Vue 2 と Vue 3 を含む）

Vue コンポーネントは作成から破棄まで一連のプロセスを経ます。これらのプロセスの中で特定の関数が自動的に呼び出されますが、これらの関数が「ライフサイクルフック」です。ライフサイクルを理解することは、コンポーネントの動作を把握する上で非常に重要です。

### Vue ライフサイクル図解

```
作成段階 → マウント段階 → 更新段階 → 破棄段階
   ↓          ↓          ↓          ↓
Created    Mounted    Updated   Unmounted
```

### Vue 2 vs Vue 3 ライフサイクル対照表

| Vue 2 (Options API) | Vue 3 (Options API) | Vue 3 (Composition API) | 説明                       |
| ------------------- | ------------------- | ----------------------- | -------------------------- |
| `beforeCreate`      | `beforeCreate`      | `setup()`               | コンポーネントインスタンス初期化前 |
| `created`           | `created`           | `setup()`               | コンポーネントインスタンス作成完了 |
| `beforeMount`       | `beforeMount`       | `onBeforeMount`         | DOM へのマウント前          |
| `mounted`           | `mounted`           | `onMounted`             | DOM へのマウント後          |
| `beforeUpdate`      | `beforeUpdate`      | `onBeforeUpdate`        | データ更新前                |
| `updated`           | `updated`           | `onUpdated`             | データ更新後                |
| `beforeDestroy`     | `beforeUnmount`     | `onBeforeUnmount`       | コンポーネントアンマウント前 |
| `destroyed`         | `unmounted`         | `onUnmounted`           | コンポーネントアンマウント後 |
| `activated`         | `activated`         | `onActivated`           | keep-alive コンポーネント活性化時 |
| `deactivated`       | `deactivated`       | `onDeactivated`         | keep-alive コンポーネント非活性化時 |
| `errorCaptured`     | `errorCaptured`     | `onErrorCaptured`       | 子コンポーネントエラー捕捉時 |

### 1. 作成段階（Creation Phase）

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // ❌ この時点では data、methods はまだ初期化されていない
    console.log('beforeCreate');
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // ✅ この時点で data、computed、methods、watch は初期化済み
    console.log('created');
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined（まだ DOM にマウントされていない）

    // ✅ ここで API リクエストを送信するのに適している
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**使用タイミング：**

- `beforeCreate`：ほとんど使用しない、通常はプラグイン開発で使用
- `created`：
  - ✅ API リクエストの送信
  - ✅ 非リアクティブデータの初期化
  - ✅ イベントリスナーの設定
  - ❌ DOM 操作不可（まだマウントされていない）

### 2. マウント段階（Mounting Phase）

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Vue Lifecycle',
    };
  },

  beforeMount() {
    // ❌ この時点で仮想 DOM は作成済みだが、実 DOM にはまだレンダリングされていない
    console.log('beforeMount');
    console.log(this.$el); // 存在するが、内容は古い（もしあれば）
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    // ✅ この時点でコンポーネントは DOM にマウント済み、DOM 要素を操作可能
    console.log('mounted');
    console.log(this.$el); // 実際の DOM 要素
    console.log(this.$refs.myElement); // ref にアクセス可能

    // ✅ ここで DOM を操作するのに適している
    this.initCanvas();

    // ✅ ここでサードパーティの DOM ライブラリを使用するのに適している
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // canvas を描画...
    },

    initChart() {
      // チャートライブラリを初期化（Chart.js, ECharts など）
      new Chart(this.$refs.myCanvas, {
        type: 'bar',
        data: {
          /* ... */
        },
      });
    },
  },
};
</script>
```

**使用タイミング：**

- `beforeMount`：ほとんど使用しない
- `mounted`：
  - ✅ DOM 要素の操作
  - ✅ サードパーティ DOM ライブラリの初期化（チャート、地図など）
  - ✅ DOM が必要なイベントリスナーの設定
  - ✅ タイマーの開始
  - ⚠️ **注意**：子コンポーネントの `mounted` は親コンポーネントの `mounted` より先に実行される

### 3. 更新段階（Updating Phase）

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>カウント：{{ count }}</p>
    <button @click="count++">増加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  beforeUpdate() {
    // ✅ データは更新済みだが、DOM はまだ更新されていない
    console.log('beforeUpdate');
    console.log('data count:', this.count); // 新しい値
    console.log('DOM count:', this.$el.querySelector('p').textContent); // 古い値

    // ここで更新前の DOM 状態にアクセスできる
  },

  updated() {
    // ✅ データと DOM の両方が更新済み
    console.log('updated');
    console.log('data count:', this.count); // 新しい値
    console.log('DOM count:', this.$el.querySelector('p').textContent); // 新しい値

    // ⚠️ 注意：ここでデータを変更しないこと、無限ループの原因になる
    // this.count++; // ❌ エラー！無限更新を引き起こす
  },
};
</script>
```

**使用タイミング：**

- `beforeUpdate`：DOM 更新前に古い DOM 状態にアクセスする必要がある場合
- `updated`：
  - ✅ DOM 更新後に実行する必要がある操作（要素サイズの再計算など）
  - ❌ **ここでデータを変更しない**こと、無限更新ループの原因になる
  - ⚠️ データ変化後に操作を実行する必要がある場合は、`watch` または `nextTick` の使用を推奨

### 4. 破棄段階（Unmounting Phase）

#### `beforeUnmount` / `unmounted` (Vue 3) / `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    // タイマーの設定
    this.timer = setInterval(() => {
      console.log('タイマー実行中...');
    }, 1000);

    // WebSocket 接続の作成
    this.ws = new WebSocket('ws://example.com');
    this.ws.onmessage = (event) => {
      console.log('メッセージ受信:', event.data);
    };

    // イベントリスナーの設定
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },

  beforeUnmount() {
    // Vue 3 では beforeUnmount を使用
    // Vue 2 では beforeDestroy を使用
    console.log('beforeUnmount');
    // コンポーネントが破棄される直前だが、まだデータと DOM にアクセス可能
  },

  unmounted() {
    // Vue 3 では unmounted を使用
    // Vue 2 では destroyed を使用
    console.log('unmounted');

    // ✅ タイマーのクリーンアップ
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // ✅ WebSocket 接続のクローズ
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // ✅ イベントリスナーの削除
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },

  methods: {
    handleResize() {
      console.log('ウィンドウサイズ変更');
    },
    handleClick() {
      console.log('クリックイベント');
    },
  },
};
</script>
```

**使用タイミング：**

- `beforeUnmount` / `beforeDestroy`：ほとんど使用しない
- `unmounted` / `destroyed`：
  - ✅ タイマーのクリーンアップ（`setInterval`、`setTimeout`）
  - ✅ イベントリスナーの削除
  - ✅ WebSocket 接続のクローズ
  - ✅ 未完了の API リクエストのキャンセル
  - ✅ サードパーティライブラリインスタンスのクリーンアップ

### 5. 特殊コンポーネント：KeepAlive

#### `<KeepAlive>` とは？

`<KeepAlive>` は Vue の組み込みコンポーネントで、主な機能は**コンポーネントインスタンスのキャッシュ**であり、コンポーネントが切り替え時に破棄されることを防ぎます。

- **デフォルトの動作**：コンポーネントが切り替わると（例：ルート切り替えや `v-if` 切り替え）、Vue は古いコンポーネントを破棄して新しいコンポーネントを作成します。
- **KeepAlive の動作**：`<KeepAlive>` で囲まれたコンポーネントは切り替え時に、状態がメモリに保持され、破棄されません。

#### コア機能と特性

1. **状態キャッシュ**：フォーム入力内容、スクロール位置などを保持。
2. **パフォーマンス最適化**：重複レンダリングや重複 API リクエストを回避。
3. **専用ライフサイクル**：`activated` と `deactivated` という2つの固有フックを提供。

#### 適用シーン

1. **マルチタブ切り替え**：例えば管理システムの Tabs。
2. **リストと詳細ページの切り替え**：リストページから詳細ページに入った後に戻った時、リストのスクロール位置やフィルタ条件を保持したい場合。
3. **複雑なフォーム**：途中まで入力して他のページでデータを確認し、戻った時にフォーム内容が失われるべきでない場合。

#### 使用例

```vue
<template>
  <KeepAlive include="UserList,ProductList">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

- `include`：名前が一致するコンポーネントのみキャッシュされる。
- `exclude`：名前が一致するコンポーネントはキャッシュ**されない**。
- `max`：キャッシュするコンポーネントインスタンスの最大数。

### 6. 特殊ライフサイクルフック

#### `activated` / `deactivated` (`<KeepAlive>` と併用)

```vue
<template>
  <div>
    <button @click="toggleComponent">コンポーネント切り替え</button>

    <!-- keep-alive はコンポーネントをキャッシュし、再作成しない -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
// ChildComponent.vue
export default {
  name: 'ChildComponent',

  mounted() {
    console.log('mounted - 一度だけ実行');
  },

  activated() {
    console.log('activated - コンポーネントが活性化されるたびに実行');
    // ✅ ここでデータを再取得するのに適している
    this.refreshData();
  },

  deactivated() {
    console.log('deactivated - コンポーネントが非活性化されるたびに実行');
    // ✅ ここで操作を一時停止するのに適している（動画再生など）
    this.pauseVideo();
  },

  unmounted() {
    console.log('unmounted - 実行されない（keep-alive でキャッシュされているため）');
  },

  methods: {
    refreshData() {
      // データを再取得
    },
    pauseVideo() {
      // 動画再生を一時停止
    },
  },
};
</script>
```

#### `errorCaptured` (エラー処理)

```vue
<script>
// ParentComponent.vue
export default {
  errorCaptured(err, instance, info) {
    console.error('子コンポーネントのエラーを捕捉:', err);
    console.log('エラー元コンポーネント:', instance);
    console.log('エラー情報:', info);

    // false を返すとエラーの上位への伝播を防止できる
    return false;
  },
};
</script>
```

### Vue 3 Composition API のライフサイクル

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() 自体が beforeCreate + created に相当
console.log('setup 実行');

onBeforeMount(() => {
  console.log('onBeforeMount');
});

onMounted(() => {
  console.log('onMounted');
  // ✅ DOM 操作、ライブラリ初期化
});

onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});

onUpdated(() => {
  console.log('onUpdated');
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
});

onUnmounted(() => {
  console.log('onUnmounted');
  // ✅ リソースのクリーンアップ
});

onActivated(() => {
  console.log('onActivated');
});

onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err, instance, info) => {
  console.error('エラー:', err);
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> 親子コンポーネントのライフサイクル実行順序は？

これは非常に重要な面接質問であり、親子コンポーネントのライフサイクル実行順序を理解することで、コンポーネント間の相互作用を把握できます。

### 実行順序

```
親 beforeCreate
→ 親 created
→ 親 beforeMount
→ 子 beforeCreate
→ 子 created
→ 子 beforeMount
→ 子 mounted
→ 親 mounted
```

**覚え方：「作成は外から内へ、マウントは内から外へ」**

### 実際の例

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>親コンポーネント</h1>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: { ChildComponent },

  beforeCreate() {
    console.log('1. 親 beforeCreate');
  },
  created() {
    console.log('2. 親 created');
  },
  beforeMount() {
    console.log('3. 親 beforeMount');
  },
  mounted() {
    console.log('8. 親 mounted');
  },
  beforeUpdate() {
    console.log('親 beforeUpdate');
  },
  updated() {
    console.log('親 updated');
  },
  beforeUnmount() {
    console.log('9. 親 beforeUnmount');
  },
  unmounted() {
    console.log('12. 親 unmounted');
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>子コンポーネント</h2>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',

  beforeCreate() {
    console.log('4. 子 beforeCreate');
  },
  created() {
    console.log('5. 子 created');
  },
  beforeMount() {
    console.log('6. 子 beforeMount');
  },
  mounted() {
    console.log('7. 子 mounted');
  },
  beforeUpdate() {
    console.log('子 beforeUpdate');
  },
  updated() {
    console.log('子 updated');
  },
  beforeUnmount() {
    console.log('10. 子 beforeUnmount');
  },
  unmounted() {
    console.log('11. 子 unmounted');
  },
};
</script>
```

### 各段階の実行順序

#### 1. 作成とマウント段階

```
1. 親 beforeCreate
2. 親 created
3. 親 beforeMount
4. 子 beforeCreate
5. 子 created
6. 子 beforeMount
7. 子 mounted        ← 子コンポーネントが先にマウント完了
8. 親 mounted        ← 親コンポーネントが後にマウント完了
```

**理由**：親コンポーネントは子コンポーネントのマウント完了を待ってから、コンポーネントツリー全体が完全にレンダリングされたことを確認する必要がある。

#### 2. 更新段階

```
親コンポーネントのデータ変化：
1. 親 beforeUpdate
2. 子 beforeUpdate  ← 子コンポーネントが親コンポーネントのデータを使用している場合
3. 子 updated
4. 親 updated

子コンポーネントのデータ変化：
1. 子 beforeUpdate
2. 子 updated
（親コンポーネントは更新をトリガーしない）
```

#### 3. 破棄段階

```
9. 親 beforeUnmount
10. 子 beforeUnmount
11. 子 unmounted     ← 子コンポーネントが先に破棄
12. 親 unmounted     ← 親コンポーネントが後に破棄
```

### 複数の子コンポーネントの場合

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-a />
    <child-b />
    <child-c />
  </div>
</template>
```

実行順序：

```
1. 親 beforeCreate
2. 親 created
3. 親 beforeMount
4. 子A beforeCreate
5. 子A created
6. 子A beforeMount
7. 子B beforeCreate
8. 子B created
9. 子B beforeMount
10. 子C beforeCreate
11. 子C created
12. 子C beforeMount
13. 子A mounted
14. 子B mounted
15. 子C mounted
16. 親 mounted
```

### なぜこの順序なのか？

#### マウント段階（Mounting）

Vue のマウントプロセスは「深さ優先探索」に似ています：

1. 親コンポーネントが作成を開始
2. テンプレートの解析時に子コンポーネントを発見
3. 子コンポーネントの完全なマウントを先に完了
4. すべての子コンポーネントがマウント完了後、親コンポーネントがマウント完了

```
親コンポーネントがマウント準備
    ↓
子コンポーネントを発見
    ↓
子コンポーネントの完全なマウント（beforeMount → mounted）
    ↓
親コンポーネントのマウント完了（mounted）
```

#### 破棄段階（Unmounting）

破棄順序は「まず親コンポーネントに破棄を通知し、順に子コンポーネントを破棄」：

```
親コンポーネントが破棄準備（beforeUnmount）
    ↓
子コンポーネントに破棄を通知（beforeUnmount）
    ↓
子コンポーネントの破棄完了（unmounted）
    ↓
親コンポーネントの破棄完了（unmounted）
```

### 実際のアプリケーションシーン

#### シーン 1：親コンポーネントが子コンポーネントのデータ読み込み完了を待つ必要がある

```vue
<!-- ParentComponent.vue -->
<script>
export default {
  data() {
    return {
      childrenReady: false,
    };
  },

  mounted() {
    // ✅ この時点ですべての子コンポーネントはマウント完了
    console.log('すべての子コンポーネントの準備完了');
    this.childrenReady = true;
  },
};
</script>
```

#### シーン 2：子コンポーネントが親コンポーネントの提供するデータにアクセスする必要がある

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  inject: ['parentData'], // 親コンポーネントが提供するデータを受信

  created() {
    // ✅ この時点で親コンポーネントのデータにアクセス可能（親の created は実行済み）
    console.log('親コンポーネントのデータ:', this.parentData);
  },
};
</script>
```

#### シーン 3：`mounted` でまだマウントされていない子コンポーネントにアクセスしないよう注意

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="child" />
</template>

<script>
export default {
  mounted() {
    // ✅ この時点で子コンポーネントはマウント済み、安全にアクセス可能
    this.$refs.child.someMethod();
  },
};
</script>
```

### よくある間違い

#### 間違い 1：親コンポーネントの `created` で子コンポーネントの ref にアクセスする

```vue
<!-- ❌ 間違い -->
<script>
export default {
  created() {
    // この時点では子コンポーネントはまだ作成されていない
    console.log(this.$refs.child); // undefined
  },
};
</script>

<!-- ✅ 正しい -->
<script>
export default {
  mounted() {
    // この時点で子コンポーネントはマウント済み
    console.log(this.$refs.child); // アクセス可能
  },
};
</script>
```

#### 間違い 2：子コンポーネントが親コンポーネントより先にマウントされると仮定する

```vue
<!-- ❌ 間違い -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // 親コンポーネントがマウント済みと仮定（間違い！）
    this.$parent.someMethod(); // エラーの可能性あり
  },
};
</script>

<!-- ✅ 正しい -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // $nextTick で親コンポーネントもマウント済みであることを確認
    this.$nextTick(() => {
      this.$parent.someMethod();
    });
  },
};
</script>
```

## 3. When should we use each lifecycle hook?

> 各ライフサイクルフックをいつ使うべきか？

ここでは各ライフサイクルフックの最適な使用場面をまとめています。

### ライフサイクル使用場面まとめ表

| ライフサイクル | よくある用途            | アクセス可能な内容          |
| -------------- | ----------------------- | --------------------------- |
| `created`      | API リクエスト、データ初期化 | ✅ data, methods ❌ DOM |
| `mounted`      | DOM 操作、ライブラリ初期化   | ✅ data, methods, DOM   |
| `updated`      | DOM 更新後の操作        | ✅ 新しい DOM               |
| `unmounted`    | リソースのクリーンアップ | ✅ タイマー、イベントのクリーンアップ |
| `activated`    | keep-alive 活性化時     | ✅ データの再取得            |

### 実際のアプリケーション例

#### 1. `created`：API リクエストの送信

```vue
<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null,
    };
  },

  created() {
    // ✅ ここで API リクエストを送信するのに適している
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2. `mounted`：サードパーティライブラリの初期化

```vue
<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartInstance: null,
    };
  },

  mounted() {
    // ✅ ここで DOM が必要なライブラリを初期化するのに適している
    this.initChart();
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: '売上データ' },
        xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: {},
        series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
      });
    },
  },

  unmounted() {
    // ✅ チャートインスタンスのクリーンアップを忘れずに
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>
```

#### 3. `unmounted`：リソースのクリーンアップ

```vue
<script>
export default {
  data() {
    return {
      intervalId: null,
      observer: null,
    };
  },

  mounted() {
    // タイマーの開始
    this.intervalId = setInterval(() => {
      console.log('実行中...');
    }, 1000);

    // Intersection Observer の作成
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries);
    });
    this.observer.observe(this.$el);

    // グローバルイベントの監視
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    // ✅ タイマーのクリーンアップ
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // ✅ Observer のクリーンアップ
    if (this.observer) {
      this.observer.disconnect();
    }

    // ✅ イベントリスナーの削除
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      console.log('ウィンドウサイズ変更');
    },
  },
};
</script>
```

### 記憶のコツ

1. **`created`**：「作成完了、データが使える」→ API リクエスト
2. **`mounted`**：「マウント完了、DOM が使える」→ DOM 操作、サードパーティライブラリ
3. **`updated`**：「更新完了、DOM が同期済み」→ DOM 更新後の操作
4. **`unmounted`**：「アンマウント完了、クリーンアップを忘れずに」→ リソースのクリーンアップ

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)
- [Composition API: Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
