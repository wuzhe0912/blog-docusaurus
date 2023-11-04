---
id: network-protocols
title: 📄 Network Protocols
slug: /network-protocols
---

## 1. Please describe TCP、HTTP、HTTPS、WebSocket

1. **TCP (傳輸控制協議)**：
   TCP 是一種可靠的、面向連接的協議，用於在網際網路上的兩台計算機之間可靠地傳送數據。它保證了數據包的順序和可靠性—這意味著無論網絡條件如何，數據都會完整無缺地抵達目的地。

2. **HTTP (超文本傳輸協議)**：
   HTTP 是用於傳遞超文本（即網頁）的協議。它建立在 TCP 協議之上，提供了一種讓瀏覽器和伺服器通信的方式。HTTP 是無狀態的，這意味著伺服器不會保存任何有關用戶的信息。

3. **HTTPS (安全超文本傳輸協議)**：
   HTTPS 是 HTTP 的安全版本。它通過 SSL/TLS 協議加密 HTTP 數據傳輸，保護交換數據的安全，防止中間人攻擊，從而確保數據的私密性和完整性。

4. **WebSocket**：
   WebSocket 協議提供了一種在用戶端和伺服器之間建立持久連接的方式，使得雙方可以在建立連接後進行實時、雙向的數據傳輸。這與傳統的 HTTP 請求不同，在傳統的 HTTP 請求中，每個傳輸都需要建立一個新的連接。WebSocket 更適合即時通訊和需要快速數據更新的應用程序。

## 2. What is Three Way Handshake?

三次握手是指在 `TCP/IP` 的網路中，服務器端和客戶端之間建立連接的過程。在過程中會經歷三個步驟，來確認雙方的接受和發送能力都正常，同時也要透過初始序列號(ISN)來確保資料的同步和安全性。

### TCP Message Type

在開始理解步驟前，需要先明白，每個類型的訊息，其主要功能為何 ?

| Message | Description                                        |
| ------- | -------------------------------------------------- |
| SYN     | 用於啟動和建立連結，同時也能幫助設備之間同步序列號 |
| ACK     | 用於向對方確認已收到 SYN                           |
| SYN-ACK | 同步確認，除了發出己方的 SYN，並送出 ACK           |
| FIN     | 終止連結                                           |

### Steps

1. client 端開始和 server 端建立連接，並發出 SYN 訊息，告知 server 端準備開始通信，以及它送出的序列號是多少 ?
2. server 端接收 SYN 訊息後，準備響應給 client 端，先將接收到的 SYN 序列號 +1，並透過 ACK 發回，同時也發出 server 端自己的 SYN 訊息。
3. client 端確認 server 端已響應，雙方都已經建立穩定連結，開始傳輸數據。

### Example

Host A 向主機發送一個 TCP SYN 數據資料，其中會包含一個隨機序列號，這邊假設為 1000

```bash
Host A ===(SYN=1000)===> Server
```

Server 需要針對 Host A 給出的序列號進行響應，所以會將序列號 + 1，同時給出自己的 SYN

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Host A 接收到 Server 的 SYN 後，需要發出確認的序列號來回應，所以會將 Server 給的序列號 + 1

```bash
Host A ===(ACK=2001)===> Server
```

### 如果只有兩次握手可以嗎 ?

1. 三次握手的目的，是為了確認 client 和 server 兩端的收發能力都正常，如果只有兩次握手，將導致 server 無法判斷 client 的接收能力。
2. 因為缺乏第三次握手，client 會無法收到 server 的序列號，自然也無法發送確認，這可能會讓資料的安全性存疑。
3. 在弱網環境中，數據抵達的時間可能存在差異，如果新舊資料出現先後抵達的時間錯亂，如果沒有第三次握手的 SYN 確認即建立連結，可能會產生網路錯誤。

### ISN 是什麼 ?

ISN 全稱 Initial Sequence Number，用來告訴接收方，我方發送數據時的序列號，這是一個隨機動態生成的序列號，避免因為第三方入侵時猜到，進而偽造訊息。

### 三次握手中，什麼時間點會開始傳輸資料 ?

第一次和第二次握手的目的，都是為了確認雙方的接發能力，並不能傳輸資料，假設在第一次握手時就可以傳輸資料，那惡意的第三方可能會透過大量傳輸假資料，迫使 server 端消耗內存空間進行緩存，這就給了被攻擊的機會。

只有第三次握手時，因為雙方都已同步確認完畢，並處於連接狀態，這時才允許傳輸資料。

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)
