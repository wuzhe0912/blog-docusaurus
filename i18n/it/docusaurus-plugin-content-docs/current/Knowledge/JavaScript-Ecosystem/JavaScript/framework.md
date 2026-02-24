---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Spiega e confronta vantaggi e svantaggi di SPA e SSR

> Spiega e confronta vantaggi e svantaggi di SPA e SSR.

### SPA (Single-Page Application)

#### Vantaggi SPA

1. Esperienza utente: una SPA è effettivamente una singola pagina. Con il caricamento dinamico dei dati e il routing lato client, gli utenti percepiscono il cambio di pagina, ma l'app in realtà cambia componenti, risultando più fluida e veloce.
2. Separazione frontend-backend: il frontend si concentra sul rendering e l'interazione, mentre il backend fornisce API per i dati. Questo riduce l'accoppiamento e migliora la manutenibilità.
3. Ottimizzazione di rete: poiché la pagina viene caricata una sola volta, si evitano i ricaricamenti completi della pagina ad ogni navigazione (come nelle app multi-pagina tradizionali), riducendo il numero di richieste e il carico sul server.

#### Svantaggi SPA

1. Sfide SEO: il contenuto di una SPA è spesso renderizzato dinamicamente, quindi i motori di ricerca potrebbero non indicizzarlo in modo affidabile come l'HTML tradizionale (anche se Google ha migliorato questo aspetto).
2. Tempo di caricamento iniziale: le SPA devono scaricare ed eseguire JavaScript sul client prima del rendering, quindi il primo caricamento può essere più lento, specialmente su reti deboli.

### SSR (Server-Side Rendering)

#### Vantaggi SSR

1. SEO: l'SSR renderizza HTML con i dati sul server, quindi i motori di ricerca possono scansionare direttamente il contenuto della pagina. Questo è il più grande vantaggio dell'SSR.
2. Velocità di rendering iniziale: il lavoro di rendering viene spostato sul server, il che generalmente migliora il first paint/primo invio del contenuto.

#### Svantaggi SSR

1. Curva di apprendimento e complessità: framework come Next e Nuxt sono basati su React/Vue ma hanno i propri ecosistemi e convenzioni, il che aumenta i costi di apprendimento e migrazione.
2. Maggiore carico sul server: poiché il rendering viene effettuato sul server, i picchi di traffico possono aumentare la pressione sull'infrastruttura.

### Conclusione

In generale, se stai costruendo un sistema di amministrazione interno senza requisiti SEO, l'SSR di solito non è necessario.
Per i siti web di prodotto orientati alla ricerca, vale la pena valutare l'adozione dell'SSR.

## 2. Descrivi i framework web che hai usato e confronta i loro pro e contro

**Negli ultimi anni, entrambi hanno convergito verso lo sviluppo di componenti orientato alle funzioni:**

> Vue 3 usa la Composition API per dividere la logica in composable riutilizzabili, mentre React è incentrato sugli Hooks. L'esperienza di sviluppo è abbastanza simile, ma nel complesso Vue è più facile per iniziare, e React è più forte in dimensione dell'ecosistema e flessibilità.

### Vue (principalmente Vue 3)

**Vantaggi:**

- **Curva di apprendimento più dolce**:
  SFC (Single File Component) mantiene template/script/style insieme, il che è amichevole per gli sviluppatori provenienti da flussi di lavoro con template tradizionali.
- **Convenzioni ufficiali chiare, buone per i team**:
  Vue fornisce guide di stile e convenzioni chiare (struttura, nomenclatura, decomposizione dei componenti), rendendo più facile la coerenza del team.
- **Ecosistema core completo**:
  Strumenti mantenuti ufficialmente come Vue Router e Pinia (o Vuex), più tooling di build, riducono il sovraccarico decisionale.
- **La Composition API migliora la manutenibilità**:
  La logica può essere estratta in composable (ad esempio `useAuth`, `useForm`) per condividere comportamenti e ridurre la duplicazione in progetti di grandi dimensioni.

**Svantaggi:**

- **Ecosistema/community più piccolo rispetto a React**:
  Il volume e la varietà dei pacchetti di terze parti sono inferiori. Alcuni strumenti all'avanguardia o integrazioni (design system, librerie di nicchia) sono React-first.
- **Concentrazione del mercato del lavoro per regione/settore**:
  Rispetto a React, molti team globali o transnazionali preferiscono React, il che può ridurre la flessibilità della carriera in alcuni mercati.

---

### React

**Vantaggi:**

- **Grande ecosistema e innovazione rapida**:
  La maggior parte delle tecnologie frontend, dei design system e dei servizi di terze parti forniscono prima il supporto per React (librerie UI, grafici, editor, design system, ecc.).
- **Alta flessibilità nella composizione dello stack**:
  Funziona con Redux/Zustand/Recoil e meta-framework come Next.js/Remix. Esistono scelte mature per SPA, SSR, SSG e CSR.
- **Integrazione matura con TypeScript e tooling**:
  La community ha ampie best practice per la tipizzazione e l'ingegneria su larga scala, utili per la manutenzione a lungo termine.

**Svantaggi:**

- **Troppa libertà richiede convenzioni di team**:
  Senza standard chiari di codifica e architettura, i team possono produrre pattern inconsistenti, aumentando il costo di manutenzione.
- **La curva di apprendimento non è bassa in pratica**:
  Oltre a React stesso (JSX e Hooks), gli sviluppatori devono scegliere routing, gestione dello stato, data fetching e approcci SSR.
- **Evoluzione rapida delle API e delle best practice**:
  Dai componenti a classe ai componenti funzione + hooks ai server component, la coesistenza di pattern vecchi/nuovi aumenta il sovraccarico di migrazione.
