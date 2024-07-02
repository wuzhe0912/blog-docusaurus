---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> 廣度優先搜尋演算法

請嘗試使用廣度優先搜尋法來遊歷英格蘭七國時代的城鎮

```js
const heptarchyTree = {
  value: 'England', // 英格蘭
  children: [
    {
      value: 'Northumbria', // 諾森布里亞王國
      children: [
        {
          value: 'Bamburgh', // 班布勒城
          children: [
            {
              value: 'Yeavering', // 耶瓦林莊園
              children: [],
            },
          ],
        },
        {
          value: 'Lindisfarne', // 林迪斯法恩
          children: [],
        },
      ],
    },
    {
      value: 'Mercia', // 麥西亞王國
      children: [
        {
          value: 'Tamworth', // 塔姆沃斯
          children: [],
        },
        {
          value: 'Repton', // 雷普頓
          children: [],
        },
      ],
    },
  ],
};

function travelThroughHeptarchy(heptarchyTree) {
  const scroll = []; // 使用羊皮紙紀錄訪問各地的順序
  scroll.push(heptarchyTree); // 將英格蘭作為起點加入羊皮紙

  // 當羊皮紙上還有城鎮時，繼續遊歷
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // 從羊皮紙上取下一個要訪問的王國或城鎮
    console.log(kingdom.value); // 記錄訪問的王國或城鎮名稱

    // 遊歷當前王國或城鎮的所有子區域，並將它們加入羊皮紙
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // 開始遊歷英格蘭七國時代的城鎮
```
