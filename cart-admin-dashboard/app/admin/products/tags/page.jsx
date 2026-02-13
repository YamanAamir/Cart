'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label'; // Corrected import
import { AlertCircle, MoreHorizontal } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

export default function TagManagement() {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [editTag, setEditTag] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });

  // Fetch tags with pagination, search, and status filter
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/all-tags-pagination', {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: filters.search,
          status: filters.status,
        },
      });
      setTags(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.response?.status === 401 ? 'Please log in to access this page' : 'Failed to fetch tags');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.currentPage, pagination.limit, filters]);

  // Handle adding a new tag
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.post('/tags', { name: newTagName.trim() });
      setTags([...tags, response.data]);
      setPagination((prev) => ({ ...prev, totalItems: prev.totalItems + 1 }));
      setNewTagName('');
      setIsAddModalOpen(false);
      toast.success('Tag created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing an existing tag
  const handleEditTag = async () => {
    if (!editTag?.name.trim()) {
      toast.error('Tag name is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.put(`/tags/${editTag.id}`, {
        name: editTag.name.trim(),
        isActive: editTag.isActive,
      });
      setTags(tags.map((tag) => (tag.id === editTag.id ? response.data : tag)));
      setIsEditModalOpen(false);
      setEditTag(null);
      toast.success('Tag updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggling tag status
  const handleToggleTagStatus = async (id, isActive) => {
    setIsSubmitting(true);
    try {
      const response = await api.patch(`/tags/${id}/toggle`, { isActive });
      setTags(tags.map((tag) => (tag.id === id ? response.data : tag)));
      toast.success(`Tag ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to toggle tag status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a tag
  const handleDeleteTag = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/tags/${deleteTagId}`);
      setTags(tags.filter((tag) => tag.id !== deleteTagId));
      setPagination((prev) => ({ ...prev, totalItems: prev.totalItems - 1 }));
      setIsDeleteModalOpen(false);
      setDeleteTagId(null);
      toast.success('Tag deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (tag) => {
    setEditTag({ ...tag });
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setDeleteTagId(id);
    setIsDeleteModalOpen(true);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle limit change
  const handleLimitChange = (value) => {
    setPagination((prev) => ({ ...prev, limit: Number(value), currentPage: 1 }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Manage Product Tags</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
          disabled={isSubmitting}
        >
          Add New Tag
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
        <Input
          placeholder="Search by tag name"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full sm:max-w-sm"
        />
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto min-w-full">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] sm:w-[100px]">ID</TableHead>
              <TableHead className="max-w-[150px] sm:max-w-none">Name</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <LoadingSpinner size="lg" />
                </TableCell>
              </TableRow>
            ) : tags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500 mb-4" />
                    <p className="text-base sm:text-lg text-gray-600">No tags found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell className="truncate max-w-[150px] sm:max-w-none">{tag.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={tag.isActive}
                        onCheckedChange={(checked) => handleToggleTagStatus(tag.id, checked)}
                        disabled={isSubmitting}
                      />
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          tag.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tag.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditModal(tag)} className="text-xs sm:text-sm">
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteModal(tag.id)} className="text-xs sm:text-sm">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && tags.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <div className="flex items-center space-x-2 text-sm">
            <p>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} -{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{' '}
              {pagination.totalItems} tags
            </p>
            <Select
              value={pagination.limit.toString()}
              onValueChange={handleLimitChange}
              disabled={isLoading}
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
              disabled={pagination.currentPage === 1 || isLoading}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-sm">Page {pagination.currentPage} of {pagination.totalPages}</span>
            <Button
              variant="outline"
              disabled={pagination.currentPage === pagination.totalPages || isLoading}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Add New Tag</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Enter the details for the new tag.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newTagName" className="text-sm sm:text-base font-medium">
                Tag Name
              </Label>
              <Input
                id="newTagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTag}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              {isSubmitting ? 'Creating...' : 'Create Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Tag</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Update the details for the tag.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTagName" className="text-sm sm:text-base font-medium">
                Tag Name
              </Label>
              <Input
                id="editTagName"
                value={editTag?.name || ''}
                onChange={(e) => setEditTag({ ...editTag, name: e.target.value })}
                placeholder="Enter tag name"
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="editTagStatus" className="text-sm sm:text-base font-medium">
                Active
              </Label>
              <Switch
                id="editTagStatus"
                checked={editTag?.isActive}
                onCheckedChange={(checked) => setEditTag({ ...editTag, isActive: checked })}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditTag}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              {isSubmitting ? 'Updating...' : 'Update Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tag Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Confirm Delete Tag</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Are you sure you want to delete this tag? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTag}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}