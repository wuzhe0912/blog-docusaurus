---
title: '[Lv2] Fondamenti di lifecycle e hydration in Nuxt 3'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Comprendere i confini del lifecycle e il comportamento della hydration è fondamentale per evitare mismatch tra SSR e client.

---

## 1. Focus da colloquio

1. Differenze di lifecycle tra server-side e client-side
2. `useState` vs `ref` in SSR
3. Cause tipiche di hydration mismatch e relative soluzioni

## 2. Confini del lifecycle in Nuxt 3

In modalità SSR:

- `setup()` gira sia su server che su client
- `onMounted()` gira solo sul client
- Le API browser devono essere protette per l'esecuzione client

```ts
<script setup lang="ts">
if (process.server) {
  console.log('Server render phase');
}

onMounted(() => {
  // Client only
  console.log(window.location.href);
});
</script>
```

## 3. Perché avviene un hydration mismatch

Cause comuni:

- Rendering di valori casuali (`Math.random()`) durante SSR
- Rendering di valori dipendenti dal tempo (`new Date()`) senza sincronizzazione
- Accesso ad API solo browser durante il render server
- Branch condizionali diversi tra server e client

## 4. `useState` vs `ref` in SSR

- `ref` è stato reattivo locale all'istanza del componente
- `useState` serializza e idrata lo stato attraverso il confine SSR

```ts
const counter = useState<number>('counter', () => 0);
```

Per stato condiviso consapevole di SSR, preferisci `useState`.

## 5. Prevenzione pratica dei mismatch

- Racchiudi UI solo browser con `ClientOnly` quando necessario
- Sposta le API browser in `onMounted`
- Garantisci valori iniziali deterministici nel render
- Mantieni espliciti i branch SSR/client (`process.server`, `process.client`)

## 6. Flusso di debug

- Riproduci il mismatch con refresh completo della pagina
- Confronta HTML server e DOM idratato
- Disabilita gradualmente i frammenti dinamici sospetti
- Conferma la stabilità del render finale con rete lenta e cold load

## Sintesi pronta per il colloquio

> Tratto SSR e client come due fasi di esecuzione distinte. Mantengo deterministico l'output iniziale, uso `useState` per lo stato condiviso SSR e isolo la logica solo browser nei client hook. Questo evita hydration mismatch e mantiene il rendering prevedibile.
