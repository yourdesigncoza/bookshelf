'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
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
  Save, 
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  FileArchive,
  Download
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { backupBooks, getBackups } from '@/lib/api';

interface Backup {
  filename: string;
  createdAt: string;
  size: number;
}

export function BackupDataSection() {
  const router = useRouter();
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(true);
  
  // Load backups
  const loadBackups = async () => {
    try {
      setIsLoadingBackups(true);
      const backupsList = await getBackups();
      setBackups(backupsList);
    } catch (error) {
      console.error('Error loading backups:', error);
      toast.error('Failed to load backups. Please try again.');
    } finally {
      setIsLoadingBackups(false);
    }
  };
  
  // Load backups on mount
  useEffect(() => {
    loadBackups();
  }, []);
  
  // Create backup
  const handleCreateBackup = async () => {
    try {
      setIsCreatingBackup(true);
      setBackupSuccess(false);
      setBackupError(null);
      
      // Create backup
      const result = await backupBooks();
      
      // Show success message
      setBackupSuccess(true);
      toast.success('Backup created successfully!');
      
      // Reload backups
      await loadBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      setBackupError(error instanceof Error ? error.message : 'Failed to create backup. Please try again.');
      toast.error('Failed to create backup. Please try again.');
    } finally {
      setIsCreatingBackup(false);
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'PPP p');
    } catch (error) {
      return dateString;
    }
  };
  
  // Download backup
  const handleDownloadBackup = async (filename: string) => {
    try {
      // Create a link to download the backup
      const link = document.createElement('a');
      link.href = `/api/books/backup/download?filename=${encodeURIComponent(filename)}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Downloading backup...');
    } catch (error) {
      console.error('Error downloading backup:', error);
      toast.error('Failed to download backup. Please try again.');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Save className="mr-2 h-5 w-5" />
          Backup Books
        </CardTitle>
        <CardDescription>
          Create backups of your book collection that you can restore later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-md border p-4 flex flex-col items-center justify-center text-center">
          <FileArchive className="h-12 w-12 mb-2 text-primary" />
          <h3 className="text-lg font-medium">Create Backup</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a backup of your current book collection that you can restore later.
          </p>
          <Button 
            onClick={handleCreateBackup} 
            disabled={isCreatingBackup}
            className="w-full sm:w-auto"
          >
            {isCreatingBackup ? 'Creating Backup...' : 'Create Backup'}
            {!isCreatingBackup && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        
        {backupSuccess && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Backup Successful</h4>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Your book data has been backed up successfully.
              </p>
            </div>
          </div>
        )}
        
        {backupError && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Backup Failed</h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {backupError}
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Backup History</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadBackups}
              disabled={isLoadingBackups}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingBackups ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          {isLoadingBackups ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse flex flex-col w-full space-y-4">
                <div className="h-8 bg-muted rounded w-full"></div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded w-full"></div>
                ))}
              </div>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No backups found. Create your first backup!</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableCaption>A list of your backups.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.filename}>
                      <TableCell className="font-medium">{backup.filename}</TableCell>
                      <TableCell>{formatDate(backup.createdAt)}</TableCell>
                      <TableCell>{formatFileSize(backup.size)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadBackup(backup.filename)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>
          Backups are stored on the server and can be downloaded for safekeeping.
        </p>
      </CardFooter>
    </Card>
  );
}
