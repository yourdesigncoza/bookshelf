#!/usr/bin/env node

/**
 * Script to generate and display test coverage report
 * 
 * This script runs Jest with coverage enabled and generates a detailed report
 * that can be viewed in the browser.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const open = require('open');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.cyan}Generating test coverage report...${colors.reset}\n`);

try {
  // Run Jest with coverage
  execSync('npm test -- --coverage', { stdio: 'inherit' });
  
  // Path to the HTML coverage report
  const coverageReportPath = path.join(process.cwd(), 'coverage', 'lcov-report', 'index.html');
  
  // Check if the report was generated
  if (fs.existsSync(coverageReportPath)) {
    console.log(`\n${colors.bright}${colors.green}Coverage report generated successfully!${colors.reset}`);
    console.log(`\n${colors.bright}Opening coverage report in browser...${colors.reset}`);
    
    // Open the report in the default browser
    open(coverageReportPath);
    
    console.log(`\n${colors.cyan}Coverage report is available at:${colors.reset}`);
    console.log(coverageReportPath);
  } else {
    console.error(`\n${colors.bright}${colors.red}Error: Coverage report not found at ${coverageReportPath}${colors.reset}`);
    process.exit(1);
  }
} catch (error) {
  console.error(`\n${colors.bright}${colors.red}Error generating coverage report:${colors.reset}`);
  console.error(error.message);
  process.exit(1);
}
