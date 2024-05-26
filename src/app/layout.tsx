import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Providers } from "./provider";
import Navbar from "@/components/navbar";
import { Recursive } from "next/font/google";
import Footer from "@/components/footer";
import ReactQueryProvider from "./query-provider";
import { ThemeProvider } from "@/components/theme-provider";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WingsInProgress",
  description:
    "Effortlessly track your flights and analyze your progress with WingsInProgress, your all-in-one digital logbook.",
  keywords:
    "flight logger, pilot logbook, digital logbook, flight data, aviation, pilot training, flight analysis, flight tracking, #pilotlife, #avgeek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${recursive.className} flex flex-col min-h-screen`}>
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
