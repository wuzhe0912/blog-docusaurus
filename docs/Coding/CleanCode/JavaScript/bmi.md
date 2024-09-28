---
id: clean-code-javascript-bmi
title: '🌰 I. BMI Calculator'
slug: /clean-code-javascript-bmi
tags: [Coding, Clean Code, JavaScript]
---

## Clean Code 介紹

> 此教學範例為六角 Clean Code 錄製試教影片任務，第一門試教課程講義(部分內容為方便個人口述進行調整)。

### [**3 Rs 程式架構**](https://github.com/ryanmcdermott/3rs-of-software-architecture)

- 可讀性（Readability）- 讓別人好讀你的程式碼
- 可重用性（Reusability）- 減少重複的程式碼
- 可重構性（Refactorability）
  - 模組化
  - 可維護性
  - 可擴展性

<details>
  <summary>💡 Tips</summary>
  1. 降低團隊開發上的合作成本。
  2. 降低自己未來的維護成本。
  3. 提升跟 AI 溝通的效率。
</details>

## 1. 變數

### 1-1. 使用具有意義且可閱讀的名稱

**糟糕的程式碼範例：**

這段程式碼中使用了 **`yyyymmdstr`** 這樣的變數名稱，這樣的命名方式雖然包含了一些日期格式的資訊，但對於閱讀者來說不夠直觀，也難以理解其真正含義。

```jsx
const yyyymmdstr = moment().format('YYYY/MM/DD');
```

**好的程式碼範例：**

這段程式碼改用了 **`currentDate`** 作為變數名稱，這樣的命名直接反映了這個變數儲存的是當前的日期，讓意圖更一目了然。

```jsx
const currentDate = moment().format('YYYY/MM/DD');
```

⭐️ 小練習：以此原則，請調整以下程式碼為更有意義且可閱讀的名稱

```jsx
1) const data = ['red', 'white', 'black'];

// 無法點擊的按鈕狀態
2) let status = 'disabled';

// 註冊時需填寫的資訊
3) let usr = {
account: '',
name: '',
psd: '',
}

4) let loading = false;

// bmi 公式
5) const result = w / (h / 100) **2;
```

<details>
  <summary>✅ Answer</summary>
  1. 聲明陣列代表的特性
```jsx
const availableColors = ['red', 'white', 'black'];
```
  2. 按鈕的狀態
```jsx
let buttonState = 'disabled';
```
  3. 根據使用的用途決定主要屬性，可能是 login 也可能是 register
```jsx
let userRegistrationInfo = {
  username: '',
  fullName: '',
  password: '',
};
  4. 讀取狀態
```jsx
let isLoading = false;
```
  5. 要根據使用情境，明確指出變數的名稱
```jsx
const bmiResult = weight / ((height / 100) ** 2);
```
</details>

### 1-2. 使用可搜尋的名稱

**糟糕的程式碼範例：**

在這個範例中，使用了一個不清楚的常數 **`1.07`**，代表了某種計算中的倍數或者增加的百分比，但這個數字本身並沒有清楚表達具體含義。

```jsx
function calculateTotal(price) {
  return price * 1.07; // 假設 1.07 代表含稅價格
}
```

**好的程式碼範例：**

在改進後的範例中，我們使用 `taxRate` 設定為 **`0.07`**，以表示稅率為 7%。然後在計算總金額時使用這個常數。這樣做可以讓後續閱讀程式碼的開發者更容易理解他的意圖和功能，並且在需要查找特定用途時更方便。

```jsx
const taxRate = 0.07;

function calculateTotal(price) {
  return price * (1 + taxRate); // 使用常數使計算含稅價格更清楚
}
```

<details>
  <summary>💡 Tips</summary>
  - 專案開發的過程中，可能為了因應市場變動，需求會頻繁更迭，將特殊的規定或需求抽離，並命名為合適的變數，有助於後續開發時能快速閱讀與理解。
</details>

⭐️ 小練習：以此原則，請調整以下程式碼為可搜尋的名稱

```jsx
// 0.5 秒後頁面重整

