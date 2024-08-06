import { Inter } from "next/font/google";
import "./globals.css";
import "./style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Met Museum Art Gallery",
  description: "A React app created by Rebecca King",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <h1>Met Museum Art Gallery</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
