---
id: operators
title: '[Easy] 📄 Operatori JavaScript'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. Qual è la differenza tra `==` e `===`?

> Qual è la differenza tra `==` e `===`?

Entrambi sono operatori di confronto.
`==` confronta i valori con conversione di tipo (type coercion), mentre `===` confronta sia valore che tipo (uguaglianza stretta).

A causa delle regole di coercion di JavaScript, `==` può produrre risultati sorprendenti:

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

Questo aumenta il carico cognitivo, quindi nella maggior parte dei casi `===` è raccomandato per evitare bug imprevisti.

**Best practice**: usa sempre `===` e `!==`, a meno che tu non sappia chiaramente perché `==` è necessario.

### Domande di colloquio (Interview Questions)

#### Domanda 1: confronto di valori primitivi

Prevedi il risultato:

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**Risposta:**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**Spiegazione:**

- **`==` (uguaglianza debole)** esegue la conversione di tipo
  - `'1'` viene convertito a `1`
  - poi confronta `1 == 1` -> `true`
- **`===` (uguaglianza stretta)** non esegue conversione
  - `number` e `string` sono tipi diversi -> `false`

**Regole di coercion (casi comuni):**

```javascript
// Esempi di priorità di coercion con ==
// 1. se un lato è number, converti l'altro lato in number
'1' == 1; // true
'2' == 2; // true
'0' == 0; // true

// 2. se un lato è boolean, converti boolean in number
true == 1; // true
false == 0; // true
'1' == true; // true

// 3. insidie della conversione stringa-a-numero
'' == 0; // true
' ' == 0; // true (stringa di spazi viene convertita a 0)
```

#### Domanda 2: `null` vs `undefined`

Prevedi il risultato:

```javascript
undefined == null; // ?
undefined === null; // ?
```

**Risposta:**

```javascript
undefined == null; // true
undefined === null; // false
```

**Spiegazione:**

Questa è una **regola speciale di JavaScript**:

- **`undefined == null`** è `true`
  - la specifica definisce esplicitamente l'uguaglianza debole tra di essi
  - questo è un caso d'uso valido per `==`: controllare sia `null` che `undefined`
- **`undefined === null`** è `false`
  - tipi diversi, quindi l'uguaglianza stretta fallisce

**Uso pratico:**

```javascript
// controlla se il valore è null o undefined
function isNullOrUndefined(value) {
  return value == null;
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// forma verbose equivalente
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**Insidie:**

```javascript
// null e undefined sono debolmente uguali solo tra di loro
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// con ===, ciascuno è uguale solo a se stesso
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### Domanda 3: confronti misti

Prevedi il risultato:

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**Risposta:**

```javascript
0 == false; // true (false -> 0)
0 === false; // false (number vs boolean)
'' == false; // true ('' -> 0, false -> 0)
'' === false; // false (string vs boolean)
null == false; // false (null è debolmente uguale solo a null/undefined)
undefined == false; // false (undefined è debolmente uguale solo a null/undefined)
```

**Flusso di conversione:**

```javascript
// 0 == false
0 == false;
0 == 0;
true;

// '' == false
'' == false;
'' == 0;
0 == 0;
true;

// null == false
null == false;
// null non viene convertito in questo percorso di confronto
false;
```

#### Domanda 4: confronto di oggetti

Prevedi il risultato:

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**Risposta:**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**Spiegazione:**

- Gli oggetti (inclusi gli array) vengono confrontati per **riferimento**, non per contenuto.
- Due istanze di oggetto diverse non sono mai uguali, anche con lo stesso contenuto.
- Per gli oggetti, sia `==` che `===` confrontano i riferimenti.

```javascript
// stesso riferimento -> uguali
const arr1 = [];
const arr2 = arr1;
arr1 == arr2; // true
arr1 === arr2; // true

// stesso contenuto ma istanze diverse -> non uguali
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false
arr3 === arr4; // false

// stesso vale per gli oggetti
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### Promemoria rapido per i colloqui

**Regole di coercion di `==` (ordine pratico):**

1. `null == undefined` -> `true` (regola speciale)
2. `number == string` -> converti stringa in number
3. `number == boolean` -> converti boolean in number
4. `string == boolean` -> entrambi convertiti in number
5. Gli oggetti confrontano per riferimento

**Regole di `===` (semplice):**

1. Tipo diverso -> `false`
2. Stesso tipo -> confronta valore (primitivi) o riferimento (oggetti)

**Best practice:**

```javascript
// ✅ usa === come default
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ un'eccezione comune: controllo null/undefined
if (value == null) {
  // value è null o undefined
}

// ❌ evita == in generale
if (value == 0) {
}
if (name == 'Alice') {
}
```

**Risposta esempio per un colloquio:**

> `==` esegue la conversione di tipo e può produrre risultati sorprendenti, ad esempio `0 == '0'` è `true`.
> `===` è uguaglianza stretta, quindi un tipo diverso restituisce `false` direttamente.
>
> La best practice è usare `===` ovunque, tranne per `value == null` quando si vuole intenzionalmente controllare sia `null` che `undefined`.
>
> Nota inoltre: `null == undefined` è `true`, ma `null === undefined` è `false`.

---

## 2. Qual è la differenza tra `&&` e `||`? Spiega la valutazione short-circuit

> Qual è la differenza tra `&&` e `||`? Spiega la valutazione short-circuit.

### Idea fondamentale

- **`&&` (AND)**: se il lato sinistro è `falsy`, restituisce immediatamente il lato sinistro (il lato destro non viene valutato)
- **`||` (OR)**: se il lato sinistro è `truthy`, restituisce immediatamente il lato sinistro (il lato destro non viene valutato)

### Esempi di short-circuit

```js
// short-circuit con &&
const user = null;
const name = user && user.name; // user è falsy, restituisce null, nessun accesso a user.name
console.log(name); // null (nessun errore)

