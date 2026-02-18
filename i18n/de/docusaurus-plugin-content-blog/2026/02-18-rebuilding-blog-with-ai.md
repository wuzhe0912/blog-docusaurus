---
slug: rebuilding-blog-with-ai
title: 'Meinen gesamten Blog mit Claude Code neu aufgebaut'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

Vor 2023–2024 fand ich persönlich, dass ein klassischer Tech-Blog durchaus seinen Wert hatte. Man konnte seine Notizen zusammenfassen, Interview-Erfahrungen und Aufgaben festhalten, und sogar Fallstricke und Details dokumentieren, in die man mal reingetreten ist.

Aber ab Mitte 2025 wurden die Modelle immer schneller iteriert und gleichzeitig immer stärker. Sogar Cursor — ein AI Code Editor, den ich in der ersten Jahreshälfte 2025 noch ziemlich gut fand — konnte in der zweiten Jahreshälfte spürbar nicht mehr mit Claude Code mithalten. Da wusste ich: Zeit, mit der Zeit zu gehen und den ganzen Blog von Grund auf umzubauen (in der Hoffnung, dass der Wert erhalten bleibt).

<!--truncate-->

## Zahlen

Ich fange mal mit den Zahlen an, denn dieser Umfang wäre rein mit Menschenkraft extrem zeitaufwändig gewesen — und ich kann mit Sicherheit sagen, dass mich die Aufschieberitis mit hoher Wahrscheinlichkeit komplett besiegt hätte. Aber mit Hilfe von AI-Tools war es in 10 Tagen erledigt (und das auch noch während des chinesischen Neujahrsfests). Qualität ist akzeptabel — ein kleines Wunder, wenn man so will.

| Metric                      | Value                     |
| --------------------------- | ------------------------- |
| Duration                    | 10 days (Feb 8–18, 2026)  |
| Total commits               | 104                       |
| Files changed               | 1,078                     |
| Lines inserted              | 263,000+                  |
| Lines deleted               | 21,000+                   |
| Locales                     | 4 → 10                    |
| Docs translated to English  | 89                        |
| Translation files generated | 801 (89 docs × 9 locales) |
| Blog posts with full i18n   | 5                         |
| Tools used                  | Claude Code               |

## Was ich tatsächlich gemacht habe

### Phase 1: Grundgerüst (8.–9. Feb.) — 8 Commits

Startseite und About-Seite komplett von Grund auf neu designed. `CLAUDE.md` als Projektverfassung eingerichtet — Commit-Format, i18n-Regeln, Konventionen für die Dateistruktur. Sprachversionen von 4 auf 6 erweitert. Das Ganze lief komplett über die Interaktion mit Claude Code.

In dieser Phase ging es hauptsächlich um Architekturentscheidungen: Wie soll die Startseite aussehen? Wie soll die About-Seite aufgebaut sein? Welche Konventionen soll das Projekt befolgen? Diese Fragen wurden alle durch den Austausch mit Claude geklärt — vor allem beim Erstellen des Ausführungsplans. Ich war nur für Review und Anpassungen zuständig.

### Phase 2: Skalierung (11.–12. Feb.) — 14 Commits

Vier weitere Sprachversionen dazu (pt-BR, de, fr, vi), macht insgesamt 10. Theme-Übersetzungsdateien generiert. navbar und sidebar für bessere Inhaltsorganisation umgebaut. `defaultLocale` auf `en` umgestellt und Vercel i18n-Routing eingerichtet. Abhängigkeiten aktualisiert. Die Spracherweiterung war fast komplett mechanische Arbeit — genau das, worin AI glänzt. Verbraucht zwar massiv Token, aber per Hand wäre das in so kurzer Zeit schlicht unmöglich gewesen.

### Phase 3: Inhalte (13.–14. Feb.) — 14 Commits

Alte Blogbeiträge aufgeräumt. Einen Jahresrückblick geschrieben. Alle Blogbeiträge in 10 Sprachversionen übersetzt. Eine Projects-Showcase-Seite gebaut. Startseite-i18n fertiggestellt. UI-Bugs behoben (ShowcaseCard-Button-Ausrichtung, dropdown-Clipping).

Was in dieser Phase auffiel: AI ist nicht besonders gut darin, Layout-Probleme (UI-Bugs) beim ersten Mal zu erkennen. Es brauchte mehrere Iterationen, in denen ich (also der Mensch) immer wieder die Korrekturrichtung vorgeben musste, bis die Darstellung tatsächlich stimmte.

### Phase 4: Sidebar + Blog (15. Feb.) — 7 Commits

Die gesamte Docs-sidebar-Struktur reorganisiert. Alle sidebar-Kategorielabels für 10 Sprachversionen übersetzt. 206 verwaiste Übersetzungsschlüssel aus früheren Umbauten entfernt. Den Blogbeitrag über Abfindungsverhandlungen geschrieben und in alle Sprachversionen übersetzt.

### Phase 5: Docs i18n (16.–17. Feb.) — 14 Commits

Der größte Batch: 89 Dokumente in 9 nicht-englische Sprachversionen übersetzt, was 801 Übersetzungsdateien ergab. Abgedeckt wurden Knowledge (JavaScript, TypeScript, CSS, Vue, React, Browser, Security, Engineering), Experience und Coding.

Diese Phase und die nächste waren extrem Token-intensiv. Die hochgradig mechanische Übersetzungsarbeit wurde komplett der AI überlassen — sie durfte sich austoben (ich kann die meisten dieser Sprachen sowieso nicht lesen).

### Phase 6: Qualitätskorrekturen (17.–18. Feb.) — 24 Commits

Diese Phase existiert, weil die Ausgabe von Phase 5 nicht sauber genug war. Satte 24 Commits nur zum Korrigieren von AI-generierten Übersetzungen:

