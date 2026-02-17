---
id: web-browsing-process
title: "\U0001F4C4 Web-Browsing-Prozess"
slug: /web-browsing-process
---

## 1. Erklären Sie, wie der Browser HTML vom Server erhält und wie er das HTML auf dem Bildschirm rendert

> Beschreiben Sie, wie der Browser HTML vom Server bezieht und wie er das HTML auf dem Bildschirm rendert

### 1. Anfrage initiieren

- **URL-Eingabe**: Der Benutzer gibt eine URL im Browser ein oder klickt auf einen Link. Der Browser beginnt dann, die URL zu analysieren, um festzustellen, an welchen Server die Anfrage gesendet werden soll.
- **DNS-Abfrage**: Der Browser führt eine DNS-Abfrage durch, um die entsprechende IP-Adresse des Servers zu finden.
- **Verbindung herstellen**: Der Browser sendet eine Anfrage an die IP-Adresse des Servers über das Internet mit dem HTTP- oder HTTPS-Protokoll. Bei HTTPS muss zusätzlich eine SSL/TLS-Verbindung hergestellt werden.

### 2. Server-Antwort

- **Anfrage verarbeiten**: Nachdem der Server die Anfrage empfangen hat, liest er die entsprechenden Daten aus der Datenbank basierend auf dem Pfad und den Parametern der Anfrage.
- **Response senden**: Anschließend sendet er das HTML-Dokument als Teil der HTTP Response zurück an den Browser. Die Response enthält auch Informationen wie Statuscodes und andere Parameter (CORS, content-type) usw.

### 3. HTML analysieren

- **DOM Tree aufbauen**: Der Browser beginnt, das HTML-Dokument zu lesen und wandelt es basierend auf den Tags und Attributen in DOM um und beginnt, den DOM Tree im Speicher aufzubauen.
- **Subresources anfordern**: Beim Analysieren des HTML-Dokuments, wenn externe Ressourcen wie CSS, JavaScript, Bilder usw. gefunden werden, sendet der Browser weitere Anfragen an den Server, um diese Ressourcen abzurufen.

### 4. Seite rendern

- **CSSOM Tree aufbauen**: Der Browser beginnt, die CSS-Dateien zu analysieren und baut den CSSOM Tree auf.
- **Render Tree**: Der Browser kombiniert den DOM Tree und den CSSOM Tree zu einem Render Tree, der alle zu rendernden Knoten und ihre entsprechenden Stile enthält.
- **Layout**: Der Browser führt das Layout (Layout oder Reflow) durch und berechnet die Position und Größe jedes Knotens.
- **Paint (Zeichnen)**: Schließlich durchläuft der Browser die Zeichenphase (Painting) und zeichnet den Inhalt jedes Knotens auf die Seite.

### 5. JavaScript-Interaktion

- **JavaScript ausführen**: Wenn das HTML JavaScript enthält, analysiert und führt der Browser es aus. Dies kann den DOM ändern und Stile modifizieren.

Der gesamte Prozess ist progressiv. Theoretisch sieht der Benutzer zuerst Teile des Seiteninhalts und schließlich die vollständige Seite. Während dieses Prozesses können mehrere Reflows und Repaints auftreten, insbesondere wenn die Seite komplexe Stile oder Interaktionseffekte enthält. Neben den Optimierungen, die der Browser selbst durchführt, wenden Entwickler in der Regel verschiedene Techniken an, um die Benutzererfahrung flüssiger zu gestalten.

## 2. Beschreiben Sie Reflow und Repaint

### Reflow (Neuanordnung)

Bezieht sich auf Änderungen im DOM einer Webseite, die dazu führen, dass der Browser die Positionen der Elemente neu berechnen und sie an die richtigen Stellen setzen muss. Einfach ausgedrückt: Das Layout muss die Elemente neu anordnen.

#### Wann wird Reflow ausgelöst?

Reflow tritt in zwei Szenarien auf: Eines betrifft globale Änderungen der gesamten Seite, das andere betrifft Änderungen in einzelnen Komponentenbereichen.

- Beim erstmaligen Laden der Seite tritt der größte Reflow auf
- Hinzufügen oder Entfernen von DOM-Elementen
- Änderung der Größe eines Elements, z.B. durch Inhaltszuwachs oder Änderung der Schriftgröße
- Anpassung des Layouts eines Elements, z.B. Verschiebung durch margin oder padding
- Änderung der Fenstergröße des Browsers
- Aktivierung von Pseudo-Klassen, z.B. Hover-Effekte

