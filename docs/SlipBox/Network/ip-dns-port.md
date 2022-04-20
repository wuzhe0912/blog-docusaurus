---
id: ip-dns-port
title: 📜 IP, DNS and Port
slug: /ip-dns-port
---

> _Slow and steady wins the race._

## IP

In computer, everything is composed of 0 and 1, this smallest unit is also called binary digits(bit).

8 bits => 1 byte

When I arrange to 8 numbers of 0 and 1. I can get :

```javascript
2^8=256   // 0~255
```

IP address is composed of 4Bytes.

4 bytes = 32 bits

So we can get `2^32`, almost 4.29 billion. In Past, this is also known as IPv4.

But this amount is not enough for all human beings.

Now we use 16 bytes, `2^128` can get an astronomical number, meet the needs of the current stage, also known as IPv6.

## DNS(Domain Name System)

Every website address is composed of number, but we can't remember a lot of numbers.

So we use text url, and pass through DNS convert text url into number.

## Port

80 => HTTP

443 => HTTPS

20 => FTP

53 => DNS
