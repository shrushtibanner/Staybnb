import "./globals.css";

export const metadata = {
  title: "Staybnb",
  description: "Find apartments, private homes, and memorable city stays."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
