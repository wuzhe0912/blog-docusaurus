---
id: three-way-handshake
title: '📜 Three Way Handshake'
slug: /three-way-handshake
---

> Questions

## Basic

> 三次握手是指在 `TCP/IP` 的網路中，服務器端和客戶端之間建立連接的過程。在過程中會經歷三個步驟，來確認雙方的接受和發送能力都正常，同時也要透過初始序列號(ISN)來確保資料的同步和安全性。

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

## Questions

### 如果只有兩次握手可以嗎 ?

1. 三次握手的目的，是為了確認 client 和 server 兩端的收發能力都正常，如果只有兩次握手，將導致 server 無法判斷 client 的接收能力。
2. 因為缺乏第三次握手，client 會無法收到 server 的序列號，自然也無法發送確認，這可能會讓資料的安全性存疑。
3. 在弱網環境中，數據抵達的時間可能存在差異，如果新舊資料出現先後抵達的時間錯亂，如果沒有第三次握手的 SYN 確認即建立連結，可能會產生網路錯誤。

### ISN 是什麼 ?

ISN 全稱 Initial Sequence Number，用來告訴接收方，我方發送數據時的序列號，這是一個隨機動態生成的序列號，避免因為第三方入侵時猜到，進而偽造訊息。

### 三次握手中，什麼時間點會開始傳輸資料 ?

第一次和第二次握手的目的，都是為了確認雙方的接發能力，並不能傳輸資料，假設在第一次握手時就可以傳輸資料，那惡意的第三方可能會透過大量傳輸假資料，迫使 server 端消耗內存空間進行緩存，這就給了被攻擊的機會。

只有第三次握手時，因為雙方都已同步確認完畢，並處於連接狀態，這時才允許傳輸資料。

## Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)
