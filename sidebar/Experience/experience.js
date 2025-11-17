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
  ],
};
