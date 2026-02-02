'use client';

import { useState, useEffect } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  password: z.string().optional().refine((val) => !val || val.length >= 8, {
    message: 'Password must be at least 8 characters',
  }),
});

export default function AdminProfile() {
  const { user, setUser, authLoading, logout } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', password: '' },
  });

  useEffect(() => {
    if (user) {
      setValue('fullName', user.fullName);
      setPreview(user.profilePicture || null);
    }
  }, [user, setValue]);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
    'image/*': [
      '.jpg', 
      '.jpeg', 
      '.png', 
      '.gif', 
      '.webp', 
      '.bmp', 
      '.tiff', 
      '.tif', 
      '.svg', 
      '.ico', 
      '.heic', 
      '.heif', 
      '.avif'
    ] 
  },
    multiple: false,
    disabled: isActionLoading,
  });

  const handleSubmitForm = async (data) => {
    setIsActionLoading(true);
    try {
      const formattedData = JSON.stringify({
        fullName: data.fullName,
        password: data.password || undefined,
      });
      const formData = new FormData();
      formData.append('formattedData', formattedData);
      if (file) {
        formData.append('image', file);
      }

      const response = await api.put('/admin/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      sessionStorage.setItem('DEVICE', response.data.token);
      setUser({
        adminId: response.data.admin.id,
        fullName: response.data.admin.fullName,
        email: response.data.admin.email,
        profilePicture: response.data.admin.profilePicture,
        isSuper: response.data.admin.isSuper,
        isAdmin: response.data.admin.isAdmin,
        isAccess: response.data.admin.isAccess,
      });
      setPreview(response.data.admin.profilePicture || null);
      toast.success('Profile updated successfully');
      reset({ fullName: response.data.admin.fullName, password: '' });
      setFile(null);
    } catch (error) {
      toast.error(error.response?.status === 401 ? 'Please log in to perform this action' : 'Failed to update profile');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeletePicture = async () => {
    setIsActionLoading(true);
    try {
      const response = await api.delete('/admin/profile/picture');
      sessionStorage.setItem('DEVICE', response.data.token);
      setUser({
        adminId: response.data.admin.id,
        fullName: response.data.admin.fullName,
        email: response.data.admin.email,
        profilePicture: response.data.admin.profilePicture,
        isSuper: response.data.admin.isSuper,
        isAdmin: response.data.admin.isAdmin,
        isAccess: response.data.admin.isAccess,
      });
      setPreview(null);
      setIsDeleteModalOpen(false);
      toast.success('Profile picture deleted successfully');
    } catch (error) {
      toast.error(error.response?.status === 401 ? 'Please log in to perform this action' : 'Failed to delete profile picture');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(user?.profilePicture || null);
    reset({ fullName: user?.fullName || '', password: '' });
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Admin Settings</h2>
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="h-20 w-20 sm:h-28 sm:w-28 border-2 border-gray-200 p-4"
                />
              ) : (
                <div className="h-20 w-20 sm:h-28 sm:w-28 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-semibold">{user.fullName}</h3>
              <p className="text-sm sm:text-base text-gray-600">{user.email}</p>
              <p className="text-sm sm:text-base text-gray-600">Access Level: {user.isAccess}</p>
              <p className="text-sm sm:text-base text-gray-600">
                Role: {user.isSuper ? 'Super Admin' : user.isAdmin ? 'Admin' : 'User'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm sm:text-base font-medium">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                {...register('fullName')}
                disabled={isActionLoading}
                className="w-full"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base font-medium">Password (Optional)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  {...register('password')}
                  disabled={isActionLoading}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isActionLoading}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            {/* <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">Profile Picture (Optional)</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } ${isActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto h-32 sm:h-40 w-auto object-cover rounded"
                  />
                ) : (
                  <p className="text-sm sm:text-base text-gray-600">
                    {isDragActive ? 'Drop the image here...' : 'Drag & drop an image, or click to select'}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Only one image allowed</p>
              </div>
            </div> */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={isActionLoading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                {isActionLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isActionLoading}
                className="w-full sm:w-auto"
              >
                Reset
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-3">
            {user.profilePicture && (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isActionLoading}
                className="w-full sm:w-auto"
              >
                Delete Profile Picture
              </Button>
            )}
            <Button
              variant="outline"
              onClick={logout}
              disabled={isActionLoading}
              className="w-full sm:w-auto"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteModalOpen} onOpenChange={() => setIsDeleteModalOpen(false)}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirm Delete</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete your profile picture? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isActionLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePicture}
              disabled={isActionLoading}
              className="w-full sm:w-auto"
            >
              {isActionLoading ? 'Deleting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}