'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import Link from 'next/link';
import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <QueryClientProvider client={queryClient}>
          <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">
                <Link href="/">OLX</Link>
              </h1>
              <nav>
                <Link href="/" className="mr-4">Home</Link>
                <Link href="/createProduct">Create Product</Link>
              </nav>
            </div>
          </header>
          <main className="container mx-auto py-6">{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
