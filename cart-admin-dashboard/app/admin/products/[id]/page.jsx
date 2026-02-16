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
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { baseUrl } from "@/lib/const";

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Image preview state
  const [mainImage, setMainImage] = useState("");
  const [imagePreviews, setImagePreviews] = useState({
    imageOne: null,
    imageTwo: null,
    imageThree: null,
    imageFour: null,
  });
  const [imageFiles, setImageFiles] = useState({
    imageOne: null,
    imageTwo: null,
    imageThree: null,
    imageFour: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [productRes, brandsRes, modelsRes, typesRes] = await Promise.all([
          api.get(`/product/${id}`),
          api.get("/all-brands"),
          api.get("/all-models"),
          api.get("/all-product-types"),
        ]);

        const prod = productRes.data;
        setProduct(prod);
        setEditedProduct({ ...prod });

        // Set initial main image
        if (prod.imageOne) {
          setMainImage(prod.imageOne);
        } else if (prod.imageTwo) {
          setMainImage(prod.imageTwo);
        } else if (prod.imageThree) {
          setMainImage(prod.imageThree);
        } else if (prod.imageFour) {
          setMainImage(prod.imageFour);
        }

        // Set initial previews from URLs
        setImagePreviews({
          imageOne: prod.imageOne || null,
          imageTwo: prod.imageTwo || null,
          imageThree: prod.imageThree || null,
          imageFour: prod.imageFour || null,
        });

        setBrands(brandsRes.data);
        setModels(modelsRes.data);
        setProductTypes(typesRes.data);
      } catch (error) {
        toast.error("Failed to load product data");
        router.push("/admin/products/list");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const fetchModelsForBrand = async (brandId) => {
    if (!brandId) {
      setModels([]);
      return;
    }
    try {
      const res = await api.get(`/models?brandId=${brandId}`);
      setModels(res.data);
    } catch (error) {
      toast.error("Failed to load models");
    }
  };

  const handleFieldChange = (field, value) => {
    let processedValue = value;

    // Fields that should be parsed as float / decimal
    if (
      [
        "regularPrice",
        "salePrice",
        "weightLb",
        "lengthIn",
        "widthIn",
        "heightIn",
      ].includes(field)
    ) {
      processedValue = value === "" ? null : parseFloat(value);
      if (isNaN(processedValue)) processedValue = null;
    }
    // Integer fields
    else if (["stock", "brandId", "modelId", "typeId"].includes(field)) {
      processedValue = value === "" ? null : parseInt(value, 10);
      if (isNaN(processedValue)) processedValue = null;

      if (field === "brandId") {
        fetchModelsForBrand(processedValue);
        setEditedProduct((prev) => ({ ...prev, modelId: null }));
      }
    }
    // All other fields → string
    else {
      processedValue = value;
    }

    setEditedProduct((prev) => ({ ...prev, [field]: processedValue }));
    setHasChanges(true);
  };

  const handleImageChange = (field, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({ ...prev, [field]: reader.result }));

      setMainImage(reader.result); // Show new image as main
    };
    reader.readAsDataURL(file);

    setImageFiles((prev) => ({ ...prev, [field]: file }));
    setHasChanges(true);
  };

  const removeImage = (field) => {
    setImagePreviews((prev) => ({ ...prev, [field]: null }));
    setImageFiles((prev) => ({ ...prev, [field]: null }));
    setEditedProduct((prev) => ({ ...prev, [field]: null }));

    // Update main image to next available
    const remaining = Object.entries(imagePreviews)
      .filter(([k, v]) => k !== field && v)
      .map(([_, v]) => v);

    if (remaining.length > 0) {
      setMainImage(remaining[0]);
    } else {
      setMainImage("");
    }

    setHasChanges(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const updates = {};
      const fields = [
        "name",
        "stock",
        "regularPrice",
        "salePrice",
        "color",
        "brandId",
        "modelId",
        "typeId",
        "weightLb", // ← added
        "lengthIn", // ← added
        "widthIn", // ← added
        "heightIn", // ← added
        "description",
        "seoTitle",
        "seoDescription",
        "seoKeywords",
        "slug",
        "imgAltOne",
        "imgAltTwo",
        "imgAltThree",
        "imgAltFour",
      ];

      fields.forEach((field) => {
        if (editedProduct[field] !== product[field]) {
          updates[field] = editedProduct[field];
        }
      });

      // Handle image uploads (assuming your API supports multipart/form-data)
      const formData = new FormData();

      Object.keys(imageFiles).forEach((key) => {
        if (imageFiles[key]) {
          formData.append(key, imageFiles[key]);
        } else if (imagePreviews[key] === null && product[key]) {
          // If image was removed
          formData.append(`remove_${key}`, "true");
        }
      });

      // Append other fields
      Object.keys(updates).forEach((key) => {
        formData.append(key, updates[key]);
      });

      // Validation
      if (
        updates.regularPrice !== undefined &&
        (updates.regularPrice === null || updates.regularPrice < 0)
      ) {
        throw new Error("Regular price must be a positive number");
      }
      if (
        updates.salePrice !== undefined &&
        updates.salePrice !== null &&
        updates.salePrice < 0
      ) {
        throw new Error("Sale price must be a positive number");
      }
      if (updates.stock !== undefined && updates.stock < 0) {
        throw new Error("Stock cannot be negative");
      }
      if (editedProduct.brandId == null) {
        throw new Error("Brand is required");
      }
      if (editedProduct.modelId == null) {
        throw new Error("Model is required");
      }
      if (editedProduct.typeId == null) {
        throw new Error("Product type is required");
      }
      if (editedProduct.weightLb !== undefined && editedProduct.weightLb < 0) {
        throw new Error("Weight cannot be negative");
      }
      if (editedProduct.lengthIn !== undefined && editedProduct.lengthIn <= 0) {
        throw new Error("Length should be greater than 0");
      }
      // Only send if there are changes
      if (
        Object.keys(updates).length > 0 ||
        Object.values(imageFiles).some((f) => f) ||
        Object.values(imagePreviews).some(
          (v, i) => v === null && product[Object.keys(imagePreviews)[i]],
        )
      ) {
        await api.put(`/product/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Product updated successfully");
      setHasChanges(false);
      router.push("/admin/products/list");
    } catch (error) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      router.push("/admin/products/list");
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    router.push("/admin/products/list");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold">Edit Product: {product.name}</h2>

      {/* Product Details Form */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={editedProduct.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Brand */}
          <div>
            <Label htmlFor="brandId">Brand</Label>
            <Select
              value={editedProduct.brandId?.toString() || ""}
              onValueChange={(value) => handleFieldChange("brandId", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div>
            <Label htmlFor="modelId">Model</Label>
            <Select
              value={editedProduct.modelId?.toString() || ""}
              onValueChange={(value) => handleFieldChange("modelId", value)}
              disabled={!editedProduct.brandId || isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models
                  .filter((m) => m.brandId === editedProduct.brandId)
                  .map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Type */}
          <div>
            <Label htmlFor="typeId">Product Type</Label>
            <Select
              value={editedProduct.typeId?.toString() || ""}
              onValueChange={(value) => handleFieldChange("typeId", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div>
            <Label htmlFor="color">Color (Optional - for Enclosures)</Label>
            <Input
              id="color"
              value={editedProduct.color || ""}
              onChange={(e) => handleFieldChange("color", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Prices & Stock */}
          <div>
            <Label htmlFor="regularPrice">Regular Price ($)</Label>
            <Input
              id="regularPrice"
              type="number"
              step="0.01"
              min="0"
              value={editedProduct.regularPrice ?? ""}
              onChange={(e) =>
                handleFieldChange("regularPrice", e.target.value)
              }
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="salePrice">Sale Price ($)</Label>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              min="0"
              value={editedProduct.salePrice ?? ""}
              onChange={(e) => handleFieldChange("salePrice", e.target.value)}
              placeholder="Leave empty if no sale"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={editedProduct.stock ?? ""}
              onChange={(e) => handleFieldChange("stock", e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              value={editedProduct.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter product description, features, specifications..."
            />
          </div>
          <div>
            <Label htmlFor="weightLb" className="text-sm">
              Weight (lb)
            </Label>
            <Input
              id="weightLb"
              type="number"
              step="0.01"
              min="0"
              value={editedProduct.weightLb ?? ""}
              onChange={(e) => handleFieldChange("weightLb", e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. 4.75"
            />
          </div>
          <div>
            <Label htmlFor="lengthIn" className="text-sm">
              Length (in)
            </Label>
            <Input
              id="lengthIn"
              type="number"
              step="0.01"
              min="0"
              value={editedProduct.lengthIn ?? ""}
              onChange={(e) => handleFieldChange("lengthIn", e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. 12.50"
            />
          </div>
          <div>
            <Label htmlFor="widthIn" className="text-sm">
              Width (in)
            </Label>
            <Input
              id="widthIn"
              type="number"
              step="0.01"
              min="0"
              value={editedProduct.widthIn ?? ""}
              onChange={(e) => handleFieldChange("widthIn", e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. 8.25"
            />
          </div>
          <div>
            <Label htmlFor="heightIn" className="text-sm">
              Height (in)
            </Label>
            <Input
              id="heightIn"
              type="number"
              step="0.01"
              min="0"
              value={editedProduct.heightIn ?? ""}
              onChange={(e) => handleFieldChange("heightIn", e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. 3.00"
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-bold mb-4">SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={editedProduct.slug || ""}
                onChange={(e) => handleFieldChange("slug", e.target.value)}
                disabled={isSubmitting}
                placeholder="product-url-slug"
              />
            </div>
            <div>
              <Label htmlFor="seoTitle">Meta Title</Label>
              <Input
                id="seoTitle"
                value={editedProduct.seoTitle || ""}
                onChange={(e) => handleFieldChange("seoTitle", e.target.value)}
                disabled={isSubmitting}
                placeholder="SEO Title"
              />
            </div>
            <div>
              <Label htmlFor="seoKeywords">Meta Keywords</Label>
              <Input
                id="seoKeywords"
                value={editedProduct.seoKeywords || ""}
                onChange={(e) => handleFieldChange("seoKeywords", e.target.value)}
                disabled={isSubmitting}
                placeholder="keyword1, keyword2"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="seoDescription">Meta Description</Label>
              <Textarea
                id="seoDescription"
                rows={3}
                value={editedProduct.seoDescription || ""}
                onChange={(e) => handleFieldChange("seoDescription", e.target.value)}
                disabled={isSubmitting}
                placeholder="SEO Description"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Image Preview Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Product Images</h3>

        {/* Main Image */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6 border-2 border-dashed border-gray-300">
          {mainImage.startsWith("data:") ? (
            <Image
              src={mainImage}
              alt="Main product"
              fill
              className="object-cover"
            />
          ) : mainImage ? (
            <Image
              src={`https://api.clubpromfg.com/uploads/products/${mainImage}`}
              alt="Main product"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ImageIcon className="w-16 h-16 mb-4" />
              <p>No image selected</p>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-4">
          {["imageOne", "imageTwo", "imageThree", "imageFour"].map((field) => {
            const previewSrc = imagePreviews[field]?.startsWith("data:")
              ? imagePreviews[field]
              : `https://api.clubpromfg.com/uploads/products/${imagePreviews[field]}`;

            return (
              <div key={field} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                  {imagePreviews[field] ? (
                    <>
                      <Image
                        src={previewSrc}
                        alt={`Preview ${field}`}
                        fill
                        className="object-cover cursor-pointer hover:opacity-80 transition"
                        onClick={() => setMainImage(imagePreviews[field])}
                      />
                      <button
                        onClick={() => removeImage(field)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer hover:bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(field, e.target.files[0])
                        }
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>
                {imagePreviews[field] && (
                  <div className="mt-2 text-xs">
                    <Label className="text-[10px] uppercase text-gray-400">Alt Text</Label>
                    <Input
                      placeholder="Image description"
                      value={editedProduct[`imgAlt${field.replace('image', '')}`] || ""}
                      onChange={(e) => handleFieldChange(`imgAlt${field.replace('image', '')}`, e.target.value)}
                      className="h-7 text-xs px-2"
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-10">
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

      {/* Cancel Confirmation */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
          </DialogHeader>
          <p>You have unsaved changes. Are you sure you want to leave?</p>
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
