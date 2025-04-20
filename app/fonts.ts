import localFont from "next/font/local";

export const aston = localFont({
  src: [
    {
      path: "../fonts/AstonMartinSansMedium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/AstonMartinSansMedium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/AstonMartinSansMedium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-aston",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});
