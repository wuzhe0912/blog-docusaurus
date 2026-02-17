---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## So sanh

| Thuoc tinh | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Vong doi | Mac dinh se bi xoa khi dong trang, tru khi dat thoi gian het han (Expires) hoac thoi gian luu tru toi da (Max-Age) | Xoa khi dong trang | Luu tru vinh vien cho den khi xoa thu cong |
| HTTP Request | Co, co the gui den Server thong qua Cookie header | Khong | Khong |
| Tong dung luong | 4KB | 5MB | 5MB |
| Pham vi truy cap | Giua cac cua so/tab | Chi trong cung tab | Giua cac cua so/tab |
| Bao mat | JavaScript khong the truy cap `HttpOnly cookies` | Khong | Khong |

## Giai thich thuat ngu

> Persistent cookies la gi?

Persistent cookie hay con goi la cookie vinh vien, la cach luu tru du lieu lau dai tren trinh duyet cua nguoi dung. Cach thuc cu the la thong qua viec thiet lap thoi gian het han nhu da de cap o tren (`Expires` hoac `Max-Age`).

## Kinh nghiem trien khai ca nhan

### `cookie`

#### 1. Xac minh bao mat

Mot so du an cu co tinh hinh bao mat khong tot, thuong xuyen xay ra van de bi danh cap tai khoan, khien chi phi van hanh tang manh. Truoc tien chon su dung thu vien [Fingerprint](https://fingerprint.com/) (ban cong dong co do chinh xac khoang 60%, ban tra phi co han muc mien phi hang thang 20.000), nhan dien moi nguoi dung dang nhap thanh visitID duy nhat thong qua cac tham so thiet bi va vi tri dia ly. Sau do tan dung dac tinh cookie duoc gui kem moi yeu cau HTTP, de backend kiem tra tinh hinh hien tai cua nguoi dung, xem co thay doi thiet bi hoac vi tri co su lech bat thuong khong. Khi phat hien bat thuong, bat buoc kich hoat xac minh OTP (email hoac SMS tuy theo yeu cau cua cong ty) trong quy trinh dang nhap.

#### 2. URL ma khuyen mai

Khi van hanh trang web san pham, thuong cung cap cac chien luoc tiep thi lien ket, cung cap URL doc quyen cho cac doi tac quang ba de ho de dang dan luong va quang ba. De dam bao nhung khach hang den thong qua dan luong thuoc ve thanh tich cua nguoi quang ba, da chon su dung tinh nang `expires` cua `cookie` de trien khai. Tu khi nguoi dung vao trang web qua dan luong, trong vong 24 gio (thoi gian gioi han co the do ben van hanh quyet dinh) ma khuyen mai bat buoc co hieu luc. Ke ca khi nguoi dung co tinh xoa tham so ma khuyen mai tren URL, khi dang ky van lay tham so tuong ung tu `cookie`, va tu dong het han sau 24 gio.

### `localStorage`

#### 1. Luu tru tuy chon nguoi dung

- Thuong dung de luu tru cac tuy chon ca nhan cua nguoi dung, vi du: dark mode, cai dat ngon ngu i18n, v.v.
- Hoac luu tru token dang nhap.
