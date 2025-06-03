// app/legal/privacy-policy/page.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-[60vh] bg-sgr/50 py-12 px-6 md:px-20">
      <motion.article
        /* 40 % larger base font ↓ */
        style={{ fontSize: "1.4em" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="prose prose-slate lg:prose-lg mx-auto bg-white rounded-3xl shadow-lg p-10"
      >
        <h1 className="font-eulogy mb-4">Privacy Policy</h1>

        <p className="lead">
          Your privacy matters. This document explains what data Urban
          E-commerce (“we,” “us,” “our”) collects, why we collect it, and how we
          safeguard it.
        </p>

        {/* 1 */}
        <h2>1. Information We Collect</h2>
        <ul>
          <li>
            <strong>Account Data </strong>— name, email, password hash, phone
            number, addresses you save.
          </li>
          <li>
            <strong>Order Data </strong>— products, payment method (token only),
            shipping details, invoices.
          </li>
          <li>
            <strong>Usage Data </strong>— pages visited, device type, locale,
            browser, referring URL, and anonymised analytics IDs.
          </li>
          <li>
            <strong>Support Data </strong>— chat transcripts, tickets,
            attachments you send to our support team.
          </li>
        </ul>

        {/* 2 */}
        <h2>2. How We Use Your Information</h2>
        <ol>
          <li>To process and deliver your orders.</li>
          <li>To provide personalised product recommendations.</li>
          <li>To improve site performance and detect fraud.</li>
          <li>To send service emails (e.g. order updates, password resets).</li>
          <li>
            With your consent, to send marketing emails (you can opt-out any
            time).
          </li>
        </ol>

        {/* 3 */}
        <h2>3. Cookies &amp; Tracking</h2>
        <p>
          We use first-party cookies for authentication and cart persistence,
          plus third-party cookies (Stripe, Google Analytics). You can disable
          cookies in your browser, but parts of the site may break.
        </p>

        {/* 4 */}
        <h2>4. How We Share Data</h2>
        <p>We never sell your data. We only share minimal information with:</p>
        <ul>
          <li>
            Payment processors (Stripe, PayPal) — to authorise transactions.
          </li>
          <li>
            Logistics partners (DHL, Aramex) — shipping label + phone +
            destination.
          </li>
          <li>Cloud vendors (Vercel, AWS S3) — secure hosting and storage.</li>
        </ul>

        {/* 5 */}
        <h2>5. Data Retention</h2>
        <p>
          Order records are retained for 7 years to comply with accounting
          regulations. Support tickets are kept for 24 months, or sooner at your
          request.
        </p>

        {/* 6 */}
        <h2>6. Your Rights</h2>
        <ul>
          <li>Access the data we hold about you.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Object to processing or request portability (EU/UK GDPR).</li>
        </ul>
        <p>
          Email&nbsp;
          <a href="mailto:privacy@urban-ecommerce.com">
            privacy@urban-ecommerce.com
          </a>{" "}
          with your request — we’ll respond within 30 days.
        </p>

        {/* 7 */}
        <h2>7. Security</h2>
        <p>
          Traffic is encrypted via TLS 1.3. Sensitive data is encrypted at rest.
          We follow OWASP top-10 guidelines, perform annual penetration tests,
          and operate a responsible disclosure programme.
        </p>

        {/* 8 */}
        <h2>8. Children</h2>
        <p>
          Urban E-commerce is not directed to children under 13. If we learn
          we’ve collected personal data from a child, we’ll delete it.
        </p>

        {/* 9 */}
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this policy. Material changes will be announced via
          email or an in-app banner. The “Last updated” date below indicates the
          current version.
        </p>

        {/* 10 */}
        <h2>10. Contact Us</h2>
        <p>
          Questions? Reach our Data Protection Officer at&nbsp;
          <a href="mailto:dpo@urban-ecommerce.com">dpo@urban-ecommerce.com</a>.
        </p>

        <footer className="pt-6 border-t">
          <p className="text-gray-500 text-sm">
            Last updated: 3 June 2025 &nbsp;|&nbsp;{" "}
            <Link
              href="/legal/terms-of-service"
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Terms of Service
            </Link>
          </p>
        </footer>
      </motion.article>
    </div>
  );
}
