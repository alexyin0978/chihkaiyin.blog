import "./globals.css";
import { Inter, DM_Sans } from "next/font/google";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

import { ThemeProvider } from "./ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Overreacted",
  description: "A blog build by Yin Chih Kai",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-dark_main">
        <ThemeProvider>
          <div
            id="app"
            className="max-w-pageMax mx-auto bg-white dark:bg-main_dark text-content dark:text-content_dark"
          >
            <Nav />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
