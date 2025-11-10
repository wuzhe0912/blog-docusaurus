---
id: vue-basic-api
title: '[Medium] 📄 Vue Basic & API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> 請描述 Vue 框架的核心原理和優勢

### 核心原理

Vue 是一個漸進式的 JavaScript 框架，其核心原理包含以下幾個重要概念：

#### 1. 虛擬 DOM（Virtual DOM）

使用虛擬 DOM 來提升效能。它只會更新有變化的 DOM 節點，而不是重新渲染整個 DOM Tree。透過 diff 演算法比較新舊虛擬 DOM 的差異，只針對差異部分進行實際 DOM 操作。

```js
// 虛擬 DOM 概念示意
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. 資料雙向綁定（Two-way Data Binding）

使用雙向資料綁定，當模型（Model）更改時，視圖（View）會自動更新，反之亦然。這讓開發者不需要手動操作 DOM，只需關注資料的變化。

```vue
<!-- Vue 3 推薦寫法：<script setup> -->
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
<summary>Options API 寫法</summary>

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

#### 3. 組件化（Component-based）

將整個應用切分成一個個組件，意味著重用性提升，這對維護開發會更為省工。每個組件都有自己的狀態、樣式和邏輯，可以獨立開發和測試。

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

#### 4. 生命週期（Lifecycle Hooks）

有自己的生命週期，當資料發生變化時，會觸發相應的生命週期鉤子，這樣就可以在特定的生命週期中，做出相應的操作。

```vue
<!-- Vue 3 <script setup> 寫法 -->
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  // 組件掛載後執行
  console.log('Component mounted!');
});

onUpdated(() => {
  // 資料更新後執行
  console.log('Component updated!');
});

onUnmounted(() => {
  // 組件卸載後執行
  console.log('Component unmounted!');
});
</script>
```

#### 5. 指令系統（Directives）

提供了一些常用的指令，例如 `v-if`、`v-for`、`v-bind`、`v-model` 等，可以讓開發者更快速地開發。

```vue
<template>
  <!-- 條件渲染 -->
  <div v-if="isVisible">顯示內容</div>

  <!-- 列表渲染 -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <!-- 屬性綁定 -->
  <img :src="imageUrl" :alt="imageAlt" />

  <!-- 雙向綁定 -->
  <input v-model="username" />
</template>
```

#### 6. 模板語法（Template Syntax）

使用 template 來撰寫 HTML，允許將資料透過插值的方式，直接渲染到 template 中。

```vue
<template>
  <div>
    <!-- 文字插值 -->
    <p>{{ message }}</p>

    <!-- 表達式 -->
    <p>{{ count + 1 }}</p>

    <!-- 方法呼叫 -->
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Vue 的獨有優勢（和 React 相比）

#### 1. 學習曲線較低

對團隊成員彼此程度的掌控落差不會太大，同時在書寫風格上，由官方統一規定，避免過於自由奔放，同時對不同專案的維護也能更快上手。

```vue
<!-- Vue 的單檔案組件結構清晰 -->
<template>
  <!-- HTML 模板 -->
</template>

<script>
// JavaScript 邏輯
</script>

<style>
/* CSS 樣式 */
</style>
```

#### 2. 擁有自己的獨特指令語法

雖然這點可能見仁見智，但 Vue 的指令系統提供了更直觀的方式來處理常見的 UI 邏輯：

```vue
<!-- Vue 指令 -->
<div v-if="isLoggedIn">歡迎回來</div>
<button @click="handleClick">點擊</button>

<!-- React JSX -->
<div>{isLoggedIn && '歡迎回來'}</div>
<button onClick="{handleClick}">點擊</button>
```

#### 3. 資料雙向綁定更容易實現

因為有自己的指令，所以開發者實現資料雙向綁定可以非常容易（`v-model`），而 React 雖然也能實作類似的功能，但沒有 Vue 來得直覺。

```vue
<!-- Vue 雙向綁定 -->
<input v-model="username" />

<!-- React 需要手動處理 -->
<input value={username} onChange={(e) => setUsername(e.target.value)} />
```

#### 4. 模板和邏輯分離

React 的 JSX 仍為部分開發者所詬病，在部分開發情境下，將邏輯和 UI 進行分離會顯得更易閱讀與維護。

```vue
<!-- Vue：結構清晰 -->
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

