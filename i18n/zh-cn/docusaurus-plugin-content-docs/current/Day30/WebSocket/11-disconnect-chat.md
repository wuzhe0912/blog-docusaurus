---
id: 11-disconnect-chat
description: Disconnect Chat
slug: /disconnect-chat
---

# 11 - Disconnect Chat

當使用者離開當前頻道時，其他使用者的頁面需要監聽到離線的狀況，並同時關閉那位離開者的頻道。

在監聽連線的同時，若觸發斷線的 socket，則將離開的使用者 ID，做為資料傳給 handler.js。

```js
// server.js
socket.on('disconnect', () => {
  // ...
  const data = {
    socketIdOfDisconnectPeer: socket.id,
  };
  io.emit('peer-disconnected', data);
});
```

中介層和 server-side，兩邊都透過 `peer-disconnected` 來溝通傳輸，另外，將離線的使用者 ID，傳給 client-side

```js
// handler.js
socket.on('peer-disconnected', (data) => {
  ui.removeChatOfDisconnected(data);
});
```

client-side 依據傳過來的離線的使用者 ID，移除對應的 DOM，同時也針對 store 中保存的狀態進行更新，確保目前聊天頻道中的使用者是最新的狀態。

```js
// ui.js
const removeChatOfDisconnected = (data) => {
  const { socketIdOfDisconnectPeer } = data;
  const activeChatGroup = store.getActiveChatGroup(socketIdOfDisconnectPeer);
  const newActiveChatGroup = activeChatGroup.filter(
    (node) => node.socketId !== socketIdOfDisconnectPeer
  );
  store.setActiveChatGroup(newActiveChatGroup);

  const chatBox = document.getElementById(socketIdOfDisconnectPeer);

  if (chatBox) {
    chatBox.parentElement.removeChild(chatBox);
  }
};

export default {
  // ...
  removeChatOfDisconnected,
};
```

![disconnect](https://i.imgur.com/BzTQBlA.gif)
