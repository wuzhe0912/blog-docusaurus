---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Please explain and compare the advantages and disadvantages of SPA and SSR.

### SPA (Single-Page Application)

#### SPA Advantages

1. User experience: an SPA is effectively one page. With dynamic data loading and client-side routing, users feel like pages are switching, but the app is actually switching components, which feels smoother and faster.
2. Frontend-backend separation: the frontend focuses on rendering and interaction, while the backend provides data APIs. This reduces coupling and improves maintainability.
3. Network optimization: because the page is loaded once, it avoids full page reloads on every navigation (as in traditional multi-page apps), reducing request count and server load.

#### SPA Disadvantages

1. SEO challenges: SPA content is often rendered dynamically, so search engines may not index it as reliably as traditional HTML (even though Google has improved this).
2. Initial load time: SPAs must download and run JavaScript on the client before rendering, so first load can be slower, especially on weak networks.

### SSR (Server-Side Rendering)

#### SSR Advantages

1. SEO: SSR renders data-filled HTML on the server, so search engines can crawl page content directly. This is SSR's biggest advantage.
2. Initial rendering speed: rendering work is moved to the server, which usually improves first paint/first content delivery.

#### SSR Disadvantages

1. Learning curve and complexity: frameworks like Next and Nuxt are based on React/Vue but have their own ecosystems and conventions, which raises learning and migration costs.
2. Higher server load: since rendering is done on the server, traffic spikes can increase infrastructure pressure.

### Conclusion

In general, if you are building an internal admin system without SEO requirements, SSR is usually unnecessary.  
For search-driven product websites, adopting SSR is worth evaluating.

## 2. Describe the web frameworks you have used and compare their pros and cons

**In recent years, both have converged toward function-oriented component development:**

> Vue 3 uses the Composition API to split logic into reusable composables, while React centers on Hooks. The developer experience is quite similar, but overall Vue is easier to start with, and React is stronger in ecosystem size and flexibility.

### Vue (mainly Vue 3)

**Advantages:**

- **Smoother learning curve**:  
  SFC (Single File Component) keeps template/script/style together, which is friendly for developers coming from traditional templating workflows.
- **Clear official conventions, good for teams**:  
  Vue provides clear style guides and conventions (structure, naming, component decomposition), making team consistency easier.
- **Complete core ecosystem**:  
  Officially maintained tools like Vue Router and Pinia (or Vuex), plus build tooling, reduce decision overhead.
- **Composition API improves maintainability**:  
  Logic can be extracted into composables (for example `useAuth`, `useForm`) to share behavior and reduce duplication in large projects.

**Disadvantages:**

- **Smaller ecosystem/community than React**:  
  Third-party package volume and variety are lower. Some cutting-edge tools or integrations (design systems, niche libraries) are React-first.
- **Job market concentration by region/industry**:  
  Compared with React, many global or cross-border teams prefer React, which can reduce career flexibility in some markets.

---

### React

**Advantages:**

- **Large ecosystem and fast innovation**:  
  Most frontend technologies, design systems, and third-party services provide React support first (UI libraries, charts, editors, design systems, etc.).
- **High flexibility for stack composition**:  
  Works with Redux/Zustand/Recoil and meta-frameworks like Next.js/Remix. Mature choices exist for SPA, SSR, SSG, and CSR.
- **Mature integration with TypeScript and tooling**:  
  The community has extensive best practices for typing and large-scale engineering, useful for long-term maintenance.

**Disadvantages:**

- **Too much freedom requires team conventions**:  
  Without clear coding and architecture standards, teams may produce inconsistent patterns, increasing maintenance cost.
- **Learning curve is not low in practice**:  
  Beyond React itself (JSX and Hooks), developers must choose routing, state management, data fetching, and SSR approaches.
- **Fast API and best-practice evolution**:  
  From class components to function components + hooks to server components, coexistence of old/new patterns increases migration overhead.
