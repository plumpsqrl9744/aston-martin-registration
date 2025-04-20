"use client";

import dynamic from "next/dynamic";

// 클라이언트 측에서만 렌더링되는 ToastContainer
const ClientToastContainer = dynamic(
  () => import("./ToastContainer").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export default function ClientToast() {
  return <ClientToastContainer />;
}
