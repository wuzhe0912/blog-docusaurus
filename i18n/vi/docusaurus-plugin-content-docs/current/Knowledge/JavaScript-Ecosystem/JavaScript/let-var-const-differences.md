---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Tong quan

Trong JavaScript co ba tu khoa de khai bao bien: `var`, `let` va `const`. Mac du chung deu dung de khai bao bien, nhung chung khac nhau ve pham vi, khoi tao, khai bao trung lap, gan lai va thoi diem truy cap.

## Nhung khac biet chinh

| Hanh vi              | `var`                       | `let`                | `const`              |
| -------------------- | --------------------------- | -------------------- | -------------------- |
| Pham vi              | Ham hoac toan cuc           | Khoi                 | Khoi                 |
| Khoi tao             | Tuy chon                    | Tuy chon             | Bat buoc             |
| Khai bao trung lap   | Cho phep                    | Khong cho phep       | Khong cho phep       |
| Gan lai              | Cho phep                    | Cho phep             | Khong cho phep       |
| Truy cap truoc khai bao | Tra ve undefined         | Nem ReferenceError   | Nem ReferenceError   |

## Giai thich chi tiet

### Pham vi

Pham vi cua `var` la pham vi ham hoac toan cuc, trong khi `let` va `const` co pham vi khoi (bao gom ham, khoi if-else hoac vong lap for).

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### Khoi tao

`var` va `let` co the khai bao ma khong can khoi tao, trong khi `const` bat buoc phai khoi tao khi khai bao.

```javascript
var varVariable;  // Hop le
let letVariable;  // Hop le
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### Khai bao trung lap

Trong cung mot pham vi, `var` cho phep khai bao trung lap cung mot bien, trong khi `let` va `const` khong cho phep.

```javascript
var x = 1;
var x = 2; // Hop le, x bay gio bang 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Gan lai

Bien duoc khai bao voi `var` va `let` co the gan lai, nhung bien khai bao voi `const` khong the gan lai.

```javascript
var x = 1;
x = 2; // Hop le

let y = 1;
y = 2; // Hop le

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Luu y: Mac du bien khai bao voi `const` khong the gan lai, nhung neu no la mot object hoac array, noi dung cua no van co the thay doi.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // Hop le
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // Hop le
console.log(arr); // [1, 2, 3, 4]
```

### Truy cap truoc khai bao (Temporal Dead Zone)

Bien khai bao voi `var` duoc dua len va tu dong khoi tao thanh `undefined`. Bien khai bao voi `let` va `const` cung duoc dua len nhung khong duoc khoi tao, truy cap truoc khai bao se nem `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Cau hoi phong van

### De bai: Bay co dien cua setTimeout + var

Hay xac dinh ket qua dau ra cua doan code sau:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Dap an sai (hieu nham pho bien)

Nhieu nguoi cho rang dau ra la: `1 2 3 4 5`

#### Ket qua thuc te

```
6
6
6
6
6
```

#### Tai sao?

Van de nay lien quan den ba khai niem cot loi:

**1. Pham vi ham cua var**

```javascript
// var khong tao pham vi khoi trong vong lap
for (var i = 1; i <= 5; i++) {
  // i nam o pham vi ngoai, tat ca cac lan lap deu chia se cung mot i
}
console.log(i); // 6 (gia tri cua i sau khi vong lap ket thuc)

// Truong hop var
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // vong lap ket thuc
}
```

**2. Thuc thi bat dong bo cua setTimeout**

```javascript
// setTimeout la bat dong bo, thuc thi sau khi code dong bo hien tai chay xong
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Code nay duoc dat vao hang doi tac vu cua Event Loop
    console.log(i);
  }, 0);
}
// Vong lap chay xong truoc (i tro thanh 6), sau do cac callback cua setTimeout moi bat dau thuc thi
```

**3. Tham chieu Closure**

```javascript
// Tat ca cac ham callback cua setTimeout deu tham chieu cung mot i
// Khi cac callback thuc thi, i da tro thanh 6
```

#### Giai phap

**Giai phap 1: Su dung let (khuyen dung) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// Dau ra: 1 2 3 4 5

// Truong hop let
{
  let i = 1; // i cua lan lap thu nhat
}
{
  let i = 2; // i cua lan lap thu hai
}
{
  let i = 3; // i cua lan lap thu ba
}
```

