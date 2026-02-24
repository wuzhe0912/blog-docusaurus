---
slug: rebuilding-blog-with-ai
title: 'Ricostruire il mio intero blog con Claude Code'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

Prima del 2023-2024, pensavo ancora che il blog tecnico tradizionale avesse un valore reale. Potevi consolidare i tuoi appunti, le esperienze di colloquio, i problemi incontrati, le trappole in cui eri caduto. Una base di conoscenza personale che significava davvero qualcosa.

Ma dalla metà del 2025 in poi, i modelli hanno iniziato a iterare più velocemente e a diventare significativamente più forti. Persino Cursor -- che mi piaceva genuinamente all'inizio del 2025 come editor di codice AI -- sembrava notevolmente superato da Claude Code nella seconda metà dell'anno. È stato allora che ho capito che era il momento di demolire l'intero blog e ricostruirlo da zero (sperando di preservare qualunque valore ci fosse ancora).

<!--truncate-->

## I numeri

Partiamo dai dati, perché il volume qui sarebbe stato assolutamente devastante da fare a mano. Posso dire con piena sicurezza che la mia procrastinazione avrebbe ucciso questo progetto dieci volte. Ma con gli strumenti AI, è stato completato in 10 giorni (durante il Capodanno Lunare, per giunta) -- la qualità era decente, un piccolo miracolo onestamente.

| Metrica                        | Valore                    |
| ------------------------------ | ------------------------- |
| Durata                         | 10 giorni (8-18 feb 2026) |
| Commit totali                  | 104                       |
| File modificati                | 1.078                     |
| Righe inserite                 | 263.000+                  |
| Righe eliminate                | 21.000+                   |
| Lingue supportate              | 4 → 10                    |
| Docs tradotti in inglese       | 89                        |
| File di traduzione generati    | 801 (89 docs × 9 lingue) |
| Post del blog con i18n completo| 5                         |
| Strumenti utilizzati           | Claude Code               |

## Cosa ho effettivamente fatto

### Fase 1: Fondamenta (8-9 feb) -- 8 commit

Ho ridisegnato la homepage e la pagina About da zero. Ho configurato `CLAUDE.md` come la costituzione del progetto -- formato dei commit, regole i18n, convenzioni sulla struttura dei file. Ho espanso le lingue da 4 a 6. Tutto fatto in modo interattivo con Claude Code.

Questa fase è stata principalmente decisioni architetturali: come dovrebbe apparire la homepage? Come dovrebbe essere strutturata la pagina About? Quali convenzioni dovrebbe seguire l'intero progetto? Queste domande sono state tutte elaborate attraverso uno scambio continuo con Claude -- specialmente il piano di esecuzione. Io mi occupavo solo della revisione e degli aggiustamenti.

### Fase 2: Scalare (11-12 feb) -- 14 commit

Ho aggiunto altre 4 lingue (pt-BR, de, fr, vi) per arrivare a 10 in totale. Ho generato i file di traduzione del tema. Ho ridisegnato la navbar e la sidebar per una migliore organizzazione dei contenuti. Ho cambiato `defaultLocale` a `en` con il routing i18n di Vercel. Ho aggiornato le dipendenze. L'espansione delle lingue era quasi interamente lavoro meccanico -- esattamente il tipo di cosa in cui l'AI eccelle. Ha bruciato molti Token, ma fare questo a mano in una finestra così breve sarebbe stato praticamente impossibile.

### Fase 3: Contenuti (13-14 feb) -- 14 commit

Ho ripulito i vecchi post del blog. Ho scritto una riflessione di fine anno. Ho tradotto tutti i post del blog in 10 lingue. Ho costruito una pagina vetrina dei Progetti. Ho completato l'i18n della homepage. Ho corretto bug dei componenti UI (allineamento pulsanti ShowcaseCard, ritaglio del dropdown).

Il problema che ho incontrato qui: l'AI non è brava a individuare layout rotti al primo tentativo. Ci sono voluti più giri in cui io indicavo esattamente cosa non andava nell'interfaccia prima che le cose venissero corrette propriamente. Per le questioni visive servono ancora occhi umani.

### Fase 4: Sidebar + Blog (15 feb) -- 7 commit

Ho riorganizzato l'intera struttura della sidebar dei docs. Ho tradotto le etichette delle categorie della sidebar per tutte le 10 lingue. Ho eliminato 206 chiavi di traduzione morte rimaste dalla ristrutturazione precedente. Ho scritto e tradotto il post del blog sulla negoziazione dopo il licenziamento in tutte le lingue.

### Fase 5: i18n dei Docs (16-17 feb) -- 14 commit

Il grande lotto: ho tradotto 89 documenti in 9 lingue non inglesi, producendo 801 file di traduzione. Copriva le sezioni Knowledge (JavaScript, TypeScript, CSS, Vue, React, Browser, Security, Engineering), Experience e Coding.

Questa fase e la successiva erano entrambe enormi consumatrici di Token -- semplicemente scaricare lavoro di traduzione altamente meccanico sull'AI e lasciarla fare (tanto non so leggere la maggior parte di quelle lingue comunque).

