---
id: css-pseudo-elements
title: "[Easy] \U0001F3F7️ Pseudo-element (Phần tử giả)"
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## Pseudo-element là gì

Pseudo-element là một từ khóa trong CSS, dùng để chọn một phần cụ thể của phần tử hoặc chèn nội dung trước/sau phần tử. Chúng sử dụng cú pháp **hai dấu hai chấm** `::` (chuẩn CSS3), để phân biệt với pseudo-class sử dụng một dấu hai chấm `:`.

## Các pseudo-element phổ biến

### 1. ::before và ::after

Pseudo-element được sử dụng nhiều nhất, dùng để chèn nội dung trước hoặc sau nội dung của phần tử.

```css
.icon::before {
  content: '📌';
  margin-right: 8px;
}

.external-link::after {
  content: ' ↗';
  font-size: 0.8em;
}
```

**Đặc điểm** :

- Bắt buộc phải có thuộc tính `content` (kể cả chuỗi rỗng)
- Mặc định là phần tử `inline`
- Không xuất hiện trong DOM, không thể được JavaScript chọn

### 2. ::first-letter

Chọn ký tự đầu tiên của phần tử, thường dùng cho hiệu ứng chữ cái đầu phóng to kiểu tạp chí.

```css
.article::first-letter {
  font-size: 3em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
}
```

### 3. ::first-line

Chọn dòng văn bản đầu tiên của phần tử.

```css
.intro::first-line {
  font-weight: bold;
  color: #333;
}
```

**Lưu ý** : `::first-line` chỉ có thể dùng cho phần tử cấp khối (block-level).

### 4. ::selection

Tùy chỉnh style khi người dùng chọn văn bản.

```css
::selection {
  background-color: #ffeb3b;
  color: #000;
}

/* Firefox cần thêm prefix */
::-moz-selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### 5. ::placeholder

Tùy chỉnh style của placeholder trong form.

```css
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### 6. ::marker

Tùy chỉnh style của dấu đánh dấu danh sách (list marker).

```css
li::marker {
  content: '✓ ';
  color: green;
  font-size: 1.2em;
}
```

### 7. ::backdrop

Dùng cho lớp phủ nền của phần tử toàn màn hình (như `<dialog>` hoặc video toàn màn hình).

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}
```

## Các tình huống ứng dụng thực tế

### 1. Biểu tượng trang trí

Không cần thêm phần tử HTML, thực hiện hoàn toàn bằng CSS:

```css
.success::before {
  content: '✓';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: green;
  color: white;
  border-radius: 50%;
  text-align: center;
  margin-right: 8px;
}
```

**Khi nào dùng** : Khi không muốn thêm phần tử thuần trang trí vào HTML.

### 2. Clearfix (xóa float)

Kỹ thuật xóa float kinh điển:

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

**Khi nào dùng** : Khi phần tử cha chứa phần tử con float, cần mở rộng chiều cao phần tử cha.

### 3. Trang trí trích dẫn

Tự động thêm dấu ngoặc kép cho văn bản trích dẫn:

```css
blockquote::before {
  content: open-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote::after {
  content: close-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote {
  quotes: '"' '"' '' ' ' '';
}
```

**Khi nào dùng** : Làm đẹp khối trích dẫn mà không cần nhập dấu ngoặc kép thủ công.

### 4. Hình dạng CSS thuần

Tạo hình dạng hình học bằng pseudo-element:

```css
.arrow {
  position: relative;
  width: 100px;
  height: 40px;
  background: #3498db;
}

.arrow::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  width: 0;
  height: 0;
  border-left: 20px solid #3498db;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
}
```

**Khi nào dùng** : Tạo mũi tên, tam giác và các hình đơn giản khác mà không cần hình ảnh hay SVG.

### 5. Đánh dấu trường bắt buộc

Thêm dấu sao đỏ cho các trường form bắt buộc:

```css
.required::after {
  content: ' *';
  color: red;
  font-weight: bold;
}
```

**Khi nào dùng** : Đánh dấu trường bắt buộc, giữ HTML sạch về mặt ngữ nghĩa.

### 6. Đánh dấu liên kết ngoài

Tự động thêm biểu tượng cho liên kết ngoài:

```css
a[href^='http']::after {
  content: ' 🔗';
  font-size: 0.8em;
  opacity: 0.6;
}

/* Hoặc dùng icon font */
a[target='_blank']::after {
  content: '\f08e'; /* Biểu tượng liên kết ngoài Font Awesome */
  font-family: 'FontAwesome';
  margin-left: 4px;
}
```

**Khi nào dùng** : Cải thiện trải nghiệm người dùng, cho người dùng biết sẽ mở tab mới.

### 7. Đánh số bằng counter

Tự động đánh số bằng CSS counter:

```css
.faq-list {
  counter-reset: faq-counter;
}

.faq-item::before {
  counter-increment: faq-counter;
  content: 'Q' counter(faq-counter) '. ';
  font-weight: bold;
  color: #3498db;
}
```

**Khi nào dùng** : Tự động tạo số thứ tự, không cần bảo trì thủ công.

### 8. Hiệu ứng lớp phủ

Thêm lớp phủ khi hover vào hình ảnh:

```css
.image-card {
  position: relative;
}

.image-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s;
}

