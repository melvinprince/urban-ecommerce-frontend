"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import apiService from "@/lib/apiService";
import usePopupStore from "@/store/popupStore";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading'
  const showSuccess = usePopupStore((state) => state.showSuccess);
  const showError = usePopupStore((state) => state.showError);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showError("Email is required.");
      return;
    }

    setStatus("loading");

    try {
      await apiService.newsletter.subscribe({ email });
      showSuccess("Thank you for subscribing!");
      setEmail("");
    } catch (err) {
      const msg =
        err.response?.message || err.message || "Subscription failed.";
      showError(msg);
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div>
      {/* Newsletter Signup */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className="flex flex-col space-y-3 max-w-[70%] mx-auto"
      >
        <h3 className="text-5xl font-eulogy text-white mb-2">
          Join Our Newsletter
        </h3>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-2 mt-[2rem]"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="px-4 py-2 rounded-md bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sgr transition-shadow duration-200 h-[4rem]"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 bg-sgr hover:bg-sgr/50 text-black text-xl py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
