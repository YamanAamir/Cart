import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "Golf Cart - Admin Dashboard",
  description: "Golf Cart Main Admin Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        {children}
        <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
