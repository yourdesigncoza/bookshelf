import { logger } from './logger';

// Mock data for client-side rendering
const mockData = {
  'books.json': [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genre: "Classic",
      rating: 4,
      readDate: "2023-01-15",
      notes: "A classic novel about the American Dream",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
      pageCount: 180,
      createdAt: "2023-01-01T00:00:00.000Z",
      updatedAt: "2023-01-01T00:00:00.000Z"
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      genre: "Classic",
      rating: 5,
      readDate: "2023-02-20",
      notes: "A powerful story about racial injustice",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
      pageCount: 281,
      createdAt: "2023-02-01T00:00:00.000Z",
      updatedAt: "2023-02-01T00:00:00.000Z"
    },
    {
      id: "3",
      title: "1984",
      author: "George Orwell",
      genre: "Dystopian",
      rating: 4,
      readDate: "2023-03-10",
      notes: "A chilling vision of a totalitarian future",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
      pageCount: 328,
      createdAt: "2023-03-01T00:00:00.000Z",
      updatedAt: "2023-03-01T00:00:00.000Z"
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Romance",
      rating: 4,
      readDate: "2023-04-05",
      notes: "A classic romance novel",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
      pageCount: 279,
      createdAt: "2023-04-01T00:00:00.000Z",
      updatedAt: "2023-04-01T00:00:00.000Z"
    },
    {
      id: "5",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      rating: 5,
      readDate: "2023-05-15",
      notes: "A delightful fantasy adventure",
      coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
      pageCount: 310,
      createdAt: "2023-05-01T00:00:00.000Z",
      updatedAt: "2023-05-01T00:00:00.000Z"
    }
  ]
};

// Generic function to read data from a JSON file
export async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    // Return mock data for client-side rendering
    if (mockData[filename]) {
      return mockData[filename] as unknown as T;
    }
    
    // Return empty array if no mock data is available
    return [] as unknown as T;
  } catch (error) {
    logger.error(`Error reading JSON file ${filename}`, { error, filename });
    return [] as unknown as T;
  }
}

// Generic function to write data to a JSON file
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  try {
    // In client-side, we just update the mock data
    mockData[filename] = data;
  } catch (error) {
    logger.error(`Error writing to JSON file ${filename}`, { error, filename });
  }
}

// Function to create a backup of a JSON file
export async function backupJsonFile(filename: string): Promise<string> {
  try {
    // In client-side, we just return a mock backup filename
    const backupFilename = `${filename.replace('.json', '')}_backup_${Date.now()}.json`;
    return backupFilename;
  } catch (error) {
    logger.error(`Error backing up JSON file ${filename}`, { error, filename });
    return '';
  }
}

// Function to get a list of backup files
export async function getBackupFiles() {
  try {
    // Return mock backup files
    return [
      {
        filename: 'books_backup_1622548800000.json',
        createdAt: '2021-06-01T12:00:00.000Z',
        size: 1024
      },
      {
        filename: 'books_backup_1625140800000.json',
        createdAt: '2021-07-01T12:00:00.000Z',
        size: 2048
      }
    ];
  } catch (error) {
    logger.error('Error getting backup files', { error });
    return [];
  }
}

// Function to import data from a user-specified location
export async function importJsonFile(importPath: string, filename: string): Promise<void> {
  try {
    // In client-side, we don't actually import anything
    logger.info(`Mock import from ${importPath} to ${filename}`);
  } catch (error) {
    logger.error(`Error importing JSON file to ${filename}`, { error, filename, importPath });
  }
}

// Function to export data to a user-specified location
export async function exportJsonFile(filename: string): Promise<string> {
  try {
    // In client-side, we just return a mock URL
    return 'blob:http://localhost:3000/mock-export-url';
  } catch (error) {
    logger.error(`Error exporting JSON file ${filename}`, { error, filename });
    return '';
  }
}

// Ensure the data directory exists (no-op in client-side)
export const ensureDataDir = async (): Promise<void> => {
  // No-op in client-side
};
