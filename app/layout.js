import "./globals.css";

export const metadata = {
  title: "ITRC Treasury Dashboard",
  description: "Illinois Tech Railroad Club treasury and donations dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
