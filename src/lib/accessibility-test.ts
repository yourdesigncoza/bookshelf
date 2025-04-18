/**
 * Accessibility testing utility
 * 
 * This utility provides functions to test and validate accessibility features
 * in the application. It can be used in development to check for common
 * accessibility issues.
 */

// Types of accessibility issues
export enum AccessibilityIssueType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

// Interface for accessibility issues
export interface AccessibilityIssue {
  type: AccessibilityIssueType;
  message: string;
  element?: Element;
  code: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
}

// Interface for accessibility test results
export interface AccessibilityTestResult {
  issues: AccessibilityIssue[];
  passed: boolean;
  timestamp: Date;
}

/**
 * Check for missing alt text on images
 */
export function checkImagesForAltText(): AccessibilityIssue[] {
  if (typeof document === 'undefined') return [];
  
  const issues: AccessibilityIssue[] = [];
  const images = document.querySelectorAll('img');
  
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: AccessibilityIssueType.ERROR,
        message: 'Image is missing alt text',
        element: img,
        code: 'img-alt',
        impact: 'serious',
      });
    } else if (img.alt === '') {
      // Empty alt is only valid for decorative images
      if (!img.hasAttribute('role') || img.getAttribute('role') !== 'presentation') {
        issues.push({
          type: AccessibilityIssueType.WARNING,
          message: 'Image has empty alt text but is not marked as decorative',
          element: img,
          code: 'img-alt-decorative',
          impact: 'moderate',
        });
      }
    }
  });
  
  return issues;
}

/**
 * Check for proper heading structure
 */
export function checkHeadingStructure(): AccessibilityIssue[] {
  if (typeof document === 'undefined') return [];
  
  const issues: AccessibilityIssue[] = [];
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1));
    
    // Check for skipped heading levels
    if (level > previousLevel + 1 && previousLevel !== 0) {
      issues.push({
        type: AccessibilityIssueType.WARNING,
        message: `Heading level ${level} follows level ${previousLevel}, skipping one or more levels`,
        element: heading,
        code: 'heading-order',
        impact: 'moderate',
      });
    }
    
    previousLevel = level;
  });
  
  // Check if there's an h1 on the page
  if (!document.querySelector('h1')) {
    issues.push({
      type: AccessibilityIssueType.ERROR,
      message: 'Page is missing an h1 heading',
      code: 'page-has-h1',
      impact: 'serious',
    });
  }
  
  return issues;
}

/**
 * Check for proper form labels
 */
export function checkFormLabels(): AccessibilityIssue[] {
  if (typeof document === 'undefined') return [];
  
  const issues: AccessibilityIssue[] = [];
  const formControls = document.querySelectorAll('input, select, textarea');
  
  formControls.forEach((control) => {
    // Skip hidden inputs and those with aria-hidden="true"
    if (
      control.getAttribute('type') === 'hidden' ||
      control.getAttribute('aria-hidden') === 'true'
    ) {
      return;
    }
    
    const id = control.getAttribute('id');
    if (!id) {
      issues.push({
        type: AccessibilityIssueType.ERROR,
        message: 'Form control is missing an ID',
        element: control,
        code: 'form-control-id',
        impact: 'serious',
      });
      return;
    }
    
    // Check if there's a label with a matching 'for' attribute
    const label = document.querySelector(`label[for="${id}"]`);
    if (!label) {
      // Check if the control has aria-label or aria-labelledby
      if (
        !control.hasAttribute('aria-label') &&
        !control.hasAttribute('aria-labelledby')
      ) {
        issues.push({
          type: AccessibilityIssueType.ERROR,
          message: `Form control with ID "${id}" is not associated with a label`,
          element: control,
          code: 'form-control-label',
          impact: 'serious',
        });
      }
    }
  });
  
  return issues;
}

/**
 * Check for proper ARIA roles
 */
export function checkAriaRoles(): AccessibilityIssue[] {
  if (typeof document === 'undefined') return [];
  
  const issues: AccessibilityIssue[] = [];
  const elementsWithRoles = document.querySelectorAll('[role]');
  
  // List of valid ARIA roles
  const validRoles = [
    'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
    'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
    'contentinfo', 'definition', 'dialog', 'directory', 'document',
    'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
    'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
    'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
    'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
    'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
    'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
    'slider', 'spinbutton', 'status', 'switch', 'tab', 'table',
    'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
    'tooltip', 'tree', 'treegrid', 'treeitem'
  ];
  
  elementsWithRoles.forEach((element) => {
    const role = element.getAttribute('role');
    if (role && !validRoles.includes(role)) {
      issues.push({
        type: AccessibilityIssueType.ERROR,
        message: `Invalid ARIA role: "${role}"`,
        element: element,
        code: 'aria-role-valid',
        impact: 'serious',
      });
    }
  });
  
  return issues;
}

/**
 * Check for color contrast issues (simplified version)
 * Note: A complete implementation would require parsing CSS and computing contrast ratios
 */
export function checkColorContrast(): AccessibilityIssue[] {
  // This is a simplified placeholder that would need to be expanded
  // with a proper color contrast calculation library
  return [];
}

/**
 * Run all accessibility tests
 */
export function runAllAccessibilityTests(): AccessibilityTestResult {
  const allIssues = [
    ...checkImagesForAltText(),
    ...checkHeadingStructure(),
    ...checkFormLabels(),
    ...checkAriaRoles(),
    ...checkColorContrast(),
  ];
  
  return {
    issues: allIssues,
    passed: allIssues.length === 0,
    timestamp: new Date(),
  };
}

/**
 * Format accessibility test results as HTML
 */
export function formatAccessibilityResults(results: AccessibilityTestResult): string {
  const { issues, passed, timestamp } = results;
  
  let html = `
    <div class="a11y-test-results">
      <h2>Accessibility Test Results</h2>
      <p>Test run at: ${timestamp.toLocaleString()}</p>
      <p>Status: ${passed ? '✅ Passed' : '❌ Failed'}</p>
  `;
  
  if (issues.length > 0) {
    html += `<h3>Issues Found (${issues.length})</h3><ul>`;
    
    issues.forEach((issue) => {
      const elementInfo = issue.element 
        ? `<code>${issue.element.outerHTML.substring(0, 100)}${issue.element.outerHTML.length > 100 ? '...' : ''}</code>` 
        : '';
      
      html += `
        <li class="a11y-issue a11y-issue-${issue.type}">
          <strong>${issue.type.toUpperCase()}</strong>: ${issue.message} 
          <span class="a11y-issue-code">[${issue.code}]</span>
          <span class="a11y-issue-impact">${issue.impact}</span>
          ${elementInfo}
        </li>
      `;
    });
    
    html += '</ul>';
  } else {
    html += '<p>No accessibility issues found!</p>';
  }
  
  html += '</div>';
  return html;
}

/**
 * Display accessibility test results in the DOM
 */
export function displayAccessibilityResults(containerId: string = 'a11y-results'): void {
  if (typeof document === 'undefined') return;
  
  const results = runAllAccessibilityTests();
  const html = formatAccessibilityResults(results);
  
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.maxWidth = '400px';
    container.style.maxHeight = '80vh';
    container.style.overflow = 'auto';
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '4px';
    container.style.padding = '16px';
    container.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  
  container.innerHTML = html;
}

// Export a function to toggle the accessibility tester
export function toggleAccessibilityTester(): void {
  if (typeof document === 'undefined') return;
  
  const containerId = 'a11y-results';
  const container = document.getElementById(containerId);
  
  if (container) {
    container.remove();
  } else {
    displayAccessibilityResults(containerId);
  }
}