#### 5. 官方生態系統完整

Vue 官方提供了完整的解決方案（Vue Router、Vuex/Pinia、Vue CLI），不需要在眾多第三方套件中選擇。

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> 請解釋 `v-model`、`v-bind` 和 `v-html` 的使用方式

### `v-model`：資料雙向綁定

當改變資料的同時，隨即驅動改變 template 上渲染的內容，反之改變 template 的內容，也會更新資料。

```vue
<template>
  <div>
    <!-- 文字輸入框 -->
    <input v-model="message" />
    <p>輸入的內容：{{ message }}</p>

    <!-- 核取方塊 -->
    <input type="checkbox" v-model="checked" />
    <p>是否勾選：{{ checked }}</p>

    <!-- 選項列表 -->
    <select v-model="selected">
      <option value="A">選項 A</option>
      <option value="B">選項 B</option>
    </select>
    <p>選擇的選項：{{ selected }}</p>
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

#### `v-model` 的修飾符

```vue
<!-- .lazy：改為在 change 事件後更新 -->
<input v-model.lazy="msg" />

<!-- .number：自動轉為數字 -->
<input v-model.number="age" type="number" />

<!-- .trim：自動過濾首尾空白字元 -->
<input v-model.trim="msg" />
```

### `v-bind`：動態綁定屬性

常見於綁定 class 或連結、圖片等。當透過 `v-bind` 綁定 class 後，可以透過資料變動，來決定該 class 樣式是否被綁定，同理 API 回傳的圖片路徑、連結網址，也能透過綁定的形式來維持動態更新。

```vue
<template>
  <div>
    <!-- 綁定 class（可以簡寫為 :class） -->
    <div :class="{ active: isActive, 'text-danger': hasError }">動態 class</div>

    <!-- 綁定 style -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">動態樣式</div>

    <!-- 綁定圖片路徑 -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- 綁定連結 -->
    <a :href="linkUrl">前往連結</a>

    <!-- 綁定自訂屬性 -->
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
      imageAlt: '圖片描述',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### `v-bind` 的簡寫

```vue
<!-- 完整寫法 -->
<img v-bind:src="imageUrl" />

<!-- 簡寫 -->
<img :src="imageUrl" />

<!-- 綁定多個屬性 -->
<div v-bind="objectOfAttrs"></div>
```

### `v-html`：渲染 HTML 字串

如果資料回傳的內容中帶有 HTML 的標籤時，可以透過這個指令來渲染，例如顯示 Markdown 語法又或是對方直接回傳含有 `<img>` 標籤的圖片路徑。

```vue
<template>
  <div>
    <!-- 普通插值：會顯示 HTML 標籤 -->
    <p>{{ rawHtml }}</p>
    <!-- 輸出：<span style="color: red">紅色文字</span> -->

    <!-- v-html：會渲染 HTML -->
    <p v-html="rawHtml"></p>
    <!-- 輸出：紅色文字（實際渲染為紅色） -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">紅色文字</span>',
    };
  },
};
</script>
```

#### ⚠️ 安全性警告

**千萬不要對使用者提供的內容使用 `v-html`**，這會導致 XSS（跨站腳本攻擊）漏洞！

```vue
<!-- ❌ 危險：使用者可以注入惡意腳本 -->
<div v-html="userProvidedContent"></div>

<!-- ✅ 安全：只用於可信任的內容 -->
<div v-html="markdownRenderedContent"></div>
```

#### 安全的替代方案

```vue
<template>
  <div>
    <!-- 使用套件進行 HTML 淨化 -->
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
      // 使用 DOMPurify 清理 HTML
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### 三者比較總結

| 指令      | 用途             | 簡寫 | 範例                        |
| --------- | ---------------- | ---- | --------------------------- |
| `v-model` | 雙向綁定表單元素 | 無   | `<input v-model="msg">`     |
| `v-bind`  | 單向綁定屬性     | `:`  | `<img :src="url">`          |
| `v-html`  | 渲染 HTML 字串   | 無   | `<div v-html="html"></div>` |

## 3. Please explain the difference between `v-show` and `v-if`

> 請解釋 `v-show` 和 `v-if` 的區別

### 相同點（Similarities）

兩者都是用於操作 DOM 元素的顯示與隱藏，根據條件的不同，決定是否顯示內容。

```vue
<template>
  <!-- 當 isVisible 為 true 時，都會顯示內容 -->
  <div v-if="isVisible">使用 v-if</div>
  <div v-show="isVisible">使用 v-show</div>
