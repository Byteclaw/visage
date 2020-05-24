const pageQuery = /* GraphQL */ `
  {
    docs: allMdx(filter: { fileAbsolutePath: { regex: "/docs/" } }) {
      edges {
        node {
          objectID: id
          fields {
            urlPath
          }
          frontmatter {
            description
            title
          }
          excerpt(pruneLength: 5000)
        }
      }
    }
  }
`;
const flatten = arr =>
  arr.map(({ node: { frontmatter, fields, ...rest } }) => {
    return {
      ...frontmatter,
      ...rest,
      pathname: fields,
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
