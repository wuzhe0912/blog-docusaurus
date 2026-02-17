---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> 请解释并比较 SPA 和 SSR 的优缺点

### SPA（单页式应用程序）

#### SPA 优点

1. 用户体验：SPA 的本质就是一个页面，只是通过动态加载数据，结合前端的路由，让用户认为有在切换页面，但实际上只是切换 component，这样的使用体验自然更为丝滑快速。
2. 前后端分离：前端只需要负责页面渲染与交互，而后端则只需要提供数据 API，不但减轻彼此开发的负担，也更易维护。
3. 网络优化：因为只需要加载一次页面，不像传统多页面结构每次切换页面都需要重新加载，自然也就减少了请求的次数，降低 server 端的负担。

#### SPA 缺点

1. 搜索引擎优化（SEO）：SPA 的页面都是动态加载的，因此搜索引擎无法直接抓取到页面内容（虽然近年 Google 声称有在改善这点），面对搜索引擎的爬虫，还是不如传统的 HTML。
2. 首页加载时间：SPA 需要在 client 端加载并执行 JavaScript，才能渲染出页面，因此首页的加载时间会比较长，尤其是在网络状况不佳的情况下，可能会导致首次加载时间延迟。

### SSR（服务器端渲染）

#### SSR 优点

1. 搜索引擎优化（SEO）：因为 SSR 是在 server 端就已经渲染好包含数据的页面，因此搜索引擎可以直接抓取到页面内容，这也是 SSR 最大的优势。
2. 加载时间：因为 SSR 将原本的渲染负担转移到 server 端，可以缩短首次进入的渲染时间。

#### SSR 缺点

1. 学习成本和复杂度：以 Next 和 Nuxt 为例，虽然它们本质都是奠基在 React 和 Vue 上，但是已经各自衍生出自己的生态系，无形中抬高了学习成本，以近期的 Next.js 14 改版来看，客观来说并不是每个开发者都能接受这样的改变。
2. 服务器负担：因为渲染的工作转移到 server 端，可能会对 server 造成更大的负担，尤其如果是遇到高流量的应用场景。

### 结论

原则上，如果是后台的系统，在没有 SEO 的需求下，应该是没必要使用 SSR 框架，除非是仰赖搜索引擎的产品网页，那确实可以评估采用 SSR 框架开发。

## 2. 请阐述使用过的 Web Framework，并比较其优缺点

**两者近年都往「以函数为主的组件开发」收敛：**

> Vue 3 通过 Composition API，把逻辑拆成可重用的 composable；React 则以 Hooks 为核心。在开发者体验上两者相当接近，不过整体而言，Vue 的上手成本较低，React 则在生态与弹性上更强。

### Vue（以 Vue 3 为主）

**优点：**

- **学习曲线较平滑**：SFC（Single File Component）把 template / script / style 聚在一起，对于从传统前端（后端模板）转过来的开发者很友善。
- **官方约定明确、对团队有利**：官方提供的风格指南与惯例清楚，新成员接手项目时较容易维持一致性。
- **核心生态完整**：官方维护 Vue Router、Pinia（或 Vuex）、CLI / Vite Plugin 等，从建项目到状态管理、路由都有「官方解法」，降低选型成本。
- **Composition API 提升可维护性**：可以依功能拆出 composable（例如 useAuth、useForm），在大型项目中共用逻辑、减少重复代码。

**缺点：**

- **生态与社群规模略小于 React**：第三方套件数量与多样性不如 React，有些前沿工具或集成会先以 React 为主。
- **就业市场相对集中在特定区域/产业**：相较 React，国外或跨国团队多半以 React 为主，在职业弹性上相对劣势很多（但在华语圈则持各半）。

---

### React

**优点：**

- **生态圈庞大、技术更新速度快**：几乎所有前端新技术、设计系统或第三方服务，都会优先提供 React 版本。
- **弹性高、可因项目自由组合技术栈**：可搭配 Redux / Zustand / Recoil 等多种状态管理，也有 Next.js、Remix 等 Meta Framework，从 SPA 到 SSR、SSG、CSR 都有成熟方案。
- **与 TypeScript、前端工程化集成成熟**：社群对类型与大型项目的最佳实务讨论很多，对长期维护的大型项目有帮助。

**缺点：**

- **自由度高，团队需要自定规范**：在没有明确 coding style、架构约定的情况下，不同开发者可能用完全不同的写法与状态管理方式，后续维护成本会提高。
- **学习曲线实际上不低**：除了 React 本身（JSX、Hooks 思维）以外，还要面对 Router、状态管理、数据抓取、SSR 等一连串选型，新手容易迷失在「要选哪个 library」。
- **API 变动与最佳实务演进较快**：例如从 Class Component 到 Function Component + Hooks、再到 Server Components 等，老项目与新写法共存时，需要额外的迁移与维护成本。
