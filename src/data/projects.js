export const tags = {
  fullstack: { label: 'Full Stack', color: '#e9669e' },
  frontend: { label: 'Frontend', color: '#dfd545' },
  backend: { label: 'Backend', color: '#fe6829' },
  opensource: { label: 'Open Source', color: '#39ca30' },
  react: { label: 'React', color: '#61dafb' },
  vue: { label: 'Vue', color: '#42b883' },
  nuxt: { label: 'Nuxt', color: '#00dc82' },
  node: { label: 'Node.js', color: '#68a063' },
};

export const projects = [
  {
    title: 'Chatify',
    description:
      'A real-time messaging app with private/group chat, message status tracking, image sharing, and multiple themes.',
    preview: '/img/showcase/chatify.png',
    website: 'https://chatify-app-client.vercel.app/login',
    source: {
      client: 'https://github.com/wuzhe0912/chatify-app-client',
      server: 'https://github.com/wuzhe0912/chatify-app-server',
    },
    tags: ['fullstack', 'opensource', 'react', 'node'],
  },
  {
    title: 'True Salary Story',
    description:
      'A salary sharing platform where users can anonymously post and search real salary data by company, job title, and industry. Built with Nuxt 3 SSR, LINE Pay integration, and a 6-person team.',
    preview: '/img/showcase/true-salary-story.png',
    website: 'https://true-salary-story-client.vercel.app/',
    source: {
      'front-client': 'https://github.com/North-Cat/true-salary-story-client',
      'front-server':
        'https://github.com/North-Cat/true-salary-story-client-api',
      'admin-client': 'https://github.com/North-Cat/true-salary-story-admin',
      'admin-server':
        'https://github.com/North-Cat/true-salary-story-admin-api',
    },
    tags: ['fullstack', 'vue', 'nuxt', 'node'],
  },
];
