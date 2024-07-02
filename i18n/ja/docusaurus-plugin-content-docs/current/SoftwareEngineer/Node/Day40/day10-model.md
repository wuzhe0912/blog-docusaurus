---
id: day10-model
title: '📜 Day-10 Model'
slug: /day10-model
---

## Requirements Specification

嘗試透過 Model 的觀念來進行功能拆分，並將其 import 回到 `app.js` 中

## Answer

### Folder Structure

```md
app.js
models/
└── room.js
```

### room.js

```js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    rating: Number,
  },
  {
    versionKey: false,
  }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
```

### app.js

```js
const http = require('http');
const mongoose = require('mongoose');
const Room = require('./models/room');

mongoose
  .connect('mongodb://localhost:27017/hotel')
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.log(error);
  });

Room.create({
  name: 'Master Room',
  price: 20000,
  rating: 4.7,
})
  .then(() => {
    console.log('Room saved');
  })
  .catch((error) => {
    console.log(error);
  });

const requestListener = (req, res) => {
  console.log(req.url);
  res.end();
};

const server = http.createServer(requestListener);
server.listen(3005);
```
