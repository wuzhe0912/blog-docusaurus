---
id: login-lv1-jwt-structure
title: '[Lv1] Cau truc cua JWT la gi?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> Nguoi phong van thuong hoi tiep: "JWT trong nhu the nao? Tai sao lai thiet ke nhu vay?" Hieu ro cau truc, cach ma hoa va quy trinh xac minh se giup ban tra loi nhanh chong.

---

## 1. Tong quan

JWT (JSON Web Token) la mot dinh dang Token **tu chua (self-contained)**, dung de truyen thong tin mot cach an toan giua hai ben. Noi dung gom ba chuoi ky tu noi voi nhau bang dau `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Tach ra se la ba khoi JSON duoc ma hoa Base64URL:

1. **Header**: mo ta thuat toan va loai cua Token.
2. **Payload**: chua thong tin nguoi dung va cac khai bao (claims).
3. **Signature**: duoc ky bang khoa bi mat de dam bao noi dung khong bi thay doi.

---

## 2. Chi tiet Header, Payload, Signature

### 2.1 Header (Phan dau)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: thuat toan ky, vi du `HS256` (HMAC + SHA-256), `RS256` (RSA + SHA-256).
- `typ`: loai Token, thuong la `JWT`.

### 2.2 Payload (Tai trong)

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims (duoc dang ky theo dac ta, khong bat buoc)**:
  - `iss` (Issuer): ben phat hanh
  - `sub` (Subject): chu de (thuong la ID nguoi dung)
  - `aud` (Audience): ben nhan
  - `exp` (Expiration Time): thoi gian het han (Unix timestamp, tinh bang giay)
  - `nbf` (Not Before): khong hop le truoc thoi diem nay
  - `iat` (Issued At): thoi gian phat hanh
  - `jti` (JWT ID): ma dinh danh duy nhat cua Token
- **Public / Private Claims**: co the them cac truong tuy chinh (vi du `role`, `permissions`), nhung tranh qua dai dong.

### 2.3 Signature (Chu ky)

Quy trinh tao chu ky:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- Su dung khoa bi mat (hoac khoa rieng tu) de ky len hai phan dau tien.
- Khi server nhan duoc Token, se tinh lai chu ky. Neu khop, co nghia la Token chua bi thay doi va duoc phat hanh tu nguon hop phap.

> Luu y: JWT chi dam bao tinh toan ven du lieu (Integrity), khong dam bao tinh bao mat (Confidentiality), tru khi duoc ma hoa them.

---

## 3. Ma hoa Base64URL la gi?

JWT su dung **Base64URL** thay vi Base64 thong thuong, su khac biet la:

- Thay `+` bang `-`, thay `/` bang `_`.
- Loai bo dau `=` o cuoi.

Nhu vay Token co the duoc su dung an toan trong URL, Cookie hoac Header ma khong gay van de voi cac ky tu dac biet.

---

## 4. So do quy trinh xac minh

1. Client gui Token trong Header: `Authorization: Bearer <JWT>`.
2. Server nhan duoc va:
   - Phan tich Header va Payload.
   - Xac dinh thuat toan duoc chi dinh boi `alg`.
   - Tinh lai chu ky bang khoa chia se hoac khoa cong khai.
   - So sanh chu ky va kiem tra cac truong thoi gian (`exp`, `nbf`, v.v.).
3. Chi sau khi xac minh thanh cong moi tin tuong noi dung Payload.

---

## 5. Khung tra loi phong van

> "JWT gom ba phan: Header, Payload va Signature, noi voi nhau bang dau `.`.
> Header mo ta thuat toan va loai; Payload chua thong tin nguoi dung va mot so truong chuan nhu `iss`, `sub`, `exp`; Signature ky len hai phan dau bang khoa bi mat de xac nhan noi dung chua bi thay doi.
> Noi dung la JSON duoc ma hoa Base64URL, nhung khong duoc ma hoa, chi la chuyen doi, nen du lieu nhay cam khong nen dat truc tiep vao trong. Server nhan Token se tinh lai chu ky de so sanh, neu khop va chua het han thi Token hop le."

---

## 6. Goi y mo rong trong phong van

- **Bao mat**: Payload co the duoc giai ma, tuyet doi khong luu mat khau, so the tin dung va cac thong tin nhay cam.
- **Het han va lam moi**: thuong ket hop Access Token ngan han + Refresh Token dai han.
- **Thuat toan ky**: co the de cap su khac biet giua doi xung (HMAC) va bat doi xung (RSA, ECDSA).
- **Tai sao khong the tao Token vo han?**: Token qua lon se tang chi phi truyen tai mang va co the bi trinh duyet tu choi.

---

## 7. Tai lieu tham khao

- [Trang web chinh thuc JWT](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
