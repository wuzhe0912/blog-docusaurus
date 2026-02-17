---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## Promise là gì?

Promise là tính năng mới của ES6, chủ yếu được sử dụng để giải quyết vấn đề callback hell và làm cho mã nguồn dễ đọc hơn. Promise đại diện cho sự hoàn thành hoặc thất bại cuối cùng của một thao tác bất đồng bộ, cùng với giá trị kết quả của nó.

Promise có ba trạng thái:

- **pending** (đang chờ): Trạng thái khởi tạo
- **fulfilled** (đã hoàn thành): Thao tác hoàn thành thành công
- **rejected** (đã bị từ chối): Thao tác thất bại

## Cách sử dụng cơ bản

### Tạo Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // Thao tác bất đồng bộ
  const success = true;

  if (success) {
    resolve('Thành công!'); // Thay đổi trạng thái Promise thành fulfilled
  } else {
    reject('Thất bại!'); // Thay đổi trạng thái Promise thành rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // 'Thành công!'
  })
  .catch((error) => {
    console.log(error); // 'Thất bại!'
  });
```

### Ứng dụng thực tế: Xử lý yêu cầu API

```js
// Tạo một function dùng chung để xử lý yêu cầu API
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // Kiểm tra response có nằm trong khoảng 200 ~ 299 không
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Chuyển response thành JSON và trả về
    })
    .catch((error) => {
      // Kiểm tra mạng có bất thường hay yêu cầu bị từ chối
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // Ném lỗi
    });
}

fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then((userData) => {
    console.log('User data received:', userData);
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });
```

## Các phương thức của Promise

### .then() / .catch() / .finally()

```js
promise
  .then((result) => {
    // Xử lý trường hợp thành công
    return result;
  })
  .catch((error) => {
    // Xử lý lỗi
    console.error(error);
  })
  .finally(() => {
    // Luôn được thực thi bất kể thành công hay thất bại
    console.log('Promise hoàn tất');
  });
```

### Promise.all()

Chỉ hoàn thành khi tất cả Promise đều hoàn thành, chỉ cần một cái thất bại là sẽ thất bại.

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('foo'), 100)
);
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 'foo', 42]
});
```

**Khi nào sử dụng**: Cần đợi nhiều yêu cầu API đều hoàn thành rồi mới tiếp tục thực thi.

### Promise.race()

Trả về kết quả của Promise đầu tiên hoàn thành (bất kể thành công hay thất bại).

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('Số 1'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Số 2'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 'Số 2' (vì hoàn thành nhanh hơn)
});
```

**Khi nào sử dụng**: Đặt timeout cho yêu cầu, chỉ lấy kết quả phản hồi nhanh nhất.

### Promise.allSettled()

Đợi tất cả Promise hoàn thành (bất kể thành công hay thất bại), trả về tất cả kết quả.

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('Lỗi');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'Lỗi' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**Khi nào sử dụng**: Cần biết kết quả thực thi của tất cả Promise, ngay cả khi một số thất bại vẫn cần tiếp tục xử lý.

### Promise.any()

Trả về Promise đầu tiên thành công, tất cả đều thất bại mới thất bại.

```js
const promise1 = Promise.reject('Lỗi 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Thành công'), 100)
);
const promise3 = Promise.reject('Lỗi 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // 'Thành công'
});
```

**Khi nào sử dụng**: Nhiều tài nguyên dự phòng, chỉ cần một cái thành công là đủ.

## Câu hỏi phỏng vấn

### Câu hỏi 1: Chuỗi Promise và xử lý lỗi

Hãy xác định kết quả đầu ra của đoạn mã sau:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch((e) => console.log('This will not run'));
```

#### Phân tích

Hãy phân tích quá trình thực thi từng bước:

```js
Promise.resolve(1) // Giá trị trả về: 1
  .then((x) => x + 1) // x = 1, trả về 2
  .then(() => {
    throw new Error('My Error'); // Ném lỗi, đi vào catch
  })
  .catch((e) => 1) // Bắt lỗi, trả về 1 (Quan trọng: ở đây trả về giá trị bình thường)
  .then((x) => x + 1) // x = 1, trả về 2
  .then((x) => console.log(x)) // Xuất 2
  .catch((e) => console.log('This will not run')); // Không thực thi
```

**Đáp án: 2**

#### Khái niệm then chốt

1. **catch bắt lỗi và trả về giá trị bình thường**: Khi `catch()` trả về giá trị bình thường, chuỗi Promise sẽ tiếp tục thực thi các `.then()` tiếp theo
2. **then sau catch tiếp tục thực thi**: Vì lỗi đã được xử lý, chuỗi Promise trở về trạng thái bình thường
3. **catch cuối cùng không thực thi**: Vì không có lỗi mới được ném ra

Nếu muốn lỗi tiếp tục lan truyền, cần ném lại lỗi trong `catch`:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('Đã bắt được lỗi');
    throw e; // Ném lại lỗi
  })
  .then((x) => x + 1) // Không thực thi
  .then((x) => console.log(x)) // Không thực thi
  .catch((e) => console.log('This will run')); // Thực thi
```

### Câu hỏi 2: Event Loop và thứ tự thực thi

> Câu hỏi này bao gồm khái niệm Event Loop

Hãy xác định kết quả đầu ra của đoạn mã sau:

```js
function a() {
  console.log('Warlock');
}

