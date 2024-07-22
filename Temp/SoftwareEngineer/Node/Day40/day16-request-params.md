---
id: day16-request-params
title: '📜 Day-16 Request Params'
slug: /day16-request-params
---

## Requirements Specification

參考[前專案結構](./day15-request-body.md)，透過 req.params 取得貼文 id，並使用 mongoose 尋找符合 id 的資料，最後 response 該特定貼文資料(若 id 不存在可做簡易錯誤處理)。

## Answer

update `routes/postRoutes.js`，add `GET` API for retrieving a specific post

```js
// ... (previous code)

router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (post) {
      res.status(200).json({
        status: 'success',
        data: post,
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Post not found',
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

// ... (remaining code)
```

### Postman Test

1. Set the HTTP method to "GET".
2. Enter the URL: `http://localhost:3000/posts/<post_id>`, replacing `<post_id>` with the actual ID of a post.
3. Click the "Send" button to make the request.
