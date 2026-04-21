import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

export const navZh = defineConfig({
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/Alicehhhmm/nnd-webgraphics/tree/main/website/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    nav: [
      { text: '首页', link: '/zh/' },
      { text: '阅读指南', link: '/zh/guide' },
      { text: '资源', link: '/zh/resources' },
      { text: '示例', link: '/zh/examples' },
      { text: 'ThreeJS', link: '/zh/threejs' },
    ],

    sidebar: {
      '/zh/guide': { base: '/zh/guide/', items: sidebarGuide() },
      '/zh/resources': { base: '/zh/resources/', items: sidebarResources() },
      '/zh/threejs': { base: '/zh/threejs/', items: sidebarThreejs() },
      '/zh/examples': { base: '/zh/examples/', items: sidebarExamples() },
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    notFound: {
      title: '页面未找到',
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  },
})

function sidebarGuide (): DefaultTheme.SidebarItem[] {
  return [
    { text: '阅读指南', link: '/' },
    { text: '为什么要写这个文档？', link: 'introduction' },
    { text: '学前需知', link: 'prerequisites' },
    { text: '配色方案', link: 'color-scheme' },
  ]
}

function sidebarResources (): DefaultTheme.SidebarItem[] {
  return [
    { text: '资源总览', link: '/' },
  ]
}



function sidebarExamples (): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '案例汇总', link: '/'
    },
    {
      text: 'ThreeJS',
      collapsed: false,
      items: [
        { text: 'Basic Examples', link: '/' },
      ]
    },
    {
      text: 'BabylonJS',
      collapsed: false,
      items: [
        { text: 'Basic Examples', link: '/' },
      ]
    },
    {
      text: 'FabricJS',
      collapsed: false,
      items: [
        { text: 'Basic Examples', link: '/' },
      ]
    },
    {
      text: 'PixiJS',
      collapsed: false,
      items: [
        { text: 'Basic Examples', link: '/' },
      ]
    },
  ]
}


function sidebarThreejs (): DefaultTheme.SidebarItem[] {
  return [
    { text: '为什么要写这个文档？', link: 'introduction' },
    {
      text: '学前需知',
      collapsed: false,
      items: [
        { text: '计算机图形渲染原理', link: 'rendering-principle' },
      ]
    },
    {
      text: '基础',
      collapsed: false,
      items: [
        { text: '场景', link: '/basics/scene' },
        { text: '相机', link: 'camera' },
        { text: '渲染器', link: 'renderer' },
        { text: '几何体', link: 'geometry' },
        { text: '材质', link: 'material' },
        { text: '网格', link: 'mesh' },
        { text: '光源', link: 'light' },
        { text: '纹理', link: 'texture' },
        { text: '阴影', link: 'shadow' },
        { text: '动画', link: 'animation' },
        { text: '加载器', link: 'loader' },
      ]
    },
    {
      text: '进阶',
      collapsed: false,
      items: [
        { text: '粒子系统', link: 'particle-system' },
        { text: '物理引擎', link: 'physics' },
        { text: '后期处理', link: 'post-processing' },
        { text: '性能优化', link: 'performance-optimization' },
      ]
    },
  ]
}
