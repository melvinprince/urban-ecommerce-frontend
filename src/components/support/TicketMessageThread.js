// File: components/support/TicketMessageThread.jsx
"use client";

import React, { forwardRef } from "react";
import Link from "next/link";

const TicketMessageThread = forwardRef(({ messages = [] }, ref) => {
  return (
    <div className="space-y-6">
      {messages.map((msg, i) => {
        const isAdmin = msg.sender === "admin";
        return (
          <div
            key={i}
            className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                isAdmin
                  ? "bg-sgr text-white text-right"
                  : "bg-white text-gray-800 text-left"
              } shadow`}
            >
              <div className="text-xl font-semibold">
                {isAdmin ? "Support Team" : "You"}
              </div>
              <div className="mt-2 text-2xl whitespace-pre-wrap">
                {msg.text}
              </div>

              {msg.attachments?.length > 0 && (
                <div className="mt-3 space-y-2 text-sm">
                  {msg.attachments.map((file, idx) => (
                    <div key={idx}>
                      {file.type === "image" ? (
                        <Link
                          href={file.url}
                          target="_blank"
                          className="inline-block bg-white border border-gray-300 rounded p-2"
                        >
                          View Image
                        </Link>
                      ) : file.type === "pdf" ? (
                        <Link
                          href={file.url}
                          target="_blank"
                          className="inline-block text-blue-700 underline"
                        >
                          📄 PDF Attachment
                        </Link>
                      ) : (
                        <Link
                          href={file.url}
                          target="_blank"
                          className="inline-block bg-white border border-gray-300 rounded p-2"
                        >
                          ▶️ Video
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={ref} />
    </div>
  );
});

TicketMessageThread.displayName = "TicketMessageThread";

export default TicketMessageThread;
