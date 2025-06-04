// File: components/admin/categories/helpers.js

/**
 * buildCategoryTree
 * -----------------
 * Takes a flat array of category objects and returns a nested tree.
 * Each category is expected to have:
 *   - _id            (string)
 *   - parent         (either null or an object containing at least { _id, name, … })
 *
 * The output is an array of “root” nodes (parent === null), each with a `children` array.
 */
export default function buildCategoryTree(categories) {
  if (!Array.isArray(categories)) return [];

  // 1) Create a map from stringified _id → node with empty `children`
  const map = {};
  categories.forEach((c) => {
    const idKey = c._id.toString();
    map[idKey] = { ...c, children: [] };
  });

  // 2) Iterate again, attach each node to its parent (if parent exists)
  const tree = [];
  categories.forEach((c) => {
    const idKey = c._id.toString();

    // Detect parent ID from c.parent._id (if parent is an object), else null
    let parentId = null;
    if (c.parent && typeof c.parent === "object" && c.parent._id) {
      parentId = c.parent._id.toString();
    }

    if (parentId && map[parentId]) {
      // Attach to its parent’s children array
      map[parentId].children.push(map[idKey]);
    } else {
      // No valid parent → top‐level node
      tree.push(map[idKey]);
    }
  });

  return tree;
}
