#!/usr/bin/env node

/**
 * Script to analyze the application's performance using Lighthouse
 * 
 * This script runs Lighthouse against the application and generates a detailed report
 * that can be viewed in the browser.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const open = require('open');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// URLs to analyze
const urls = [
  'http://localhost:3000',
  'http://localhost:3000/books',
  'http://localhost:3000/statistics',
  'http://localhost:3000/settings',
];

// Create reports directory if it doesn't exist
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Function to run Lighthouse
async function runLighthouse(url) {
  console.log(`${colors.bright}${colors.cyan}Running Lighthouse for ${url}...${colors.reset}`);
  
  // Launch Chrome
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  // Run Lighthouse
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse(url, options);
  
  // Close Chrome
  await chrome.kill();
  
  // Save report
  const reportName = url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const reportPath = path.join(reportsDir, `lighthouse-${reportName}.html`);
  fs.writeFileSync(reportPath, runnerResult.report);
  
  // Log results
  console.log(`${colors.bright}${colors.green}Report saved to ${reportPath}${colors.reset}`);
  console.log(`${colors.bright}Performance score: ${formatScore(runnerResult.lhr.categories.performance.score)}${colors.reset}`);
  console.log(`${colors.bright}Accessibility score: ${formatScore(runnerResult.lhr.categories.accessibility.score)}${colors.reset}`);
  console.log(`${colors.bright}Best Practices score: ${formatScore(runnerResult.lhr.categories['best-practices'].score)}${colors.reset}`);
  console.log(`${colors.bright}SEO score: ${formatScore(runnerResult.lhr.categories.seo.score)}${colors.reset}`);
  console.log('\n');
  
  return {
    url,
    reportPath,
    scores: {
      performance: runnerResult.lhr.categories.performance.score,
      accessibility: runnerResult.lhr.categories.accessibility.score,
      bestPractices: runnerResult.lhr.categories['best-practices'].score,
      seo: runnerResult.lhr.categories.seo.score,
    },
  };
}

// Format score as percentage
function formatScore(score) {
  const percentage = Math.round(score * 100);
  let color = colors.green;
  if (percentage < 90) color = colors.yellow;
  if (percentage < 50) color = colors.red;
  return `${color}${percentage}%${colors.reset}`;
}

// Generate summary report
function generateSummaryReport(results) {
  const summaryPath = path.join(reportsDir, 'lighthouse-summary.html');
  
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lighthouse Performance Summary</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #2c3e50;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .score {
          font-weight: bold;
        }
        .good {
          color: #28a745;
        }
        .average {
          color: #ffc107;
        }
        .poor {
          color: #dc3545;
        }
        .report-link {
          color: #007bff;
          text-decoration: none;
        }
        .report-link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h1>Lighthouse Performance Summary</h1>
      <p>Generated on ${new Date().toLocaleString()}</p>
      
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Performance</th>
            <th>Accessibility</th>
            <th>Best Practices</th>
            <th>SEO</th>
            <th>Report</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  results.forEach(result => {
    const getScoreClass = (score) => {
      const percentage = Math.round(score * 100);
      if (percentage >= 90) return 'good';
      if (percentage >= 50) return 'average';
      return 'poor';
    };
    
    html += `
      <tr>
        <td>${result.url}</td>
        <td class="score ${getScoreClass(result.scores.performance)}">${Math.round(result.scores.performance * 100)}%</td>
        <td class="score ${getScoreClass(result.scores.accessibility)}">${Math.round(result.scores.accessibility * 100)}%</td>
        <td class="score ${getScoreClass(result.scores.bestPractices)}">${Math.round(result.scores.bestPractices * 100)}%</td>
        <td class="score ${getScoreClass(result.scores.seo)}">${Math.round(result.scores.seo * 100)}%</td>
        <td><a href="${path.relative(reportsDir, result.reportPath)}" class="report-link">View Report</a></td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
      
      <h2>Performance Recommendations</h2>
      <ul>
        <li>Implement code splitting to reduce initial bundle size</li>
        <li>Use lazy loading for non-critical components</li>
        <li>Optimize images with next/image</li>
        <li>Implement server-side rendering for critical pages</li>
        <li>Minimize and compress static assets</li>
        <li>Use pagination or virtualization for large data sets</li>
      </ul>
    </body>
    </html>
  `;
  
  fs.writeFileSync(summaryPath, html);
  console.log(`${colors.bright}${colors.green}Summary report saved to ${summaryPath}${colors.reset}`);
  
  return summaryPath;
}

// Main function
async function main() {
  try {
    console.log(`${colors.bright}${colors.cyan}Starting performance analysis...${colors.reset}\n`);
    
    // Check if the development server is running
    try {
      await fetch('http://localhost:3000');
    } catch (error) {
      console.log(`${colors.bright}${colors.yellow}Development server not running. Starting it now...${colors.reset}`);
      
      // Start the development server in the background
      const serverProcess = require('child_process').spawn('npm', ['run', 'dev'], {
        detached: true,
        stdio: 'ignore',
      });
      
      // Wait for the server to start
      console.log(`${colors.bright}${colors.yellow}Waiting for the server to start...${colors.reset}`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    // Run Lighthouse for each URL
    const results = [];
    for (const url of urls) {
      const result = await runLighthouse(url);
      results.push(result);
    }
    
    // Generate summary report
    const summaryPath = generateSummaryReport(results);
    
    // Open the summary report in the default browser
    console.log(`${colors.bright}${colors.cyan}Opening summary report in browser...${colors.reset}`);
    await open(summaryPath);
    
    console.log(`${colors.bright}${colors.green}Performance analysis complete!${colors.reset}`);
  } catch (error) {
    console.error(`${colors.bright}${colors.red}Error during performance analysis:${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main();