setTimeout(() => {
  window.location.reload();
}, 500);
```

<details>
  <summary>✅ Answer</summary>
1. 建立一個常數`PAGE_RELOAD_DELAY_MS`，並將其設定為 500 毫秒，同時將名稱標示它的用途。
2. 建立一個函式`reloadPageAfterDelay`，並在名稱上就指名其用途，並將整個功能邏輯封裝載這個函式中。
3. 最終滿足可讀性，可維護性與易搜索，如果其他地方需要使用，也能直接呼叫這個函式。

```jsx
const PAGE_RELOAD_DELAY_MS = 500;

function reloadPageAfterDelay() {
  setTimeout(() => {
    window.location.reload();
  }, PAGE_RELOAD_DELAY_MS);
}

reloadPageAfterDelay();
```

</details>

### 1-3. 使用可解釋的變數

**糟糕的程式碼範例：**

在這個例子中，雖然這段程式碼是正確的，但 **`x`** 和 **`y`** 並沒有提供足夠的上下文來解釋它們代表的具體含義，這使得理解真正意圖變得困難。

```jsx
const data = [
  { x: 10, y: 20 },
  { x: 20, y: 30 },
];
let result = [];

data.forEach((item) => {
  result.push(item.x * item.y);
});
```

**好的程式碼範例：**

在改進後的例子中，我們通過更具描述性的變數名稱來明確每個屬性的含義

```jsx
const orders = [
  { quantity: 10, unitPrice: 20 },
  { quantity: 20, unitPrice: 30 },
];
let totalCosts = [];

orders.forEach((order) => {
  totalCosts.push(order.quantity * order.unitPrice);
});
```

⭐️ 小練習：以此原則，請調整以下程式碼為可解釋的名稱

```jsx
// 九九乘法表
const size = 9;
for (let i = 1; i <= size; i++) {
  let row = '';
  for (let j = 1; j <= size; j++) {
    row += `${i} * ${j} = ${i * j}\\t`;
  }
  console.log(row);
}

英文單字提示：multiplier 表示乘數，multiplicand 表示被乘數，product 代表乘積
```

<details>
  <summary>✅ Answer</summary>
1. size 改為 `MULTIPLICATION_TABLE_SIZE`：
   - 使用全大寫表示這是一個常數。
   - 名稱更明確地表示這是乘法表的大小。
2. 新增 `TAB_SEPARATOR` 常數：
   - 將 \t 提取為一個命名常數，增加可讀性和可維護性。
3. `i` 改為 `multiplier`：
   - 使用 `multiplier`（乘數）更清楚地表示外層迴圈的作用。
4. `j` 改為 `multiplicand`：
   - 使用 `multiplicand`（被乘數）更清楚地表示內層迴圈的作用。
5. `row` 改為 `multiplicationRow`：
   - 更具體地描述這個變數代表乘法表的一行。
6. 新增 `product` 變數：
   - 使用 `product`（乘積）來存儲計算結果，增加可讀性。

```jsx
const MULTIPLICATION_TABLE_SIZE = 9;
const TAB_SEPARATOR = '\t';

