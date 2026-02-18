---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> Breadth-First Search Algorithm

Use Breadth-First Search to traverse the towns of the Anglo-Saxon Heptarchy in England.

```js
const heptarchyTree = {
  value: 'England',
  children: [
    {
      value: 'Northumbria',
      children: [
        {
          value: 'Bamburgh',
          children: [
            {
              value: 'Yeavering',
              children: [],
            },
          ],
        },
        {
          value: 'Lindisfarne',
          children: [],
        },
      ],
    },
    {
      value: 'Mercia',
      children: [
        {
          value: 'Tamworth',
          children: [],
        },
        {
          value: 'Repton',
          children: [],
        },
      ],
    },
  ],
};

function travelThroughHeptarchy(heptarchyTree) {
  const scroll = []; // Use a scroll to record the order of visited locations
  scroll.push(heptarchyTree); // Add England as the starting point to the scroll

  // While there are still towns on the scroll, continue traveling
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // Take the next kingdom or town from the scroll
    console.log(kingdom.value); // Record the name of the visited kingdom or town

    // Visit all sub-regions of the current kingdom or town, adding them to the scroll
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // Begin traveling through the towns of the Anglo-Saxon Heptarchy
```
