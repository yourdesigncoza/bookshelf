#!/usr/bin/env node

/**
 * Dependency Update Script
 * 
 * This script checks for and applies non-breaking updates to dependencies.
 * It uses npm-check-updates to find updates and npm to apply them.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Check if npm-check-updates is installed
function checkNcu() {
  try {
    execSync('ncu --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Install npm-check-updates if not installed
function installNcu() {
  log.step('Installing npm-check-updates...');
  try {
    execSync('npm install -g npm-check-updates', { stdio: 'inherit' });
    log.success('npm-check-updates installed successfully.');
    return true;
  } catch (error) {
    log.error('Failed to install npm-check-updates.');
    return false;
  }
}

// Create a backup of package.json
function backupPackageJson() {
  log.step('Creating backup of package.json...');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const backupPath = path.join(process.cwd(), 'package.json.backup');
  
  try {
    fs.copyFileSync(packageJsonPath, backupPath);
    log.success('Backup created successfully.');
    return true;
  } catch (error) {
    log.error(`Failed to create backup: ${error.message}`);
    return false;
  }
}

// Restore package.json from backup
function restorePackageJson() {
  log.step('Restoring package.json from backup...');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const backupPath = path.join(process.cwd(), 'package.json.backup');
  
  try {
    fs.copyFileSync(backupPath, packageJsonPath);
    log.success('Restored package.json from backup.');
    return true;
  } catch (error) {
    log.error(`Failed to restore backup: ${error.message}`);
    return false;
  }
}

// Check for updates
function checkUpdates() {
  log.step('Checking for dependency updates...');
  try {
    const output = execSync('ncu --packageFile package.json', { encoding: 'utf8' });
    log.info(output);
    
    if (output.includes('All dependencies match the latest package versions')) {
      log.success('All dependencies are up to date.');
      return false;
    }
    
    return true;
  } catch (error) {
    log.error(`Failed to check for updates: ${error.message}`);
    return false;
  }
}

// Apply non-breaking updates
function applyUpdates() {
  log.step('Applying non-breaking updates...');
  try {
    // Update package.json with new versions (patch and minor updates only)
    execSync('ncu --upgrade --target minor', { stdio: 'inherit' });
    
    // Install updated dependencies
    log.step('Installing updated dependencies...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    
    log.success('Dependencies updated successfully.');
    return true;
  } catch (error) {
    log.error(`Failed to apply updates: ${error.message}`);
    return false;
  }
}

// Run tests to ensure updates didn't break anything
function runTests() {
  log.step('Running tests to verify updates...');
  try {
    execSync('npm test', { stdio: 'inherit' });
    log.success('Tests passed successfully.');
    return true;
  } catch (error) {
    log.error('Tests failed after dependency updates.');
    return false;
  }
}

// Clean up backup file
function cleanupBackup() {
  const backupPath = path.join(process.cwd(), 'package.json.backup');
  
  try {
    fs.unlinkSync(backupPath);
    log.info('Backup file removed.');
  } catch (error) {
    log.warning(`Failed to remove backup file: ${error.message}`);
  }
}

// Main function
async function main() {
  console.log(`${colors.magenta}=== Dependency Update Script ===${colors.reset}\n`);
  
  // Check if npm-check-updates is installed
  if (!checkNcu()) {
    if (!installNcu()) {
      log.error('Cannot proceed without npm-check-updates.');
      process.exit(1);
    }
  }
  
  // Create backup of package.json
  if (!backupPackageJson()) {
    log.error('Cannot proceed without creating a backup.');
    process.exit(1);
  }
  
  // Check for updates
  const updatesAvailable = checkUpdates();
  
  if (!updatesAvailable) {
    cleanupBackup();
    log.info('No updates to apply.');
    process.exit(0);
  }
  
  // Apply updates
  if (!applyUpdates()) {
    log.warning('Failed to apply updates. Restoring package.json from backup...');
    restorePackageJson();
    cleanupBackup();
    process.exit(1);
  }
  
  // Run tests
  if (!runTests()) {
    log.warning('Tests failed after applying updates. Restoring package.json from backup...');
    restorePackageJson();
    log.step('Reinstalling original dependencies...');
    try {
      execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    } catch (error) {
      log.error('Failed to reinstall original dependencies.');
    }
    cleanupBackup();
    process.exit(1);
  }
  
  // Clean up
  cleanupBackup();
  
  console.log(`\n${colors.green}=== Dependency Update Completed Successfully ===${colors.reset}`);
}

// Run the script
main().catch(error => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
