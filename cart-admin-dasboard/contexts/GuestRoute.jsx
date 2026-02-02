"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const GuestRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('DEVICE');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  return children;
};

export default GuestRoute;