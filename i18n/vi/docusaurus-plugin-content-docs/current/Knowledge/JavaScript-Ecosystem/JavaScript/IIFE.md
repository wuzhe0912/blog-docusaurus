---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. What's the IIFE ?

IIFE còn được gọi là hàm thực thi ngay lập tức, có cách viết khác với hàm thông thường. Bên ngoài cần bọc thêm một lớp `()`, và có đặc tính được thực thi ngay lập tức:

```js
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

Ngoài ra, cũng có thể thực thi lặp lại thông qua recursion (đệ quy) cho đến khi đạt điều kiện dừng. Phần `()` ở cuối có thể dùng để truyền tham số.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

Tuy nhiên cần lưu ý rằng, IIFE chỉ có thể được thực thi lúc khởi tạo, hoặc được gọi lặp lại từ bên trong chính nó, không thể gọi lại từ bên ngoài.

## 2. Why use IIFE ?

### scope

Dựa trên đặc tính biến bị hủy trong function, có thể sử dụng IIFE để đạt được hiệu quả cách ly, tránh ô nhiễm biến toàn cục. Xem ví dụ dưới đây:

```js
// global
const name = 'Yumi';
const Hello = () => {
  return `Hello ${name}!`;
};

(() => {
  const name = 'Pitt';
  const Hello = () => {
    return `Hello ${name}!`;
  };
  console.log(name); // result Pitt
  console.log(Hello()); // result Hello Pitt!
})();

console.log(name); // result Yumi
console.log(Hello()); // result Hello Yumi!
```

### private variable and methods

Sử dụng IIFE kết hợp với closure có thể tạo ra Private variable and methods, nghĩa là có thể lưu giữ biến trong function. Mỗi lần gọi function này, có thể điều chỉnh giá trị dựa trên kết quả lần trước, ví dụ như tăng hoặc giảm.

```js
const increment = (() => {
  let result = 0;
  console.log(result);
  const credits = (num) => {
    console.log(`I have ${num} credits.`);
  };
  return () => {
    result += 1;
    credits(result);
  };
})();

increment(); // I have 1 credits.
increment(); // I have 2 credits.
```

Tuy nhiên cần lưu ý rằng, vì biến không bị hủy, nếu lạm dụng sẽ chiếm bộ nhớ và ảnh hưởng đến hiệu suất.

### module

Cũng có thể thực thi dưới dạng object. Qua ví dụ dưới đây có thể thấy, ngoài việc tăng biến cũng có thể thực hiện khởi tạo:

```js
const Score = (() => {
  let result = 0;

  return {
    current: () => {
      return result;
    },

    increment: () => {
      result += 1;
    },

    reset: () => {
      result = 0;
    },
  };
})();

Score.increment();
console.log(Score.current()); // result 1 => 0 + 1 = 1
Score.increment();
console.log(Score.current()); // result 2 => 1 + 1 = 2
Score.reset();
console.log(Score.current()); // result 0 => reset = 0
```

Một cách viết khác:

```js
const Score = (() => {
  let result = 0;
  const current = () => {
    return result;
  };

  const increment = () => {
    result += 1;
  };

  const reset = () => {
    result = 0;
  };

  return {
    current: current,
    increment: increment,
    reset: reset,
  };
})();

Score.increment();
console.log(Score.current());
Score.increment();
console.log(Score.current());
Score.reset();
console.log(Score.current());
```

Cuối cùng cần đặc biệt lưu ý, do đặc tính thực thi ngay lập tức của IIFE, nếu có hai hàm thực thi ngay liên tiếp, quy tắc `ASI (Automatic Semicolon Insertion)` có thể không hoạt động đúng. Vì vậy, khi có hai IIFE liên tiếp, cần tự thêm dấu chấm phẩy.
