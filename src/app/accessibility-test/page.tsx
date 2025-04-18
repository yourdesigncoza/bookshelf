'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toggleAccessibilityTester } from '@/lib/accessibility-test';

export default function AccessibilityTestPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Accessibility Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Run Accessibility Tests</CardTitle>
            <CardDescription>
              Test the current page for accessibility issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Click the button below to run accessibility tests on the current page.
              This will check for common accessibility issues like missing alt text,
              improper heading structure, and more.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={toggleAccessibilityTester}>
              Run Accessibility Tests
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Keyboard Navigation</CardTitle>
            <CardDescription>
              Test keyboard navigation throughout the app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Use the Tab key to navigate through the page elements.
              Ensure that all interactive elements are focusable and
              that the focus order is logical.
            </p>
            <div className="space-y-2">
              <p><kbd className="px-2 py-1 bg-muted rounded">Tab</kbd> - Move forward</p>
              <p><kbd className="px-2 py-1 bg-muted rounded">Shift+Tab</kbd> - Move backward</p>
              <p><kbd className="px-2 py-1 bg-muted rounded">Enter/Space</kbd> - Activate element</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Screen Reader Testing</CardTitle>
            <CardDescription>
              Test with screen readers for proper announcements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Use a screen reader to navigate through the application.
              Ensure that all content is properly announced and that
              interactive elements have appropriate labels.
            </p>
            <div className="space-y-2">
              <p>Recommended screen readers:</p>
              <ul className="list-disc list-inside">
                <li>NVDA (Windows)</li>
                <li>VoiceOver (macOS)</li>
                <li>JAWS (Windows)</li>
                <li>TalkBack (Android)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-0">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
          <TabsTrigger value="screen-reader">Screen Reader</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="p-4 border rounded-md mt-4">
          <h2 className="text-xl font-semibold mb-4">Accessibility Overview</h2>
          <p className="mb-4">
            This application has been designed with accessibility in mind, following the
            Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. The following
            improvements have been made:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Semantic HTML structure with proper heading hierarchy</li>
            <li>Keyboard navigation support throughout the application</li>
            <li>ARIA roles, states, and properties for complex components</li>
            <li>Alternative text for images and icons</li>
            <li>Sufficient color contrast for text and UI elements</li>
            <li>Focus management for modals and dialogs</li>
            <li>Skip link for keyboard users to bypass navigation</li>
          </ul>
        </TabsContent>
        
        <TabsContent value="keyboard" className="p-4 border rounded-md mt-4">
          <h2 className="text-xl font-semibold mb-4">Keyboard Accessibility</h2>
          <p className="mb-4">
            All interactive elements in the application are accessible via keyboard:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Navigation menus can be accessed with Tab key</li>
            <li>Form controls are properly labeled and can be focused</li>
            <li>Modal dialogs trap focus when open</li>
            <li>Skip link allows keyboard users to bypass navigation</li>
            <li>Custom components like dropdowns and tabs are keyboard accessible</li>
          </ul>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Test Keyboard Navigation</h3>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button>Button 1</Button>
              <Button variant="outline">Button 2</Button>
              <Button variant="secondary">Button 3</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="screen-reader" className="p-4 border rounded-md mt-4">
          <h2 className="text-xl font-semibold mb-4">Screen Reader Accessibility</h2>
          <p className="mb-4">
            The application is designed to work well with screen readers:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Proper heading structure for easy navigation</li>
            <li>ARIA landmarks to identify different sections of the page</li>
            <li>Alternative text for images and icons</li>
            <li>ARIA labels for elements that need additional context</li>
            <li>Live regions for dynamic content updates</li>
          </ul>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Screen Reader Test Elements</h3>
            <div className="space-y-4 mt-4">
              <div className="flex items-center">
                <img 
                  src="https://via.placeholder.com/50" 
                  alt="Example image with alt text" 
                  className="mr-4"
                />
                <p>This image has proper alt text</p>
              </div>
              <div aria-live="polite" className="p-4 border rounded">
                <p>This is a live region that will be announced by screen readers when it changes.</p>
                <Button 
                  onClick={() => {
                    const region = document.querySelector('[aria-live="polite"]');
                    if (region) {
                      region.innerHTML = '<p>The content has been updated! This change should be announced by screen readers.</p>';
                    }
                  }}
                  className="mt-2"
                >
                  Update Content
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="visual" className="p-4 border rounded-md mt-4">
          <h2 className="text-xl font-semibold mb-4">Visual Accessibility</h2>
          <p className="mb-4">
            The application is designed with visual accessibility in mind:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Sufficient color contrast for text and UI elements</li>
            <li>Visual focus indicators for keyboard navigation</li>
            <li>Responsive design that works at different zoom levels</li>
            <li>Text can be resized up to 200% without loss of content or functionality</li>
            <li>Dark mode support for users who prefer reduced brightness</li>
          </ul>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Visual Accessibility Examples</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-primary text-primary-foreground rounded">
                <p>This text has sufficient contrast with its background.</p>
              </div>
              <div className="p-4 bg-muted rounded">
                <p>This text also has sufficient contrast with its background.</p>
              </div>
              <div className="p-4 border rounded focus-within:ring-2 focus-within:ring-primary">
                <p>This container has a visible focus indicator when focused.</p>
                <input 
                  type="text" 
                  className="mt-2 w-full p-2 border rounded" 
                  placeholder="Focus me to see the container highlight"
                />
              </div>
              <div className="p-4 border rounded">
                <p>Text size can be adjusted without breaking the layout:</p>
                <div className="flex gap-2 mt-2">
                  <Button 
                    onClick={() => {
                      document.body.style.fontSize = '100%';
                    }}
                    size="sm"
                  >
                    100%
                  </Button>
                  <Button 
                    onClick={() => {
                      document.body.style.fontSize = '125%';
                    }}
                    size="sm"
                  >
                    125%
                  </Button>
                  <Button 
                    onClick={() => {
                      document.body.style.fontSize = '150%';
                    }}
                    size="sm"
                  >
                    150%
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Accessibility Resources</CardTitle>
          <CardDescription>
            Useful resources for learning more about web accessibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Web Content Accessibility Guidelines (WCAG)</a></li>
            <li><a href="https://www.a11yproject.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">The A11Y Project</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">MDN Web Accessibility Guide</a></li>
            <li><a href="https://webaim.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">WebAIM</a></li>
            <li><a href="https://www.deque.com/axe/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">axe Accessibility Testing Tool</a></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
