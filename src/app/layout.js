import GlobalPopup from "@/components/GlobalPopup";
import Header from "@/components/header/Header";
import "./globals.css";

export const metadata = {};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <GlobalPopup />
      </body>
    </html>
  );
}
