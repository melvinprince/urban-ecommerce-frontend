"use client";

export default function SummaryCards({ data }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white border p-4 rounded shadow">
        <h3 className="text-sm font-semibold text-gray-500">Total Orders</h3>
        <p className="text-2xl font-bold">{data.totalOrders}</p>
      </div>
      <div className="bg-white border p-4 rounded shadow">
        <h3 className="text-sm font-semibold text-gray-500">Pending Orders</h3>
        <p className="text-2xl font-bold">{data.pendingOrders}</p>
      </div>
      <div className="bg-white border p-4 rounded shadow">
        <h3 className="text-sm font-semibold text-gray-500">Paid Orders</h3>
        <p className="text-2xl font-bold">{data.paidOrders}</p>
      </div>
      <div className="bg-white border p-4 rounded shadow">
        <h3 className="text-sm font-semibold text-gray-500">Revenue Today</h3>
        <p className="text-2xl font-bold">{data.revenueToday.toFixed(2)} QAR</p>
      </div>
    </div>
  );
}
