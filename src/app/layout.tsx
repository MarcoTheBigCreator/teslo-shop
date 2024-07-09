import type { Metadata } from 'next';
import { inter } from '@/config/fonts';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { PaypalProviders, ToasterProviders } from '@/components';

export const metadata: Metadata = {
  title: {
    template: '%s - Teslo | Shop',
    default: 'Home - Teslo | Shop',
  },
  description: 'Una tienda virtual de productos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProviders>
          <PaypalProviders>{children}</PaypalProviders>
        </ToasterProviders>
        <Analytics />
      </body>
    </html>
  );
}
