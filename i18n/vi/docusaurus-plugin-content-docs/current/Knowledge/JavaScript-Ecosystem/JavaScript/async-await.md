---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 Khuyến nghị đọc [Promise](/docs/promise) trước để hiểu các khái niệm cơ bản

## async/await là gì?

`async/await` là cú pháp đường (syntactic sugar) được giới thiệu trong ES2017 (ES8), xây dựng trên nền tảng Promise, giúp mã bất đồng bộ trông giống như mã đồng bộ, dễ đọc và dễ bảo trì hơn.

**Khái niệm cốt lõi**:

- Hàm `async` luôn trả về một Promise
- `await` chỉ có thể sử dụng bên trong hàm `async`
- `await` tạm dừng việc thực thi hàm, chờ Promise hoàn thành

## Cú pháp cơ bản

### Hàm async

Từ khóa `async` khiến hàm tự động trả về Promise:

```js
// Cách viết Promise truyền thống
function fetchData() {
  return Promise.resolve('dữ liệu');
}

// Cách viết async (tương đương)
async function fetchData() {
  return 'dữ liệu'; // Tự động bọc thành Promise.resolve('dữ liệu')
}

// Cách gọi giống nhau
fetchData().then((data) => console.log(data)); // 'dữ liệu'
```

### Từ khóa await

`await` chờ Promise hoàn thành và trả về kết quả:

```js
async function getData() {
  const result = await Promise.resolve('hoàn thành');
  console.log(result); // 'hoàn thành'
}
```

## So sánh Promise vs async/await

### Ví dụ 1: Yêu cầu API đơn giản

**Cách viết Promise**:

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('Lỗi:', error);
      throw error;
    });
}
```

**Cách viết async/await**:

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Lỗi:', error);
    throw error;
  }
}
```

### Ví dụ 2: Chuỗi nhiều thao tác bất đồng bộ

**Cách viết Promise**:

```js
function processUserData(userId) {
  return fetchUser(userId)
    .then((user) => {
      return fetchPosts(user.id);
    })
    .then((posts) => {
      return fetchComments(posts[0].id);
    })
    .then((comments) => {
      console.log(comments);
      return comments;
    })
    .catch((error) => {
      console.error('Lỗi:', error);
    });
}
```

**Cách viết async/await**:

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('Lỗi:', error);
  }
}
```

## Xử lý lỗi

### try/catch vs .catch()

**async/await sử dụng try/catch**:

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Yêu cầu thất bại:', error);
    // Có thể xử lý các loại lỗi khác nhau tại đây
    if (error.name === 'NetworkError') {
      // Xử lý lỗi mạng
    }
    throw error; // Ném lại hoặc trả về giá trị mặc định
  }
}
```

**Sử dụng kết hợp (không khuyến nghị nhưng vẫn hoạt động)**:

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('Yêu cầu thất bại:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### try/catch nhiều tầng

Đối với lỗi ở các giai đoạn khác nhau, có thể sử dụng nhiều khối try/catch:

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('Lấy thông tin người dùng thất bại:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('Lấy bài viết thất bại:', error);
    return []; // Trả về mảng rỗng làm giá trị mặc định
  }
}
```

## Ví dụ ứng dụng thực tế

### Ví dụ: Quy trình chấm bài

> Quy trình: Chấm bài → Kiểm tra phần thưởng → Trao phần thưởng → Đuổi học hoặc phạt

```js
// Chấm bài
function correctTest(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const score = Math.round(Math.random() * 100);
      if (score >= 60) {
        resolve({
          name,
          score,
        });
      } else {
        reject('Bạn đã đạt ngưỡng bị đuổi học');
      }
    }, 2000);
  });
}

// Kiểm tra phần thưởng
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} nhận được vé xem phim`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} nhận được giấy khen`);
      } else {
        reject('Bạn không có phần thưởng');
      }
    }, 2000);
  });
}
```

**Cách viết Promise**:

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**Viết lại với async/await**:

```js
async function processStudent(name) {
  try {
    const data = await correctTest(name);
    const reward = await checkReward(data);
    console.log(reward);
    return reward;
  } catch (error) {
    console.log(error);
    return null;
  }
}

processStudent('John Doe');
```

### Ví dụ: Thực thi đồng thời nhiều yêu cầu

Khi nhiều yêu cầu không có quan hệ phụ thuộc, nên thực thi đồng thời:

**❌ Sai: Thực thi tuần tự (chậm hơn)**:

```js
async function fetchAllData() {
  const users = await fetchUsers(); // Chờ 1 giây
  const posts = await fetchPosts(); // Chờ thêm 1 giây
  const comments = await fetchComments(); // Chờ thêm 1 giây
  // Tổng cộng 3 giây
  return { users, posts, comments };
}
```

**✅ Đúng: Thực thi đồng thời (nhanh hơn)**:

```js
async function fetchAllData() {
  // Gửi ba yêu cầu cùng lúc
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // Chỉ cần 1 giây (thời gian của yêu cầu chậm nhất)
  return { users, posts, comments };
}
```

**Sử dụng Promise.allSettled() xử lý thất bại một phần**:

```js
async function fetchAllData() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);

  const users = results[0].status === 'fulfilled' ? results[0].value : [];
  const posts = results[1].status === 'fulfilled' ? results[1].value : [];
  const comments = results[2].status === 'fulfilled' ? results[2].value : [];

  return { users, posts, comments };
}
```

## Bẫy thường gặp

### 1. Sử dụng await trong vòng lặp (thực thi tuần tự)

**❌ Sai: Chờ mỗi lần lặp, kém hiệu quả**:

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // Thực thi tuần tự, rất chậm!
    results.push(user);
  }
  return results;
}
// Nếu có 10 người dùng, mỗi yêu cầu 1 giây, tổng cộng mất 10 giây
```

