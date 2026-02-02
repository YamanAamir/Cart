'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  maps: z.array(
    z.object({
      map_embed: z.string().min(1, 'Map embed code is required'),
      address: z.string().min(1, 'Address is required'),
    })
  ).min(1, 'At least one map embed code is required'),
  isActive: z.boolean().optional(),
});

const addFields = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter title (e.g., Main Branch)' },
  { name: 'isActive', label: 'Active', type: 'switch' },
];

export default function VisitUsAdd() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      maps: [{ map_embed: '', address: '' }],
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'maps',
  });

  const isActive = watch('isActive');

  const handleSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/visit-us', {
        title: data.title,
        maps: data.maps,
        isActive: data.isActive,
      });
      toast.success('Item created successfully');
      router.push('/admin/visit-us-list');
    } catch (error) {
      toast.error(error.response?.status === 401 ? 'Please log in to perform this action' : 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/visit-us-list');
  };

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Add Item</h2>
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4 sm:space-y-6">
          {addFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name} className="text-sm sm:text-base font-medium">{field.label}</Label>
              {field.type === 'switch' ? (
                <div className="mt-1">
                  <Switch
                    id={field.name}
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                    disabled={isSubmitting}
                  />
                </div>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className="mt-1 w-full"
                  disabled={isSubmitting}
                />
              )}
              {errors[field.name] && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.name].message}</p>
              )}
            </div>
          ))}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium">Map Embed Codes and Addresses</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor={`maps.${index}.address`} className="text-sm sm:text-base">Address {index + 1}</Label>
                  <Textarea
                    id={`maps.${index}.address`}
                    placeholder="Enter full address"
                    {...register(`maps.${index}.address`)}
                    className="mt-1 w-full min-h-[60px] max-h-[100px] resize-y"
                    disabled={isSubmitting}
                  />
                  {errors.maps?.[index]?.address && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.maps[index].address.message}</p>
                  )}
                </div>
                <div className="flex flex-col sm:items-start sm:space-x-4 space-y-2 sm:space-y-0">
                  <Textarea
                    placeholder="Enter Google Maps embed code (iframe)"
                    {...register(`maps.${index}.map_embed`)}
                    className="mt-1 w-full max-w-md min-h-[80px] max-h-[120px] resize-y"
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isSubmitting || fields.length === 1}
                    className="w-full sm:w-auto flex items-center justify-center px-[20px] mt-[20px]"
                  >
                    Delete <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-full max-w-md h-[180px] sm:h-[250px] overflow-hidden border border-gray-200 rounded">
                  {watch(`maps.${index}.map_embed`) && (
                    <div dangerouslySetInnerHTML={{ __html: watch(`maps.${index}.map_embed`) }} />
                  )}
                </div>
                {errors.maps?.[index]?.map_embed && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.maps[index].map_embed.message}</p>
                )}
              </div>
            ))}
            {errors.maps && !errors.maps[0] && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.maps.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ map_embed: '', address: '' })}
              disabled={isSubmitting}
              className="w-full sm:w-auto mt-2"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Map Embed and Address
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-2 sm:space-y-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}