'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DataImportFormProps {
  endpoint: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
}

export function DataImportForm({
  endpoint,
  onSuccess,
  onError,
  acceptedFileTypes = '.json',
  maxSizeInMB = 5
}: DataImportFormProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setError('Please select a file to import');
      return;
    }

    const file = fileInput.files[0];

    // Check file size
    if (file.size > maxSizeInBytes) {
      setError(`File size exceeds the maximum limit of ${maxSizeInMB}MB`);
      return;
    }

    try {
      setIsImporting(true);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Send the file to the API endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Import failed: ${response.statusText}`);
      }

      const result = await response.json();
      setSuccess(`Import successful! ${result.count || ''} books imported.`);
      
      // Reset the file input
      if (fileInput) {
        fileInput.value = '';
      }

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Import error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to import data';
      setError(errorMessage);
      
      // Call the onError callback if provided
      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleImport} className="flex items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          disabled={isImporting}
          className="flex-1"
        />
        <Button type="submit" disabled={isImporting}>
          {isImporting ? 'Importing...' : 'Import'}
          {!isImporting && <Upload className="ml-2 h-4 w-4" />}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-muted-foreground">
        <p>Accepted file types: {acceptedFileTypes}</p>
        <p>Maximum file size: {maxSizeInMB}MB</p>
      </div>
    </div>
  );
}
