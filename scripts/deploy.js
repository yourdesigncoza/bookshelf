#!/usr/bin/env node

/**
 * Deployment helper script for Bookshelf application
 * 
 * This script helps with the deployment process by:
 * 1. Validating the environment variables
 * 2. Building the application
 * 3. Running pre-deployment checks
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

// Check if .env file exists
function checkEnvFile() {
  log.step('Checking environment variables...');
  
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    log.warning('.env file not found. Creating from .env.example...');
    
    const envExamplePath = path.join(process.cwd(), '.env.example');
    
    if (!fs.existsSync(envExamplePath)) {
      log.error('.env.example file not found. Please create a .env file manually.');
      process.exit(1);
    }
    
    fs.copyFileSync(envExamplePath, envPath);
    log.info('.env file created from .env.example. Please update it with your actual values.');
  } else {
    log.success('.env file found.');
  }
  
  // Check for required environment variables
  const requiredVars = [
    'NEXT_PUBLIC_APP_URL',
  ];
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`) || envContent.includes(`${varName}=''`) || envContent.includes(`${varName}=""`)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    log.warning(`The following required environment variables are missing or empty: ${missingVars.join(', ')}`);
    log.info('Please update your .env file with the correct values before deploying.');
  } else {
    log.success('All required environment variables are set.');
  }
}

// Run build process
function runBuild() {
  log.step('Building the application...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log.success('Build completed successfully.');
  } catch (error) {
    log.error('Build failed. Please fix the errors and try again.');
    process.exit(1);
  }
}

// Run tests
function runTests() {
  log.step('Running tests...');
  
  try {
    execSync('npm test', { stdio: 'inherit' });
    log.success('Tests passed successfully.');
  } catch (error) {
    log.error('Tests failed. Please fix the failing tests before deploying.');
    process.exit(1);
  }
}

// Check for production optimizations
function checkOptimizations() {
  log.step('Checking for production optimizations...');
  
  // Check next.config.js for production optimizations
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  
  if (fs.existsSync(nextConfigPath)) {
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (!nextConfig.includes('productionBrowserSourceMaps: false')) {
      log.warning('Production browser source maps are not disabled. This may impact performance.');
    }
    
    if (!nextConfig.includes('swcMinify: true')) {
      log.warning('SWC minification is not enabled. This may impact performance.');
    }
  }
  
  log.success('Production optimization check completed.');
}

// Main function
function main() {
  console.log(`${colors.magenta}=== Bookshelf Deployment Helper ===${colors.reset}\n`);
  
  checkEnvFile();
  runTests();
  checkOptimizations();
  runBuild();
  
  console.log(`\n${colors.green}=== Deployment preparation completed ===${colors.reset}`);
  console.log(`\nYou can now deploy the application to Vercel using one of the following methods:`);
  console.log(`\n1. Vercel CLI: Run 'vercel --prod'`);
  console.log(`2. GitHub Integration: Push to your main branch`);
  console.log(`3. Vercel Dashboard: Deploy manually from the Vercel dashboard\n`);
}

// Run the script
main();
