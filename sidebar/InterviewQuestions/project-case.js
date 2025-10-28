module.exports = {
  type: 'category',
  label: '📁 專案實戰案例',
  items: [
    'InterviewQuestions/Project-Case/project-overview',
    {
      type: 'category',
      label: '🚀 效能優化',
      collapsed: false,
      items: [
        'InterviewQuestions/Project-Case/optimization',
        'InterviewQuestions/Project-Case/virtual-scroll',
      ],
    },
    {
      type: 'category',
      label: '💡 進階技術',
      collapsed: false,
      items: ['InterviewQuestions/Project-Case/web-worker'],
    },
    {
      type: 'category',
      label: '🏗️ 架構與配置',
      collapsed: false,
      items: [
        'InterviewQuestions/Project-Case/vite-setting',
        'InterviewQuestions/Project-Case/browser',
      ],
    },
  ],
};
