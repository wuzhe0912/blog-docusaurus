---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> O que é cache HTTP? Por que é importante?

O cache HTTP é uma técnica que armazena temporariamente as respostas HTTP no cliente (navegador) ou em servidores intermediários, com o objetivo de utilizar diretamente os dados em cache em requisições subsequentes, sem precisar solicitar novamente ao servidor.

### Cache vs armazenamento temporário: qual é a diferença?

Na documentação técnica, esses dois termos são frequentemente usados de forma intercambiável, mas na realidade têm significados diferentes:

#### Cache

**Definição**: Cópias de dados armazenadas para **otimização de desempenho**, com ênfase na "reutilização" e "acesso mais rápido".

**Características**:

- ✅ O objetivo é melhorar o desempenho
- ✅ Os dados podem ser reutilizados
- ✅ Possui políticas de expiração claras
- ✅ Geralmente são cópias dos dados originais

**Exemplo**:

```javascript
// HTTP Cache - Cache de respostas de API
Cache-Control: max-age=3600  // Cache por 1 hora

// Memory Cache - Cache de resultados de cálculos
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // Reutilizar cache
  const result = /* cálculo */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage (Armazenamento temporário)

**Definição**: Dados armazenados **temporariamente**, com ênfase na "temporalidade" e "serão removidos".

**Características**:

- ✅ O objetivo é o armazenamento temporário
- ✅ Não necessariamente será reutilizado
- ✅ O ciclo de vida geralmente é curto
- ✅ Pode conter estados intermediários

**Exemplo**:

```javascript
// sessionStorage - Armazenamento temporário de entradas do usuário
sessionStorage.setItem('formData', JSON.stringify(form)); // Removido ao fechar a aba

// Armazenamento temporário de upload de arquivos
const tempFile = await uploadToTemp(file); // Remover após processamento
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Tabela comparativa

| Característica | Cache                    | Temporary Storage (Armazenamento temporário) |
| -------------- | ------------------------ | --------------------------------------------- |
| **Propósito principal** | Otimização de desempenho | Armazenamento temporário                |
| **Reutilização** | Sim, leituras múltiplas | Não necessariamente                           |
| **Ciclo de vida** | Baseado em políticas   | Geralmente curto                              |
| **Uso típico** | HTTP Cache, Memory Cache | sessionStorage, arquivos temporários          |
| **Equivalente em inglês** | Cache              | Temp / Temporary / Buffer                     |

#### Diferenças na aplicação prática

```javascript
// ===== Cenários de uso do Cache =====

// 1. HTTP Cache: Reutilizar respostas de API
fetch('/api/users') // Primeira requisição
  .then((response) => response.json());

fetch('/api/users') // Segunda leitura do cache
  .then((response) => response.json());

// 2. Cache de resultados de cálculos
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // Reutilizar
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Cenários de uso do Armazenamento temporário =====

// 1. Armazenamento temporário de dados de formulário (prevenir fechamento acidental)
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. Armazenamento temporário de arquivos enviados
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // Armazenamento temporário
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // Remover após uso
  return processed;
}

// 3. Armazenamento temporário de resultados intermediários
const tempResults = []; // Armazenar resultados intermediários
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // Não mais necessário após o uso
```

#### Aplicação no desenvolvimento web

```javascript
// HTTP Cache - Armazenamento de longo prazo, reutilização
Cache-Control: public, max-age=31536000, immutable
// → O navegador fará cache deste arquivo por um ano e o reutilizará

// sessionStorage (Armazenamento temporário) - Armazenamento temporário, removido ao fechar
sessionStorage.setItem('tempData', data);
// → Válido apenas na aba atual, removido ao fechar

// localStorage (Armazenamento de longo prazo) - Entre ambos
localStorage.setItem('userPreferences', prefs);
// → Armazenamento persistente, mas não para otimização de desempenho
```

### Por que é importante distinguir esses dois conceitos?

1. **Decisões de design**:

   - Precisa de otimização de desempenho? → Usar cache
   - Precisa de armazenamento temporário? → Usar armazenamento temporário

2. **Gestão de recursos**:

   - Cache: Foco na taxa de acerto e políticas de expiração
   - Armazenamento temporário: Foco no momento da limpeza e limites de capacidade

3. **Respostas em entrevistas**:

   - "Como otimizar o desempenho" → Falar sobre estratégias de cache
   - "Como lidar com dados temporários" → Falar sobre soluções de armazenamento temporário

Neste artigo, discutimos principalmente **Cache**, especialmente o mecanismo de cache HTTP.

### Benefícios do cache

