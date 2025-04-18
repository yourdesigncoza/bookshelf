#!/usr/bin/env node

/**
 * Health Check Script
 * 
 * This script verifies that all components of the application are functioning correctly.
 * It checks the data directory, file permissions, and runs basic tests.
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

// Check data directory
function checkDataDirectory() {
  log.step('Checking data directory...');
  
  const dataDir = path.join(process.cwd(), 'data');
  
  if (!fs.existsSync(dataDir)) {
    log.error('Data directory not found.');
    return false;
  }
  
  try {
    // Check if directory is readable and writable
    fs.accessSync(dataDir, fs.constants.R_OK | fs.constants.W_OK);
    log.success('Data directory is accessible (read/write).');
    
    // Check if directory contains any files
    const files = fs.readdirSync(dataDir);
    
    if (files.length === 0) {
      log.warning('Data directory is empty.');
    } else {
      log.info(`Data directory contains ${files.length} file(s).`);
      
      // Check if any JSON files exist
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        log.warning('No JSON files found in data directory.');
      } else {
        log.info(`Found ${jsonFiles.length} JSON file(s) in data directory.`);
        
        // Check if JSON files are valid
        for (const file of jsonFiles) {
          const filePath = path.join(dataDir, file);
          
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            JSON.parse(content);
            log.info(`${file}: Valid JSON`);
          } catch (error) {
            log.error(`${file}: Invalid JSON - ${error.message}`);
            return false;
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    log.error(`Data directory check failed: ${error.message}`);
    return false;
  }
}

// Check environment variables
function checkEnvironmentVariables() {
  log.step('Checking environment variables...');
  
  const requiredVars = [
    'NEXT_PUBLIC_APP_URL',
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    log.warning(`Missing required environment variables: ${missingVars.join(', ')}`);
    log.info('This may cause issues in production. Make sure to set these variables in your environment or .env file.');
  } else {
    log.success('All required environment variables are set.');
  }
  
  return true;
}

// Check dependencies
function checkDependencies() {
  log.step('Checking dependencies...');
  
  try {
    execSync('npm ls --depth=0', { stdio: 'inherit' });
    log.success('Dependencies check completed.');
    return true;
  } catch (error) {
    log.warning('Some dependencies may be missing or have issues.');
    return true; // Continue despite warnings
  }
}

// Run basic tests
function runBasicTests() {
  log.step('Running basic tests...');
  
  try {
    execSync('npm test -- --silent', { stdio: 'inherit' });
    log.success('Basic tests passed.');
    return true;
  } catch (error) {
    log.error('Basic tests failed.');
    return false;
  }
}

// Check build process
function checkBuildProcess() {
  log.step('Checking build process...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log.success('Build process completed successfully.');
    return true;
  } catch (error) {
    log.error('Build process failed.');
    return false;
  }
}

// Generate health report
function generateHealthReport(results) {
  log.step('Generating health report...');
  
  const reportDir = path.join(process.cwd(), 'reports');
  
  if (!fs.existsSync(reportDir)) {
    try {
      fs.mkdirSync(reportDir);
    } catch (error) {
      log.error(`Failed to create reports directory: ${error.message}`);
      return;
    }
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const reportPath = path.join(reportDir, `health-report-${timestamp}.json`);
  
  const report = {
    timestamp: new Date().toISOString(),
    results,
    overall: Object.values(results).every(result => result),
  };
  
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log.success(`Health report generated: ${reportPath}`);
  } catch (error) {
    log.error(`Failed to generate health report: ${error.message}`);
  }
}

// Main function
async function main() {
  console.log(`${colors.magenta}=== Health Check Script ===${colors.reset}\n`);
  
  // Load environment variables from .env file
  try {
    require('dotenv').config();
  } catch (error) {
    log.warning('Failed to load .env file. This is not critical if environment variables are set elsewhere.');
  }
  
  const results = {
    dataDirectory: checkDataDirectory(),
    environmentVariables: checkEnvironmentVariables(),
    dependencies: checkDependencies(),
    basicTests: runBasicTests(),
    buildProcess: checkBuildProcess(),
  };
  
  // Generate health report
  generateHealthReport(results);
  
  // Print summary
  console.log(`\n${colors.magenta}=== Health Check Summary ===${colors.reset}\n`);
  
  for (const [check, result] of Object.entries(results)) {
    const status = result ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`;
    console.log(`${check}: ${status}`);
  }
  
  const overallResult = Object.values(results).every(result => result);
  
  console.log(`\n${colors.magenta}=== Overall Health ===${colors.reset}`);
  console.log(overallResult ? `${colors.green}HEALTHY${colors.reset}` : `${colors.red}UNHEALTHY${colors.reset}`);
  
  process.exit(overallResult ? 0 : 1);
}

// Run the script
main().catch(error => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
