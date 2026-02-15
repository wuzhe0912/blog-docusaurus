---
id: css-units
title: "[Medium] \U0001F3F7️ Đơn vị CSS"
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. Giải thích sự khác biệt giữa `px`, `em`, `rem`, `vw`, `vh`

### Bảng so sánh nhanh

| Đơn vị | Loại        | Tương đối với                  | Bị ảnh hưởng bởi cha | Công dụng phổ biến                     |
| ------ | ----------- | ------------------------------ | --------------------- | -------------------------------------- |
| `px`   | Tuyệt đối   | Pixel màn hình                 | Không                 | Đường viền, bóng đổ, chi tiết nhỏ     |
| `em`   | Tương đối   | font-size của **phần tử cha**  | Có                    | Padding, margin (theo kích thước chữ)  |
| `rem`  | Tương đối   | font-size của **phần tử gốc**  | Không                 | Font, khoảng cách, kích thước chung    |
| `vw`   | Tương đối   | 1% chiều rộng viewport         | Không                 | Chiều rộng responsive, phần tử full-width |
| `vh`   | Tương đối   | 1% chiều cao viewport          | Không                 | Chiều cao responsive, section toàn màn hình |

### Giải thích chi tiết

#### `px` (Pixels)

**Định nghĩa** : Đơn vị tuyệt đối, 1px = một điểm pixel trên màn hình

**Đặc điểm** :

- Kích thước cố định, không thay đổi theo bất kỳ thiết lập nào
- Kiểm soát chính xác nhưng thiếu linh hoạt
- Không thuận lợi cho thiết kế responsive và accessibility

**Khi nào dùng** :

```css
/* Phù hợp cho */
border: 1px solid #000; /* Đường viền */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bóng đổ */
border-radius: 4px; /* Bo góc nhỏ */

/* Không nên dùng cho */
font-size: 16px; /* Nên dùng rem cho font */
width: 1200px; /* Nên dùng % hoặc vw cho chiều rộng */
```

#### `em`

**Định nghĩa** : Bội số của font-size **phần tử cha**

**Đặc điểm** :

- Cộng dồn khi kế thừa (cấu trúc lồng nhau sẽ cộng thêm)
- Linh hoạt cao nhưng dễ mất kiểm soát
- Phù hợp cho các tình huống cần co giãn theo phần tử cha

**Ví dụ tính toán** :

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 1em; /* 24px × 1 = 24px (tương đối với font-size của chính nó) */
}

.grandchild {
  font-size: 1.5em; /* 24px × 1.5 = 36px (hiệu ứng cộng dồn!) */
}
```

**Khi nào dùng** :

```css
/* Phù hợp cho */
.button {
  font-size: 1rem;
  padding: 0.5em 1em; /* Padding theo kích thước font của nút */
}

.card-title {
  font-size: 1.2em; /* Tương đối với font cơ bản của card */
  margin-bottom: 0.5em; /* Khoảng cách theo kích thước tiêu đề */
}

/* Cẩn thận cộng dồn khi lồng nhau */
```

#### `rem` (Root em)

**Định nghĩa** : Bội số của font-size **phần tử gốc** (`<html>`)

**Đặc điểm** :

- Không cộng dồn khi kế thừa (luôn tương đối với phần tử gốc)
- Dễ quản lý và bảo trì
- Thuận tiện cho việc co giãn toàn cục
- Một trong những đơn vị được khuyến nghị nhất

**Ví dụ tính toán** :

```css
html {
  font-size: 16px; /* Mặc định trình duyệt */
}

.element {
  font-size: 1.5rem; /* 16px × 1.5 = 24px */
  padding: 2rem; /* 16px × 2 = 32px */
  margin: 1rem 0; /* 16px × 1 = 16px */
}

.nested .element {
  font-size: 1.5rem; /* Vẫn là 24px, không cộng dồn! */
}
```

**Khi nào dùng** :

```css
/* Được khuyến nghị nhất cho */
html {
  font-size: 16px; /* Thiết lập cơ sở */
}

body {
  font-size: 1rem; /* Nội dung chính 16px */
}

h1 {
  font-size: 2.5rem; /* 40px */
}

p {
  font-size: 1rem; /* 16px */
  margin-bottom: 1rem; /* 16px */
}

.container {
  padding: 2rem; /* 32px */
  max-width: 75rem; /* 1200px */
}