- **Deutsch**: Umlaute wurden als ASCII gerendert (`ue` statt `ü`, `ae` statt `ä`)
- **Französisch**: Akzente weggelassen (`e` statt `é`, `a` statt `à`)
- **Vietnamesisch**: Tonzeichen komplett verschwunden (Vietnamesisch ohne Tonzeichen ist quasi unlesbar)
- **Spanisch/Portugiesisch**: Akzentzeichen durchgehend gefehlt
- **Chinesisch Vereinfacht**: Traditionelle Schriftzeichen eingemischt (AI kann die beiden Schriftsysteme manchmal nicht auseinanderhalten)
- **CJK-Reste**: Unübersetzte chinesische Kommentare in Codeblöcken bei es, pt-BR, ja, ko, vi

Jede Korrektur brachte neue Probleme zum Vorschein. Bei der Akzentkorrektur für Portugiesisch wurde überkorrigiert, sodass die frontmatter-Felder `id` und `slug` kaputtgingen. Bei der Tonzeichen-Korrektur für Vietnamesisch wurde eine Datei übersehen. Die spanische Akzentkorrektur hatte Fehlerkennungen und brauchte einen weiteren Fix-Commit.

Ehrlich gesagt: In dieser Phase kann man als Mensch kaum eingreifen, es sei denn man beherrscht die jeweilige Sprache. Man ist komplett darauf angewiesen, verschiedene Modelle zur Kreuzvalidierung einzusetzen.

**Was AI nicht gut kann:**

```markdown
// Beispiel:

- Umlaute und Tonzeichen beim ersten Durchlauf korrekt setzen (Akzente, Umlaute, Tonzeichen)
- Traditionelles und vereinfachtes Chinesisch zuverlässig unterscheiden
- Erkennen, ob Kommentare im Code unübersetzt bleiben oder lokalisiert werden sollen
- frontmatter-Felder bei Inhaltstransformationen unangetastet lassen
```

## Fallstricke

**Akzent- und Tonzeichen-Desaster.** AI hat in fünf Sprachen nicht-ASCII-Zeichen durch ASCII-Annäherungen ersetzt. Das bescherte mir 24 Fix-Commits — fast ein Viertel der Gesamtzahl. Vietnamesisch war der schlimmste Fall: Ohne Tonzeichen ist die Sprache praktisch nicht erkennbar.

**Vermischung von traditionellem und vereinfachtem Chinesisch.** In den `zh-cn`-Übersetzungen tauchten traditionelle Schriftzeichen in Code-Kommentaren und Inline-Referenzen auf. AI kann die beiden Schriftsysteme nicht zuverlässig unterscheiden.

**frontmatter-Beschädigung.** Beim Übersetzen hat AI manchmal die `id`- und `slug`-Felder im frontmatter angefasst, was das Docusaurus-Routing kaputtgemacht hat. Ein Commit existiert nur dafür, die portugiesischen `id`- und `slug`-Felder zu reparieren, die bei der Akzentkorrektur beschädigt wurden.

**Überkorrektur-Kettenreaktionen.** Ein Problem zu fixen hat regelmäßig ein anderes ausgelöst. Die portugiesische Akzentkorrektur hat Fachbegriffe überkorrigiert. Die vietnamesische Tonzeichen-Korrektur hat eine Datei übersehen. Jeder „Fix"-Commit hatte eine gewisse Wahrscheinlichkeit, ein neues Problem zu erzeugen.

## Wo Menschen noch gebraucht werden

**Architekturentscheidungen.** Welche 10 Sprachen unterstützt werden. Wie die sidebar aufgebaut sein soll. Was ins navbar-dropdown kommt, was auf die oberste Ebene. Diese Entscheidungen haben die gesamte nachfolgende Arbeit geprägt.

**Qualitätsurteil.** Ob die UI kaputt aussieht, ob sie den Design-Vorgaben entspricht. Ob Übersetzungen offensichtliche Fehler haben — zum Beispiel ob die Umstellung des defaultLocale korrekt greift.

**Die `CLAUDE.md`-Datei.** Im Grunde eine Repo-Verfassung, die der AI die Projektkonventionen beibringt: Commit-Format, Dateistruktur, i18n-Regeln, was man auf keinen Fall tun darf. Je besser diese Datei wird, desto weniger Fehler macht die AI und desto seltener muss ein Mensch eingreifen. Deswegen muss sie ständig iteriert und aktualisiert werden.

## Erkenntnisse

**Fang mit einer guten `CLAUDE.md` an.** Jede Konvention, die du da reinschiebst, spart dir später Dutzende Korrekturschleifen. Meine ist von ein paar Zeilen zu einem vollständigen Dokument gewachsen — Commit-Format, i18n-Regeln, Projektstruktur und klare Verbote.

**Ähnliche Arbeiten bündeln, Ergebnisse im Batch prüfen.** Nicht eine Datei nach der anderen übersetzen. 15 ähnliche Dateien auf einmal an die AI geben, dann das Ergebnis als Ganzes prüfen. So vermeidet man, dass man zu viele Einzelentscheidungen treffen muss.

**Tools parallel nutzen, wo es geht.** Claude Code für interaktive Arbeit laufen lassen und gleichzeitig Arbeit an Gemini, Codex und Co. für Batch-Aufgaben übergeben — das war der größte Effizienzgewinn. Arbeit, die parallelisiert werden kann, nicht serialisieren.

**Alles dokumentieren.** Jede Commit-Nachricht, jede Phasengrenze, jeder Fix — alles steht in der Historie. Wenn du ein großes AI-gestütztes Projekt machst, IST dein Commit-Verlauf die Dokumentation.
