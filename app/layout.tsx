import "./globals.css";
import { Inter, DM_Sans } from "next/font/google";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// import { ThemeProvider } from "./ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "YIN",
  description: "A blog built by ChihKai Yin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-main_dark dark:bg-dark_main">
        {/* <ThemeProvider> */}
        <div
          id="app"
          className="relative max-w-pageMax mx-auto w-full pt-11 px-5 h-full min-h-screen"
        >
          <Nav />
          {children}
          <Footer />
        </div>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
