// import { Inter } from "next/font/google";
// import "./globals.css";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

// export const metadata = {
//   title: "Build Beyond Studio LMS",
//   description: "Learning Management System — Build Beyond Studio",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" className={inter.variable}>
//       <body className="font-sans antialiased bg-bbs-off-white text-bbs-black">
//         {children}
//       </body>
//     </html>
//   );
// }

import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Build Beyond Studio LMS",
  description: "Learning Management System — Build Beyond Studio",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-bbs-off-white text-bbs-black">
        {children}
      </body>
    </html>
  );
}
