---
id: vue3-new-features
title: '[Easy] Vue3 新特性'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> Vue 3 有哪些新特性？

Vue 3 引入了許多新特性和改進，主要包括：

### 主要新特性

1. **Composition API**：新的組件寫法
2. **Teleport**：將組件渲染到 DOM 的其他位置
3. **Fragment**：組件可以有多個根節點
4. **Suspense**：處理非同步組件載入
5. **多個 v-model**：支援多個 v-model
6. **更好的 TypeScript 支援**
7. **效能優化**：更小的打包體積、更快的渲染速度

## 2. Teleport

> Teleport 是什麼？

**定義**：`Teleport` 允許我們將組件的內容渲染到 DOM 樹的其他位置，而不改變組件的邏輯結構。

### 使用場景

**常見場景**：Modal、Tooltip、Notification 等需要渲染到 body 的組件

```vue
<template>
  <div>
    <button @click="showModal = true">開啟 Modal</button>

    <!-- 使用 Teleport 將 Modal 渲染到 body -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Modal 標題</h2>
          <p>Modal 內容</p>
          <button @click="showModal = false">關閉</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

### 優勢

1. **解決 z-index 問題**：Modal 渲染到 body，不受父組件樣式影響
2. **保持邏輯結構**：組件邏輯仍在原位置，只是 DOM 位置不同
3. **更好的可維護性**：Modal 相關程式碼集中在組件中

## 3. Fragment（多根節點）

> Fragment 是什麼？

**定義**：Vue 3 允許組件有多個根節點，不需要包裹在單一元素中。這是一個隱式的 Fragment，不需要像 React 那樣使用 `<Fragment>` 標籤。

### Vue 2 vs Vue 3

**Vue 2**：必須有單一根節點

```vue
<!-- Vue 2：必須包裹在單一元素中 -->
<template>
  <div>
    <h1>標題</h1>
    <p>內容</p>
  </div>
</template>
```

**Vue 3**：可以有多個根節點

```vue
<!-- Vue 3：可以有多個根節點 -->
<template>
  <h1>標題</h1>
  <p>內容</p>
</template>
```

### 為什麼需要 Fragment？

在 Vue 2 中，組件必須有單一根節點，這導致開發者經常需要添加額外的包裹元素（如 `<div>`），這些元素：

1. **破壞語意化 HTML**：添加無意義的包裹元素
2. **增加 DOM 層級**：影響樣式選擇器和效能
3. **樣式控制困難**：需要處理額外包裹元素的樣式

### 使用場景

#### 場景 1：語意化 HTML 結構

```vue
<template>
  <!-- 不需要額外的包裹元素 -->
  <header>
    <h1>網站標題</h1>
  </header>
  <main>
    <p>主要內容</p>
  </main>
  <footer>
    <p>頁尾</p>
  </footer>
</template>
```

#### 場景 2：列表項組件

```vue
<!-- ListItem.vue -->
<template>
  <li class="item-title">{{ title }}</li>
  <li class="item-description">{{ description }}</li>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
```

#### 場景 3：條件渲染多個元素

```vue
<template>
  <div v-if="showHeader" class="header">標題</div>
  <div v-if="showContent" class="content">內容</div>
  <div v-if="showFooter" class="footer">頁尾</div>
</template>
```

### 屬性繼承（Attribute Inheritance）

當組件有多個根節點時，屬性繼承的行為會有所不同。

**單根節點**：屬性會自動繼承到根元素

```vue
<!-- 父組件 -->
<MyComponent class="custom-class" id="my-id" />

<!-- 子組件（單根） -->
<template>
  <div>內容</div>
</template>

<!-- 渲染結果 -->
<div class="custom-class" id="my-id">內容</div>
```

**多根節點**：屬性不會自動繼承，需要手動指定

```vue
<!-- 父組件 -->
<MyComponent class="custom-class" id="my-id" />

<!-- 子組件（多根） -->
<template>
  <div>第一個根</div>
  <div>第二個根</div>
</template>

<!-- 渲染結果：屬性不會自動繼承 -->
<div>第一個根</div>
<div>第二個根</div>
```

**解決方案**：使用 `$attrs` 手動綁定屬性

```vue
<!-- 子組件 -->
<template>
  <div v-bind="$attrs">第一個根</div>
  <div>第二個根</div>
</template>

<!-- 渲染結果 -->
<div class="custom-class" id="my-id">第一個根</div>
<div>第二個根</div>
```

**使用 `inheritAttrs: false` 控制繼承行為**：

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // 禁用自動繼承
});
</script>

<template>
  <div v-bind="$attrs">第一個根</div>
  <div>第二個根</div>
</template>
```

### Fragment vs React Fragment

| 特性         | Vue 3 Fragment     | React Fragment                    |
| ------------ | ------------------ | --------------------------------- |
| **語法**     | 隱式（不需要標籤） | 顯式（需要 `<Fragment>` 或 `<>`） |
| **Key 屬性** | 不需要             | 需要時使用 `<Fragment key={...}>` |
| **屬性繼承** | 需要手動處理       | 不支援屬性                        |