1. **Redução de requisições de rede**: Ler diretamente do cache local, sem enviar requisições HTTP
2. **Redução da carga do servidor**: Menos requisições para o servidor processar
3. **Velocidade de carregamento da página mais rápida**: A leitura do cache local é muito mais rápida que requisições de rede
4. **Economia de largura de banda**: Redução do volume de transferência de dados
5. **Melhoria da experiência do usuário**: Respostas de página mais rápidas, uso mais fluido

### Tipos de cache

```text
┌─────────────────────────────────────┐
│    Hierarquia de cache do           │
│          navegador                  │
├─────────────────────────────────────┤
│  1. Memory Cache (Cache de memória) │
│     - Mais rápido, capacidade       │
│       pequena                       │
│     - Removido ao fechar a aba      │
├─────────────────────────────────────┤
│  2. Disk Cache (Cache de disco)     │
│     - Mais lento, maior capacidade  │
│     - Armazenamento persistente     │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Controle total do             │
│       desenvolvedor                 │
│     - Suporte para aplicações       │
│       offline                       │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> Quais são as estratégias de cache HTTP?

### Classificação das estratégias de cache

```text
Estratégias de cache HTTP
├── Cache forte (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── Cache de negociação (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Cache forte (Strong Cache / Fresh)

**Característica**: O navegador lê diretamente do cache local sem enviar requisições ao servidor.

#### Cache-Control (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Diretivas comuns**:

```javascript
// 1. max-age: Tempo de validade do cache (segundos)
Cache-Control: max-age=3600  // Cache por 1 hora

// 2. no-cache: Validação com o servidor necessária (usar cache de negociação)
Cache-Control: no-cache

// 3. no-store: Não fazer cache de forma alguma
Cache-Control: no-store

// 4. public: Pode ser armazenado em qualquer cache (navegador, CDN)
Cache-Control: public, max-age=31536000

// 5. private: Apenas o navegador pode fazer cache
Cache-Control: private, max-age=3600

// 6. immutable: O recurso nunca muda (com nome de arquivo hash)
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate: Após expirar, validação com o servidor é obrigatória
Cache-Control: max-age=3600, must-revalidate
```

#### Expires (HTTP/1.0, obsoleto)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Problemas**:

- Usa tempo absoluto, depende do horário do cliente
- Horário inexato do cliente causa falhas no cache
- Foi substituído pelo `Cache-Control`

### 2. Cache de negociação (Negotiation Cache / Validation)

**Característica**: O navegador envia uma requisição ao servidor para verificar se o recurso foi atualizado.

#### Last-Modified / If-Modified-Since

```http
# Resposta do servidor (primeira requisição)
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# Requisição do navegador (requisições subsequentes)
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Fluxo**:

1. Primeira requisição: O servidor retorna `Last-Modified`
2. Requisições subsequentes: O navegador inclui `If-Modified-Since`
3. Recurso não modificado: O servidor retorna `304 Not Modified`
4. Recurso modificado: O servidor retorna `200 OK` e o novo recurso

#### ETag / If-None-Match

```http
# Resposta do servidor (primeira requisição)
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# Requisição do navegador (requisições subsequentes)
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Vantagens**:

- Mais preciso que `Last-Modified`
- Não depende do tempo, usa hash do conteúdo
- Pode detectar mudanças abaixo do nível de segundo

### Last-Modified vs ETag

| Característica | Last-Modified            | ETag                             |
| -------------- | ------------------------ | -------------------------------- |
| Precisão       | Nível de segundo         | Hash do conteúdo, mais preciso   |
| Desempenho     | Mais rápido              | Cálculo de hash necessário, mais lento |
| Caso de uso    | Recursos estáticos gerais | Recursos que requerem controle preciso |
| Prioridade     | Baixa                    | Alta (ETag tem prioridade)       |

## 3. How does browser caching work?

> Como funciona o cache do navegador?

### Fluxo completo de cache

```text
┌──────────────────────────────────────────────┐
│    Fluxo de requisição de recursos do         │
│              navegador                        │
└──────────────────────────────────────────────┘
                    ↓
         1. Verificar Memory Cache
                    ↓
            ┌───────┴────────┐
            │ Cache           │
            │ encontrado?     │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. Verificar Disk Cache
                    ↓
            ┌───────┴────────┐
            │ Cache           │
            │ encontrado?     │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. Verificar Service Worker
                    ↓
            ┌───────┴────────┐
            │ Cache           │
            │ encontrado?     │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. Verificar se o cache expirou
                    ↓
            ┌───────┴────────┐
            │   Expirado?     │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. Validar com cache de negociação
                    ↓
            ┌───────┴────────┐
            │   Recurso       │
            │   modificado?   │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. Solicitar novo recurso ao servidor
                    ↓
            ┌───────┴────────┐
            │ Retornar novo   │
            │ recurso         │
            │ (200 OK)        │
            └────────────────┘
```

### Exemplo prático

```javascript
// Primeira requisição
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== Nova requisição dentro de 1 hora ==========
// Cache forte: Ler diretamente do local, sem enviar requisição
// Status: 200 OK (from disk cache)

// ========== Nova requisição após 1 hora ==========
// Cache de negociação: Enviar requisição de validação
GET /api/data.json
If-None-Match: "abc123"

// Recurso não modificado
Response:
  304 Not Modified
  (Sem body, usar cache local)

// Recurso modificado
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> Quais são as estratégias de cache mais comuns?

### 1. Estratégia de cache permanente (para recursos estáticos)

```javascript
// HTML: Não fazer cache, verificar a cada vez
Cache-Control: no-cache

// CSS/JS (com hash): Cache permanente
Cache-Control: public, max-age=31536000, immutable
// Nome do arquivo: main.abc123.js
```

**Princípio**:

- HTML não é cacheado, garantindo que o usuário obtenha a versão mais recente
- CSS/JS usam nomes de arquivo com hash, o nome muda quando o conteúdo muda
- Versões antigas não são usadas, novas versões são baixadas novamente

### 2. Estratégia para recursos com atualizações frequentes

```javascript
// Dados de API: Cache de curto prazo + cache de negociação
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Estratégia para recursos de imagem

```javascript
// Avatar do usuário: Cache de médio prazo
Cache-Control: public, max-age=86400  // 1 dia

// Logo, ícones: Cache de longo prazo
Cache-Control: public, max-age=2592000  // 30 dias

// Imagens dinâmicas: Cache de negociação
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Recomendações de cache por tipo de recurso

```javascript
const cachingStrategies = {
  // Arquivos HTML
  html: 'Cache-Control: no-cache',

  // Recursos estáticos com hash
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // Recursos estáticos raramente atualizados
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // Dados de API
  apiData: 'Cache-Control: private, max-age=60',

  // Dados específicos do usuário
  userData: 'Cache-Control: private, no-cache',

  // Dados sensíveis
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Cache com Service Worker

O Service Worker oferece o controle de cache mais flexível, permitindo que os desenvolvedores controlem completamente a lógica de cache.

### Uso básico

```javascript
// Registrar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - Arquivo do Service Worker
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// Evento de instalação: Cachear recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar requisições: Usar estratégia de cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Estratégia Cache First
      return response || fetch(event.request);
    })
  );
});

// Evento de ativação: Limpar cache antigo
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### Estratégias de cache comuns

#### 1. Cache First (Cache primeiro)

```javascript
// Adequado para: Recursos estáticos
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First (Rede primeiro)

```javascript
// Adequado para: Requisições de API
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Atualizar cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Rede falhou, usar cache
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate (Obsoleto enquanto revalida)

```javascript
// Adequado para: Recursos que precisam de respostas rápidas mas também precisam se manter atualizados
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Retornar cache, atualizar em segundo plano
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> Como implementar Cache Busting?

Cache Busting é uma técnica que garante que os usuários obtenham os recursos mais recentes.

### Método 1: Hash no nome do arquivo (recomendado)

```javascript
// Usar ferramentas de bundling como Webpack/Vite
// Saída: main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- Atualizar referência automaticamente -->
<script src="/js/main.abc123.js"></script>
```

**Vantagens**:

- ✅ O nome do arquivo muda, forçando o download do novo arquivo
- ✅ A versão antiga permanece em cache, sem desperdício
- ✅ Melhor prática

### Método 2: Número de versão com Query String

```html
<!-- Atualizar número de versão manualmente -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Desvantagens**:

- ❌ Alguns CDNs não fazem cache de recursos com query string
- ❌ Requer manutenção manual do número de versão

### Método 3: Timestamp

```javascript
// Usar no ambiente de desenvolvimento
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Uso**:

- Evitar cache no ambiente de desenvolvimento
- Inadequado para produção (cada vez é uma nova requisição)

## 7. Common caching interview questions

> Perguntas frequentes de entrevista sobre cache

### Pergunta 1: Como evitar que o HTML seja cacheado?

<details>
<summary>Clique para ver a resposta</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

Ou usar tags meta:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Pergunta 2: Por que usar ETag em vez de apenas Last-Modified?

<details>
<summary>Clique para ver a resposta</summary>

**Vantagens do ETag**:

1. **Mais preciso**: Pode detectar mudanças abaixo do nível de segundo
2. **Baseado em conteúdo**: Baseado no hash do conteúdo, não no tempo
3. **Evitar problemas de tempo**:
   - O conteúdo do arquivo não mudou mas o tempo mudou (como ao reimplantar)
   - Recursos que voltam ciclicamente ao mesmo conteúdo
4. **Sistemas distribuídos**: Os relógios de diferentes servidores podem não estar sincronizados

**Exemplo**:

```javascript
// O conteúdo do arquivo não mudou, mas Last-Modified mudou
// 2024-01-01 12:00 - Implantar versão A (conteúdo: abc)
// 2024-01-02 12:00 - Reimplantar versão A (conteúdo: abc)
// Last-Modified mudou, mas o conteúdo é o mesmo!

// ETag não tem esse problema
ETag: 'hash-of-abc'; // Sempre igual
```

</details>

### Pergunta 3: Qual é a diferença entre from disk cache e from memory cache?

<details>
<summary>Clique para ver a resposta</summary>

| Característica | Memory Cache            | Disk Cache              |
| -------------- | ----------------------- | ----------------------- |
| Localização    | Memória (RAM)           | Disco rígido            |
| Velocidade     | Extremamente rápido     | Mais lento              |
| Capacidade     | Pequena (nível MB)      | Grande (nível GB)       |
| Persistência   | Removido ao fechar a aba | Armazenamento persistente |
| Prioridade     | Alta (uso preferencial) | Baixa                   |

**Ordem de prioridade de carregamento**:

```text
1. Memory Cache (mais rápido)
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. Requisição de rede (mais lento)
```

**Condições de ativação**:

- **Memory Cache**: Recursos acessados recentemente (como recarregar a página)
- **Disk Cache**: Recursos acessados há mais tempo ou arquivos grandes

</details>

### Pergunta 4: Como forçar o navegador a recarregar recursos?

<details>
<summary>Clique para ver a resposta</summary>

**Fase de desenvolvimento**:

```javascript
// 1. Hard Reload (Ctrl/Cmd + Shift + R)
// 2. Limpar cache e recarregar

// 3. Adicionar timestamp no código
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Ambiente de produção**:

```javascript
// 1. Usar hash no nome do arquivo (melhor prática)
main.abc123.js  // Gerado automaticamente pelo Webpack/Vite

// 2. Atualizar número de versão
<script src="/js/main.js?v=2.0.0"></script>

// 3. Configurar Cache-Control
Cache-Control: no-cache  // Forçar validação
Cache-Control: no-store  // Não cachear de forma alguma
```

</details>

### Pergunta 5: Como implementar cache offline em PWA?

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// Cachear página offline durante a instalação
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/styles/offline.css',
        '/images/offline-icon.png',
      ]);
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Rede falhou, mostrar página offline
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**Estratégia completa de cache PWA**:

```javascript
// 1. Cachear recursos estáticos
caches.addAll(['/css/', '/js/', '/images/']);

// 2. Requisições de API: Network First
// 3. Imagens: Cache First
// 4. HTML: Network First, mostrar página offline se falhar
```

</details>

## 8. Best practices

> Melhores práticas

### ✅ Práticas recomendadas

```javascript
// 1. HTML - Não cachear, garantir que o usuário obtenha a versão mais recente
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS (com hash) - Cache permanente
// Nome do arquivo: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Imagens - Cache de longo prazo
Cache-Control: public, max-age=2592000  // 30 dias

// 4. Dados de API - Cache de curto prazo + cache de negociação
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Usar Service Worker para implementar suporte offline
```

### ❌ Práticas a evitar

```javascript
// ❌ Ruim: Configurar cache de longo prazo para HTML
Cache-Control: max-age=31536000  // O usuário pode ver uma versão antiga

// ❌ Ruim: Usar Expires em vez de Cache-Control
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0, obsoleto

// ❌ Ruim: Não configurar cache algum
// Sem cabeçalhos de cache, o comportamento do navegador é indeterminado

// ❌ Ruim: Usar a mesma estratégia para todos os recursos
Cache-Control: max-age=3600  // Deve ser ajustado de acordo com o tipo de recurso
```

### Árvore de decisão de estratégia de cache

```text
É um recurso estático?
├─ Sim → O nome do arquivo tem hash?
│       ├─ Sim → Cache permanente (max-age=31536000, immutable)
│       └─ Não → Cache de médio-longo prazo (max-age=2592000)
└─ Não → É HTML?
        ├─ Sim → Não cachear (no-cache)
        └─ Não → É uma API?
               ├─ Sim → Cache de curto prazo + negociação (max-age=60, ETag)
               └─ Não → Decidir de acordo com a frequência de atualização
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
