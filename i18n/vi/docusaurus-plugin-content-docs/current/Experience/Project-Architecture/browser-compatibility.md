---
id: project-architecture-browser-compatibility
title: 'Xu ly tuong thich trinh duyet'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Xu ly cac van de tuong thich giua cac trinh duyet, dac biet la xu ly dac biet cho Safari va thiet bi di dong.

---

## Tuong thich trinh duyet

> Don vi viewport nho (Small Viewport Units): svh
> Don vi viewport lon (Large Viewport Units): lvh
> Don vi viewport dong (Dynamic Viewport Units): dvh

Trong cac tinh huong cu the, cho phep su dung cu phap moi dvh de giai quyet van de thanh noi cua Safari do thiet ke kem. Neu can buoc tuong thich voi cac trinh duyet cu hoac it pho bien, thi su dung JS de phat hien chieu cao.

## Ngan chan iOS Safari tu dong dieu chinh kich thuoc van ban

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## Tien to nha cung cap

Tien to nha cung cap duoc xu ly thong qua cau hinh thu cong ket hop voi cau hinh tu dong cua Autoprefixer.