for (
  let multiplier = 1;
  multiplier <= MULTIPLICATION_TABLE_SIZE;
  multiplier++
) {
  let multiplicationRow = '';
  for (
    let multiplicand = 1;
    multiplicand <= MULTIPLICATION_TABLE_SIZE;
    multiplicand++
  ) {
    const product = multiplier * multiplicand;
    multiplicationRow += `${multiplier} * ${multiplicand} = ${product}${TAB_SEPARATOR}`;
  }
  console.log(multiplicationRow);
}
```

</details>

## 2. 函式

### 2-1. 一個函式只做一件事情（單一性）

**糟糕的程式碼範例：**

這個範例中`createUserProfile` 函式負責四件事：

1. 處理用戶名稱的空白
2. 檢查名稱長度
3. 解析和驗證年齡
4. 檢查電子郵件格式

這樣混合了太多責任的設計使得函式難以閱讀和維護，也增加了錯誤發生的機會。當一個函式做超過一件事情時，它會更難以被理解。

```jsx
// 建立用戶檔案，包含資料驗證和錯誤處理
function createUserProfile(userDetails) {
  const name = userDetails.name.trim(); // 正規化名字
  if (name.length < 2) {
    console.log('錯誤：名稱至少需兩個字元長。');
    return;
  }

  const age = parseInt(userDetails.age); // 轉換年齡
  if (isNaN(age) || age < 18) {
    console.log('錯誤：您至少需要18歲。');
    return;
  }

  if (!userDetails.email.includes('@')) {
    // 驗證電子郵件
    console.log('錯誤：無效的電子郵件地址。');
    return;
  }

  console.log('用戶檔案創建成功。'); // 成功訊息
}

// 使用範例
createUserProfile({
  name: '張三',
  age: '19',
  email: 'zhangsan@example.com',
});
```

**好的程式碼範例：**

在這個重構的範例中，將功能拆分成更小的部分，每個函式專注於一個任務，提升了程式碼的清晰度和可維護性：

```jsx
// 建立用戶檔案，包含資料驗證和錯誤處理
// 去除名稱中的前後空白
function trimName(name) {
  return name.trim();
}

// 驗證名稱至少需要兩個字元
function isNameValid(name) {
  return name.length >= 2;
}

// 解析並驗證年齡，確認其為合法數字且至少為 18 歲
function parseAndValidateAge(age) {
  const parsedAge = parseInt(age);
  return !isNaN(parsedAge) && parsedAge >= 18;
}

// 確認電子郵件格式是否包含 '@' 符號
function isEmailValid(email) {
  return email.includes('@');
}

// 處理創建用戶檔案的整個過程
function createUserProfile(name, age, email) {
  const normalizedName = trimName(name);
  if (!isNameValid(normalizedName)) {
    console.log('錯誤：名稱至少需兩個字元長。');
    return;
  }

  if (!parseAndValidateAge(age)) {
    console.log('錯誤：您至少需要18歲。');
    return;
  }

  if (!isEmailValid(email)) {
    console.log('錯誤：無效的電子郵件地址。');
    return;
  }

  console.log('用戶檔案創建成功。');
}
```

⭐️ 小練習：以此原則，請調整以下程式碼，保持函式的單一性

```jsx
function manageTodoList(todoList) {
  // 更新待辦事項清單
  todoList.forEach((todo, index) => {
    if (!todo.completed) {
      todo.completed = true;
    }
  });
  // 通知用戶
  console.log('已完成的待辦事項清單：', todoList);
}
```

<details>
  <summary>✅ Answer</summary>
  1. 將每個執行動作的函式進行分離。
  2. 並且明確命名每個函式的功能。

```jsx
function completeTodoList(todoList) {
  const updatedTodo = {
    text: todo.text,
    completed: true,
  };
  return updatedTodo;
}

// 更新整個待辦事項清單
function updateTodoList(todoList) {
  return todoList.map((todo) => (todo.completed ? todo : completeTodo(todo)));
}

// 取得已完成的待辦事項清單
function getCompletedTodoList(todoList) {
  return todoList.filter((todo) => todo.completed);
}

