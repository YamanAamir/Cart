"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, MoreHorizontal } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const columns = [
  { key: "checkbox", label: "" },
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Order Date" },
  {
    key: "actions",
    label: "Actions",
    render: (row, { onView, onChangeStatus }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(row.id)}>View Details</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(row.id, "SHIPPED")}>
            Mark as Shipped
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(row.id, "DELIVERED")}>
            Mark as Delivered
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStatus(row.id, "CANCELLED")} className="text-red-600">
            Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [flag, setFlag] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sort: "createdAt",
    order: "desc",
  });

  /* --------------------------- FETCH ORDERS --------------------------- */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: filters.search || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        sort: filters.sort,
        order: filters.order,
      };

      const res = await api.get("/orders", { params });
      setOrders(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) {
      toast.error("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, pagination.limit, filters, flag]);

  /* --------------------------- ACTIONS --------------------------- */
  const handleViewOrder = (id) => {
    router.push(`/admin/orders/${id}`);
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setFlag(!flag);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  /* --------------------------- SELECTION --------------------------- */
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? orders.map((o) => o.id) : []);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)));
  };

  const handleBulkCancel = () => {
    if (selectedIds.length === 0) return toast.error("No orders selected");
    setPendingAction("cancel");
    setShowConfirmDialog(true);
  };

  const confirmBulkAction = async () => {
    if (pendingAction !== "cancel") return;
    setIsActionLoading(true);
    try {
      await api.post("/orders/bulk-cancel", { ids: selectedIds });
      toast.success(`${selectedIds.length} order(s) cancelled`);
      setSelectedIds([]);
      setFlag((prev) => !prev);
    } catch (error) {
      toast.error("Failed to cancel orders");
    } finally {
      setIsActionLoading(false);
      setShowConfirmDialog(false);
    }
  };

  /* --------------------------- FILTERS & PAGINATION --------------------------- */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleLimitChange = (value) => {
    setPagination((prev) => ({ ...prev, limit: Number(value), currentPage: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Orders</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <Input
          placeholder="Search by order ID or customer email/name..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleBulkCancel}>
            Cancel Selected ({selectedIds.length})
          </Button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === orders.length && orders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {columns.slice(1).map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg text-gray-600">No orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(row.id)}
                          onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">#{row.id}</TableCell>
                      <TableCell>
                        {row.customer?.fullName || "-"}<br />
                        <span className="text-sm text-gray-500">{row.customer?.email}</span>
                      </TableCell>
                      <TableCell>${row.totalAmount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium
                          ${row.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                            row.status === "PAID" ? "bg-blue-100 text-blue-800" :
                            row.status === "SHIPPED" ? "bg-purple-100 text-purple-800" :
                            row.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"}`}>
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {columns.find((c) => c.key === "actions").render(row, {
                          onView: handleViewOrder,
                          onChangeStatus: handleChangeStatus,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="flex items-center space-x-2 text-sm">
                <p>
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{" "}
                  {pagination.totalItems} orders
                </p>
                <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-[100px]">
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel {selectedIds.length} order(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isActionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmBulkAction} disabled={isActionLoading}>
              {isActionLoading ? "Processing..." : "Yes, Cancel Orders"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}