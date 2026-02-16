"use client";

import { api, formDataApi } from "@/lib/api";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSectionForm() {
    const router = useRouter();
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
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

    const onSubmit = async () => {
        if (!form.title) {
            toast.error("Title is required");
            return;
        }

        try {
            setIsSubmitting(true);
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

            await formDataApi.post("/hero-section/create", formData);

            toast.success("Hero section created successfully");
            router.push("/admin/hero-sections/list");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create hero section");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-8">
            <h2 className="text-2xl font-semibold">
                Create Hero Section
            </h2>

            <div className="space-y-5">
                {/* Title */}
                <div>
                    <label className="block font-medium mb-1 text-sm">Title *</label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="Enter catchy headline"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block font-medium mb-1 text-sm">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="Sub-headline or brief detail"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block font-medium mb-1 text-sm">Background Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                            <span className="text-sm font-medium">Click to upload image</span>
                            <span className="text-xs text-gray-500">JPG, PNG or WEBP up to 5MB</span>
                        </label>
                    </div>

                    {/* Preview */}
                    {imagePreview && (
                        <div className="mt-4 relative inline-block">
                            <img
                                src={imagePreview}
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
                    <label className="block font-medium mb-1 text-sm">Image Alt Text (SEO)</label>
                    <input
                        type="text"
                        name="imgAlt"
                        placeholder="e.g. Luxury golf cart in sunset"
                        value={form.imgAlt}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* CTA 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1 text-sm">CTA Button 1 Text</label>
                        <input
                            type="text"
                            name="ctaTextOne"
                            placeholder="e.g. Shop Now"
                            value={form.ctaTextOne}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1 text-sm">CTA Button 1 Link</label>
                        <input
                            type="text"
                            name="ctaLinkOne"
                            placeholder="e.g. /shop"
                            value={form.ctaLinkOne}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>
                </div>

                {/* CTA 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1 text-sm">CTA Button 2 Text</label>
                        <input
                            type="text"
                            name="ctaTextTwo"
                            placeholder="e.g. Learn More"
                            value={form.ctaTextTwo}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1 text-sm">CTA Button 2 Link</label>
                        <input
                            type="text"
                            name="ctaLinkTwo"
                            placeholder="e.g. /about"
                            value={form.ctaLinkTwo}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>
                </div>

                {/* Submit */}
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-6 rounded-lg text-lg font-bold hover:bg-black/90"
                >
                    {isSubmitting ? "Creating..." : "Create Hero Section"}
                </Button>
            </div>
        </div>
    );
}
