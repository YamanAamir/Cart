"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, formDataApi } from "@/lib/api";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API?.replace("/api", "") || "https://api.clubpromfg.com";

export default function AddStatsCard() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [form, setForm] = useState({ title: "", value: "", link: "" });
    const fileRef = useRef(null);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setImagePreview(URL.createObjectURL(file));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.value) return toast.error("Title and Value are required");

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("value", form.value);
            if (form.link) formData.append("link", form.link);
            if (fileRef.current?.files[0]) formData.append("image", fileRef.current.files[0]);

            await formDataApi.post("/stats-cards/create", formData);

            toast.success("Stats card created successfully");
            setForm({ title: "", value: "", link: "" });
            setImagePreview(null);
            if (fileRef.current) fileRef.current.value = "";
        } catch {
            toast.error("Failed to create stats card");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto p-4 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Create Stats Card</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" placeholder="e.g. Free Shipping" value={form.title} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="value">Value / Description</Label>
                                <Input id="value" name="value" placeholder="e.g. Free delivery on all orders" value={form.value} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="link">Link (optional)</Label>
                                <Input id="link" name="link" placeholder="e.g. https://example.com" value={form.link} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Icon / Image (optional)</Label>
                                <Input id="image" name="image" type="file" accept="image/*" ref={fileRef} onChange={handleImageChange} />
                                {imagePreview && (
                                    <div className="mt-2 w-16 h-16 rounded-full bg-amber-100 overflow-hidden flex items-center justify-center">
                                        <img src={imagePreview} alt="preview" className="w-full h-full object-contain p-1" />
                                    </div>
                                )}
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Stats Card"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