**Nguyen ly**: `let` tao mot pham vi khoi moi o moi lan lap, moi callback `setTimeout` bat duoc gia tri `i` cua lan lap hien tai.

```javascript
// Tuong duong voi
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ... tuong tu
```

**Giai phap 2: Su dung IIFE (Ham Thuc Thi Ngay Lap Tuc)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// Dau ra: 1 2 3 4 5
```

**Nguyen ly**: IIFE tao mot pham vi ham moi, moi lan lap deu truyen gia tri `i` hien tai lam tham so `j`, hinh thanh Closure.

**Giai phap 3: Su dung tham so thu ba cua setTimeout**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // Tham so thu ba duoc truyen cho ham callback
}
// Dau ra: 1 2 3 4 5
```

**Nguyen ly**: Tham so thu ba va cac tham so tiep theo cua `setTimeout` duoc truyen lam doi so cho ham callback.

**Giai phap 4: Su dung bind**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// Dau ra: 1 2 3 4 5
```

**Nguyen ly**: `bind` tao mot ham moi va rang buoc gia tri `i` hien tai lam tham so.

#### So sanh cac giai phap

| Giai phap           | Uu diem                          | Nhuoc diem           | Muc khuyen dung           |
| ------------------- | -------------------------------- | -------------------- | ------------------------- |
| `let`               | Gon, hien dai, de hieu           | ES6+                 | 5/5 Rat khuyen dung       |
| IIFE                | Tuong thich tot                  | Cu phap phuc tap     | 3/5 Co the xem xet        |
| Tham so setTimeout  | Don gian, truc tiep              | It nguoi biet        | 4/5 Khuyen dung            |
| `bind`              | Phong cach ham                   | Doc hoi kho hon      | 3/5 Co the xem xet        |

#### Cau hoi mo rong

**Q1: Neu doi thanh the nay thi sao?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Dap an**: Moi giay xuat ra `6` mot lan, tong cong 5 lan (lan luot tai giay thu 1, 2, 3, 4, 5).

**Q2: Neu muon xuat ra 1, 2, 3, 4, 5 theo thu tu moi giay thi sao?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Sau 1 giay xuat ra 1
// Sau 2 giay xuat ra 2
// Sau 3 giay xuat ra 3
// Sau 4 giay xuat ra 4
// Sau 5 giay xuat ra 5
```

#### Trong diem phong van

Cau hoi nay kiem tra:

1. **Pham vi cua var**: Pham vi ham vs pham vi khoi
2. **Event Loop**: Thuc thi dong bo vs bat dong bo
3. **Closure**: Ham bat bien ben ngoai nhu the nao
4. **Giai phap**: Nhieu cach giai va so sanh uu nhuoc diem

Khi tra loi nen:

- Noi dap an dung truoc (6 6 6 6 6)
- Giai thich ly do (pham vi var + setTimeout bat dong bo)
- Dua ra giai phap (uu tien let va giai thich cac phuong an khac)
- The hien su hieu biet ve co che ben trong cua JavaScript

## Best practice

1. Uu tien su dung `const`: Voi nhung bien khong can gan lai, su dung `const` giup tang kha nang doc va bao tri code.
2. Tiep theo su dung `let`: Khi can gan lai gia tri, su dung `let`.
3. Tranh su dung `var`: Vi pham vi va hanh vi Hoisting cua `var` co the gay ra van de khong mong muon, khuyen nghi tranh su dung trong phat trien JavaScript hien dai.
4. Chu y tuong thich trinh duyet: Neu can ho tro cac trinh duyet cu, co the su dung cac cong cu nhu Babel de transpile `let` va `const` thanh `var`.

## Chu de lien quan

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
