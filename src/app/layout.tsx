import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThreadBoss — Your conversations, finally useful.",
  description: "ThreadBoss turns conversations into memory, plans and action.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
