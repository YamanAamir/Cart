// /admin/products/bulk-edit/page.js
import { Suspense } from 'react';
import BulkEdit from './BulkEdit';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

export const dynamic = 'force-dynamic';

export default function BulkEditPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <BulkEdit />
    </Suspense>
  );
}