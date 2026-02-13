"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default function DealerRegistrationDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [dealer, setDealer] = useState(null);
  const [editedDealer, setEditedDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchDealer = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/dealer-registration/${id}`);
        const data = res.data;

        // Parse JSON fields if stored as strings
        if (
          data.interestedBrands &&
          typeof data.interestedBrands === "string"
        ) {
          data.interestedBrands = JSON.parse(data.interestedBrands);
        }
        if (data.sellBrands && typeof data.sellBrands === "string") {
          data.sellBrands = JSON.parse(data.sellBrands);
        }
        if (
          data.authorizedDealer &&
          typeof data.authorizedDealer === "string"
        ) {
          data.authorizedDealer = JSON.parse(data.authorizedDealer);
        }

        setDealer(data);
        setEditedDealer({ ...data });
      } catch (error) {
        toast.error("Failed to load dealer registration");
        router.push("/admin/dealership-requests/list");
      } finally {
        setLoading(false);
      }
    };

    fetchDealer();
  }, [id, router]);

  const handleChange = (field, value) => {
    setEditedDealer((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updates = {};
      const fields = ["status", "title", "mobile", "fax"];

      fields.forEach((field) => {
        if (editedDealer[field] !== dealer[field]) {
          updates[field] = editedDealer[field] || null;
        }
      });

      if (Object.keys(updates).length === 0) {
        toast.info("No changes made");
        return;
      }

      await api.put(`/dealer-registration/${id}`, updates);

      toast.success("Dealer registration updated successfully");
      setHasChanges(false);
      router.push("/admin/dealership-requests/list");
    } catch (error) {
      toast.error("Failed to update dealer registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      router.push("/admin/dealership-requests/list");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (!dealer)
    return (
      <div className="text-center py-8">Dealer registration not found</div>
    );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Dealer Registration: {dealer.companyName}
        </h2>
        <Badge variant={dealer.status == "approved" ? "default" : "secondary"}>
          {dealer.status}
        </Badge>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company & Contact */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label>Company Name</Label>
              <Input value={dealer.companyName} disabled />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editedDealer.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label>First Name</Label>
                <Input value={dealer.firstName} disabled />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={dealer.lastName} disabled />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <Label>Email</Label>
            <Input value={dealer.email} disabled />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={dealer.phone} disabled />
          </div>
          <div>
            <Label>Mobile (Optional)</Label>
            <Input
              value={editedDealer.mobile || ""}
              onChange={(e) => handleChange("mobile", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label>Fax (Optional)</Label>
            <Input
              value={editedDealer.fax || ""}
              onChange={(e) => handleChange("fax", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Billing Address */}
          <div className="md:col-span-2">
            <Label className="text-lg font-semibold">Billing Address</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <Input value={dealer.billingStreet} disabled />
              <Input
                value={`${dealer.billingCity}, ${dealer.billingState} ${dealer.billingZip}`}
                disabled
              />
              <Input
                value={dealer.billingCountry}
                disabled
                className="sm:col-span-2"
              />
            </div>
          </div>

          {/* Commercial Address */}
          <div className="md:col-span-2">
            <Label className="text-lg font-semibold">Commercial Address</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <Input value={dealer.commercialStreet} disabled />
              <Input
                value={`${dealer.commercialCity}, ${dealer.commercialState} ${dealer.commercialZip}`}
                disabled
              />
              <Input
                value={dealer.commercialCountry}
                disabled
                className="sm:col-span-2"
              />
            </div>
          </div>

          <div>
            <Label>Has Resale Certificate?</Label>
            <Input
              value={dealer.hasShowroom === "yes" ? "Yes" : "No"}
              disabled
            />

            {dealer.hasShowroom === "yes" && dealer.resaleCertificate && (
              <div className="mt-3">
                <Label className="my-1">EIN #</Label>
                <Input
                  value={dealer.EIN  ? dealer.EIN : ""}
                  disabled
                />
                <Label className="my-1">Resale Certificate Preview</Label>

                {dealer.resaleCertificate.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                  <img
                    src={`http://localhost:5000${dealer.resaleCertificate}`}
                    alt="Resale Certificate"
                    className="mt-2 max-w-xs rounded border"
                  />
                ) : dealer.resaleCertificate.match(/\.pdf$/i) ? (
                  <iframe
                    src={`http://localhost:5000${dealer.resaleCertificate}`}
                    title="Resale Certificate PDF"
                    className="mt-2 w-full h-96 border rounded"
                  />
                ) : (
                  <a
                    href={dealer.resaleCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 underline"
                  >
                    View Resale Certificate
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Approval Status */}
          <div>
            <Label>Approval Status</Label>
            <Select
              value={editedDealer.status}
              onValueChange={(value) => handleChange("status", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* JSON Fields - Display Only */}
          {dealer.interestedBrands && (
            <div className="md:col-span-2">
              <Label>Interested Brands</Label>
              <Input
                value={
                  Array.isArray(dealer.interestedBrands)
                    ? dealer.interestedBrands.join(", ")
                    : "None"
                }
                disabled
              />
            </div>
          )}
          {dealer.sellBrands && (
            <div className="md:col-span-2">
              <Label>Currently Sells Brands</Label>
              <Input
                value={
                  Array.isArray(dealer.sellBrands)
                    ? dealer.sellBrands.join(", ")
                    : "None"
                }
                disabled
              />
            </div>
          )}
          {dealer.authorizedDealer && (
            <div className="md:col-span-2">
              <Label>Authorized Dealer For</Label>
              <Input
                value={
                  Array.isArray(dealer.authorizedDealer)
                    ? dealer.authorizedDealer.join(", ")
                    : "None"
                }
                disabled
              />
            </div>
          )}

          <div>
            <Label>Submitted On</Label>
            <Input
              value={new Date(dealer.createdAt).toLocaleDateString()}
              disabled
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!hasChanges || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>

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
            <Button
              onClick={() => router.push("/admin/dealership-requests/list")}
            >
              Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