/* Thuận tiện cho dark mode hoặc điều chỉnh accessibility */
@media (prefers-reduced-motion: reduce) {
  html {
    font-size: 18px; /* Tất cả đơn vị rem tự động phóng to */
  }
}
```

#### `vw` (Viewport Width)

**Định nghĩa** : 1% chiều rộng viewport (100vw = chiều rộng viewport)

**Đặc điểm** :

- Đơn vị responsive thực sự
- Thay đổi theo thời gian thực khi kích thước cửa sổ trình duyệt thay đổi
- Lưu ý: 100vw bao gồm chiều rộng thanh cuộn

**Ví dụ tính toán** :

```css
/* Giả sử chiều rộng viewport 1920px */
.element {
  width: 50vw; /* 1920px × 50% = 960px */
  font-size: 5vw; /* 1920px × 5% = 96px */
}

/* Giả sử chiều rộng viewport 375px (điện thoại) */
.element {
  width: 50vw; /* 375px × 50% = 187.5px */
  font-size: 5vw; /* 375px × 5% = 18.75px */
}
```

**Khi nào dùng** :

```css
/* Phù hợp cho */
.hero {
  width: 100vw; /* Banner toàn chiều rộng */
  margin-left: calc(-50vw + 50%); /* Vượt ra ngoài container */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 5rem); /* Font responsive */
}

.responsive-box {
  width: 80vw;
  max-width: 1200px; /* Thêm giới hạn tối đa */
}

/* Tránh */
body {
  width: 100vw; /* Sẽ gây thanh cuộn ngang (vì bao gồm chiều rộng thanh cuộn) */
}
```

#### `vh` (Viewport Height)

**Định nghĩa** : 1% chiều cao viewport (100vh = chiều cao viewport)

**Đặc điểm** :

- Phù hợp cho hiệu ứng toàn màn hình
- Trên thiết bị di động cần lưu ý vấn đề thanh địa chỉ
- Có thể bị ảnh hưởng khi bàn phím bật lên

**Khi nào dùng** :

```css
/* Phù hợp cho */
.hero-section {
  height: 100vh; /* Trang chủ toàn màn hình */
}

.fullscreen-modal {
  height: 100vh;
  width: 100vw;
}

.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
}

/* Giải pháp thay thế cho thiết bị di động */
.hero-section {
  height: 100vh;
  height: 100dvh; /* Chiều cao viewport động (đơn vị mới hơn) */
}

/* Căn giữa theo chiều dọc */
.center-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Khuyến nghị thực tế và best practice

#### 1. Xây dựng hệ thống font responsive

```css
/* Thiết lập cơ sở */
html {
  font-size: 16px; /* Mặc định desktop */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* Tablet */
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px; /* Điện thoại */
  }
}

/* Tất cả phần tử dùng rem sẽ tự động co giãn */
h1 {
  font-size: 2.5rem;
} /* Desktop 40px, Điện thoại 30px */
p {
  font-size: 1rem;
} /* Desktop 16px, Điện thoại 12px */
```

#### 2. Kết hợp các đơn vị khác nhau

```css
.card {
  /* Chiều rộng responsive + giới hạn phạm vi */
  width: 90vw;
  max-width: 75rem;

  /* rem cho khoảng cách */
  padding: 2rem;
  margin: 1rem auto;

  /* px cho chi tiết */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  /* clamp kết hợp nhiều đơn vị, co giãn mượt mà */
  font-size: clamp(1.25rem, 3vw, 2rem);
}
```

### Mẫu trả lời phỏng vấn

**Cấu trúc trả lời** :

```markdown
1. **px** : Chi tiết nhỏ pixel -> đường viền, bóng đổ, bo góc nhỏ
2. **rem** : Nền tảng ổn định -> font, khoảng cách, kích thước chính
3. **em** : Theo phần tử cha
4. **vw** : Theo chiều rộng viewport -> chiều rộng responsive
5. **vh** : Theo chiều cao viewport -> section toàn màn hình
```

1. **Định nghĩa nhanh**

   - px là đơn vị tuyệt đối, còn lại là tương đối
   - em tương đối với cha, rem tương đối với gốc
   - vw/vh tương đối với kích thước viewport

2. **Khác biệt chính**

   - rem không cộng dồn, em cộng dồn (khác biệt chính)
   - vw/vh responsive thực sự, nhưng cần lưu ý vấn đề thanh cuộn

3. **Ứng dụng thực tế**

   - **px** : Đường viền 1px, bóng đổ và chi tiết khác
   - **rem** : Font, khoảng cách, container (phổ biến nhất, dễ bảo trì)
   - **em** : Padding nút (khi cần theo co giãn font)
   - **vw/vh** : Banner full-width, section toàn màn hình, font responsive kết hợp clamp

4. **Best practice**
   - Thiết lập html font-size làm cơ sở
   - Dùng clamp() kết hợp các đơn vị khác nhau
   - Lưu ý vấn đề vh trên di động (có thể dùng dvh)

### Reference

- [MDN - CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Units - A Complete Guide](https://www.freecodecamp.org/news/css-unit-guide/)
- [Modern CSS Solutions](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
