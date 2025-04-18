#!/usr/bin/env node

/**
 * Log Review Script
 * 
 * This script helps with reviewing application logs by:
 * 1. Checking for error logs in the data directory
 * 2. Analyzing error patterns
 * 3. Generating a summary report
 */

const fs = require('fs');
const path = require('path');
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

// Create reports directory if it doesn't exist
function createReportsDir() {
  const reportsDir = path.join(process.cwd(), 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    log.step('Creating reports directory...');
    try {
      fs.mkdirSync(reportsDir);
      log.success('Reports directory created successfully.');
    } catch (error) {
      log.error(`Failed to create reports directory: ${error.message}`);
      return false;
    }
  }
  
  return true;
}

// Check for log files in the data directory
function findLogFiles() {
  log.step('Searching for log files...');
  
  const dataDir = path.join(process.cwd(), 'data');
  const logsDir = path.join(process.cwd(), 'logs');
  
  let logFiles = [];
  
  // Check data directory
  if (fs.existsSync(dataDir)) {
    try {
      const files = fs.readdirSync(dataDir);
      const dataLogs = files.filter(file => file.includes('log') || file.includes('error'));
      logFiles = [...logFiles, ...dataLogs.map(file => path.join(dataDir, file))];
    } catch (error) {
      log.warning(`Failed to read data directory: ${error.message}`);
    }
  } else {
    log.warning('Data directory not found.');
  }
  
  // Check logs directory
  if (fs.existsSync(logsDir)) {
    try {
      const files = fs.readdirSync(logsDir);
      const logs = files.filter(file => file.endsWith('.log'));
      logFiles = [...logFiles, ...logs.map(file => path.join(logsDir, file))];
    } catch (error) {
      log.warning(`Failed to read logs directory: ${error.message}`);
    }
  } else {
    log.warning('Logs directory not found.');
  }
  
  if (logFiles.length === 0) {
    log.warning('No log files found.');
  } else {
    log.info(`Found ${logFiles.length} log file(s).`);
  }
  
  return logFiles;
}

// Parse log files and extract errors
async function parseLogFiles(logFiles) {
  log.step('Parsing log files...');
  
  const errors = [];
  
  for (const file of logFiles) {
    log.info(`Parsing ${path.basename(file)}...`);
    
    try {
      const fileStream = fs.createReadStream(file);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });
      
      let lineNumber = 0;
      
      for await (const line of rl) {
        lineNumber++;
        
        // Check if line contains error information
        if (line.toLowerCase().includes('error') || 
            line.toLowerCase().includes('exception') || 
            line.toLowerCase().includes('fail') ||
            line.toLowerCase().includes('critical')) {
          errors.push({
            file: path.basename(file),
            line: lineNumber,
            content: line,
            timestamp: extractTimestamp(line),
          });
        }
      }
    } catch (error) {
      log.warning(`Failed to parse ${path.basename(file)}: ${error.message}`);
    }
  }
  
  log.info(`Found ${errors.length} error(s) in log files.`);
  
  return errors;
}

// Extract timestamp from log line
function extractTimestamp(line) {
  // Common timestamp formats
  const timestampPatterns = [
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/, // ISO format
    /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d{3})?/, // SQL-like format
    /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/, // MM/DD/YYYY format
    /\w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2}/, // Month Day Year format
  ];
  
  for (const pattern of timestampPatterns) {
    const match = line.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return null;
}

