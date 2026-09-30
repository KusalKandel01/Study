import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Study Command Center', description: 'Focus. Finish. Repeat.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@700;800&family=Montserrat:wght@800;900&family=Bebas+Neue&family=Anton&family=Unbounded:wght@700;800&family=Bangers&family=Nunito:wght@800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
