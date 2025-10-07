import { defineConfig } from 'vitepress'

export const navZh = defineConfig({
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/Alicehhhmm/nnd-webgraphics/tree/main/website/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/introduction' },
      { text: '示例', link: '/examples' },
    ],
  },
})
