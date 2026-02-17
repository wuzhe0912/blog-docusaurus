---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> Mo ta bai toan

Trien khai mot ham nhan vao mot chuoi va tra ve ky tu xuat hien nhieu nhat trong chuoi do.

### Vi du

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> Cac phuong phap trien khai

### Phuong phap 1: Dem bang doi tuong (phien ban co ban)

**Y tuong**: Duyet qua chuoi, su dung doi tuong de ghi lai so lan xuat hien cua moi ky tu, sau do tim ky tu xuat hien nhieu nhat.

```javascript
function findMostFrequentChar(str) {
  // Khoi tao doi tuong de luu tru ky tu va so dem
  const charCount = {};

  // Khoi tao bien ghi lai so dem lon nhat va ky tu
  let maxCount = 0;
  let maxChar = '';

  // Duyet qua chuoi
  for (let char of str) {
    // Neu ky tu khong co trong doi tuong, dat so dem la 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Tang so dem cua ky tu nay
    charCount[char]++;

    // Neu so dem cua ky tu nay lon hon so dem lon nhat
    // Cap nhat so dem lon nhat va ky tu lon nhat
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Tra ve ky tu lon nhat
  return maxChar;
}

// Kiem tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Do phuc tap thoi gian**: O(n), trong do n la do dai chuoi
**Do phuc tap khong gian**: O(k), trong do k la so ky tu khac nhau

### Phuong phap 2: Dem truoc roi tim gia tri lon nhat (hai giai doan)

**Y tuong**: Duyet mot lan de tinh so lan xuat hien cua tat ca ky tu, roi duyet lan nua de tim gia tri lon nhat.

```javascript
function findMostFrequentChar(str) {
  // Giai doan 1: Tinh so lan xuat hien cua moi ky tu
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Giai doan 2: Tim ky tu xuat hien nhieu nhat
  let maxCount = 0;
  let maxChar = '';

  for (let char in charCount) {
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Kiem tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Uu diem**: Logic ro rang hon, xu ly theo tung giai doan
**Nhuoc diem**: Can hai lan duyet

### Phuong phap 3: Su dung Map (ES6)

**Y tuong**: Su dung Map de luu tru moi quan he giua ky tu va so dem.

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Kiem tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Uu diem**: Su dung Map phu hop hon voi phong cach JavaScript hien dai
**Nhuoc diem**: Doi voi truong hop don gian, doi tuong co the truc quan hon

### Phuong phap 4: Su dung reduce (phong cach ham)

**Y tuong**: Su dung `reduce` va `Object.entries` de trien khai.

```javascript
function findMostFrequentChar(str) {
  // Tinh so lan xuat hien cua moi ky tu
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Tim ky tu xuat hien nhieu nhat
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Kiem tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Uu diem**: Phong cach ham, code ngan gon
**Nhuoc diem**: Doc kho hon, hieu suat thap hon mot chut

### Phuong phap 5: Xu ly truong hop nhieu gia tri lon nhat giong nhau

**Y tuong**: Neu nhieu ky tu co so lan xuat hien giong nhau va deu la gia tri lon nhat, tra ve mang hoac ky tu dau tien gap duoc.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Tinh so lan xuat hien cua moi ky tu
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Tim tat ca ky tu co so lan xuat hien bang gia tri lon nhat
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Tra ve ky tu dau tien gap duoc (hoac tra ve toan bo mang)
  return mostFrequentChars[0];
  // Hoac tra ve tat ca: return mostFrequentChars;
}

// Kiem tra
console.log(findMostFrequentChar('aabbcc')); // 'a' (ky tu dau tien gap duoc)
```

## 3. Edge Cases

> Xu ly truong hop bien

### Xu ly chuoi rong

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // Hoac throw new Error('String cannot be empty')
  }

  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Xu ly chu hoa chu thuong

```javascript
function findMostFrequentChar(str, caseSensitive = true) {
  const processedStr = caseSensitive ? str : str.toLowerCase();
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Kiem tra
console.log(findMostFrequentChar('Hello', false)); // 'l' (khong phan biet chu hoa/thuong)
console.log(findMostFrequentChar('Hello', true)); // 'l' (phan biet chu hoa/thuong)
```

### Xu ly khoang trang va ky tu dac biet

```javascript
function findMostFrequentChar(str, ignoreSpaces = false) {
  const processedStr = ignoreSpaces ? str.replace(/\s/g, '') : str;
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Kiem tra
console.log(findMostFrequentChar('hello world', true)); // 'l' (bo qua khoang trang)
console.log(findMostFrequentChar('hello world', false)); // ' ' (khoang trang)
```

## 4. Common Interview Questions

> Cau hoi phong van thuong gap

### Bai 1: Trien khai co ban

Hay trien khai mot ham tim ky tu xuat hien nhieu nhat trong chuoi.

<details>
<summary>Nhan de xem dap an</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Kiem tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Diem chinh**:

- Su dung doi tuong hoac Map de ghi lai so lan xuat hien cua moi ky tu
- Cap nhat gia tri lon nhat trong qua trinh duyet
- Do phuc tap thoi gian O(n), do phuc tap khong gian O(k)

</details>

### Bai 2: Phien ban toi uu

Hay toi uu ham tren de xu ly truong hop nhieu gia tri lon nhat giong nhau.

<details>
<summary>Nhan de xem dap an</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Giai doan 1: Tinh so lan xuat hien cua moi ky tu
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Giai doan 2: Tim tat ca ky tu co so lan xuat hien bang gia tri lon nhat
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Tra ve ky tu dau tien hoac tat ca tuy theo yeu cau
  return mostFrequentChars[0]; // Hoac tra ve mostFrequentChars
}

