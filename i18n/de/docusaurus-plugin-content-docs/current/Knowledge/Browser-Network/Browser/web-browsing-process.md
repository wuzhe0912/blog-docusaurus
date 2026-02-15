---
id: web-browsing-process
title: "\U0001F4C4 Web-Browsing-Prozess"
slug: /web-browsing-process
---

## 1. Erklaeren Sie, wie der Browser HTML vom Server erhaelt und wie er das HTML auf dem Bildschirm rendert

> Beschreiben Sie, wie der Browser HTML vom Server bezieht und wie er das HTML auf dem Bildschirm rendert

### 1. Anfrage initiieren

- **URL-Eingabe**: Der Benutzer gibt eine URL im Browser ein oder klickt auf einen Link. Der Browser beginnt dann, die URL zu analysieren, um festzustellen, an welchen Server die Anfrage gesendet werden soll.
- **DNS-Abfrage**: Der Browser fuehrt eine DNS-Abfrage durch, um die entsprechende IP-Adresse des Servers zu finden.
- **Verbindung herstellen**: Der Browser sendet eine Anfrage an die IP-Adresse des Servers ueber das Internet mit dem HTTP- oder HTTPS-Protokoll. Bei HTTPS muss zusaetzlich eine SSL/TLS-Verbindung hergestellt werden.

### 2. Server-Antwort

- **Anfrage verarbeiten**: Nachdem der Server die Anfrage empfangen hat, liest er die entsprechenden Daten aus der Datenbank basierend auf dem Pfad und den Parametern der Anfrage.
- **Response senden**: Anschliessend sendet er das HTML-Dokument als Teil der HTTP Response zurueck an den Browser. Die Response enthaelt auch Informationen wie Statuscodes und andere Parameter (CORS, content-type) usw.

### 3. HTML analysieren

- **DOM Tree aufbauen**: Der Browser beginnt, das HTML-Dokument zu lesen und wandelt es basierend auf den Tags und Attributen in DOM um und beginnt, den DOM Tree im Speicher aufzubauen.
- **Subresources anfordern**: Beim Analysieren des HTML-Dokuments, wenn externe Ressourcen wie CSS, JavaScript, Bilder usw. gefunden werden, sendet der Browser weitere Anfragen an den Server, um diese Ressourcen abzurufen.

### 4. Seite rendern

- **CSSOM Tree aufbauen**: Der Browser beginnt, die CSS-Dateien zu analysieren und baut den CSSOM Tree auf.
- **Render Tree**: Der Browser kombiniert den DOM Tree und den CSSOM Tree zu einem Render Tree, der alle zu rendernden Knoten und ihre entsprechenden Stile enthaelt.
- **Layout**: Der Browser fuehrt das Layout (Layout oder Reflow) durch und berechnet die Position und Groesse jedes Knotens.
- **Paint (Zeichnen)**: Schliesslich durchlaeuft der Browser die Zeichenphase (Painting) und zeichnet den Inhalt jedes Knotens auf die Seite.

### 5. JavaScript-Interaktion

- **JavaScript ausfuehren**: Wenn das HTML JavaScript enthaelt, analysiert und fuehrt der Browser es aus. Dies kann den DOM aendern und Stile modifizieren.

Der gesamte Prozess ist progressiv. Theoretisch sieht der Benutzer zuerst Teile des Seiteninhalts und schliesslich die vollstaendige Seite. Waehrend dieses Prozesses koennen mehrere Reflows und Repaints auftreten, insbesondere wenn die Seite komplexe Stile oder Interaktionseffekte enthaelt. Neben den Optimierungen, die der Browser selbst durchfuehrt, wenden Entwickler in der Regel verschiedene Techniken an, um die Benutzererfahrung fluessiger zu gestalten.

## 2. Beschreiben Sie Reflow und Repaint

### Reflow (Neuanordnung)

Bezieht sich auf Aenderungen im DOM einer Webseite, die dazu fuehren, dass der Browser die Positionen der Elemente neu berechnen und sie an die richtigen Stellen setzen muss. Einfach ausgedrueckt: Das Layout muss die Elemente neu anordnen.

#### Wann wird Reflow ausgeloest?

Reflow tritt in zwei Szenarien auf: Eines betrifft globale Aenderungen der gesamten Seite, das andere betrifft Aenderungen in einzelnen Komponentenbereichen.

