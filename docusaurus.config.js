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
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: `Pitt Wu's Story`,
      logo: {
        alt: `Pitt Wu's Story Logo`,
        src: 'img/logo.svg',
      },
      items: [
        { type: 'localeDropdown', position: 'right' },
        { to: '/blog', label: 'Blog', position: 'right' },
        {
          type: 'doc',
          docId: 'InterviewQuestions/interview-questions',
          position: 'left',
          label: 'Interview Questions',
        },
        {
          type: 'doc',
          docId: 'Coding/coding',
          position: 'left',
          label: 'Coding',
        },
        {
          type: 'doc',
          docId: 'Quiz/quiz',
          position: 'left',
          label: 'Quiz',
        },
        {
          type: 'doc',
          docId: 'LeetCode/leet-code',
          position: 'left',
          label: 'LeetCode',
        },
        {
          type: 'doc',
          docId: 'AI/ai-index',
          position: 'left',
          label: 'AI',
        },
        {
          href: 'https://github.com/wuzhe0912/docusaurus-blog',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
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
        {
          title: 'More',
          items: [
            {
              label: 'Instagram(My Son)',
              href: 'https://www.instagram.com/little_seal0627/',
            },
          ],
        },
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
    locales: ['zh-tw', 'en', 'ja', 'fr', 'de', 'ar'],
    localeConfigs: {
      ar: {
        direction: 'rtl',
      },
    },
  },
};
