"use client";

import { motion } from "framer-motion";

export default function ShippingForm({ address, onChange }) {
  const fields = [
    "fullName",
    "email",
    "phone",
    "street",
    "city",
    "postalCode",
    "country",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-gray-200 p-8 bg-white/60 backdrop-blur-sm"
    >
      <h2 className="text-lg font-semibold mb-6">Shipping Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((name) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: fields.indexOf(name) * 0.03 }}
            className="flex flex-col"
          >
            <label className="mb-1 font-medium capitalize text-sm">
              {name.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={name}
              value={address[name] || ""}
              onChange={onChange}
              className="rounded-xl border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-ogr/60 transition"
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
