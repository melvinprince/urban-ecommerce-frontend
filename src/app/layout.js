import "./globals.css";
import Header from "@/components/header/Header";
import GlobalPopup from "@/components/GlobalPopup";

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
