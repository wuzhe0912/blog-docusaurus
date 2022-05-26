---
id: 12-select-room
description: Select Room
slug: /select-room
---

# 12 - Select Room

本章的需求，解決首頁進入前，有特定頻道可以選擇，那當使用者進入時，也要顯示出對應的該頻道。

## HTML & CSS

樣式的部分比較隨意，和 input 共用同一組 class，並移除 `.enter-btn` 的 margin，統一移到 `.enter-input`。

```html
<body>
  <main class="wrapper">
    <section class="enter-box">
      // ...
      <select class="enter-input" name="rooms-select" id="rooms-select">
        <option value="Cars">Cars</option>
        <option value="Trucks">Trucks</option>
      </select>
    </section>
  </main>
</body>
```

```css
.enter-input {
  width: 200px;
  height: 30px;
  border-radius: 6px;
  margin-bottom: 12px; // add
}

.enter-btn {
  // ...
  // margin-top: 12px; // remove
}
```

## 狀態

先在 stroe 建立 function，用於保存 room 的 ID，方便存取使用。同時將原先的 code，進行合併整理。

```js
// store.js
let username = null;
let socketId = null;
let activeChatGroup = [];
let roomId = 'Cars';

const getUserName = () => username;
const setUserName = (name) => (username = name);
const getSocketId = () => socketId;
const setSocketId = (id) => (socketId = id);
const getActiveChatGroup = () => activeChatGroup;
const setActiveChatGroup = (chatGroup) => (activeChatGroup = chatGroup);
const getRoomId = () => roomId;
const setRoomId = (id) => (roomId = id);

export default {
  getUserName,
  setUserName,
  getSocketId,
  setSocketId,
  getActiveChatGroup,
  setActiveChatGroup,
  getRoomId,
  setRoomId,
};
```

## Client Side

當使用者點擊下拉選單時，監聽他所選擇的項目，並將該項目的值存入 store。

```js
// client.js
const roomSelect = document.getElementById('rooms-select');

roomSelect.addEventListener('change', (e) => {
  store.setRoomId(e.target.value);
});
```

## Handler

維持使用 `register-new-user` 這組 socket，替原先傳入的 userData 多增加一組 roomId。

```js
// handler.js
const registerActiveSession = () => {
  const userData = {
    username: store.getUserName(),
    roomId: store.getRoomId(),
  };
  socket.emit('register-new-user', userData);
};
```

```js
// server.js
socket.on('register-new-user', (userData) => {
  const { username, roomId } = userData;

  const newPeer = {
    username,
    socketId: socket.id,
    roomId,
  };

  socket.join(roomId);

  // ...
});
```

## UI

頁面渲染的部分，基本 copy 公共頻道的做法，只是調整傳入的 id，讓頻道顯示名稱改為對應的房間名。

```js
// ui.js
const goToChat = () => {
  // ...
  createRoomChat();
};

const createRoomChat = () => {
  const roomId = store.getRoomId();

  const chatTitle = roomId;
  const messageContainerID = `${roomId}-message`;
  const messageInputID = `${roomId}-input`;
  const chatContainerID = roomId;

  const data = {
    chatTitle,
    messageContainerID,
    messageInputID,
    chatContainerID,
  };

  const room = element.getChatList(data);
  const roomWrapper = document.querySelector('.chat-list');
  roomWrapper.appendChild(room);
};
```

![select room](https://i.imgur.com/kq2TljX.gif)
