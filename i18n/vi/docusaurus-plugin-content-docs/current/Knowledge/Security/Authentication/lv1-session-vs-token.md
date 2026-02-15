---
id: login-lv1-session-vs-token
title: '[Lv1] Su khac biet giua Session-based va Token-based la gi?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Cau hoi thuong gap trong phong van: ban co hieu su khac biet giua Session truyen thong va Token hien dai khong? Nam vung cac diem chinh duoi day de nhanh chong sap xep cau tra loi.

---

## 1. Khai niem cot loi cua hai phuong thuc xac thuc

### Session-based Authentication

- **Trang thai luu tren server**: sau khi nguoi dung dang nhap lan dau, server tao Session trong bo nho hoac co so du lieu, tra ve Session ID luu trong Cookie.
- **Cac request tiep theo dua vao Session ID**: trinh duyet tu dong gui Cookie tren cung domain, server tim thong tin nguoi dung tuong ung qua Session ID.
- **Pho bien trong ung dung MVC / monolithic truyen thong**: server dam nhan render trang va duy tri trang thai nguoi dung.

### Token-based Authentication (vi du JWT)

- **Trang thai luu tren client**: sau khi dang nhap thanh cong, mot Token duoc tao ra (co the mang thong tin nguoi dung va quyen han), front-end luu tru.
- **Moi request gui kem Token**: thuong dat trong `Authorization: Bearer <token>`, server xac minh chu ky la co the lay duoc thong tin nguoi dung.
- **Pho bien trong SPA / microservices**: back-end chi can xac minh Token, khong can luu trang thai nguoi dung.

---

## 2. So sanh luong request

| Buoc luong     | Session-based                                           | Token-based (JWT)                                                     |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Dang nhap thanh cong | Server tao Session, tra ve `Set-Cookie: session_id=...` | Server ky Token, tra ve JSON: `{ access_token, expires_in, ... }` |
| Vi tri luu tru | Cookie trinh duyet (thuong la httponly)                  | Front-end tu chon: `localStorage`, `sessionStorage`, Cookie, Memory   |
| Request tiep theo | Trinh duyet tu dong gui Cookie, server tra cuu bang de lay thong tin nguoi dung | Front-end thu cong dinh kem `Authorization` trong Header |
| Phuong thuc xac minh | Tra cuu Session Store                               | Xac minh chu ky Token, hoac doi chieu danh sach den / trang          |
| Dang xuat      | Xoa Session tren server, gui `Set-Cookie` de xoa Cookie | Front-end xoa Token; neu can vo hieu hoa thi phai ghi vao danh sach den hoac thay doi khoa |

---

## 3. Tong hop uu nhuoc diem

| Khia canh      | Session-based                                                                 | Token-based (JWT)                                                                 |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Uu diem        | - Cookie tu dong gui, don gian phia trinh duyet<br />- Session co the luu nhieu du lieu<br />- De thu hoi va buoc dang xuat | - Khong trang thai, de mo rong ngang<br />- Phu hop SPA, mobile, microservices<br />- Token co the su dung xuyen domain va xuyen thiet bi |
| Nhuoc diem     | - Server phai duy tri Session Store, ton bo nho<br />- Trien khai phan tan can dong bo Session | - Token co kich thuoc lon hon, gui trong moi request<br />- Kho thu hoi, can co che danh sach den / xoay khoa |
| Rui ro bao mat | - De bi tan cong CSRF (Cookie tu dong gui)<br />- Neu lo Session ID, can xoa ngay | - De bi anh huong boi XSS (neu luu o vi tri co the doc)<br />- Neu Token bi danh cap truoc khi het han, co the bi tai su dung |
| Truong hop su dung | - Web truyen thong (SSR) + cung domain<br />- Server dam nhan render trang | - API RESTful / GraphQL<br />- App mobile, SPA, microservices |

---

## 4. Cach chon lua?

### Tu hoi ba cau hoi

1. **Co can trang thai dang nhap dung chung giua cac domain hoac thiet bi khong?**
   - Co -> Token-based linh hoat hon.
   - Khong -> Session-based don gian hon.

2. **Trien khai co nhieu server hoac microservices khong?**
   - Co -> Token-based giam nhu cau sao chep hoac tap trung Session.
   - Khong -> Session-based don gian va an toan.

3. **Co yeu cau bao mat cao (ngan hang, he thong doanh nghiep) khong?**
   - Yeu cau cao -> Session-based + httponly Cookie + bao ve CSRF van la chu dao.
   - API nhe hoac dich vu mobile -> Token-based + HTTPS + Refresh Token + chien luoc danh sach den.

### Cac chien luoc ket hop pho bien

- **He thong noi bo doanh nghiep**: Session-based + dong bo Redis / database.
- **SPA hien dai + app mobile**: Token-based (Access Token + Refresh Token).
- **Microservices lon**: Token-based (JWT) ket hop xac minh qua API Gateway.

---

## 5. Mau tra loi phong van

> "Session truyen thong luu trang thai tren server, tra ve session id trong Cookie, trinh duyet tu dong gui Cookie trong moi request, nen rat phu hop voi Web App tren cung domain. Nhuoc diem la server phai duy tri Session Store, neu trien khai nhieu may thi phai dong bo.
> Nguoc lai, Token-based (vi du JWT) ma hoa thong tin nguoi dung thanh Token luu tren client, front-end thu cong dinh kem trong Header moi request. Cach nay la khong trang thai, phu hop voi SPA va microservices, de mo rong hon.
> Ve bao mat, Session can chu y CSRF, Token can chu y XSS. Neu toi can lam viec xuyen domain, mobile hoac tich hop nhieu dich vu, toi se chon Token; neu la he thong doanh nghiep truyen thong, server render, toi se chon Session ket hop httponly Cookie."

---

## 6. Ghi nho mo rong trong phong van

- Session -> tap trung vao **bao ve CSRF, chien luoc dong bo Session, bao lau thi xoa**.
- Token -> tap trung vao **vi tri luu tru (Cookie vs localStorage)**, **co che Refresh Token**, **danh sach den / xoay khoa**.
- Co the bo sung giai phap thoa hiep pho bien trong doanh nghiep: luu Token trong `httpOnly Cookie`, ket hop them CSRF Token.

---

## 7. Tai lieu tham khao

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
