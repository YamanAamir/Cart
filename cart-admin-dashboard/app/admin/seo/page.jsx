"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function StaticPageSeo() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedPage, setSelectedPage] = useState("home");
    const [seoData, setSeoData] = useState({
        home: { seoTitle: "", seoDescription: "", seoKeywords: "", slug: "home" },
        shop: { seoTitle: "", seoDescription: "", seoKeywords: "", slug: "shop" },
        contact: { seoTitle: "", seoDescription: "", seoKeywords: "", slug: "contact" },
    });

    useEffect(() => {
        const fetchSeo = async () => {
            try {
                const res = await api.get("/seo");
                const data = res.data;
                const newSeoData = { ...seoData };
                data.forEach((item) => {
                    if (newSeoData[item.pageName]) {
                        newSeoData[item.pageName] = {
                            seoTitle: item.seoTitle || "",
                            seoDescription: item.seoDescription || "",
                            seoKeywords: item.seoKeywords || "",
                            slug: item.slug || item.pageName,
                        };
                    }
                });
                setSeoData(newSeoData);
            } catch (err) {
                console.error("Failed to load SEO", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSeo();
    }, []);

    const handleFieldChange = (page, field, value) => {
        setSeoData((prev) => ({
            ...prev,
            [page]: {
                ...prev[page],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (page) => {
        setSubmitting(true);
        try {
            await api.post(`/seo/${page}`, seoData[page]);
            toast.success(`${page.charAt(0).toUpperCase() + page.slice(1)} SEO updated successfully`);
        } catch (err) {
            toast.error("Failed to update SEO");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner size="lg" />;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Static Page SEO</h1>

            <div className="mb-6">
                <Label htmlFor="page-select" className="mb-2 block">Select Page to Edit SEO</Label>
                <Select value={selectedPage} onValueChange={(value) => setSelectedPage(value)}>
                    <SelectTrigger id="page-select" className="w-full sm:w-[240px]">
                        <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="home">Home Page</SelectItem>
                        <SelectItem value="shop">Shop Page</SelectItem>
                        <SelectItem value="contact">Contact Page</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="capitalize">{selectedPage} Page SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${selectedPage}-slug`}>URL Slug</Label>
                        <Input
                            id={`${selectedPage}-slug`}
                            value={seoData[selectedPage].slug}
                            onChange={(e) => handleFieldChange(selectedPage, "slug", e.target.value)}
                            placeholder="e.g. home"
                            disabled={selectedPage === 'home'}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${selectedPage}-title`}>SEO Title</Label>
                        <Input
                            id={`${selectedPage}-title`}
                            value={seoData[selectedPage].seoTitle}
                            onChange={(e) => handleFieldChange(selectedPage, "seoTitle", e.target.value)}
                            placeholder="Meta Title"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${selectedPage}-desc`}>SEO Description</Label>
                        <Input
                            id={`${selectedPage}-desc`}
                            value={seoData[selectedPage].seoDescription}
                            onChange={(e) => handleFieldChange(selectedPage, "seoDescription", e.target.value)}
                            placeholder="Meta Description"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${selectedPage}-keywords`}>SEO Keywords</Label>
                        <Input
                            id={`${selectedPage}-keywords`}
                            value={seoData[selectedPage].seoKeywords}
                            onChange={(e) => handleFieldChange(selectedPage, "seoKeywords", e.target.value)}
                            placeholder="keyword1, keyword2"
                        />
                    </div>
                    <Button
                        onClick={() => handleSubmit(selectedPage)}
                        disabled={submitting}
                        className="w-full"
                    >
                        {submitting ? "Saving..." : "Save SEO Settings"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
