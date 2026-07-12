import type { Metadata } from "next";
import SiteChrome from "@/components/site-chrome";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://prannoy.com"
  ),
  title: "Prannoy Nambiar",
  description: "Essays, poems, a curated inspiration board, and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteChrome>{children}</SiteChrome>;
}