</template>
```

### 相異點（Differences）

#### 1. DOM 操作方式不同

```vue
<template>
  <div>
    <!-- v-show：透過 CSS display 屬性控制 -->
    <div v-show="false">這個元素仍存在於 DOM 中，只是 display: none</div>

    <!-- v-if：直接從 DOM 中移除或新增 -->
    <div v-if="false">這個元素不會出現在 DOM 中</div>
  </div>
</template>
```

實際渲染結果：

```html
<!-- v-show 渲染結果 -->
<div style="display: none;">這個元素仍存在於 DOM 中，只是 display: none</div>

<!-- v-if 渲染結果：false 時完全不存在 -->
<!-- 沒有任何 DOM 節點 -->
```

#### 2. 效能差異

**`v-show`**：

- ✅ 初次渲染開銷較大（元素一定會被建立）
- ✅ 切換開銷較小（只改變 CSS）
- ✅ 適合**頻繁切換**的場景

**`v-if`**：

- ✅ 初次渲染開銷較小（條件為 false 時不渲染）
- ❌ 切換開銷較大（需要銷毀/重建元素）
- ✅ 適合**條件不常改變**的場景

```vue
<template>
  <div>
    <!-- 頻繁切換：使用 v-show -->
    <button @click="toggleModal">切換彈窗</button>
    <div v-show="showModal" class="modal">
      彈窗內容（頻繁開關，使用 v-show 效能更好）
    </div>

    <!-- 不常切換：使用 v-if -->
    <div v-if="userRole === 'admin'" class="admin-panel">
      管理員面板（登入後幾乎不變，使用 v-if）
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

#### 3. 生命週期觸發

**`v-if`**：

- 會觸發組件的**完整生命週期**
- 條件為 false 時，會執行 `unmounted` 鉤子
- 條件為 true 時，會執行 `mounted` 鉤子

```vue
<template>
  <child-component v-if="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('組件已掛載'); // v-if 從 false 變 true 時會執行
  },
  unmounted() {
    console.log('組件已卸載'); // v-if 從 true 變 false 時會執行
  },
};
</script>
```

**`v-show`**：

- **不會觸發**組件的生命週期
- 組件始終保持掛載狀態
- 只是透過 CSS 隱藏

```vue
<template>
  <child-component v-show="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('組件已掛載'); // 只在第一次渲染時執行一次
  },
  unmounted() {
    console.log('組件已卸載'); // 不會執行（除非父組件被銷毀）
  },
};
</script>
```

#### 4. 初始渲染成本

```vue
<template>
  <div>
    <!-- v-if：初始為 false 時，完全不渲染 -->
    <heavy-component v-if="false" />

    <!-- v-show：初始為 false 時，仍會渲染但隱藏 -->
    <heavy-component v-show="false" />
  </div>
</template>
```

如果 `heavy-component` 是一個很重的組件：

- `v-if="false"`：初始載入更快（不渲染）
- `v-show="false"`：初始載入較慢（會渲染，只是隱藏）

#### 5. 與其他指令搭配

`v-if` 可以搭配 `v-else-if` 和 `v-else`：

```vue
<template>
  <div>
    <div v-if="type === 'A'">類型 A</div>
    <div v-else-if="type === 'B'">類型 B</div>
    <div v-else>其他類型</div>
  </div>
</template>
```

`v-show` 無法搭配 `v-else`：

```vue
<!-- ❌ 錯誤：v-show 不能使用 v-else -->
<div v-show="type === 'A'">類型 A</div>
<div v-else>其他類型</div>

<!-- ✅ 正確：需要分別設定條件 -->
<div v-show="type === 'A'">類型 A</div>
<div v-show="type !== 'A'">其他類型</div>
```

### 使用場景建議