function b() {
  console.log('Druid');
  Promise.resolve().then(() => {
    console.log('Rogue');
  });
}

function c() {
  console.log('Mage');
}

function d() {
  setTimeout(c, 100);
  const temp = Promise.resolve().then(a);
  console.log('Warrior');
  setTimeout(b, 0);
}

d();
```

#### Hiểu thứ tự thực thi

Trước tiên hãy xem `d()`:

```js
function d() {
  setTimeout(c, 100); // 4. Macro task, trì hoãn 100ms, thực thi cuối cùng
  const temp = Promise.resolve().then(a); // 2. Micro task, thực thi sau mã đồng bộ
  console.log('Warrior'); // 1. Thực thi đồng bộ, xuất ngay lập tức
  setTimeout(b, 0); // 3. Macro task, trì hoãn 0ms, nhưng vẫn là macro task
}
```

Phân tích thứ tự thực thi:

1. **Mã đồng bộ**: `console.log('Warrior')` → Xuất `Warrior`
2. **Micro task**: `Promise.resolve().then(a)` → Thực thi `a()`, xuất `Warlock`
3. **Macro task**:
   - `setTimeout(b, 0)` thực thi trước (trì hoãn 0ms)
   - Thực thi `b()`, xuất `Druid`
   - `Promise.resolve().then(...)` trong `b()` là micro task, thực thi ngay, xuất `Rogue`
4. **Macro task**: `setTimeout(c, 100)` thực thi cuối cùng (trì hoãn 100ms), xuất `Mage`

#### Đáp án

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### Khái niệm then chốt

- **Mã đồng bộ** > **Micro task (Promise)** > **Macro task (setTimeout)**
- `.then()` của Promise thuộc micro task, được thực thi sau khi macro task hiện tại kết thúc và trước khi macro task tiếp theo bắt đầu
- `setTimeout` dù thời gian trì hoãn là 0 vẫn thuộc macro task, được thực thi sau tất cả micro task

### Câu hỏi 3: Đồng bộ và bất đồng bộ trong hàm tạo Promise

Hãy xác định kết quả đầu ra của đoạn mã sau:

```js
function printing() {
  console.log(1);
  setTimeout(function () {
    console.log(2);
  }, 1000);
  setTimeout(function () {
    console.log(3);
  }, 0);

  new Promise((resolve, reject) => {
    console.log(4);
    resolve(5);
  }).then((foo) => {
    console.log(6);
  });

  console.log(7);
}

printing();

// output ?
```

#### Chú ý khối Promise

Điểm then chốt của câu hỏi này: **Mã bên trong hàm tạo Promise được thực thi đồng bộ**, chỉ có `.then()` và `.catch()` mới là bất đồng bộ.

Phân tích thứ tự thực thi:

```js
console.log(1); // 1. Đồng bộ, xuất 1
setTimeout(() => console.log(2), 1000); // 5. Macro task, trì hoãn 1000ms
setTimeout(() => console.log(3), 0); // 4. Macro task, trì hoãn 0ms

new Promise((resolve, reject) => {
  console.log(4); // 2. Đồng bộ! Bên trong hàm tạo Promise là đồng bộ, xuất 4
  resolve(5);
}).then((foo) => {
  console.log(6); // 3. Micro task, xuất 6
});

console.log(7); // 3. Đồng bộ, xuất 7
```

Luồng thực thi:

1. **Thực thi đồng bộ**: 1 → 4 → 7
2. **Micro task**: 6
3. **Macro task** (theo thời gian trì hoãn): 3 → 2

#### Đáp án

```
1
4
7
6
3
2
```

#### Khái niệm then chốt

1. **Mã bên trong hàm tạo Promise được thực thi đồng bộ**: `console.log(4)` không phải bất đồng bộ
2. **Chỉ `.then()` và `.catch()` mới là bất đồng bộ**: Chúng thuộc micro task
3. **Thứ tự thực thi**: Mã đồng bộ → micro task → macro task

## Bẫy thường gặp

### 1. Quên return

Quên `return` trong chuỗi Promise sẽ khiến `.then()` tiếp theo nhận được `undefined`:

```js
// ❌ Sai
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // Quên return
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ Đúng
fetchUser()
  .then((user) => {
    return fetchPosts(user.id); // Nhớ return
  })
  .then((posts) => {
    console.log(posts); // Dữ liệu đúng
  });
```

### 2. Quên catch lỗi

Lỗi Promise không được bắt sẽ gây ra UnhandledPromiseRejection:

```js
// ❌ Có thể gây ra lỗi không được bắt
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ Thêm catch
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Đã xảy ra lỗi:', error);
  });
```

### 3. Lạm dụng hàm tạo Promise

Không cần bọc Promise cho các hàm đã trả về Promise:

```js
// ❌ Bọc không cần thiết
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ Trả về trực tiếp
function fetchData() {
  return fetch(url);
}
```

### 4. Nối nhiều catch

Mỗi `catch()` chỉ bắt lỗi trước nó:

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('Đã bắt:', e.message); // Đã bắt: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('Đã bắt:', e.message); // Đã bắt: Error 2
  });
```

## Chủ đề liên quan

- [async/await](/docs/async-await) - Cú pháp đường thanh lịch hơn cho Promise
- [Event Loop](/docs/event-loop) - Hiểu sâu cơ chế bất đồng bộ của JavaScript

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