// 管理所有子函式的父函式
function manageTodoList(todoList) {
  const updatedTodoList = updateTodoList(todoList);
  const completeTodoList = getCompletedTodoList(updatedTodoList);
  notifyUser(completeTodoList);
  return updatedTodoList;
}
```

</details>

### 2-2. 函式名稱應該說明它做的內容

**糟糕的程式碼範例：**

在這個例子中，函式名稱 `updateInfo`，描述函式的功能不明確，update 會覺得是要更新某個資訊，但也無法得知要更新什麼資訊

```jsx
function updateInfo(info, data) {
  // 函式內容...
}
```

**好的程式碼範例：**

在這個重構後的程式碼中，將函式名稱從`updateInfo`改為`mergeInfoWithNewData`，更清楚地表明了函式的功能，其實是要將現有資訊與新資料進行合併。這樣的命名方式使得程式碼更容易理解。

```jsx
function mergeInfoWithNewData(existingInfo, newData) {
  // 函式內容...
}
```

補充：建議函式命名以動詞開頭，有許多業界常用的字詞可以當作優先選擇

- get: 取得、取出
- set: 賦予、修改
- add: 增加
- remove: 排除
- is: 判定
- do: 執行邏輯

## 2-3. 移除重複的程式碼

**糟糕的程式碼範例：**

兩個函式分別計算了電子產品和服裝的折扣價格，但計算邏輯大部分是一樣的，增加了程式碼的冗長度。如果未來需要增加更多類型的商品並計算其折扣價格，就需要再次複製貼上類似的函式，只會增加更多的重複性。

```jsx
function calculateElectronicsDiscount(price) {
  const discountPercentage = 0.1; // 電子產品的折扣率為10%
  return price * (1 - discountPercentage);
}

function calculateClothingDiscount(price) {
  const discountPercentage = 0.2; // 服裝的折扣率為20%
  return price * (1 - discountPercentage);
}
```

**好的程式碼範例：**

將兩個函式中重複的部分抽取出來，並將可變的部分作為參數。

```jsx
function calculateDiscount(price, discountPercentage) {
  return price * (1 - discountPercentage);
}

const electronicsDiscountedPrice = calculateDiscount(price, 0.1);

const clothingDiscountedPrice = calculateDiscount(price, 0.2);
```

⭐️ 小練習：以此原則，請調整以下程式碼，提取重複內容管理

```jsx
function printInfo(person) {
  console.log(`Name: ${person.name}`);
  console.log(`Age: ${person.age}`);
}

function printStudentInfo(student) {
  console.log(`Name: ${student.name}`);
  console.log(`Age: ${student.age}`);
  console.log(`Major: ${student.major}`);
}
```

<details>
  <summary>✅ Answer</summary>
  1. 重複的 `Name` 和 `Age` 是否可以將其提取為函式？
  2. 如果可以，將其提取為函式，並命名為 `printBasicInfo`。
  3. 並且在獨立針對額外訊息 `Major` 建立處理用的函式 `printExtraInfo`。

```jsx
function printBasicInfo(person) {
  console.log(`Name: ${person.name}`);
  console.log(`Age: ${person.age}`);
}

function printExtraInfo(person) {
  console.log(`Major: ${person.major}`);
}

function printInfo(person) {
  printBasicInfo(person);
}

function printStudentInfo(student) {
  printBasicInfo(student);
  printExtraInfo(student);
}

const person = {
  name: 'Pitt',
  age: 18,
};

const student = {
  name: 'Alyssa',
  age: 19,
  major: 'Computer Science',
};

printInfo(person);
printStudentInfo(student);
```

</details>

## **3. BMI 計算機 Clean Code 版本**

### [3-1. LV3 範例(待優化版本)](https://codepen.io/hexschool/pen/VwmGZBd?editors=0010)

**結合 Clean Code 規範，發展出更好的程式碼**

**函式命名：對應 Clean Code 原則「函式名稱應該說明它做的內容」**

`bmiStatesText`→ `printBmiResult` 並用動詞開頭

**判斷可以簡化：對應 Clean Code 原則「移除重複的程式碼」**

`18.5 <= bmi && bmi < 24`→ `bmi < 24`

**提出重複的程式碼：對應 Clean Code 原則「移除重複的程式碼」**

`addData` 幾乎每個判斷都重寫一次，可以拿出來放在判斷結束的下方執行

**提取變數：對應 Clean Code 原則「使用具有意義且可閱讀的名稱」**

`totalNum` → `totalRecord` 可以看出是記錄總量

`lastNum` → `lastRecord` 可以看出是最後一筆紀錄

```jsx
const totalRecord = bmiHistoryData.length;
const lastRecord = totalRecord - 1;
const lastState = bmiHistoryData[lastRecord].state;

