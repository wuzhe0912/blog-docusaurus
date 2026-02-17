---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> Mô tả bài toán

Triển khai một hàm nhận vào một chuỗi và trả về ký tự xuất hiện nhiều nhất trong chuỗi đó.

### Ví dụ

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> Các phương pháp triển khai

### Phương pháp 1: Đếm bằng đối tượng (phiên bản cơ bản)

**Ý tưởng**: Duyệt qua chuỗi, sử dụng đối tượng để ghi lại số lần xuất hiện của mỗi ký tự, sau đó tìm ký tự xuất hiện nhiều nhất.

```javascript
function findMostFrequentChar(str) {
  // Khởi tạo đối tượng để lưu trữ ký tự và số đếm
  const charCount = {};

  // Khởi tạo biến ghi lại số đếm lớn nhất và ký tự
  let maxCount = 0;
  let maxChar = '';

  // Duyệt qua chuỗi
  for (let char of str) {
    // Nếu ký tự không có trong đối tượng, đặt số đếm là 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Tăng số đếm của ký tự này
    charCount[char]++;

    // Nếu số đếm của ký tự này lớn hơn số đếm lớn nhất
    // Cập nhật số đếm lớn nhất và ký tự lớn nhất
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Trả về ký tự lớn nhất
  return maxChar;
}

// Kiểm tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Độ phức tạp thời gian**: O(n), trong đó n là độ dài chuỗi
**Độ phức tạp không gian**: O(k), trong đó k là số ký tự khác nhau

### Phương pháp 2: Đếm trước rồi tìm giá trị lớn nhất (hai giai đoạn)

**Ý tưởng**: Duyệt một lần để tính số lần xuất hiện của tất cả ký tự, rồi duyệt lần nữa để tìm giá trị lớn nhất.

```javascript
function findMostFrequentChar(str) {
  // Giai đoạn 1: Tính số lần xuất hiện của mỗi ký tự
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Giai đoạn 2: Tìm ký tự xuất hiện nhiều nhất
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

// Kiểm tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Ưu điểm**: Logic rõ ràng hơn, xử lý theo từng giai đoạn
**Nhược điểm**: Cần hai lần duyệt

### Phương pháp 3: Sử dụng Map (ES6)

**Ý tưởng**: Sử dụng Map để lưu trữ mối quan hệ giữa ký tự và số đếm.

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

// Kiểm tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Ưu điểm**: Sử dụng Map phù hợp hơn với phong cách JavaScript hiện đại
**Nhược điểm**: Đối với trường hợp đơn giản, đối tượng có thể trực quan hơn

### Phương pháp 4: Sử dụng reduce (phong cách hàm)

**Ý tưởng**: Sử dụng `reduce` và `Object.entries` để triển khai.

```javascript
function findMostFrequentChar(str) {
  // Tính số lần xuất hiện của mỗi ký tự
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Tìm ký tự xuất hiện nhiều nhất
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Kiểm tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Ưu điểm**: Phong cách hàm, code ngắn gọn
**Nhược điểm**: Đọc khó hơn, hiệu suất thấp hơn một chút

### Phương pháp 5: Xử lý trường hợp nhiều giá trị lớn nhất giống nhau

**Ý tưởng**: Nếu nhiều ký tự có số lần xuất hiện giống nhau và đều là giá trị lớn nhất, trả về mảng hoặc ký tự đầu tiên gặp được.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Tính số lần xuất hiện của mỗi ký tự
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Tìm tất cả ký tự có số lần xuất hiện bằng giá trị lớn nhất
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Trả về ký tự đầu tiên gặp được (hoặc trả về toàn bộ mảng)
  return mostFrequentChars[0];
  // Hoặc trả về tất cả: return mostFrequentChars;
}

// Kiểm tra
console.log(findMostFrequentChar('aabbcc')); // 'a' (ký tự đầu tiên gặp được)
```

## 3. Edge Cases

> Xử lý trường hợp biên

### Xử lý chuỗi rỗng

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // Hoặc throw new Error('String cannot be empty')
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

### Xử lý chữ hoa chữ thường

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

// Kiểm tra
console.log(findMostFrequentChar('Hello', false)); // 'l' (không phân biệt chữ hoa/thường)
console.log(findMostFrequentChar('Hello', true)); // 'l' (phân biệt chữ hoa/thường)
```

### Xử lý khoảng trắng và ký tự đặc biệt

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

// Kiểm tra
console.log(findMostFrequentChar('hello world', true)); // 'l' (bỏ qua khoảng trắng)
console.log(findMostFrequentChar('hello world', false)); // ' ' (khoảng trắng)
```

## 4. Common Interview Questions

> Câu hỏi phỏng vấn thường gặp

### Bài 1: Triển khai cơ bản

Hãy triển khai một hàm tìm ký tự xuất hiện nhiều nhất trong chuỗi.

<details>
<summary>Nhấn để xem đáp án</summary>

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

// Kiểm tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Điểm chính**:

- Sử dụng đối tượng hoặc Map để ghi lại số lần xuất hiện của mỗi ký tự
- Cập nhật giá trị lớn nhất trong quá trình duyệt
- Độ phức tạp thời gian O(n), độ phức tạp không gian O(k)

</details>

### Bài 2: Phiên bản tối ưu

Hãy tối ưu hàm trên để xử lý trường hợp nhiều giá trị lớn nhất giống nhau.

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Giai đoạn 1: Tính số lần xuất hiện của mỗi ký tự
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Giai đoạn 2: Tìm tất cả ký tự có số lần xuất hiện bằng giá trị lớn nhất
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Trả về ký tự đầu tiên hoặc tất cả tùy theo yêu cầu
  return mostFrequentChars[0]; // Hoặc trả về mostFrequentChars
}

