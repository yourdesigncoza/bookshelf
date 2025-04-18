'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  Upload, 
  FileJson, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';

export function ImportDataSection() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        setImportError('Please select a JSON file.');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setImportError(null);
    }
  };
  
  // Trigger file input click
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  // Handle import
  const handleImport = async () => {
    if (!selectedFile) return;
    
    try {
      setIsImporting(true);
      setImportError(null);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);
      
      // Read the file
      const fileContent = await readFileAsText(selectedFile);
      
      // Validate JSON
      try {
        JSON.parse(fileContent);
      } catch (error) {
        setImportError('Invalid JSON file. Please select a valid export file.');
        setIsImporting(false);
        clearInterval(progressInterval);
        setUploadProgress(0);
        return;
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Send the file to the server
      const response = await fetch('/api/books/import', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to import books');
      }
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Show success message
      setImportSuccess(true);
      toast.success('Books imported successfully!');
      
      // Reset form
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh the page after a delay
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Error importing books:', error);
      setImportError(error instanceof Error ? error.message : 'Failed to import books. Please try again.');
      toast.error('Failed to import books. Please try again.');
    } finally {
      setIsImporting(false);
      setIsConfirmOpen(false);
    }
  };
  
  // Read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Import Books
        </CardTitle>
        <CardDescription>
          Import your book collection from a JSON file that was previously exported.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border p-4 flex flex-col items-center justify-center text-center">
          <FileJson className="h-12 w-12 mb-2 text-primary" />
          <h3 className="text-lg font-medium">Import from JSON</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a JSON file containing book data to import.
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              onClick={handleSelectFile} 
              disabled={isImporting}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Select File
            </Button>
            
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  disabled={!selectedFile || isImporting}
                  className="w-full sm:w-auto"
                >
                  {isImporting ? 'Importing...' : 'Import Books'}
                  {!isImporting && <Upload className="ml-2 h-4 w-4" />}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to import this data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will replace your current book collection with the data from the selected file.
                    It's recommended to create a backup before proceeding.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleImport}>
                    Import
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          {selectedFile && (
            <p className="text-sm mt-2">
              Selected file: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}
        </div>
        
        {isImporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {importSuccess && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Import Successful</h4>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Your book data has been imported successfully. The page will refresh shortly.
              </p>
            </div>
          </div>
        )}
        
        {importError && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Import Failed</h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {importError}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>
          Importing will replace your current book collection. Make sure to backup your data before importing.
        </p>
      </CardFooter>
    </Card>
  );
}