.image-card:hover::after {
  background: rgba(0, 0, 0, 0.5);
}
```

**Khi nào dùng** : Khi không muốn thêm phần tử HTML để tạo hiệu ứng lớp phủ.

## Pseudo-element vs Pseudo-class

| Đặc tính    | Pseudo-element (::)                     | Pseudo-class (:)                    |
| ----------- | --------------------------------------- | ----------------------------------- |
| **Cú pháp** | Hai dấu hai chấm `::before`            | Một dấu hai chấm `:hover`          |
| **Chức năng** | Tạo/chọn một phần cụ thể của phần tử   | Chọn trạng thái cụ thể của phần tử |
| **Ví dụ**   | `::before`, `::after`, `::first-letter` | `:hover`, `:active`, `:nth-child()` |
| **DOM**      | Không tồn tại trong DOM                 | Chọn phần tử DOM thực tế           |

## Bẫy thường gặp

### 1. Thuộc tính content phải tồn tại

`::before` và `::after` bắt buộc phải có thuộc tính `content`, nếu không sẽ không hiển thị:

```css
/* Sẽ không hiển thị */
.box::before {
  width: 20px;
  height: 20px;
  background: red;
}

/* Đúng */
.box::before {
  content: ''; /* Kể cả chuỗi rỗng cũng phải thêm */
  display: block;
  width: 20px;
  height: 20px;
  background: red;
}
```

### 2. Không dùng được cho phần tử thay thế

Một số phần tử (như `<img>`, `<input>`, `<iframe>`) không thể dùng `::before` và `::after`:

```css
/* Không hợp lệ */
img::before {
  content: 'Photo:';
}

/* Dùng phần tử bao bọc thay thế */
.image-wrapper::before {
  content: 'Photo:';
}
```

### 3. Mặc định là phần tử inline

`::before` và `::after` mặc định là phần tử `inline`, cần lưu ý khi thiết lập chiều rộng và chiều cao:

```css
.box::before {
  content: '';
  display: block; /* hoặc inline-block */
  width: 100px;
  height: 100px;
}
```

### 4. Vấn đề z-index

`z-index` của pseudo-element là tương đối so với phần tử cha:

```css
.parent {
  position: relative;
}

.parent::before {
  content: '';
  position: absolute;
  z-index: -1; /* Sẽ nằm dưới phần tử cha, nhưng trên nền của phần tử cha */
}
```

### 5. Tương thích ngược với một dấu hai chấm

Quy chuẩn CSS3 sử dụng hai dấu hai chấm `::` để phân biệt pseudo-element và pseudo-class, nhưng một dấu hai chấm `:` vẫn hoạt động (tương thích ngược CSS2):

```css
/* Cách viết chuẩn CSS3 (khuyến nghị) */
.box::before {
}

/* Cách viết CSS2 (vẫn hoạt động) */
.box:before {
}
```

## Điểm trọng tâm phỏng vấn

1. **Cú pháp hai dấu hai chấm của pseudo-element** : Phân biệt pseudo-element `::` và pseudo-class `:`
2. **Thuộc tính content phải tồn tại** : Yếu tố then chốt của `::before` và `::after`
3. **Không nằm trong DOM** : Không thể được JavaScript chọn hoặc thao tác trực tiếp
4. **Không dùng được cho phần tử thay thế** : Không hợp lệ cho `<img>`, `<input>`, v.v.
5. **Tình huống ứng dụng thực tế** : Biểu tượng trang trí, xóa float, vẽ hình, v.v.

## Reference

- [Pseudo-elements - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Pseudo-elements - W3Schools](https://www.w3schools.com/css/css_pseudo_elements.asp)
- [A Whole Bunch of Amazing Stuff Pseudo Elements Can Do](https://css-tricks.com/pseudo-element-roundup/)
