---
id: vue-api
title: 'ð·ï¸ API'
slug: /vue-api
---

### 1. Please explain v-model / v-show / v-if / v-html / v-bind ?

- v-modelï¼è³æéåç¶å®ï¼ç¶æ¹è®è³æçåæï¼é¨å³é©åæ¹è® template ä¸æ¸²æçå§å®¹ã
- v-if & v-showï¼å©èé½æ¯æ¢ä»¶æ¸²æï¼ééå¤æ·æ¢ä»¶æ±ºå®æ¯å¦é¡¯ç¤ºï¼ä¸éå·®å¥å¨æ¼ v-if çå¤æ·æé·æ¯ç¯é»ï¼æ´å DOM å¨ false çæä¸æè¢«ç§»é¤ï¼ä½ v-show åä½¿ç¨ css ç`display: none;`å±¬æ§ä¾é±èåç´ ã
- v-htmlï¼å¦æè³æåå³çå§å®¹ä¸­å¸¶æ HTML çæ¨ç±¤æï¼å¯ä»¥éééåæä»¤ä¾æ¸²æï¼ä¾å¦é¡¯ç¤º Markdown èªæ³åææ¯å°æ¹ç´æ¥åå³å«æ img æ¨ç±¤çåçè·¯å¾ã
- v-bindï¼åæç¶å®ï¼å¸¸è¦æ¼ç¶å® class æé£çµãåçç­ãç¶éé v-bind ç¶å® class å¾ï¼å¯ä»¥ééè³æè®åï¼ä¾æ±ºå®è©² class æ¨£å¼æ¯å¦è¢«ç¶å®ï¼åç api åå³çåçè·¯å¾ãé£çµç¶²åï¼ä¹è½ééç¶å®çå½¢å¼ä¾ç¶­æåææ´æ°ã

### 2. How to use `v-model` of 2.x ?

```js
<template lang="pug">
  .container
    input(type="text" placeholder="type something" v-model="text")
    div {{ text }}
</template>

<script>
export default {
  data: () => ({
    text: '',
  }),
};
</script>
```

### 3. How to use `v-model` of 3.1 ?

#### `ref()` method

```js
<template lang="pug">
.container
  input(type="text" placeholder="type something" v-model="todo")
  div {{ todo }}
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Demo',
  setup() {
    const todo = ref('');

    return { todo };
  },
};
</script>
```

#### `reactive()` method

```js
<template lang="pug">
.container
  input(type="text" placeholder="type something" v-model="state.todo")
  div {{ state.todo }}
</template>

<script>
import { reactive } from 'vue';

export default {
  name: 'Demo',
  setup() {
    const state = reactive({
      todo: '',
    });

    return { state };
  },
};
</script>
```

#### use `toRefs()` to optimize `reactive()`

```js
<template lang="pug">
.container
  input(type="text" placeholder="type something" v-model="todo")
  div {{ todo }}
</template>

<script>
import { reactive, toRefs } from 'vue';

export default {
  name: 'Demo',
  setup() {
    const state = reactive({
      todo: '',
    });

    return { ...toRefs(state) };
  },
};
</script>
```

### 4. Whatâs the difference between `computed` and `watch` ?

`computed` é¤äºè¨ç®å±¬æ§çç¹æ§å¤ï¼å¶ä¸»è¦ç®çï¼æ¯çºäºå¨ç®åå·²æçè³æä¸é²è¡æ´æ°ï¼æä»¥æ¬èº«å¸¶æç·©å­çç¹æ§ï¼è `watch` ååæ¯ç£è½è³æçè®åã

æä»¥ä½¿ç¨ä¸ï¼è¦èæ®å°æç¨æå¢ï¼å¦ææç­è³æå¿é ç¸ä¾å¦å¤ä¸ç­è³æä¾è¨ç®çè©±ï¼åä½¿ç¨ `computed`ï¼åä¹ï¼å¦æåªæ¯è¦å®ç´ç£è½è³æè®åï¼åä½¿ç¨ `watch`ã

### 5. Why `v-for` must setting key value ?

åè¥æ²æè¨­å®å¯ä¸å¼ç Key ï¼ç¶æåå°é£åé²è¡æä½æï¼å°±æé æå¯¦éçµæåé æçµæä¸åã

