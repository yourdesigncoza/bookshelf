import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { logger, AppError } from './logger';

// Define the base directory for data storage
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

// Ensure the data directory exists
export const ensureDataDir = async (): Promise<void> => {
  try {
    await fsPromises.access(DATA_DIR);
  } catch (error) {
    // Directory doesn't exist, create it
    await fsPromises.mkdir(DATA_DIR, { recursive: true });
  }
};

// Generic function to read data from a JSON file
export async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    await ensureDataDir();

    const filePath = path.join(DATA_DIR, filename);

    // Check if file exists
    try {
      await fsPromises.access(filePath);
    } catch (error) {
      // File doesn't exist, create it with default empty array
      await fsPromises.writeFile(filePath, '[]', 'utf8');
      return [] as unknown as T;
    }

    // Read and parse the file
    const data = await fsPromises.readFile(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(`Error reading JSON file ${filename}`, { error, filename });
    throw new AppError(`Failed to read data from ${filename}`, 500, true, { filename });
  }
}

// Generic function to write data to a JSON file
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  try {
    await ensureDataDir();

    const filePath = path.join(DATA_DIR, filename);
    const jsonData = JSON.stringify(data, null, 2);

    await fsPromises.writeFile(filePath, jsonData, 'utf8');
  } catch (error) {
    logger.error(`Error writing to JSON file ${filename}`, { error, filename });
    throw new AppError(`Failed to write data to ${filename}`, 500, true, { filename });
  }
}

// Function to create a backup of a JSON file
export async function backupJsonFile(filename: string): Promise<string> {
  try {
    await ensureDataDir();

    const filePath = path.join(DATA_DIR, filename);
    const backupFilename = `${path.basename(filename, '.json')}_backup_${Date.now()}.json`;
    const backupPath = path.join(DATA_DIR, backupFilename);

    // Check if original file exists
    try {
      await fsPromises.access(filePath);
    } catch (error) {
      throw new Error(`Original file ${filename} does not exist`);
    }

    // Copy the file to create a backup
    await fsPromises.copyFile(filePath, backupPath);
    return backupFilename;
  } catch (error) {
    logger.error(`Error backing up JSON file ${filename}`, { error, filename });
    throw new AppError(`Failed to backup ${filename}`, 500, true, { filename });
  }
}

// Function to get a list of backup files
export async function getBackupFiles() {
  try {
    await ensureDataDir();

    // Get all files in the data directory
    const files = await fsPromises.readdir(DATA_DIR);

    // Filter for backup files
    const backupFiles = files.filter(file =>
      file.includes('_backup_') && file.endsWith('.json')
    );

    // Get file stats for each backup
    const backupDetails = await Promise.all(
      backupFiles.map(async (file) => {
        const filePath = path.join(DATA_DIR, file);
        const stats = await fsPromises.stat(filePath);
        return {
          filename: file,
          createdAt: stats.birthtime.toISOString(),
          size: stats.size
        };
      })
    );

    // Sort by creation date (newest first)
    backupDetails.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return backupDetails;
  } catch (error) {
    logger.error('Error getting backup files', { error });
    throw new AppError('Failed to get backup files', 500, true);
  }
}

// Function to import data from a user-specified location
export async function importJsonFile(importPath: string, filename: string): Promise<void> {
  try {
    await ensureDataDir();

    const filePath = path.join(DATA_DIR, filename);

    // Check if import file exists
    try {
      await fsPromises.access(importPath);
    } catch (error) {
      throw new Error(`Import file at ${importPath} does not exist`);
    }

    // Validate that the import file contains valid JSON
    try {
      const data = await fsPromises.readFile(importPath, 'utf8');
      JSON.parse(data); // This will throw if the JSON is invalid
    } catch (error) {
      throw new Error(`Import file does not contain valid JSON`);
    }

    // Create a backup of the current file if it exists
    try {
      await fsPromises.access(filePath);
      await backupJsonFile(filename);
    } catch (error) {
      // No existing file to backup, that's fine
    }

    // Copy the import file to replace the current file
    await fsPromises.copyFile(importPath, filePath);
  } catch (error) {
    logger.error(`Error importing JSON file to ${filename}`, { error, filename, importPath });
    throw new AppError(`Failed to import to ${filename}`, 500, true, { filename, importPath });
  }
}
