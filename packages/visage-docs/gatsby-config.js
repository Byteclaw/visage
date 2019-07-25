const { resolve } = require('path');

module.exports = {
  siteMetadata: {
    title: 'Visage',
    description: 'Visage design system for rapid UI development',
    author: '@byteclaw',
    install: 'npm i visage',
    github: 'https://github.com/byteclaw/visage',
  },
  __experimentalThemes: [],
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
    'gatsby-plugin-emotion',
    'gatsby-plugin-netlify',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-svgr',
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: __dirname,
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
    /* {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-4603832-13',
      },
    }, */
  ],
};
