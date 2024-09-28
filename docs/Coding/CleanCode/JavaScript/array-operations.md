---
id: clean-code-javascript-array-operations
title: '🌰 II. Array Operations'
slug: /clean-code-javascript-array-operations
tags: [Coding, Clean Code, JavaScript, Array]
---

## 進階陣列操作：掌握 filter 篩選技巧

> 此教學範例為六角 Clean Code 錄製試教影片任務，第二門試教課程講義。

## 1. forEach 練習

```jsx
const data = [
  {
    name: '肥宅心碎賞櫻3日',
    area: '高雄',
    price: 1400,
    rate: 10,
  },
  {
    name: '貓空纜車雙程票',
    area: '台北',
    price: 240,
    rate: 2,
  },
  {
    name: '台中谷關溫泉會1日',
    area: '台中',
    price: 1765,
    rate: 7,
  },
];
```

## 問答

1. 用 forEach 計算所有套票的總價
2. 用 forEach 計算評價在 7 以上的套票
3. 高雄有幾筆資料

<details>
  <summary>✅ Answer</summary>
   1. 用 forEach 計算所有套票的總價。
```jsx
function calculateTotalPrice(packages) {
  let totalPrice = 0;
  packages.forEach(package => {
    totalPrice += package.price;
  });
  return totalPrice;
}
const totalPrice = calculateTotalPrice(data);
console.log(`所有套票的總價為：${totalPrice} 元`);
```
    2. 用 forEach 計算評價在 7 以上的套票。
```jsx
function countHighRatedPackages(packages, minimumRate) {
  let highRatedCount = 0;
  packages.forEach(package => {
    if (package.rate >= minimumRate) {
      highRatedCount++;
    }
  });
  return highRatedCount;
}
const highRatedPackages = countHighRatedPackages(data, 7);
console.log(`評價在 7 以上的套票數量：${highRatedPackages}`);
```
    3. 高雄有幾筆資料。
```jsx
function countPackagesByArea(packages, targetArea) {
  let areaCount = 0;
  packages.forEach(package => {
    if (package.area === targetArea) {
      areaCount++;
    }
  });
  return areaCount;
}
const kaohsiungPackages = countPackagesByArea(data, '高雄');
console.log(`高雄的套票數量：${kaohsiungPackages}`);
```
</details>

## 2. 介紹 filter 觀念

### forEach vs filter

| 差異點             | `forEach`                          | `filter`                         |
| ------------------ | ---------------------------------- | -------------------------------- |
| **用途**           | **遍歷**陣列中的每一個元素         | **篩選**陣列中符合條件的元素     |
| **回傳值**         | **沒有回傳**值 (回傳 `undefined`)  | **回傳**一個新的陣列             |
| **是否改變原陣列** | 不會改變原陣列                     | 不會改變原陣列                   |
| **用例**           | 僅執行操作，不需要篩選或回傳新陣列 | 篩選出符合條件的元素並回傳新陣列 |

### 電商訂單情境

1. **發送通知**：向每位顧客發送 `console.log` 通知，確認訂單已經處理
2. **篩選大額訂單**：需要找出金額超過 $100 的訂單，看看誰是大戶

```jsx
// 訂單清單
const orders = [
  { id: 1, amount: 50, customer: 'Alice' },
  { id: 2, amount: 150, customer: 'Bob' },
  { id: 3, amount: 200, customer: 'Charlie' },
  { id: 4, amount: 80, customer: 'David' },
];

// 1. 使用 forEach 發送通知

// 2. 使用 filter 篩選大額訂單

console.log('大額訂單清單：', highValueOrders);
// filter 回傳一個新的陣列，其中包含符合條件的訂單

// 小題目，以下 orderConsole 變數的值是？
// 1. undefined
// 2. 全部 console 的總和

const orderConsole = orders.forEach(function (order) {
  console.log('通知顧客 ' + order.customer + '：訂單 ' + order.id + ' 已處理');
});
```

