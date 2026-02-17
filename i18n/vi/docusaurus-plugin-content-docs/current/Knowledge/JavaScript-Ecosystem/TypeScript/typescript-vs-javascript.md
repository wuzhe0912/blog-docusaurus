---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> TypeScript la gi?

TypeScript la ngon ngu lap trinh ma nguon mo do Microsoft phat trien, la **tap cha (Superset)** cua JavaScript. Dieu nay co nghia la tat ca ma JavaScript hop le deu la ma TypeScript hop le.

**Dac diem cot loi**:

- Them **he thong kieu tinh** tren nen tang JavaScript
- Thuc hien kiem tra kieu khi bien dich
- Chuyen doi thanh JavaScript thuan sau khi bien dich
- Cung cap trai nghiem phat trien va ho tro cong cu tot hon

## 2. What are the differences between TypeScript and JavaScript?

> Su khac biet giua TypeScript va JavaScript la gi?

### Khac biet chinh

| Dac diem     | JavaScript              | TypeScript              |
| ------------ | ----------------------- | ----------------------- |
| He thong kieu | Dong (kiem tra runtime) | Tinh (kiem tra khi bien dich) |
| Bien dich    | Khong can               | Can bien dich sang JavaScript |
| Chu thich kieu | Khong ho tro           | Ho tro chu thich kieu   |
| Phat hien loi | Khi chay               | Khi bien dich           |
| Ho tro IDE   | Co ban                  | Tu dong hoan thanh va refactoring manh |
| Do kho hoc   | Thap                    | Cao                     |

### Khac biet he thong kieu

**JavaScript (kieu dong)**:

```javascript
let value = 10;
value = 'hello'; // Co the thay doi kieu
function add(a, b) { return a + b; }
add(1, 2); // 3
add('1', '2'); // '12' (noi chuoi)
add(1, '2'); // '12' (chuyen doi kieu)
```

**TypeScript (kieu tinh)**:

```typescript
let value: number = 10;
value = 'hello'; // ❌ Loi bien dich

function add(a: number, b: number): number { return a + b; }
add(1, 2); // ✅ 3
add('1', '2'); // ❌ Loi bien dich
```

### Qua trinh bien dich

```typescript
// Ma nguon TypeScript
let message: string = 'Hello World';
console.log(message);

// ↓ Sau khi bien dich chuyen thanh JavaScript
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> Tai sao su dung TypeScript?

### Uu diem

1. **Phat hien loi som** - Phat hien loi kieu khi bien dich
2. **Ho tro IDE tot hon** - Tu dong hoan thanh va refactoring
3. **Do doc code** - Chu thich kieu lam ro y dinh ham
4. **Refactoring an toan hon** - Tu dong phat hien vi tri can cap nhat

### Nhuoc diem

1. **Can buoc bien dich** - Tang do phuc tap quy trinh phat trien
2. **Do kho hoc** - Can hoc he thong kieu
3. **Kich thuoc file** - Thong tin kieu tang kich thuoc ma nguon (khong anh huong sau khi bien dich)
4. **Cau hinh phuc tap** - Can cau hinh `tsconfig.json`

## 4. Common Interview Questions

> Cac cau hoi phong van thuong gap

### Cau hoi 1: Thoi diem kiem tra kieu

<details>
<summary>Nhan de xem dap an</summary>

- JavaScript thuc hien chuyen doi kieu khi **chay**, co the tao ra ket qua khong mong doi
- TypeScript kiem tra kieu khi **bien dich**, phat hien loi som

</details>

### Cau hoi 2: Suy luan kieu

<details>
<summary>Nhan de xem dap an</summary>

TypeScript tu dong suy luan kieu tu gia tri khoi tao. Sau khi suy luan, khong the thay doi kieu (tru khi khai bao ro rang la `any` hoac kieu `union`).

</details>

### Cau hoi 3: Hanh vi runtime

<details>
<summary>Nhan de xem dap an</summary>

- **Chu thich kieu cua TypeScript bien mat hoan toan sau khi bien dich**
- JavaScript sau bien dich giong het JavaScript thuan
- TypeScript chi cung cap kiem tra kieu trong **giai doan phat trien**, khong anh huong hieu suat runtime

</details>

### Cau hoi 4: Loi kieu vs Loi runtime

<details>
<summary>Nhan de xem dap an</summary>

- **Loi bien dich TypeScript**: Phat hien trong giai doan phat trien, chuong trinh khong the chay
- **Loi runtime JavaScript**: Phat hien khi su dung, gay crash chuong trinh

TypeScript co the ngan chan nhieu loi runtime thong qua kiem tra kieu.

</details>

## 5. Best Practices

> Thuc hanh tot nhat

### Cach lam khuyen dung

```typescript
// 1. Chi dinh ro rang kieu tra ve cua ham
function add(a: number, b: number): number { return a + b; }

// 2. Su dung interface cho cau truc doi tuong phuc tap
interface User { name: string; age: number; email?: string; }

// 3. Uu tien unknown thay vi any
function processValue(value: unknown): void {
  if (typeof value === 'string') { console.log(value.toUpperCase()); }
}

// 4. Su dung bi danh kieu de tang do doc
type UserID = string;
```

## 6. Interview Summary

> Tom tat phong van

**Q: Su khac biet chinh giua TypeScript va JavaScript la gi?**

> "TypeScript la tap cha cua JavaScript, khac biet chinh la them he thong kieu tinh. JavaScript la ngon ngu kieu dong voi kiem tra kieu khi chay; TypeScript la ngon ngu kieu tinh voi kiem tra kieu khi bien dich. Dieu nay cho phep phat hien loi lien quan den kieu ngay trong giai doan phat trien. Sau khi bien dich, TypeScript chuyen thanh JavaScript thuan, nen hanh vi runtime giong het JavaScript."

**Q: Tai sao su dung TypeScript?**

> "Cac uu diem chinh la: 1) Phat hien loi som khi bien dich; 2) Ho tro IDE tot hon voi tu dong hoan thanh va refactoring; 3) Tang do doc code voi chu thich kieu; 4) Refactoring an toan hon voi tu dong phat hien vi tri can cap nhat. Tuy nhien can xem xet do kho hoc va chi phi them cua buoc bien dich."

## Reference

- [Tai lieu chinh thuc TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
