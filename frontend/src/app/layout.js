import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sentika",
  description: "Sentika - Real-time Indonesian Sentiment Analysis",
  icons: {
    shortcut: "/favicon.svg",
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Sentika",
    description: "Real-time Indonesian Sentiment Analysis",
    url: "https://sentika.site",
    siteName: "Sentika",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
