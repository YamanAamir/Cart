'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, MoreHorizontal, Plus, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import api from '@/lib/api';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import SearchableSelect from '@/components/SearchableSelect';

const installmentSchema = z.object({
  totalPrice: z.number().min(1, 'Total price must be greater than 0'),
  monthlyAmount: z.number().min(1, 'Monthly amount must be greater than 0'),
  advance: z.number().min(0, 'Advance cannot be negative'),
  months: z.number().min(1, 'Months must be at least 1'),
});

const productDealSchema = z.object({
  dealId: z.string().min(1, 'Deal is required'),
  productId: z.string().min(1, 'Product is required'),
  installments: z.array(installmentSchema).min(1, 'At least one installment plan is required'),
});

export default function CreateProductDeal() {
  const [productDeals, setProductDeals] = useState([]);
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductDeal, setSelectedProductDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
    resolver: zodResolver(productDealSchema),
    defaultValues: {
      dealId: '',
      productId: '',
      installments: [{ totalPrice: 0, monthlyAmount: 0, advance: 0, months: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'installments',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealsRes, productsRes] = await Promise.all([
          api.get('/deals/pagination?limit=100'),
          api.get('/product'),
        ]);
        setDeals(dealsRes.data.data);
        setProducts(productsRes.data);
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  // Prepare options for SearchableSelect
  const dealOptions = deals.map(deal => ({
    value: String(deal.id),
    label: deal.name
  }));

  const productOptions = products.map(product => ({
    value: String(product.id),
    label: product.name
  }));

  const fetchProductDeals = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/product-deals/pagination', {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: filters.search,
          status: filters.status,
          sort: filters.sort,
          order: filters.order,
        },
      });
      setProductDeals(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch product deals');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDeals();
  }, [pagination.currentPage, pagination.limit, filters]);

  const calculateInstallment = (index) => {
    const installment = form.getValues(`installments.${index}`);
    const { monthlyAmount, months, advance } = installment;
    const totalPrice = monthlyAmount * months + advance;
    form.setValue(`installments.${index}.totalPrice`, Math.round(totalPrice));
  };

  const handleAdd = () => {
    setModalMode('add');
    form.reset();
    setSelectedProductDeal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pd) => {
    setModalMode('edit');
    setSelectedProductDeal(pd);
    form.reset({
      dealId: String(pd.dealId),
      productId: String(pd.productId),
      installments: pd.DealInstallments.map((ins) => ({
        totalPrice: ins.totalPrice,
        monthlyAmount: ins.monthlyAmount,
        advance: ins.advance,
        months: ins.months,
      })),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsActionLoading(true);
    try {
      if (modalMode === 'add') {
        await api.post('/create-product-deal', data);
        toast.success('Product deal created successfully');
      } else {
        await api.put(`/product-deals/${selectedProductDeal.id}`, { installments: data.installments });
        toast.success('Product deal updated successfully');
      }
      fetchProductDeals();
      setIsModalOpen(false);
      form.reset();
      setSelectedProductDeal(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product deal');
    } finally {
      setIsActionLoading(false);
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
      await api.delete(`/product-deals/${selectedDeleteId}`);
      fetchProductDeals();
      toast.success('Product deal deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product deal');
    } finally {
      setIsActionLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    form.reset();
    setSelectedProductDeal(null);
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
        <h2 className="text-xl sm:text-2xl font-bold">Product Deals</h2>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          Add Product to Deal
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
        <Input
          placeholder="Search by ID, deal name or product"
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
            <SelectItem value="dealId">Deal ID</SelectItem>
            <SelectItem value="productId">Product ID</SelectItem>
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
                  <TableHead className="max-w-[150px] sm:max-w-none">Deal Name</TableHead>
                  <TableHead className="max-w-[200px]">Product Name</TableHead>
                  <TableHead className="max-w-[200px]">Start Date/Time</TableHead>
                  <TableHead className="max-w-[200px]">End Date/Time</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productDeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 mb-4" />
                        <p className="text-base sm:text-lg text-gray-600">Data Not Found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  productDeals.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="truncate max-w-[150px] sm:max-w-none">{item.Deal.name}</TableCell>
                      <TableCell className="truncate max-w-[200px]">{item.Product.name}</TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {new Date(item.Deal.startDate).toLocaleString()}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {new Date(item.Deal.endDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
                            item.Deal.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.Deal.isActive ? 'Active' : 'Inactive'}
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
                            <DropdownMenuItem
                              onClick={() => handleEdit(item)}
                              disabled={isActionLoading}
                              className="text-xs sm:text-sm"
                            >
                              Edit Installments
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDeleteConfirm(item.id)}
                              disabled={isActionLoading}
                              className="text-xs sm:text-sm"
                            >
                              Delete
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
          {!isLoading && productDeals.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <p>
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{' '}
                  {pagination.totalItems} product deals
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
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{modalMode === 'add' ? 'Add Product to Deal' : 'Edit Product Deal'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="dealId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Deal</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={dealOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select deal"
                        disabled={isActionLoading || modalMode === 'edit'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Product</FormLabel>
                    <FormControl>
                      <SearchableSelect
                        options={productOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select product"
                        disabled={isActionLoading || modalMode === 'edit'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm sm:text-base">Installment Plans</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ totalPrice: 0, monthlyAmount: 0, advance: 0, months: 1 })}
                    disabled={isActionLoading}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plan
                  </Button>
                </div>
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-sm sm:text-base">Plan {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          disabled={isActionLoading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name={`installments.${index}.totalPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Total Price (RS)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                value={field.value || 0}
                                readOnly
                                className="bg-muted"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`installments.${index}.monthlyAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Monthly Amount (RS)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                value={field.value || 0}
                                onChange={(e) => {
                                  field.onChange(Number(e.target.value));
                                  calculateInstallment(index);
                                }}
                                disabled={isActionLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`installments.${index}.months`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Months</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1"
                                value={field.value || 1}
                                onChange={(e) => {
                                  field.onChange(Number(e.target.value));
                                  calculateInstallment(index);
                                }}
                                disabled={isActionLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`installments.${index}.advance`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Advance (RS)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                value={field.value || 0}
                                onChange={(e) => {
                                  field.onChange(Number(e.target.value));
                                  calculateInstallment(index);
                                }}
                                disabled={isActionLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                ))}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isActionLoading}
                  className="w-full sm:w-auto"
                >
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
              Are you sure you want to delete this product deal? This action cannot be undone.
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
    </div>
  );
}