"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X, Upload } from "lucide-react";
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

export default function HeroSectionDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [hero, setHero] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    ctaTextOne: "",
    ctaLinkOne: "",
    ctaTextTwo: "",
    ctaLinkTwo: "",
    imgAlt: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const fileInputRef = useRef(null);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    if (!id) return;

    const fetchHero = async () => {
      try {
        const res = await api.get(`/hero-section/${id}/show`);
        const data = res.data.data;
        setHero(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
          ctaTextOne: data.ctaTextOne || "",
          ctaLinkOne: data.ctaLinkOne || "",
          ctaTextTwo: data.ctaTextTwo || "",
          ctaLinkTwo: data.ctaLinkTwo || "",
          imgAlt: data.imgAlt || "",
          isActive: data.isActive ?? true,
        });
        setImagePreview(data.imageUrl);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load hero section");
        router.push("/admin/hero-sections/list");
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, [id, router]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("ctaTextOne", form.ctaTextOne);
      formData.append("ctaLinkOne", form.ctaLinkOne);
      formData.append("ctaTextTwo", form.ctaTextTwo);
      formData.append("ctaLinkTwo", form.ctaLinkTwo);
      formData.append("imgAlt", form.imgAlt);
      formData.append("isActive", form.isActive);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await formDataApi.put(`/hero-section/${id}/update`, formData);

      toast.success("Hero section updated");
      router.push("/admin/hero-sections/list");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/hero-sections/list");
  };

  /* ---------------- STATES ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hero) {
    return <div className="text-center py-10">Hero section not found</div>;
  }

  return (
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold">
        Edit Hero Section
      </h2>

      <Card className="p-6 space-y-6 bg-white">
        <div>
          <Label className="text-sm font-semibold">Title *</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold">Description</Label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label className="text-sm font-semibold">Background Image</Label>
          <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium">Click to change image</span>
            </label>
          </div>

          {/* Preview */}
          {imagePreview && (
            <div className="mt-4 relative inline-block">
              <img
                src={imagePreview.startsWith('blob:') ? imagePreview : `${api.defaults.baseURL.replace('/api', '')}${imagePreview}`}
                alt="Preview"
                className="h-40 rounded-lg object-cover border"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Image Alt */}
        <div>
          <Label className="text-sm font-semibold">Image Alt Text (SEO)</Label>
          <Input
            name="imgAlt"
            placeholder="e.g. Luxury golf cart in sunset"
            value={form.imgAlt}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold">CTA Button 1 Text</Label>
            <Input
              name="ctaTextOne"
              value={form.ctaTextOne}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">CTA Button 1 Link</Label>
            <Input
              name="ctaLinkOne"
              value={form.ctaLinkOne}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold">CTA Button 2 Text</Label>
            <Input
              name="ctaTextTwo"
              value={form.ctaTextTwo}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold">CTA Button 2 Link</Label>
            <Input
              name="ctaLinkTwo"
              value={form.ctaLinkTwo}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-1"
            />
          </div>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

