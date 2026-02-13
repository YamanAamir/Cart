'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, MoreHorizontal } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import api from '@/lib/api';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const dealSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Start date and time must be valid' }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'End date and time must be valid' }),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date and time must be after start date and time',
  path: ['endDate'],
});

export default function CreateDeal() {
  const [deals, setDeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sort: 'id',
    order: 'desc',
  });
  const [modalMode, setModalMode] = useState('add');

  const form = useForm({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
    },
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/deals/pagination', {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: filters.search,
          status: filters.status,
          sort: filters.sort,
          order: filters.order,
        },
      });
      setDeals(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch deals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.currentPage, pagination.limit, filters]);

  const handleAdd = () => {
    setModalMode('add');
    form.reset();
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (deal) => {
    setModalMode('edit');
    setSelectedDeal(deal);
    form.reset({
      name: deal.name,
      startDate: new Date(deal.startDate).toISOString().slice(0, 16),
      endDate: new Date(deal.endDate).toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsActionLoading(true);
    try {
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };
      if (modalMode === 'add') {
        await api.post('/create-deal', formattedData);
        toast.success('Deal created successfully');
      } else {
        await api.put(`/deals/${selectedDeal.id}`, formattedData);
        toast.success('Deal updated successfully');
      }
      fetchData();
      setIsModalOpen(false);
      form.reset();
      setSelectedDeal(null);
    } catch (error) {
      toast.error('Failed to save deal');
    } finally {
      setIsActionLoading(false);
    }
  };

  const openToggleConfirm = (id, isActive) => {
    setIsModalOpen(false);
    setSelectedDeleteId(id);
    setConfirmAction(isActive ? 'deactivate' : 'activate');
    setIsToggleConfirmOpen(true);
  };

  const handleToggleActive = async () => {
    setIsActionLoading(true);
    try {
      await api.patch(`/deals/${selectedDeleteId}/toggle`, { isActive: confirmAction === 'activate' });
      fetchData();
      toast.success(`Deal ${confirmAction === 'activate' ? 'activated' : 'deactivated'} successfully`);
      setIsToggleConfirmOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle deal status');
    } finally {
      setIsActionLoading(false);
      setSelectedDeleteId(null);
    }
  };

  const handleOpenDeleteConfirm = (id) => {
    setIsModalOpen(false);
    setSelectedDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsActionLoading(true);
    try {
      await api.delete(`/deals/${selectedDeleteId}`);
      fetchData();
      toast.success('Deal deleted successfully');
    } catch (error) {
      toast.error('Failed to delete deal');
    } finally {
      setIsActionLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    form.reset();
    setSelectedDeal(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleLimitChange = (value) => {
    setPagination((prev) => ({ ...prev, limit: Number(value), currentPage: 1 }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Deals</h2>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          Add Deal
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
        <Input
          placeholder="Search by ID, name or product"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.sort}
          onValueChange={(value) => handleFilterChange('sort', value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="startDate">Start Date</SelectItem>
            <SelectItem value="endDate">End Date</SelectItem>
            <SelectItem value="isActive">Status</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.order}
          onValueChange={(value) => handleFilterChange('order', value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto min-w-full">
            <Table className="min-w-max">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] sm:w-[100px]">ID</TableHead>
                  <TableHead className="max-w-[150px] sm:max-w-none">Name</TableHead>
                  <TableHead className="max-w-[200px]">Products</TableHead>
                  <TableHead className="max-w-[200px]">Start Date/Time</TableHead>
                  <TableHead className="max-w-[200px]">End Date/Time</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 mb-4" />
                        <p className="text-base sm:text-lg text-gray-600">Data Not Found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  deals.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="truncate max-w-[150px] sm:max-w-none">{item.name}</TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {item.ProductDeals.map((pd) => pd.Product.name).join(', ') || 'None'}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {new Date(item.startDate).toLocaleString()}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {new Date(item.endDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
                            item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={isActionLoading}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(item)} disabled={isActionLoading} className="text-xs sm:text-sm">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenDeleteConfirm(item.id)} disabled={isActionLoading} className="text-xs sm:text-sm">
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openToggleConfirm(item.id, item.isActive)}
                              disabled={isActionLoading}
                              className="text-xs sm:text-sm"
                            >
                              {item.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {!isLoading && deals.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <p>
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{' '}
                  {pagination.totalItems} deals
                </p>
                <Select
                  value={pagination.limit.toString()}
                  onValueChange={handleLimitChange}
                  disabled={isLoading || isActionLoading}
                >
                  <SelectTrigger className="w-[80px] sm:w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <p>per page</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === 1 || isLoading || isActionLoading}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">Page {pagination.currentPage} of {pagination.totalPages}</span>
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === pagination.totalPages || isLoading || isActionLoading}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{modalMode === 'add' ? 'Add Deal' : 'Edit Deal'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter deal name" {...field} disabled={isActionLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Start Date and Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} disabled={isActionLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">End Date and Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} disabled={isActionLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isActionLoading} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" disabled={isActionLoading} className="w-full sm:w-auto">
                  {isActionLoading ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={() => setIsDeleteModalOpen(false)}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirm Delete</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this deal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isActionLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isActionLoading}
              className="w-full sm:w-auto"
            >
              {isActionLoading ? 'Deleting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Active/Inactive Confirmation Modal */}
      <Dialog open={isToggleConfirmOpen} onOpenChange={() => setIsToggleConfirmOpen(false)}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirm {confirmAction === 'activate' ? 'Activation' : 'Deactivation'}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to {confirmAction === 'activate' ? 'activate' : 'deactivate'} this deal?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsToggleConfirmOpen(false)}
              disabled={isActionLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleToggleActive}
              disabled={isActionLoading}
              className="w-full sm:w-auto"
              variant="destructive"
            >
              {isActionLoading ? 'Confirming...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}