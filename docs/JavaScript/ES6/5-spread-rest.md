---
id: 5-spread-rest
description: 展開與其餘，寫法皆是 "..."
slug: /spread-rest
---

# Spread (展開) & Rest (其餘)

> 展開與其餘，寫法皆是 "..."。

## Spread Syntax(展開語法)

定義一個物件：

```javascript
const mobile = {
  name: 'android',
  year: '2021',
};
```

透過展開語法，複製到新的物件：

```javascript
const apple = {
  ...mobile,
  name: 'iphone',
  os: 'ios'
};
console.log(apple); // { name: "iphone", year: "2021", os: "ios" }
```

將原先的物件進行複製後，新增到新的物件中，如果兩者有重複的屬性時，新物件覆蓋掉舊物件相同屬性欄位。同樣的，展開語法也能用於複製陣列：

```javascript
const number = [1, 2, 3];
const newNumber = [...number, 3, 4, 5];
console.log(newNumber); // (6) [1, 2, 3, 3, 4, 5]
const list = ['a', 'b', 'c'];
const newList = [...list, 'c', 'd', 'e'];
console.log(newList); // (6) ["a", "b", "c", "c", "d", "e"]
```

陣列複製的結果，不會出現覆蓋的狀況，而是並存。

## Rest Syntax(其餘語法)

相比展開語法是解壓縮的概念，其餘語法則是壓縮。當解構時出取出部分資料，可以透過其餘語法，將剩下的欄位壓縮到一組變數中：

```javascript
const player = {
  name: 'Pitt',
  job: 'ranger',
  weapon: 'bow',
};
const { name, ...others } = player;
console.log(others); // {job: "ranger", weapon: "bow"}
```

同理也能運作在陣列上：

```javascript
const list = ['健達', '77乳加', '德芙', '特趣'];
const [ first, ...others ] = list;
console.log(others); // (3) ["77乳加", "德芙", "特趣"]
```
