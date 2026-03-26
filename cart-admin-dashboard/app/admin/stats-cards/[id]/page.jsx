"use client";

import { useState, useEffect, useRef } from "react";
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
import { api, formDataApi } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API?.replace("/api", "") || "https://api.clubpromfg.com";

export default function StatsCardDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [card, setCard] = useState(null);
  const [editedCard, setEditedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);

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

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (field, value) => {
    setEditedCard((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      ["title", "value", "link"].forEach((field) => {
        if (editedCard[field] !== card[field]) {
          formData.append(field, editedCard[field] ?? "");
        }
      });
      if (fileRef.current?.files[0]) {
        formData.append("image", fileRef.current.files[0]);
      }

      if ([...formData.entries()].length === 0) {
        toast.info("No changes to save");
        return;
      }

      await formDataApi.put(`/stats-cards/${id}/update`, formData);
      toast.success("Stats card updated");
      setHasChanges(false);
      router.push("/admin/stats-cards/list");
    } catch {
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) setShowCancelConfirm(true);
    else router.push("/admin/stats-cards/list");
  };

  /* ---------------- STATES ---------------- */
  if (loading) return <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>;
  if (!card) return <div className="text-center py-10">Stats card not found</div>;

  const currentImage = imagePreview || (card.imageUrl ? `${API_BASE_URL}${card.imageUrl}` : null);

  return (
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold">Edit Stats Card</h2>

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
        <div className="space-y-2">
          <Label htmlFor="image">Icon / Image</Label>
          {currentImage && (
            <div className="w-16 h-16 rounded-full bg-amber-100 overflow-hidden flex items-center justify-center mb-2">
              <img src={currentImage} alt="current" className="w-full h-full object-contain p-1" />
            </div>
          )}
          <Input
            id="image"
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!hasChanges || isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>

      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Unsaved Changes</DialogTitle></DialogHeader>
          <p>You have unsaved changes. Leave anyway?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>Stay</Button>
            <Button onClick={() => { setShowCancelConfirm(false); router.push("/admin/stats-cards/list"); }}>Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
