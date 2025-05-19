"use client";

import React, { forwardRef } from "react";
import Image from "next/image";

const TicketMessageThread = forwardRef(({ messages = [] }, ref) => {
  return (
    <div className="space-y-4 border p-4 rounded bg-gray-50">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-3 rounded ${
            msg.sender === "admin"
              ? "bg-blue-100 text-blue-800 text-right"
              : "bg-green-100 text-gray-700 text-left"
          }`}
        >
          <div className="text-sm font-medium">
            {msg.sender === "admin" ? "Support Team" : "You"}
          </div>
          <div className="mt-1 whitespace-pre-wrap">{msg.text}</div>

          {msg.attachments?.length > 0 && (
            <div className="mt-2 space-y-1 text-xs">
              {msg.attachments.map((file, idx) => (
                <div key={idx}>
                  {file.type === "image" ? (
                    <img
                      src={file.url}
                      alt="Attachment"
                      className="max-w-xs rounded"
                    />
                  ) : file.type === "pdf" ? (
                    <a
                      href={file.url}
                      target="_blank"
                      className="underline text-blue-700"
                    >
                      📄 PDF Attachment
                    </a>
                  ) : (
                    <video controls className="max-w-xs rounded">
                      <source src={file.url} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div ref={ref} />
    </div>
  );
});

TicketMessageThread.displayName = "TicketMessageThread";

export default TicketMessageThread;
