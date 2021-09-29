---
id: 13-send-message-to-room
description: Send Message To Room
slug: /send-message-to-room
---

# 13 - Send Message To Room

建立完成特定頻道後，再來就是在指定頻道中發出個人訊息，運作邏輯和公共頻道類似，差別僅在於，只有進入該頻道的人可以查看訊息。

## Client-side 輸入訊息

同樣先從 ui 出發，檢查使用者是否在房間中輸入訊息，監聽鍵盤事件，當觸發時則傳遞訊息資料給 handler.js。

```javascript
// ui.js
const createRoomChat = () => {
  // ...
  const newMessageInput = document.getElementById(messageInputID);
  newMessageInput.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key === 'Enter') {
      const author = store.getUserName();
      const messageContent = e.target.value;
      const authorSocketId = store.getSocketId();

      const data = {
        author,
        messageContent,
        authorSocketId,
        roomId,
      };

      socketHandler.sendRoomMessage(data);
      newMessageInput.value = '';
    }
  });
};
```

handler 將取得的資料透過 emit 轉發給 server-side，同時建立 socket 連線。

```javascript
// handler.js
const sendRoomMessage = (data) => {
  socket.emit('room-message', data);
};
```

server-side 除了監聽 `connection()`，將房間 ID 存入外，同時也得將它再轉發回 handler.js，方便中介層重新遞給 ui.js。

```javascript
// server.js
socket.on('room-message', (data) => {
  const { roomId } = data;

  io.to(roomId).emit('room-message', data);
});
```

```javascript
// handler.js
socket.on('room-message', (data) => {
  ui.appendRoomChatMessage(data);
});
```

## Render

渲染的部分就和公共頻道類似，無論是抓取 DOM 和動態塞入資料都是一樣的邏輯。

```javascript
// ui.js
const appendRoomChatMessage = (data) => {
  const { roomId, author, messageContent } = data;
  const roomChatMessageId = `${roomId}-message`;
  const roomMessageWrapper = document.getElementById(roomChatMessageId);

  const roomData = {
    author,
    messageText: messageContent,
  };

  const roomMessage = element.getChatMessageContent(roomData);
  roomMessageWrapper.appendChild(roomMessage);
};

export default {
  // ...
  appendRoomChatMessage,
};

```