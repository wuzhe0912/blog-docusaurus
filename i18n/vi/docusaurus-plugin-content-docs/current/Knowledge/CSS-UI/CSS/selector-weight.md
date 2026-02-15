---
id: selector-weight
title: "[Easy] \U0001F3F7️ Trọng số Selector"
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. Cách tính trọng số của selector?

> Làm thế nào để tính trọng số của selector?

Thứ tự ưu tiên của CSS selector nhằm giải quyết vấn đề phần tử cuối cùng áp dụng style nào:

```html
<div id="app" class="wrapper">What color ?</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

Trong ví dụ này, kết quả sẽ là màu xanh dương, vì ở đây áp dụng hai selector: ID và class. Trọng số của ID lớn hơn class, do đó style của class bị ghi đè.

### Thứ tự trọng số

> inline style > ID > class > tag

Nếu trong đoạn HTML có style inline được viết trong thẻ, mặc định trọng số của nó sẽ lớn nhất, ghi đè style trong file CSS:

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

Tuy nhiên, trong phát triển thực tế, cách viết này không được sử dụng vì khó bảo trì và dễ gây ô nhiễm style.

### Trường hợp đặc biệt

Nếu thực sự gặp style inline không thể xóa bỏ và muốn ghi đè thông qua file CSS, có thể dùng `!important`:

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

```css
#app {
  color: blue !important;
}
```

Tất nhiên, nếu có thể thì nên tránh sử dụng `!important`. Mặc dù style inline cũng có thể thêm `!important`, nhưng cá nhân tôi không cân nhắc cách viết style như vậy. Đồng thời, trừ trường hợp đặc biệt, tôi cũng không dùng ID selector mà xây dựng toàn bộ stylesheet dựa trên class.
