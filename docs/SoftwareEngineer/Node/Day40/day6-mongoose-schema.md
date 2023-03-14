---
id: day6-mongoose-schema
title: '📜 Day-6 Mongoose, Schema'
slug: /day6-mongoose-schema
---

## Requirements Specification

> 請參考以下需求，設計手搖飲的 Schema

```js
- product: must be string, required, error message is '產品未填寫'
- price: must be number, required, error message is '價格未填寫'
- ice: must be string, default is '正常冰'
- sugar: must be string, default is '全糖'
- toppings: array，content must be string, default is empty array
```

Example:

```js
const drinkSchema = new Schema({
  /* answer */
});
```

## Refactor

```js
import { Schema, model } from 'mongoose';

const drinkSchema = new Schema({
  product: {
    type: String,
    required: [true, '產品未填寫'],
  },
  price: {
    type: Number,
    required: [true, '價格未填寫'],
    min: 0, // min value
  },
  ice: {
    type: String,
    default: '正常冰',
  },
  sugar: {
    type: String,
    default: '全糖',
  },
  toppings: {
    type: [String],
    default: [],
  },
});

const Drink = model('Drink', drinkSchema);

export default Drink;
```
