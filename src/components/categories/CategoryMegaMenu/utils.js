export function buildTree(list = []) {
  const map = { root: [] };

  list.forEach((item) => {
    const key = item.parent ?? "root";
    if (!map[key]) map[key] = [];
    map[key].push({ ...item });
  });

  return map;
}
