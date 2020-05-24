require('ts-node').register({
  compilerOptions: {
    jsx: 'react',
    lib: ['es2018', 'dom'],
    target: 'esnext',
    moduleResolution: 'node',
    module: 'commonjs',
  },
});

const { createFilePath } = require(`gatsby-source-filesystem`);
const path = require('path');
const { pathListToTree } = require('./utils/pathListToTree');
const { createProgram } = require('./src/extractTypeInformations');

const GITHUB_USERNAME = 'byteclaw';
const GITHUB_PROJECT = 'visage';

const componentInformationMap = createProgram();

exports.onCreateWebpackConfig = function onCreateWebpackConfig({
  actions,
  loaders,
}) {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            /regexpu-core/,
            // unicode----ecmascript packages
            /-ecmascript/,
          ],
          use: [loaders.js()],
        },
        {
          test: /react-refresh-webpack-plugin/,
          use: [loaders.js()],
        },
      ],
    },
  });
};

function processNode(node, root, pages) {
  const absPath = path.join(root.path, node.name);
  node.path = absPath;

  if (node.name.endsWith('.mdx')) {
    const page = pages.find(p => p.node.fileAbsolutePath === node.path);

    node.title = page.node.frontmatter.title;
    node.urlPath = page.node.fields.urlPath;
  } else {
    node.urlPath = `${root.urlPath}${node.name.replace(/^(\d+-)/, '')}/`;
    node.title = node.name
      .replace(/[-]+/g, ' ')
      .replace(/^(\d+\s+)/, '')
      .replace(/^./, r => r.toUpperCase());

    node.children.forEach(child => processNode(child, node, pages));
  }
}

function createNavigation(pages, root) {
  const tree = pathListToTree(
    pages.map(p => p.node.fileAbsolutePath.replace(`${root}${path.sep}`, '')),
    path.sep,
  );

  // now go through the tree and process names, add absolute paths
  tree.forEach(node => processNode(node, { path: root, urlPath: '/' }, pages));

  return tree;
}

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
            fileAbsolutePath
            fields {
              urlPath
            }
            headings(depth: h1) {
              value
            }
            frontmatter {
              components
              tags
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

  const pages = result.data.allMdx.edges.sort((a, b) => {
    // take shortest path and compare
    const aparts = a.node.fileAbsolutePath.split(path.sep);
    const aLength = aparts.length;
    const bparts = b.node.fileAbsolutePath.split(path.sep);
    const bLength = bparts.length;
    const minLength = Math.min(aLength, bLength);
    const apath = aparts.slice(0, minLength).join(path.sep);
    const bpath = bparts.slice(0, minLength).join(path.sep);
    const adirname = aparts.slice(0, minLength - 1).join(path.sep);
    const bdirname = bparts.slice(0, minLength - 1).join(path.sep);

    if (adirname === bdirname) {
      if (apath.endsWith('index.mdx')) {
        return -1;
      }

      if (bpath.endsWith('index.mdx')) {
        return 1;
      }
    }

    if (apath < bpath) {
      return -1;
    }

    if (apath > bpath) {
      return 1;
    }

    return 0;
  });

  const root = path.join(__dirname, 'src', 'docs');

  // generate navigation, all files are sorted so we just need to go through them
  const tree = createNavigation(pages, root);

  function constructPages(nodes, allPages) {
    return [].concat(
      ...nodes.map(node => {
        const page = allPages.find(p => p.node.fileAbsolutePath === node.path);

        if (page) {
          return [page, ...constructPages(node.children, allPages)];
        }

        return constructPages(node.children, allPages);
      }),
    );
  }

  const preparedPages = constructPages(tree, pages);

  preparedPages.forEach((page, index, allPages) => {
    const prev = allPages[index - 1];
    const next = allPages[index + 1];

    // filter out prop types by components from frontmatter
    // so we don't have big page context
    const reducedComponentInformationMap = Array.isArray(
      page.node.frontmatter.components,
    )
      ? page.node.frontmatter.components.reduce(
          (map, component) => ({
            [component]: componentInformationMap[component],
            ...map,
          }),
          {},
        )
      : {};

    createPage({
      path: page.node.fields.urlPath,
      component: componentPageLayout,
      context: {
        componentInformationMap: reducedComponentInformationMap,
        navigationTree: tree,
        previousPage: prev
          ? {
              title: prev.node.frontmatter.title,
              urlPath: prev.node.fields.urlPath,
            }
          : undefined,
        nextPage: next
          ? {
              title: next.node.frontmatter.title,
              urlPath: next.node.fields.urlPath,
            }
          : undefined,
        urlPath: page.node.fields.urlPath,
      },
    });
  });
};

exports.onCreateNode = ({ getNode, node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'Mdx') {
    const githubFilePath = node.fileAbsolutePath.replace(process.cwd(), '');
    const urlPath = createFilePath({
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
      name: 'urlPath',
      value: urlPath.replace(/(\d+-)/g, ''),
    });
  }
};
