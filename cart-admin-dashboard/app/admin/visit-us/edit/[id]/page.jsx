'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import * as z from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle } from '@/components/ui/alert-dialog';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  maps: z.array(
    z.object({
      map_embed: z.string().min(1, 'Map embed code is required'),
      address: z.string().min(1, 'Address is required'),
    })
  ).min(1, 'At least one map embed code is required'),
});

const editFields = [
  { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter title (e.g., Main Branch)' },
];

export default function VisitUsEdit() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [formData, setFormData] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      maps: [{ map_embed: '', address: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'maps',
  });

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/visit-us/${id}`);
        const item = response.data;
        reset({
          title: item.title,
          maps: item.maps.map(m => ({ map_embed: m.map_embed, address: m.address })),
        });
      } catch (error) {
        toast.error(error.response?.status === 401 ? 'Please log in to access this page' : 'Failed to fetch item');
      } finally {
        setIsLoading(false);
      }
    };
    fetchItem();
  }, [id, reset]);

  const handleSubmitForm = async (data) => {
    setFormData(data);
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    setIsSubmitting(true);
    try {
      await api.put(`/visit-us/${id}`, {
        title: formData.title,
        maps: formData.maps,
      });
      toast.success('Item updated successfully');
      router.push('/admin/visit-us-list');
    } catch (error) {
      toast.error(error.response?.status === 401 ? 'Please log in to perform this action' : 'Failed to save item');
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    try {
      remove(deleteIndex);
      toast.success('Map and address removed successfully');
    } catch (error) {
      toast.error('Failed to remove map and address');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteIndex(null);
    }
  };

  const handleCancel = () => {
    router.push('/admin/visit-us-list');
  };

  return (
    <div className="container mx-auto p-4 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Edit Item</h2>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4 sm:space-y-6">
            {editFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm sm:text-base font-medium">{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className="mt-1 w-full"
                  disabled={isLoading || isSubmitting || isDeleting}
                />
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
                      disabled={isLoading || isSubmitting || isDeleting}
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
                      disabled={isLoading || isSubmitting || isDeleting}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(index)}
                      disabled={isLoading || isSubmitting || isDeleting || fields.length === 1}
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
                disabled={isLoading || isSubmitting || isDeleting}
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
                disabled={isLoading || isSubmitting || isDeleting}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isSubmitting || isDeleting}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      )}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Confirm Save</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to save this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto" disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSave}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this map and address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}