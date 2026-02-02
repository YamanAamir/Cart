"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import api from '@/lib/api'

export default function FormModal({ isOpen, onClose, title, schema, defaultValues, onSubmit, fields, isLoading }) {
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      category_id: defaultValues.category_id?.toString() || '',
      subcategory_id: defaultValues.subcategory_id?.toString() || '',
    },
  })

  const fetchSubCategories = async (categoryId) => {
    if (categoryId && !isNaN(categoryId)) {
      try {
        const res = await api.get(`/plain-subcategories/${categoryId}`);
        setSubCategoryOptions(res.data.map(sub => ({ value: sub.id.toString(), label: sub.name })));
      } catch (error) {
        setSubCategoryOptions([]);
      }
    } else {
      setSubCategoryOptions([]);
    }
  }

  useEffect(() => {
    form.reset({
      ...defaultValues,
      category_id: defaultValues.category_id?.toString() || '',
      subcategory_id: defaultValues.subcategory_id?.toString() || '',
    });
    if (defaultValues.category_id) {
      fetchSubCategories(defaultValues.category_id);
    }
  }, [defaultValues, form]);

  // Update subcategory field options
  const subField = fields.find(f => f.name === 'subcategory_id');
  if (subField) {
    subField.options = subCategoryOptions;
    subField.disabled = !subCategoryOptions.length;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {(() => {
                          switch (field.type) {
                            case "text":
                              return <Input placeholder={field.placeholder} {...formField} />
                            case "textarea":
                              return <Textarea placeholder={field.placeholder} {...formField} />
                            case "switch":
                              return <Switch checked={formField.value} onCheckedChange={formField.onChange} />
                            case "select":
                              return (
                                <Select
                                  onValueChange={(value) => {
                                    const parsedValue = field.name.includes('id') ? parseInt(value, 10) || null : value;
                                    formField.onChange(parsedValue);
                                    if (field.name === 'category_id') {
                                      fetchSubCategories(parsedValue);
                                      form.setValue('subcategory_id', null);
                                      if (field.onChange) field.onChange(parsedValue);
                                    }
                                  }}
                                  value={formField.value?.toString() || ''}
                                  disabled={field.disabled}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )
                            default:
                              return null
                          }
                        })()}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}