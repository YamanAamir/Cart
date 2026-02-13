"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { toast } from "sonner";

export default function RegisteredWarrantyView() {
  const { id } = useParams();
  const router = useRouter();

  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchWarranty = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/registered-warranties/${id}/show`);
        setWarranty(res.data.data);
      } catch (err) {
        toast.error("Failed to load warranty details");
      } finally {
        setLoading(false);
      }
    };

    fetchWarranty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!warranty) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Warranty not found</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Warranty Details</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Name" value={warranty.name} />
          <Info label="Email" value={warranty.email} />
          <Info label="Phone" value={warranty.phone} />
          <Info label="Address" value={warranty.address} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Model" value={warranty.model} />
          <Info
            label="Purchase Date"
            value={new Date(warranty.purchase).toLocaleDateString()}
          />
          <Info label="Discount Applied" value={warranty.discount ? "Yes" : "No"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registration Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info
            label="Registered At"
            value={new Date(warranty.registeredAt).toLocaleString()}
          />
          <Info
            label="Created At"
            value={new Date(warranty.createdAt).toLocaleString()}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}