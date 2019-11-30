const { resolve } = require('path');

const rootDir = resolve(__dirname, '../src/pages');

const pageQuery = /* GraphQL */ `
  {
    pages: allMdx(filter: { fileAbsolutePath: { regex: "/pages/" } }) {
      edges {
        node {
          objectID: id
          frontmatter {
            description
            title
          }
          excerpt(pruneLength: 5000)
          fileAbsolutePath
        }
      }
    }
  }
`;
const flatten = arr =>
  arr.map(({ node: { frontmatter, fileAbsolutePath, ...rest } }) => ({
    ...frontmatter,
    ...rest,
    pathname: fileAbsolutePath.replace(rootDir, '').replace(/(\..+)$/, ''),
  }));
const settings = { attributesToSnippet: [`excerpt:20`] };
const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => flatten(data.pages.edges),
    indexName: `Pages`,
    settings,
  },
];

module.exports = queries;