### Fase 6: Correzioni di qualità (17-18 feb) -- 24 commit

Questa fase esiste perché l'output della Fase 5 non era abbastanza pulito. Ventiquattro commit, tutti per correggere traduzioni generate dall'AI:

- **Tedesco**: Le Umlaut renderizzate come ASCII (`ue` invece di `ü`, `ae` invece di `ä`)
- **Francese**: Accenti rimossi (`e` invece di `é`, `a` invece di `à`)
- **Vietnamita**: Segni diacritici completamente mancanti (il vietnamita senza segni diacritici è a malapena leggibile)
- **Spagnolo/Portoghese**: Accenti omessi ovunque
- **Cinese Semplificato**: Caratteri tradizionali mescolati (l'AI a volte non riesce a distinguere i due sistemi di scrittura)
- **Residui CJK**: Commenti cinesi lasciati non tradotti nei blocchi di codice in es, pt-BR, ja, ko, vi

Ogni correzione generava altre correzioni. Correggere gli accenti portoghesi ha sovracorretto le cose e ha rotto i campi `id` e `slug` del frontmatter. Correggere i segni diacritici vietnamiti ha saltato un file. La correzione degli accenti spagnoli aveva falsi positivi che necessitavano di un altro commit di correzione.

Onestamente, a meno che tu non parli effettivamente una data lingua, non c'è modo che un umano possa intervenire in modo significativo qui. Sei completamente dipendente dalla validazione incrociata con modelli diversi.

**Cose in cui l'AI non è brava:**

```markdown
// Esempi:

- Ottenere i segni diacritici corretti al primo tentativo (accenti, umlaut, segni tonali)
- Distinguere in modo affidabile il Cinese Tradizionale dal Cinese Semplificato
- Decidere se i commenti nel codice debbano restare nella lingua originale o essere tradotti
- Preservare i campi del frontmatter durante la trasformazione dei contenuti
```

## Cosa è andato storto

**Il disastro degli accenti e dei segni diacritici.** L'AI ha sostituito i caratteri non-ASCII con approssimazioni ASCII in cinque lingue. Questo ha prodotto 24 commit di correzione -- quasi un quarto del totale. Il vietnamita è stato il caso peggiore: senza segni diacritici, l'intera lingua è praticamente irriconoscibile.

**Mescolanza Cinese Tradizionale/Semplificato.** Le traduzioni `zh-cn` avevano caratteri del Cinese Tradizionale che apparivano nei commenti del codice e nei riferimenti inline. L'AI semplicemente non riusciva a distinguere in modo affidabile i due sistemi di scrittura.

**Corruzione del frontmatter.** Quando traduceva i documenti, l'AI a volte modificava i campi `id` e `slug` nel frontmatter, rompendo il routing di Docusaurus. Un commit esiste unicamente per correggere i valori `id` e `slug` portoghesi che erano stati storpiati durante le correzioni degli accenti.

**Reazioni a catena di sovracorrezione.** Correggere un problema spesso ne creava un altro. La correzione degli accenti portoghesi ha sovracorretto alcuni termini tecnici. La correzione dei segni diacritici vietnamiti ha saltato un file. Ogni singolo commit di "correzione" aveva una probabilità non nulla di introdurre un nuovo problema.

## Dove gli umani contano ancora

**Decisioni architetturali.** Quali 10 lingue supportare. Come organizzare la sidebar. Cosa va in un dropdown della navbar rispetto al livello superiore. Queste decisioni hanno plasmato tutto il lavoro a valle.

**Giudizio di qualità.** L'interfaccia è rotta? Il layout corrisponde alle specifiche del design? Ci sono errori di traduzione evidenti -- come verificare se il cambio di lingua predefinito mappa correttamente? Per questo servono gli occhi.

**Il file `CLAUDE.md`.** Questa è essenzialmente una costituzione del repository che insegna all'AI le convenzioni del tuo progetto: formato dei commit, struttura dei file, regole i18n, cose che non devono mai accadere. Più questo file diventa completo, meno errori fa l'AI e meno intervento umano è necessario. Richiede iterazione e aggiornamenti frequenti.

## Conclusioni

**Inizia con un solido `CLAUDE.md`.** Ogni convenzione che ci metti ti risparmia decine di cicli di correzione in futuro. Il mio è cresciuto da poche righe a un documento completo che copre formato dei commit, regole i18n, struttura del progetto e divieti espliciti.

**Raggruppa lavori simili, revisiona in blocco.** Non tradurre un file alla volta. Butta 15 file simili all'AI in una volta, poi revisiona l'output come un blocco. Ti risparmia dal dover approvare ogni piccolo dettaglio individualmente.

**Parallelizza i tuoi strumenti quando possibile.** Usare Claude Code per il lavoro interattivo mentre si delegano i lavori in blocco a Gemini, Codex, ecc. -- è stato il singolo più grande guadagno di efficienza. Non serializzare ciò che può essere parallelizzato.

**Documenta tutto.** Ogni messaggio di commit, ogni confine di fase, ogni correzione -- è tutto nella cronologia. Se stai facendo un grande progetto assistito dall'AI, la tua cronologia dei commit è la tua documentazione.
