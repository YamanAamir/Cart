"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ImageFormModal({ isOpen, onClose, title, defaultValues, flag }) {
  const [images, setImages] = useState(defaultValues.ProductImage || []);
  const [newFiles, setNewFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log("defaultValues.ProductImage:", defaultValues.ProductImage);
    setImages(defaultValues.ProductImage || []);
  }, [defaultValues.ProductImage]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const resizeImage = (file, targetWidth, targetHeight) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Calculate scaling to maintain aspect ratio
        const aspectRatio = img.width / img.height;
        let newWidth = targetWidth;
        let newHeight = targetHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (aspectRatio > 1) {
          // Image is wider than tall
          newHeight = targetWidth / aspectRatio;
          offsetY = (targetHeight - newHeight) / 2;
        } else {
          // Image is taller than wide
          newWidth = targetHeight * aspectRatio;
          offsetX = (targetWidth - newWidth) / 2;
        }

        // Clear canvas and draw resized image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Failed to create blob from canvas"));
            }
          },
          file.type,
          0.9
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (files) => {
    const validFiles = Array.from(files).filter((file) => {
      const isValidType = 
      [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/svg+xml",
        "image/x-icon",
        "image/heic",
        "image/heif",
        "image/avif"
      ].includes(file.type);
      if (!isValidType) toast.error(`${file.name} is not a valid image`);
      return isValidType;
    });

    if (images.length + newFiles.length + validFiles.length > 7) {
      toast.error("Maximum 7 images allowed per product");
      return;
    }

    const resizedFiles = await Promise.all(
      validFiles.map(async (file) => {
        try {
          const resizedFile = await resizeImage(file, 600, 600);
          return resizedFile;
        } catch (error) {
          toast.error(`Failed to resize ${file.name}`);
          return null;
        }
      })
    );

    const validResizedFiles = resizedFiles.filter((file) => file !== null);
    setNewFiles((prev) => [...prev, ...validResizedFiles]);
    console.log("newFiles updated:", [...newFiles, ...validResizedFiles]);
  };

  const handleInputChange = (event) => {
    handleFileChange(event.target.files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    handleFileChange(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDeleteImage = async (id) => {
    try {
      await api.delete(`/delete-image/${id}`);
      setImages((prev) => {
        const updatedImages = prev.filter((img) => img.id !== id);
        console.log("Images after deletion:", updatedImages);
        flag(updatedImages);
        return updatedImages;
      });
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image: " + (error.response?.data?.message || error.message));
    }
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      console.log("newFiles after removal:", updatedFiles);
      return updatedFiles;
    });
    toast.success("Preview image removed");
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updatedImages = [...images];
      if (newFiles.length > 0) {
        const formData = new FormData();
        formData.append("product_id", defaultValues.id);
        newFiles.forEach((file) => formData.append("images", file));

        const response = await api.post("/create-product-images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("API response:", response.data);
        const uploadedImages = response.data.uploaded.map((img) => ({
          id: img.id || img.image_id,
          url: img.url || img.image_url,
          isNew: true,
        }));

        updatedImages.push(...uploadedImages);
      } else {
        toast.info("No new images to upload");
      }

      // Update parent with the combined images
      flag(updatedImages);
      setImages(updatedImages);
      setNewFiles([]);
      toast.success("Images updated successfully");
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error(error.response?.data?.message || "Failed to upload images");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg md:max-w-4xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Upload or manage product images. Drag and drop or click to upload up to 7 images (Auto resized to 600x600px).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <Label className="text-base sm:text-lg font-medium">Current Images</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.length === 0 ? (
              <p className="text-sm sm:text-base text-muted-foreground">No images available</p>
            ) : (
              images.map((img) => (
                <Card key={img.id} className="p-2 relative">
                  <img
                    src={img.url}
                    alt="Product image"
                    className="w-full h-32 sm:h-40 object-contain rounded"
                    onError={() => console.error(`Failed to load image: ${img.url}`)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => handleDeleteImage(img.id)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))
            )}
          </div>
          <Label className="text-base sm:text-lg font-medium">Add New Images (Auto Resized to 600x600px)</Label>
          <div
            className={`border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging ? "bg-muted/50 border-muted-foreground/50" : ""
            }`}
            onClick={handleFileSelect}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm sm:text-base text-muted-foreground mb-1">Drag and drop or click to upload</p>
            <p className="text-xs sm:text-sm text-muted-foreground">(Max 7 images, Auto resized to 600x600px)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml,image/x-icon,image/heic,image/heif,image/avif"
            onChange={handleInputChange}
            className="sr-only"
            disabled={isSubmitting}
          />
          {newFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {newFiles.map((file, index) => (
                <Card key={index} className="p-2 relative">
                  <img src={URL.createObjectURL(file)} alt="New image" className="w-full h-32 sm:h-40 object-contain rounded" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => handleRemoveNewFile(index)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              {isSubmitting ? "Saving..." : "Save Images"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}