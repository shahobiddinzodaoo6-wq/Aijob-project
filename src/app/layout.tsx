import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: "AIJob — AI-Powered Job Platform",
  description: "Find your dream job with Artificial Intelligence assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased mesh-bg bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
