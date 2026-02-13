"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function RegisteredWarranties() {
  const router = useRouter();

  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  const [search, setSearch] = useState("");

  /* ---------------- FETCH WARRANTIES ---------------- */
  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const res = await api.get("/registered-warranties", {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          search,
        },
      });

      setWarranties(res.data.data || []);
      setPagination(res.data.pagination || pagination);
    } catch (err) {
      toast.error("Failed to fetch warranties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, [pagination.currentPage, pagination.limit, search]);

  /* ---------------- VIEW ---------------- */
  const handleView = (id) => {
    router.push(`/admin/registered-warranty/view/${id}`);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Registered Warranties</h2>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name, email, model..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPagination((p) => ({ ...p, currentPage: 1 }));
        }}
      />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Purchase Info</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Registered At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {warranties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <AlertCircle className="mx-auto mb-2 text-gray-400" />
                  No warranties found
                </TableCell>
              </TableRow>
            ) : (
              warranties.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>{w.id}</TableCell>
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{w.email}</TableCell>
                  <TableCell>{w.model}</TableCell>
                  <TableCell>{w.purchase}</TableCell>
                  <TableCell>{w.discount ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {new Date(w.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(w.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
