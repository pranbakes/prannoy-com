import type { Metadata } from "next";
import SiteChrome from "@/components/site-chrome";

const description =
  "Prannoy Nambiar builds platforms where people learn and earn, writes essays on whether they work, and publishes poems.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://prannoy.com"
  ),
  title: {
    default: "Prannoy Nambiar",
    template: "%s · Prannoy Nambiar",
  },
  description,
  openGraph: {
    title: "Prannoy Nambiar",
    description,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://prannoy.com",
    siteName: "Prannoy Nambiar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prannoy Nambiar",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteChrome>{children}</SiteChrome>;
}
