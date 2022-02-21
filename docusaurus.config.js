const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: `Pitt Wu's Docusaurus`,
  tagline: '',
  url: 'https://pitt-docusaurus.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: `Pitt Wu's Blog`,
      logo: {
        alt: `Pitt Wu's Blog Logo`,
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'Frontend/frontend-entry',
          position: 'left',
          label: 'Frontend',
        },
        {
          type: 'doc',
          docId: 'Backend/backend-note',
          position: 'left',
          label: 'Backend',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        // {to: '/blog', label: 'Blog', position: 'right'},
        {
          href: 'https://github.com/wuzhe0912/docusaurus-blog',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Frontend',
              to: '/docs/frontend-entry',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wuzhe0912',
            },
          ],
        },
      ],
      copyright: `Copyright © 2017 - ${new Date().getFullYear()} Pitt Wu Built with Docusaurus.`,
    },
    colorMode: {
      defaultMode: 'dark',
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/wuzhe0912/Docusaurus-Blog/tree/master/',
          remarkPlugins: [
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
        },
        gtag: {
          trackingID: 'G-JVGM10YBH6',
          anonymizeIP: true,
        },
        pages: {
          remarkPlugins: [require('@docusaurus/remark-plugin-npm2yarn')],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  i18n: {
    defaultLocale: 'zh-tw',
    locales: ['en', 'zh-tw', 'zh-cn'],
  },
};
