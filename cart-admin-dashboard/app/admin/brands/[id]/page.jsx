"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { ArrowLeft, Upload, X } from "lucide-react";

export default function EditBrand() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [brand, setBrand] = useState({
    name: "",
    logo: "", // current logo URL

    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    slug: "",
    imgAlt: "",
  });

  const [previewLogo, setPreviewLogo] = useState(""); // for new uploaded image preview
  const [newLogoFile, setNewLogoFile] = useState(null); // file object to send
  const fileInputRef = useRef(null);

  // Fetch brand data
  useEffect(() => {
    const fetchBrand = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/brands/${id}`);
        const brandData = res.data; // assuming response is { name, logo, ... }

        setBrand({
          name: brandData.name || "",
          logo: brandData.logo || "",
          seoTitle: brandData.seoTitle || "",
          seoDescription: brandData.seoDescription || "",
          seoKeywords: brandData.seoKeywords || "",
          slug: brandData.slug || "",
          imgAlt: brandData.imgAlt || "",
        });
        setPreviewLogo(brandData.logo || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load brand");
        router.push("/admin/brands/list");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setNewLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeNewLogo = () => {
    setNewLogoFile(null);
    setPreviewLogo(brand.logo || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brand.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    setSubmitting(true);

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("name", brand.name.trim());

      if (newLogoFile) {
        formData.append("logo", newLogoFile); // field name must match multer: .single('logo')
      }
      formData.append("seoTitle", brand.seoTitle || "");
      formData.append("seoDescription", brand.seoDescription || "");
      formData.append("seoKeywords", brand.seoKeywords || "");
      formData.append("slug", brand.slug || "");
      formData.append("imgAlt", brand.imgAlt || "");

      await api.put(`/brands/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Brand updated successfully");
      router.push("/admin/brands/list");
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to update brand";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (e) => {
    const { id, value } = e.target;
    setBrand((prev) => ({ ...prev, [id]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/brands/list")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Brand Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name *</Label>
              <Input
                id="name"
                value={brand.name}
                onChange={handleFieldChange}
                placeholder="e.g. Nike"
                required
              />
              <p className="text-sm text-muted-foreground">
                Unique name for the brand
              </p>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Logo</Label>

              {/* Current / Preview Image */}
              {previewLogo ? (
                <div className="relative inline-block">
                  <img
                    src={previewLogo.includes('base64') ? previewLogo : `http://localhost:5000${previewLogo}`}
                    alt="Brand logo preview"
                    className="h-40 w-auto rounded-lg border object-contain bg-gray-50 shadow-sm"
                  />
                  {newLogoFile && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full"
                      onClick={removeNewLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="h-40 w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  <p className="text-gray-500">No logo uploaded</p>
                </div>
              )}

              {/* Upload Button */}
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                  disabled={submitting}
                >
                  <Upload className="h-4 w-4" />
                  {newLogoFile ? "Change Logo" : "Upload New Logo"}
                </Button>
                {newLogoFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {newLogoFile.name}
                  </p>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                Recommended: Square image (e.g. 512x512), PNG or JPG, max 5MB
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imgAlt">Logo Alt Text (SEO)</Label>
              <Input
                id="imgAlt"
                value={brand.imgAlt}
                onChange={handleFieldChange}
                placeholder="e.g. Yamaha logo white background"
              />
            </div>

            {/* SEO Section */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold">SEO Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={brand.slug}
                  onChange={handleFieldChange}
                  placeholder="e.g. yamaha-parts"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={brand.seoTitle}
                  onChange={handleFieldChange}
                  placeholder="Meta Title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Input
                  id="seoDescription"
                  value={brand.seoDescription}
                  onChange={handleFieldChange}
                  placeholder="Meta Description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={brand.seoKeywords}
                  onChange={handleFieldChange}
                  placeholder="keyword1, keyword2"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push("/admin/brands/list")}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}