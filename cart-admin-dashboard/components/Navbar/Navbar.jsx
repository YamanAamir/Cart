'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, LogOut, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async (skipLoading = false) => {
    try {
      const response = await api.get('/notifications', {
        params: { status: 'unread', page: 1, limit: 5 },
      });
      const { data } = response.data;
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
      console.error('Error fetching notifications:', error);
    }
  };

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchNotifications(true);
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  const handleMarkAsRead = async (id, orderId) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      router.push(`/admin/orders/details/${orderId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <header className="bg-white shadow-md px-4 sm:px-6 py-4 flex justify-between items-center fixed top-0 z-20 left-0 right-0 lg:left-64 xl:left-72">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 truncate max-w-[calc(100%-100px)] sm:max-w-[calc(100%-120px)] ml-[50px] lg:ml-0">
        {user?.isSuper ? 'Super Admin Dashboard' : 'Admin Dashboard'}
      </h1>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800 relative">
              <Bell className="w-4 sm:w-5 h-4 sm:h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 sm:w-72 mr-2 p-2 max-h-[50vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <DropdownMenuItem className="text-xs text-gray-500 p-2 sm:p-3">
                No new notifications
              </DropdownMenuItem>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-2 sm:p-3"
                >
                  <span className="text-xs font-medium">{notification.message}</span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-[10px] w-full sm:w-auto"
                    onClick={() => handleMarkAsRead(notification.id, notification.order.id)}
                  >
                    View Order
                  </Button>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuItem className="p-2 sm:p-3">
              <Button
                variant="link"
                size="sm"
                className="w-full text-xs text-blue-600 hover:text-blue-800"
                onClick={() => router.push('/admin/notifications')}
              >
                View All Notifications
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-1 sm:gap-2">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9 p-2 border">
                <AvatarImage src={user?.profilePicture} alt="Qist Market" />
                <AvatarFallback>
                  {user?.fullName
                    ? user.fullName
                        .split(' ')
                        .slice(0, 2)
                        .map(word => word.charAt(0).toUpperCase())
                        .join('')
                    : 'QM'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-gray-800 font-medium text-sm sm:text-base">
                {user?.fullName || 'Loading...'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 sm:w-56 mr-2 p-2">
            <DropdownMenuItem className="p-2 sm:p-3 text-xs sm:text-sm">
              {user?.email || 'Loading...'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/admin/settings')}
              className="p-2 sm:p-3 text-xs sm:text-sm"
            >
              <User className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
              Admin Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="p-2 sm:p-3 text-xs sm:text-sm">
              <LogOut className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}