'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

export default function Notifications() {
  const router = useRouter();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadPage, setUnreadPage] = useState(1);
  const [readPage, setReadPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [unreadPagination, setUnreadPagination] = useState({});
  const [readPagination, setReadPagination] = useState({});
  const [allPagination, setAllPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const limit = 20;

  const fetchNotifications = async (status, page, append = false, skipLoading = false) => {
    if (!skipLoading) setIsLoading(true);
    try {
      const response = await api.get('/notifications', {
        params: { status, page, limit },
      });
      const { data, pagination } = response.data;
      if (status === 'unread') {
        setUnreadNotifications(prev => append ? [...prev, ...data] : data);
        setUnreadPagination(pagination);
      } else if (status === 'read') {
        setReadNotifications(prev => append ? [...prev, ...data] : data);
        setReadPagination(pagination);
      } else if (status === 'all') {
        setAllNotifications(prev => append ? [...prev, ...data] : data);
        setAllPagination(pagination);
      }
    } catch (error) {
      toast.error('Failed to fetch notifications');
      console.error('Error fetching notifications:', error);
    } finally {
      if (!skipLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications('all', allPage);
    fetchNotifications('unread', unreadPage);
    fetchNotifications('read', readPage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications('all', allPage, false, true);
      fetchNotifications('unread', unreadPage, false, true);
      fetchNotifications('read', readPage, false, true);
    }, 10000);

    return () => clearInterval(interval);
  }, [allPage, unreadPage, readPage]);

  const handleLoadMore = (status) => {
    if (status === 'unread') {
      const nextPage = unreadPage + 1;
      setUnreadPage(nextPage);
      fetchNotifications('unread', nextPage, true);
    } else if (status === 'read') {
      const nextPage = readPage + 1;
      setReadPage(nextPage);
      fetchNotifications('read', nextPage, true);
    } else if (status === 'all') {
      const nextPage = allPage + 1;
      setAllPage(nextPage);
      fetchNotifications('all', nextPage, true);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setUnreadNotifications(prev => prev.filter(n => n.id !== id));
      setReadNotifications(prev => [...prev, { ...unreadNotifications.find(n => n.id === id), isRead: true }]);
      setAllNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadPagination(prev => ({
        ...prev,
        totalItems: prev.totalItems - 1,
        totalPages: Math.ceil((prev.totalItems - 1) / limit),
      }));
      setReadPagination(prev => ({
        ...prev,
        totalItems: prev.totalItems + 1,
        totalPages: Math.ceil((prev.totalItems + 1) / limit),
      }));
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setReadNotifications(prev => [...prev, ...unreadNotifications.map(n => ({ ...n, isRead: true }))]);
      setAllNotifications(prev => prev.map(n => n.isRead ? n : { ...n, isRead: true }));
      setUnreadNotifications([]);
      setUnreadPagination({ totalItems: 0, totalPages: 0, currentPage: 1, limit });
      setReadPagination(prev => ({
        ...prev,
        totalItems: prev.totalItems + unreadPagination.totalItems,
        totalPages: Math.ceil((prev.totalItems + unreadPagination.totalItems) / limit),
      }));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleViewOrder = (orderId) => {
    router.push(`/admin/orders/details/${orderId}`);
  };

  const renderNotifications = (notifications, status) => {
    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
          <p className="text-base sm:text-lg text-gray-600">No {status} notifications</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className="w-full">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`h-5 w-5 ${notification.isRead ? 'text-green-500' : 'text-blue-500'}`} />
                  <div>
                    <p className="text-sm sm:text-base font-medium">{notification.message}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Order #{notification.order.id} | {notification.order.productName} | {notification.order.fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(notification.order.id)}
                    className="w-full sm:w-auto"
                  >
                    View Order
                  </Button>
                  {!notification.isRead && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="w-full sm:w-auto"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {status === 'unread' && unreadPagination.totalPages > unreadPage && (
          <Button
            onClick={() => handleLoadMore('unread')}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Load More
          </Button>
        )}
        {status === 'read' && readPagination.totalPages > readPage && (
          <Button
            onClick={() => handleLoadMore('read')}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Load More
          </Button>
        )}
        {status === 'all' && allPagination.totalPages > allPage && (
          <Button
            onClick={() => handleLoadMore('all')}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Load More
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        <div className="space-y-4 sm:space-y-6 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Notifications</h2>
            {unreadNotifications.length > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Mark All as Read
              </Button>
            )}
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({allPagination.totalItems || 0})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadPagination.totalItems || 0})</TabsTrigger>
              <TabsTrigger value="read">Read ({readPagination.totalItems || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">All Notifications</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    renderNotifications(allNotifications, 'all')
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="unread">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Unread Notifications</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    renderNotifications(unreadNotifications, 'unread')
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="read">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Read Notifications</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    renderNotifications(readNotifications, 'read')
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}