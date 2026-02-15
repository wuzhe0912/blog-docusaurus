---
id: performance-lv2-js-optimization
title: '[Lv2] Toi uu hieu nang JavaScript: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Toi uu hieu nang JavaScript thong qua Debounce, Throttle, Time Slicing va requestAnimationFrame, nang cao trai nghiem nguoi dung.

---

## Boi canh van de

Trong du an platform, nguoi dung thuong xuyen thuc hien cac thao tac sau:

- **Tim kiem** (nhap tu khoa loc tuc thi trong 3000+ san pham)
- **Cuon danh sach** (theo doi vi tri va tai them khi cuon)
- **Chuyen danh muc** (loc hien thi theo loai san pham)
- **Hieu ung animation** (cuon muot, hieu ung qua tang)

Cac thao tac nay neu khong toi uu se gay giat trang va CPU chiem dung qua cao.

---

## Chien luoc 1: Debounce (chong rung) - Toi uu nhap tim kiem

```javascript
import { useDebounceFn } from '@vueuse/core';

// Ham debounce: neu nhap lai trong 500ms, dem lai tu dau
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // Chi thuc thi sau 500ms ngung nhap
  }
);
```

```md
Truoc toi uu: nhap "slot game" (9 ky tu)

- Kich hoat 9 lan tim kiem
- Loc 3000 game × 9 lan = 27,000 phep tinh
- Thoi gian: khoang 1.8 giay (trang giat)

Sau toi uu: nhap "slot game"

- Kich hoat 1 lan tim kiem (sau khi ngung nhap)
- Loc 3000 game × 1 lan = 3,000 phep tinh
- Thoi gian: khoang 0.2 giay
- Cai thien hieu nang: 90%
```

## Chien luoc 2: Throttle (giam tan) - Toi uu su kien cuon

> Truong hop ap dung: theo doi vi tri cuon, tai vo han

```javascript
import { throttle } from 'lodash';

// Ham throttle: trong 100ms chi thuc thi 1 lan
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
Truoc toi uu:

- Su kien scroll kich hoat 60 lan/giay (60 FPS)
- Moi lan kich hoat deu tinh toan vi tri cuon
- Thoi gian: khoang 600ms (trang giat)

Sau toi uu:

- Su kien scroll toi da 1 lan moi 100ms
- Thoi gian: khoang 100ms
- Cai thien hieu nang: 90%
```

## Chien luoc 3: Time Slicing (cat thoi gian) - Xu ly du lieu lon

> Truong hop ap dung: tag cloud, ket hop menu, loc 3000+ game, render lich su giao dich

```javascript
// Ham Time Slicing tuy chinh
function processInBatches(
  array: GameList, // 3000 game
  batchSize: number, // Moi lo xu ly 200
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // Xu ly xong

    const batch = array.slice(index, index + batchSize); // Cat lo
    callback(batch); // Xu ly lo nay
    index += batchSize;

    setTimeout(processNextBatch, 0); // Lo tiep theo dat vao hang doi
  }

  processNextBatch();
}
```

Vi du su dung:

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // Cat 3000 game thanh 15 lo, moi lo 200
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## Chien luoc 4: requestAnimationFrame - Toi uu animation

> Truong hop ap dung: cuon muot, animation Canvas, hieu ung qua tang

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // Su dung ham easing (Easing Function)
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      startPosition,
      -startPosition,
      duration
    );
    el.scrollTop = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll); // Goi de quy
    }
  };

  requestAnimationFrame(animateScroll);
};
```

Tai sao dung requestAnimationFrame?

```javascript
// Cach lam sai: dung setInterval
setInterval(() => {
  el.scrollTop += 10;
}, 16); // Muon 60fps (1000ms / 60 ≈ 16ms)
// Van de:
// 1. Khong dong bo voi render trinh duyet (co the thuc thi nhieu lan giua hai lan ve)
// 2. Van chay o tab an (lang phi tai nguyen)
// 3. Co the gay giat khung hinh (Jank)

// Cach lam dung: dung requestAnimationFrame
requestAnimationFrame(animateScroll);
// Uu diem:
// 1. Dong bo voi render trinh duyet (60fps hoac 120fps)
// 2. Tu dong dung khi tab khong hien thi (tiet kiem pin)
// 3. Muot hon, khong giat khung hinh
```

---

## Diem chinh phong van

### Debounce vs Throttle

| Dac diem       | Debounce                              | Throttle                              |
| -------------- | ------------------------------------- | ------------------------------------- |
| Thoi diem kich hoat | Sau khi ngung thao tac mot khoang thoi gian | Chi thuc thi 1 lan trong khoang thoi gian co dinh |
| Truong hop ap dung | Nhap tim kiem, resize cua so     | Su kien scroll, di chuyen chuot       |
| So lan thuc thi | Co the khong thuc thi (neu kich hoat lien tuc) | Dam bao thuc thi (tan suat co dinh) |
| Do tre         | Co do tre (doi ngung)                 | Thuc thi ngay, sau do gioi han        |

### Time Slicing vs Web Worker

| Dac diem         | Time Slicing                          | Web Worker                            |
| ---------------- | ------------------------------------- | ------------------------------------- |
| Moi truong thuc thi | Thread chinh                       | Thread nen                            |
| Truong hop ap dung | Nhiem vu can thao tac DOM          | Nhiem vu tinh toan thuan              |
| Do phuc tap trien khai | Don gian hon                     | Phuc tap hon (can giao tiep)          |
| Cai thien hieu nang | Tranh chan thread chinh            | Tinh toan song song thuc su           |

### Cau hoi phong van thuong gap

**Q: Chon Debounce hay Throttle nhu the nao?**

A: Theo truong hop su dung:

- **Debounce**: phu hop voi tinh huong "doi nguoi dung hoan thanh thao tac" (nhu nhap tim kiem)
- **Throttle**: phu hop voi tinh huong "can cap nhat lien tuc nhung khong qua thuong xuyen" (nhu theo doi cuon)

**Q: Chon Time Slicing hay Web Worker nhu the nao?**

A:

- **Time Slicing**: can thao tac DOM, xu ly du lieu don gian
- **Web Worker**: tinh toan thuan, xu ly du lieu lon, khong can DOM

**Q: Uu diem cua requestAnimationFrame la gi?**

A:

1. Dong bo voi render trinh duyet (60fps)
2. Tu dong dung khi tab khong hien thi (tiet kiem pin)
3. Khong giat khung hinh (Jank)
4. Hieu nang tot hon setInterval/setTimeout
