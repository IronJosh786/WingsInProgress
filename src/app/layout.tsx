import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Providers } from "./provider";
import Navbar from "@/components/navbar";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";
import ReactQueryProvider from "./query-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WingsInProgress",
  description: "Log your flight details",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors position="top-center" />
              <Navbar />
              {children}
              <Footer />
            </ThemeProvider>
          </ReactQueryProvider>
        </Providers>
      </body>
    </html>
  );
}
