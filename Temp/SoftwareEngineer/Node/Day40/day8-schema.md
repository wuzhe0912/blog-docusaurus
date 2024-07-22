---
id: day8-schema
title: '📜 Day-8 Schema'
slug: /day8-schema
---

## Requirements Specification

延續調整手搖飲的 Schema

- 加入 createdAt 欄位，並設定為隱藏欄位（不會顯示於前端）
- 隱藏 versionKey 欄位

## Answer

```js
const mongoose = require('mongoose');

// Connect to database
mongoose
  .connect('mongodb://localhost:27017/hotel')
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.log(error);
  });

const drinkSchema = new mongoose.Schema(
  {
    product: String,
    price: Number,
    sugar: String,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false, // hide this field when query
    },
  },
  {
    versionKey: false,
    timestamps: true, // add createdAt and updatedAt
  }
);

const Drink = mongoose.model('Drink', drinkSchema);

const testDrink = new Drink({
  product: 'Coca Cola 2',
  price: 10000,
  sugar: 'No Sugar',
});

testDrink
  .save()
  .then(() => {
    console.log('Drink saved');
  })
  .catch((error) => {
    console.log(error);
  });
```