**✅ Đúng: Thực thi đồng thời với Promise.all()**:

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// 10 người dùng yêu cầu đồng thời, chỉ mất 1 giây
```

**Giải pháp trung gian: Giới hạn số lượng đồng thời**:

```js
async function processUsersWithLimit(userIds, limit = 3) {
  const results = [];
  for (let i = 0; i < userIds.length; i += limit) {
    const batch = userIds.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((id) => fetchUser(id)));
    results.push(...batchResults);
  }
  return results;
}
// Mỗi lần xử lý 3 yêu cầu, tránh gửi quá nhiều yêu cầu cùng lúc
```

### 2. Quên sử dụng await

Quên `await` sẽ nhận được Promise thay vì giá trị thực tế:

```js
// ❌ Sai
async function getUser() {
  const user = fetchUser(1); // Quên await, user là Promise
  console.log(user.name); // undefined (Promise không có thuộc tính name)
}

// ✅ Đúng
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // Tên đúng
}
```

### 3. Quên async khi sử dụng await

`await` chỉ có thể sử dụng bên trong hàm `async`:

```js
// ❌ Sai: Lỗi cú pháp
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ Đúng
async function getData() {
  const data = await fetchData();
  return data;
}
```

**await cấp cao nhất (Top-level await)**:

Trong ES2022 và môi trường module, có thể sử dụng await ở cấp cao nhất của module:

```js
// ES2022 module
const data = await fetchData(); // Có thể sử dụng ở cấp cao nhất của module
console.log(data);
```

### 4. Thiếu xử lý lỗi

Không có try/catch sẽ khiến lỗi không được bắt:

```js
// ❌ Có thể dẫn đến lỗi không được bắt
async function fetchData() {
  const response = await fetch('/api/data'); // Nếu thất bại sẽ ném lỗi
  return response.json();
}

// ✅ Thêm xử lý lỗi
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Lỗi:', error);
    return null; // Hoặc trả về giá trị mặc định
  }
}
```

### 5. Hàm async luôn trả về Promise

Ngay cả khi không sử dụng `await`, hàm `async` vẫn trả về Promise:

```js
async function getValue() {
  return 42; // Thực tế trả về Promise.resolve(42)
}

// Phải sử dụng .then() hoặc await để lấy giá trị
getValue().then((value) => console.log(value)); // 42

// Hoặc
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## Ứng dụng nâng cao

### Xử lý timeout

Triển khai cơ chế timeout sử dụng Promise.race():

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Hết thời gian chờ')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('Yêu cầu thất bại:', error.message);
    throw error;
  }
}

// Sử dụng
fetchWithTimeout('/api/data', 3000); // Timeout 3 giây
```

### Cơ chế thử lại

Triển khai tự động thử lại khi thất bại:

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // Lần thử cuối thất bại, ném lỗi

      console.log(`Lần thử ${i + 1} thất bại, thử lại sau ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Sử dụng
fetchWithRetry('/api/data', 3, 2000); // Tối đa 3 lần thử, cách nhau 2 giây
```

### Xử lý tuần tự nhưng giữ trạng thái

Đôi khi cần thực thi tuần tự nhưng giữ lại tất cả kết quả:

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // Có thể quyết định bước tiếp theo dựa trên kết quả trước đó
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## async/await trong Event Loop

async/await bản chất vẫn là Promise, do đó tuân theo cùng quy tắc Event Loop:

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// Thứ tự đầu ra: 1, 2, 4, 3
```

Phân tích:

1. `console.log('1')` - Thực thi đồng bộ
2. `test()` được gọi, `console.log('2')` - Thực thi đồng bộ
3. `await Promise.resolve()` - Đưa mã phía sau vào micro task
4. `console.log('4')` - Thực thi đồng bộ
5. Micro task thực thi, `console.log('3')`

## Điểm trọng tâm phỏng vấn

1. **async/await là cú pháp đường của Promise**: Dễ đọc hơn nhưng bản chất giống nhau
2. **Xử lý lỗi sử dụng try/catch**: Thay vì `.catch()`
3. **Chú ý đồng thời vs tuần tự**: Không dùng await một cách mù quáng trong vòng lặp
4. **Hàm async luôn trả về Promise**: Ngay cả khi không có return Promise rõ ràng
5. **await chỉ dùng trong hàm async**: Trừ top-level await (ES2022)
6. **Hiểu Event Loop**: Mã sau await là micro task

## Chủ đề liên quan

- [Promise](/docs/promise) - Nền tảng của async/await
- [Event Loop](/docs/event-loop) - Hiểu thứ tự thực thi

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
