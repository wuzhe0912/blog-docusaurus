---
id: performance-lv3-large-data-optimization
title: "[Lv3] Strategia di Ottimizzazione per Grandi Volumi di Dati: Scegliere e Implementare l'Approccio Giusto"
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> Quando un'interfaccia deve gestire migliaia o milioni di record, il successo dipende dalla scelta della giusta combinazione di strategie a livello di prodotto, backend e frontend.

## Scenario di Colloquio

**D: Come ottimizzi una pagina che visualizza dataset molto grandi?**

Una risposta efficace dovrebbe includere:

1. Validazione dei requisiti
2. Analisi dei compromessi
3. Architettura end-to-end
4. Implementazione e risultati misurabili

---

## 1. Prima la validazione dei requisiti

Prima di selezionare una tecnica, chiedi:

- Gli utenti hanno davvero bisogno di tutte le righe contemporaneamente?
- È richiesto l'aggiornamento in tempo reale?
- Il comportamento dominante è la navigazione, la ricerca o l'esportazione?
- Le altezze delle righe sono fisse o dinamiche?
- È necessaria la selezione multipla/stampa/esportazione su tutti i record?

Questo determina se la paginazione, il caricamento infinito, la virtualizzazione o il server push è la scelta più adatta.

## 2. Matrice delle strategie

| Strategia | Ideale per | Punti di forza | Compromessi |
| --- | --- | --- | --- |
| Paginazione lato server | Dati amministrativi con molte ricerche | Bassa memoria, prevedibile | Overhead di navigazione aggiuntivo |
| Scroll infinito | Navigazione in stile feed | Esplorazione fluida | Azioni di footer/salto più difficili |
| Virtual scrolling | Liste visibili molto grandi | Nodi DOM minimi | Complessità con altezze righe dinamiche |
| Filtraggio/ordinamento lato server | Grandi dati e correttezza rigorosa | Meno CPU lato client | Il carico del backend aumenta |
| Cache + fetch incrementale | Flussi con visite frequenti | Utilizzo ripetuto più veloce | Complessità dell'invalidazione della cache |

## 3. Pattern architetturale raccomandato

### Pipeline dei dati

1. I parametri di query definiscono ordinamento/filtro/pagina
2. Il backend restituisce campi minimi e conteggio totale
3. Il frontend normalizza e memorizza in cache per chiave di query
4. La UI renderizza solo le righe visibili

### Rendering

- Preferire la virtualizzazione quando il numero di righe è elevato
- Memoizzare i componenti delle righe
- Mantenere piccole le dipendenze reattive per riga

### Interazione

- Debounce dell'input di ricerca
- Annullare le richieste obsolete
- Preservare la posizione di scroll durante il refresh

## 4. Esempio di implementazione (lista virtualizzata + query al server)

```ts
const query = reactive({ keyword: '', page: 1, pageSize: 50, sort: 'createdAt:desc' });

const { data, isLoading } = useQuery({
  queryKey: ['records', query],
  queryFn: () => fetchRecords(query),
});
```

```tsx
<VirtualList
  data={data.items}
  itemHeight={48}
  overscan={8}
  renderItem={(row) => <RecordRow row={row} />}
/>
```

## 5. Guardrail per le prestazioni

- Mantenere il conteggio dei nodi DOM stabile durante lo scroll intenso
- Utilizzare la cancellazione delle richieste con `AbortController`
- Raggruppare gli aggiornamenti per ridurre i picchi di rendering
- Preferire il calcolo in background per trasformazioni costose

## 6. Metriche da monitorare

- Tempo di rendering iniziale
- Time-to-interactive
- Stabilità degli FPS durante lo scroll
- Andamento dell'utilizzo della memoria
- Latenza delle API e conteggio delle richieste

## Riepilogo per il colloquio

> Parto dal comportamento dell'utente, poi scelgo dalla matrice delle strategie piuttosto che una singola soluzione fissa. Per le viste con grandi volumi di dati, tipicamente combino l'ottimizzazione delle query lato server con la virtualizzazione, la cancellazione delle richieste e guardrail di prestazioni misurabili.
