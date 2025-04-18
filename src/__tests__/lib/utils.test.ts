import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });
    
    it('should handle conditional class names', () => {
      const condition = true;
      const result = cn('class1', condition ? 'class2' : '');
      expect(result).toBe('class1 class2');
    });
    
    it('should handle falsy values', () => {
      const result = cn('class1', false && 'class2', null, undefined, 0);
      expect(result).toBe('class1');
    });
    
    it('should handle Tailwind class conflicts', () => {
      const result = cn('p-4', 'p-6');
      expect(result).toBe('p-6');
    });
    
    it('should handle array of class names', () => {
      const classes = ['class1', 'class2'];
      const result = cn(...classes, 'class3');
      expect(result).toBe('class1 class2 class3');
    });
  });
  
  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const dateString = '2023-01-15T00:00:00.000Z';
      const formattedDate = format(parseISO(dateString), 'MMMM d, yyyy');
      expect(formattedDate).toBe('January 15, 2023');
    });
    
    it('should format date with different pattern', () => {
      const dateString = '2023-01-15T00:00:00.000Z';
      const formattedDate = format(parseISO(dateString), 'MMM d, yyyy');
      expect(formattedDate).toBe('Jan 15, 2023');
    });
    
    it('should handle invalid date string', () => {
      const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not specified';
        try {
          return format(parseISO(dateString), 'MMMM d, yyyy');
        } catch (error) {
          return 'Invalid date';
        }
      };
      
      expect(formatDate('invalid-date')).toBe('Invalid date');
      expect(formatDate()).toBe('Not specified');
    });
  });
  
  describe('File Size Formatting', () => {
    it('should format file size in bytes', () => {
      const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      };
      
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1500)).toBe('1.5 KB');
      expect(formatFileSize(1500000)).toBe('1.4 MB');
    });
  });
});
