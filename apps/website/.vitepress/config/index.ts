import { defineConfig } from 'vitepress'
import { sharedConfig } from './shared'
import { navEn } from './nav-en'
import { navZh } from './nav-zh'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: '..\\website',

  title: 'NND-WebGraphics',
  description: 'Norush Note Document - Web Graphics',

  ...sharedConfig,

  locales: {
    root: { label: '简体中文', lang: 'zh-CN', dir: 'ltr', ...navZh },
    en: { label: 'English', lang: 'en-US', dir: 'ltr', ...navEn },
  },

  markdown: {
    math: true,
  },
})
