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
  { key: "name", label: "Type Name" },
  { key: "productCount", label: "Products Count" },
  {
    key: "actions",
    label: "Actions",
    render: (row, { onDelete }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDelete(row.id)} className="text-red-600">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function ProductTypes() {
  const router = useRouter();
  const [types, setTypes] = useState([]);
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

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/product-types", {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: filters.search,
          sort: filters.sort,
          order: filters.order,
        },
      });

      setTypes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to fetch product types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, [pagination.currentPage, pagination.limit, filters, flag]);

  const handleDeleteType = async (id) => {
    try {
      await api.delete(`/product-types/${id}`);
      toast.success("Product type deleted");
      setFlag(!flag);
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? types.map((t) => t.id) : []);
  };

  const handleSelectRow = (id, checked) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleBulkAction = (action) => {
    if (selectedIds.length === 0) {
      toast.error("No types selected");
      return;
    }
    setPendingAction(action);
    setSingleDeleteId(null);
    setShowConfirmDialog(true);
  };

  const confirmBulkAction = async () => {
    setIsActionLoading(true);
    try {
      const idsToDelete = singleDeleteId ? [singleDeleteId] : selectedIds;
      await api.post("/bulk-delete-product-types", { ids: idsToDelete });
      toast.success(`${idsToDelete.length} type(s) deleted successfully`);
      setSelectedIds([]);
      setSingleDeleteId(null);
      setFlag((prev) => !prev);
    } catch {
      toast.error("Failed to delete types");
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
    setPagination((prev) => ({ ...prev, limit: Number(value), currentPage: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Product Types</h2>
        <Button onClick={() => router.push("/admin/product-types/create")}>
          Add New Type
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <Input
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          onClick={() => handleBulkAction("delete")}
          disabled={loading || isActionLoading}
        >
          Bulk Delete ({selectedIds.length})
        </Button>
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
                      checked={selectedIds.length === types.length && types.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  {columns.slice(1).map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
                        <p className="text-lg text-gray-600">No product types found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  types.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(type.id)}
                          onCheckedChange={(c) => handleSelectRow(type.id, c)}
                        />
                      </TableCell>
                      <TableCell>{type.id}</TableCell>
                      <TableCell>{type.name}</TableCell>
                      <TableCell>{type.products?.length || 0}</TableCell>
                      <TableCell>
                        {columns.find((c) => c.key === "actions").render(type, {
                          onDelete: (id) => {
                            setSingleDeleteId(id);
                            setPendingAction("delete");
                            setShowConfirmDialog(true);
                          },
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {types.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <div className="text-sm">
                Showing {types.length} of {pagination.totalItems} Product Types
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              {singleDeleteId
                ? "Are you sure you want to delete this product type?"
                : `Are you sure you want to delete ${selectedIds.length} type(s)?`}
              This action cannot be undone.
            </DialogDescription>
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