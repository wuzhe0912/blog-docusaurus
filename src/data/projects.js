export const tags = {
  fullstack: { label: 'Full Stack', color: '#e9669e' },
  frontend: { label: 'Frontend', color: '#dfd545' },
  backend: { label: 'Backend', color: '#fe6829' },
  opensource: { label: 'Open Source', color: '#39ca30' },
  react: { label: 'React', color: '#61dafb' },
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
];
