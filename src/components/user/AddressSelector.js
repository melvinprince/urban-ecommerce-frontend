// components/user/AddressSelector.jsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { createPortal } from "react-dom";

import apiService from "@/lib/apiService";
import AddressFormModal from "./AddressFormModal";
import SvgIcon from "../common/SvgIcon";

/* — tunables — */
const CARD_HOVER_TILT = 4;
const CARD_TAP_SCALE = 0.98;
const PAGE_FADE_MS = 0.45;
const ITEMS_PER_PAGE = 3;

/* skeleton */
const Skeleton = () => (
  <div className="h-24 w-full rounded-xl bg-gray-200/60 animate-pulse" />
);

/* helper assigns id if missing */
const normalizeIds = (arr) =>
  arr.map((a, i) => ({
    ...a,
    _id: a._id ?? a.id ?? `fallback-${i}`,
  }));

export default function AddressSelector({
  address,
  setAddress,
  type = "user",
}) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(addresses.length / ITEMS_PER_PAGE);

  /* ---------- fetch addresses ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiService.addresses.get();
        setAddresses(normalizeIds(data));
      } catch (err) {
        console.error("[AddressSelector] fetch failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- helpers ---------- */
  const handleSelect = (addr) => setAddress(addr);
  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  const paginated =
    type === "checkout"
      ? addresses.slice(
          page * ITEMS_PER_PAGE,
          page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      : addresses;

  /* ---------- render ---------- */
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl border border-gray-200 p-6 bg-white/30 backdrop-blur-lg shadow-xl"
      >
        {/* decorative blob */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.4, opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-tr from-ogr to-indigo-400 rounded-full blur-3xl"
        />

        <h2 className="text-3xl font-semibold mb-5 text-gray-800">
          {type === "checkout" ? "Choose a Shipping Address" : "Your Addresses"}
        </h2>

        {/* ---------- loading ---------- */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        )}

        {/* ---------- empty ---------- */}
        {!loading && addresses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-700 space-y-2"
          >
            <p>No saved addresses.</p>
          </motion.div>
        )}

        {/* ---------- list ---------- */}
        {!loading && addresses.length > 0 && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: PAGE_FADE_MS }}
                className="space-y-4"
              >
                {paginated.map((addr) => {
                  const selected = address?._id === addr._id;
                  return (
                    <motion.div
                      key={addr._id}
                      whileHover={{ rotateY: CARD_HOVER_TILT }}
                      whileTap={{ scale: CARD_TAP_SCALE }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 18,
                      }}
                      onClick={() => handleSelect(addr)}
                      className={clsx(
                        "relative rounded-2xl p-4 cursor-pointer bg-white",
                        selected
                          ? "border-2 border-indigo-500 ring-4 ring-indigo-200/30"
                          : "border border-gray-300 hover:border-indigo-300"
                      )}
                    >
                      {selected && (
                        <span className="absolute top-3 right-3 text-indigo-600">
                          <SvgIcon
                            src="/svg/checkbox.svg"
                            width={24}
                            height={24}
                          />
                        </span>
                      )}

                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-md text-green-500 pl-4">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm md:text-base text-gray-600">
                        {addr.fullName} • {addr.phone}
                      </p>
                      <p className="text-sm md:text-base text-gray-600">
                        {addr.street}, {addr.city}
                      </p>
                      <p className="text-sm md:text-base text-gray-600">
                        {addr.postalCode}, {addr.country}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* ---------- pagination ---------- */}
            {type === "checkout" && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-between"
              >
                <PageBtn
                  disabled={page === 0}
                  onClick={handlePrev}
                  dir="left"
                />
                <span className="text-sm text-gray-600">
                  Page {page + 1} / {totalPages}
                </span>
                <PageBtn
                  disabled={page === totalPages - 1}
                  onClick={handleNext}
                  dir="right"
                />
              </motion.div>
            )}
          </>
        )}

        {/* ---------- add link ---------- */}
        {!loading && (
          <motion.button
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="mt-5 inline-flex items-center gap-1 text-lg font-medium text-indigo-600 hover:text-indigo-800"
          >
            <SvgIcon src="/svg/plus.svg" width={16} height={16} />
            {type === "checkout" ? "Add Another Address" : "Add Address"}
          </motion.button>
        )}
      </motion.section>

      {/* ---------- modal ---------- */}
      {showForm &&
        typeof window !== "undefined" &&
        createPortal(
          <AddressFormModal
            initialData={null}
            onClose={() => setShowForm(false)}
            onSuccess={(newAddr) => {
              setAddresses((prev) => [...prev, ...normalizeIds([newAddr])]);
              setAddress(newAddr);
              setShowForm(false);
            }}
          />,
          document.body
        )}
    </>
  );
}

/* pagination arrow */
function PageBtn({ disabled, onClick, dir }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      className={clsx(
        "w-12 h-12 flex items-center justify-center rounded-full border",
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "bg-sgr hover:bg-ogr text-white shadow"
      )}
    >
      <SvgIcon
        src={dir === "left" ? "/svg/angleLeft.svg" : "/svg/angleRight.svg"}
        width={16}
        height={16}
      />
    </motion.button>
  );
}
