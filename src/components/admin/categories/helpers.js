export const buildCategoryTree = (categories) => {
  const idMap = {};
  const tree = [];

  categories.forEach((cat) => {
    idMap[cat._id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    if (cat.parent && idMap[cat.parent?._id || cat.parent]) {
      idMap[cat.parent?._id || cat.parent].children.push(idMap[cat._id]);
    } else {
      tree.push(idMap[cat._id]);
    }
  });

  return tree;
};
