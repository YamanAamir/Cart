'use client';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

const mockProducts = [
  { id: 1, name: 'AG-697UB Deluxe Blender Grinder' },
  { id: 2, name: 'Smart LED TV 43-Inch' },
  { id: 3, name: 'Wireless Headphones Pro' },
];

export default function FaqForm({ faq = null, onSave, onCancel }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('active');
  const [previewProduct, setPreviewProduct] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question || '');
      setAnswer(faq.answer || '');
      setStatus(faq.status || 'active');
    } else {
      setQuestion('');
      setAnswer('');
      setStatus('active');
      setPreviewProduct('');
    }
  }, [faq]);

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (faq) {
        await api.put(`/faqs/${faq.id}`, { question, answer, status });
      } else {
        await api.post('/faqs', { question, answer, status });
        // Reset form after create
        setQuestion('');
        setAnswer('');
        setStatus('active');
        setPreviewProduct('');
      }
      onSave();
    } catch (error) {
      toast.error(faq ? 'Failed to update FAQ' : 'Failed to create FAQ');
      console.error('Error saving FAQ:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPlaceholder = () => {
    navigator.clipboard.writeText('[PRODUCT_NAME]');
    toast.success('Placeholder copied to clipboard');
  };

  const previewQuestion = question.replace(/\[PRODUCT_NAME\]/g, previewProduct || 'Product Name');
  const previewAnswer = answer.replace(/\[PRODUCT_NAME\]/g, previewProduct || 'Product Name');

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Question</label>
          <Textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g., What is the warranty period for [PRODUCT_NAME]?"
            required
          />
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            Use <strong className="mx-1">[PRODUCT_NAME]</strong> to insert the product name dynamically.
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyPlaceholder}
              className="ml-2"
            >
              <Copy size={16} />
            </Button>
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Answer</label>
          <Textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="e.g., The [PRODUCT_NAME] comes with a 1-year warranty."
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Preview with Product</label>
          <Select onValueChange={setPreviewProduct} value={previewProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {mockProducts.map(product => (
                <SelectItem key={product.id} value={product.name}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Card className="p-4 mb-4">
          <h3 className="text-lg font-medium">Preview</h3>
          <p><strong>Question:</strong> {previewQuestion}</p>
          <p><strong>Answer:</strong> {previewAnswer}</p>
        </Card>
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (faq ? 'Updating...' : 'Creating...') : (faq ? 'Update FAQ' : 'Create FAQ')}
          </Button>
          {faq && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}