---
id: css-box-model
title: '[Easy] \U0001F3F7️ Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## Default

`Box Model` trong `CSS` là thuật ngữ được dùng để thảo luận về cách thiết kế bố cục. Nó có thể được hiểu như một chiếc hộp bao bọc phần tử `HTML`, với bốn thuộc tính chính:

- content : chủ yếu dùng để hiển thị nội dung của phần tử, ví dụ như văn bản.
- padding : khoảng cách giữa nội dung và đường viền của phần tử.
- margin : khoảng cách giữa phần tử với các phần tử khác bên ngoài.
- border : đường viền của chính phần tử.

## box-sizing

Loại `Box Model` được sử dụng được xác định thông qua thuộc tính `box-sizing`.

Điều này có nghĩa là khi tính toán chiều rộng và chiều cao của phần tử, hai thuộc tính `padding` và `border` được tính theo hướng vào trong hay ra ngoài.

Giá trị mặc định là `content-box`, tính theo hướng ra ngoài. Trong trường hợp này, ngoài chiều rộng và chiều cao riêng của phần tử, `padding` và `border` đều phải được cộng thêm vào phép tính. Ví dụ:

```css
div {
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

Chiều rộng của `div` này được tính là `100px(width)` + `20px(padding trái-phải)` + `2px(border trái-phải)` = `122px`.

## border-box

Rõ ràng cách trên không đáng tin cậy, buộc lập trình viên front-end phải liên tục tính toán chiều rộng và chiều cao của phần tử. Để cải thiện trải nghiệm phát triển, cần chuyển sang chế độ khác: `border-box`.

Như ví dụ dưới đây, khi khởi tạo style, đặt `box-sizing` của tất cả phần tử thành `border-box`:

```css
* {
  box-sizing: border-box; // global style
}
```

Như vậy, phép tính sẽ theo hướng vào trong, thiết kế chiều rộng và chiều cao phần tử trực quan hơn, không cần cộng trừ cho `padding` hay `border`.

## Bài tập so sánh

Giả sử có cùng thiết lập style sau:

```css
.box {
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid #000;
  margin: 20px;
}
```

### content-box (giá trị mặc định)

- **Chiều rộng thực tế** = `100px(width)` + `20px(padding trái-phải)` + `10px(border trái-phải)` = `130px`
- **Chiều cao thực tế** = `100px(height)` + `20px(padding trên-dưới)` + `10px(border trên-dưới)` = `130px`
- **Vùng content** = `100px x 100px`
- **Lưu ý**: `margin` không được tính vào chiều rộng phần tử, nhưng ảnh hưởng đến khoảng cách với các phần tử khác.

### border-box

- **Chiều rộng thực tế** = `100px` (padding và border nén vào trong)
- **Chiều cao thực tế** = `100px`
- **Vùng content** = `100px` - `20px(padding trái-phải)` - `10px(border trái-phải)` = `70px x 70px`
- **Lưu ý**: `margin` cũng không được tính vào chiều rộng phần tử.

### So sánh trực quan

```
content-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (100×100)       │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
Tổng chiều rộng: 130px (không tính margin)

border-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (70×70)         │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
Tổng chiều rộng: 100px (không tính margin)
```

## Bẫy thường gặp

### 1. Xử lý margin

Dù là `content-box` hay `border-box`, **margin đều không được tính vào chiều rộng và chiều cao phần tử**. Hai chế độ chỉ ảnh hưởng đến cách tính `padding` và `border`.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 5px solid;
  margin: 20px; /* Không tính vào width */
}
/* Chiều rộng thực tế của phần tử vẫn là 100px, nhưng khoảng cách với phần tử khác tăng thêm 20px */
```

### 2. Chiều rộng phần trăm

Khi sử dụng chiều rộng phần trăm, cách tính cũng bị ảnh hưởng bởi `box-sizing`:

```css
.parent {
  width: 200px;
}

.child {
  width: 50%; /* 50% của phần tử cha = 100px */
  padding: 10px;
  border: 5px solid;
}

/* content-box: chiều rộng thực tế 130px (có thể vượt ra ngoài phần tử cha) */
/* border-box: chiều rộng thực tế 100px (đúng bằng 50% phần tử cha) */
```

### 3. Phần tử inline

`box-sizing` không có tác dụng đối với phần tử `inline`, vì thiết lập `width` và `height` của phần tử inline vốn không có hiệu lực.

```css
span {
  display: inline;
  width: 100px; /* Không có hiệu lực */
  box-sizing: border-box; /* Cũng không có hiệu lực */
}
```

### 4. min-width / max-width

`min-width` và `max-width` cũng bị ảnh hưởng bởi `box-sizing`:

```css
.box {
  box-sizing: border-box;
  min-width: 100px; /* Bao gồm padding và border */
  padding: 10px;
  border: 5px solid;
}
/* Chiều rộng tối thiểu của content = 100 - 20 - 10 = 70px */
```

## Reference

- [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [學習 CSS 版面配置](https://zh-tw.learnlayout.com/box-sizing.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
