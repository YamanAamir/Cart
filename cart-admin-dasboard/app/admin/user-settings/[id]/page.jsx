"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { Switch } from "@/components/ui/switch";

export default function CustomerDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;

      try {
        const res = await api.get(`/customer/${id}`);
        const cust = res.data; // assuming response is { id, fullName, email, createdAt, updatedAt, isActive }

        setCustomer(cust);
        setEditedCustomer({ ...cust });
      } catch (error) {
        toast.error("Failed to load customer");
        router.push("/admin/user-settings/list");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, router]);

  const handleFieldChange = (field, value) => {
    let processedValue = value;

    if (field === "isActive") {
      processedValue = value === true || value === "true";
    } else if (field === "fullName" || field === "email") {
      processedValue = value.trim();
    }

    setEditedCustomer((prev) => ({ ...prev, [field]: processedValue }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Build update payload only with changed fields
      const updates = {};
      const fields = ["fullName", "email", "isActive"];

      fields.forEach((field) => {
        if (editedCustomer[field] !== customer[field]) {
          updates[field] = editedCustomer[field];
        }
      });

      // Basic validation
      if (updates.fullName !== undefined && updates.fullName.trim() === "") {
        throw new Error("Full name is required");
      }
      if (updates.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email)) {
          throw new Error("Please enter a valid email address");
        }
      }

      if (Object.keys(updates).length === 0) {
        toast.info("No changes to save");
        return;
      }

      await api.put(`/customer/${id}`, updates);

      toast.success("Customer updated successfully");
      setHasChanges(false);
      router.push("/admin/user-settings/list");
    } catch (error) {
      toast.error(error.message || "Failed to update customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      router.push("/admin/customers");
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    router.push("/admin/customers");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center py-8">Customer not found</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Edit Customer: {customer.fullName}</h2>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={editedCustomer.fullName || ""}
              onChange={(e) => handleFieldChange("fullName", e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={editedCustomer.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. john@example.com"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="isActive" className="text-base">
              Account Status
            </Label>
            <Switch
              id="isActive"
              checked={editedCustomer.isActive}
              onCheckedChange={(checked) => handleFieldChange("isActive", checked)}
              disabled={isSubmitting}
            />
            <span className="text-sm text-muted-foreground">
              {editedCustomer.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Created At (read-only) */}
          <div>
            <Label>Created At</Label>
            <Input
              value={new Date(customer.createdAt).toLocaleDateString()}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Updated At (read-only) */}
          <div>
            <Label>Updated At</Label>
            <Input
              value={new Date(customer.updatedAt || customer.createdAt).toLocaleDateString()}
              disabled
              className="bg-muted"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!hasChanges || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
          </DialogHeader>
          <p>You have unsaved changes. Are you sure you want to leave?</p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelConfirm(false)}
            >
              Stay
            </Button>
            <Button onClick={confirmCancel}>Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}