// Kiem tra
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### Bai 3: Trien khai voi Map

Hay su dung Map cua ES6 de trien khai ham nay.

<details>
<summary>Nhan de xem dap an</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Kiem tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**:

- **Map**: Phu hop hon cho cac cap khoa-gia tri dong, khoa co the la bat ky kieu nao
- **Object**: Don gian va truc quan hon, phu hop cho khoa kieu chuoi

</details>

## 5. Best Practices

> Cac phuong phap tot nhat

### Cach lam khuyen nghi

```javascript
// 1. Su dung ten bien ro rang
function findMostFrequentChar(str) {
  const charCount = {}; // The hien ro muc dich
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Xu ly truong hop bien
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Cap nhat gia tri lon nhat trong khi duyet (mot lan duyet)
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Cach lam can tranh

```javascript
// 1. Khong su dung hai lan duyet (tru khi can thiet)
// ❌ Hieu suat kem hon
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Lan duyet thu hai
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Khong quen xu ly chuoi rong
// ❌ Co the tra ve undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // Khi chuoi rong, maxChar la ''
}

// 3. Khong su dung cach viet ham qua phuc tap (tru khi la quy uoc cua nhom)
// ❌ Doc kho hon
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> Tom tat phong van

### Ghi nho nhanh

**Diem trien khai**:

1. Su dung doi tuong hoac Map de ghi lai so lan xuat hien cua moi ky tu
2. Cap nhat gia tri lon nhat trong qua trinh duyet
3. Do phuc tap thoi gian O(n), do phuc tap khong gian O(k)
4. Xu ly truong hop bien (chuoi rong, chu hoa/thuong, v.v.)

**Huong toi uu**:

- Hoan thanh trong mot lan duyet (dem va tim gia tri lon nhat dong thoi)
- Su dung Map cho cac tinh huong phuc tap
- Xu ly truong hop nhieu gia tri lon nhat giong nhau
- Xem xet chu hoa/thuong, khoang trang va cac truong hop dac biet khac

### Vi du tra loi phong van

**Q: Hay trien khai mot ham tim ky tu xuat hien nhieu nhat trong chuoi.**

> "Toi se su dung mot doi tuong de ghi lai so lan xuat hien cua moi ky tu, va cap nhat gia tri lon nhat trong qua trinh duyet chuoi. Trien khai cu the la: khoi tao mot doi tuong rong charCount de luu tru ky tu va so dem, khoi tao bien maxCount va maxChar. Sau do duyet qua chuoi, voi moi ky tu, neu khong co trong doi tuong thi khoi tao la 0, roi tang so dem. Neu so dem cua ky tu hien tai lon hon maxCount, cap nhat maxCount va maxChar. Cuoi cung tra ve maxChar. Do phuc tap thoi gian cua phuong phap nay la O(n), do phuc tap khong gian la O(k), trong do n la do dai chuoi va k la so ky tu khac nhau."

## Reference

- [MDN - String](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
