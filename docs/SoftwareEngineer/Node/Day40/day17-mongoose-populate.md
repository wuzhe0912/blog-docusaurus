---
id: day17-mongoose-populate
title: '📜 Day-17 Mongoose Populate'
slug: /day17-mongoose-populate
---

## Requirements Specification

以下為書籍與作者的 collection，請填入對應答案，讓取出單筆書籍資料時，可以關聯至 author 的資料

```JS
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: String,
    introduction: String
  }, { versionKey: false }
);

const bookSchema = new mongoose.Schema({
  author : { type: mongoose.Schema.ObjectId, ref: /*請填入答案*/ },
  title: String
}, { versionKey: false }
);

const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);
```

取出所有 books 的資料，關聯 author 欄位並指定顯示 author 資料的 name 欄位

```js
Book.find({ _id: id }); /*請填入答案*/
```

## Answer

```js
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: String,
    introduction: String,
  },
  { versionKey: false }
);

const bookSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.ObjectId, ref: 'Author' },
    title: String,
  },
  { versionKey: false }
);

const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);

Book.find({ _id: id }).populate({
  path: 'author',
  select: 'name',
});
```

## Options

### 新增一筆 author 資料

```js
Author.create(
  {
    name: 'Pitt Wu',
    introduction: "Hello, I'm Pitt Wu.",
  },
  function (err, author) {
    if (err) return handleError(err);
    console.log('New author created:', author);
  }
);
```

### 帶入 author id 新增一筆 book 資料

```js
Book.create({
  title: "My Book",
  author: /*author ObjectId*/,
}, function (err, book) {
  if (err) return handleError(err);
  console.log("New book created:", book);
});
```

### 以 book id 取得指定的 book 資料，並有正確顯示出 author 的 name，並取得單筆 book 資料

```js
Book.findOne({ _id: bookId })
  .populate('author', 'name')
  .exec(function (err, book) {
    if (err) return handleError(err);
    console.log('Book details:', book);
  });
```
