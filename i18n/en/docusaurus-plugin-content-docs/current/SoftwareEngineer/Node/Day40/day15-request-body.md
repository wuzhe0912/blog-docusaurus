---
id: day15-request-body
title: '📜 Day-15 Request Body'
slug: /day15-request-body
---

## Requirements Specification

透過 POST API 的 `req.body` 新增一則貼文，並加上 Schema 欄位資料驗證

## Answer

### Project Structure

```md
.
├── app.js
├── package.json
├── models
│ └── Post.js
├── routes
│ └── postRoutes.js
└── config
└── db.js
```

### `models/Post.js`

```js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
```

### `routes/postRoutes.js`

```js
const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

// GET API for retrieving all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      status: 'success',
      data: posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

// add a new post
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (data.title && data.content && data.author) {
      const newPost = await Post.create({
        title: data.title,
        content: data.content,
        author: data.author,
      });
      res.status(200).json({
        status: 'success',
        data: newPost,
      });
    } else {
      console.log('Field validation error');
      res.status(400).json({
        status: 'error',
        message: 'Field validation error',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

module.exports = router;
```

### `config/db.js`

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/postsDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### `app.js`

```js
const express = require('express');
// const bodyParser = require('body-parser');
const postRoutes = require('./routes/postRoutes');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Use built-in express.json() middleware
app.use(express.json());

// Use body-parser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Use postRoutes
app.use('/posts', postRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Postman Test

- Open Postman and create a new request.
- Set the HTTP method to "POST".
- Enter the URL: `http://localhost:3000/posts`.
- In the "Body" tab, choose "raw" and set the format to "JSON".
- Paste the following JSON into the text area:

```json
{
  "title": "Post 1",
  "content": "This is the content of post 1",
  "author": "John"
}
```
