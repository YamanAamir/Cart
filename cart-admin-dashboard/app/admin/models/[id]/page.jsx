"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function EditModel() {
  const router = useRouter();
  const { id } = useParams();

  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState({
    name: "",
    brandId: "",
    slug: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  /* ---------- FETCH ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modelRes, brandsRes] = await Promise.all([
          api.get(`/models/${id}`),
          api.get("/brands?limit=1000"),
        ]);

        const m = modelRes.data;
        const initial = {
          name: m.name || "",
          brandId: String(m.brandId || ""),
          slug: m.slug || "",
          seoTitle: m.seoTitle || "",
          seoDescription: m.seoDescription || "",
          seoKeywords: m.seoKeywords || "",
        };
        setOriginal(initial);
        setForm(initial);
        setBrands(brandsRes.data.data || []);
      } catch {
        toast.error("Failed to load model");
        router.push("/admin/models/list");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  /* ---------- HANDLERS ---------- */
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("Model name is required");
    if (!form.brandId) return toast.error("Please select a brand");

    setIsSubmitting(true);
    try {
      await api.put(`/models/${id}`, {
        name: form.name.trim(),
        brandId: Number(form.brandId),
        slug: form.slug || null,
        seoTitle: form.seoTitle || null,
        seoDescription: form.seoDescription || null,
        seoKeywords: form.seoKeywords || null,
      });

      toast.success("Model updated successfully");
      router.push("/admin/models/list");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to update model");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) setShowCancelConfirm(true);
    else router.push("/admin/models/list");
  };

  /* ---------- RENDER ---------- */
  if (loading) return <div className="flex justify-center py-10"><LoadingSpinner size="lg" /></div>;
  if (!original) return <div className="text-center py-10">Model not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Model Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. DS, Tempo, RXV"
                disabled={isSubmitting}
              />
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select
                value={form.brandId}
                onValueChange={(v) => handleChange("brandId", v)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* SEO */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold">SEO Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="e.g. club-car-ds"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={form.seoTitle}
                  onChange={(e) => handleChange("seoTitle", e.target.value)}
                  placeholder="Meta Title"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Input
                  id="seoDescription"
                  value={form.seoDescription}
                  onChange={(e) => handleChange("seoDescription", e.target.value)}
                  placeholder="Meta Description"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={form.seoKeywords}
                  onChange={(e) => handleChange("seoKeywords", e.target.value)}
                  placeholder="keyword1, keyword2"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-2">
              <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!hasChanges || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Unsaved changes dialog */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
          </DialogHeader>
          <p>You have unsaved changes. Leave anyway?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>Stay</Button>
            <Button onClick={() => { setShowCancelConfirm(false); router.push("/admin/models/list"); }}>Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
