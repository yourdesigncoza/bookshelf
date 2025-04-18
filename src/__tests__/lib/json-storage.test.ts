import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import {
  ensureDataDir,
  readJsonFile,
  writeJsonFile,
  backupJsonFile,
  getBackupFiles,
} from '@/lib/json-storage';

// Mock the fs module
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
}));

// Mock the fs.promises module
jest.mock('fs/promises', () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
  readFile: jest.fn(),
  writeFile: jest.fn(),
  copyFile: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn(),
}));

// Mock path.join to return predictable paths
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn().mockImplementation((...args) => args.join('/')),
}));

// Mock process.cwd() to return a predictable path
const mockCwd = '/mock/cwd';
jest.spyOn(process, 'cwd').mockReturnValue(mockCwd);

describe('JSON Storage', () => {
  const DATA_DIR = `${mockCwd}/src/data`;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('ensureDataDir', () => {
    it('should not create directory if it already exists', async () => {
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined);
      
      await ensureDataDir();
      
      expect(fsPromises.access).toHaveBeenCalledWith(DATA_DIR);
      expect(fsPromises.mkdir).not.toHaveBeenCalled();
    });
    
    it('should create directory if it does not exist', async () => {
      (fsPromises.access as jest.Mock).mockRejectedValueOnce(new Error('Directory does not exist'));
      (fsPromises.mkdir as jest.Mock).mockResolvedValueOnce(undefined);
      
      await ensureDataDir();
      
      expect(fsPromises.access).toHaveBeenCalledWith(DATA_DIR);
      expect(fsPromises.mkdir).toHaveBeenCalledWith(DATA_DIR, { recursive: true });
    });
  });
  
  describe('readJsonFile', () => {
    it('should read and parse JSON file', async () => {
      const filename = 'test.json';
      const filePath = `${DATA_DIR}/${filename}`;
      const mockData = { test: 'data' };
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // File exists
      (fsPromises.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockData));
      
      const result = await readJsonFile(filename);
      
      expect(fsPromises.access).toHaveBeenCalledWith(filePath);
      expect(fsPromises.readFile).toHaveBeenCalledWith(filePath, 'utf8');
      expect(result).toEqual(mockData);
    });
    
    it('should create file with empty array if it does not exist', async () => {
      const filename = 'test.json';
      const filePath = `${DATA_DIR}/${filename}`;
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.access as jest.Mock).mockRejectedValueOnce(new Error('File does not exist')); // File does not exist
      (fsPromises.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
      
      const result = await readJsonFile(filename);
      
      expect(fsPromises.access).toHaveBeenCalledWith(filePath);
      expect(fsPromises.writeFile).toHaveBeenCalledWith(filePath, '[]', 'utf8');
      expect(result).toEqual([]);
    });
    
    it('should throw error if reading file fails', async () => {
      const filename = 'test.json';
      const filePath = `${DATA_DIR}/${filename}`;
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // File exists
      (fsPromises.readFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to read file'));
      
      await expect(readJsonFile(filename)).rejects.toThrow('Failed to read data from test.json');
      
      expect(fsPromises.access).toHaveBeenCalledWith(filePath);
      expect(fsPromises.readFile).toHaveBeenCalledWith(filePath, 'utf8');
    });
  });
  
  describe('writeJsonFile', () => {
    it('should write data to JSON file', async () => {
      const filename = 'test.json';
      const filePath = `${DATA_DIR}/${filename}`;
      const data = { test: 'data' };
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.writeFile as jest.Mock).mockResolvedValueOnce(undefined);
      
      await writeJsonFile(filename, data);
      
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(data, null, 2),
        'utf8'
      );
    });
    
    it('should throw error if writing file fails', async () => {
      const filename = 'test.json';
      const filePath = `${DATA_DIR}/${filename}`;
      const data = { test: 'data' };
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to write file'));
      
      await expect(writeJsonFile(filename, data)).rejects.toThrow('Failed to write data to test.json');
      
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        filePath,
        JSON.stringify(data, null, 2),
        'utf8'
      );
    });
  });
  
  describe('backupJsonFile', () => {
    it('should create a backup of a JSON file', async () => {
      const filename = 'test.json';
      const filePath = `${DATA_DIR}/${filename}`;
      
      // Mock Date.now() to return a predictable timestamp
      const mockTimestamp = 1234567890;
      jest.spyOn(Date, 'now').mockReturnValueOnce(mockTimestamp);
      
      const backupFilename = `test_backup_${mockTimestamp}.json`;
      const backupPath = `${DATA_DIR}/${backupFilename}`;
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // File exists
      (fsPromises.copyFile as jest.Mock).mockResolvedValueOnce(undefined);
      
      const result = await backupJsonFile(filename);
      
      expect(fsPromises.access).toHaveBeenCalledWith(filePath);
      expect(fsPromises.copyFile).toHaveBeenCalledWith(filePath, backupPath);
      expect(result).toBe(backupFilename);
    });
    
    it('should throw error if original file does not exist', async () => {
      const filename = 'test.json';
      const filePath = `${DATA_DIR}/${filename}`;
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.access as jest.Mock).mockRejectedValueOnce(new Error('File does not exist')); // File does not exist
      
      await expect(backupJsonFile(filename)).rejects.toThrow('Original file test.json does not exist');
      
      expect(fsPromises.access).toHaveBeenCalledWith(filePath);
      expect(fsPromises.copyFile).not.toHaveBeenCalled();
    });
    
    it('should throw error if copying file fails', async () => {
      const filename = 'test.json';
      const filePath = `${DATA_DIR}/${filename}`;
      
      // Mock Date.now() to return a predictable timestamp
      const mockTimestamp = 1234567890;
      jest.spyOn(Date, 'now').mockReturnValueOnce(mockTimestamp);
      
      const backupFilename = `test_backup_${mockTimestamp}.json`;
      const backupPath = `${DATA_DIR}/${backupFilename}`;
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // File exists
      (fsPromises.copyFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to copy file'));
      
      await expect(backupJsonFile(filename)).rejects.toThrow('Failed to backup test.json');
      
      expect(fsPromises.access).toHaveBeenCalledWith(filePath);
      expect(fsPromises.copyFile).toHaveBeenCalledWith(filePath, backupPath);
    });
  });
  
  describe('getBackupFiles', () => {
    it('should return a list of backup files', async () => {
      const mockFiles = [
        'test_backup_1234567890.json',
        'test_backup_1234567891.json',
        'other.json',
      ];
      
      const mockStats = {
        birthtime: new Date(),
        size: 1024,
      };
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.readdir as jest.Mock).mockResolvedValueOnce(mockFiles);
      (fsPromises.stat as jest.Mock).mockResolvedValue(mockStats);
      
      const result = await getBackupFiles();
      
      expect(fsPromises.readdir).toHaveBeenCalledWith(DATA_DIR);
      expect(fsPromises.stat).toHaveBeenCalledTimes(2); // Only for backup files
      
      expect(result).toHaveLength(2);
      expect(result[0].filename).toBe('test_backup_1234567890.json');
      expect(result[1].filename).toBe('test_backup_1234567891.json');
      expect(result[0].createdAt).toBe(mockStats.birthtime.toISOString());
      expect(result[0].size).toBe(mockStats.size);
    });
    
    it('should return empty array if no backup files exist', async () => {
      const mockFiles = ['test.json', 'other.json'];
      
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.readdir as jest.Mock).mockResolvedValueOnce(mockFiles);
      
      const result = await getBackupFiles();
      
      expect(fsPromises.readdir).toHaveBeenCalledWith(DATA_DIR);
      expect(fsPromises.stat).not.toHaveBeenCalled();
      
      expect(result).toHaveLength(0);
    });
    
    it('should throw error if reading directory fails', async () => {
      (fsPromises.access as jest.Mock).mockResolvedValueOnce(undefined); // Data dir exists
      (fsPromises.readdir as jest.Mock).mockRejectedValueOnce(new Error('Failed to read directory'));
      
      await expect(getBackupFiles()).rejects.toThrow('Failed to get backup files');
      
      expect(fsPromises.readdir).toHaveBeenCalledWith(DATA_DIR);
    });
  });
});
