// app/info/shipping/page.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ShippingInfoPage() {
  return (
    <div className="min-h-[60vh] bg-sgr/50 py-12 px-6 md:px-20">
      <motion.article
        /* global type scale ≈ 40 % larger */
        style={{ fontSize: "1.4em" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="prose prose-slate lg:prose-lg mx-auto bg-white rounded-3xl shadow-lg p-10"
      >
        <h1 className="font-eulogy mb-4">Shipping&nbsp;Information</h1>

        <p className="lead">
          Below you’ll find everything you need to know about Urban E-commerce’s
          shipping methods, costs, and timelines. If you still have questions,
          please open a{" "}
          <Link href="/user/tickets" className="underline">
            support ticket
          </Link>
          .
        </p>

        {/* 1 */}
        <h2>1. Processing Times</h2>
        <ul>
          <li>
            <strong>In-stock items:</strong> ship within <em>1 business day</em>
            .
          </li>
          <li>
            <strong>Custom/Personalised items:</strong> 3–5 business days before
            dispatch.
          </li>
          <li>
            Orders placed after&nbsp;<strong>17:00 AST</strong> are processed
            the next business day.
          </li>
        </ul>

        {/* 2 */}
        <h2>2. Domestic Shipping (Qatar)</h2>
        <p>
          Standard delivery is&nbsp;<strong>free</strong> on orders &gt; 200 QAR
          and reaches most addresses in 3 – 5 business days. Express (1–2 days)
          is available for 35 QAR.
        </p>

        {/* 3 */}
        <h2>3. GCC Shipping</h2>
        <table>
          <thead>
            <tr>
              <th>Destination</th>
              <th>Std&nbsp;(5 – 7&nbsp;days)</th>
              <th>Express&nbsp;(2 – 3&nbsp;days)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UAE, KSA, Oman, Bahrain</td>
              <td>40 QAR</td>
              <td>95 QAR</td>
            </tr>
            <tr>
              <td>Kuwait</td>
              <td>50 QAR</td>
              <td>110 QAR</td>
            </tr>
          </tbody>
        </table>

        {/* 4 */}
        <h2>4. International Shipping</h2>
        <p>
          We ship to 42 countries worldwide via DHL Express. Rates are
          calculated at checkout based on weight &amp; destination. Estimated
          delivery: 7 – 14 days.
        </p>

        {/* 5 */}
        <h2>5. Customs &amp; Duties</h2>
        <p>
          Import duties and taxes are <strong>not</strong> included for
          international orders unless “DDP” appears at checkout. Couriers will
          collect duties before delivery. Refused shipments are returned at the
          customer’s expense.
        </p>

        {/* 6 */}
        <h2>6. Tracking</h2>
        <ul>
          <li>
            You’ll receive an email with a live tracking link once your parcel
            leaves our warehouse.
          </li>
          <li>
            Tracking may take up to 12 hours to display movement after the label
            is created.
          </li>
          <li>
            Use our&nbsp;
            <Link href="/help-support" className="underline">
              Help &amp; Support
            </Link>{" "}
            section to track by order-ID or email.
          </li>
        </ul>

        {/* 7 */}
        <h2>7. Lost or Stalled Packages</h2>
        <p>
          If tracking hasn’t updated for 7 days (domestic) or 14 days
          (international), open a ticket — we’ll file an investigation with the
          carrier. Lost parcels are either replaced or refunded in full.
        </p>

        {/* 8 */}
        <h2>8. PO Boxes &amp; APO/FPO</h2>
        <p>
          Couriers require a physical address; we cannot ship to PO Boxes or
          military APO/FPO addresses at this time.
        </p>

        {/* 9 */}
        <h2>9. Split Shipments</h2>
        <p>
          To speed up delivery, items may ship from multiple hubs. You’ll get
          separate tracking numbers at no extra cost.
        </p>

        {/* 10 */}
        <h2>10. Holiday Cut-off Dates</h2>
        <p>
          During Eid, Black Friday, and December peak season, order by the
          published cut-off dates on our homepage banner to guarantee delivery
          before the holiday.
        </p>

        <footer className="pt-6 border-t">
          <p className="text-gray-500 text-sm">
            Last updated: 3&nbsp;June&nbsp;2025 &nbsp;|&nbsp;{" "}
            <Link
              href="/legal/terms-of-service"
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Terms of Service
            </Link>{" "}
            &nbsp;|&nbsp;{" "}
            <Link
              href="/legal/privacy-policy"
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </footer>
      </motion.article>
    </div>
  );
}
