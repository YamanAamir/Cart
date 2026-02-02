'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import ProtectedRoute from '@/contexts/ProtectedRoute';

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('DEVICE');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 lg:ml-64 xl:ml-72">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-14 sm:mt-16">{children}</main>
      </div>
    </div>
    </ProtectedRoute>
  );
}