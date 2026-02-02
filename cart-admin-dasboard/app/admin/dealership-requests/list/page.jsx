"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const columns = [
  { key: "checkbox", label: "" },
  { key: "id", label: "ID" },
  { key: "companyName", label: "Company" },
  { key: "contact", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "showroom", label: "Showroom" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Badge
        variant={
          row.status === "approved"
            ? "default"
            : row.status === "rejected"
            ? "destructive"
            : "secondary"
        }
      >
        {row.status=='approved'
          ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
          : row.status=='rejected'
          ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
          : "Pending"}
      </Badge>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (row, { onView, onDelete }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(row.id)}>
            View / Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(row.id)}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function DealerRegistrations() {
  const router = useRouter();
  const [dealers, setDealers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState(null);
  const [flag, setFlag] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  const [filters, setFilters] = useState({
    search: "",
    sort: "createdAt",
    order: "desc",
  });

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dealer-registrations", {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: filters.search,
          sort: filters.sort,
          order: filters.order,
        },
      });

      setDealers(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) {
      toast.error("Failed to fetch dealer registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, [pagination.currentPage, pagination.limit, filters, flag]);

  const handleViewDealer = (id) => {
    router.push(`/admin/dealership-requests/${id}`);
  };

  const handleDeleteDealer = (id) => {
    setSingleDeleteId(id);
    setShowConfirmDialog(true);
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? dealers.map((d) => d.id) : []);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("No dealers selected");
      return;
    }
    setSingleDeleteId(null);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setIsActionLoading(true);
    try {
      const idsToDelete = singleDeleteId ? [singleDeleteId] : selectedIds;

      await api.post("/bulk-delete-dealer-registrations", { ids: idsToDelete });

      toast.success(
        `${idsToDelete.length} dealer registration${
          idsToDelete.length > 1 ? "s" : ""
        } deleted`
      );
      setSelectedIds([]);
      setSingleDeleteId(null);
      setFlag((prev) => !prev);
    } catch {
      toast.error("Failed to delete dealer registrations");
    } finally {
      setIsActionLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleLimitChange = (value) => {
    setPagination((prev) => ({
      ...prev,
      limit: Number(value),
      currentPage: 1,
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const getConfirmDescription = () => {
    const count = singleDeleteId ? 1 : selectedIds.length;
    return `Are you sure you want to delete ${count} dealer registration${
      count > 1 ? "s" : ""
    }?`;
  };

  const handleToggleApproval = async (id, newStatus) => {
    try {
      // Optimistic update (optional - improves UX)
      setDealers((prev) =>
        prev.map((dealer) =>
          dealer.id === id ? { ...dealer, isApproved: newStatus } : dealer
        )
      );

      // Call your toggle API endpoint
      await api.patch(`/dealer-registration/${id}`, {
        isApproved: newStatus,
      });
      // Or if you're using the toggle endpoint directly:
      // await api.patch(`/dealer-registrations/${id}`);

      toast.success(
        `Dealer ${newStatus ? "approved" : "set to pending"} successfully`
      );
    } catch (error) {
      // Revert optimistic update on error
      setDealers((prev) =>
        prev.map((dealer) =>
          dealer.id === id ? { ...dealer, isApproved: !newStatus } : dealer
        )
      );

      toast.error("Failed to update approval status");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Dealer Registrations</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <Input
          placeholder="Search by company, name, email..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <Select
          value={filters.sort}
          onValueChange={(v) => handleFilterChange("sort", v)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Submitted</SelectItem>
            <SelectItem value="companyName">Company Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.order}
          onValueChange={(v) => handleFilterChange("order", v)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={isActionLoading}
          >
            Delete Selected ({selectedIds.length})
          </Button>
        </div>
      )}

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
                      checked={
                        selectedIds.length === dealers.length &&
                        dealers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {columns.slice(1).map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dealers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-12"
                    >
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg text-gray-600">
                          No dealer registrations found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  dealers.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(row.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(row.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{row.id}</TableCell>
                      <TableCell>{row.companyName}</TableCell>
                      <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{`${row.commercialCity}, ${row.commercialState}`}</TableCell>
                      <TableCell>
                        {row.hasShowroom === "yes" ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {columns
                          .find((c) => c.key === "status")
                          ?.render(row)}
                      </TableCell>

                      <TableCell>
                        {columns
                          .find((c) => c.key === "actions")
                          .render(row, {
                            onView: handleViewDealer,
                            onDelete: handleDeleteDealer,
                          })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {dealers.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="flex items-center space-x-2 text-sm">
                <p>
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1}{" "}
                  -{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems}
                </p>
                <Select
                  value={pagination.limit.toString()}
                  onValueChange={handleLimitChange}
                >
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

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>{getConfirmDescription()}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isActionLoading}
            >
              {isActionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
