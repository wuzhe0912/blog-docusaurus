---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> 너비 우선 탐색 알고리즘

너비 우선 탐색을 사용하여 잉글랜드 칠왕국 시대의 도시를 순회해 보세요

```js
const heptarchyTree = {
  value: 'England', // 잉글랜드
  children: [
    {
      value: 'Northumbria', // 노섬브리아 왕국
      children: [
        {
          value: 'Bamburgh', // 밤버러 성
          children: [
            {
              value: 'Yeavering', // 예버링 장원
              children: [],
            },
          ],
        },
        {
          value: 'Lindisfarne', // 린디스판
          children: [],
        },
      ],
    },
    {
      value: 'Mercia', // 머시아 왕국
      children: [
        {
          value: 'Tamworth', // 탬워스
          children: [],
        },
        {
          value: 'Repton', // 렙턴
          children: [],
        },
      ],
    },
  ],
};

function travelThroughHeptarchy(heptarchyTree) {
  const scroll = []; // 양피지를 사용하여 각 지역 방문 순서를 기록
  scroll.push(heptarchyTree); // 잉글랜드를 시작점으로 양피지에 추가

  // 양피지에 아직 도시가 남아 있으면 계속 순회
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // 양피지에서 다음 방문할 왕국 또는 도시를 꺼냄
    console.log(kingdom.value); // 방문한 왕국 또는 도시 이름을 기록

    // 현재 왕국 또는 도시의 모든 하위 지역을 순회하고 양피지에 추가
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // 잉글랜드 칠왕국 시대 도시 순회 시작
```
