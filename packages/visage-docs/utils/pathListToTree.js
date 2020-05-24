function createNode(paths, tree) {
  const name = paths.shift();
  const idx = tree.findIndex(e => {
    return e.name === name;
  });
  if (idx < 0) {
    tree.push({
      name,
      children: [],
    });
    if (paths.length !== 0) {
      createNode(paths, tree[tree.length - 1].children);
    }
  } else {
    createNode(paths, tree[idx].children);
  }
}

module.exports.pathListToTree = function pathListToTree(data, delimiter = '/') {
  const tree = [];
  for (let i = 0; i < data.length; i++) {
    const path = data[i];
    const split = path.split(delimiter);
    createNode(split, tree);
  }
  return tree;
};
