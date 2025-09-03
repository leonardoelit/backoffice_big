import { Outfit } from 'next/font/google';
import './globals.css';
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationHubProvider } from '@/components/providers/NotificationHubProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="bottom-right" />
            <NotificationProvider>
              <NotificationHubProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </NotificationHubProvider>
          </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
