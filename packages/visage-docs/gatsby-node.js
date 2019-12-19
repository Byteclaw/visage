const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require('path');

const GITHUB_USERNAME = 'byteclaw';
const GITHUB_PROJECT = 'visage';

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const componentPageLayout = path.resolve(
    `./src/templates/ComponentPageLayout.tsx`,
  );

  const result = await graphql(/* GraphQL */ `
    {
      allMdx(limit: 1000) {
        edges {
          node {
            fields {
              componentPathName
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  // Create blog posts pages.
  const posts = result.data.allMdx.edges;

  posts.forEach(post => {
    createPage({
      path: post.node.fields.componentPathName,
      component: componentPageLayout,
      context: {
        componentPathName: post.node.fields.componentPathName,
      },
    });
  });
};

exports.onCreateNode = ({ getNode, node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const githubFilePath = node.fileAbsolutePath.replace(process.cwd(), '');
    const componentPathName = createFilePath({
      node,
      getNode,
    });

    // create github edit link for given node
    createNodeField({
      node,
      name: 'githubEditLink',
      value: `https://github.com/${GITHUB_USERNAME}/${GITHUB_PROJECT}/edit/master/packages/visage-docs${githubFilePath}`,
    });

    createNodeField({
      node,
      name: 'componentPathName',
      value: componentPathName,
    });
  }
};