<details>
  <summary>💡 使用 forEach 發送通知</summary>
  ```jsx
  const orders = [
    { id: 1, amount: 50, customer: 'Alice' },
    { id: 2, amount: 150, customer: 'Bob' },
    { id: 3, amount: 200, customer: 'Charlie' },
    { id: 4, amount: 80, customer: 'David' },
  ];
  orders.forEach(order => {
    console.log(`通知顧客 ${order.customer}：訂單 ${order.id} 已處理`);
  });
```
</details>

<details>
  <summary>💡 使用 filter 篩選大額訂單</summary>
```jsx
  const orders = [
    { id: 1, amount: 50, customer: 'Alice' },
    { id: 2, amount: 150, customer: 'Bob' },
    { id: 3, amount: 200, customer: 'Charlie' },
    { id: 4, amount: 80, customer: 'David' },
  ];
  const highValueOrders = orders.filter(order => order.amount > 100);
  console.log('大額訂單清單：', highValueOrders);
```
</details>

<details>
  <summary>💡 orderConsole 變數的值是？</summary>
  - undefined
  - 原因是因為 forEach 這個 method 回傳的值總是 undefined，無論是否有做了什麼操作，都會回傳 undefined。
</details>

### 小技巧教學： debugger

```jsx
const orders = [50, 150, 200, 80];
const highValueOrders = orders.filter(function (amount) {
  debugger; // 這行會在瀏覽器的開發者工具中暫停程式執行
  return amount > 100;
});
```

1. 遍歷陣列：從陣列的第一個元素開始，逐個檢查每個元素。
2. 應用條件函式：對於每個元素，會將該元素作為參數傳遞給指定的條件函式。這個條件函式**返回一個布林值**，表示是否將該元素包含在最終的篩選結果中。
3. 篩選元素：**如果條件函式返回`true`，則該元素將被保留在結果陣列中**；如果返回**`false`**，則該元素將被排除在外。
4. 回傳結果陣列：當所有元素都遍歷完畢後，**`filter()`**方法**返回一個新的陣列**，其中包含所有符合條件的元素，而原始陣列不受影響。

## 3. 試著用 forEach、filter 協助解題

- forEach：**遍歷**陣列中的每一個元素
- filter：**篩選**陣列中符合條件的元素

## 電商廣告通路評估

| 廣告通路      | 廣告支出 (spend) | 廣告收入 (revenue) | 投資回報率 (ROAS) = revenue/spend |
| ------------- | ---------------- | ------------------ | --------------------------------- |
| Google Ads    | 10,000           | 35,000             | 3.5                               |
| Facebook Ads  | 8,000            | 24,000             | 3.0                               |
| LinkedIn Ads  | 5,000            | 12,000             | 2.4                               |
| Twitter Ads   | 4,000            | 10,000             | 2.5                               |
| Instagram Ads | 6,000            | 15,000             | 2.5                               |

## 表格解釋

- **廣告通路**：各種不同的廣告平台。
- **廣告支出 (spend)**：花出去的廣告費。
- **廣告收入 (revenue)**：透過廣告賺來的營業額。
- **投資回報率 (ROAS)**：收入與支出的比值，表示每花費一單位的廣告費所帶來的收益

## 六角 2022 程式體驗營，臉書廣告數據為例

