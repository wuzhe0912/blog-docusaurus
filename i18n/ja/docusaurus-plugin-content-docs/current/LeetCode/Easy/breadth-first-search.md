---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> 幅優先探索アルゴリズム

幅優先探索を使って、イングランド七王国時代の町を巡ってみましょう

```js
const heptarchyTree = {
  value: 'England', // イングランド
  children: [
    {
      value: 'Northumbria', // ノーサンブリア王国
      children: [
        {
          value: 'Bamburgh', // バンバラ城
          children: [
            {
              value: 'Yeavering', // イーヴァリング荘園
              children: [],
            },
          ],
        },
        {
          value: 'Lindisfarne', // リンディスファーン
          children: [],
        },
      ],
    },
    {
      value: 'Mercia', // マーシア王国
      children: [
        {
          value: 'Tamworth', // タムワース
          children: [],
        },
        {
          value: 'Repton', // レプトン
          children: [],
        },
      ],
    },
  ],
};

function travelThroughHeptarchy(heptarchyTree) {
  const scroll = []; // 羊皮紙を使って各地の訪問順序を記録
  scroll.push(heptarchyTree); // イングランドを出発点として羊皮紙に追加

  // 羊皮紙にまだ町がある間、巡り続ける
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // 羊皮紙から次に訪問する王国や町を取り出す
    console.log(kingdom.value); // 訪問した王国や町の名前を記録

    // 現在の王国や町のすべての子地域を巡り、羊皮紙に追加する
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // イングランド七王国時代の町の巡回を開始
```
