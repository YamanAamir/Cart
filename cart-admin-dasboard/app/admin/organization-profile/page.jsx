'use client';
import { useState, useEffect } from 'react';
import * as z from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const socialIconOptions = [
  {
    name: 'Facebook',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>`,
  },
  {
    name: 'Twitter',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>`,
  },
  {
    name: 'Instagram',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>`,
  },
  {
    name: 'LinkedIn',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.78V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>`,
  },
  {
    name: 'YouTube',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>`,
  },
  {
    name: 'Pinterest',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path d="M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3 .8-3.4 5-20.3 6.9-28.1 .6-2.5 .3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z"/></svg>`,
  },
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  map_iframe: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
  socialLinks: z.array(z.object({
    url: z.string().url('Invalid URL'),
    svg: z.string().min(1, 'SVG required'),
  })).optional(),
});

const editFields = [
  { name: 'name', label: 'Organization Name', type: 'text', placeholder: 'Enter organization name' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' },
  { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter phone' },
  { name: 'address', label: 'Address', type: 'textarea', placeholder: 'Enter address' },
  { name: 'map_iframe', label: 'Map Iframe Code', type: 'textarea', placeholder: 'Enter map iframe code' },
  { name: 'isActive', label: 'Active', type: 'switch' },
];

const modifyIframeAttributes = (iframeString) => {
  if (!iframeString) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(iframeString, 'text/html');
  const iframe = doc.querySelector('iframe');
  if (iframe) {
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '585');
    iframe.classList.add('w-full', 'h-[585px]');
    return iframe.outerHTML;
  }
  return iframeString;
};

export default function AdminOrganizationSettings() {
  const [settings, setSettings] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newLogo, setNewLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isRemovingSocialLink, setIsRemovingSocialLink] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRemoveSocialLinkOpen, setIsRemoveSocialLinkOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [removeSocialLinkIndex, setRemoveSocialLinkIndex] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: settings
      ? { ...settings, socialLinks: settings.socialLinks || [] }
      : { name: '', email: '', phone: '', address: '', map_iframe: '', isActive: true, socialLinks: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  const isActive = watch('isActive');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    reset(settings
      ? { ...settings, socialLinks: settings.socialLinks || [] }
      : { name: '', email: '', phone: '', address: '', map_iframe: '', isActive: true, socialLinks: [] });
    setNewLogo(null);
  }, [settings, reset]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/organization-settings');
      if (response.data) {
        setSettings(response.data);
      } else {
        setSettings(null);
      }
    } catch (error) {
      toast.error(error.response?.status === 401 ? 'Please log in to access this page' : 'Failed to fetch organization settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSettings(null);
    setIsFormVisible(true);
  };

  const handleEdit = () => {
    setIsFormVisible(true);
  };

  const openConfirm = (action, id, title) => {
    setConfirmAction(() => action);
    setConfirmId(id);
    setConfirmTitle(title);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setIsDeleting(confirmTitle.includes('Delete'));
    setIsToggling(confirmTitle.includes('Activate') || confirmTitle.includes('Deactivate'));
    try {
      await confirmAction(confirmId);
      await fetchData();
      toast.success(confirmTitle.includes('Delete') ? 'Organization settings deleted successfully' : 'Organization settings status toggled successfully');
    } catch (error) {
      toast.error(error.response?.status === 401 ? 'Please log in to perform this action' : 'Action failed');
    } finally {
      setIsDeleting(false);
      setIsToggling(false);
      setIsConfirmOpen(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/organization-settings/${id}`);
  };

  const handleToggleActive = async (id) => {
    await api.patch(`/organization-settings/${id}/toggle`);
  };

  const handleRemoveSocialLink = (index) => {
    setRemoveSocialLinkIndex(index);
    setIsRemoveSocialLinkOpen(true);
  };

  const confirmRemoveSocialLink = () => {
    setIsRemovingSocialLink(true);
    try {
      remove(removeSocialLinkIndex);
      toast.success('Social link removed successfully');
    } catch (error) {
      toast.error('Failed to remove social link');
    } finally {
      setIsRemovingSocialLink(false);
      setIsRemoveSocialLinkOpen(false);
      setRemoveSocialLinkIndex(null);
    }
  };

  const handleSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const modifiedData = {
        ...data,
        map_iframe: modifyIframeAttributes(data.map_iframe),
      };
      formData.append('formattedData', JSON.stringify(modifiedData));
      if (newLogo) {
        formData.append('logo', newLogo);
      }
      if (settings) {
        await api.put(`/organization-settings/${settings.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Organization settings updated successfully');
      } else {
        await api.post('/organization-settings', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Organization settings created successfully');
      }
      await fetchData();
      setIsFormVisible(false);
    } catch (error) {
      toast.error(error.response?.status === 401 ? 'Please log in to perform this action' : error.response?.data?.error || 'Failed to save organization settings');
    } finally {
      setIsSubmitting(false);
      reset();
      setNewLogo(null);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    reset();
    setNewLogo(null);
  };

  return (
    <div className="container mx-auto p-4 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Organization Settings</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : settings && !isFormVisible ? (
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="w-full">
              <h3 className="text-lg sm:text-xl font-semibold">{settings.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600">Email: {settings.email || 'N/A'}</p>
              <p className="text-xs sm:text-sm text-gray-600">Phone: {settings.phone || 'N/A'}</p>
              <p className="text-xs sm:text-sm text-gray-600">Address: {settings.address || 'N/A'}</p>
              {settings.map_iframe && (
                <div className="mt-4 w-full max-w-md h-[180px] sm:h-[250px] overflow-hidden border border-gray-200 rounded">
                  <div
                    dangerouslySetInnerHTML={{ __html: modifyIframeAttributes(settings.map_iframe) }}
                    className="w-full h-full"
                  />
                </div>
              )}
              {settings.logo_url && (
                <img
                  src={settings.logo_url}
                  alt="Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain mt-4"
                />
              )}
              <div className="mt-4">
                <h4 className="text-sm sm:text-base font-medium">Social Links:</h4>
                <div className="flex flex-wrap gap-2 mt-2 items-center">
                  {settings.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-2"
                    >
                      <span
                        dangerouslySetInnerHTML={{ __html: link.svg }}
                        className="w-4 h-4 inline-block"
                      />
                    </a>
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm mt-4">
                Status:{' '}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
                    settings.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {settings.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              <Button
                onClick={handleEdit}
                disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => openConfirm(handleDelete, settings.id, 'Delete Organization Settings')}
                disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  openConfirm(
                    handleToggleActive,
                    settings.id,
                    settings.isActive ? 'Deactivate Organization Settings' : 'Activate Organization Settings'
                  )
                }
                disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                {settings.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        </div>
      ) : !settings && !isFormVisible ? (
        <div className="text-center py-8">
          <div className="flex flex-col items-center justify-center">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 mb-4" />
            <p className="text-base sm:text-lg text-gray-600">No Organization Settings Found</p>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
              className="mt-4 w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Create Organization Settings
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-semibold">{settings ? 'Edit' : 'Create'} Organization Settings</h3>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4 sm:space-y-6">
            {editFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm sm:text-base font-medium">{field.label}</Label>
                {field.type === 'switch' ? (
                  <div className="mt-1">
                    <Switch
                      id={field.name}
                      checked={isActive}
                      onCheckedChange={(checked) => setValue(field.name, checked)}
                      disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                    />
                  </div>
                ) : field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    className="mt-1 w-full max-w-md min-h-[80px] max-h-[120px] resize-y"
                    disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    className="mt-1 w-full max-w-md"
                    disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                  />
                )}
                {errors[field.name] && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field.name].message}</p>
                )}
              </div>
            ))}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">Logo</Label>
              {settings?.logo_url && (
                <img
                  src={settings.logo_url}
                  alt="Current Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain mb-2"
                />
              )}
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml,image/x-icon,image/heic,image/heif,image/avif"
                onChange={(e) => setNewLogo(e.target.files[0])}
                disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                className="w-full max-w-md"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">Social Links</Label>
              {fields.map((field, index) => {
                const currentSvg = watch(`socialLinks.${index}.svg`);
                const selectedIcon = socialIconOptions.find((opt) => opt.svg === currentSvg)?.name || '';
                return (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-2 sm:space-y-0"
                  >
                    <Select
                      value={selectedIcon}
                      onValueChange={(val) => {
                        const selected = socialIconOptions.find((opt) => opt.name === val);
                        setValue(`socialLinks.${index}.svg`, selected?.svg || '');
                      }}
                      disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                    >
                      <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm">
                        <SelectValue placeholder="Select Icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialIconOptions.map((opt) => (
                          <SelectItem key={opt.name} value={opt.name}>
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="URL"
                      {...register(`socialLinks.${index}.url`)}
                      className="w-full max-w-md text-xs sm:text-sm"
                      disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleRemoveSocialLink(index)}
                      disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                      className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ url: '', svg: '' })}
                disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                Add Social Link
              </Button>
              {errors.socialLinks && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.socialLinks.message}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-2 sm:space-y-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isDeleting || isToggling || isRemovingSocialLink}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{confirmTitle}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to proceed with this action? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isDeleting || isToggling}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting || isToggling}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              {isDeleting ? 'Deleting...' : isToggling ? 'Confirming...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRemoveSocialLinkOpen} onOpenChange={setIsRemoveSocialLinkOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirm Remove Social Link</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to remove this social link? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRemoveSocialLinkOpen(false)}
              disabled={isRemovingSocialLink}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemoveSocialLink}
              disabled={isRemovingSocialLink}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              {isRemovingSocialLink ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}