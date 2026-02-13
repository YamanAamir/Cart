"use client";

import { useState } from "react";
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

/* ---------------- SCHEMA ---------------- */
const statsCardSchema = z.object({
    title: z.string().min(1, "Title is required"),
    value: z.string().min(1, "Value is required"),
});

export default function AddStatsCard() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(statsCardSchema),
        defaultValues: {
            title: "",
            value: "",
        },
    });

    /* ---------------- SUBMIT ---------------- */
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            await api.post("/stats-cards/create", data);

            toast.success("Stats card created successfully");
            form.reset();
        } catch (error) {
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
                        <CardTitle className="text-2xl font-bold">
                            Create Stats Card
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {/* Title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Complimentary Shipping" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Value */}
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Value / Description</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. Free delivery on all orders"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating..." : "Create Stats Card"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
