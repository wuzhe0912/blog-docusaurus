---
id: day7-model-mongoose-add
title: '📜 Day-7 Model, Mongoose Add'
slug: /day7-model-mongoose-add
---

## Requirements Specification

建立名稱為 Drink 的 Model，並嘗試新增一筆 document，新增 document 內容如下：

```bash
product: '鮮奶茶',
price: 55,
sugar: '微糖'
```

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
  },
  {
    versionKey: false,
  }
);

const Drink = mongoose.model('Drink', drinkSchema);

const testDrink = new Drink({
  product: 'Coca Cola',
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
