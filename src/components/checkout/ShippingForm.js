"use client";
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
    <section className="border p-4 rounded">
      <h2 className="font-semibold mb-4">Shipping Information</h2>
      <div className="grid grid-cols-1 gap-4">
        {fields.map((name) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 font-medium capitalize">
              {name.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={name}
              value={address[name]}
              onChange={onChange}
              className="border rounded p-2"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
