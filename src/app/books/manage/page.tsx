import { Metadata } from 'next';
import { DataManagementClient } from './client';

export const metadata: Metadata = {
  title: 'Manage Data | Bookshelf',
  description: 'Import, export, and backup your book data',
};

export default function DataManagementPage() {
  return (
    <div className="container py-8">
      <DataManagementClient />
    </div>
  );
}
