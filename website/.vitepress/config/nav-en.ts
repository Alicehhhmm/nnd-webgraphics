import { defineConfig } from 'vitepress'

export const navEn = defineConfig({
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/Alicehhhmm/nnd-threejs/tree/edit/main/website/docs/:path',
      text: 'Edit this page on GitHub',
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/introduction' },
      { text: 'Examples', link: '/examples' },
    ],
  },
})
