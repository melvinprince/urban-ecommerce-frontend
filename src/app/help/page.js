import OrderLookupForm from "@/components/orders/OrderLookupForm";
import Link from "next/link";

export default function HelpSupportPage() {
  return (
    <>
      <div className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Help & Support</h1>

        <div className="mb-6">
          <p className="text-gray-700">
            <strong>Registered Users:</strong> Please{" "}
            <Link
              href="/user/profile/orders"
              className="text-blue-600 underline hover:text-blue-800"
            >
              log in
            </Link>{" "}
            to view your full order history.
          </p>
        </div>

        <OrderLookupForm />
      </div>
      <div>
        <Link href="/user/tickets">
          <button className="bg-ogr text-white px-4 py-2 rounded">
            View Support Tickets
          </button>
        </Link>
      </div>
    </>
  );
}
