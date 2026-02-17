---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Hay giai thich va so sanh uu nhuoc diem cua SPA va SSR

### SPA (Ung dung Trang don)

#### Uu diem SPA

1. Trai nghiem nguoi dung: Ban chat cua SPA la mot trang duy nhat, chi tai du lieu dong va ket hop routing frontend de nguoi dung cam thay nhu dang chuyen trang, nhung thuc te chi dang chuyen component. Trai nghiem su dung nay tu nhien muot ma va nhanh hon.
2. Tach biet frontend-backend: Frontend chi can dam nhan render trang va tuong tac, con backend chi can cung cap API du lieu. Giam bot ganh nang phat trien cua ca hai phia va de bao tri hon.
3. Toi uu mang: Chi can tai trang mot lan, khong nhu cau truc da trang truyen thong phai tai lai moi lan chuyen trang, giam so luong request va ganh nang server.

#### Nhuoc diem SPA

1. SEO: Trang SPA duoc tai dong, nen cong cu tim kiem khong the truc tiep lay noi dung trang (du Google tuyen bo dang cai thien dieu nay). Doi voi crawler tim kiem, van khong bang HTML truyen thong.
2. Thoi gian tai lan dau: SPA can tai va thuc thi JavaScript o client truoc khi render trang, nen thoi gian tai lan dau dai hon, dac biet khi mang khong tot.

### SSR (Render Phia Server)

#### Uu diem SSR

1. SEO: SSR render trang chua du lieu san o server, nen cong cu tim kiem co the lay truc tiep noi dung trang. Day la uu diem lon nhat cua SSR.
2. Thoi gian tai: SSR chuyen ganh nang render sang server, co the rut ngan thoi gian render lan dau truy cap.

#### Nhuoc diem SSR

1. Chi phi hoc va do phuc tap: Lay Next va Nuxt lam vi du, du ban chat deu dua tren React va Vue, nhung da phat trien he sinh thai rieng, tang chi phi hoc. Nhin phien ban Next.js 14 gan day, khach quan ma noi khong phai moi developer deu chap nhan duoc thay doi nhu vay.
2. Ganh nang server: Vi cong viec render chuyen sang server, co the tao ganh nang lon hon cho server, dac biet trong cac tinh huong luu luong cao.

### Ket luan

Nguyen tac la, neu la he thong back-office khong co nhu cau SEO, khong can thiet su dung framework SSR. Tru khi la trang web san pham phu thuoc vao cong cu tim kiem, thi co the danh gia viec su dung framework SSR.

## 2. Hay trinh bay ve cac Web Framework da su dung va so sanh uu nhuoc diem

**Ca hai deu dang hoi tu ve "phat trien component dua tren ham":**

> Vue 3 thong qua Composition API, tach logic thanh cac composable tai su dung; React lay Hooks lam cot loi. Ve trai nghiem developer, ca hai kha tuong dong, nhung nhin chung Vue co chi phi nhap mon thap hon, con React manh hon ve he sinh thai va tinh linh hoat.

### Vue (chu yeu Vue 3)

**Uu diem:**

- **Duong cong hoc tap thoai mai hon**: SFC (Single File Component) gop template / script / style lai, rat than thien voi developer chuyen tu frontend truyen thong (backend template).
- **Quy uoc chinh thuc ro rang, co loi cho team**: Huong dan phong cach va quy uoc chinh thuc ro rang, thanh vien moi de duy tri tinh nhat quan khi tiep nhan du an.
- **He sinh thai cot loi hoan chinh**: Chinh thuc duy tri Vue Router, Pinia (hoac Vuex), CLI / Vite Plugin, v.v., tu tao du an den quan ly state, routing deu co "giai phap chinh thuc", giam chi phi lua chon.
- **Composition API nang cao kha nang bao tri**: Co the tach logic theo chuc nang thanh composable (vi du: useAuth, useForm), chia se logic va giam code trung lap trong du an lon.

**Nhuoc diem:**

- **He sinh thai va cong dong nho hon React mot chut**: So luong va da dang cua package ben thu ba khong bang React, mot so cong cu tien tien uu tien React truoc.
- **Thi truong viec lam tap trung o cac khu vuc/nganh cu the**: So voi React, cac team quoc te hoac da quoc gia chu yeu dung React, bat loi ve tinh linh hoat nghe nghiep (nhung trong vung noi tieng Hoa thi khoang nua nua).

---

### React

**Uu diem:**

- **He sinh thai khong lo, toc do cap nhat cong nghe nhanh**: Hau het tat ca cong nghe frontend moi, he thong thiet ke hoac dich vu ben thu ba deu uu tien cung cap phien ban React.
- **Linh hoat cao, tu do ket hop stack cong nghe theo du an**: Ket hop voi Redux / Zustand / Recoil va cac state management khac, cung co Meta Framework nhu Next.js, Remix, voi giai phap chin muoi tu SPA den SSR, SSG, CSR.
- **Tich hop chin muoi voi TypeScript va ky thuat frontend**: Nhieu thao luan cong dong ve typing va best practices cho du an lon, huu ich cho cac du an bao tri dai han.

**Nhuoc diem:**

- **Tu do cao, team can tu dinh quy tac**: Khong co coding style ro rang hay quy uoc kien truc, cac developer co the dung cach viet va state management hoan toan khac nhau, tang chi phi bao tri.
- **Duong cong hoc tap thuc te khong thap**: Ngoai React (JSX, tu duy Hooks), con phai doi mat voi Router, state management, data fetching, SSR, v.v., nguoi moi de bi lac trong "chon library nao".
- **Thay doi API va tien hoa best practices nhanh**: Tu Class Component sang Function Component + Hooks, roi Server Components, khi du an cu va phong cach moi cung ton tai, can chi phi di chuyen va bao tri them.
