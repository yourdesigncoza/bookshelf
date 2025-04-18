'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  FileJson, 
  CheckCircle2
} from 'lucide-react';
import { exportBooks } from '@/lib/api';

export function ExportDataSection() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);
      
      // Get the export URL
      const exportUrl = await exportBooks();
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = exportUrl;
      link.download = `bookshelf-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the URL to free up memory
      URL.revokeObjectURL(exportUrl);
      
      // Show success message
      setExportSuccess(true);
      toast.success('Books exported successfully!');
    } catch (error) {
      console.error('Error exporting books:', error);
      toast.error('Failed to export books. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Export Books
        </CardTitle>
        <CardDescription>
          Export your book collection as a JSON file that you can save for backup or transfer to another device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border p-4 flex flex-col items-center justify-center text-center">
          <FileJson className="h-12 w-12 mb-2 text-primary" />
          <h3 className="text-lg font-medium">Export as JSON</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your book data will be exported as a JSON file that you can save to your device.
          </p>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full sm:w-auto"
          >
            {isExporting ? 'Exporting...' : 'Export Books'}
            {!isExporting && <Download className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        
        {exportSuccess && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Export Successful</h4>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Your book data has been exported successfully. The download should start automatically.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>
          The exported file contains all your book data in JSON format. You can use this file to restore your data later.
        </p>
      </CardFooter>
    </Card>
  );
}