èä¾èè¨ï¼

Array A ä¸­æä¸ç¨®æ°´æï¼ä¾åºçºèæãè¥¿çãè¡èï¼åå¦åªé¤äºè¥¿ççç®éä½ç½®ï¼index ä¸åºç¶æ¯æ¹æ 1ã3ï¼ä½å°ç¨å¼èè¨ï¼å¨éæ­·ä¸­å®åªæèªçºæ¯ç®é 2 è¢«æ¹æ 3ï¼åæåç´ ä»æªè¢«åªé¤ï¼å¨å°±å°è¤ç¨çååä¸ï¼å°±è®æ`1: èæã3: è¥¿ç`ãæä»¥ééå¯ä¸å¼ç Keyï¼å¯ä»¥è®å¢åªé£åä¸­çè³ææï¼æ¿å°é æççµæã

å¦å¤ï¼key ä½çºå¯ä¸å¼æï¼å°åºå±¤èæ¬`DOM`æ¸²æä¹æå¹«å©(æ¶å`diff`æ¼ç®æ³)ï¼ç¶ææå¯ä¸å¼æï¼å³ä¾¿é£åæç©ä»¶ä¸­å å¥æ°çè³æï¼ä¹å¯ä»¥é¿åéè¤æ¸²æçåé¡ï¼å°æè½æåæå¹«å©ã

### 6. Whatâs the `Vue.use()` ?

å¦ææå®è£ä¾è³´å¨ Vue ç pluginï¼å¯ä»¥éé`Vue.use()`çæ¹æ³ï¼æå¥ä»¶è¨»åå°å¨åç°å¢ï¼è®å¶ä» component å¯ä»¥ç´æ¥ä½¿ç¨ï¼èä¸éè¦æ¯é é½ import è©²æä»¶ã

### 7. Whatâs `keep-alive` ? How to use ?

ä¸ç¨®æ«å­è³æçæ¹å¼ï¼å¸¸è¦æ¼å¡«å¯«è¡¨æ ¼è³ææï¼å çºå§å®¹ç¹å¤ï¼å¯è½å¨è¨­è¨ä¸ææ tab éé¡çè¨­è¨ï¼ç¶ä½¿ç¨èä¸å°å¿èª¤è§¸ï¼ææ¯æ³ééåæä¾æ¥çæ­¤åå¡«å¯«çå§å®¹æï¼è¥æªå°å¶å§å®¹é²è¡æ«å­ï¼åæå°è´ååå¡«å¯«çè³ææ¶å¤±ï¼éå¨ä½¿ç¨é«é©ä¸ä¸ä½³ã

éé keep-alive å»åè£¹éè¦æ«å­çåå¡ï¼é¤äºè½ç·©å­è³æï¼ä¹è½åªåä½¿ç¨é«é©ã

#### Usage

æºåå©åçµä»¶ï¼ä¸åçµä»¶å®ç´é¡¯ç¤ºåè¡¨ï¼å¦ä¸åçµä»¶åé¡¯ç¤º textareaï¼ä¸¦å¨å¼å¥çµä»¶æé²è¡åææ¸²æï¼æ¥èä½¿ç¨ keep-alive é²è¡åè£¹ï¼ç¶é»æå©å button é²è¡åæï¼å¯ä»¥çå°çµä»¶ä¾ååæé¡¯ç¤ºï¼æ¥èå¨ textarea ä¸­è¼¸å¥ä¸äºå§å®¹ï¼ä¸¦åæ¬¡é²è¡åæï¼å³å¯çå°è¼¸å¥å§å®¹è¢«ç·©å­ççµæã

```js
<template lang="pug">
.container
  v-btn(@click="handle('List')") List
  v-btn(@click="handle('Form')") Form
  keep-alive
    component(:is="content")
</template>

<script>
import List from '../components/list';
import Form from '../components/form';

export default {
  name: 'Video',
  components: {
    List,
    Form,
  },

  data: () => ({
    content: 'List',
  }),

  methods: {
    handle(value) {
      this.content = value;
    },
  },
};
</script>
```
