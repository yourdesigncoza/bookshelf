import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { withErrorHandling } from '../../../middleware';
import { logger } from '@/lib/logger';

// GET /api/books/backup/download - Download a specific backup file
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }
    
    // Validate filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    
    // Only allow backup files
    if (!filename.includes('_backup_') || !filename.endsWith('.json')) {
      return NextResponse.json({ error: 'Invalid backup file' }, { status: 400 });
    }
    
    // Get the file path
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const filePath = path.join(dataDir, filename);
    
    // Check if the file exists
    try {
      await fsPromises.access(filePath);
    } catch (error) {
      return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
    }
    
    // Read the file
    const fileContent = await fsPromises.readFile(filePath, 'utf-8');
    
    // Return the file
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    logger.error('Error in GET /api/books/backup/download', { error });
    throw error;
  }
});
