"use client";

import { useEffect } from "react";
import PopupAlert from "@/components/PopupAlert";
import usePopupStore from "@/store/popupStore";

export default function GlobalPopup() {
  const { message, type, clear } = usePopupStore();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clear();
      }, 3000); // auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, clear]);

  if (!message) return null;

  return <PopupAlert type={type} message={message} onClose={clear} />;
}
