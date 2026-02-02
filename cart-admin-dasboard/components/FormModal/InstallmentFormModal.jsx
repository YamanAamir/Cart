"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import api from '@/lib/api'
import { toast } from "sonner"

const installmentSchema = z.object({
  id: z.number().optional(),
  totalPrice: z.number().min(1, "Total price must be greater than 0"),
  monthlyAmount: z.number().min(1, "Monthly amount must be greater than 0"),
  months: z.number().min(1, "Months must be at least 1"),
  advance: z.number().min(0, "Advance cannot be negative"),
  isActive: z.boolean().default(true),
})

const formSchema = z.object({
  ProductInstallments: z.array(installmentSchema),
})

export default function InstallmentFormModal({ isOpen, onClose, title, defaultValues, flag }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ProductInstallments: defaultValues.ProductInstallments?.length > 0 
        ? defaultValues.ProductInstallments.map(ins => ({
            id: ins.id,
            totalPrice: Number(ins.totalPrice) || 0,
            monthlyAmount: Number(ins.monthlyAmount) || 0,
            months: Number(ins.months) || 1,
            advance: Number(ins.advance) || 0,
            isActive: Boolean(ins.isActive),
          }))
        : [{ totalPrice: 0, monthlyAmount: 0, months: 1, advance: 0, isActive: true }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ProductInstallments",
  })

  const calculateInstallment = (index, fieldName) => {
    const installment = form.getValues(`ProductInstallments.${index}`)
    const { monthlyAmount, months, advance } = installment
    if (fieldName === "monthlyAmount" || fieldName === "months" || fieldName === "advance") {
      const totalPrice = (Number(monthlyAmount) * Number(months)) + Number(advance)
      form.setValue(`ProductInstallments.${index}.totalPrice`, Number(totalPrice.toFixed(2)))
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const validInstallments = data.ProductInstallments.filter(ins => {
        return (
          !isNaN(ins.totalPrice) && ins.totalPrice > 0 &&
          !isNaN(ins.monthlyAmount) && ins.monthlyAmount > 0 &&
          !isNaN(ins.months) && ins.months >= 1 &&
          !isNaN(ins.advance) && ins.advance >= 0
        );
      }).map(ins => ({
        id: ins.id,
        product_id: defaultValues.id,
        totalPrice: Number(ins.totalPrice),
        monthlyAmount: Number(ins.monthlyAmount),
        months: Number(ins.months),
        advance: Number(ins.advance),
        isActive: Boolean(ins.isActive),
      }));

      if (validInstallments.length === 0) {
        toast.error("No valid installment plans to update");
        return;
      }

      await api.put('/create-product-installment', { ProductInstallments: validInstallments });
      toast.success("Installment plans updated successfully");
      flag(validInstallments); // Pass updated installments back
      onClose();
    } catch (error) {
      toast.error("Failed to update installment plans: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md sm:max-w-lg md:max-w-4xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Manage installment plans for the product. Ensure all fields are valid before saving.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Label className="text-base sm:text-lg font-medium">Installment Plans</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ totalPrice: 0, monthlyAmount: 0, months: 1, advance: 0, isActive: true })}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Plan
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <h4 className="font-medium text-sm sm:text-base">Plan {index + 1}</h4>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <FormField
                        control={form.control}
                        name={`ProductInstallments.${index}.isActive`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel className="text-xs sm:text-sm">Active</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {fields.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => remove(index)}
                          disabled={isSubmitting}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name={`ProductInstallments.${index}.totalPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Total Price (RS)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              readOnly 
                              className="bg-muted text-xs sm:text-sm" 
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ProductInstallments.${index}.monthlyAmount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Monthly Amount (RS)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(Number(e.target.value) || 0)
                                calculateInstallment(index, "monthlyAmount")
                              }} 
                              disabled={isSubmitting}
                              className="text-xs sm:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ProductInstallments.${index}.months`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Months</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(Number(e.target.value) || 1)
                                calculateInstallment(index, "months")
                              }} 
                              disabled={isSubmitting}
                              className="text-xs sm:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ProductInstallments.${index}.advance`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm">Advance (RS)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(Number(e.target.value) || 0)
                                calculateInstallment(index, "advance")
                              }} 
                              disabled={isSubmitting}
                              className="text-xs sm:text-sm"
                            />
                          </FormControl>
                          <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}