"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import ImageFormModal from '@/components/FormModal/ImageFormModal';
import InstallmentFormModal from '@/components/FormModal/InstallmentFormModal';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import SearchableSelect from '@/components/SearchableSelect';
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuillEditor = dynamic(() => import("@/components/QuillEditor"), { ssr: false });

export default function BulkEdit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids') ? searchParams.get('ids').split(',').map(Number) : [];
  const [products, setProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [tags, setTags] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [longDescValue, setLongDescValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current && ids.length > 0) {
      const fetchData = async () => {
        try {
          console.log('Fetching data for IDs:', ids);
          const [prodsRes, catsRes, tagsRes] = await Promise.all([
            api.get('/products-by-ids', { params: { ids: ids.join(',') } }),
            api.get('/plain-categories'),
            api.get('/tags?active=true'),
          ]);
          const prods = prodsRes.data.data.map(p => {
            console.log('Product fetched:', p);
            return {
              ...p,
              ProductImage: p.ProductImage || [],
              ProductInstallments: p.ProductInstallments || [],
              tags: p.tags || [],
              meta_title: p.meta_title || '',
              meta_description: p.meta_description || '',
              meta_keywords: p.meta_keywords || '',
              slugName: p.slugName.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || '',
            };
          });
          setProducts(prods);
          setEditedProducts(prods.map(p => ({ ...p, tags: p.tags.map(t => ({ id: t.id })) })));
          setCategories(catsRes.data);
          setTags(tagsRes.data);
          setTagOptions(tagsRes.data.map(tag => ({
            value: String(tag.id),
            label: tag.name
          })));
          const uniqueCats = [...new Set(prods.map(p => p.category_id).filter(Boolean))];
          for (const catId of uniqueCats) {
            const subRes = await api.get(`/plain-subcategories/${catId}`);
            setSubCategoriesMap(prev => ({ ...prev, [catId]: subRes.data }));
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to load data');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      isInitialMount.current = false;
    }
  }, [ids]);

  const fetchSubCategories = async (catId) => {
    if (catId && !isNaN(catId) && !subCategoriesMap[catId]) {
      try {
        const res = await api.get(`/plain-subcategories/${catId}`);
        setSubCategoriesMap(prev => ({ ...prev, [catId]: res.data }));
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        toast.error('Failed to load subcategories');
      }
    }
  };

  const handleCellChange = (index, field, value) => {
    console.log(`Changing field ${field} for product ${index} to:`, value);
    setEditedProducts(prev => {
      const updated = [...prev];
      const updatedProduct = { ...updated[index] };
      if (field === 'category_id' || field === 'subcategory_id') {
        updatedProduct[field] = parseInt(value, 10) || null;
        if (field === 'category_id') {
          fetchSubCategories(value);
          updatedProduct.subcategory_id = null;
        }
      } else if (field === 'status' || field === 'stock') {
        updatedProduct[field] = value === 'true';
      } else if (field === 'price') {
        const numValue = value === '' ? null : parseFloat(value);
        updatedProduct[field] = isNaN(numValue) ? null : numValue;
      } else if (field === 'tags') {
        updatedProduct.tags = (value || []).map(v => ({ id: parseInt(v) }));
      } else if (field === 'slugName') {
        updatedProduct[field] = value ? value : '';
      } else if (field === 'meta_title') {
        updatedProduct[field] = value.substring(0, 60);
      } else if (field === 'meta_description') {
        updatedProduct[field] = value.substring(0, 160);
      } else {
        updatedProduct[field] = value;
      }
      updated[index] = updatedProduct;
      console.log('Updated product state:', updated[index]);
      return updated;
    });
    setHasChanges(true);
  };

  const openModal = (product, type) => {
    setSelectedProductForModal({
      ...product,
      ProductImage: editedProducts.find((p) => p.id === product.id)?.ProductImage || product.ProductImage,
      ProductInstallments: editedProducts.find((p) => p.id === product.id)?.ProductInstallments || product.ProductInstallments,
    });
    setModalType(type);
    if (type === "long_desc") {
      setLongDescValue(product.long_description || "");
    }
  };

  const saveModalChanges = (type, updatedData) => {
    const index = editedProducts.findIndex((p) => p.id === selectedProductForModal.id);
    if (index !== -1) {
      setEditedProducts((prev) => {
        const updated = [...prev];
        if (type === "long_desc") {
          updated[index].long_description = longDescValue;
        } else if (type === "images") {
          updated[index].ProductImage = updatedData;
        } else if (type === "installments") {
          updated[index].ProductInstallments = updatedData || selectedProductForModal.ProductInstallments;
        }
        return updated;
      });
      setSelectedProductForModal((prev) => ({
        ...prev,
        ProductImage: type === "images" ? updatedData : prev.ProductImage,
        ProductInstallments: type === "installments" ? updatedData : prev.ProductInstallments,
      }));
      setHasChanges(true);
    }
    setModalType(null);
    setLongDescValue("");
  };

  const isEqual = (a, b) => {
    if (typeof a !== 'object' || typeof b !== 'object') {
      return a === b;
    }
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      for (let i = 0; i < editedProducts.length; i++) {
        const edited = editedProducts[i];
        const original = products[i];
        const updates = {};
        Object.keys(edited).forEach(key => {
          if (
            key !== 'ProductImage' &&
            key !== 'ProductInstallments' &&
            key !== 'brand' &&
            key !== 'tags' &&
            !isEqual(edited[key], original[key])
          ) {
            if (key === 'category_id' || key === 'subcategory_id') {
              updates[key] = parseInt(edited[key], 10) || null;
            } else if (key === 'price') {
              updates[key] = edited[key] === null || isNaN(edited[key]) ? null : Number(edited[key]);
            } else if (typeof edited[key] === 'string' && !isNaN(edited[key]) && edited[key] !== '') {
              updates[key] = Number(edited[key]);
            } else {
              updates[key] = edited[key] === '' ? null : edited[key];
            }
          }
        });

        if (Object.keys(updates).length > 0) {
          console.log(`Submitting updates for product ${edited.id}:`, updates);
          await api.put(`/product/${edited.id}`, updates);
        }

        const newImages = edited.ProductImage?.filter(img => img.isNew) || [];
        if (newImages.length > 0) {
          const formData = new FormData();
          formData.append('product_id', edited.id);
          newImages.forEach(img => formData.append('images', img.file));
          await api.post('/create-product-images', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }

        const newInstallments = edited.ProductInstallments?.filter(ins => !ins.id) || [];
        const updatedInstallments = edited.ProductInstallments?.filter(
          ins => ins.id && !isEqual(ins, original.ProductInstallments?.find(o => o.id === ins.id))
        ) || [];
        if (newInstallments.length > 0 || updatedInstallments.length > 0) {
          const validInstallments = [...newInstallments, ...updatedInstallments].filter(ins => {
            return (
              !isNaN(ins.totalPrice) && ins.totalPrice > 0 &&
              !isNaN(ins.monthlyAmount) && ins.monthlyAmount > 0 &&
              !isNaN(ins.months) && ins.months >= 1 &&
              !isNaN(ins.advance) && ins.advance >= 0
            );
          }).map(ins => ({
            id: ins.id,
            product_id: edited.id,
            totalPrice: Number(ins.totalPrice),
            monthlyAmount: Number(ins.monthlyAmount),
            months: Number(ins.months),
            advance: Number(ins.advance),
            isActive: Boolean(ins.isActive),
          }));
          if (validInstallments.length > 0) {
            await api.put('/create-product-installment', { ProductInstallments: validInstallments });
          }
        }

        const originalTagIds = original.tags.map(t => t.id).sort((a, b) => a - b);
        const editedTagIds = edited.tags.map(t => t.id).sort((a, b) => a - b);
        if (JSON.stringify(originalTagIds) !== JSON.stringify(editedTagIds)) {
          await api.put(`/product/${edited.id}`, { tags: editedTagIds });
        }
      }
      toast.success('Bulk edit applied successfully');
      setHasChanges(false);
      router.back();
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Failed to apply bulk edit: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      router.back();
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    setHasChanges(false);
    router.back();
  };

  if (loading) return <div className="flex justify-center py-8"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Bulk Edit Products</h2>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="images">Images & Installments</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>Short Desc</TableHead>
                  <TableHead>Long Desc</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editedProducts.map((p, index) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>
                      <Input
                        value={p.name || ''}
                        onChange={(e) => handleCellChange(index, 'name', e.target.value)}
                        className="w-full min-w-[180px] sm:min-w-[200px] focus:ring-0 bg-transparent text-xs sm:text-sm border"
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={p.price !== null ? p.price : ''}
                        onChange={(e) => handleCellChange(index, 'price', e.target.value)}
                        className="w-full min-w-[100px] sm:min-w-[120px] focus:ring-0 bg-transparent text-xs sm:text-sm border"
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={p.category_id?.toString() || ''} onValueChange={(v) => handleCellChange(index, 'category_id', v)} disabled={isSubmitting}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={p.subcategory_id?.toString() || ''} onValueChange={(v) => handleCellChange(index, 'subcategory_id', v)} disabled={!p.category_id || isSubmitting}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                        <SelectContent>{(subCategoriesMap[p.category_id] || []).map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={p.short_description || ''}
                        onChange={(e) => handleCellChange(index, 'short_description', e.target.value)}
                        className="min-h-[40px] w-full min-w-[150px] sm:min-w-[200px] border focus:ring-0 bg-transparent text-xs sm:text-sm"
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openModal(p, 'long_desc')} className="w-full" disabled={isSubmitting}>
                        <Edit3 className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Select value={p.status?.toString() || 'false'} onValueChange={(v) => handleCellChange(index, 'status', v)} className="w-full" disabled={isSubmitting}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={p.stock?.toString() || 'true'} onValueChange={(v) => handleCellChange(index, 'stock', v)} className="w-full" disabled={isSubmitting}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">In Stock</SelectItem>
                          <SelectItem value="false">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <SearchableSelect
                        options={tagOptions}
                        value={(p.tags || []).map(t => String(t.id))}
                        onChange={(v) => handleCellChange(index, 'tags', v || [])}
                        placeholder="Select tags"
                        multiple
                        disabled={isSubmitting}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="seo">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Meta Title</TableHead>
                  <TableHead>Meta Description</TableHead>
                  <TableHead>Meta Keywords</TableHead>
                  <TableHead>URL Slug</TableHead>
                  <TableHead>Google Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editedProducts.map((p, index) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <Input
                        value={p.meta_title || ''}
                        onChange={(e) => handleCellChange(index, 'meta_title', e.target.value)}
                        className="w-full min-w-[180px] sm:min-w-[200px] focus:ring-0 bg-transparent text-xs sm:text-sm border"
                        maxLength={60}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">{p.meta_title?.length || 0}/60 characters</p>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={p.meta_description || ''}
                        onChange={(e) => handleCellChange(index, 'meta_description', e.target.value)}
                        className="min-h-[40px] w-full min-w-[150px] sm:min-w-[200px] border focus:ring-0 bg-transparent text-xs sm:text-sm"
                        maxLength={160}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">{p.meta_description?.length || 0}/160 characters</p>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={p.meta_keywords || ''}
                        onChange={(e) => handleCellChange(index, 'meta_keywords', e.target.value)}
                        className="w-full min-w-[180px] sm:min-w-[200px] focus:ring-0 bg-transparent text-xs sm:text-sm border"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">Comma-separated keywords</p>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={p.slugName || ''}
                        onChange={(e) => handleCellChange(index, 'slugName', e.target.value)}
                        className="w-full min-w-[180px] sm:min-w-[200px] focus:ring-0 bg-transparent text-xs sm:text-sm border"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">Example: qistmarket.pk/{p.categories_SlugName}/{p.subcategory_SlugName}/{p.slugName.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || "product-name"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="p-2 border rounded-md bg-gray-50">
                        <p className="text-blue-600 text-sm font-medium">{p.meta_title || "Product Title"}</p>
                        <p className="text-green-600 text-xs">qistmarket.pk/{p.categories_SlugName}/{p.subcategory_SlugName}/{p.slugName.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || "product-name"}</p>
                        <p className="text-gray-700 text-xs">{p.meta_description || "No description provided."}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="images">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Installments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editedProducts.map((p, index) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openModal(p, 'images')} className="w-full" disabled={isSubmitting}>
                        <Edit3 className="h-4 w-4 mr-1" /> Edit Images
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => openModal(p, 'installments')} className="w-full" disabled={isSubmitting}>
                        <Edit3 className="h-4 w-4 mr-1" /> Edit Installments
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
        <Button onClick={onSubmit} disabled={!hasChanges || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      {modalType === 'long_desc' && selectedProductForModal && (
        <Dialog open={true} onOpenChange={() => setModalType(null)}>
          <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <DialogHeader>
              <DialogTitle>Edit Long Description for {selectedProductForModal.name}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <QuillEditor 
                value={longDescValue} 
                onChange={(v) => setLongDescValue(v)}
                disabled={isSubmitting}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalType(null)} className="text-xs sm:text-sm" disabled={isSubmitting}>Close</Button>
              <Button onClick={() => saveModalChanges('long_desc')} className="text-xs sm:text-sm" disabled={isSubmitting}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {modalType === "images" && selectedProductForModal && (
        <ImageFormModal
          isOpen={true}
          onClose={() => setModalType(null)}
          title={`Edit Images for ${selectedProductForModal.name}`}
          defaultValues={selectedProductForModal}
          flag={(updatedImages) => saveModalChanges("images", updatedImages)}
        />
      )}

      {modalType === "installments" && selectedProductForModal && (
        <InstallmentFormModal
          isOpen={true}
          onClose={() => setModalType(null)}
          title={`Edit Installments for ${selectedProductForModal.name}`}
          defaultValues={selectedProductForModal}
          flag={(updatedInstallments) => saveModalChanges("installments", updatedInstallments)}
        />
      )}

      {showCancelConfirm && (
        <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Cancel</DialogTitle>
            </DialogHeader>
            <p>You have unsaved changes. Are you sure you want to leave?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelConfirm(false)} disabled={isSubmitting}>Stay</Button>
              <Button onClick={confirmCancel} disabled={isSubmitting}>Leave</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}