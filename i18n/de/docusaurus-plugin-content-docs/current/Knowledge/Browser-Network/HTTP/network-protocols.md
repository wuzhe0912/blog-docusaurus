---
id: network-protocols
title: "\U0001F4C4 Netzwerkprotokolle"
slug: /network-protocols
---

## 1. Beschreiben Sie TCP, HTTP, HTTPS und WebSocket

1. **TCP (Transmission Control Protocol)**:
   TCP ist ein zuverlässiges, verbindungsorientiertes Protokoll, das für die zuverlässige Übertragung von Daten zwischen zwei Computern im Internet verwendet wird. Es garantiert die Reihenfolge und Zuverlässigkeit der Datenpakete -- das bedeutet, dass die Daten unabhängig von den Netzwerkbedingungen vollständig und unversehrt am Ziel ankommen.

2. **HTTP (Hypertext Transfer Protocol)**:
   HTTP ist das Protokoll zur Übertragung von Hypertext (also Webseiten). Es baut auf dem TCP-Protokoll auf und bietet eine Möglichkeit für Browser und Server zu kommunizieren. HTTP ist zustandslos (stateless), was bedeutet, dass der Server keine Informationen über den Benutzer speichert.

3. **HTTPS (Hypertext Transfer Protocol Secure)**:
   HTTPS ist die sichere Version von HTTP. Es verschlüsselt die HTTP-Datenübertragung über das SSL/TLS-Protokoll, schützt die Sicherheit der ausgetauschten Daten und verhindert Man-in-the-Middle-Angriffe, wodurch die Privatsphäre und Integrität der Daten gewährleistet wird.

4. **WebSocket**:
   Das WebSocket-Protokoll bietet eine Möglichkeit, eine dauerhafte Verbindung zwischen Client und Server herzustellen, die es beiden Seiten ermöglicht, nach dem Verbindungsaufbau eine bidirektionale Echtzeit-Datenübertragung durchzuführen. Dies unterscheidet sich von traditionellen HTTP-Anfragen, bei denen für jede Übertragung eine neue Verbindung hergestellt werden muss. WebSocket eignet sich besser für Echtzeit-Kommunikation und Anwendungen, die schnelle Datenaktualisierungen erfordern.

## 2. Was ist der Three Way Handshake?

Der Three Way Handshake (Drei-Wege-Handshake) bezeichnet den Verbindungsaufbauprozess zwischen Server und Client in einem `TCP/IP`-Netzwerk. Während des Prozesses gibt es drei Schritte, um zu bestätigen, dass die Sende- und Empfangsfähigkeiten beider Seiten normal sind, und um die Datensynchronisation und Sicherheit durch die initiale Sequenznummer (ISN) sicherzustellen.

### TCP-Nachrichtentypen

Bevor man die Schritte versteht, muss man die Hauptfunktion jedes Nachrichtentyps kennen:

| Nachricht | Beschreibung                                                                       |
| --------- | ---------------------------------------------------------------------------------- |
| SYN       | Wird zum Initiieren und Aufbauen einer Verbindung verwendet und hilft auch bei der Synchronisierung von Sequenznummern zwischen Geräten |
| ACK       | Wird verwendet, um der Gegenseite den Empfang des SYN zu bestätigen              |
| SYN-ACK   | Synchronisationsbestätigung, sendet das eigene SYN und gleichzeitig ein ACK      |
| FIN       | Verbindung beenden                                                                 |

### Schritte

1. Der Client beginnt den Verbindungsaufbau mit dem Server und sendet eine SYN-Nachricht, die dem Server mitteilt, dass er bereit ist, die Kommunikation zu beginnen, und welche Sequenznummer er sendet.
2. Nachdem der Server die SYN-Nachricht empfangen hat, bereitet er die Antwort an den Client vor, inkrementiert die empfangene SYN-Sequenznummer um +1, sendet sie per ACK zurück und sendet gleichzeitig seine eigene SYN-Nachricht.
3. Der Client bestätigt, dass der Server geantwortet hat, beide Seiten haben eine stabile Verbindung hergestellt und beginnen mit der Datenübertragung.

### Example

Host A sendet ein TCP-SYN-Datenpaket an den Server, das eine zufällige Sequenznummer enthält. Hier nehmen wir 1000 an.

```bash
Host A ===(SYN=1000)===> Server
```

Der Server muss auf die vom Host A gegebene Sequenznummer antworten, inkrementiert sie daher um +1 und sendet gleichzeitig sein eigenes SYN.

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Nachdem Host A das SYN des Servers empfangen hat, muss er eine Bestätigungssequenznummer als Antwort senden und inkrementiert daher die Sequenznummer des Servers um +1.

