---
id: 08-build-private-chat
description: Build Private Chat
slug: /build-private-chat
---

# 08 - Build Private Chat

除了共用的頻道外，當不同使用者進入時，希望能夠出現一個很陽春的不同使用者的聊天頻道，並進行私人訊息。

而這一章首要解決的，便是不同使用者進入時，自動更新建立頻道。

## Record User Name

第一步，記錄登入的使用者名稱到 server 端，所以需要先到中介的 handler.js 轉發訊息。透過 `register-new-user` 這組 socket 和 server-side 傳輸資料。

另外補充，當使用者登入啟動連線後，連線 socket 的 id 也會被保存 store.js 中，方便隨時可以使用。

```js
// handler.js
import store from '../store.js';

const connectSocketIoServer = () => {
  // ...

  socket.on('connect', () => {
    store.setSocketId(socket.id);
    registerActiveSession();
  });
};

const registerActiveSession = () => {
  const userData = {
    username: store.getUserName(),
  };
  socket.emit('register-new-user', userData);
};
```

預先保留狀態使用的 function。

```js
// store.js
let socketId = null;
let activeChatGroup = [];

const getSocketId = () => socketId;
const setSocketId = (id) => (socketId = id);
const getActiveChatGroup = () => activeChatGroup;
const setActiveChatGroup = (chatGroup) => (activeChatGroup = chatGroup);

export default {
  // ...
  getSocketId,
  setSocketId,
  getActiveChatGroup,
  setActiveChatGroup,
};
```

## Server

當 server-side 透過監聽拿到資料後，可以組出一個物件，包含使用 `socket.id` 當作唯一值的 key，以及 username。每登入一個使用者，就建立一組物件，並將這些物件透過其餘的方式，push 到外層宣告的陣列 `connectPeers`，最後再經 `boardcastConnectedPeers()` 將陣列作為參數轉發回 handler.js。

```js
// server.js
let connectPeers = [];

io.on('connection', (socket) => {
  // ...

  socket.on('register-new-user', (userData) => {
    const { username } = userData;

    const newPeer = {
      username,
      socketId: socket.id,
    };

    // use spread copy
    connectPeers = [...connectPeers, newPeer];
    boardcastConnectedPeers();
  });
});

const boardcastConnectedPeers = () => {
  const data = {
    connectPeers,
  };

  io.emit('active-peers', data);
};
```

handler.js 拿到資料後，會去 client-side 呼叫 `updateActiveChatGroup()`，並將資料傳輸過去，準備進行 render。

## Client

client-side 拿到傳輸過來的資料後進行拆解，首先去 store 調出資料，和 server-side 傳輸過來的資料進行比對，剃除重複的使用者，同時呼叫 element.js 中，用於動態 render HTML 的 `getChatList()`，將資料作為參數傳入，方便 render 時作為變數使用。

最後將篩選過的物件，同樣透過其餘的方式，push 到 stroe 內保存的陣列，讓下一次使用者登入觸發時，可以再次使用。

```js
const updateActiveChatGroup = (data) => {
  const { connectPeers } = data;
  const userSocketId = store.getSocketId();
  const activeChatGroups = store.getActiveChatGroup();

  connectPeers.forEach((peer) => {
    const isRepeat = activeChatGroups.find((node) => {
      return peer.socketId === node.socketId;
    });

    if (!isRepeat && peer.socketId !== userSocketId) {
      createNewUserChatGroup(peer);
    }
  });
};

const createNewUserChatGroup = (peer) => {
  const chatTitle = peer.username;
  const messageContainerID = `${peer.socketId}-message`;
  const messageInputID = `${peer.socketId}-input`;
  const chatContainerID = peer.socketId;

  const data = {
    chatTitle,
    messageContainerID,
    messageInputID,
    chatContainerID,
  };

  const chatGroup = element.getChatList(data);
  const chatList = document.querySelector('.chat-list');
  chatList.appendChild(chatGroup);

  // push new user to chat group
  const activeChatGroup = store.getActiveChatGroup();
  const newActiveChatGroup = [...activeChatGroup, peer];
  store.setActiveChatGroup(newActiveChatGroup);
};

export default {
  // ...
  updateActiveChatGroup,
};
```

![Private Chat](https://i.imgur.com/z9iId5y.gif)