#### 使用 `v-if` 的情況：

1. ✅ 條件很少改變
2. ✅ 初始條件為 false，且可能永遠不會變成 true
3. ✅ 需要配合 `v-else-if` 或 `v-else` 使用
4. ✅ 組件內有需要清理的資源（如計時器、事件監聽）

```vue
<template>
  <!-- 權限控制：登入後幾乎不變 -->
  <admin-panel v-if="isAdmin" />

  <!-- 路由相關：頁面切換時才改變 -->
  <home-page v-if="currentRoute === 'home'" />
  <about-page v-else-if="currentRoute === 'about'" />
</template>
```

#### 使用 `v-show` 的情況：

1. ✅ 需要頻繁切換顯示狀態
2. ✅ 組件初始化成本高，希望保留狀態
3. ✅ 不需要觸發生命週期鉤子

```vue
<template>
  <!-- Tab 切換：使用者經常切換 -->
  <div v-show="activeTab === 'profile'">個人資料</div>
  <div v-show="activeTab === 'settings'">設定</div>

  <!-- 彈窗：頻繁開關 -->
  <modal v-show="isModalVisible" />

  <!-- 載入動畫：頻繁顯示/隱藏 -->
  <loading-spinner v-show="isLoading" />
</template>
```

### 效能比較總結

| 特性         | v-if                      | v-show           |
| ------------ | ------------------------- | ---------------- |
| 初始渲染開銷 | 小（條件為 false 不渲染） | 大（一定會渲染） |
| 切換開銷     | 大（銷毀/重建元素）       | 小（只改變 CSS） |
| 適用場景     | 條件不常改變              | 需要頻繁切換     |
| 生命週期     | 會觸發                    | 不觸發           |
| 搭配使用     | v-else-if, v-else         | 無               |

### 實際範例對比

