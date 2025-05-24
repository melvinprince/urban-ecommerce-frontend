"use client";

import { useEffect, useState } from "react";
import apiService from "@/lib/apiService"; // Updated import
import AddressFormModal from "./AddressFormModal";

export default function AddressSelector({ address, setAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await apiService.addresses.get();
      setAddresses(res.data);
    } catch (e) {
      console.error("❌ [AddressSelector] fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSelect = (addr) => {
    setAddress(addr);
  };

  return (
    <section className="border p-4 rounded">
      <h2 className="font-semibold mb-4">Choose a Shipping Address</h2>

      {loading ? (
        <p>Loading addresses…</p>
      ) : addresses.length === 0 ? (
        <div>
          <p>No saved addresses.</p>
          <button
            onClick={() => {
              setShowForm(true);
            }}
            className="text-blue-600 underline mt-2"
          >
            ➕ Add Address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr, i) => (
            <div
              key={i}
              onClick={() => handleSelect(addr)}
              className={`border rounded p-3 cursor-pointer ${
                address?.email === addr?.email
                  ? "border-blue-500 bg-blue-50"
                  : "hover:border-gray-400"
              }`}
            >
              <div className="font-semibold">
                {addr.label}{" "}
                {addr.isDefault && (
                  <span className="text-green-700 ml-2">(Default)</span>
                )}
              </div>
              <p>
                {addr.fullName} • {addr.phone}
              </p>
              <p>
                {addr.street}, {addr.city}
              </p>
              <p>
                {addr.postalCode}, {addr.country}
              </p>
            </div>
          ))}
          <button
            onClick={() => {
              setShowForm(true);
            }}
            className="text-blue-600 underline mt-2"
          >
            ➕ Add Another Address
          </button>
        </div>
      )}

      {showForm && (
        <AddressFormModal
          onClose={() => {
            setShowForm(false);
          }}
          onSuccess={async (newAddress) => {
            setAddresses((prev) => {
              return [...prev, newAddress];
            });
            setAddress(newAddress);
            setShowForm(false);
          }}
        />
      )}
    </section>
  );
}
