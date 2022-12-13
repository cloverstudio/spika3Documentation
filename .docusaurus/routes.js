import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'fbc'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'a50'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'e7f'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '7e4'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', 'c1a'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '9b1'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', 'b4d'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', '344'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '0a5'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '1fe'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', '612'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', 'ca7'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '033'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', '76c'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', 'c01'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '15e'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '97e'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', '3b9'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '5f2'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '79c'),
    routes: [
      {
        path: '/docs/backend/congratulations',
        component: ComponentCreator('/docs/backend/congratulations', '536'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/backend/create-a-blog-post',
        component: ComponentCreator('/docs/backend/create-a-blog-post', '4d5'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/backend/create-a-document',
        component: ComponentCreator('/docs/backend/create-a-document', '30f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/backend/create-a-page',
        component: ComponentCreator('/docs/backend/create-a-page', 'ca4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/backend/deploy-your-site',
        component: ComponentCreator('/docs/backend/deploy-your-site', '74d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/backend/markdown-features',
        component: ComponentCreator('/docs/backend/markdown-features', 'd89'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/backend',
        component: ComponentCreator('/docs/category/backend', '240'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/frontend',
        component: ComponentCreator('/docs/category/frontend', 'd29'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/deployment',
        component: ComponentCreator('/docs/deployment', 'aee'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/frontend/manage-docs-versions',
        component: ComponentCreator('/docs/frontend/manage-docs-versions', 'f63'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/frontend/translate-your-site',
        component: ComponentCreator('/docs/frontend/translate-your-site', 'e43'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/intro',
        component: ComponentCreator('/docs/intro', 'aed'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/messaging-api',
        component: ComponentCreator('/docs/messaging-api', '8c8'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/webhooks',
        component: ComponentCreator('/docs/webhooks', '61e'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '7b5'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
