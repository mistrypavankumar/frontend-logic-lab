import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eli5Provider } from "@/components/Eli5";

export const metadata: Metadata = {
  title: "Frontend Logic Lab — Learn frontend by solving problems",
  description:
    "A beginner-friendly platform to learn frontend development through short theory and hands-on coding challenges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Eli5Provider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Eli5Provider>
      </body>
    </html>
  );
}
