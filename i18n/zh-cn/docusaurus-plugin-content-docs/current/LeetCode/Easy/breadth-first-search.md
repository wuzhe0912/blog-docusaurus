---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> 广度优先搜索算法

请尝试使用广度优先搜索法来遍历英格兰七国时代的城镇

```js
const heptarchyTree = {
  value: 'England', // 英格兰
  children: [
    {
      value: 'Northumbria', // 诺森布里亚王国
      children: [
        {
          value: 'Bamburgh', // 班布勒城
          children: [
            {
              value: 'Yeavering', // 耶瓦林庄园
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
      value: 'Mercia', // 麦西亚王国
      children: [
        {
          value: 'Tamworth', // 塔姆沃斯
          children: [],
        },
        {
          value: 'Repton', // 雷普顿
          children: [],
        },
      ],
    },
  ],
};

function travelThroughHeptarchy(heptarchyTree) {
  const scroll = []; // 使用羊皮纸记录访问各地的顺序
  scroll.push(heptarchyTree); // 将英格兰作为起点加入羊皮纸

  // 当羊皮纸上还有城镇时，继续遍历
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // 从羊皮纸上取下一个要访问的王国或城镇
    console.log(kingdom.value); // 记录访问的王国或城镇名称

    // 遍历当前王国或城镇的所有子区域，并将它们加入羊皮纸
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // 开始遍历英格兰七国时代的城镇
```
