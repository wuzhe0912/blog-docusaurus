---
id: network-protocols
title: "\U0001F4C4 Netzwerkprotokolle"
slug: /network-protocols
---

## 1. Beschreiben Sie TCP, HTTP, HTTPS und WebSocket

1. **TCP (Transmission Control Protocol)**:
   TCP ist ein zuverlaessiges, verbindungsorientiertes Protokoll, das fuer die zuverlaessige Uebertragung von Daten zwischen zwei Computern im Internet verwendet wird. Es garantiert die Reihenfolge und Zuverlaessigkeit der Datenpakete -- das bedeutet, dass die Daten unabhaengig von den Netzwerkbedingungen vollstaendig und unversehrt am Ziel ankommen.

2. **HTTP (Hypertext Transfer Protocol)**:
   HTTP ist das Protokoll zur Uebertragung von Hypertext (also Webseiten). Es baut auf dem TCP-Protokoll auf und bietet eine Moeglichkeit fuer Browser und Server zu kommunizieren. HTTP ist zustandslos (stateless), was bedeutet, dass der Server keine Informationen ueber den Benutzer speichert.

3. **HTTPS (Hypertext Transfer Protocol Secure)**:
   HTTPS ist die sichere Version von HTTP. Es verschluesselt die HTTP-Datenuebertragung ueber das SSL/TLS-Protokoll, schuetzt die Sicherheit der ausgetauschten Daten und verhindert Man-in-the-Middle-Angriffe, wodurch die Privatsphaere und Integritaet der Daten gewaehrleistet wird.

4. **WebSocket**:
   Das WebSocket-Protokoll bietet eine Moeglichkeit, eine dauerhafte Verbindung zwischen Client und Server herzustellen, die es beiden Seiten ermoeglicht, nach dem Verbindungsaufbau eine bidirektionale Echtzeit-Datenuebertragung durchzufuehren. Dies unterscheidet sich von traditionellen HTTP-Anfragen, bei denen fuer jede Uebertragung eine neue Verbindung hergestellt werden muss. WebSocket eignet sich besser fuer Echtzeit-Kommunikation und Anwendungen, die schnelle Datenaktualisierungen erfordern.

## 2. Was ist der Three Way Handshake?

Der Three Way Handshake (Drei-Wege-Handshake) bezeichnet den Verbindungsaufbauprozess zwischen Server und Client in einem `TCP/IP`-Netzwerk. Waehrend des Prozesses gibt es drei Schritte, um zu bestaetigen, dass die Sende- und Empfangsfaehigkeiten beider Seiten normal sind, und um die Datensynchronisation und Sicherheit durch die initiale Sequenznummer (ISN) sicherzustellen.

### TCP-Nachrichtentypen

Bevor man die Schritte versteht, muss man die Hauptfunktion jedes Nachrichtentyps kennen:

| Nachricht | Beschreibung                                                                       |
| --------- | ---------------------------------------------------------------------------------- |
| SYN       | Wird zum Initiieren und Aufbauen einer Verbindung verwendet und hilft auch bei der Synchronisierung von Sequenznummern zwischen Geraeten |
| ACK       | Wird verwendet, um der Gegenseite den Empfang des SYN zu bestaetigen              |
| SYN-ACK   | Synchronisationsbestaetigung, sendet das eigene SYN und gleichzeitig ein ACK      |
| FIN       | Verbindung beenden                                                                 |

### Schritte

1. Der Client beginnt den Verbindungsaufbau mit dem Server und sendet eine SYN-Nachricht, die dem Server mitteilt, dass er bereit ist, die Kommunikation zu beginnen, und welche Sequenznummer er sendet.
2. Nachdem der Server die SYN-Nachricht empfangen hat, bereitet er die Antwort an den Client vor, inkrementiert die empfangene SYN-Sequenznummer um +1, sendet sie per ACK zurueck und sendet gleichzeitig seine eigene SYN-Nachricht.
3. Der Client bestaetigt, dass der Server geantwortet hat, beide Seiten haben eine stabile Verbindung hergestellt und beginnen mit der Datenuebertragung.

### Example

Host A sendet ein TCP-SYN-Datenpaket an den Server, das eine zufaellige Sequenznummer enthaelt. Hier nehmen wir 1000 an.

```bash
Host A ===(SYN=1000)===> Server
```

Der Server muss auf die vom Host A gegebene Sequenznummer antworten, inkrementiert sie daher um +1 und sendet gleichzeitig sein eigenes SYN.

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Nachdem Host A das SYN des Servers empfangen hat, muss er eine Bestaetigungssequenznummer als Antwort senden und inkrementiert daher die Sequenznummer des Servers um +1.

