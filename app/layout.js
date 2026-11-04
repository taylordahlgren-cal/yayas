import "./globals.css";
import Providers from "@/components/Providers";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Yayas 🐾",
  description: "Where my dogs go to get their yayas out.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Providers>
          <NavBar />
          <main className="max-w-3xl mx-auto px-4 py-6 pb-24">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
