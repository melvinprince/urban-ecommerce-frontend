// File: components/admin/categories/CategoryAccordionItem.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
  Folder,
} from "lucide-react";

export default function CategoryAccordionItem({ category, onDelete, level }) {
  const [open, setOpen] = useState(false);
  const hasChildren =
    Array.isArray(category.children) && category.children.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header Row */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ paddingLeft: `${level * 20 + 16}px` }}
      >
        <div className="flex items-center gap-3">
          <Folder className="h-6 w-6 text-indigo-500" />
          <span className="text-xl font-medium text-gray-800">
            {category.name}
          </span>
          {/* Only show toggle if there are children */}
          {hasChildren && (
            <motion.button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              {open ? (
                <ChevronDown className="h-8 w-8 text-sgr hover:cursor-pointer" />
              ) : (
                <ChevronRight className="h-8 w-8 text-sgr hover:cursor-pointer" />
              )}
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Edit button */}
          <Link href={`/admin/categories/${category._id}/edit`}>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1 }}
              className="p-2 bg-gray-100 rounded-full transition"
            >
              <Pencil className="h-5 w-5 text-gray-600" />
            </motion.div>
          </Link>

          {/* Delete button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category._id);
            }}
            whileHover={{ scale: 1.1 }}
            className="p-2 bg-red-100 rounded-full transition"
          >
            <Trash2 className="h-5 w-5 text-red-600" />
          </motion.button>
        </div>
      </div>

      {/* Child Accordion (only rendered when `open === true`) */}
      <AnimatePresence initial={false}>
        {open && hasChildren && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-gray-200">
              {category.children.map((child) => (
                <CategoryAccordionItem
                  key={child._id}
                  category={child}
                  onDelete={onDelete}
                  level={level + 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
