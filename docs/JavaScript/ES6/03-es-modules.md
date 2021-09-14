---
id: 03-es-modules
description: 現代 JS 開發，多已採用引入 component 的形式來組成專案結構
slug: /es-modules
---

# 03 - ES Modules

> 現代 JS 開發，多已採用引入 component 的形式來組成專案結構。

## Named Export(實名匯出)

透過直接定義變數後匯出：

```javascript
<!-- 建立 tools.js 這個檔案並直接定義變數並匯出 -->
export const price = 1500;

export const sellFunc = () => {
  console.log(`價格：${price}`);
}
```

匯入檔案：

```javascript
import { price, sellFunc } from './tools.js';

sellFunc(price); // 價格：1500
```

另一方面，也可以先將變數全部定義好，在統一匯出：

```javascript
<!-- utils.js -->
const deviceName = 'iPhone';
const mobileList = ['Samsung', 'Apple', 'Oppo'];

function getName(deviceName) {
  console.log(deviceName);
};

const product = '德芙巧克力';

export {
  deviceName,
  mobileList,
  product as productDetail, // 可以透過 as 語法，將匯出的變數進行名稱修改
  getName,
};
```

承上，`as`語法同樣能運用在匯入的時機：

```javascript
import {
  deviceName as device,
  productDetail,
  mobileList,
} from './utils.js';

console.log(device, productDetail); // 'iPhone' '德芙巧克力'
```

需要注意一點，若非使用打包工具建立的環境下，一般`script`無法判別`module`，需再加上`type`：

```javascript
<script type="module" src="./js/index.js"></script>
```

## Default Export(預設匯出)

實名匯出在匯入時，必須變數名稱相對應，因此開發時必須要確認匯出的變數有哪些，才能進入匯入的動作，如果希望改成先不管匯出的變數名稱，而是可以直接匯入的話，則使用預設匯出：

```javascript
<!-- tools.js -->
export default ['Samsung', 'Apple', 'Oppo'];
```

匯入時名稱可自定義：

```javascript
import list from './tools';

console.log(list); // (3) ['Samsung', 'Apple', 'Oppo']
```

在實名匯出時，包裹的{}並非物件，但在預設匯出時接的{}就是物件，所以`as`語法在預設匯出無法使用：

```javascript
<!-- utils.js -->
const device = 'iPhone';
const number = 600;

export default {
  device, // 可以視為 device 的縮寫
  number, // 可以視為 number 的縮寫
};
```

因為匯出時是物件，所以在匯入後，也必須以物件的形式操作：

```javascript
import myPhone from './utils';

const { number } = myPhone;

console.log(myPhone.device);
```
