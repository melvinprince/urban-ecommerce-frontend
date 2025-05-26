"use client";

import CategoryRow from "./CategoryRow";
import { buildCategoryTree } from "./helpers";

export default function CategoryTable({ categories, onDelete }) {
  const tree = buildCategoryTree(categories);

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Slug</th>
            <th className="p-2 border">Products</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tree.length > 0 ? (
            tree.map((cat) => (
              <CategoryRow key={cat._id} category={cat} onDelete={onDelete} />
            ))
          ) : (
            <tr>
              <td className="p-2 border text-center" colSpan="3">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
