---
title: '[Lv1] Implementação básica de SEO: Modos de Router e Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> Em um projeto de plataforma multi-marca, implementação da configuração básica de SEO: Router History Mode, estrutura de Meta Tags e SEO de páginas estáticas.

---

## 1. Pontos-chave de resposta em entrevista

1. **Seleção do modo de Router**: Usar History Mode em vez de Hash Mode para fornecer uma estrutura de URL limpa.
2. **Fundamentos de Meta Tags**: Implementar meta tags SEO completas, incluindo Open Graph e Twitter Card.
3. **SEO de páginas estáticas**: Configurar elementos SEO completos para a Landing Page.

---

## 2. Configuracao do Router History Mode

### 2.1 Por que escolher o History Mode?

**Localizacao do arquivo:** `quasar.config.js`

```javascript
// Linha 82
vueRouterMode: "history", // Usar modo history em vez de modo hash
```

**Vantagens de SEO:**

| Modo             | Exemplo de URL | Impacto no SEO                          |
| ---------------- | -------------- | --------------------------------------- |
| **Hash Mode**    | `/#/home`      | ❌ Dificil de indexar pelos buscadores   |
| **History Mode** | `/home`        | ✅ URL limpa, fácil de indexar           |

**Diferencas principais:**

- History Mode gera URLs limpas (ex: `/home` em vez de `/#/home`)
- Motores de busca podem indexar e rastrear mais facilmente
- Melhor experiência do usuário e de compartilhamento
- Requer configuração de backend (para evitar erros 404)

### 2.2 Requisitos de configuração do backend

Ao usar o History Mode, é necessária configuração do backend:

```nginx
# Exemplo Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Isso garante que todas as rotas retornem `index.html`, e o Router do frontend cuide do roteamento.

---

## 3. Estrutura básica de Meta Tags

### 3.1 Meta Tags SEO básicas

**Localizacao do arquivo:** `template/*/public/landingPage/index.html`

```html
<!-- Meta Tags básicas -->
<meta charset="UTF-8" />
<title>AMUSE VIP</title>
<meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
<meta
  name="description"
  content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
/>
```

**Explicacao:**

- `title`: Titulo da página, afeta a exibição nos resultados de busca
- `keywords`: Palavras-chave (menor importancia no SEO moderno, mas configuração recomendada)
- `description`: Descrição da página, exibida nos resultados de busca

### 3.2 Open Graph Tags (compartilhamento em redes sociais)

```html
<!-- Open Graph Tags -->
<meta property="og:site_name" content="AMUSE VIP" />
<meta property="og:title" content="AMUSE VIP" />
<meta property="og:type" content="website" />
<meta property="og:url" content="#" />
<meta property="og:description" content="..." />
<meta property="og:image" content="images/amuse.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

**Uso:**

- Pre-visualização exibida ao compartilhar em redes sociais como Facebook, LinkedIn
- Tamanho recomendado para `og:image`: 1200x630px
- `og:type` pode ser definido como `website`, `article`, etc.

### 3.3 Twitter Card Tags

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AMUSE VIP" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="images/amuse.webp" />
```

**Tipos de Twitter Card:**

- `summary`: Cartao pequeno
- `summary_large_image`: Cartao com imagem grande (recomendado)

---

## 4. Implementação de SEO para Landing Page estática

### 4.1 Lista completa de elementos SEO

Na Landing Page do projeto, os seguintes elementos SEO foram implementados:

```html
✅ Tag Title ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags (Facebook, LinkedIn, etc.) ✅ Twitter Card tags ✅ Canonical URL ✅ Configuracao
de Favicon
```

### 4.2 Exemplo de implementação

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO básico -->
    <title>AMUSE VIP</title>
    <meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
    <meta
      name="description"
      content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
    />

    <!-- Open Graph -->
    <meta property="og:site_name" content="AMUSE VIP" />
    <meta property="og:title" content="AMUSE VIP" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://example.com" />
    <meta property="og:description" content="..." />
    <meta property="og:image" content="images/amuse.webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="AMUSE VIP" />
    <meta name="twitter:description" content="..." />
    <meta name="twitter:image" content="images/amuse.webp" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://example.com" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="favicon.png" />
  </head>
  <body>
    <!-- Conteúdo da página -->
  </body>
</html>
```

---

## 5. Pontos-chave para entrevista

### 5.1 Seleção do modo de Router

**Por que escolher o History Mode?**

- Fornece URLs limpas, melhorando o efeito SEO
- Motores de busca podem indexar mais facilmente
- Melhor experiência do usuário

**O que observar?**

- Necessita suporte de configuração do backend (evitar 404 ao acessar rotas diretamente)
- Necessita configurar mecanismo de fallback

### 5.2 Importancia das Meta Tags

**Meta Tags básicas:**

- `title`: Afeta a exibição nos resultados de busca
- `description`: Afeta a taxa de cliques
- `keywords`: Menor importancia no SEO moderno, mas configuração recomendada

**Meta Tags para redes sociais:**

- Open Graph: Pre-visualização ao compartilhar em plataformas como Facebook, LinkedIn
- Twitter Card: Pre-visualização ao compartilhar no Twitter
- Tamanho de imagem recomendado: 1200x630px

---

## 6. Melhores práticas

1. **Tag Title**

   - Controlar o comprimento entre 50-60 caracteres
   - Incluir palavras-chave principais
   - Cada página deve ter um title único

2. **Description**

   - Controlar o comprimento entre 150-160 caracteres
   - Descrever o conteúdo da página de forma concisa
   - Incluir chamada para acao (CTA)

3. **Imagem Open Graph**

   - Tamanho: 1200x630px
   - Tamanho do arquivo: < 1MB
   - Usar imagens de alta qualidade

4. **Canonical URL**
   - Evitar problemas de conteúdo duplicado
   - Apontar para a URL da versão principal

---

## 7. Resumo da entrevista

**Você pode responder assim:**

> No projeto, escolhi usar o History Mode do Vue Router em vez do Hash Mode, porque o History Mode fornece uma estrutura de URL limpa mais favoravel ao SEO. Ao mesmo tempo, implementei meta tags SEO completas para a Landing Page, incluindo title, description, keywords básicos, além de Open Graph e Twitter Card tags, garantindo que a pre-visualização seja exibida corretamente ao compartilhar em redes sociais.

**Pontos-chave:**

- ✅ Seleção e razoes do Router History Mode
- ✅ Estrutura completa de Meta Tags
- ✅ Otimização de compartilhamento em redes sociais
- ✅ Experiência real em projetos
