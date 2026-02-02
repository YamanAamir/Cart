'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import api from '@/lib/api';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { Trash2, Plus, AlertCircle } from 'lucide-react';

// Auto slug preview (client-side)
const generatePreviewSlug = (title) => {
  if (!title) return 'page';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export default function AdminStaticPageMeta() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaKw, setMetaKw] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openDlg, setOpenDlg] = useState(false);
  const [openDel, setOpenDel] = useState(false);

  // Load list
  useEffect(() => {
    api.get('/meta')
      .then(r => setList(r.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  // Handlers
  const startCreate = () => {
    setSelected(null);
    setMetaTitle(''); setMetaDesc(''); setMetaKw(''); setIsActive(true);
    setOpenDlg(true);
  };

  const startEdit = (item) => {
    setSelected(item);
    setMetaTitle(item.metaTitle);
    setMetaDesc(item.metaDescription ?? '');
    setMetaKw(item.metaKeywords ?? '');
    setIsActive(item.isActive);
    setOpenDlg(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!metaTitle.trim()) return toast.error('Title is required');
    setSaving(true);
    try {
      const payload = {
        ...(selected && { id: selected.id }),
        metaTitle,
        metaDescription: metaDesc,
        metaKeywords: metaKw,
        isActive,
      };
      await api.post('/meta', payload);
      const fresh = await api.get('/meta');
      setList(fresh.data);
      toast.success(selected ? 'Updated' : 'Created');
      setOpenDlg(false);
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/meta/${selected.id}`);
      setList(l => l.filter(i => i.id !== selected.id));
      toast.success('Deleted');
      setOpenDel(false); setOpenDlg(false); setSelected(null);
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Static Page Meta</h1>
        <Button onClick={startCreate} size="sm">
          <Plus className="w-4 h-4 mr-1" /> Create
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center"><LoadingSpinner /></div>
      ) : list.length === 0 ? (
        <div className="text-center py-10">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No meta entries found.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {list.map(item => (
            <div key={item.id} className="p-4 bg-white rounded-lg shadow-sm border flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.metaTitle}</h3>
                <p className="text-xs text-gray-500">
                  {item.isActive ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                  {' • '} {new Date(item.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <Button size="sm" onClick={() => startEdit(item)}>Edit</Button>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={openDlg} onOpenChange={setOpenDlg}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected ? 'Edit' : 'Create'} Meta</DialogTitle>
            <DialogDescription>
              Manage SEO for static pages.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Meta Title <span className="text-red-500">*</span></Label>
              <Input
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                placeholder="e.g., Contact"
                required
                disabled={saving}
              />
            </div>

            <div>
              <Label>Meta Description</Label>
              <Input
                value={metaDesc}
                onChange={e => setMetaDesc(e.target.value)}
                placeholder="Brief page description"
                disabled={saving}
              />
            </div>

            <div>
              <Label>Meta Keywords</Label>
              <Input
                value={metaKw}
                onChange={e => setMetaKw(e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                disabled={saving}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} disabled={saving} />
              <Label>Active</Label>
            </div>

            <DialogFooter className="gap-2">
              <Button type="submit" disabled={saving || !metaTitle.trim()}>
                {saving ? 'Saving...' : selected ? 'Update' : 'Create'}
              </Button>
              {selected && (
                <Button type="button" variant="destructive" onClick={() => setOpenDel(true)} disabled={saving}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={openDel} onOpenChange={setOpenDel}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Meta?</DialogTitle>
            <DialogDescription>
              Permanently delete <strong>{selected?.metaTitle}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenDel(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}