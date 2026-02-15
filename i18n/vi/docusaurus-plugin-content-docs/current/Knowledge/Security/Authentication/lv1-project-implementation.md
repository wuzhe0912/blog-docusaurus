---
id: login-lv1-project-implementation
title: '[Lv1] Co che dang nhap trong cac du an truoc day duoc trien khai nhu the nao?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Muc tieu: trinh bay ro rang trong 3-5 phut cach front-end xu ly dang nhap, duy tri trang thai va bao ve trang, de co the nhac lai nhanh trong phong van.

---

## 1. Cac truc chinh tra loi phong van

1. **Ba giai doan dang nhap**: gui form -> back-end xac thuc -> luu Token va chuyen trang.
2. **Quan ly trang thai va Token**: Pinia ket hop luu tru ben vung, Axios Interceptor tu dong dinh kem Bearer Token.
3. **Xu ly tiep theo va bao ve**: khoi tao du lieu dung chung, route guard, dang xuat va cac truong hop dac biet (OTP, buoc doi mat khau).

Bat dau voi ba diem chinh nay, sau do mo rong chi tiet theo yeu cau de nguoi phong van cam nhan ban co tam nhin tong the.

---

## 2. Cau truc he thong va phan cong trach nhiem

| Module           | Vi tri                              | Vai tro                                                    |
| ---------------- | ----------------------------------- | ---------------------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Luu trang thai dang nhap, luu tru Token ben vung, cung cap getter |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Dong goi luong dang nhap / dang xuat, format tra ve thong nhat |
| API dang nhap    | `src/api/login.ts`                  | Goi `POST /login`, `POST /logout` den back-end             |
| Axios Utility    | `src/common/utils/request.ts`       | Request / Response Interceptor, xu ly loi thong nhat       |
| Route Guard      | `src/router/index.ts`               | Kiem tra theo `meta` xem co can dang nhap khong, chuyen huong den trang dang nhap |
| Luong khoi tao   | `src/common/composables/useInit.ts` | Khi app khoi dong, kiem tra co Token chua, tai du lieu can thiet |

> Cach nho: **"Store quan ly trang thai, Hook quan ly luong, Interceptor quan ly kenh, Guard quan ly trang"**.

---

## 3. Luong dang nhap (phan tich tung buoc)

### Buoc 0. Form va kiem tra truoc

- Ho tro hai cach dang nhap: mat khau thong thuong va ma xac minh SMS.
- Kiem tra co ban truoc khi gui (truong bat buoc, dinh dang, chong gui trung).

### Buoc 1. Goi API dang nhap

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` xu ly loi va quan ly loading thong nhat.
- Khi thanh cong, `data` se tra ve Token va thong tin co ban cua nguoi dung.

### Buoc 2. Xu ly phan hoi tu back-end

| Tinh huong                                         | Hanh dong                                                  |
| -------------------------------------------------- | ---------------------------------------------------------- |
| **Can xac minh bo sung** (vd. dang nhap lan dau can xac nhan danh tinh) | Dat `authStore.onBoarding` thanh `true`, chuyen den trang xac minh |
| **Buoc doi mat khau**                              | Chuyen den luong doi mat khau voi cac tham so can thiet    |
| **Thanh cong binh thuong**                         | Goi `authStore.$patch()` luu Token va thong tin nguoi dung |

### Buoc 3. Hanh dong chung sau khi dang nhap

1. Lay thong tin co ban nguoi dung va danh sach vi.
2. Khoi tao noi dung ca nhan (vi du: danh sach qua tang, thong bao).
3. Chuyen den trang noi bo theo `redirect` hoac route da dinh.

> Dang nhap thanh cong chi la mot nua, **du lieu dung chung can duoc bo sung tai thoi diem nay** de tranh moi trang lai goi API rieng.

---

## 4. Quan ly vong doi Token

### 4.1 Chien luoc luu tru

- `authStore` bat `persist: true`, ghi cac truong quan trong vao `localStorage`.
- Uu diem: trang thai tu dong phuc hoi sau khi tai lai trang; nhuoc diem: can tu quan ly rui ro XSS.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- Cac API can xac thuc se tu dong dinh kem Bearer Token.
- Neu API duoc danh dau ro rang `needToken: false` (dang nhap, dang ky, v.v.), se bo qua viec dinh kem.

### 4.3 Xu ly het han va ngoai le

- Neu back-end tra ve Token het han hoac khong hop le, Response Interceptor se thong nhat chuyen thanh thong bao loi va kich hoat luong dang xuat.
- Co the mo rong them co che Refresh Token, hien tai du an su dung chien luoc don gian.

---

## 5. Bao ve route va khoi tao

### 5.1 Route Guard

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- `meta.needAuth` quyet dinh co kiem tra trang thai dang nhap khong.
- Khi chua dang nhap, chuyen den trang dang nhap hoac trang cong khai duoc chi dinh.

### 5.2 Khoi tao khi ung dung khoi dong

`useInit` xu ly khi App khoi dong:

1. Kiem tra URL co chua `login_token` hoac `platform_token` khong; neu co thi tu dong dang nhap hoac thiet lap Token.
2. Neu Store da co Token, tai thong tin nguoi dung va du lieu dung chung.
3. Khong co Token thi o lai trang cong khai, doi nguoi dung dang nhap thu cong.

---

## 6. Luong dang xuat (don dep va ket thuc)

1. Goi `POST /logout` thong bao cho back-end.
2. Thuc thi `reset()`:
   - `authStore.$reset()` xoa thong tin dang nhap.
   - Cac Store lien quan (thong tin nguoi dung, yeu thich, ma gioi thieu, v.v.) cung duoc reset.
3. Don dep cache phia trinh duyet (vi du: cache trong `localStorage`).
4. Chuyen ve trang dang nhap hoac trang chu.

> Dang xuat la hinh anh phan chieu cua dang nhap: khong chi la xoa Token, ma con phai dam bao tat ca trang thai phu thuoc duoc don sach de tranh du lieu con sot.

---

## 7. Cac van de thuong gap va thuc hanh tot nhat

- **Tach luong**: tach rieng dang nhap va khoi tao sau dang nhap de giu hook gon gang.
- **Xu ly loi**: thong nhat qua `useApi` va Response Interceptor, dam bao giao dien hien thi nhat quan.
- **Bao mat**:
  - Su dung HTTPS toan trinh.
  - Khi Token luu trong `localStorage`, can luu y XSS voi cac thao tac nhay cam.
  - Can nhac httpOnly Cookie hoac Refresh Token khi can thiet.
- **Phuong an du phong**: cac tinh huong OTP, buoc doi mat khau duoc giu linh hoat, hook tra ve trang thai de giao dien xu ly.

---

## 8. Ghi nho nhanh cho phong van

1. **"Nhap -> Xac thuc -> Luu tru -> Chuyen trang"**: mo ta luong tong the theo thu tu nay.
2. **"Store nho trang thai, Interceptor dinh kem header, Guard chan nguoi la"**: nhan manh phan cong kien truc.
3. **"Bo sung du lieu dung chung ngay sau dang nhap"**: the hien su nhay cam voi trai nghiem nguoi dung.
4. **"Dang xuat la reset mot lan + quay ve trang an toan"**: quan tam den bao mat va ket thuc luong.
