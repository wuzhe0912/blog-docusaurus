---
id: http-methods
title: "\U0001F4C4 HTTP-Methoden"
slug: /http-methods
---

## 1. Was ist die RESTful API?

Das Schreiben einer RESTful API verwendet einen standardisierten Designstil, um die Kommunikation zwischen verschiedenen Systemen im Netzwerk zu erleichtern. Um den REST-Prinzipien zu folgen, sollte die API vorhersehbar und leicht verstaendlich sein. Als Frontend-Entwickler liegt der Fokus hauptsaechlich auf den folgenden drei Punkten:

- **URL-Pfad (URL path)**: Bestimmt den Umfang der Client-Anfrage, zum Beispiel:
  - `/products`: Gibt moeglicherweise eine Produktliste zurueck
  - `/products/abc`: Liefert Details zum Produkt mit der ID abc
- **HTTP-Methoden**: Definieren die spezifische Ausfuehrungsweise:
  - `GET`: Zum Abrufen von Daten
  - `POST`: Zum Erstellen neuer Daten
  - `PUT`: Zum Aktualisieren bestehender Daten
  - `DELETE`: Zum Loeschen von Daten
- **Statuscode (status code)**: Gibt einen schnellen Hinweis darauf, ob die Anfrage erfolgreich war, und falls nicht, wo das Problem liegen koennte. Gaengige Statuscodes sind:
  - `200`: Erfolg
  - `404`: Angeforderte Ressource nicht gefunden
  - `500`: Serverfehler

## 2. Wenn GET auch Daten in einer Anfrage transportieren kann, warum sollten wir POST verwenden?

> Da `GET` auch Anfragen mit Daten senden kann, warum muessen wir noch `POST` verwenden?

Hauptsaechlich basierend auf diesen vier Ueberlegungen:

1. Sicherheit: Da die Daten bei `GET` an die URL angehaengt werden, sind sensible Daten natuerlich leichter exponiert, waehrend `POST` die Daten im `body` der Anfrage platziert, was relativ sicherer ist.
2. Datengroessenbeschraenkung: Bei `GET` ist die Datenmenge aufgrund der URL-Laengenbeschraenkungen von Browsern und Servern begrenzt (obwohl sie je nach Browser leicht variiert, liegt sie im Allgemeinen bei etwa 2048 Bytes). Obwohl `POST` nominell keine Begrenzung hat, wird in der Praxis, um boeswillige Angriffe mit grossen Datenmengen zu verhindern, die Datengroesse normalerweise durch Middleware begrenzt, wie z.B. `body-parser` von `express`.
3. Semantische Klarheit: Stellt sicher, dass Entwickler den Zweck der Anfrage klar verstehen koennen. `GET` wird typischerweise zum Abrufen von Daten verwendet, waehrend `POST` besser zum Erstellen oder Aktualisieren von Daten geeignet ist.
4. Unveraenderlichkeit (Immutability): Im HTTP-Protokoll ist die `GET`-Methode als "sicher" konzipiert -- unabhaengig davon, wie viele Anfragen gesendet werden, besteht keine Sorge, dass dies Aenderungen an den Daten auf dem Server verursacht.

## 3. Was macht die PUT-Methode in HTTP?

> Was ist der Zweck der `PUT`-Methode?

Sie hat hauptsaechlich zwei Verwendungszwecke:

1. Aktualisierung bereits vorhandener Daten (z.B. Aendern von Benutzerinformationen)
2. Wenn die Daten nicht existieren, neue Daten erstellen

### Example

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // api URL
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // PUT-Anfrage ausfuehren
    console.log('User updated:', response.data); // Aktualisierte Benutzerinformationen ausgeben
  } catch (error) {
    console.log('Error updating user:', error); // Fehlermeldung ausgeben
  }
}

updateUser(1, 'Pitt Wu');
```
