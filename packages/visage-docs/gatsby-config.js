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
    'gatsby-plugin-emotion',
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
      resolve: 'gatsby-mdx',
      options: {
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
