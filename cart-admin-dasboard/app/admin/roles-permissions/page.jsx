'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, AlertCircle, EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'fullName', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'isAccess', label: 'Access Level' },
  {
    key: 'isAdmin',
    label: 'Admin Status',
    render: (row) => (
      <span className={row.isAdmin ? 'text-green-500' : 'text-red-500'}>
        {row.isAdmin ? 'Admin' : 'Non-Admin'}
      </span>
    ),
  },
  {
    key: 'isActive',
    label: 'Active Status',
    render: (row, { onToggleStatus }) => (
      <div className="flex items-center space-x-2">
        <Switch
          checked={row.isActive}
          onCheckedChange={(checked) => onToggleStatus(row.id, checked)}
          disabled={row.isSuper}
        />
        <Label className="text-xs sm:text-sm">
          {row.isActive ? 'Active' : 'Inactive'}
        </Label>
      </div>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row, { onEdit, onDelete }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={row.isSuper}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(row)} className="text-xs sm:text-sm">
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(row.id)} className="text-xs sm:text-sm">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function RolesAndPermissions() {
  const { user } = useAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [stats, setStats] = useState({ totalAdmins: 0, activeAdmins: 0, inactiveAdmins: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    isAccess: 'LOW',
    isAdmin: true,
    isActive: true,
    profilePicture: null,
  });
  const [editAdminId, setEditAdminId] = useState(null);

  useEffect(() => {
    if (!user?.isSuper) {
      router.push('/admin/dashboard');
      toast.error('Access denied. Super admin privileges required.');
      return;
    }
    fetchStats();
    fetchAdmins();
  }, [user, router, pagination.currentPage, pagination.limit]);

  const fetchStats = async () => {
    try {
      const [totalRes, activeRes, inactiveRes] = await Promise.all([
        api.get('/admins/count/total'),
        api.get('/admins/count/active'),
        api.get('/admins/count/inactive'),
      ]);
      setStats({
        totalAdmins: totalRes.data.totalAdmins || 0,
        activeAdmins: activeRes.data.activeAdmins || 0,
        inactiveAdmins: inactiveRes.data.inactiveAdmins || 0,
      });
    } catch (error) {
      toast.error('Failed to fetch admin counts');
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admins', {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
        },
      });
      setAdmins(response.data.admins || []);
      setPagination(response.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10,
      });
    } catch (error) {
      toast.error(error.response?.status === 401 ? 'Please log in to access this page' : 'Failed to fetch admins');
      console.error('Error fetching admins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
  };

  const handleCreateAdmin = async () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.isAccess) {
      toast.error('Full name, email, password, and access level are required');
      return;
    }

    const data = new FormData();
    data.append('formattedData', JSON.stringify({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      isAccess: formData.isAccess,
      isAdmin: formData.isAdmin,
    }));
    if (formData.profilePicture) {
      data.append('image', formData.profilePicture);
    }

    setIsActionLoading(true);
    try {
      await api.post('/admins', data);
      toast.success('Admin created successfully');
      setIsAddModalOpen(false);
      setFormData({ fullName: '', email: '', password: '', isAccess: 'LOW', isAdmin: true, isActive: true, profilePicture: null });
      await Promise.all([fetchStats(), fetchAdmins()]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create admin');
      console.error('Error creating admin:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditAdmin = async () => {
    if (!formData.fullName || !formData.email || !formData.isAccess) {
      toast.error('Full name, email, and access level are required');
      return;
    }

    const data = new FormData();
    data.append('formattedData', JSON.stringify({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password || undefined,
      isAccess: formData.isAccess,
      isActive: formData.isActive,
    }));
    if (formData.profilePicture) {
      data.append('image', formData.profilePicture);
    }

    setIsActionLoading(true);
    try {
      await api.put(`/admins/${editAdminId}`, data);
      toast.success('Admin updated successfully');
      setIsEditModalOpen(false);
      setFormData({ fullName: '', email: '', password: '', isAccess: 'LOW', isAdmin: true, isActive: true, profilePicture: null });
      setEditAdminId(null);
      await Promise.all([fetchStats(), fetchAdmins()]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update admin');
      console.error('Error updating admin:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleStatus = async (id, checked) => {
    setIsActionLoading(true);
    try {
      await api.put(`/admins/${id}/toggle-active`);
      toast.success(`Admin ${checked ? 'deactivated' : 'activated'} successfully`);
      await Promise.all([fetchStats(), fetchAdmins()]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to toggle admin status');
      console.error('Error toggling admin status:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteAdmin = (id) => {
    setPendingAction('delete');
    setSelectedId(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    setIsActionLoading(true);
    try {
      await api.delete(`/admins/${selectedId}`);
      toast.success('Admin deleted successfully');
      await Promise.all([fetchStats(), fetchAdmins()]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete admin');
      console.error('Error deleting admin:', error);
    } finally {
      setIsActionLoading(false);
      setShowConfirmDialog(false);
      setPendingAction(null);
      setSelectedId(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleLimitChange = (value) => {
    setPagination((prev) => ({ ...prev, limit: Number(value), currentPage: 1 }));
  };

  const openEditModal = (admin) => {
    setEditAdminId(admin.id);
    setFormData({
      fullName: admin.fullName || '',
      email: admin.email || '',
      password: '',
      isAccess: admin.isAccess || 'LOW',
      isAdmin: admin.isAdmin !== undefined ? admin.isAdmin : true,
      isActive: admin.isActive !== undefined ? admin.isActive : true,
      profilePicture: null,
    });
    setIsEditModalOpen(true);
  };

  const getActionButtonText = () => {
    return isActionLoading ? 'Deleting...' : 'Confirm';
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Roles and Permissions</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading || isActionLoading}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
          >
            Add Admin
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm sm:text-base font-medium">Total Admins</h3>
                <p className="text-lg sm:text-2xl font-bold">{stats.totalAdmins}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm sm:text-base font-medium">Active Admins</h3>
                <p className="text-lg sm:text-2xl font-bold">{stats.activeAdmins}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm sm:text-base font-medium">Inactive Admins</h3>
                <p className="text-lg sm:text-2xl font-bold">{stats.inactiveAdmins}</p>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key} className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap">
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 mb-4" />
                        <p className="text-sm sm:text-lg text-gray-600">No admins found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">{admin.id}</TableCell>
                      <TableCell className="px-2 sm:px-4 text-xs sm:text-sm max-w-[100px] sm:max-w-[150px] truncate">
                        {admin.fullName}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4 text-xs sm:text-sm max-w-[100px] sm:max-w-[150px] truncate">
                        {admin.email}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">{admin.isAccess}</TableCell>
                      <TableCell className="px-2 sm:px-4 text-xs sm:text-sm">
                        {columns.find((col) => col.key === 'isAdmin').render(admin)}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4">
                        {columns.find((col) => col.key === 'isActive').render(admin, { onToggleStatus: handleToggleStatus })}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4">
                        {columns.find((col) => col.key === 'actions').render(admin, {
                          onEdit: openEditModal,
                          onDelete: handleDeleteAdmin,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && admins.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <div className="flex items-center space-x-2 text-sm">
                <p>
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{' '}
                  {pagination.totalItems} Admins
                </p>
                <Select
                  value={pagination.limit.toString()}
                  onValueChange={handleLimitChange}
                  disabled={isLoading || isActionLoading}
                >
                  <SelectTrigger className="w-[80px] sm:w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <p>per page</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === 1 || isLoading || isActionLoading}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className="text-xs sm:text-sm"
                >
                  Previous
                </Button>
                <span className="text-xs sm:text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={pagination.currentPage === pagination.totalPages || isLoading || isActionLoading}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className="text-xs sm:text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Admin Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Add New Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-xs sm:text-sm mb-2">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="text-xs sm:text-sm"
                disabled={isActionLoading}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs sm:text-sm mb-2">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="text-xs sm:text-sm"
                disabled={isActionLoading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs sm:text-sm mb-2">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="text-xs sm:text-sm pr-10"
                  disabled={isActionLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isActionLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="isAccess" className="text-xs sm:text-sm mb-2">Access Level</Label>
              <Select
                value={formData.isAccess}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, isAccess: value }))}
                disabled={isActionLoading}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW" className="text-xs sm:text-sm">Low</SelectItem>
                  <SelectItem value="MEDIUM" className="text-xs sm:text-sm">Medium</SelectItem>
                  <SelectItem value="HIGH" className="text-xs sm:text-sm">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div>
              <Label htmlFor="profilePicture" className="text-xs sm:text-sm mb-2">Profile Picture (Optional)</Label>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml,image/x-icon,image/heic,image/heif,image/avif"
                onChange={handleFileChange}
                className="text-xs sm:text-sm"
                disabled={isActionLoading}
              />
            </div> */}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isActionLoading}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAdmin}
              disabled={isActionLoading}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Create Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Admin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-xs sm:text-sm mb-2">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="text-xs sm:text-sm"
                disabled={isActionLoading}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs sm:text-sm mb-2">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="text-xs sm:text-sm"
                disabled={isActionLoading}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs sm:text-sm mb-2">Password (leave blank to keep unchanged)</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="text-xs sm:text-sm pr-10"
                  disabled={isActionLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isActionLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="isAccess" className="text-xs sm:text-sm mb-2">Access Level</Label>
              <Select
                value={formData.isAccess}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, isAccess: value }))}
                disabled={isActionLoading}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW" className="text-xs sm:text-sm">Low</SelectItem>
                  <SelectItem value="MEDIUM" className="text-xs sm:text-sm">Medium</SelectItem>
                  <SelectItem value="HIGH" className="text-xs sm:text-sm">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="isActive" className="text-xs sm:text-sm mb-2">Active Status</Label>
              <Select
                value={formData.isActive ? 'Active' : 'Inactive'}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, isActive: value === 'Active' }))}
                disabled={isActionLoading}
              >
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue placeholder="Select active status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active" className="text-xs sm:text-sm">Active</SelectItem>
                  <SelectItem value="Inactive" className="text-xs sm:text-sm">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div>
              <Label htmlFor="profilePicture" className="text-xs sm:text-sm mb-2">Profile Picture (Optional)</Label>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml,image/x-icon,image/heic,image/heif,image/avif"
                onChange={handleFileChange}
                className="text-xs sm:text-sm"
                disabled={isActionLoading}
              />
            </div> */}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isActionLoading}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditAdmin}
              disabled={isActionLoading}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Update Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirm Action</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this admin? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isActionLoading}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isActionLoading}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              {getActionButtonText()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}