// Kiểm tra
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### Bài 3: Triển khai với Map

Hãy sử dụng Map của ES6 để triển khai hàm này.

<details>
<summary>Nhấn để xem đáp án</summary>

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

// Kiểm tra
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**:

- **Map**: Phù hợp hơn cho các cặp khóa-giá trị động, khóa có thể là bất kỳ kiểu nào
- **Object**: Đơn giản và trực quan hơn, phù hợp cho khóa kiểu chuỗi

</details>

## 5. Best Practices

> Các phương pháp tốt nhất

### Cách làm khuyên nghị

```javascript
// 1. Sử dụng tên biến rõ ràng
function findMostFrequentChar(str) {
  const charCount = {}; // Thể hiện rõ mục đích
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Xử lý trường hợp biên
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Cập nhật giá trị lớn nhất trong khi duyệt (một lần duyệt)
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

### Cách làm cần tránh

```javascript
// 1. Không sử dụng hai lần duyệt (trừ khi cần thiết)
// ❌ Hiệu suất kém hơn
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Lần duyệt thứ hai
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Không quên xử lý chuỗi rỗng
// ❌ Có thể trả về undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // Khi chuỗi rỗng, maxChar là ''
}

// 3. Không sử dụng cách viết hàm quá phức tạp (trừ khi là quy ước của nhóm)
// ❌ Đọc khó hơn
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> Tóm tắt phỏng vấn

### Ghi nhớ nhanh

**Điểm triển khai**:

1. Sử dụng đối tượng hoặc Map để ghi lại số lần xuất hiện của mỗi ký tự
2. Cập nhật giá trị lớn nhất trong quá trình duyệt
3. Độ phức tạp thời gian O(n), độ phức tạp không gian O(k)
4. Xử lý trường hợp biên (chuỗi rỗng, chữ hoa/thường, v.v.)

**Hướng tối ưu**:

- Hoàn thành trong một lần duyệt (đếm và tìm giá trị lớn nhất đồng thời)
- Sử dụng Map cho các tình huống phức tạp
- Xử lý trường hợp nhiều giá trị lớn nhất giống nhau
- Xem xét chữ hoa/thường, khoảng trắng và các trường hợp đặc biệt khác

### Ví dụ trả lời phỏng vấn

**Q: Hãy triển khai một hàm tìm ký tự xuất hiện nhiều nhất trong chuỗi.**

> "Tôi sẽ sử dụng một đối tượng để ghi lại số lần xuất hiện của mỗi ký tự, và cập nhật giá trị lớn nhất trong quá trình duyệt chuỗi. Triển khai cụ thể là: khởi tạo một đối tượng rỗng charCount để lưu trữ ký tự và số đếm, khởi tạo biến maxCount và maxChar. Sau đó duyệt qua chuỗi, với mỗi ký tự, nếu không có trong đối tượng thì khởi tạo là 0, rồi tăng số đếm. Nếu số đếm của ký tự hiện tại lớn hơn maxCount, cập nhật maxCount và maxChar. Cuối cùng trả về maxChar. Độ phức tạp thời gian của phương pháp này là O(n), độ phức tạp không gian là O(k), trong đó n là độ dài chuỗi và k là số ký tự khác nhau."

## Reference

- [MDN - String](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