![image](https://hackmd.io/_uploads/HJ3CfIBhC.png)

## roas 效益介紹

1. roas 在 1 以下：廣告效益差，可能會決定不投
2. roas 在 2~3：差強人意，列入評估。但在電商零售業或許會繼續投遞
3. roas 在 5~10 左右：效益不錯，六角學院廣告通常會盡可能在這個區間

## 題目設計

```jsx
const marketingChannels = [
  { name: 'Google Ads', spend: 10000, revenue: 35000, roas: 3.5 },
  { name: 'Facebook Ads', spend: 8000, revenue: 24000, roas: 3.0 },
  { name: 'LinkedIn Ads', spend: 5000, revenue: 12000, roas: 2.4 },
  { name: 'Twitter Ads', spend: 4000, revenue: 10000, roas: 2.5 },
  { name: 'Instagram Ads', spend: 6000, revenue: 15000, roas: 2.5 },
];
```

### 尋找高效行銷通路

1. 請設計一段程式碼來找出 ROAS（投資回報率）超過 3 的渠道，並將這些通路放入一個新陣列中
2. 請設計一段程式碼計算所有通路的總支出和總收入

<details>
  <summary>💡 請設計一段程式碼來找出 ROAS（投資回報率）超過 3 的渠道，並將這些通路放入一個新陣列中</summary>
```jsx
const highPerformingChannels = marketingChannels.filter(channel => channel.roas > 3);
console.log("ROAS 超過 3 的高效能行銷通路：", highPerformingChannels);
```
</details>

<details>
  <summary>💡 請設計一段程式碼計算所有通路的總支出和總收入</summary>
```jsx
const totalSpendAndRevenue = marketingChannels.reduce((total, channel) => {
  return {
    totalSpend: total.totalSpend + channel.spend,
    totalRevenue: total.totalRevenue + channel.revenue
  };
}, { totalSpend: 0, totalRevenue: 0 });
console.log("總支出：", totalSpendAndRevenue.totalSpend);
console.log("總收入：", totalSpendAndRevenue.totalRevenue);
```
</details>

## 4. 中世紀旅行

### 示範使用陣列方法結合條件運算符來實現地區篩選

> 遵循以下 clean code 原則

- **變數命名：對應 Clean Code 原則「命名：使用具有意義且可閱讀的名稱」、「使用可解釋的變數」**
- **提取變數：對應 Clean Code 原則「使用可搜尋的名稱」**
- **獨立函式：對應 Clean Code 原則「一個函式只做一件事情」**

```jsx
// 定義中世紀地點數據
const medievalLocations = [
  {
    name: '約克',
    region: '英格蘭',
    type: '城市',
    hasMarket: true,
    hasCastle: true,
  },
  {
    name: '巴黎',
    region: '法蘭西',
    type: '城市',
    hasMarket: true,
    hasCathedral: true,
  },
  {
    name: '威尼斯',
    region: '威尼斯',
    type: '城市',
    hasMarket: true,
    hasPort: true,
  },
  {
    name: '科隆',
    region: '神聖羅馬帝國',
    type: '城市',
    hasMarket: true,
    hasCathedral: true,
  },
  { name: '諾丁漢', region: '英格蘭', type: '城鎮', hasCastle: true },
  { name: '亞維農', region: '法蘭西', type: '城鎮', hasCathedral: true },
  {
    name: '托雷多',
    region: '卡斯提亞',
    type: '城市',
    hasCastle: true,
    hasCathedral: true,
  },
];

// 根據地區篩選地點
const filterLocationsByRegion = (locations, region) => {
  return locations.filter((location) => location.region === region);
};

// 根據類型篩選地點
const filterLocationsByType = (locations, type) => {
  return locations.filter((location) => location.type === type);
};

// 篩選有特定設施的地點
const filterLocationsByFacility = (locations, facility) => {
  return locations.filter((location) => location[facility] === true);
};

// 組合多個篩選條件
const filterLocations = (locations, criteria) => {
  let filteredLocations = locations;

  if (criteria.region) {
    filteredLocations = filterLocationsByRegion(
      filteredLocations,
      criteria.region
    );
  }

  if (criteria.type) {
    filteredLocations = filterLocationsByType(filteredLocations, criteria.type);
  }

  if (criteria.facility) {
    filteredLocations = filterLocationsByFacility(
      filteredLocations,
      criteria.facility
    );
  }

  return filteredLocations;
};

// 示範使用
const searchCriteria = {
  region: '法蘭西',
  type: '城鎮',
  facility: 'hasCathedral',
};
const result = filterLocations(medievalLocations, searchCriteria);

console.log('符合條件的地點:', result);
```