### Repaint (Neuzeichnung)

Ohne das Layout zu ändern, werden lediglich Elemente aktualisiert oder geändert. Da Elemente im Layout enthalten sind, führt ein Reflow zwangsläufig auch zu einem Repaint. Umgekehrt führt ein Repaint nicht unbedingt zu einem Reflow.

#### Wann wird Repaint ausgelöst?

- Änderung der Farbe oder des Hintergrunds eines Elements, z.B. Hinzufügen von color oder Anpassen von background-Eigenschaften
- Änderung des Schattens oder der border eines Elements zählt ebenfalls als Repaint

### Wie man Reflow oder Repaint optimiert

- Verwenden Sie keine table für das Layout, da table-Eigenschaften bei Änderungen leicht zu einem neuen Layout führen können. Wenn es unvermeidlich ist, empfiehlt es sich, die folgenden Eigenschaften hinzuzufügen, damit jeweils nur eine Zeile gerendert wird, z.B. `table-layout: auto;` oder `table-layout: fixed;`.
- Manipulieren Sie nicht den DOM, um Stile einzeln anzupassen. Definieren Sie stattdessen die benötigten Stile über Klassen und wechseln Sie sie per JS.
  - Am Beispiel des Vue-Frameworks können Sie Klassen binden, um Stile zu wechseln, anstatt Stile direkt mit Funktionen zu ändern.
- Für Szenarien, die häufiges Umschalten erfordern, wie z.B. Tab-Wechsel, sollte `v-show` gegenüber `v-if` bevorzugt werden. Ersteres verwendet lediglich die CSS-Eigenschaft `display: none;` zum Ausblenden, während Letzteres den Lebenszyklus auslöst, Elemente neu erstellt oder zerstört, was natürlich mehr Performance kostet.
- Wenn ein Reflow wirklich unvermeidlich ist, kann er mit `requestAnimationFrame` optimiert werden (hauptsächlich weil diese API für Animationen konzipiert ist und mit der Frame-Rate des Browsers synchronisiert werden kann), wodurch mehrere Reflows zu einem zusammengefasst werden und die Anzahl der Repaints reduziert wird.
  - Beispielsweise kann bei einer Animation, die sich auf der Seite zu einem Ziel bewegen soll, `requestAnimationFrame` verwendet werden, um jede Bewegung zu berechnen.
  - Ebenso können einige CSS3-Eigenschaften die Hardware-Beschleunigung auf der Client-Seite aktivieren und die Animationsperformance verbessern, z.B. `transform`, `opacity`, `filters` und `Will-change`.
- Wenn möglich, ändern Sie Stile an DOM-Knoten niedrigerer Ebene, um zu vermeiden, dass Stiländerungen an übergeordneten Elementen alle untergeordneten Elemente betreffen.
- Wenn Animationen ausgeführt werden müssen, verwenden Sie sie auf absolut positionierten Elementen `absolute` oder `fixed`, da dies andere Elemente wenig beeinflusst und nur Repaint auslöst, wodurch Reflow vermieden wird.

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
- [Browser Reflow und Repaint](https://juejin.cn/post/6844903569087266823)
- [Einführung zu Reflow & Repaint und Optimierungsmethoden](https://juejin.cn/post/7064077572132323365)

## 3. Beschreiben Sie, wann der Browser eine OPTIONS-Anfrage an den Server sendet

> Beschreiben Sie, wann der Browser eine OPTIONS-Anfrage an den Server senden wird

In den meisten Fällen wird dies in CORS-Szenarien angewendet. Bevor die eigentliche Anfrage gesendet wird, gibt es eine Preflight-Aktion (Vorabprüfung), bei der der Browser zuerst eine OPTIONS-Anfrage sendet, um den Server zu fragen, ob die Cross-Origin-Anfrage erlaubt ist. Wenn der Server mit einer Erlaubnis antwortet, sendet der Browser die eigentliche Anfrage. Andernfalls, wenn sie nicht erlaubt ist, zeigt der Browser einen Fehler an.

Außerdem wird eine OPTIONS-Anfrage auch dann ausgelöst, wenn die Anfragemethode nicht `GET`, `HEAD` oder `POST` ist.
