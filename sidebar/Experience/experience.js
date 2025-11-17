module.exports = {
  type: 'category',
  label: '面試心得',
  items: [
    'Experience/2025-11-interview-prep',
    'Experience/2023-experience',
    {
      type: 'category',
      label: '📋 實作登入機制',
      items: [
        'Experience/Login/login-interview-index',
        {
          type: 'category',
          label: 'Lv1 基礎',
          key: 'login-lv1',
          items: [
            'Experience/Login/login-lv1-project-implementation',
            'Experience/Login/login-lv1-session-vs-token',
            'Experience/Login/login-lv1-jwt-structure',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '⚡ 網頁效能優化',
      items: [
        'Experience/Performance/performance-interview-index',
        {
          type: 'category',
          label: 'Lv1 基礎',
          key: 'performance-lv1',
          items: [
            'Experience/Performance/performance-lv1-route-optimization',
            'Experience/Performance/performance-lv1-image-optimization',
          ],
        },
        {
          type: 'category',
          label: 'Lv2 進階',
          key: 'performance-lv2',
          items: ['Experience/Performance/performance-lv2-js-optimization'],
        },
        {
          type: 'category',
          label: 'Lv3 延伸',
          key: 'performance-lv3',
          items: [
            'Experience/Performance/performance-lv3-virtual-scroll',
            'Experience/Performance/performance-lv3-web-worker',
            'Experience/Performance/performance-lv3-large-data-optimization',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '🏗️ 專案架構',
      items: [
        'Experience/Project-Architecture/project-architecture-vite-setting',
        'Experience/Project-Architecture/project-architecture-browser-compatibility',
      ],
    },
    {
      type: 'category',
      label: '🌐 SSR & SEO',
      items: [
        'Experience/SSR-SEO/ssr-seo-interview-index',
        {
          type: 'category',
          label: 'Lv1 基礎',
          key: 'ssr-seo-lv1',
          items: ['Experience/SSR-SEO/ssr-seo-lv1-seo-basic'],
        },
        {
          type: 'category',
          label: 'Lv2 進階',
          key: 'ssr-seo-lv2',
          items: [
            'Experience/SSR-SEO/ssr-seo-lv2-seo-optimization',
            'Experience/SSR-SEO/ssr-seo-lv2-ssr-implementation',
          ],
        },
        {
          type: 'category',
          label: 'Lv3 延伸',
          key: 'ssr-seo-lv3',
          items: ['Experience/SSR-SEO/ssr-seo-lv3-ssr-challenges'],
        },
      ],
    },
    {
      type: 'category',
      label: '📦 狀態管理',
      items: [
        'Experience/State-Management/state-management-interview-index',
        {
          type: 'category',
          label: 'Vue',
          key: 'state-management-vue',
          items: [
            'Experience/State-Management/Vue/state-management-vue-pinia-setup',
            'Experience/State-Management/Vue/state-management-vue-pinia-store-patterns',
            'Experience/State-Management/Vue/state-management-vue-pinia-usage',
            'Experience/State-Management/Vue/state-management-vue-pinia-persistence',
            'Experience/State-Management/Vue/state-management-vue-pinia-best-practices',
            'Experience/State-Management/Vue/state-management-vue-vuex-vs-pinia',
          ],
        },
      ],
    },
  ],
};
