import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

/**
 * Creates a dynamically imported component with a loading skeleton
 * @param importFunc - The import function for the component
 * @param skeletonHeight - The height of the skeleton (default: 400px)
 * @param ssr - Whether to enable server-side rendering (default: false)
 * @returns The dynamically imported component
 */
export function createDynamicComponent<T>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  skeletonHeight: string = '400px',
  ssr: boolean = false
) {
  return dynamic(importFunc, {
    loading: () => (
      <Card className="w-full p-4">
        <Skeleton className="w-full" style={{ height: skeletonHeight }} />
      </Card>
    ),
    ssr,
  });
}

// Dynamically imported components
export const DynamicStatisticsDashboard = createDynamicComponent(
  () => import('@/components/books/statistics-dashboard'),
  '600px'
);

export const DynamicBooksTable = createDynamicComponent(
  () => import('@/components/books/books-table'),
  '500px'
);

export const DynamicVirtualizedBooksTable = createDynamicComponent(
  () => import('@/components/books/virtualized-books-table'),
  '500px'
);

export const DynamicBookForm = createDynamicComponent(
  () => import('@/components/books/book-form'),
  '800px'
);

export const DynamicChart = createDynamicComponent(
  () => import('@/components/ui/chart'),
  '300px'
);

export const DynamicBackupDataSection = createDynamicComponent(
  () => import('@/components/books/backup-data-section'),
  '300px'
);

export const DynamicExportDataSection = createDynamicComponent(
  () => import('@/components/books/export-data-section'),
  '300px'
);

export const DynamicImportDataSection = createDynamicComponent(
  () => import('@/components/books/import-data-section'),
  '300px'
);

// Add more dynamic components as needed
