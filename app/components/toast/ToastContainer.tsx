"use client";

import { useEffect, useState } from "react";
import { useToast } from "./ToastContext";

export const ToastContainer = () => {
  const { toasts, hideToast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted || toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-4 pointer-events-none flex justify-center items-start z-[9999]">
      <div className="flex flex-col items-center space-y-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              w-auto
              min-w-[200px]
              max-w-md
              px-6 py-4 rounded-md shadow-xl
              transform transition-all duration-300 ease-in-out
              border-l-4
              backdrop-filter backdrop-blur-md bg-opacity-95
              ${
                toast.type === "success"
                  ? "bg-[#00665e] text-white border-[#00897b]"
                  : toast.type === "error"
                  ? "bg-white text-red-800 border-red-600"
                  : toast.type === "warning"
                  ? "bg-white text-amber-800 border-amber-600"
                  : "bg-[#00665e] text-white border-[#00897b]"
              }
            `}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {toast.type === "success" && (
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {toast.type === "error" && (
                  <svg
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {toast.type === "warning" && (
                  <svg
                    className="h-5 w-5 text-amber-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {toast.type === "info" && (
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h.01a1 1 0 000-2H9z"
                      clipRule="evenodd"
                    />
                    <path d="M9 13h2v2H9v-2z" />
                  </svg>
                )}
              </div>
              <div className="ml-3 whitespace-normal">
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => hideToast(toast.id)}
                    className="inline-flex rounded-md p-1.5 text-gray-100 hover:bg-[#005349] focus:outline-none"
                  >
                    <span className="sr-only">닫기</span>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
