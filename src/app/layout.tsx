import './globals.css';

import { Provider } from '@/providers';

// import { Inter } from 'next/font/google';

// const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: process.env.APP_NAME,
  description: 'A chat application make your life better',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`overflow-hidden`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
