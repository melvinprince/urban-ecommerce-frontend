import "./globals.css";
import Header from "@/components/header/Header";
import GlobalPopup from "@/components/GlobalPopup";
import SmoothScrollProvider from "@/lib/SmoothScrollProvider";
import Footer from "@/components/footer/Footer";

export const metadata = {};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Header />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <GlobalPopup />
        <Footer />
      </body>
    </html>
  );
}
