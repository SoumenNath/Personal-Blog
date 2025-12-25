import "./globals.css";
import NavBar from "./components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <NavBar />
        <main className="pt-6">{children}</main>
      </body>
    </html>
  );
}