// Analyze errors and identify patterns
function analyzeErrors(errors) {
  log.step('Analyzing error patterns...');
  
  if (errors.length === 0) {
    log.warning('No errors to analyze.');
    return {
      totalErrors: 0,
      errorsByFile: {},
      errorsByType: {},
      recentErrors: [],
    };
  }
  
  // Group errors by file
  const errorsByFile = {};
  for (const error of errors) {
    if (!errorsByFile[error.file]) {
      errorsByFile[error.file] = [];
    }
    errorsByFile[error.file].push(error);
  }
  
  // Group errors by type (simple pattern matching)
  const errorsByType = {};
  for (const error of errors) {
    const content = error.content.toLowerCase();
    let type = 'Unknown';
    
    if (content.includes('syntax error')) {
      type = 'Syntax Error';
    } else if (content.includes('reference error')) {
      type = 'Reference Error';
    } else if (content.includes('type error')) {
      type = 'Type Error';
    } else if (content.includes('range error')) {
      type = 'Range Error';
    } else if (content.includes('uri error')) {
      type = 'URI Error';
    } else if (content.includes('eval error')) {
      type = 'Eval Error';
    } else if (content.includes('internal error')) {
      type = 'Internal Error';
    } else if (content.includes('database error') || content.includes('db error')) {
      type = 'Database Error';
    } else if (content.includes('network error') || content.includes('connection error')) {
      type = 'Network Error';
    } else if (content.includes('permission') || content.includes('access denied')) {
      type = 'Permission Error';
    } else if (content.includes('timeout')) {
      type = 'Timeout Error';
    } else if (content.includes('validation')) {
      type = 'Validation Error';
    } else if (content.includes('not found')) {
      type = 'Not Found Error';
    }
    
    if (!errorsByType[type]) {
      errorsByType[type] = [];
    }
    errorsByType[type].push(error);
  }
  
  // Sort errors by timestamp (if available) to get recent errors
  const sortedErrors = [...errors].sort((a, b) => {
    if (!a.timestamp && !b.timestamp) return 0;
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  const recentErrors = sortedErrors.slice(0, 10);
  
  return {
    totalErrors: errors.length,
    errorsByFile,
    errorsByType,
    recentErrors,
  };
}

// Generate a report from the analysis
function generateReport(analysis) {
  log.step('Generating error report...');
  
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const reportPath = path.join(process.cwd(), 'reports', `error-report-${timestamp}.json`);
  
  try {
    fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
    log.success(`Error report generated: ${reportPath}`);
    
    // Generate a human-readable summary
    const summaryPath = path.join(process.cwd(), 'reports', `error-summary-${timestamp}.txt`);
    
    let summary = `Error Analysis Summary (${timestamp})\n`;
    summary += '='.repeat(50) + '\n\n';
    
    summary += `Total Errors: ${analysis.totalErrors}\n\n`;
    
    summary += 'Errors by File:\n';
    summary += '-'.repeat(20) + '\n';
    for (const [file, errors] of Object.entries(analysis.errorsByFile)) {
      summary += `${file}: ${errors.length} error(s)\n`;
    }
    summary += '\n';
    
    summary += 'Errors by Type:\n';
    summary += '-'.repeat(20) + '\n';
    for (const [type, errors] of Object.entries(analysis.errorsByType)) {
      summary += `${type}: ${errors.length} error(s)\n`;
    }
    summary += '\n';
    
    summary += 'Recent Errors:\n';
    summary += '-'.repeat(20) + '\n';
    for (const error of analysis.recentErrors) {
      summary += `File: ${error.file}, Line: ${error.line}\n`;
      summary += `Timestamp: ${error.timestamp || 'Unknown'}\n`;
      summary += `Content: ${error.content}\n`;
      summary += '-'.repeat(50) + '\n';
    }
    
    fs.writeFileSync(summaryPath, summary);
    log.success(`Error summary generated: ${summaryPath}`);
    
    return {
      reportPath,
      summaryPath,
    };
  } catch (error) {
    log.error(`Failed to generate report: ${error.message}`);
    return null;
  }
}

// Display report summary
function displaySummary(analysis) {
  console.log(`\n${colors.magenta}=== Error Analysis Summary ===${colors.reset}\n`);
  
  console.log(`Total Errors: ${colors.yellow}${analysis.totalErrors}${colors.reset}\n`);
  
  console.log(`${colors.cyan}Errors by File:${colors.reset}`);
  for (const [file, errors] of Object.entries(analysis.errorsByFile)) {
    console.log(`  ${file}: ${colors.yellow}${errors.length}${colors.reset} error(s)`);
  }
  console.log();
  
  console.log(`${colors.cyan}Errors by Type:${colors.reset}`);
  for (const [type, errors] of Object.entries(analysis.errorsByType)) {
    console.log(`  ${type}: ${colors.yellow}${errors.length}${colors.reset} error(s)`);
  }
  console.log();
  
  if (analysis.recentErrors.length > 0) {
    console.log(`${colors.cyan}Most Recent Error:${colors.reset}`);
    const error = analysis.recentErrors[0];
    console.log(`  File: ${error.file}, Line: ${error.line}`);
    console.log(`  Timestamp: ${error.timestamp || 'Unknown'}`);
    console.log(`  Content: ${error.content}`);
  }
}

// Main function
async function main() {
  console.log(`${colors.magenta}=== Log Review Script ===${colors.reset}\n`);
  
  // Create reports directory if it doesn't exist
  if (!createReportsDir()) {
    process.exit(1);
  }
  
  // Find log files
  const logFiles = findLogFiles();
  
  if (logFiles.length === 0) {
    log.warning('No log files to analyze. Exiting.');
    process.exit(0);
  }
  
  // Parse log files
  const errors = await parseLogFiles(logFiles);
  
  // Analyze errors
  const analysis = analyzeErrors(errors);
  
  // Generate report
  const report = generateReport(analysis);
  
  // Display summary
  displaySummary(analysis);
  
  if (report) {
    console.log(`\n${colors.green}=== Log Review Completed Successfully ===${colors.reset}`);
    console.log(`\nDetailed report saved to: ${report.reportPath}`);
    console.log(`Summary report saved to: ${report.summaryPath}`);
  } else {
    console.log(`\n${colors.red}=== Log Review Completed with Errors ===${colors.reset}`);
  }
}

// Run the script
main().catch(error => {
  log.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
