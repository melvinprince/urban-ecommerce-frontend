import OrderLookupForm from "@/components/orders/OrderLookupForm";

export default function HelpSupportPage() {
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Help & Support</h1>

      <div className="mb-6">
        <p className="text-gray-700">
          <strong>Registered Users:</strong> Please{" "}
          <a
            href="/user/profile/orders"
            className="text-blue-600 underline hover:text-blue-800"
          >
            log in
          </a>{" "}
          to view your full order history.
        </p>
      </div>

      <OrderLookupForm />
    </div>
  );
}
