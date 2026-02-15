---
id: frontend-bundler
title: Bundler
slug: /frontend-bundler
---

## Tai sao phat trien front-end can bundler? Chuc nang chinh cua no la gi?

> Why is a bundler necessary for front-end development? What is its primary function?

### Quan ly module va plugin

Truoc khi co cong cu bundling front-end, chung ta su dung CDN hoac the `<script>` de tai file (co the bao gom JS, CSS, HTML). Cach lam nay ngoai viec lang phi hieu nang (HTTP co the can nhieu request), con de gay ra loi do su khac biet ve thu tu tai, dan den loi xay ra thuong xuyen hoac kho xu ly. Bundler giup lap trinh vien gop nhieu file thanh mot hoac vai file. Cach quan ly module hoa nay khong chi de bao tri hon khi phat trien, ma con tien loi cho viec mo rong trong tuong lai. Mat khac, viec gop file cung dong thoi giam so luong request HTTP, tu nhien cai thien hieu nang.

### Dich va tuong thich

Cac nha phat trien trinh duyet khong the hoan toan theo kip toc do phat hanh cu phap moi, va su khac biet giua cu phap cu va moi co the gay ra loi trong trien khai. De tuong thich tot hon giua hai ben, chung ta can bundler de chuyen doi cu phap moi sang cu phap cu, dam bao code hoat dong binh thuong. Truong hop dien hinh la Babel se chuyen doi cu phap ES6+ sang ES5.

### Toi uu tai nguyen

De giam hieu qua kich thuoc du an va cai thien hieu nang, cau hinh bundler de xu ly la cach lam chu dao hien nay:

- Minification (thu nho, lam xau): nen code JavaScript, CSS va HTML, xoa khoang trang, comment va thut dong khong can thiet de giam kich thuoc file (vi du la cho may doc chu khong phai cho nguoi doc).
- Tree Shaking: loai bo code khong duoc su dung hoac khong the truy cap, tiep tuc giam kich thuoc bundle.
- Code Splitting: chia code thanh nhieu phan nho (chunks) de tai theo yeu cau, cai thien toc do tai trang tot nhat co the.
- Lazy Loading: tai tri hoan, tai nguyen chi duoc tai khi nguoi dung can, giam thoi gian tai ban dau (cung la vi trai nghiem nguoi dung).
- Cache dai han: hash hoa noi dung bundle va dua vao ten file, nhu vay mien la noi dung khong thay doi, cache trinh duyet co the su dung vinh vien, giam so luong request. Dong thoi moi lan trien khai, chi cap nhat file da thay doi, khong phai tai lai tat ca.

### Moi truong trien khai

Trong thuc te, trien khai duoc chia thanh cac moi truong phat trien, test va production. De dam bao hanh vi nhat quan, thuong cau hinh qua bundler, dam bao tai dung trong moi truong tuong ung.
