// app/faq/page.jsx
"use client";

import { motion } from "framer-motion";

/* ───────────────── category map ───────────────── */
const CATS = {
  Orders: [
    [
      "How do I place an order?",
      "Simply add items to your cart, proceed to checkout, and follow the on-screen instructions.",
    ],
    [
      "Can I edit my order after checkout?",
      "Yes. Go to Profile → Orders, open the order and click Edit within 30 minutes of purchase.",
    ],
    [
      "How can I cancel my order?",
      "Open the order detail page and click Cancel. If the button is missing, the package has already left our warehouse.",
    ],
    [
      "Why was my order automatically cancelled?",
      "Unpaid orders expire after 24 hours. If you paid but still see a cancellation, contact support.",
    ],
    [
      "My order shows “Pending”. What does that mean?",
      "We have received your order but payment confirmation is still processing.",
    ],
  ],
  Shipping: [
    [
      "Which countries do you ship to?",
      "We currently ship to 42 countries across MENA, Europe, and North America.",
    ],
    [
      "Do you ship to PO Boxes?",
      "No. Please provide a physical address for courier delivery.",
    ],
    [
      "How long does standard delivery take?",
      "3–5 business days within Qatar, 5–10 days for GCC, and 7–14 days worldwide.",
    ],
    [
      "Is express shipping available?",
      "Yes, express (1–3 days) is shown at checkout if your ZIP code qualifies.",
    ],
    [
      "How do I track my shipment?",
      "Once your parcel is handed to the courier, you’ll receive an email with a live tracking link.",
    ],
  ],
  Payments: [
    [
      "Which payment methods do you accept?",
      "Visa, Mastercard, AMEX, Apple Pay, Google Pay, and PayPal.",
    ],
    [
      "Do you offer Cash on Delivery?",
      "Yes, COD is available in Qatar and the UAE for orders under 2000 QAR.",
    ],
    [
      "Why was my payment declined?",
      "Most declines are security-related. Double-check card details and ensure 3-D Secure is enabled.",
    ],
    [
      "Can I pay in instalments?",
      "We partner with Tabby for 4 interest-free instalments on orders ≥ 500 QAR.",
    ],
    [
      "When is my card charged?",
      "Your card is authorised at checkout and captured once the order ships.",
    ],
  ],
  Returns: [
    [
      "What is your return window?",
      "14 days from delivery, in original condition and packaging.",
    ],
    [
      "Are returns free?",
      "In Qatar returns are free; international customers pay return postage.",
    ],
    [
      "How do I create a return label?",
      "Log in → Orders → Return and download the auto-generated PDF label.",
    ],
    [
      "When will I get my refund?",
      "Within 5 business days after we receive and inspect your return.",
    ],
    [
      "Can I exchange instead of refund?",
      "Yes. Choose “Exchange” in the return portal to swap size or colour.",
    ],
  ],
  Account: [
    [
      "I forgot my password. What now?",
      "Click Forgot Password on the login page and follow the email link.",
    ],
    [
      "How do I delete my account?",
      "Email privacy@urban-ecommerce.com with the subject “Delete Account”.﻿",
    ],
    [
      "How do I change my default address?",
      "Go to Profile → Addresses → Set Default.",
    ],
    [
      "Can I save multiple payment methods?",
      "Yes, under Profile → Wallet you can add or remove cards securely.",
    ],
    [
      "How do I subscribe/unsubscribe from newsletters?",
      "Toggle the checkbox under Profile → Preferences.",
    ],
  ],
  "Coupons & Points": [
    [
      "Where do I enter a promo code?",
      "On the checkout page, expand the “Apply Coupon” field.",
    ],
    [
      "Can I stack multiple coupons?",
      "Only one coupon can be applied per order.",
    ],
    [
      "What is Thrive Rewards?",
      "Our loyalty programme where every 1 QAR spent = 1 point.",
    ],
    [
      "When do points expire?",
      "Points expire 12 months after they are earned.",
    ],
    [
      "How do I redeem points?",
      "In the cart, slide the “Use Points” toggle to apply available balance.",
    ],
  ],
  "Tech & Security": [
    [
      "Is my data encrypted?",
      "Yes, we use TLS 1.3 in transit and AES-256 at rest.",
    ],
    [
      "Do you sell my personal data?",
      "Never. See our Privacy Policy for full details.",
    ],
    [
      "Where are your servers located?",
      "Primary servers are in AWS Bahrain; backups in AWS Frankfurt.",
    ],
    [
      "Do you have 2-factor authentication?",
      "Yes, enable it under Profile → Security.",
    ],
    [
      "How can I report a security vulnerability?",
      "Email security@urban-ecommerce.com with steps to reproduce.",
    ],
  ],
  Support: [
    [
      "What are support hours?",
      "Sun-Thu 09:00-18:00 AST. Live chat is also available 24/7 for urgent queries.",
    ],
    [
      "Where can I view my support tickets?",
      "Go to Help & Support → View Support Tickets.",
    ],
    [
      "How fast will support respond?",
      "We reply within 12 hours; priority customers within 2 hours.",
    ],
    [
      "Can I attach images to a ticket?",
      "Yes, up to 10 MB per image, 5 images max.",
    ],
    [
      "Do you offer phone support?",
      "Currently we’re chat-first, but you can request a callback inside a ticket.",
    ],
  ],
  Products: [
    [
      "Are products authentic?",
      "100 % authentic, sourced directly from authorised distributors.",
    ],
    [
      "Are your prices VAT inclusive?",
      "All displayed prices include VAT unless stated otherwise.",
    ],
    [
      "The size I want is out of stock. What now?",
      "Click “Notify Me” on the product page—we’ll email when restocked.",
    ],
    [
      "Do you restock limited editions?",
      "Usually no. Limited editions are one-time drops.",
    ],
    [
      "How do I find my size?",
      "Each product page features a detailed size guide in centimetres and inches.",
    ],
  ],
  "Gift Cards": [
    [
      "Do you sell gift cards?",
      "Yes, digital gift cards from 100 QAR to 1 000 QAR.",
    ],
    [
      "How do I redeem a gift card?",
      "Enter the 16-digit code at checkout; unused balance remains on the card.",
    ],
    [
      "Can I refund a gift card?",
      "Gift cards are non-refundable once delivered to the recipient.",
    ],
    ["Do gift cards expire?", "They expire 24 months from date of purchase."],
    [
      "Can I use a gift card with a coupon?",
      "Yes, gift cards act as payment; coupons still apply.",
    ],
  ],
};

/* ───────────────────────────── component ───────────────────────────── */
export default function FAQPage() {
  return (
    <div className="min-h-[60vh] bg-sgr/50 py-12 px-6 md:px-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[3rem] mb-14 font-eulogy text-center text-gray-800"
      >
        Frequently Asked Questions
      </motion.h1>

      {Object.entries(CATS).map(([cat, faqs], idx) => (
        <section key={cat} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">{cat}</h2>

          <div
            className="grid gap-4
                          grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
          >
            {faqs.map(([q, a], i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx * 10 + i) * 0.015 }}
                className="group bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                <summary
                  className="cursor-pointer list-none select-none
                             px-6 py-4 flex justify-between items-center"
                >
                  <span className="font-medium text-lg text-gray-800">{q}</span>
                  <svg
                    className="h-5 w-5 text-gray-500 transition-transform
                               group-open:rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-5 pt-1 text-gray-700">{a}</div>
              </motion.details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