console.log(
  `您總共計算 ${totalRecord} 次 BMI 紀錄，最後一次 BMI 指數為 ${bmiHistoryData[lastRecord].bmi}，體重${bmiStatesData[lastState].state}！健康指數為${bmiStatesData[lastState].color}！`
);
```

### [3-2. 常見解法範例程式碼](https://codepen.io/hexschool/pen/NWZgREV?editors=1011)

一開始自己寫完的 LV3，大概會長這樣：

- 只會依照題目要求拆出 `printBmi` 和 `showHistoryData` 兩個函式
- `printBmi` 函式內容很長

```jsx
const bmiStatesData = {
  overThin: {
    state: '過輕',
    color: '藍色',
  },
  normal: {
    state: '正常',
    color: '紅色',
  },
  overWeight: {
    state: '過重',
    color: '澄色',
  },
  mildFat: {
    state: '輕度肥胖',
    color: '黃色',
  },
  moderateFat: {
    state: '中度肥胖',
    color: '黑色',
  },
  severeFat: {
    state: '重度肥胖',
    color: '綠色',
  },
};
let records = [];

function printBmi(height, weight) {
  const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);

  let state = '';
  if (bmi < 18.5) {
    state = 'overThin';
  } else if (bmi < 24) {
    state = 'normal';
  } else if (bmi < 27) {
    state = 'overWeight';
  } else if (bmi < 30) {
    state = 'mildFat';
  } else if (bmi < 35) {
    state = 'moderateFat';
  } else if (bmi >= 35) {
    state = 'severeFat';
  }

  if (!state) {
    return '您的數值輸入錯誤，請重新輸入';
  }

  records.push({
    bmi: bmi,
    state: bmiStatesData[state].state,
    color: bmiStatesData[state].color,
  });

  return `您的體重${bmiStatesData[state].state}，健康指數為${bmiStatesData[state].color}`;
}

function showHistoryData() {
  return `您總共計算 ${records.length} 次 BMI 紀錄，最後一次 BMI 指數為 ${
    records[records.length - 1].bmi
  }，體重${records[records.length - 1].state}！健康指數為${
    records[records.length - 1].color
  }！`;
}

// 以下需一行一行執行
printBmi(178, 20); // 您的體重過輕，健康指數為藍色
printBmi(178, 70); // 您的體重正常，健康指數為紅色
printBmi(178, 85); // 您的體重過重，健康指數為澄色

showHistoryData(); // 您總共計算 3 次 BMI 紀錄，最後一次 BMI 指數為 26.83，體重過重！健康指數為澄色！
```

**為什麼這段程式碼還不夠好？**

多運用函式的優點，找出更合適的寫法：

1. ✅ （已做到）可重用性：因需要重複計算不同人的 BMI，因此會將 BMI 計算功能封裝在一個函式中重複利用，而不需要重複寫計算 BMI 邏輯，只要呼叫函式即可
2. 增加可讀性：函式因為模組化將功能獨立出來，讓整體結構更清晰，閱讀也會更容易理解和維護
3. 可重構性：讓程式碼方便維護，好擴展

**分析 BMI 功能，將程式碼做模組化並提高可讀性**

```jsx
第三階段：儲存每筆計算資料，多一個變數為 bmiHistoryData，並賦予空陣列來儲存計算物件資料，若數值輸入錯誤，則不儲存。

printBmi(178, 20) >> 印出 console.log 文字為「您的體重過輕，健康指數為藍色」
printBmi(178, 70) >> 印出 console.log 文字為「您的體重正常，健康指數為紅色」
printBmi(178, 85)>> 印出 console.log 文字為「您的體重過重，健康指數為澄色」

