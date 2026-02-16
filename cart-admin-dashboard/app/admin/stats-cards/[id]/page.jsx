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
import { api } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function StatsCardDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [card, setCard] = useState(null);
  const [editedCard, setEditedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    if (!id) return;

    const fetchCard = async () => {
      try {
        const res = await api.get(`/stats-cards/${id}/show`);
        setCard(res.data.data);
        setEditedCard({ ...res.data.data });
      } catch {
        toast.error("Failed to load stats card");
        router.push("/admin/stats-cards/list");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id, router]);
  console.log(card);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (field, value) => {
    setEditedCard((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const updates = {};

      ["title", "value", "link"].forEach((field) => {
        if (editedCard[field] !== card[field]) {
          updates[field] = editedCard[field];
        }
      });

      if (Object.keys(updates).length === 0) {
        toast.info("No changes to save");
        return;
      }

      await api.put(`/stats-cards/${id}/update`, updates);

      toast.success("Stats card updated");
      setHasChanges(false);
      router.push("/admin/stats-cards/list");
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      router.push("/admin/stats-cards/list");
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    router.push("/admin/stats-cards/list");
  };

  /* ---------------- STATES ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!card) {
    return <div className="text-center py-10">Stats card not found</div>;
  }

  return (
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold">
        Edit Stats Card
      </h2>

      <Card className="p-6 space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={editedCard.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={editedCard.value || ""}
            onChange={(e) => handleChange("value", e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="link">Link</Label>
          <Input
            id="link"
            value={editedCard.link || ""}
            onChange={(e) => handleChange("link", e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end gap-4 pt-6">
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

      {/* Cancel confirmation */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
          </DialogHeader>
          <p>You have unsaved changes. Leave anyway?</p>
          <DialogFooter>
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
