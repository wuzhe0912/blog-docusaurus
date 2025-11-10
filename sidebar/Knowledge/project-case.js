module.exports = {
  type: 'category',
  label: '專案實戰案例',
  items: [
    'Knowledge/Project-Case/project-overview',
    {
      type: 'category',
      label: '效能優化',
      collapsed: false,
      items: [
        'Knowledge/Project-Case/optimization',
        'Knowledge/Project-Case/large-data-optimization',
        'Knowledge/Project-Case/virtual-scroll',
      ],
    },
    {
      type: 'category',
      label: '進階技術',
      collapsed: false,
      items: ['Knowledge/Project-Case/web-worker'],
    },
    {
      type: 'category',
      label: '架構與配置',
      collapsed: false,
      items: [
        'Knowledge/Project-Case/vite-setting',
        'Knowledge/Project-Case/browser',
      ],
    },
  ],
};