**Vue 3**：

```vue
<!-- Vue 3：隱式 Fragment -->
<template>
  <h1>標題</h1>
  <p>內容</p>
</template>
```

**React**：

```jsx
// React：顯式 Fragment
function Component() {
  return (
    <>
      <h1>標題</h1>
      <p>內容</p>
    </>
  );
}
```

### 注意事項

1. **屬性繼承**：多根節點時，屬性不會自動繼承，需要使用 `$attrs` 手動綁定
2. **樣式作用域**：多根節點時，`scoped` 樣式會應用到所有根節點
3. **邏輯包裹**：如果邏輯上需要包裹，還是應該使用單一根節點

```vue
<!-- ✅ 好的做法：邏輯上需要包裹 -->
<template>
  <div class="card">
    <h2>標題</h2>
    <p>內容</p>
  </div>
</template>

<!-- ⚠️ 避免：為了多根而多根 -->
<template>
  <h2>標題</h2>
  <p>內容</p>
  <!-- 如果這兩個元素邏輯上應該是一組，應該包裹 -->
</template>
```

## 4. Suspense

> Suspense 是什麼？

**定義**：`Suspense` 是一個內建組件，用來處理非同步組件載入時的載入狀態。

### 基本用法

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>載入中...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### 使用場景

1. **非同步組件載入**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **非同步資料載入**
   ```vue
   <script setup>
   const data = await fetchData(); // 在 setup 中使用 await
   </script>
   ```

## 5. Multiple v-model

> 多個 v-model

**定義**：Vue 3 允許組件使用多個 `v-model`，每個 `v-model` 對應不同的 prop。

### Vue 2 vs Vue 3

**Vue 2**：只能有一個 `v-model`

```vue
<!-- Vue 2：只能有一個 v-model -->
<CustomInput v-model="value" />
```

**Vue 3**：可以有多個 `v-model`

```vue
<!-- Vue 3：可以有多個 v-model -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### 實作範例

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Common Interview Questions

> 常見面試題目

### 題目 1：Teleport 的使用場景

請說明什麼時候應該使用 `Teleport`？

<details>
<summary>點擊查看答案</summary>

**使用 Teleport 的場景**：

1. **Modal 對話框**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - 解決 z-index 問題
   - 不受父組件樣式影響

2. **Tooltip 提示**

   ```vue
   <Teleport to="body">
     <Tooltip v-if="showTooltip" />
   </Teleport>
   ```

   - 避免被父組件 overflow 隱藏

3. **Notification 通知**
   ```vue
   <Teleport to="#notifications">
     <Notification v-for="msg in messages" :key="msg.id" />
   </Teleport>
   ```
   - 統一管理通知位置

**不使用 Teleport 的情況**：

- 一般內容不需要
- 不需要特殊 DOM 位置的組件

</details>

### 題目 2：Fragment 的優勢

請說明 Vue 3 允許多個根節點的優勢。

<details>
<summary>點擊查看答案</summary>

**優勢**：

1. **減少不必要的 DOM 元素**

   ```vue
   <!-- Vue 2：需要額外的 div -->
   <template>
     <div>
       <header>...</header>
       <main>...</main>
     </div>
   </template>

   <!-- Vue 3：不需要額外的元素 -->
   <template>
     <header>...</header>
     <main>...</main>
   </template>
   ```

2. **更好的語意化 HTML**

   - 不需要為了 Vue 的限制而添加無意義的包裹元素
   - 保持 HTML 結構的語意化

3. **更靈活的樣式控制**

   - 不需要處理額外包裹元素的樣式
   - 減少 CSS 選擇器的複雜度

4. **減少 DOM 層級**

   - 更淺的 DOM 樹，效能更好
   - 減少瀏覽器渲染成本

5. **更好的可維護性**
   - 程式碼更簡潔，不需要額外的包裹元素
   - 組件結構更清晰

</details>

### 題目 3：Fragment 屬性繼承問題

請說明當組件有多個根節點時，屬性繼承的行為是什麼？如何解決？

<details>
<summary>點擊查看答案</summary>

**問題**：

當組件有多個根節點時，父組件傳遞的屬性（如 `class`、`id` 等）不會自動繼承到任何一個根節點。

**範例**：

```vue
<!-- 父組件 -->
<MyComponent class="custom-class" id="my-id" />

<!-- 子組件（多根） -->
<template>
  <div>第一個根</div>
  <div>第二個根</div>
</template>

<!-- 渲染結果：屬性不會自動繼承 -->
<div>第一個根</div>
<div>第二個根</div>
```

**解決方案**：

1. **使用 `$attrs` 手動綁定屬性**

```vue
<!-- 子組件 -->
<template>
  <div v-bind="$attrs">第一個根</div>
  <div>第二個根</div>
</template>

<!-- 渲染結果 -->
<div class="custom-class" id="my-id">第一個根</div>
<div>第二個根</div>
```

2. **使用 `inheritAttrs: false` 控制繼承行為**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // 禁用自動繼承
});
</script>

<template>
  <div v-bind="$attrs">第一個根</div>
  <div>第二個根</div>
</template>
```