showHistoryData() >> 印出 console.log 文字為「您總共計算 3 次 BMI 紀錄，最後一次 BMI 指數為 26.83，體重過重！健康指數為澄色！」
```

如何規劃函式模組化？依照單一功能去發想：

- 計算 BMI 值 → `calculateBMI`
- 印出「您的體重 xx，健康指數為 xx」文字 → `printBmi`
- 條件判斷 BMI 結果是在哪個狀態 → `getBMIState`
- 將每次結果記錄下來 → `addRecord`
- 印出歷史紀錄 → `showHistoryData`

**實作功能拆分 → 對應 Clean Code 原則「一個函式只做一件事情」**

<details>
  <summary>✅ Answer</summary>
  1. 函式命名：保持清晰明確。
  2. 判斷邏輯：維持使用簡單的 `if-else` 結構，處理 BMI 更容易理解。
  3. 程式架構：保持每個函式單一職責特性。
  4. 變數命名：使用具有描述性的名稱 `BMI_CATEGORIES`、`records`。
  5. 錯誤處理：`printBMI()` 添加簡單的輸入驗證。
  6. 高複用性：通過 `BMI_CATEGORIES` 物件重用 BMI 類別的資訊。

```jsx
// 定義 BMI 類別常數
const BMI_CATEGORIES = {
  overThin: { state: '過輕', color: '藍色' },
  normal: { state: '正常', color: '紅色' },
  overWeight: { state: '過重', color: '澄色' },
  mildFat: { state: '輕度肥胖', color: '黃色' },
  moderateFat: { state: '中度肥胖', color: '黑色' },
  severeFat: { state: '重度肥胖', color: '綠色' },
};

// init BMI record array
const records = [];

// 計算 BMI 值
function calculateBMI(height, weight) {
  // 使用 BMI 公式：體重(kg) / (身高(m)的平方)
  // 將身高從公分轉換為公尺，並四捨五入到小數點後兩位
  return (weight / (height / 100) ** 2).toFixed(2);
}

// 根據 BMI 值判斷體重狀態
function getBMIState(bmi) {
  // 使用 if-else 結構來判斷 BMI 落在哪個區間
  if (bmi < 18.5) return 'overThin';
  if (bmi < 24) return 'normal';
  if (bmi < 27) return 'overWeight';
  if (bmi < 30) return 'mildFat';
  if (bmi < 35) return 'moderateFat';
  return 'severeFat';
}

// 新增 BMI 紀錄到歷史資料中
function addRecord(bmi, category) {
  // 將新的 BMI 紀錄推入 records 陣列
  records.push({
    bmi: bmi,
    state: BMI_CATEGORIES[category].state,
    color: BMI_CATEGORIES[category].color,
  });
}

// 主要的 BMI 計算和輸出函式
function printBMI(height, weight) {
  // 檢查輸入是否有效
  if (height <= 0 || weight <= 0) {
    return '身高和體重必須為正數';
  }

  // 計算 BMI
  const bmi = calculateBMI(height, weight);
  // 取得 BMI 對應的狀態類別
  const category = getBMIState(bmi);

  // 將本次計算結果加入紀錄
  addRecord(bmi, category);

  // 回傳結果
  return `您的體重${BMI_CATEGORIES[category].state}，健康指數為${BMI_CATEGORIES[category].color}`;
}

// 顯示 BMI 計算歷史紀錄
function showHistoryData() {
  // 檢查是否有歷史紀錄
  if (records.length === 0) {
    return '目前沒有 BMI 紀錄';
  }

  // 取得最後一次 BMI 紀錄
  const lastRecord = records[records.length - 1];
  // 回傳歷史資料摘要
  return `您總共計算 ${records.length} 次 BMI 紀錄，最後一次 BMI 指數為 ${lastRecord.bmi}，體重${lastRecord.state}！健康指數為${lastRecord.color}！`;
}

// example usage
console.log(printBMI(170, 60)); // 計算並輸出正常 BMI
console.log(printBMI(180, 70)); // 計算並輸出肥胖 BMI
console.log(showHistoryData()); // 顯示歷史資料摘要
```

</details>
