---
id: day13-express-generator
title: '📜 Day-13 Express Generator'
slug: /day13-express-generator
---

## Requirements Specification

使用 express generator 產生初始結構，並嘗試在 routes 資料夾的 users.js，設計新增及修改個人資料的路由（搭配動態路由）。

## Answer

```js
const express = require('express');
const router = express.Router();
const User = require('../models/users');
/* GET users listing. */
// ...

// add new user
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    let { nickName, gender, avatar } = data;
    if (!nickName || !gender) {
      // 回傳失敗
      res.status(400).json({
        status: 'fail',
        message: '使用者資料未填寫完整',
      });
    } else {
      // 新增至 User model
      const newUser = new User({
        nickName,
        gender,
        avatar,
      });
      // 回傳成功
      res.status(201).json({
        // 201 Created，狀態表達更為精確
        status: 'success',
        data: newUser,
      });
    }
  } catch (error) {
    // 回傳失敗
    res.status(500).json({
      // use 500 是因為有些錯誤是不可預期的，例如：資料庫連線失敗或操作錯誤，屬於 server 端的錯誤
      status: 'fail',
      data: error.message,
    });
  }
});

// edit user
router.patch('/:id', async (req, res, next) => {
  try {
    // 取得 id
    const userId = req.params.id;

    const data = req.body;
    let { nickName, gender, avatar } = data;
    if (!nickName || !gender) {
      // 回傳失敗 "使用者資料未填寫完整"
      res.status(400).json({
        status: 'fail',
        message: '使用者資料未填寫完整',
      });
    } else {
      const editContent = {
        nickName,
        gender,
        avatar,
      };
      // 找出此筆 id 並編輯資料
      const editUser = await User.findByIdAndUpdate(userId, editContent, {
        new: true,
      });

      if (editUser) {
        // 回傳成功
        res.status(200).json({
          status: 'success',
          data: editUser,
        });
      } else {
        // 回傳失敗 "id 不存在"
        res.status(404).json({
          status: 'fail',
          message: 'id 不存在',
        });
      }
    }
  } catch (error) {
    // 回傳失敗
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
});

module.exports = router;
```
