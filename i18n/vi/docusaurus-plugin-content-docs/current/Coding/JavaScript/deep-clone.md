---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> Deep Clone la gi?

**Deep Clone (Sao chep sau)** la viec tao mot doi tuong moi va sao chep de quy tat ca cac thuoc tinh cua doi tuong goc cung nhu tat ca cac doi tuong va mang long nhau cua no. Doi tuong sau khi Deep Clone hoan toan doc lap voi doi tuong goc -- viec thay doi mot doi tuong se khong anh huong den doi tuong kia.

### Sao chep nong vs Sao chep sau

**Shallow Clone (Sao chep nong)**: Chi sao chep cac thuoc tinh o cap do dau tien cua doi tuong; cac doi tuong long nhau van chia se cung mot tham chieu.

```javascript
// Vi du sao chep nong
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ Doi tuong goc cung bi thay doi
```

**Deep Clone (Sao chep sau)**: Sao chep de quy tat ca cac cap do thuoc tinh, hoan toan doc lap.

```javascript
// Vi du sao chep sau
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ Doi tuong goc khong bi anh huong
```

## 2. Implementation Methods

> Cac phuong phap trien khai

### Phuong phap 1: Su dung JSON.parse va JSON.stringify

**Uu diem**: Don gian va nhanh
**Nhuoc diem**: Khong the xu ly ham, undefined, Symbol, Date, RegExp, Map, Set va cac kieu dac biet khac

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Kiem tra
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**Han che**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date tro thanh doi tuong rong
console.log(cloned.func); // undefined ❌ Ham bi mat
console.log(cloned.undefined); // undefined ✅ Nhung JSON.stringify se loai bo no
console.log(cloned.symbol); // undefined ❌ Symbol bi mat
console.log(cloned.regex); // {} ❌ RegExp tro thanh doi tuong rong
```

### Phuong phap 2: Trien khai de quy (xu ly cac kieu co ban va doi tuong)

```javascript
function deepClone(obj) {
  // Xu ly null va cac kieu co ban
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xu ly Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xu ly RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Xu ly mang
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Xu ly doi tuong
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Kiem tra
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ Khong bi anh huong
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Phuong phap 3: Trien khai day du (xu ly Map, Set, Symbol, v.v.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Xu ly null va cac kieu co ban
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xu ly tham chieu vong
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Xu ly Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xu ly RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Xu ly Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Xu ly Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Xu ly mang
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Xu ly doi tuong
  const cloned = {};
  map.set(obj, cloned);

  // Xu ly thuoc tinh Symbol
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Sao chep thuoc tinh thuong
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Sao chep thuoc tinh Symbol
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// Kiem tra
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### Phuong phap 4: Xu ly tham chieu vong

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Xu ly null va cac kieu co ban
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xu ly tham chieu vong
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Xu ly Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xu ly RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Xu ly mang
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Xu ly doi tuong
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Kiem tra tham chieu vong
const original = {
  name: 'John',
};
original.self = original; // Tham chieu vong

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Xu ly tham chieu vong chinh xac
console.log(cloned !== original); // true ✅ La cac doi tuong khac nhau
```

## 3. Common Interview Questions

> Cau hoi phong van thuong gap

### Bai 1: Trien khai Deep Clone co ban

Hay trien khai mot ham `deepClone` co the sao chep sau cac doi tuong va mang.

<details>
<summary>Nhan de xem dap an</summary>

```javascript
function deepClone(obj) {
  // Xu ly null va cac kieu co ban
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xu ly Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xu ly RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Xu ly mang
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Xu ly doi tuong
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Kiem tra
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### Bai 2: Xu ly tham chieu vong

Hay trien khai mot ham `deepClone` co the xu ly tham chieu vong.

<details>
<summary>Nhan de xem dap an</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Xu ly null va cac kieu co ban
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xu ly tham chieu vong
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Xu ly Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xu ly RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Xu ly mang
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Xu ly doi tuong
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Kiem tra tham chieu vong
const original = {
  name: 'John',
};
original.self = original; // Tham chieu vong

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Diem chinh**:

- Su dung `WeakMap` de theo doi cac doi tuong da duoc xu ly
- Truoc khi tao doi tuong moi, kiem tra xem no da ton tai trong map chua
- Neu da ton tai, tra ve truc tiep tham chieu tu map de tranh de quy vo han

</details>

### Bai 3: Han che cua JSON.parse va JSON.stringify

Hay giai thich cac han che khi su dung `JSON.parse(JSON.stringify())` de Deep Clone va dua ra giai phap.

<details>
<summary>Nhan de xem dap an</summary>

**Han che**:

1. **Khong the xu ly ham**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Khong the xu ly undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (nhung thuoc tinh bi xoa) ❌
   ```

3. **Khong the xu ly Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Thuoc tinh Symbol bi mat
   ```

4. **Date tro thanh chuoi**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Tro thanh chuoi
   ```

5. **RegExp tro thanh doi tuong rong**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Tro thanh doi tuong rong
   ```

6. **Khong the xu ly Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Tro thanh doi tuong rong
   ```

7. **Khong the xu ly tham chieu vong**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Loi: Converting circular structure to JSON
   ```

**Giai phap**: Su dung trien khai de quy voi xu ly dac biet cho cac kieu khac nhau.

</details>

## 4. Best Practices

> Cac phuong phap tot nhat

### Cach lam khuyen nghi

```javascript
// 1. Chon phuong phap phu hop dua tren yeu cau
// Neu chi can xu ly doi tuong co ban va mang, su dung trien khai de quy don gian
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. Neu can xu ly cac kieu phuc tap, su dung trien khai day du
function completeDeepClone(obj, map = new WeakMap()) {
  // ... Trien khai day du
}

// 3. Su dung WeakMap de xu ly tham chieu vong
// WeakMap khong ngan can thu gom rac, phu hop de theo doi tham chieu doi tuong
```

### Cach lam can tranh

```javascript
// 1. Khong lam dung JSON.parse(JSON.stringify())
// ❌ Ham, Symbol, Date va cac kieu dac biet khac se bi mat
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Khong quen xu ly tham chieu vong
// ❌ Se gay tran bo nho
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // De quy vo han
  }
  return cloned;
}

// 3. Khong quen xu ly Date, RegExp va cac kieu dac biet khac
// ❌ Cac kieu nay can xu ly dac biet
```

## 5. Interview Summary

> Tom tat phong van

### Ghi nho nhanh

**Deep Clone**:

- **Dinh nghia**: Sao chep de quy doi tuong va tat ca cac thuoc tinh long nhau, hoan toan doc lap
- **Phuong phap**: Trien khai de quy, JSON.parse(JSON.stringify()), structuredClone()
- **Diem chinh**: Xu ly cac kieu dac biet, tham chieu vong, thuoc tinh Symbol

**Diem trien khai**:

1. Xu ly cac kieu co ban va null
2. Xu ly Date, RegExp va cac doi tuong dac biet khac
3. Xu ly mang va doi tuong
4. Xu ly tham chieu vong (su dung WeakMap)
5. Xu ly thuoc tinh Symbol

### Vi du tra loi phong van

**Q: Hay trien khai mot ham Deep Clone.**

> "Deep Clone la viec tao mot doi tuong moi hoan toan doc lap, sao chep de quy tat ca cac thuoc tinh long nhau. Trien khai cua toi se xu ly cac kieu co ban va null truoc, sau do thuc hien xu ly dac biet cho cac kieu khac nhau nhu Date, RegExp, mang va doi tuong. De xu ly tham chieu vong, toi se su dung WeakMap de theo doi cac doi tuong da duoc xu ly. Doi voi thuoc tinh Symbol, toi se su dung Object.getOwnPropertySymbols de lay va sao chep. Dieu nay dam bao rang doi tuong sau khi sao chep sau hoan toan doc lap voi doi tuong goc, viec thay doi mot doi tuong se khong anh huong den doi tuong kia."

**Q: JSON.parse(JSON.stringify()) co nhung han che gi?**

> "Cac han che chinh cua phuong phap nay bao gom: 1) Khong the xu ly ham, ham se bi xoa; 2) Khong the xu ly undefined va Symbol, cac thuoc tinh nay se bi bo qua; 3) Doi tuong Date se tro thanh chuoi; 4) RegExp se tro thanh doi tuong rong; 5) Khong the xu ly Map, Set va cac cau truc du lieu dac biet khac; 6) Khong the xu ly tham chieu vong, se bao loi. Neu can xu ly cac truong hop dac biet nay, nen su dung cach trien khai de quy."

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/vi/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
