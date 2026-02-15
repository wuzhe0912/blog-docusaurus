---
id: network-protocols
title: 📄 网络协议
slug: /network-protocols
---

## 1. Please describe TCP、HTTP、HTTPS、WebSocket

1. **TCP (传输控制协议)**：
   TCP 是一种可靠的、面向连接的协议，用于在互联网上的两台计算机之间可靠地传送数据。它保证了数据包的顺序和可靠性——这意味着无论网络条件如何，数据都会完整无缺地抵达目的地。

2. **HTTP (超文本传输协议)**：
   HTTP 是用于传递超文本（即网页）的协议。它建立在 TCP 协议之上，提供了一种让浏览器和服务器通信的方式。HTTP 是无状态的，这意味着服务器不会保存任何有关用户的信息。

3. **HTTPS (安全超文本传输协议)**：
   HTTPS 是 HTTP 的安全版本。它通过 SSL/TLS 协议加密 HTTP 数据传输，保护交换数据的安全，防止中间人攻击，从而确保数据的私密性和完整性。

4. **WebSocket**：
   WebSocket 协议提供了一种在用户端和服务器之间建立持久连接的方式，使得双方可以在建立连接后进行实时、双向的数据传输。这与传统的 HTTP 请求不同，在传统的 HTTP 请求中，每个传输都需要建立一个新的连接。WebSocket 更适合即时通讯和需要快速数据更新的应用程序。

## 2. What is Three Way Handshake?

三次握手是指在 `TCP/IP` 的网络中，server 端和 client 端之间建立连接的过程。在过程中会经历三个步骤，来确认双方的接受和发送能力都正常，同时也要通过初始序列号(ISN)来确保数据的同步和安全性。

### TCP Message Type

在开始理解步骤前，需要先明白，每个类型的消息，其主要功能为何 ?

| Message | Description                                        |
| ------- | -------------------------------------------------- |
| SYN     | 用于启动和建立连接，同时也能帮助设备之间同步序列号 |
| ACK     | 用于向对方确认已收到 SYN                           |
| SYN-ACK | 同步确认，除了发出己方的 SYN，并送出 ACK           |
| FIN     | 终止连接                                           |

### Steps

1. client 端开始和 server 端建立连接，并发出 SYN 消息，告知 server 端准备开始通信，以及它送出的序列号是多少 ?
2. server 端接收 SYN 消息后，准备响应给 client 端，先将接收到的 SYN 序列号 +1，并通过 ACK 发回，同时也发出 server 端自己的 SYN 消息。
3. client 端确认 server 端已响应，双方都已经建立稳定连接，开始传输数据。

### Example

Host A 向主机发送一个 TCP SYN 数据资料，其中会包含一个随机序列号，这边假设为 1000

```bash
Host A ===(SYN=1000)===> Server
```

Server 需要针对 Host A 给出的序列号进行响应，所以会将序列号 + 1，同时给出自己的 SYN

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Host A 接收到 Server 的 SYN 后，需要发出确认的序列号来回应，所以会将 Server 给的序列号 + 1

```bash
Host A ===(ACK=2001)===> Server
```

### 如果只有两次握手可以吗 ?

1. 三次握手的目的，是为了确认 client 和 server 两端的收发能力都正常，如果只有两次握手，将导致 server 无法判断 client 的接收能力。
2. 因为缺乏第三次握手，client 会无法收到 server 的序列号，自然也无法发送确认，这可能会让数据的安全性存疑。
3. 在弱网环境中，数据抵达的时间可能存在差异，如果新旧数据出现先后抵达的时间错乱，如果没有第三次握手的 SYN 确认即建立连接，可能会产生网络错误。

### ISN 是什么 ?

ISN 全称 Initial Sequence Number，用来告诉接收方，我方发送数据时的序列号，这是一个随机动态生成的序列号，避免因为第三方入侵时猜到，进而伪造消息。

### 三次握手中，什么时间点会开始传输数据 ?

第一次和第二次握手的目的，都是为了确认双方的接发能力，并不能传输数据，假设在第一次握手时就可以传输数据，那恶意的第三方可能会通过大量传输假数据，迫使 server 端消耗内存空间进行缓存，这就给了被攻击的机会。

只有第三次握手时，因为双方都已同步确认完毕，并处于连接状态，这时才允许传输数据。

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)

## 3. Please describe the HTTP caching mechanism

HTTP 缓存机制是一种在 HTTP 协议中用于临时存储（或"缓存"）网页数据的技术，目的是减少服务器负担、降低延迟以及提高网页加载速度。这里有几种主要的缓存策略：

1. **强缓存（Freshness）**：通过设置`Expires`或`Cache-Control: max-age`响应 head，指示数据可以在特定时间内被视为新鲜的，client 端无需向服务器确认即可直接使用。

2. **验证缓存（Validation）**：使用`Last-Modified`和`ETag`响应 head，client 端可以向服务器发送一个条件性请求，若数据未修改则返回 304（Not Modified）状态码，表示可以使用本地缓存数据。

3. **协商缓存（Negotiation）**：这种方式依赖于`Vary`响应 head，服务器根据 client 端的请求（如`Accept-Language`）来决定是否提供不同版本的缓存内容。

4. **不缓存（No-store）**：如果设置了`Cache-Control: no-store`，则表示数据不应被缓存，每次请求都需要从服务器获取最新的数据。

缓存策略的选择会根据数据的类型和更新频率等因素来确定，有效的缓存策略可以显著提升网络应用的性能。

### Service Worker

个人经验，在替 Web App 设定好 PWA 后，可以将一些基础的样式或是 logo，甚至可以准备离线用的 offline.html，注册在 service-worker.js 中，这样即使客户处于断线状态下，通过这个缓存机制，也能知道目前网站或网络状态，保持一定程度的使用体验。
