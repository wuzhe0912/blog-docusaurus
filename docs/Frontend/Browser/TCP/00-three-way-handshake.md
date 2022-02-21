---
id: 00-three-way-handshake
title: '📜 三次握手'
slug: /three-way-handshake
---

## 三次握手的基本邏輯

三次握手是指在 `TCP/IP` 的網路中，服務器端和客戶端之間建立連接的過程。在過程中會經歷三個步驟，來確認雙方的接受和發送能力都正常，同時也要透過初始序列號(ISN)來確保資料的同步和安全性。

## TCP 訊息類型

在開始理解步驟前，需要先明白，每個類型的訊息，其主要功能為何 ?

| Message | Description                                |
| ------- | ------------------------------------------ |
| SYN     | 用於啟動和建立連結，同時也能用於同步序列號 |
| ACK     | 用於向對方確認已收到 SYN                   |
| SYN-ACK |                                            |
| FIN     | 終止連結                                   |

## Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)
