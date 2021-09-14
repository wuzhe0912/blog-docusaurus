---
id: 00-websocket-init
description: Init with WebSocket
slug: /websocket-init
---

# 00 - Setting up Environment

> Foreword：過往前後端溝通，需要仰賴 `Client` 端發起請求，譬如 `GET or POST`，但這對 `Server` 端來說，卻無法主動回傳。但當我使用 `WebSocket` 後，只需要透過一次握手，前後端就能建立持久性的雙向連接，達到數據傳輸的目的，這時 `Server` 端自然就能主動發訊息給 `Client` 端。
