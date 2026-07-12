import { ebGaramond, inter, caveat } from "@/lib/fonts";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "@/styles/globals.css";

export default function SiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${inter.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