```bash
Host A ===(ACK=2001)===> Server
```

### Würden zwei Handshake-Schritte ausreichen?

1. Der Zweck des Three-Way-Handshake ist es, zu bestätigen, dass die Sende- und Empfangsfähigkeiten sowohl des Clients als auch des Servers normal sind. Bei nur zwei Schritten könnte der Server die Empfangsfähigkeit des Clients nicht überprüfen.
2. Aufgrund des fehlenden dritten Handshakes würde der Client die Sequenznummer des Servers nicht empfangen und könnte natürlich keine Bestätigung senden, was die Datensicherheit in Frage stellen könnte.
3. In schwachen Netzwerkumgebungen kann die Ankunftszeit der Daten variieren. Wenn neue und alte Daten in falscher Reihenfolge ankommen und eine Verbindung ohne die SYN-Bestätigung des dritten Handshakes hergestellt wird, könnten Netzwerkfehler auftreten.

### Was ist ISN?

ISN steht für Initial Sequence Number (Initiale Sequenznummer) und wird verwendet, um dem Empfänger mitzuteilen, welche Sequenznummer der Sender beim Senden von Daten verwenden wird. Es handelt sich um eine zufällig dynamisch generierte Sequenznummer, um zu verhindern, dass Dritte sie erraten und Nachrichten fälschen könnten.

### Wann beginnt die Datenübertragung während des Three-Way-Handshake?

Der Zweck des ersten und zweiten Handshakes besteht darin, die Sende- und Empfangsfähigkeiten beider Seiten zu bestätigen, und es können keine Daten übertragen werden. Wenn beim ersten Handshake bereits Daten übertragen werden könnten, könnten böswillige Dritte große Mengen gefälschter Daten senden und den Server zwingen, Speicherplatz für das Caching aufzuwenden, was eine Angriffsmöglichkeit schaffen würde.

Erst beim dritten Handshake, wenn beide Seiten die Synchronisation bestätigt haben und sich im Verbindungszustand befinden, ist die Datenübertragung erlaubt.

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [Zweites Taobao-Interview: sehr detaillierte Fragen zum TCP Three-Way Handshake](https://www.eet-china.com/mp/a44399.html)

## 3. Beschreiben Sie den HTTP-Caching-Mechanismus

Der HTTP-Caching-Mechanismus ist eine Technik im HTTP-Protokoll zur vorübergehenden Speicherung (oder "Caching") von Webseitendaten, um die Serverlast zu reduzieren, die Latenz zu verringern und die Ladegeschwindigkeit von Webseiten zu verbessern. Es gibt mehrere Hauptcaching-Strategien:

1. **Starkes Caching (Freshness)**: Durch das Setzen der Response-Header `Expires` oder `Cache-Control: max-age` wird angezeigt, dass Daten innerhalb eines bestimmten Zeitraums als aktuell betrachtet werden können und der Client sie direkt verwenden kann, ohne beim Server nachfragen zu müssen.

2. **Validierungs-Caching (Validation)**: Mit den Response-Headern `Last-Modified` und `ETag` kann der Client eine bedingte Anfrage an den Server senden. Wenn die Daten nicht geändert wurden, wird der Statuscode 304 (Not Modified) zurückgegeben, was bedeutet, dass die lokalen Cache-Daten verwendet werden können.

3. **Verhandlungs-Caching (Negotiation)**: Diese Methode basiert auf dem Response-Header `Vary`. Der Server entscheidet basierend auf der Anfrage des Clients (z.B. `Accept-Language`), ob verschiedene Versionen des gecachten Inhalts bereitgestellt werden.

4. **Kein Caching (No-store)**: Wenn `Cache-Control: no-store` gesetzt ist, bedeutet dies, dass die Daten nicht gecacht werden sollen und jede Anfrage die neuesten Daten vom Server abrufen muss.

Die Wahl der Caching-Strategie wird durch Faktoren wie Datentyp und Aktualisierungshäufigkeit bestimmt. Eine effektive Caching-Strategie kann die Performance von Webanwendungen erheblich verbessern.

### Service Worker

Aus meiner persönlichen Erfahrung kann man, nachdem man PWA für eine Web App eingerichtet hat, einige grundlegende Stile, das Logo oder sogar eine offline.html für die Offline-Nutzung im service-worker.js registrieren. Auf diese Weise kann der Benutzer, selbst wenn er offline ist, über diesen Caching-Mechanismus den aktuellen Status der Website oder des Netzwerks erfahren und ein gewisses Maß an Benutzererfahrung beibehalten.
