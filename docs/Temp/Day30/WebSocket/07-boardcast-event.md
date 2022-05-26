---
id: 07-boardcast-event
description: Boardcast Event
slug: /boardcast-event
---

# 07 - Boardcast Event

> 當某個使用者輸入訊息發送到 server 後，若當前環境為留言板或公共頻道，server 端則必須推播訊息給該名使用者以外的所有人。雖然聽起來好像不好處理，但其實只要利用 socket 建立連線後永久傳輸的特性，server 端透過 `emit()` 向 client 推播轉發，client 則保持用 `on()` 監聽變化。

```js
// server.js
io.on('connection', (socket) => {
  console.log(`Server：${socket.id}`);

  socket.on('group-chat-message', (data) => {
    console.log(data);
    io.emit('group-chat-message', data);
  });
});
```

```js
// handler.js
const connectSocketIoServer = () => {
  socket = io('/');

  // ...

  socket.on('group-chat-message', (data) => {
    console.log(data);
  });
};
```

由於此前使用 `group-chat-message` 這一組 socket 傳送訊息給 server，所以自然就是監聽這組。

## Render Message

無論是送出訊息的一方，或是接收訊息者，這些訊息都應該被呈現在頁面上，讓目前處於這個頻道的人可以看見。

需要渲染即時的訊息內容，同樣透過操作 DOM 來塞入 HTML，這邊補上一個之前漏掉的 function。

```js
// element.js
const getChatMessageContent = (data) => {
  const { author, messageText } = data;
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.innerHTML = `
    <p class="message-paragraph">
      <span class="message-author">${author}：</span>${messageText}
    </p>
  `;

  return messageContent;
};

export default {
  getChatList,
  getChatMessageContent,
};
```

上面這組 function 用來生成，輸入訊息者以及他所輸入的內容。

接著，需要將這段 HTML 同樣透過 append 的方式塞到對話框的訊息列表中。

```js
// ui.js
const appendChatMessage = (data) => {
  const groupChatMessage = document.getElementById(messageContainerID);
  const chatMessageContent = element.getChatMessageContent(data);
  groupChatMessage.appendChild(chatMessageContent);
};

export default {
  goToChat,
  appendChatMessage,
};
```

導出的 `appendChatMessage()` 只是生成靜態的 HTML，仍需要傳入資料來顯示動態內容，所以將其拉到 handler.js 導入：

```js
// handler.js
import ui from '../ui.js';

const connectSocketIoServer = () => {
  socket = io('/');

  // ...

  socket.on('group-chat-message', (data) => {
    console.log(data);
    ui.appendChatMessage(data);
  });
};
```

現在可以打開數個 browser 來測試，當不同使用者分別輸入訊息時，是否能達到多人對話的效果。

![group chat](https://i.imgur.com/Bw595r2.png)
