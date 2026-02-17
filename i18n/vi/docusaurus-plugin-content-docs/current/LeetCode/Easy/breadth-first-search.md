---
id: breadth-first-search
title: 📄 Breadth First Search(BFS)
slug: /breadth-first-search
---

## Question Description

> Thuật toán tìm kiếm theo chiều rộng

Hãy thử sử dụng tìm kiếm theo chiều rộng để duyệt qua các thị trấn của thời kỳ Thất Vương Quốc Anh

```js
const heptarchyTree = {
  value: 'England', // Anh Quốc
  children: [
    {
      value: 'Northumbria', // Vương quốc Northumbria
      children: [
        {
          value: 'Bamburgh', // Lâu đài Bamburgh
          children: [
            {
              value: 'Yeavering', // Trang viên Yeavering
              children: [],
            },
          ],
        },
        {
          value: 'Lindisfarne', // Lindisfarne
          children: [],
        },
      ],
    },
    {
      value: 'Mercia', // Vương quốc Mercia
      children: [
        {
          value: 'Tamworth', // Tamworth
          children: [],
        },
        {
          value: 'Repton', // Repton
          children: [],
        },
      ],
    },
  ],
};

function travelThroughHeptarchy(heptarchyTree) {
  const scroll = []; // Sử dụng cuộn giấy da để ghi lại thứ tự thăm viếng
  scroll.push(heptarchyTree); // Thêm Anh Quốc làm điểm xuất phát vào cuộn giấy da

  // Khi cuộn giấy da vẫn còn thị trấn, tiếp tục duyệt
  while (scroll.length > 0) {
    const kingdom = scroll.shift(); // Lấy vương quốc hoặc thị trấn tiếp theo cần thăm từ cuộn giấy da
    console.log(kingdom.value); // Ghi lại tên vương quốc hoặc thị trấn đã thăm

    // Duyệt tất cả các vùng con của vương quốc hoặc thị trấn hiện tại và thêm vào cuộn giấy da
    for (const child of kingdom.children) {
      scroll.push(child);
    }
  }
}

travelThroughHeptarchy(heptarchyTree); // Bắt đầu duyệt các thị trấn thời kỳ Thất Vương Quốc Anh
```