```vue
<template>
  <div>
    <!-- 範例 1：管理員面板（使用 v-if） -->
    <!-- 原因：登入後幾乎不變，且有權限控制 -->
    <div v-if="userRole === 'admin'">
      <h2>管理員面板</h2>
      <button @click="deleteUser">刪除使用者</button>
    </div>

    <!-- 範例 2：彈窗（使用 v-show） -->
    <!-- 原因：使用者會頻繁開關彈窗 -->
    <div v-show="isModalOpen" class="modal">
      <h2>彈窗標題</h2>
      <p>彈窗內容</p>
      <button @click="isModalOpen = false">關閉</button>
    </div>

    <!-- 範例 3：載入動畫（使用 v-show） -->
    <!-- 原因：API 請求時會頻繁顯示/隱藏 -->
    <div v-show="isLoading" class="loading">
      <spinner />
    </div>

    <!-- 範例 4：錯誤訊息（使用 v-if） -->
    <!-- 原因：不常出現，且出現時需要重新渲染 -->
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

### 記憶點

> - `v-if`：不顯示時就不渲染，適合不常改變的條件
> - `v-show`：一開始就渲染好，隨時準備顯示，適合頻繁切換

## 4. What's the difference between `computed` and `watch`?

> `computed` 和 `watch` 有什麼差別？

這是 Vue 中兩個非常重要的響應式功能，雖然都能監聽資料變化，但使用場景和特性截然不同。

### `computed`（計算屬性）

#### 特性

1. **緩存機制**：`computed` 計算出來的結果會被緩存，只有當依賴的響應式資料改變時才會重新計算
2. **自動追蹤依賴**：會自動追蹤計算過程中使用到的響應式資料
3. **同步計算**：必須是同步操作，且必須有回傳值
4. **簡潔的語法**：可以直接在 template 中使用，如同 data 中的屬性

#### 使用場景

```vue
<!-- Vue 3 <script setup> 寫法 -->
<template>
  <div>
    <!-- 範例 1：格式化資料 -->
    <p>全名：{{ fullName }}</p>
    <p>信箱：{{ emailLowerCase }}</p>

    <!-- 範例 2：計算購物車總價 -->
    <ul>
      <li v-for="item in cart" :key="item.id">
        {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
      </li>
    </ul>
    <p>總計：${{ cartTotal }}</p>

    <!-- 範例 3：過濾列表 -->
    <input v-model="searchText" placeholder="搜尋..." />
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

// 範例 1：組合資料
const fullName = computed(() => {
  console.log('計算 fullName'); // 只在依賴改變時才執行
  return `${firstName.value} ${lastName.value}`;
});

// 範例 2：格式化資料
const emailLowerCase = computed(() => {
  return email.value.toLowerCase();
});

// 範例 3：計算總價
const cartTotal = computed(() => {
  console.log('計算 cartTotal'); // 只在 cart 改變時才執行
  return cart.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// 範例 4：過濾列表
const filteredItems = computed(() => {
  if (!searchText.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});
</script>
```

#### `computed` 的優勢：緩存機制

```vue
<template>
  <div>
    <!-- 多次使用 computed，但只計算一次 -->
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>

    <!-- 使用 method，每次都會重新計算 -->
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: Array.from({ length: 1000 }, (_, i) => i),
    };
  },
  computed: {
    expensiveComputed() {
      console.log('computed 執行'); // 只執行一次
      return this.items.reduce((sum, item) => sum + item, 0);
    },
  },
  methods: {
    expensiveMethod() {
      console.log('method 執行'); // 執行三次
      return this.items.reduce((sum, item) => sum + item, 0);
    },
  },
};
</script>
```

#### `computed` 的 getter 和 setter

```vue
<script>
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
    };
  },
  computed: {
    fullName: {
      // getter：讀取時執行
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
      // setter：設定時執行
      set(newValue) {
        const names = newValue.split(' ');
        this.firstName = names[0];
        this.lastName = names[names.length - 1];
      },
    },
  },
  mounted() {
    console.log(this.fullName); // 'John Doe'（觸發 getter）
    this.fullName = 'Jane Smith'; // 觸發 setter
    console.log(this.firstName); // 'Jane'
    console.log(this.lastName); // 'Smith'
  },
};
</script>
```

### `watch`（監聽屬性）

#### 特性

1. **手動追蹤資料變化**：需要明確指定要監聽哪個資料
2. **可執行非同步操作**：適合呼叫 API、設定計時器等
3. **不需要回傳值**：主要用於執行副作用（side effects）
4. **可以監聽多個資料**：透過陣列或物件深度監聽
5. **提供新舊值**：可以拿到變化前後的值

#### 使用場景

```vue
<!-- Vue 3 <script setup> 寫法 -->
<template>
  <div>
    <!-- 範例 1：即時搜尋 -->
    <input v-model="searchQuery" placeholder="搜尋使用者..." />
    <div v-if="isSearching">搜尋中...</div>
    <ul>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.name }}
      </li>
    </ul>

    <!-- 範例 2：表單驗證 -->
    <input v-model="username" placeholder="使用者名稱" />
    <p v-if="usernameError" class="error">{{ usernameError }}</p>

    <!-- 範例 3：自動儲存 -->
    <textarea v-model="content" placeholder="輸入內容..."></textarea>
    <p v-if="isSaving">儲存中...</p>
    <p v-if="lastSaved">最後儲存：{{ lastSaved }}</p>
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

// 範例 1：即時搜尋（防抖）
watch(searchQuery, async (newQuery, oldQuery) => {
  console.log(`搜尋從 "${oldQuery}" 變更為 "${newQuery}"`);

  // 清除之前的計時器
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  // 設定防抖：500ms 後才執行搜尋
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } catch (error) {
      console.error('搜尋失敗', error);
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// 範例 2：表單驗證
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = '使用者名稱至少需要 3 個字元';
  } else if (newUsername.length > 20) {
    usernameError.value = '使用者名稱不能超過 20 個字元';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value = '使用者名稱只能包含字母、數字和底線';
  } else {
    usernameError.value = '';
  }
});

// 範例 3：自動儲存
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
      console.error('儲存失敗', error);
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  // 清理計時器
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### `watch` 的選項

