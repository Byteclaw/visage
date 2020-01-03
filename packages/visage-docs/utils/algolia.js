const { resolve } = require('path');

const rootDir = resolve(__dirname, '../src/docs');

const pageQuery = /* GraphQL */ `
  {
    docs: allMdx(filter: { fileAbsolutePath: { regex: "/docs/" } }) {
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
  arr.map(({ node: { frontmatter, fileAbsolutePath, ...rest } }) => {
    const pathname = fileAbsolutePath
      .replace(rootDir, '')
      .replace(/(\..+)$/, '');

    return {
      ...frontmatter,
      ...rest,
      // fix /index to /
      pathname: pathname === '/index' ? '/' : pathname,
    };
  });
const settings = { attributesToSnippet: [`excerpt:20`] };
const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => flatten(data.docs.edges),
    indexName: `Pages`,
    settings,
  },
];

module.exports = queries;
