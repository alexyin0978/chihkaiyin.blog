import "./globals.css";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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
      <body className="bg-main_dark">
        <div
          id="app"
          className="relative max-w-pageMax mx-auto w-full pt-11 px-5 h-full min-h-screen"
        >
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
