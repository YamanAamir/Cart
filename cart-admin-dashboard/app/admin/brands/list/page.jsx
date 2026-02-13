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
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "modelCount", label: "Models Count" },
  { key: "productCount", label: "Products Count" },
  {
    key: "actions",
    label: "Actions",
    render: (row, { onDelete,onView }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onDelete(row.id)}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onView(row.id)}
            className="text-black-600"
          >
            View/Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function Brands() {
  const router = useRouter();
  const [brands, setBrands] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
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
    sort: "id",
    order: "desc",
  });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await api.get("/brands", {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: filters.search,
          sort: filters.sort,
          order: filters.order,
        },
      });

      setBrands(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [pagination.currentPage, pagination.limit, filters, flag]);

  const handleDeleteBrand = async (id) => {
    try {
      await api.delete(`/brands/${id}`);
      toast.success("Brand deleted");
      setFlag(!flag);
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? brands.map((b) => b.id) : []);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) {
      toast.error("No brands selected");
      return;
    }
    setPendingAction(action);
    setSingleDeleteId(null);
    setShowConfirmDialog(true);
  };

  const handleEditBrand = (id) => {
  toast.promise(
    new Promise((resolve) => {
      router.push(`/admin/brands/${id}`);
      // Small delay to allow navigation to start
      setTimeout(resolve, 300);
    }),
    {
      loading: "Opening edit page...",
      success: "Edit page loaded",
      error: "Failed to navigate",
    }
  );
};

  const confirmBulkAction = async () => {
    if (!pendingAction || pendingAction !== "delete") return;
    setIsActionLoading(true);
    try {
      const idsToDelete = singleDeleteId ? [singleDeleteId] : selectedIds;
      await api.post("/bulk-delete-brands", { ids: idsToDelete });
      toast.success(`${idsToDelete.length} brand(s) deleted successfully`);
      setSelectedIds([]);
      setSingleDeleteId(null);
      setFlag((prev) => !prev);
    } catch (error) {
      toast.error("Failed to delete brands");
    } finally {
      setIsActionLoading(false);
      setShowConfirmDialog(false);
      setPendingAction(null);
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

  const getConfirmDialogDescription = () => {
    if (singleDeleteId) {
      return "Are you sure you want to delete this brand? This action cannot be undone.";
    }
    return `Are you sure you want to delete ${selectedIds.length} selected brand(s)? This action cannot be undone.`;
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Brands</h2>
        <Button onClick={() => router.push("/admin/brands/create")}>
          Add New Brand
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <Input
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <Select value={filters.sort} onValueChange={(v) => handleFilterChange("sort", v)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">ID</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.order} onValueChange={(v) => handleFilterChange("order", v)}>
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
            onClick={() => handleBulkAction("delete")}
            disabled={loading || isActionLoading}
          >
            Bulk Delete ({selectedIds.length})
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
                      checked={selectedIds.length === brands.length && brands.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {columns.slice(1).map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
                        <p className="text-lg text-gray-600">No brands found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(brand.id)}
                          onCheckedChange={(checked) => handleSelectRow(brand.id, checked)}
                        />
                      </TableCell>
                      <TableCell>{brand.id}</TableCell>
                      <TableCell>{brand.name}</TableCell>
                      <TableCell>{brand.models?.length || 0}</TableCell>
                      <TableCell>{brand.products?.length || 0}</TableCell>
                      <TableCell>
                        {columns.find((c) => c.key === "actions").render(brand, {
                          onDelete: (id) => {
                            setSingleDeleteId(id);
                            setPendingAction("delete");
                            setShowConfirmDialog(true);
                          },
                          onView: (id) => {
                           handleEditBrand(id)
                          },
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {brands.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <p>
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{" "}
                  {pagination.totalItems} Brands
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
              <div className="flex items-center space-x-2">
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
            <DialogDescription>{getConfirmDialogDescription()}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isActionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmBulkAction} disabled={isActionLoading}>
              {isActionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}