- Beim erstmaligen Laden der Seite tritt der groesste Reflow auf
- Hinzufuegen oder Entfernen von DOM-Elementen
- Aenderung der Groesse eines Elements, z.B. durch Inhaltszuwachs oder Aenderung der Schriftgroesse
- Anpassung des Layouts eines Elements, z.B. Verschiebung durch margin oder padding
- Aenderung der Fenstergroesse des Browsers
- Aktivierung von Pseudo-Klassen, z.B. Hover-Effekte

### Repaint (Neuzeichnung)

Ohne das Layout zu aendern, werden lediglich Elemente aktualisiert oder geaendert. Da Elemente im Layout enthalten sind, fuehrt ein Reflow zwangslaeuflg auch zu einem Repaint. Umgekehrt fuehrt ein Repaint nicht unbedingt zu einem Reflow.

#### Wann wird Repaint ausgeloest?

- Aenderung der Farbe oder des Hintergrunds eines Elements, z.B. Hinzufuegen von color oder Anpassen von background-Eigenschaften
- Aenderung des Schattens oder der border eines Elements zaehlt ebenfalls als Repaint

### Wie man Reflow oder Repaint optimiert

- Verwenden Sie keine table fuer das Layout, da table-Eigenschaften bei Aenderungen leicht zu einem neuen Layout fuehren koennen. Wenn es unvermeidlich ist, empfiehlt es sich, die folgenden Eigenschaften hinzuzufuegen, damit jeweils nur eine Zeile gerendert wird, z.B. `table-layout: auto;` oder `table-layout: fixed;`.
- Manipulieren Sie nicht den DOM, um Stile einzeln anzupassen. Definieren Sie stattdessen die benoetigten Stile ueber Klassen und wechseln Sie sie per JS.
  - Am Beispiel des Vue-Frameworks koennen Sie Klassen binden, um Stile zu wechseln, anstatt Stile direkt mit Funktionen zu aendern.
- Fuer Szenarien, die haeufiges Umschalten erfordern, wie z.B. Tab-Wechsel, sollte `v-show` gegenueber `v-if` bevorzugt werden. Ersteres verwendet lediglich die CSS-Eigenschaft `display: none;` zum Ausblenden, waehrend Letzteres den Lebenszyklus ausloest, Elemente neu erstellt oder zerstoert, was natuerlich mehr Performance kostet.
- Wenn ein Reflow wirklich unvermeidlich ist, kann er mit `requestAnimationFrame` optimiert werden (hauptsaechlich weil diese API fuer Animationen konzipiert ist und mit der Frame-Rate des Browsers synchronisiert werden kann), wodurch mehrere Reflows zu einem zusammengefasst werden und die Anzahl der Repaints reduziert wird.
  - Beispielsweise kann bei einer Animation, die sich auf der Seite zu einem Ziel bewegen soll, `requestAnimationFrame` verwendet werden, um jede Bewegung zu berechnen.
  - Ebenso koennen einige CSS3-Eigenschaften die Hardware-Beschleunigung auf der Client-Seite aktivieren und die Animationsperformance verbessern, z.B. `transform`, `opacity`, `filters` und `Will-change`.
- Wenn moeglich, aendern Sie Stile an DOM-Knoten niedrigerer Ebene, um zu vermeiden, dass Stilaenderungen an uebergeordneten Elementen alle untergeordneten Elemente betreffen.
- Wenn Animationen ausgefuehrt werden muessen, verwenden Sie sie auf absolut positionierten Elementen `absolute` oder `fixed`, da dies andere Elemente wenig beeinflusst und nur Repaint ausloest, wodurch Reflow vermieden wird.

### Example

```js
// bad
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// good
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Reference

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)

## 3. Beschreiben Sie, wann der Browser eine OPTIONS-Anfrage an den Server sendet

> Beschreiben Sie, wann der Browser eine OPTIONS-Anfrage an den Server senden wird

In den meisten Faellen wird dies in CORS-Szenarien angewendet. Bevor die eigentliche Anfrage gesendet wird, gibt es eine Preflight-Aktion (Vorabpruefung), bei der der Browser zuerst eine OPTIONS-Anfrage sendet, um den Server zu fragen, ob die Cross-Origin-Anfrage erlaubt ist. Wenn der Server mit einer Erlaubnis antwortet, sendet der Browser die eigentliche Anfrage. Andernfalls, wenn sie nicht erlaubt ist, zeigt der Browser einen Fehler an.

Ausserdem wird eine OPTIONS-Anfrage auch dann ausgeloest, wenn die Anfragemethode nicht `GET`, `HEAD` oder `POST` ist.
