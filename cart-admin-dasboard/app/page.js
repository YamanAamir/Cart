"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md gap-2">
        {user && 
          <CardHeader>
            <CardTitle>Hello, {user?.fullName || "Loading..."}</CardTitle>
          </CardHeader> 
        }
        <CardHeader>
          <CardTitle>Welcome to ClubPro Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-2">
          <p className="text-gray-600">
            Manage your e-commerce platform with ease.
          </p>
          <div className="flex gap-4">
            {!user ?
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            :
            <Link href="/admin/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}