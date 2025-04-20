import "./globals.css";
import type { Metadata } from "next";
import { aston } from "./fonts";
import { Providers } from "./providers";
import { ToastProvider } from "@/app/components/toast";
import { ClientToastContainer } from "@/app/components/toast";

export const metadata: Metadata = {
  title: "Aston Martin Korea | Test Drive Event Registration",
  description:
    "Experience the extraordinary with Aston Martin. Register for an exclusive test drive event and discover the perfect blend of power, beauty and soul.",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/favicon.ico" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={aston.variable} suppressHydrationWarning>
      <body className={aston.className}>
        <ToastProvider>
          <Providers>
            {children}
            <ClientToastContainer />
          </Providers>
        </ToastProvider>
      </body>
    </html>
  );
}
