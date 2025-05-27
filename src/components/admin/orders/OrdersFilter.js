"use client";

import { useState } from "react";

export default function OrdersFilter({ filters, setFilters }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = { email: "", status: "", isPaid: "" };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-4 mb-6 bg-gray-50 p-4 rounded"
    >
      <div>
        <label className="block font-semibold mb-1">Email</label>
        <input
          type="text"
          name="email"
          value={localFilters.email}
          onChange={handleChange}
          placeholder="Search by email"
          className="border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Status</label>
        <select
          name="status"
          value={localFilters.status}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Payment Status</label>
        <select
          name="isPaid"
          value={localFilters.isPaid}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply Filters
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
      >
        Reset
      </button>
    </form>
  );
}
