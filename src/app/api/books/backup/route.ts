import { NextRequest, NextResponse } from 'next/server';
import { backupBooks, getBackupsList } from '@/lib/book-storage';
import { withErrorHandling } from '../../middleware';
import { logger } from '@/lib/logger';

// POST /api/books/backup - Create a backup of all books
export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    // Create a backup
    const backupFilename = await backupBooks();

    return NextResponse.json({
      success: true,
      filename: backupFilename,
      message: 'Backup created successfully'
    });
  } catch (error) {
    logger.error('Error in POST /api/books/backup', { error });
    throw error;
  }
});

// GET /api/books/backup - Get a list of all backups
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    // Get all backups
    const backups = await getBackupsList();

    return NextResponse.json({ backups });
  } catch (error) {
    logger.error('Error in GET /api/books/backup', { error });
    throw error;
  }
});
