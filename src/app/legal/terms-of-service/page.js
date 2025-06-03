// app/legal/terms/page.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-[60vh] bg-sgr/50 py-12 px-6 md:px-20">
      <motion.article
        /* base font ≈ 40 % larger */
        style={{ fontSize: "1.4em" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="prose prose-slate lg:prose-lg mx-auto bg-white rounded-3xl shadow-lg p-10"
      >
        <h1 className="font-eulogy mb-4">Terms&nbsp;of&nbsp;Service</h1>

        <p className="lead">
          Welcome to Urban E-commerce (“we,” “our,” “us”). By accessing or using
          our website, mobile app, or any related services (collectively, the
          “Platform”), you agree to the following terms. If you do not accept
          these terms, please do not use the Platform.
        </p>

        {/* 1 */}
        <h2>1. Account Registration</h2>
        <ul>
          <li>You must be at least 18 years old to create an account.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activities under your account.
          </li>
          <li>
            We may suspend or terminate accounts that violate these terms or
            engage in fraudulent behaviour.
          </li>
        </ul>

        {/* 2 */}
        <h2>2. Orders &amp; Payment</h2>
        <ol>
          <li>
            All prices are listed in QAR and include applicable VAT unless
            stated otherwise.
          </li>
          <li>
            We reserve the right to cancel any order for reasons including
            inventory errors, pricing mistakes, or suspected fraud.
          </li>
          <li>
            Payment is captured securely via third-party processors (Stripe,
            PayPal). We never store raw card details.
          </li>
        </ol>

        {/* 3 */}
        <h2>3. Shipping &amp; Delivery</h2>
        <p>
          Standard delivery times and fees are displayed at checkout. Estimated
          dates are not guaranteed. Customs duties (if any) are the customer’s
          responsibility.
        </p>

        {/* 4 */}
        <h2>4. Returns &amp; Refunds</h2>
        <p>
          You may return most items within 14&nbsp;days of receipt for a full
          refund, provided they are unused and in original packaging. Digital
          goods and perishable items are non-refundable. See our{" "}
          <Link href="/help/returns" className="underline">
            Returns Policy
          </Link>{" "}
          for full details.
        </p>

        {/* 5 */}
        <h2>5. Intellectual Property</h2>
        <p>
          All content on the Platform — including logos, product images,
          graphics, and text — is owned by Urban E-commerce or its licensors.
          You may not reproduce, distribute, or create derivative works without
          explicit permission.
        </p>

        {/* 6 */}
        <h2>6. User-Generated Content</h2>
        <ul>
          <li>
            Reviews, comments, or uploads must be lawful, respectful, and free
            of malicious code.
          </li>
          <li>
            By posting content, you grant us a worldwide, royalty-free licence
            to display and re-use it in marketing materials.
          </li>
        </ul>

        {/* 7 */}
        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Urban E-commerce is not liable
          for indirect, incidental, or consequential damages arising from your
          use of the Platform. Our total aggregate liability shall not exceed
          the amount you paid for the relevant order.
        </p>

        {/* 8 */}
        <h2>8. Indemnification</h2>
        <p>
          You agree to defend and indemnify us against all claims, damages, and
          expenses arising from your breach of these terms or misuse of the
          Platform.
        </p>

        {/* 9 */}
        <h2>9. Governing Law &amp; Disputes</h2>
        <p>
          These terms are governed by the laws of the State of Qatar. Any
          dispute that cannot be resolved amicably shall be submitted to the
          exclusive jurisdiction of the courts of Doha, Qatar.
        </p>

        {/* 10 */}
        <h2>10. Changes to These Terms</h2>
        <p>
          We may modify these Terms of Service at any time. Material changes
          will be notified via email or an in-app banner. Continued use of the
          Platform after changes constitute acceptance.
        </p>

        {/* 11 */}
        <h2>11. Contact</h2>
        <p>
          Questions? Email&nbsp;
          <a href="mailto:legal@urban-ecommerce.com">
            legal@urban-ecommerce.com
          </a>
          .
        </p>

        <footer className="pt-6 border-t">
          <p className="text-gray-500 text-sm">
            Last updated: 3&nbsp;June&nbsp;2025 &nbsp;|&nbsp;{" "}
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
