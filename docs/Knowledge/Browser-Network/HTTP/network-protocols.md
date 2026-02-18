---
id: network-protocols
title: 📄 Network Protocols
slug: /network-protocols
---

## 1. Please describe TCP、HTTP、HTTPS、WebSocket

1. **TCP (Transmission Control Protocol)**:
   TCP is a reliable, connection-oriented protocol used to transmit data reliably between two computers on the internet. It guarantees packet ordering and reliability — meaning data arrives at its destination intact regardless of network conditions.

2. **HTTP (Hypertext Transfer Protocol)**:
   HTTP is a protocol for transmitting hypertext (i.e., web pages). It is built on top of TCP and provides a way for browsers and servers to communicate. HTTP is stateless, meaning the server does not retain any information about the user.

3. **HTTPS (Hypertext Transfer Protocol Secure)**:
   HTTPS is the secure version of HTTP. It encrypts HTTP data transmission through the SSL/TLS protocol, protecting the security of exchanged data and preventing man-in-the-middle attacks, thereby ensuring data privacy and integrity.

4. **WebSocket**:
   The WebSocket protocol provides a way to establish a persistent connection between the client and server, enabling real-time, bidirectional data transmission after the connection is established. This differs from traditional HTTP requests, where each transmission requires establishing a new connection. WebSocket is better suited for real-time communication and applications that require fast data updates.

## 2. What is Three Way Handshake?

The three-way handshake is the process of establishing a connection between a server and client in a TCP/IP network. The process involves three steps to confirm that both parties' sending and receiving capabilities are functioning normally, while also synchronizing Initial Sequence Numbers (ISN) to ensure data integrity and security.

### TCP Message Type

Before understanding the steps, you need to know the primary function of each message type:

| Message | Description                                                                    |
| ------- | ------------------------------------------------------------------------------ |
| SYN     | Used to initiate and establish a connection, and to synchronize sequence numbers |
| ACK     | Used to confirm receipt of a SYN                                                |
| SYN-ACK | Synchronization acknowledgment — sends its own SYN along with an ACK            |
| FIN     | Terminates the connection                                                       |

### Steps

1. The client initiates a connection with the server and sends a SYN message, informing the server that it's ready to communicate and what its starting sequence number is.
2. After receiving the SYN, the server prepares a response. It increments the received SYN sequence number by 1 and sends it back via ACK, while also sending its own SYN message.
3. The client confirms the server's response. Both parties have established a stable connection and begin transmitting data.

### Example

Host A sends a TCP SYN packet containing a random sequence number, let's assume 1000:

```bash
Host A ===(SYN=1000)===> Server
```

The server needs to acknowledge Host A's sequence number, so it increments it by 1 and also sends its own SYN:

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

After receiving the server's SYN, Host A sends an acknowledgment by incrementing the server's sequence number by 1:

```bash
Host A ===(ACK=2001)===> Server
```

### Would a two-way handshake work?

1. The purpose of the three-way handshake is to confirm that both the client and server can send and receive properly. With only two handshakes, the server would be unable to verify the client's receiving capability.
2. Without the third handshake, the client cannot receive the server's sequence number and therefore cannot send a confirmation. This could compromise data security.
3. In poor network conditions, data may arrive at different times. If old and new data arrive out of order, establishing a connection without the third handshake SYN confirmation could lead to network errors.

### What is ISN?

ISN stands for Initial Sequence Number. It tells the receiver what sequence number the sender will use when transmitting data. This is a randomly generated sequence number to prevent third-party attackers from guessing it and forging messages.

### At what point during the three-way handshake can data transmission begin?

The first and second handshakes are for confirming both parties' send/receive capabilities and cannot carry data. If data could be transmitted during the first handshake, malicious third parties could flood the server with fake data, forcing the server to consume memory for buffering — creating an opportunity for attack.

Only during the third handshake, after both parties have confirmed synchronization and are in a connected state, is data transmission allowed.

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)

## 3. Please describe the HTTP caching mechanism

The HTTP caching mechanism is a technique used in the HTTP protocol to temporarily store (or "cache") web data, aiming to reduce server load, lower latency, and improve page load speed. There are several main caching strategies:

1. **Freshness (Strong Cache)**: By setting `Expires` or `Cache-Control: max-age` response headers, the data can be considered fresh for a specific duration. The client can use the cached data directly without confirming with the server.

2. **Validation Cache**: Using `Last-Modified` and `ETag` response headers, the client can send a conditional request to the server. If the data hasn't been modified, the server returns a 304 (Not Modified) status code, indicating that the local cached data can be used.

3. **Negotiation Cache**: This approach relies on the `Vary` response header. The server decides whether to provide different cached content versions based on the client's request (e.g., `Accept-Language`).

4. **No-store**: If `Cache-Control: no-store` is set, the data should not be cached at all, and every request must fetch the latest data from the server.

The choice of caching strategy depends on factors such as data type and update frequency. An effective caching strategy can significantly improve the performance of web applications.

### Service Worker

From personal experience, after setting up PWA for a Web App, you can register basic styles, logos, or even an offline `offline.html` page in the `service-worker.js`. This way, even when the user is offline, through this caching mechanism, they can still be aware of the current website or network status, maintaining a reasonable user experience.