// short-circuit con ||
const defaultName = 'Guest';
const userName = user || defaultName;
console.log(userName); // 'Guest'

// uso pratico
function greet(name) {
  const displayName = name || 'Anonymous';
  console.log(`Ciao, ${displayName}!`);
}

greet('Alice'); // Ciao, Alice!
greet(); // Ciao, Anonymous!
```

### Insidia comune ⚠️

```js
// problema: 0 e '' sono anche falsy
const count = 0;
const result = count || 10; // restituisce 10
console.log(result); // 10 (probabilmente non intenzionale)

// soluzione: usa ??
const betterResult = count ?? 10; // fallback solo per null/undefined
console.log(betterResult); // 0
```

---

## 3. Cos'è l'operatore `?.` (Optional Chaining)?

> Cos'è l'optional chaining `?.`?

### Scenario problematico

L'accesso tradizionale può lanciare errori:

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ rischioso: lancia errore se address manca
console.log(user.address.city); // ok
console.log(otherUser.address.city); // TypeError

// ✅ sicuro ma verboso
const city = user && user.address && user.address.city;
```

### Uso dell'optional chaining

```js
// ✅ conciso e sicuro
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined (nessun errore)

// per chiamate di metodo
user?.getName?.();

// per gli array
const firstItem = users?.[0]?.name;
```

### Uso pratico

```js
// Gestione delle risposte API
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Utente sconosciuto';
  const email = response?.data?.user?.email ?? 'Nessuna email';

  console.log(`Utente: ${userName}`);
  console.log(`Email: ${email}`);
}

// Accesso al DOM
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. Cos'è l'operatore `??` (Nullish Coalescing)?

> Cos'è il nullish coalescing `??`?

### Differenza da `||`

```js
// || tratta tutti i valori falsy come trigger per il fallback
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? tratta solo null e undefined come nullish
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### Uso pratico

```js
// preserva i valori 0 validi
function updateScore(newScore) {
  const score = newScore ?? 100;
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// valori predefiniti per la configurazione
const config = {
  timeout: 0, // configurazione valida
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0
const retries = config.maxRetries ?? 3; // 3
```

### Uso combinato

```js
// ?? e ?. sono spesso usati insieme
const userAge = user?.profile?.age ?? 18;

// valori predefiniti per i form
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0,
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. Qual è la differenza tra `i++` e `++i`?

> Qual è la differenza tra `i++` e `++i`?

### Differenza fondamentale

- **`i++` (postfisso)**: restituisce prima il valore corrente, poi incrementa
- **`++i` (prefisso)**: incrementa prima, poi restituisce il nuovo valore

### Esempio

```js
let a = 5;
let b = a++; // b = 5, a = 6
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6
console.log(c, d); // 6, 6
```

### Impatto pratico

```js
// solitamente nessuna differenza nei cicli se il valore restituito non viene usato
for (let i = 0; i < 5; i++) {}
for (let i = 0; i < 5; ++i) {}

// ma c'è differenza nelle espressioni
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1
console.log(arr[++i]); // 3
```

### Best practice

```js
// ✅ più chiaro: dividi in passaggi
let count = 0;
const value = arr[count];
count++;

// ⚠️ meno leggibile se usato eccessivamente
const value2 = arr[count++];
```

---

## 6. Cos'è l'operatore ternario? Quando dovresti usarlo?

> Cos'è l'operatore ternario? Quando dovresti usarlo?

### Sintassi

```js
condizione ? valoreSeVero : valoreSeFalso;
```

### Esempio semplice

```js
// if-else
let message;
if (age >= 18) {
  message = 'Adulto';
} else {
  message = 'Minorenne';
}

// ✅ ternario
const message2 = age >= 18 ? 'Adulto' : 'Minorenne';
```

### Buoni casi d'uso

```js
// 1. assegnazione condizionale semplice
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. rendering condizionale in JSX/template
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. valori predefiniti con altri operatori
const displayName = user?.name ?? 'Ospite';
const greeting = isVIP ? `Benvenuto, ${displayName}!` : `Ciao, ${displayName}`;

// 4. valore di ritorno di una funzione
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### Casi da evitare

```js
// ❌ ternari profondamente annidati compromettono la leggibilità
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ più chiaro con if-else/switch
let result2;
if (condition1) result2 = value1;
else if (condition2) result2 = value2;
else if (condition3) result2 = value3;
else result2 = value4;

// ❌ logica di business complessa nel ternario
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ dividi in passaggi leggibili
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess2 = isAdmin || hasReadPermission;
```

---

## Tabella riassuntiva rapida (Quick Cheat Sheet)

| Operatore           | Scopo                  | Suggerimento |
| ------------------- | ---------------------- | ------------ |
| `===`               | Uguaglianza stretta    | Usalo come default, evita `==` |
| `&&`                | AND short-circuit      | Si ferma su falsy a sinistra |
| `\|\|`            | OR short-circuit       | Si ferma su truthy a sinistra |
| `?.`                | Optional chaining      | Accesso sicuro senza lanciare errori |
| `??`                | Nullish coalescing     | Fallback solo per null/undefined |
| `++i` / `i++`       | Incremento             | Prefisso prima, postfisso dopo |
| `? :`               | Operatore ternario     | Buono solo per condizioni semplici |

## Riferimenti

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
