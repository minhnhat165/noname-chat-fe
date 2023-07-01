import './globals.css';

import { Inter } from 'next/font/google';
import { Provider } from '@/providers';
import { ReactNode } from 'react';
import { Setting } from '@/providers/setting';
import { cn } from '@/utils';
import { Toast } from '@/components/common/toast';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: process.env.APP_NAME,
  description: 'A chat application make your life better',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={cn(inter.className, 'overflow-hidden')}>
        <Setting />
        <Toast />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