```bash
Host A ===(ACK=2001)===> Server
```

### Wuerden zwei Handshake-Schritte ausreichen?

1. Der Zweck des Three-Way-Handshake ist es, zu bestaetigen, dass die Sende- und Empfangsfaehigkeiten sowohl des Clients als auch des Servers normal sind. Bei nur zwei Schritten koennte der Server die Empfangsfaehigkeit des Clients nicht ueberpruefen.
2. Aufgrund des fehlenden dritten Handshakes wuerde der Client die Sequenznummer des Servers nicht empfangen und koennte natuerlich keine Bestaetigung senden, was die Datensicherheit in Frage stellen koennte.
3. In schwachen Netzwerkumgebungen kann die Ankunftszeit der Daten variieren. Wenn neue und alte Daten in falscher Reihenfolge ankommen und eine Verbindung ohne die SYN-Bestaetigung des dritten Handshakes hergestellt wird, koennten Netzwerkfehler auftreten.

### Was ist ISN?

ISN steht fuer Initial Sequence Number (Initiale Sequenznummer) und wird verwendet, um dem Empfaenger mitzuteilen, welche Sequenznummer der Sender beim Senden von Daten verwenden wird. Es handelt sich um eine zufaellig dynamisch generierte Sequenznummer, um zu verhindern, dass Dritte sie erraten und Nachrichten faelschen koennten.

### Wann beginnt die Datenuebertragung waehrend des Three-Way-Handshake?

Der Zweck des ersten und zweiten Handshakes besteht darin, die Sende- und Empfangsfaehigkeiten beider Seiten zu bestaetigen, und es koennen keine Daten uebertragen werden. Wenn beim ersten Handshake bereits Daten uebertragen werden koennten, koennten boeswillige Dritte grosse Mengen gefaelschter Daten senden und den Server zwingen, Speicherplatz fuer das Caching aufzuwenden, was eine Angriffsmoeglichkeit schaffen wuerde.

Erst beim dritten Handshake, wenn beide Seiten die Synchronisation bestaetigt haben und sich im Verbindungszustand befinden, ist die Datenuebertragung erlaubt.

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)

## 3. Beschreiben Sie den HTTP-Caching-Mechanismus

Der HTTP-Caching-Mechanismus ist eine Technik im HTTP-Protokoll zur voruebergehenden Speicherung (oder "Caching") von Webseitendaten, um die Serverlast zu reduzieren, die Latenz zu verringern und die Ladegeschwindigkeit von Webseiten zu verbessern. Es gibt mehrere Hauptcaching-Strategien:

1. **Starkes Caching (Freshness)**: Durch das Setzen der Response-Header `Expires` oder `Cache-Control: max-age` wird angezeigt, dass Daten innerhalb eines bestimmten Zeitraums als aktuell betrachtet werden koennen und der Client sie direkt verwenden kann, ohne beim Server nachfragen zu muessen.

2. **Validierungs-Caching (Validation)**: Mit den Response-Headern `Last-Modified` und `ETag` kann der Client eine bedingte Anfrage an den Server senden. Wenn die Daten nicht geaendert wurden, wird der Statuscode 304 (Not Modified) zurueckgegeben, was bedeutet, dass die lokalen Cache-Daten verwendet werden koennen.

3. **Verhandlungs-Caching (Negotiation)**: Diese Methode basiert auf dem Response-Header `Vary`. Der Server entscheidet basierend auf der Anfrage des Clients (z.B. `Accept-Language`), ob verschiedene Versionen des gecachten Inhalts bereitgestellt werden.

4. **Kein Caching (No-store)**: Wenn `Cache-Control: no-store` gesetzt ist, bedeutet dies, dass die Daten nicht gecacht werden sollen und jede Anfrage die neuesten Daten vom Server abrufen muss.

Die Wahl der Caching-Strategie wird durch Faktoren wie Datentyp und Aktualisierungshaeufigkeit bestimmt. Eine effektive Caching-Strategie kann die Performance von Webanwendungen erheblich verbessern.

### Service Worker

Aus meiner persoenlichen Erfahrung kann man, nachdem man PWA fuer eine Web App eingerichtet hat, einige grundlegende Stile, das Logo oder sogar eine offline.html fuer die Offline-Nutzung im service-worker.js registrieren. Auf diese Weise kann der Benutzer, selbst wenn er offline ist, ueber diesen Caching-Mechanismus den aktuellen Status der Website oder des Netzwerks erfahren und ein gewisses Mass an Benutzererfahrung beibehalten.
