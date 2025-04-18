'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { FocusTrap } from '@/lib/focus-trap';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { deleteBook } from '@/lib/api';

interface DeleteBookButtonProps {
  bookId: string;
  bookTitle: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onDeleted?: () => void;
}

export function DeleteBookButton({
  bookId,
  bookTitle,
  variant = 'outline',
  size = 'icon',
  className = '',
  onDeleted,
}: DeleteBookButtonProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useRef<FocusTrap | null>(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Set up focus trap for the dialog
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      focusTrapRef.current = new FocusTrap(dialogRef.current);
      focusTrapRef.current.activate();
    } else if (focusTrapRef.current) {
      focusTrapRef.current.deactivate();
      focusTrapRef.current = null;
    }

    return () => {
      if (focusTrapRef.current) {
        focusTrapRef.current.deactivate();
      }
    };
  }, [isOpen]);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBook(bookId);

      toast.success('Book deleted successfully');

      // Close the dialog
      setIsOpen(false);

      // Call the onDeleted callback if provided
      if (onDeleted) {
        onDeleted();
      }

      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <div ref={dialogRef}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          title="Delete book"
          className={`${size === 'icon' ? 'h-10 w-10 sm:h-8 sm:w-8' : ''} ${className}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this book?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete <span className="font-medium">{bookTitle}</span>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="h-10 sm:h-auto">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 sm:h-auto"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </div>
    </AlertDialog>
  );
}
