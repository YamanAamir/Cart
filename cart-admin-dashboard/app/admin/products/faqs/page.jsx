'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import FaqForm from '@/components/FaqForm';
import api from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/faqs');
      setFaqs(res.data);
    } catch (error) {
      toast.error('Failed to fetch FAQs');
      console.error('Error fetching FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/faqs/${faqToDelete}`);
      toast.success('FAQ deleted successfully');
      fetchFaqs();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete FAQ');
      console.error('Error deleting FAQ:', error);
    } finally {
      setIsDeleting(false);
      setFaqToDelete(null);
    }
  };

  const openDeleteDialog = (id) => {
    setFaqToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
      <div>
        <div className="space-y-4 sm:space-y-6 p-4">
          <h1 className="text-xl sm:text-2xl font-bold">Manage FAQs</h1>
          <FaqForm
            faq={editingFaq}
            onSave={() => {
              fetchFaqs();
              setEditingFaq(null);
              toast.success(editingFaq ? 'FAQ updated successfully' : 'FAQ created successfully');
            }}
            onCancel={() => setEditingFaq(null)}
          />
          <div className="mt-4 sm:mt-6 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : faqs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-500 mb-4" />
                <p className="text-base sm:text-lg text-gray-600">Data Not Found</p>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <strong className="text-sm sm:text-base">Your Products FAQs</strong>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border-b">
                      <AccordionTrigger className="text-sm sm:text-base py-2 sm:py-3">
                        {index + 1}. {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="p-4">
                        <p className="text-sm sm:text-base mb-2">{faq.answer}</p>
                        <p className="text-xs sm:text-sm mb-4">Status: {faq.status}</p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => setEditingFaq(faq)}
                            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => openDeleteDialog(faq.id)}
                            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
                          >
                            Delete
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}
          </div>
        </div>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="w-[90vw] max-w-md sm:max-w-lg p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Confirm Deletion</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Are you sure you want to delete this FAQ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}