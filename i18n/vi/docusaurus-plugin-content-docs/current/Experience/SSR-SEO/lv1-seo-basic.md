---
title: '[Lv1] SEO Cơ bản: Chế độ Router và Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> Trong dự án nền tảng đa thương hiệu, triển khai cấu hình SEO cơ bản: Router History Mode, cấu trúc Meta Tags và SEO cho trang tĩnh.

---

## 1. Trọng tâm trả lời phỏng vấn

1. **Lựa chọn chế độ Router**: Sử dụng History Mode thay vì Hash Mode để cung cấp cấu trúc URL gọn gàng.
2. **Cơ bản về Meta Tags**: Triển khai đầy đủ các SEO meta tags, bao gồm Open Graph và Twitter Card.
3. **SEO trang tĩnh**: Cấu hình đầy đủ các phần tử SEO cho Landing Page.

---

## 2. Cấu hình Router History Mode

### 2.1 Tại sao chọn History Mode?

**Vị trí file:** `quasar.config.js`

```javascript
// Dòng 82
vueRouterMode: "history", // Sử dụng chế độ history thay vì chế độ hash
```

**Ưu điểm SEO:**

| Chế độ           | Ví dụ URL | Ảnh hưởng SEO                      |
| ---------------- | --------- | ----------------------------------- |
| **Hash Mode**    | `/#/home` | ❌ Khó được công cụ tìm kiếm index  |
| **History Mode** | `/home`   | ✅ URL gọn gàng, dễ được index      |

**Điểm khác biệt chính:**

- History Mode tạo ra URL gọn gàng (ví dụ: `/home` thay vì `/#/home`)
- Công cụ tìm kiếm dễ dàng index và crawl hơn
- Trải nghiệm người dùng và chia sẻ tốt hơn
- Cần hỗ trợ từ phía backend (tránh lỗi 404)

### 2.2 Yêu cầu cấu hình backend

Khi sử dụng History Mode, cần cấu hình backend:

```nginx
# Ví dụ Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Cách này đảm bảo tất cả các route đều trả về `index.html`, để Router frontend xử lý.

---

## 3. Cấu trúc cơ bản của Meta Tags

### 3.1 Meta Tags SEO cơ bản

**Vị trí file:** `template/*/public/landingPage/index.html`

```html
<!-- Meta Tags cơ bản -->
<meta charset="UTF-8" />
<title>AMUSE VIP</title>
<meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
<meta
  name="description"
  content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
/>
```

**Giải thích:**

- `title`: Tiêu đề trang, ảnh hưởng đến hiển thị kết quả tìm kiếm
- `keywords`: Từ khóa (SEO hiện đại ít quan trọng hơn, nhưng vẫn nên thiết lập)
- `description`: Mô tả trang, sẽ hiển thị trong kết quả tìm kiếm

### 3.2 Open Graph Tags (Chia sẻ mạng xã hội)

```html
<!-- Open Graph Tags -->
<meta property="og:site_name" content="AMUSE VIP" />
<meta property="og:title" content="AMUSE VIP" />
<meta property="og:type" content="website" />
<meta property="og:url" content="#" />
<meta property="og:description" content="..." />
<meta property="og:image" content="images/amuse.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

**Mục đích:**

- Hiển thị preview khi chia sẻ trên các mạng xã hội như Facebook, LinkedIn
- Kích thước khuyến nghị cho `og:image`: 1200x630px
- `og:type` có thể đặt là `website`, `article`, v.v.

### 3.3 Twitter Card Tags

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AMUSE VIP" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="images/amuse.webp" />
```

**Các loại Twitter Card:**

- `summary`: Card nhỏ
- `summary_large_image`: Card ảnh lớn (khuyến nghị)

---

## 4. Triển khai SEO cho Landing Page tĩnh

### 4.1 Danh sách đầy đủ các phần tử SEO

Trong Landing Page của dự án, đã triển khai các phần tử SEO sau:

```html
✅ Thẻ Title ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags (Facebook, LinkedIn, v.v.) ✅ Twitter Card tags ✅ Canonical URL ✅ Cấu hình Favicon
```

### 4.2 Ví dụ triển khai

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO cơ bản -->
    <title>AMUSE VIP</title>
    <meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
    <meta
      name="description"
      content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
    />

    <!-- Open Graph -->
    <meta property="og:site_name" content="AMUSE VIP" />
    <meta property="og:title" content="AMUSE VIP" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://example.com" />
    <meta property="og:description" content="..." />
    <meta property="og:image" content="images/amuse.webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="AMUSE VIP" />
    <meta name="twitter:description" content="..." />
    <meta name="twitter:image" content="images/amuse.webp" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://example.com" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="favicon.png" />
  </head>
  <body>
    <!-- Nội dung trang -->
  </body>
</html>
```

---

## 5. Tổng hợp điểm mấu chốt phỏng vấn

### 5.1 Lựa chọn chế độ Router

**Tại sao chọn History Mode?**

- Cung cấp URL gọn gàng, nâng cao hiệu quả SEO
- Công cụ tìm kiếm dễ dàng index hơn
- Trải nghiệm người dùng tốt hơn

**Cần lưu ý gì?**

- Cần hỗ trợ cấu hình backend (tránh lỗi 404 khi truy cập trực tiếp vào route)
- Cần thiết lập cơ chế fallback

### 5.2 Tầm quan trọng của Meta Tags

**Meta Tags cơ bản:**

- `title`: Ảnh hưởng đến hiển thị kết quả tìm kiếm
- `description`: Ảnh hưởng đến tỷ lệ nhấp chuột
- `keywords`: SEO hiện đại ít quan trọng hơn, nhưng vẫn nên thiết lập

**Meta Tags mạng xã hội:**

- Open Graph: Preview chia sẻ trên Facebook, LinkedIn và các nền tảng khác
- Twitter Card: Preview chia sẻ trên Twitter
- Kích thước ảnh khuyến nghị: 1200x630px

---

## 6. Thực hành tốt nhất

1. **Thẻ Title**

   - Kiểm soát độ dài trong 50-60 ký tự
   - Bao gồm từ khóa chính
   - Mỗi trang nên có title độc nhất

2. **Description**

   - Kiểm soát độ dài trong 150-160 ký tự
   - Mô tả ngắn gọn nội dung trang
   - Bao gồm lời kêu gọi hành động (CTA)

3. **Ảnh Open Graph**

   - Kích thước: 1200x630px
   - Dung lượng file: < 1MB
   - Sử dụng ảnh chất lượng cao

4. **Canonical URL**
   - Tránh vấn đề nội dung trùng lặp
   - Trỏ đến URL của phiên bản chính

---

## 7. Tóm tắt phỏng vấn

**Có thể trả lời như sau:**

> Trong dự án, tôi chọn sử dụng History Mode của Vue Router thay vì Hash Mode, vì History Mode cung cấp cấu trúc URL gọn gàng, thân thiện hơn với SEO. Đồng thời, tôi cũng triển khai đầy đủ SEO meta tags cho Landing Page, bao gồm title, description, keywords cơ bản, cũng như Open Graph và Twitter Card tags, đảm bảo hiển thị đúng nội dung preview khi chia sẻ trên mạng xã hội.

**Điểm chính:**

- ✅ Lựa chọn và lý do sử dụng Router History Mode
- ✅ Cấu trúc đầy đủ của Meta Tags
- ✅ Tối ưu hóa chia sẻ mạng xã hội
- ✅ Kinh nghiệm dự án thực tế