```vue
<!-- Vue 3 <script setup> 寫法 -->
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

// 選項 1：immediate（立即執行）
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`名字從 ${oldName} 變更為 ${newName}`);
  },
  { immediate: true } // 組件建立時立即執行一次
);

// 選項 2：deep（深度監聽）
watch(
  user,
  (newUser, oldUser) => {
    console.log('user 物件內部發生變化');
    console.log('新值：', newUser);
  },
  { deep: true } // 監聽物件內部所有屬性的變化
);

// 選項 3：flush（執行時機）
watch(
  items,
  (newItems) => {
    console.log('items 變化');
  },
  { flush: 'post' } // 在 DOM 更新後執行（預設是 'pre'）
);

onMounted(() => {
  // 測試深度監聽
  setTimeout(() => {
    user.value.profile.age = 31; // 會觸發 deep watch
  }, 1000);
});
</script>
```

#### 監聽多個資料來源

```vue
<script>
import { watch } from 'vue';

export default {
  setup() {
    const firstName = ref('John');
    const lastName = ref('Doe');

    // Vue 3 Composition API：監聽多個資料
    watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
      console.log(
        `名字從 ${oldFirst} ${oldLast} 變更為 ${newFirst} ${newLast}`
      );
    });

    return { firstName, lastName };
  },
};
</script>
```

### `computed` vs `watch` 比較

| 特性              | computed               | watch                  |
| ----------------- | ---------------------- | ---------------------- |
| **主要用途**      | 基於已有資料計算新資料 | 監聽資料變化執行副作用 |
| **回傳值**        | 必須有回傳值           | 不需要回傳值           |
| **緩存**          | ✅ 有緩存機制          | ❌ 沒有緩存            |
| **依賴追蹤**      | ✅ 自動追蹤            | ❌ 手動指定            |
| **非同步操作**    | ❌ 不支援              | ✅ 支援                |
| **新舊值**        | ❌ 無法取得            | ✅ 可以取得            |
| **Template 使用** | ✅ 可以直接使用        | ❌ 不能直接使用        |
| **執行時機**      | 依賴改變時             | 監聽的資料改變時       |

### 使用場景建議

#### 使用 `computed` 的情況：

1. ✅ 需要**基於現有資料計算新資料**
2. ✅ 計算結果會在 template 中**多次使用**（利用緩存）
3. ✅ **同步計算**，不需要非同步操作
4. ✅ 需要**格式化、過濾、排序**資料

```vue
<script>
export default {
  computed: {
    // ✅ 格式化資料
    formattedDate() {
      return new Date(this.timestamp).toLocaleDateString();
    },

    // ✅ 過濾列表
    activeUsers() {
      return this.users.filter((user) => user.isActive);
    },

    // ✅ 計算總和
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.price, 0);
    },
  },
};
</script>
```

#### 使用 `watch` 的情況：

1. ✅ 需要**執行非同步操作**（如 API 請求）
2. ✅ 需要**執行副作用**（如更新 localStorage）
3. ✅ 需要**防抖或節流**
4. ✅ 需要**拿到新舊值進行比較**
5. ✅ 需要**條件性執行**複雜邏輯

```vue
<script>
export default {
  watch: {
    // ✅ API 請求
    async userId(newId) {
      this.user = await fetch(`/api/users/${newId}`).then((r) => r.json());
    },

    // ✅ localStorage 同步
    settings: {
      handler(newSettings) {
        localStorage.setItem('settings', JSON.stringify(newSettings));
      },
      deep: true,
    },

    // ✅ 防抖搜尋
    searchQuery(newQuery) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.performSearch(newQuery);
      }, 500);
    },
  },
};
</script>
```

### 實際案例對比

#### 錯誤用法 ❌

```vue
<script>
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      fullName: '',
    };
  },
  watch: {
    // ❌ 錯誤：應該用 computed
    firstName(newFirst) {
      this.fullName = `${newFirst} ${this.lastName}`;
    },
    lastName(newLast) {
      this.fullName = `${this.firstName} ${newLast}`;
    },
  },
};
</script>
```

#### 正確用法 ✅

```vue
<script>
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
    };
  },
  computed: {
    // ✅ 正確：用 computed 計算衍生資料
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
};
</script>
```

### 記憶點

> **「`computed` 算資料，`watch` 做事情」**
>
> - `computed`：用來**計算新的資料**（如格式化、過濾、總和）
> - `watch`：用來**執行動作**（如 API 請求、儲存資料、顯示通知）

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
