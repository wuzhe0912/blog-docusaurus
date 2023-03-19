---
id: day9-mongoose-edit-delete
title: '📜 Day-9 Mongoose Edit & Delete'
slug: /day9-mongoose-edit-delete
---

## Requirements Specification

將此前建立的手搖飲品資料庫，透過編輯與刪除功能，來完成以下需求：

1. 尋找一筆 document 並將 ice 改為 去冰，sugar 改為 半糖
2. 以 ID 尋找一筆 document 並將其刪除
3. 刪除全部 documents

## Answer

```js
// display all documents
db.drinks.find();
```

```js
// get all document
[
  {
    _id: ObjectId('64108f1686e895f0435dbd94'),
    product: 'Coca Cola',
    price: 10000,
    sugar: 'No Sugar',
  },
  {
    _id: ObjectId('6415525e7c2d6cd12f90ff33'),
    product: 'Coca Cola',
    price: 10000,
    sugar: 'No Sugar',
  },
  {
    _id: ObjectId('6415536f76310a1d748ebfaa'),
    product: 'Coca Cola',
    price: 10000,
    sugar: 'No Sugar',
    createdAt: ISODate('2023-03-18T06:00:15.947Z'),
    updatedAt: ISODate('2023-03-18T06:00:15.947Z'),
  },
  {
    _id: ObjectId('641553732a6401e698a138cb'),
    product: 'Coca Cola',
    price: 10000,
    sugar: 'No Sugar',
    createdAt: ISODate('2023-03-18T06:00:19.495Z'),
    updatedAt: ISODate('2023-03-18T06:00:19.495Z'),
  },
  {
    _id: ObjectId('641553ace45dc2d5075c5f4c'),
    product: 'Coca Cola 2',
    price: 10000,
    sugar: 'No Sugar',
    createdAt: ISODate('2023-03-18T06:01:16.807Z'),
  },
  {
    _id: ObjectId('641553ba9491d93154daa1e3'),
    product: 'Coca Cola 2',
    price: 10000,
    sugar: 'No Sugar',
    createdAt: ISODate('2023-03-18T06:01:30.422Z'),
    updatedAt: ISODate('2023-03-18T06:01:30.422Z'),
  },
];
```

### 操作第二筆 document，並且將 sugar 改為半糖，同時新增 ice 欄位，並設定為去冰

```js
db.drinks.updateOne(
  { _id: ObjectId('6415525e7c2d6cd12f90ff33') },
  { $set: { ice: '去冰', sugar: '半糖' } }
);
```

### 以 ID 尋找一筆 document 並將其刪除

```js
db.drinks.deleteOne({ _id: ObjectId('64108f1686e895f0435dbd94') }); // 刪除指定 ID 的 document
```

### 刪除全部 documents

```js
db.drinks.deleteMany({}); // 刪除集合中的所有 documents
```
