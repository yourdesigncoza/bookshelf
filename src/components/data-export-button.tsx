'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface DataExportButtonProps {
  endpoint: string;
  filename?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children: React.ReactNode;
}

export function DataExportButton({
  endpoint,
  filename,
  variant = 'outline',
  size = 'default',
  className,
  children
}: DataExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Fetch the data from the API endpoint
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      // Get the filename from the Content-Disposition header or use the provided one
      let downloadFilename = filename;
      const contentDisposition = response.headers.get('Content-Disposition');
      
      if (contentDisposition && !downloadFilename) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          downloadFilename = filenameMatch[1];
        }
      }
      
      // Default filename if none is provided or found
      downloadFilename = downloadFilename || 'export.json';
      
      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? 'Exporting...' : children}
      {!isExporting && <Download className="ml-2 h-4 w-4" />}
    </Button>
  );
}
