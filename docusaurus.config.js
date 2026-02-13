const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;
require('dotenv').config();

const currentYear = new Date().getFullYear();

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Pitt Wu's Story",
  tagline: '',
  url: 'https://pitt-wu-blog.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  themeConfig: {
    navbar: {
      title: `Pitt Wu's Story`,
      logo: {
        alt: `Pitt Wu's Story Logo`,
        src: 'img/logo.svg',
      },
      items: [
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/projects', label: 'Projects', position: 'left' },
        {
          type: 'doc',
          docId: 'Knowledge/knowledge',
          label: 'Notes',
          position: 'left',
        },
        { to: '/about', label: 'About', position: 'right' },
        { type: 'localeDropdown', position: 'right' },
      ],
    },

    footer: {
      style: 'light',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wuzhe0912',
            },
            {
              label: 'Linkedin',
              href: 'https://linkedin.com/in/pitt-wu',
            },
            {
              label: 'CakeResume',
              href: 'https://www.cakeresume.com/me/pittwu',
            },
          ],
        },
        // {
        //   title: 'More',
        //   items: [
        //     {
        //       label: '',
        //       href: '',
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © ${currentYear} Pitt Wu Built with Docusaurus.`,
    },
    colorMode: {
      defaultMode: 'dark',
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    algolia: {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.ALGOLIA_API_INDEX_NAME,
      contextualSearch: true,
      searchPagePath: 'search',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/wuzhe0912/blog-docusaurus/tree/master/',
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
          editUrl: 'https://github.com/wuzhe0912/blog-docusaurus/tree/master/',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All Posts',
          postsPerPage: 10,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-tw', 'zh-cn', 'ja', 'ko', 'es', 'pt-BR', 'de', 'fr', 'vi'],
  },
};
