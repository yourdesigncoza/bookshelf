#!/usr/bin/env node

/**
 * Database Backup Script
 * 
 * This script creates a backup of the application data stored in JSON files.
 * It compresses the data files into a timestamped zip archive.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}[STEP]${colors.reset} ${msg}`),
};

// Create backup directory if it doesn't exist
function createBackupDir() {
  const backupDir = path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupDir)) {
    log.step('Creating backup directory...');
    try {
      fs.mkdirSync(backupDir);
      log.success('Backup directory created successfully.');
    } catch (error) {
      log.error(`Failed to create backup directory: ${error.message}`);
      return false;
    }
  }
  
  return true;
}

// Get timestamp for backup filename
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

// Check if data directory exists
function checkDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  
  if (!fs.existsSync(dataDir)) {
    log.error('Data directory not found. Make sure you are running this script from the project root.');
    return false;
  }
  
  return true;
}

// Create backup of data files
function backupData() {
  log.step('Creating backup of data files...');
  
  const timestamp = getTimestamp();
  const backupFilename = `bookshelf_backup_${timestamp}.zip`;
  const backupPath = path.join(process.cwd(), 'backups', backupFilename);
  const dataDir = path.join(process.cwd(), 'data');
  
  try {
    // Create zip archive of data directory
    execSync(`zip -r "${backupPath}" "${dataDir}"`, { stdio: 'inherit' });
    
    log.success(`Backup created successfully: ${backupPath}`);
    return backupPath;
  } catch (error) {
    log.error(`Failed to create backup: ${error.message}`);
    return null;
  }
}

// Clean up old backups (keep only the last 10)
function cleanupOldBackups() {
  log.step('Cleaning up old backups...');
  
  const backupDir = path.join(process.cwd(), 'backups');
  const maxBackups = 10;
  
  try {
    // Get all backup files
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('bookshelf_backup_') && file.endsWith('.zip'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        time: fs.statSync(path.join(backupDir, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time); // Sort by time (newest first)
    
    // Remove old backups
    if (files.length > maxBackups) {
      log.info(`Removing ${files.length - maxBackups} old backup(s)...`);
      
      for (let i = maxBackups; i < files.length; i++) {
        fs.unlinkSync(files[i].path);
        log.info(`Removed old backup: ${files[i].name}`);
      }
    } else {
      log.info(`No old backups to remove. Current backup count: ${files.length}`);
    }
  } catch (error) {
    log.warning(`Failed to clean up old backups: ${error.message}`);
  }
}

// Main function
async function main() {
  console.log(`${colors.magenta}=== Database Backup Script ===${colors.reset}\n`);
  
  // Check if data directory exists
  if (!checkDataDir()) {
    process.exit(1);
  }
  
  // Create backup directory if it doesn't exist
  if (!createBackupDir()) {
    process.exit(1);
  }
  
  // Create backup
  const backupPath = backupData();
  
  if (!backupPath) {
    process.exit(1);
  }
  
  // Clean up old backups
  cleanupOldBackups();
  
  console.log(`\n${colors.green}=== Backup Completed Successfully ===${colors.reset}`);
}

// Run the script
main().catch(error => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
