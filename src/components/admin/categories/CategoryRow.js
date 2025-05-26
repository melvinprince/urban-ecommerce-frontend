import Link from "next/link";

export default function CategoryRow({ category, level = 0, onDelete }) {
  return (
    <>
      <tr>
        <td className="p-2 border">
          <span style={{ marginLeft: `${level * 20}px` }}>
            {level > 0 && "↳ "}
            {category.name}
          </span>
        </td>
        <td className="p-2 border">{category.slug}</td>
        <td className="p-2 border">{category.productCount || 0}</td>
        <td className="p-2 border">
          <Link
            href={`/admin/categories/${category._id}/edit`}
            className="text-blue-600 mr-2"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(category._id)}
            className="text-red-600"
          >
            Delete
          </button>
        </td>
      </tr>
      {category.children?.map((child) => (
        <CategoryRow
          key={child._id}
          category={child}
          level={level + 1}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