3. **選擇性地綁定特定屬性**

```vue
<template>
  <div :class="$attrs.class">第一個根</div>
  <div :id="$attrs.id">第二個根</div>
</template>
```

**關鍵點**：

- 單根節點：屬性自動繼承
- 多根節點：屬性不會自動繼承，需要手動處理
- 使用 `$attrs` 可以訪問所有未在 `props` 中定義的屬性

</details>

### 題目 4：Fragment vs React Fragment

請比較 Vue 3 Fragment 和 React Fragment 的差異。

<details>
<summary>點擊查看答案</summary>

**主要差異**：

| 特性         | Vue 3 Fragment           | React Fragment                    |
| ------------ | ------------------------ | --------------------------------- |
| **語法**     | 隱式（不需要標籤）       | 顯式（需要 `<Fragment>` 或 `<>`） |
| **Key 屬性** | 不需要                   | 需要時使用 `<Fragment key={...}>` |
| **屬性繼承** | 需要手動處理（`$attrs`） | 不支援屬性                        |

**Vue 3**：

```vue
<!-- Vue 3：隱式 Fragment，直接寫多個根節點 -->
<template>
  <h1>標題</h1>
  <p>內容</p>
</template>
```

**React**：

```jsx
// React：顯式 Fragment，需要使用標籤
function Component() {
  return (
    <>
      <h1>標題</h1>
      <p>內容</p>
    </>
  );
}

// 或使用 Fragment
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>標題</h1>
      <p>內容</p>
    </Fragment>
  );
}
```

**優勢比較**：

- **Vue 3**：語法更簡潔，不需要額外標籤
- **React**：更明確，可以添加 key 屬性

</details>

### 題目 5：Suspense 的使用

請實作一個使用 `Suspense` 載入非同步組件的範例。

<details>
<summary>點擊查看答案</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>載入使用者資料中...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);

// 定義非同步組件
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

**進階用法：處理錯誤**

```vue
<template>
  <Suspense @resolve="onResolve" @reject="onReject">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>載入中...</div>
    </template>
  </Suspense>
</template>

<script setup>
const onResolve = () => {
  console.log('組件載入成功');
};

const onReject = (error) => {
  console.error('組件載入失敗:', error);
};
</script>
```

</details>

## 7. Best Practices

> 最佳實踐

### 推薦做法

```vue
<!-- 1. Modal 使用 Teleport -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. 多根節點保持語意化 -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. 非同步組件使用 Suspense -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. 多個 v-model 使用明確的命名 -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### 避免的做法

```vue
<!-- 1. 不要過度使用 Teleport -->
<Teleport to="body">
  <div>一般內容</div> <!-- ❌ 不需要 -->
</Teleport>

<!-- 2. 不要為了多根節點而破壞結構 -->
<template>
  <h1>標題</h1>
  <p>內容</p>
  <!-- ⚠️ 如果邏輯上需要包裹，還是應該使用單一根節點 -->
</template>

<!-- 3. 不要忽略 Suspense 的錯誤處理 -->
<Suspense>
  <AsyncComponent />
  <!-- ⚠️ 應該處理載入失敗的情況 -->
</Suspense>
```

## 8. Interview Summary

> 面試總結

### 快速記憶

**Vue 3 主要新特性**：

- **Composition API**：新的組件寫法
- **Teleport**：將組件渲染到其他 DOM 位置
- **Fragment**：支援多個根節點
- **Suspense**：處理非同步組件載入
- **多個 v-model**：支援多個 v-model 綁定

**使用場景**：

- Modal/Tooltip → `Teleport`
- 語意化 HTML → `Fragment`
- 非同步組件 → `Suspense`
- 表單組件 → 多個 `v-model`

### 面試回答範例

**Q: Vue 3 有哪些主要新特性？**

> "Vue 3 引入了許多新特性，主要包括：1) Composition API，提供新的組件寫法，更好的邏輯組織和程式碼重用；2) Teleport，允許將組件內容渲染到 DOM 樹的其他位置，常用於 Modal、Tooltip 等；3) Fragment，組件可以有多個根節點，不需要額外的包裹元素；4) Suspense，處理非同步組件載入時的載入狀態；5) 多個 v-model，支援組件使用多個 v-model 綁定；6) 更好的 TypeScript 支援和效能優化。這些新特性讓 Vue 3 更強大、更靈活，同時保持了向後相容性。"

**Q: Teleport 的使用場景是什麼？**

> "Teleport 主要用於需要將組件渲染到 DOM 樹其他位置的場景，常見的使用場景包括：1) Modal 對話框，需要渲染到 body 以避免 z-index 問題；2) Tooltip 提示，避免被父組件的 overflow 隱藏；3) Notification 通知，統一管理通知位置。Teleport 的優勢是保持組件的邏輯結構不變，只是改變 DOM 的渲染位置，這樣既解決了樣式問題，又保持了程式碼的可維護性。"

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
