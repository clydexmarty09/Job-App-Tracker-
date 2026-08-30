import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets:["latin"]
}); 

export const metadata: Metadata = {
  title: "Job App Tracker",
  description: "Track and manage job applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jetbrains.className}>
        <div className="mx-auto flex w-full max-w-6xl justify-end px-4 pt-4">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
