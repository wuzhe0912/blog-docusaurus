---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> Tai sao JavaScript can xu ly bat dong bo? Va hay giai thich callback va event loop

Ban chat cua JavaScript la ngon ngu don luong (single-thread), vi mot trong nhung nhiem vu cua no la thao tac cau truc DOM cua trinh duyet. Neu da luong dong thoi sua doi cung mot node, tinh huong se tro nen rat phuc tap. De tranh dieu nay, don luong duoc ap dung.

Xu ly bat dong bo la mot giai phap kha thi trong boi canh don luong. Gia su mot thao tac can doi 2 giay, trinh duyet khong the dung yen cho 2 giay. Vi vay, no se thuc hien tat ca cac cong viec dong bo truoc, con cac cong viec bat dong bo duoc dat vao task queue (hang doi tac vu).

Moi truong noi trinh duyet thuc hien cong viec dong bo co the hieu la call stack. Trinh duyet thuc hien tuan tu cac tac vu trong call stack. Khi phat hien call stack trong, no lay cac tac vu dang cho tu task queue va dat vao call stack de thuc hien tuan tu.

1. Trinh duyet kiem tra call stack co trong khong => Khong => Tiep tuc thuc hien tac vu trong call stack
2. Trinh duyet kiem tra call stack co trong khong => Co => Kiem tra task queue co tac vu dang cho khong => Co => Chuyen vao call stack de thuc hien

Qua trinh lap di lap lai nay chinh la khai niem event loop.

```js
console.log(1);

// 這個非同步的函式就是 callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// 依序印出 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> Tai sao `setInterval` khong chinh xac ve mat thoi gian?

1. Do JavaScript la ngon ngu don luong (chi co the thuc hien mot tac vu tai mot thoi diem, cac tac vu khac phai cho trong Queue), khi thoi gian thuc hien callback cua setInterval vuot qua khoang thoi gian da thiet lap, lan thuc hien tiep theo se bi tre. Vi du, neu setInterval duoc thiet lap de thuc hien ham moi giay, nhung mot thao tac trong ham mat 2 giay, lan thuc hien tiep theo se bi tre 1 giay. Tich luy dan, setInterval se ngay cang khong chinh xac.

2. Trinh duyet hoac moi truong chay cung gioi han. Trong hau het cac trinh duyet chinh (Chrome, Firefox, Safari, v.v.), khoang thoi gian toi thieu la khoang 4 mili giay. Du thiet lap 1 mili giay, thuc te chi thuc hien moi 4 mili giay.

3. Khi he thong thuc hien cac tac vu ton nhieu bo nho hoac CPU, cung gay ra tre. Cac thao tac nhu chinh sua video hoac xu ly hinh anh co kha nang cao gay tre.

4. JavaScript co co che Garbage Collection. Neu trong ham setInterval tao nhieu object ma khong duoc su dung sau khi thuc hien, chung se bi GC thu hoi, dieu nay cung gay tre thoi gian thuc hien.

### Phuong an thay the

#### requestAnimationFrame

Neu hien tai su dung `setInterval` de trien khai animation, co the xem xet su dung `requestAnimationFrame` thay the.

- Dong bo voi repaint cua trinh duyet: Thuc hien khi trinh duyet san sang ve frame moi. Chinh xac hon nhieu so voi viec doan thoi diem repaint bang setInterval hoac setTimeout.
- Hieu suat: Vi dong bo voi repaint, no khong chay khi trinh duyet cho rang khong can repaint. Tiet kiem tai nguyen tinh toan, dac biet khi tab khong duoc focus hoac bi thu nho.
- Tu dong dieu tiet: Tu dong dieu chinh tan suat thuc hien theo thiet bi va tinh huong, thuong la 60 frame moi giay.
- Tham so thoi gian do chinh xac cao: Co the nhan tham so thoi gian do chinh xac cao (kieu DOMHighResTimeStamp, chinh xac den micro giay) de kiem soat animation hoac cac thao tac nhay cam voi thoi gian chinh xac hon.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // 如果元素還沒有到達目的地，繼續動畫
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` cap nhat vi tri phan tu o moi frame (thuong la 60 frame moi giay) cho den khi dat 500 pixel. Phuong phap nay tao hieu ung animation muot ma va tu nhien hon so voi `setInterval`.
