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
import { toast } from "sonner";
import api from "@/lib/api";

const productTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Type name is required")
    .trim()
    .refine(
      (val) => ["Soft Goods", "Accessories", "Hard Goods", "Enclosure"].includes(val),
      {
        message: "Must be one of: Soft Goods, Accessories, Hard Goods, Enclosure",
      }
    ),
});

export default function AddProductTypes() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(productTypeSchema),
    defaultValues: {
      name: "",
    },
  });

  const validTypes = ["Soft Goods", "Accessories", "Hard Goods", "Enclosure"];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post("/product-types", { name: data.name.trim() });

      toast.success("Product type created successfully!");
      form.reset();
    } catch (error) {
      console.error("Error creating product type:", error);
      toast.error(
        error.response?.data?.message || "Failed to create product type. It might already exist."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New Product Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Accessories"
                          list="product-type-suggestions"
                          {...field}
                        />
                      </FormControl>
                      <datalist id="product-type-suggestions">
                        {validTypes.map((type) => (
                          <option key={type} value={type} />
                        ))}
                      </datalist>
                      <p className="text-sm text-muted-foreground mt-2">
                        Allowed: Soft Goods, Accessories, Hard Goods, Enclosure
                      </p>
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
                  {isSubmitting ? "Creating Type..." : "Create Product Type"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}