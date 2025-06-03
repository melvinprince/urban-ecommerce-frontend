// app/user/help-support/page.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import OrderLookupForm from "@/components/orders/OrderLookupForm";
import ConfirmModal from "@/components/common/ConfirmModal"; // keeps portal pattern

export default function HelpSupportPage() {
  return (
    <div className="min-h-[60vh] bg-sgr/50 py-12 px-6 md:px-20 flex flex-col items-center justify-center">
      {/* confirm portal if other parts of the UI need it */}
      <ConfirmModal />

      {/* hero card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10 space-y-10"
      >
        {/* heading */}
        <header className="text-center space-y-3">
          <h1 className="text-[5rem] font-eulogy text-gray-800">
            Help&nbsp;&amp;&nbsp;Support
          </h1>
          <p className="text-gray-600 text-xl">
            Track your order, review tickets, or reach our support team.
          </p>
        </header>

        {/* info for registered users */}
        <p className="bg-blue-50 rounded-xl text-lg p-4 text-gray-700 text-center">
          <strong className="font-semibold">Registered user?</strong>&nbsp;{" "}
          <Link
            href="/user/profile/orders"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Log in to your account
          </Link>{" "}
          to see your full order history.
        </p>

        {/* order lookup form */}
        <OrderLookupForm />

        {/* tickets */}
        <div className="text-center pt-6">
          <Link href="/user/tickets">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-sgr hover:bg-ogr text-white px-8 py-3 transition-all text-xl font-semibold shadow-lg mx-auto"
            >
              Support Tickets
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
