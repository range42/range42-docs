// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

// ESM-safe: resolve plugin path when require is available (CJS interop), else use bare string
const searchLocalPlugin =
  typeof require !== 'undefined'
    ? require.resolve('@easyops-cn/docusaurus-search-local')
    : '@easyops-cn/docusaurus-search-local';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Range42 Docs',
  tagline: 'Open-Source Cyber Range Platform',
  favicon: 'img/favicon.svg',

  future: { v4: true },

  url: 'https://docs.range42.lu',
  baseUrl: '/',
  trailingSlash: true,

  organizationName: 'range42',
  projectName: 'range42-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
          editUrl: 'https://github.com/range42/range42-docs/tree/main/',
          lastVersion: '0.8',
          versions: {
            current: { label: 'Next', path: 'next' },
            '0.8': { label: '0.8', path: '0.8' },
          },
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      }),
    ],
  ],

  themes: [
    [
      searchLocalPlugin,
      /** @type {import('@easyops-cn/docusaurus-search-local').PluginOptions} */
      ({
        hashed: true,
        language: ['en'],
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.svg',
      colorMode: { defaultMode: 'dark', respectPrefersColorScheme: true },
      navbar: {
        title: 'Range42',
        logo: { alt: 'Range42', src: 'img/logo.svg' },
        items: [
          { type: 'docSidebar', sidebarId: 'docsSidebar', position: 'left', label: 'Docs' },
          { type: 'docsVersionDropdown', position: 'right' },
          { href: 'https://range42.lu', label: 'Website', position: 'right' },
          { href: 'https://github.com/range42/range42', label: 'GitHub', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          { title: 'Docs', items: [{ label: 'Getting Started', to: '/docs/0.8/' }] },
          { title: 'Project', items: [
            { label: 'Website', href: 'https://range42.lu' },
            { label: 'GitHub', href: 'https://github.com/range42/range42' },
          ]},
          { title: 'Maintained by', items: [
            { label: 'NC3 Luxembourg', href: 'https://nc3.lu' },
            { label: 'Luxembourg House of Cybersecurity', href: 'https://lhc.lu' },
          ]},
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NC3 Luxembourg — Range42. GPL-3.0. Built with Docusaurus.`,
      },
      prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
    }),
};

export default config;
