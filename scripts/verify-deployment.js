#!/usr/bin/env node

/**
 * Deployment verification script for Bookshelf application
 * 
 * This script helps verify a deployed instance of the Bookshelf application
 * by performing basic health checks and functionality tests.
 */

const https = require('https');
const readline = require('readline');

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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for user input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Perform HTTP request
function httpRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Check if URL is accessible
async function checkUrlAccessible(url) {
  try {
    const response = await httpRequest(url);
    return response.statusCode >= 200 && response.statusCode < 400;
  } catch (error) {
    return false;
  }
}

// Check security headers
async function checkSecurityHeaders(url) {
  try {
    const response = await httpRequest(url);
    const headers = response.headers;
    
    const securityHeaders = {
      'x-content-type-options': headers['x-content-type-options'] === 'nosniff',
      'x-frame-options': headers['x-frame-options'] === 'DENY',
      'x-xss-protection': headers['x-xss-protection'] === '1; mode=block',
      'strict-transport-security': !!headers['strict-transport-security'],
      'content-security-policy': !!headers['content-security-policy'],
    };
    
    return securityHeaders;
  } catch (error) {
    return null;
  }
}

// Main verification function
async function verifyDeployment() {
  console.log(`${colors.magenta}=== Bookshelf Deployment Verification ===${colors.reset}\n`);
  
  // Get deployment URL
  const deploymentUrl = await prompt('Enter the deployment URL to verify (e.g., https://bookshelf.vercel.app): ');
  
  if (!deploymentUrl.startsWith('https://')) {
    log.error('URL must start with https://');
    rl.close();
    return;
  }
  
  // Check if URL is accessible
  log.step('Checking if deployment is accessible...');
  const isAccessible = await checkUrlAccessible(deploymentUrl);
  
  if (!isAccessible) {
    log.error(`Deployment at ${deploymentUrl} is not accessible. Please check the URL and try again.`);
    rl.close();
    return;
  }
  
  log.success(`Deployment at ${deploymentUrl} is accessible.`);
  
  // Check security headers
  log.step('Checking security headers...');
  const securityHeaders = await checkSecurityHeaders(deploymentUrl);
  
  if (securityHeaders) {
    for (const [header, isPresent] of Object.entries(securityHeaders)) {
      if (isPresent) {
        log.success(`${header} is properly configured.`);
      } else {
        log.warning(`${header} is missing or not properly configured.`);
      }
    }
  } else {
    log.error('Failed to check security headers.');
  }
  
  // Manual verification checklist
  console.log(`\n${colors.magenta}=== Manual Verification Checklist ===${colors.reset}\n`);
  
  const manualChecks = [
    'Book entry form works correctly',
    'Book listing displays correctly',
    'Search functionality works',
    'Filter functionality works',
    'Statistics display correctly',
    'Edit book functionality works',
    'Delete book functionality works',
    'Dark mode toggle works',
    'Responsive design works on mobile devices',
    'Performance is acceptable (load times, responsiveness)',
  ];
  
  for (const check of manualChecks) {
    const result = await prompt(`Does "${check}" pass? (y/n): `);
    
    if (result.toLowerCase() === 'y' || result.toLowerCase() === 'yes') {
      log.success(`${check}: Passed`);
    } else {
      log.error(`${check}: Failed`);
    }
  }
  
  // Final assessment
  console.log(`\n${colors.magenta}=== Deployment Verification Summary ===${colors.reset}\n`);
  
  const finalAssessment = await prompt('Based on the checks above, is the deployment ready for production? (y/n): ');
  
  if (finalAssessment.toLowerCase() === 'y' || finalAssessment.toLowerCase() === 'yes') {
    log.success('Deployment verification passed. The application is ready for production use.');
  } else {
    log.warning('Deployment verification failed. Please address the issues before proceeding to production.');
  }
  
  rl.close();
}

// Run the verification
verifyDeployment();
