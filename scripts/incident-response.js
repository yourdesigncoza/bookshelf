#!/usr/bin/env node

/**
 * Incident Response Script
 * 
 * This script helps with incident response by:
 * 1. Creating an incident report
 * 2. Collecting diagnostic information
 * 3. Generating communication templates
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
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

// Create incidents directory if it doesn't exist
function createIncidentsDir() {
  const incidentsDir = path.join(process.cwd(), 'incidents');
  
  if (!fs.existsSync(incidentsDir)) {
    log.step('Creating incidents directory...');
    try {
      fs.mkdirSync(incidentsDir);
      log.success('Incidents directory created successfully.');
    } catch (error) {
      log.error(`Failed to create incidents directory: ${error.message}`);
      return false;
    }
  }
  
  return true;
}

// Collect diagnostic information
async function collectDiagnostics() {
  log.step('Collecting diagnostic information...');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    system: {},
    application: {},
    logs: {},
  };
  
  // Collect system information
  try {
    diagnostics.system.platform = process.platform;
    diagnostics.system.nodeVersion = process.version;
    diagnostics.system.memoryUsage = process.memoryUsage();
    
    // Get disk space information
    if (process.platform === 'linux' || process.platform === 'darwin') {
      try {
        const diskSpace = execSync('df -h', { encoding: 'utf8' });
        diagnostics.system.diskSpace = diskSpace;
      } catch (error) {
        log.warning(`Failed to get disk space information: ${error.message}`);
      }
    }
  } catch (error) {
    log.warning(`Failed to collect system information: ${error.message}`);
  }
  
  // Collect application information
  try {
    // Read package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      diagnostics.application.name = packageJson.name;
      diagnostics.application.version = packageJson.version;
      diagnostics.application.dependencies = packageJson.dependencies;
    }
    
    // Check for .env file
    const envPath = path.join(process.cwd(), '.env');
    diagnostics.application.envExists = fs.existsSync(envPath);
    
    // Check for data directory
    const dataDir = path.join(process.cwd(), 'data');
    diagnostics.application.dataDirectoryExists = fs.existsSync(dataDir);
    
    if (diagnostics.application.dataDirectoryExists) {
      try {
        const dataFiles = fs.readdirSync(dataDir);
        diagnostics.application.dataFiles = dataFiles;
      } catch (error) {
        log.warning(`Failed to read data directory: ${error.message}`);
      }
    }
  } catch (error) {
    log.warning(`Failed to collect application information: ${error.message}`);
  }
  
  // Collect log information
  try {
    // Check for logs directory
    const logsDir = path.join(process.cwd(), 'logs');
    diagnostics.logs.logsDirectoryExists = fs.existsSync(logsDir);
    
    if (diagnostics.logs.logsDirectoryExists) {
      try {
        const logFiles = fs.readdirSync(logsDir);
        diagnostics.logs.logFiles = logFiles;
        
        // Get recent errors from log files
        diagnostics.logs.recentErrors = [];
        
        for (const logFile of logFiles) {
          if (logFile.endsWith('.log')) {
            const logPath = path.join(logsDir, logFile);
            try {
              const logContent = fs.readFileSync(logPath, 'utf8');
              const errorLines = logContent.split('\n')
                .filter(line => line.toLowerCase().includes('error') || line.toLowerCase().includes('exception'))
                .slice(-10); // Get last 10 error lines
              
              if (errorLines.length > 0) {
                diagnostics.logs.recentErrors.push({
                  file: logFile,
                  errors: errorLines,
                });
              }
            } catch (error) {
              log.warning(`Failed to read log file ${logFile}: ${error.message}`);
            }
          }
        }
      } catch (error) {
        log.warning(`Failed to read logs directory: ${error.message}`);
      }
    }
    
    // Check for error logs in data directory
    if (diagnostics.application.dataDirectoryExists) {
      const dataDir = path.join(process.cwd(), 'data');
      const errorLogs = diagnostics.application.dataFiles.filter(file => file.includes('error') || file.includes('log'));
      
      if (errorLogs.length > 0) {
        diagnostics.logs.dataErrorLogs = [];
        
        for (const logFile of errorLogs) {
          const logPath = path.join(dataDir, logFile);
          try {
            const logContent = fs.readFileSync(logPath, 'utf8');
            const errorLines = logContent.split('\n')
              .filter(line => line.toLowerCase().includes('error') || line.toLowerCase().includes('exception'))
              .slice(-10); // Get last 10 error lines
            
            if (errorLines.length > 0) {
              diagnostics.logs.dataErrorLogs.push({
                file: logFile,
                errors: errorLines,
              });
            }
          } catch (error) {
            log.warning(`Failed to read error log file ${logFile}: ${error.message}`);
          }
        }
      }
    }
  } catch (error) {
    log.warning(`Failed to collect log information: ${error.message}`);
  }
  
  return diagnostics;
}

// Generate communication templates
function generateCommunicationTemplates(incidentInfo) {
  log.step('Generating communication templates...');
  
  const templates = {
    initialNotification: `Subject: [INCIDENT] [${incidentInfo.severity}] - ${incidentInfo.title}

We are currently investigating an issue affecting ${incidentInfo.affectedFunctionality}.
Impact: ${incidentInfo.userImpact}
Status: Investigation in progress
Next update: ${new Date(Date.now() + 30 * 60000).toLocaleTimeString()}

We apologize for any inconvenience this may cause.`,
    
    statusUpdate: `Subject: [UPDATE] [INCIDENT] [${incidentInfo.severity}] - ${incidentInfo.title}

Status: Investigation in progress
Impact: ${incidentInfo.userImpact}
Actions taken: We are actively investigating the issue and working on a resolution.
Next update: ${new Date(Date.now() + 60 * 60000).toLocaleTimeString()}

We apologize for any inconvenience this may cause.`,
    
    resolution: `Subject: [RESOLVED] [INCIDENT] [${incidentInfo.severity}] - ${incidentInfo.title}

The issue affecting ${incidentInfo.affectedFunctionality} has been resolved.
Root cause: [To be determined after investigation]
Resolution: [To be determined after investigation]
Duration: ${new Date().toLocaleString()} to [End Time]

We apologize for any inconvenience this may have caused.`,
  };
  
  return templates;
}

// Create incident report
async function createIncidentReport() {
  log.step('Creating incident report...');
  
  // Collect incident information
  const incidentInfo = {
    id: `INC-${new Date().toISOString().replace(/[-:]/g, '').replace(/T/, '-').replace(/\..+/, '')}`,
    timestamp: new Date().toISOString(),
    title: await prompt('Incident title: '),
    severity: await prompt('Severity (P1/P2/P3/P4): '),
    affectedFunctionality: await prompt('Affected functionality: '),
    userImpact: await prompt('User impact: '),
    description: await prompt('Detailed description: '),
    status: 'Open',
  };
  
  // Collect diagnostic information
  const diagnostics = await collectDiagnostics();
  
  // Generate communication templates
  const templates = generateCommunicationTemplates(incidentInfo);
  
  // Create incident report
  const incidentReport = {
    incident: incidentInfo,
    diagnostics,
    templates,
    timeline: [
      {
        timestamp: new Date().toISOString(),
        action: 'Incident created',
        details: 'Incident report generated',
      },
    ],
  };
  
  // Save incident report
  const incidentDir = path.join(process.cwd(), 'incidents', incidentInfo.id);
  
  try {
    fs.mkdirSync(incidentDir, { recursive: true });
    
    // Save incident report as JSON
    const reportPath = path.join(incidentDir, 'incident-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(incidentReport, null, 2));
    
    // Save communication templates
    const templatesDir = path.join(incidentDir, 'templates');
    fs.mkdirSync(templatesDir);
    
    fs.writeFileSync(path.join(templatesDir, 'initial-notification.txt'), templates.initialNotification);
    fs.writeFileSync(path.join(templatesDir, 'status-update.txt'), templates.statusUpdate);
    fs.writeFileSync(path.join(templatesDir, 'resolution.txt'), templates.resolution);
    
    log.success(`Incident report created: ${reportPath}`);
    
    return {
      incidentInfo,
      reportPath,
      templatesDir,
    };
  } catch (error) {
    log.error(`Failed to save incident report: ${error.message}`);
    return null;
  }
}

// Update incident timeline
async function updateIncidentTimeline() {
  log.step('Updating incident timeline...');
  
  // Get list of incidents
  const incidentsDir = path.join(process.cwd(), 'incidents');
  
  try {
    const incidents = fs.readdirSync(incidentsDir)
      .filter(dir => dir.startsWith('INC-'))
      .map(dir => ({
        id: dir,
        path: path.join(incidentsDir, dir),
      }));
    
    if (incidents.length === 0) {
      log.warning('No incidents found.');
      return;
    }
    
    // Display list of incidents
    console.log(`\n${colors.cyan}Available Incidents:${colors.reset}`);
    incidents.forEach((incident, index) => {
      console.log(`${index + 1}. ${incident.id}`);
    });
    
    // Select incident
    const selection = await prompt(`\nSelect incident (1-${incidents.length}): `);
    const selectedIndex = parseInt(selection) - 1;
    
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= incidents.length) {
      log.error('Invalid selection.');
      return;
    }
    
    const selectedIncident = incidents[selectedIndex];
    
    // Read incident report
    const reportPath = path.join(selectedIncident.path, 'incident-report.json');
    
    if (!fs.existsSync(reportPath)) {
      log.error(`Incident report not found: ${reportPath}`);
      return;
    }
    
    const incidentReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    // Add timeline entry
    const action = await prompt('Action taken: ');
    const details = await prompt('Details: ');
    
    incidentReport.timeline.push({
      timestamp: new Date().toISOString(),
      action,
      details,
    });
    
    // Save updated incident report
    fs.writeFileSync(reportPath, JSON.stringify(incidentReport, null, 2));
    
    log.success('Incident timeline updated successfully.');
  } catch (error) {
    log.error(`Failed to update incident timeline: ${error.message}`);
  }
}

// Close incident
async function closeIncident() {
  log.step('Closing incident...');
  
  // Get list of incidents
  const incidentsDir = path.join(process.cwd(), 'incidents');
  
  try {
    const incidents = fs.readdirSync(incidentsDir)
      .filter(dir => dir.startsWith('INC-'))
      .map(dir => ({
        id: dir,
        path: path.join(incidentsDir, dir),
      }));
    
    if (incidents.length === 0) {
      log.warning('No incidents found.');
      return;
    }
    
    // Display list of incidents
    console.log(`\n${colors.cyan}Available Incidents:${colors.reset}`);
    incidents.forEach((incident, index) => {
      console.log(`${index + 1}. ${incident.id}`);
    });
    
    // Select incident
    const selection = await prompt(`\nSelect incident to close (1-${incidents.length}): `);
    const selectedIndex = parseInt(selection) - 1;
    
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= incidents.length) {
      log.error('Invalid selection.');
      return;
    }
    
    const selectedIncident = incidents[selectedIndex];
    
    // Read incident report
    const reportPath = path.join(selectedIncident.path, 'incident-report.json');
    
    if (!fs.existsSync(reportPath)) {
      log.error(`Incident report not found: ${reportPath}`);
      return;
    }
    
    const incidentReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    // Update incident status
    incidentReport.incident.status = 'Closed';
    incidentReport.incident.resolutionTime = new Date().toISOString();
    
    // Add resolution details
    incidentReport.incident.rootCause = await prompt('Root cause: ');
    incidentReport.incident.resolution = await prompt('Resolution: ');
    
    // Add timeline entry
    incidentReport.timeline.push({
      timestamp: new Date().toISOString(),
      action: 'Incident closed',
      details: `Root cause: ${incidentReport.incident.rootCause}\nResolution: ${incidentReport.incident.resolution}`,
    });
    
    // Save updated incident report
    fs.writeFileSync(reportPath, JSON.stringify(incidentReport, null, 2));
    
    // Update resolution template
    const resolutionTemplatePath = path.join(selectedIncident.path, 'templates', 'resolution.txt');
    
    if (fs.existsSync(resolutionTemplatePath)) {
      let resolutionTemplate = fs.readFileSync(resolutionTemplatePath, 'utf8');
      
      resolutionTemplate = resolutionTemplate
        .replace('[To be determined after investigation]', incidentReport.incident.rootCause)
        .replace('[End Time]', new Date().toLocaleString());
      
      fs.writeFileSync(resolutionTemplatePath, resolutionTemplate);
    }
    
    log.success('Incident closed successfully.');
  } catch (error) {
    log.error(`Failed to close incident: ${error.message}`);
  }
}

// Display menu
async function displayMenu() {
  console.log(`\n${colors.magenta}=== Incident Response Menu ===${colors.reset}\n`);
  console.log('1. Create new incident');
  console.log('2. Update incident timeline');
  console.log('3. Close incident');
  console.log('4. Exit');
  
  const choice = await prompt('\nEnter your choice (1-4): ');
  
  switch (choice) {
    case '1':
      await createIncidentReport();
      break;
    case '2':
      await updateIncidentTimeline();
      break;
    case '3':
      await closeIncident();
      break;
    case '4':
      rl.close();
      return false;
    default:
      log.error('Invalid choice. Please try again.');
  }
  
  return true;
}

// Main function
async function main() {
  console.log(`${colors.magenta}=== Incident Response Script ===${colors.reset}\n`);
  
  // Create incidents directory if it doesn't exist
  if (!createIncidentsDir()) {
    process.exit(1);
  }
  
  let continueMenu = true;
  
  while (continueMenu) {
    continueMenu = await displayMenu();
  }
  
  console.log(`\n${colors.green}=== Incident Response Script Completed ===${colors.reset}`);
}

// Run the script
main().catch(error => {
  log.error(`Unhandled error: ${error.message}`);
  rl.close();
  process.exit(1);
});
