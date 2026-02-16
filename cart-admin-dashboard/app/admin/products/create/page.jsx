"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import { X, Upload, Image as ImageIcon } from "lucide-react";

// Updated schema to include images (files)
const productSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  regularPrice: z.coerce.number().min(0.01, "Regular price must be greater than 0"),
  salePrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  brandId: z.string().min(1, "Brand is required"),
  modelId: z.string().min(1, "Model is required"),
  typeId: z.string().min(1, "Product type is required"),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  weightLb: z.coerce.number().min(0).optional(),
  lengthIn: z.coerce.number().min(0).optional(),
  widthIn: z.coerce.number().min(0).optional(),
  heightIn: z.coerce.number().min(0).optional(),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  slug: z.string().min(1, "Slug is required").trim(),
  imgAltOne: z.string().optional().nullable(),
  imgAltTwo: z.string().optional().nullable(),
  imgAltThree: z.string().optional().nullable(),
  imgAltFour: z.string().optional().nullable(),
  images: z
    .array(z.instanceof(File))
    .max(4, "Maximum 4 images allowed")
    .optional()
    .refine((files) => files === undefined || files.length > 0, {
      message: "At least one image is recommended",
    }),
});

export default function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [imagePreviews, setImagePreviews] = useState([]);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      regularPrice: "",
      salePrice: "",
      stock: "",
      brandId: "",
      modelId: "",
      typeId: "",
      color: "",
      images: [],
      lengthIn: "",
      widthIn: "",
      heightIn: "",
      weightLb: "",
      description: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      slug: "",
      imgAltOne: "",
      imgAltTwo: "",
      imgAltThree: "",
      imgAltFour: "",
    },
  });

  const watchedName = form.watch("name");
  const watchedTypeId = form.watch("typeId");
  const watchedImages = form.watch("images");

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchedName, form]);

  // Update image previews when files change
  useEffect(() => {
    if (!watchedImages || watchedImages.length === 0) {
      setImagePreviews([]);
      return;
    }

    const previews = watchedImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Cleanup old object URLs
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [watchedImages]);

  // Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get("/brands?limit=1000");
        setBrands(res.data.data || []);
      } catch (error) {
        toast.error("Failed to load brands");
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

  // Fetch Product Types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get("/product-types?limit=100");
        setProductTypes(res.data.data || []);
      } catch (error) {
        toast.error("Failed to load product types");
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  // Fetch Models when Brand changes
  const watchedBrandId = form.watch("brandId");
  useEffect(() => {
    if (!watchedBrandId) {
      setModels([]);
      form.setValue("modelId", "");
      return;
    }

    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const res = await api.get(`/brands/${watchedBrandId}`);
        setModels(res.data.models || res.data || []);
      } catch (error) {
        toast.error("Failed to load models for this brand");
        setModels([]);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [watchedBrandId]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append text fields
      formData.append("name", data.name.trim());
      formData.append("regularPrice", parseFloat(data.regularPrice));
      if (data.salePrice) formData.append("salePrice", parseFloat(data.salePrice));
      formData.append("stock", data.stock ? parseInt(data.stock) : 0);
      formData.append("brandId", Number(data.brandId));
      formData.append("modelId", Number(data.modelId));
      formData.append("typeId", Number(data.typeId));
      if (data.color) formData.append("color", data.color);
      if (data.description) formData.append("description", data.description);
      if (data.weightLb) formData.append("weightLb", parseFloat(data.weightLb));
      if (data.lengthIn) formData.append("lengthIn", parseFloat(data.lengthIn));
      if (data.widthIn) formData.append("widthIn", parseFloat(data.widthIn));
      if (data.heightIn) formData.append("heightIn", parseFloat(data.heightIn));
      if (data.seoTitle) formData.append("seoTitle", data.seoTitle);
      if (data.seoDescription) formData.append("seoDescription", data.seoDescription);
      if (data.seoKeywords) formData.append("seoKeywords", data.seoKeywords);
      if (data.slug) formData.append("slug", data.slug);
      if (data.imgAltOne) formData.append("imgAltOne", data.imgAltOne);
      if (data.imgAltTwo) formData.append("imgAltTwo", data.imgAltTwo);
      if (data.imgAltThree) formData.append("imgAltThree", data.imgAltThree);
      if (data.imgAltFour) formData.append("imgAltFour", data.imgAltFour);

      // Append images (up to 4)
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          formData.append("images", image); // backend should handle multiple files with same key
        });
      }

      await api.post("/create-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully!");
      form.reset();
      setImagePreviews([]);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to create product. Please check all fields and images."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEnclosure = () => {
    const selectedType = productTypes.find((t) => String(t.id) === watchedTypeId);
    return selectedType?.name === "Enclosure";
  };

  const handleImageRemove = (index) => {
    const newImages = watchedImages.filter((_, i) => i !== index);
    form.setValue("images", newImages.length > 0 ? newImages : undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Yamaha Drive2 PTV" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Description </FormLabel>
                      <FormControl>
                        <Input placeholder="Product Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="regularPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regular Price (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="12999.99" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Price (USD) - Optional</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="11999.99"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="5 (defaults to 0)"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lengthIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (inches)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="5 (defaults to 0)"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="widthIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width (inches)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="5 (defaults to 0)"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heightIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (inches)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="5 (defaults to 0)"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightLb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight in (pounds)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="5 (defaults to 0)"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Images Upload */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Images (up to 4)</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="image-upload"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 4) {
                                toast.error("Maximum 4 images allowed");
                                return;
                              }
                              const current = watchedImages || [];
                              const combined = [...current, ...files].slice(0, 4);
                              field.onChange(combined);
                            }}
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center gap-3"
                          >
                            <Upload className="w-10 h-10 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Click to upload images or drag & drop
                            </span>
                            <span className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB each
                            </span>
                          </label>
                        </div>
                      </FormControl>

                      {/* Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => handleImageRemove(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="text-center text-sm mt-1">
                                Image {index + 1}
                              </div>
                              <div className="mt-2">
                                <Input
                                  placeholder={`Alt text for image ${index + 1}`}
                                  {...form.register(`imgAlt${index === 0 ? "One" : index === 1 ? "Two" : index === 2 ? "Three" : "Four"}`)}
                                  className="text-xs h-7"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {imagePreviews.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          <ImageIcon className="w-5 h-5 inline mr-1" />
                          No images selected yet
                        </p>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Brand */}
                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("modelId", "");
                        }}
                        value={field.value}
                        disabled={loadingBrands}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={loadingBrands ? "Loading brands..." : "Select a brand"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={String(brand.id)}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Model */}
                <FormField
                  control={form.control}
                  name="modelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!watchedBrandId || loadingModels || models.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !watchedBrandId
                                  ? "Select a brand first"
                                  : loadingModels
                                    ? "Loading models..."
                                    : models.length === 0
                                      ? "No models available"
                                      : "Select a model"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={String(model.id)}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product Type */}
                <FormField
                  control={form.control}
                  name="typeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (!isEnclosure()) {
                            form.setValue("color", "");
                          }
                        }}
                        value={field.value}
                        disabled={loadingTypes}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={loadingTypes ? "Loading types..." : "Select product type"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productTypes.map((type) => (
                            <SelectItem key={type.id} value={String(type.id)}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Color - Only for Enclosure */}
                {isEnclosure() && (
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color (Required for Enclosure)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Sapphire Blue, Carbon Fiber"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* SEO Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="product-url-slug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO Description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seoKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Keywords</FormLabel>
                          <FormControl>
                            <Input placeholder="keyword1, keyword2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || loadingBrands || loadingTypes}
                >
                  {isSubmitting ? "Creating Product..." : "Create Product"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}