"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export default function HeroSectionList() {
    const router = useRouter();

    const [heroes, setHeroes] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [singleDeleteId, setSingleDeleteId] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const [search, setSearch] = useState("");

    /* ---------------- FETCH ---------------- */
    const fetchHeroes = async () => {
        try {
            setLoading(true);
            const res = await api.get("/hero-section/list", {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    search,
                },
            });

            setHeroes(res.data.data || []);
            setPagination(res.data.pagination);
        } catch {
            toast.error("Failed to fetch hero sections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeroes();
    }, [pagination.page, pagination.limit, search, refresh]);

    /* ---------------- ACTIONS ---------------- */
    const handleView = (id) => {
        router.push(`/admin/hero-sections/${id}`);
    };

    const handleDelete = (id) => {
        setSingleDeleteId(id);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            setActionLoading(true);
            const ids = singleDeleteId ? [singleDeleteId] : selectedIds;

            await api.post("/hero-section/bulk-delete", { ids });

            toast.success("Hero section(s) deleted");
            setSelectedIds([]);
            setSingleDeleteId(null);
            setRefresh((p) => !p);
        } catch {
            toast.error("Delete failed");
        } finally {
            setActionLoading(false);
            setConfirmOpen(false);
        }
    };

    /* ---------------- SELECTION ---------------- */
    const toggleAll = (checked) => {
        const value = checked === true;
        setSelectedIds(value ? heroes.map((h) => h.id) : []);
    };

    const toggleOne = (id, checked) => {
        const value = checked === true;
        setSelectedIds((prev) =>
            value ? [...prev, id] : prev.filter((i) => i !== id)
        );
    };

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Hero Sections</h2>
                <Button onClick={() => router.push("/admin/hero-sections/create")}>
                    Add Hero Section
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder="Search by title..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPagination((p) => ({ ...p, page: 1 }));
                }}
            />

            {/* Bulk Delete */}
            {selectedIds.length > 0 && (
                <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                    Delete Selected ({selectedIds.length})
                </Button>
            )}

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">
                                    <Checkbox
                                        checked={
                                            selectedIds.length === heroes.length &&
                                            heroes.length > 0
                                        }
                                        onCheckedChange={toggleAll}
                                    />
                                </TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {heroes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <AlertCircle className="mx-auto mb-2 text-gray-400" />
                                        No hero sections found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                heroes.map((hero) => (
                                    <TableRow key={hero.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(hero.id)}
                                                onCheckedChange={(c) =>
                                                    toggleOne(hero.id, c)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{hero.id}</TableCell>
                                        <TableCell>{hero.title}</TableCell>
                                        <TableCell>
                                            {hero.isActive ? "✅ Active" : "❌ Inactive"}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(hero.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleView(hero.id)}
                                                    >
                                                        View / Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() =>
                                                            handleDelete(hero.id)
                                                        }
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

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                        {pagination.totalPages > 1 && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    disabled={pagination.page === 1}
                                    onClick={() =>
                                        setPagination((p) => ({
                                            ...p,
                                            page: p.page - 1,
                                        }))
                                    }
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    disabled={
                                        pagination.page === pagination.totalPages
                                    }
                                    onClick={() =>
                                        setPagination((p) => ({
                                            ...p,
                                            page: p.page + 1,
                                        }))
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Confirm Delete */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
