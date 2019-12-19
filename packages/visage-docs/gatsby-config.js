const { resolve } = require('path');
const algoliaQueries = require('./utils/algolia');

module.exports = {
  siteMetadata: {
    banner: '',
    description:
      'Highly customizable React design system for rapid UI development',
    author: '@byteclaw',
    github: 'https://github.com/byteclaw/visage',
    ogLanguage: 'en_US',
    siteLanguage: 'en',
    title: 'Visage',
    url: 'https://visage.design',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-alias-imports`,
      options: {
        alias: {
          '@byteclaw/visage-core': resolve(__dirname, '../visage-core/src'),
          '@byteclaw/visage-utils': resolve(__dirname, '../visage-utils/src'),
          '@byteclaw/visage': resolve(__dirname, '../visage/src'),
        },
        extensions: ['ts', 'tsx', 'js', 'jsx'],
      },
    },
    'gatsby-plugin-netlify',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-svgr',
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: `${__dirname}/src/docs`,
        ignore: ['**/public/**/*', '**/.cache/**/*'],
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          { resolve: 'gatsby-remark-emoji' },
          { resolve: 'gatsby-remark-slug' },
        ],
        extensions: ['.md', '.mdx'],
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-153604238-1',
      },
    },
    {
      resolve: 'gatsby-plugin-algolia',
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: algoliaQueries,
        chunkSize: 10000,
      },
    },
  ],
};
