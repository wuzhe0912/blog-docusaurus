---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Ban co the giai thich CSP (Content Security Policy) la gi khong?

> Can you explain what CSP (Content Security Policy) is?

Ve nguyen tac, CSP la mot co che tang cuong bao mat cho trang web, cho phep cau hinh HTTP header de gioi han cac nguon du lieu ma noi dung trang web co the tai (danh sach trang), nham ngan chan ke tan cong tiem script doc hai de danh cap du lieu nguoi dung.

Tu goc do front-end, de phong chong tan cong XSS (Cross-site scripting), phan lon su dung cac framework hien dai de phat trien, vi chung cung cap co che bao ve co ban. Vi du, JSX cua React tu dong escape HTML, Vue thi thong qua cach bind du lieu `{{ data }}` dong thoi tu dong escape cac the HTML.

Mac du front-end co kha han che trong linh vuc nay, van co mot so toi uu chi tiet co the xu ly:

1. Neu co form nhap noi dung, co the xac thuc cac ky tu dac biet de tranh tan cong (nhung thuc te rat kho luong truoc moi tinh huong), nen phan lon chon cach gioi han do dai de kiem soat noi dung nhap tu client, hoac gioi han loai du lieu dau vao.
2. Khi can tham chieu lien ket ngoai, tranh dung http url ma dung https url.
3. Voi trang web tinh, co the cau hinh meta tag de gioi han, nhu sau:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: mac dinh chi cho phep tai du lieu tu cung nguon goc (cung domain).
- `img-src https://*`: chi cho phep tai hinh anh qua giao thuc HTTPS.
- `child-src 'none'`: khong cho phep nhung bat ky tai nguyen con ben ngoai nao, vi du `<iframe>`.

## 2. Tan cong XSS (Cross-site scripting) la gi?

> What is XSS (Cross-site scripting) attack?

XSS, hay tan cong scripting xuyen trang, la khi ke tan cong tiem script doc hai, khien no chay tren trinh duyet cua nguoi dung, tu do lay cap du lieu nhay cam nhu cookie, hoac truc tiep thay doi noi dung trang web de dan nguoi dung den trang web doc hai.

### Phong chong XSS kieu luu tru

Ke tan cong co the thong qua binh luan, co tinh chen HTML hoac script doc hai vao co so du lieu. Luc nay ngoai viec back-end se escape, cac framework front-end hien dai nhu JSX cua React hoac template Vue `{{ data }}` cung ho tro escape, giam thieu kha nang tan cong XSS.

### Phong chong XSS kieu phan xa

Tranh su dung `innerHTML` de thao tac DOM, vi nhu vay co co hoi thuc thi cac the HTML. Thuong khuyen nghi su dung `textContent` de thao tac.

### Phong chong XSS dua tren DOM

Ve nguyen tac, chung ta co gang khong cho nguoi dung truc tiep chen HTML vao trang. Neu co nhu cau ve tinh huong, ban than framework cung co cac directive tuong tu de ho tro, vi du `dangerouslySetInnerHTML` cua React, `v-html` cua Vue, co gang tu dong phong chong XSS. Nhung neu can phat trien bang JS thuan, cung nen su dung `textContent`, `createElement`, `setAttribute` de thao tac DOM.
