import { defineConfig } from 'vitepress'

export const sharedConfig = defineConfig({
  rewrites: {
    'en/:rest*': ':rest*',
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  themeConfig: {
    logo: { src: '/notebook.png' },

    socialLinks: [{ icon: 'github', link: 'https://github.com/Alicehhhmm/nnd-webgraphics.git' }],

    search: {
      provider: 'algolia',
      options: {
        appId: 'XO81VP15GR',
        apiKey: '6cf494bd1662ef1dcc5b372445335ca0',
        indexName: 'nnd-webGraphics',
      },
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Norush',
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/notebook.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'NND, Norush Note Document, Web Graphics, three.js, WebGL, computer graphics, graphics programming',
      },
    ],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
  ],
})
