const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const currentYear = new Date().getFullYear();

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: `Coding and Storytelling`,
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
        { to: '/blog', label: 'Blog', position: 'right' },
        // {
        //   type: 'doc',
        //   docId: 'SoftwareEngineer/software-engineer',
        //   position: 'left',
        //   label: 'Software Engineer',
        // },
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
          ],
        },
      ],
      copyright: `Copyright © 2017 - ${currentYear} Pitt Wu Built with Docusaurus.`,
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
    locales: ['zh-tw', 'en'],
  },
};
