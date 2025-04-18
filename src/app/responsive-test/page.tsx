import { ResponsiveTester } from '@/components/responsive-tester';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const metadata = {
  title: 'Responsive Testing | Bookshelf',
  description: 'Test the responsive design of the Bookshelf application',
};

export default function ResponsiveTestPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Responsive Design Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>What to Test</CardTitle>
            <CardDescription>Key areas to verify for responsive behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Layout & Components</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Navigation bar collapses to hamburger menu on small screens</li>
                <li>Grid layouts adjust columns based on screen size</li>
                <li>Cards and containers maintain proper spacing</li>
                <li>Tables convert to card view on mobile</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Typography</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Text remains readable on all screen sizes</li>
                <li>Headings scale appropriately</li>
                <li>Line lengths stay comfortable for reading</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Touch Optimization</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Buttons and interactive elements have adequate touch targets</li>
                <li>Form inputs are easy to use on touch devices</li>
                <li>Proper spacing between clickable elements</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Pages to Test</CardTitle>
            <CardDescription>Test these pages at different screen sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/">Home Page</Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/books">Books List</Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/books/add">Add Book Form</Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/books/statistics">Statistics Dashboard</Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/books/search">Search Page</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Interactive Tester</h2>
        <p className="text-muted-foreground mb-4">
          Use the responsive tester below to preview any page in the application at different screen sizes.
          You can also access this tester from any page by clicking the device icon in the bottom right corner.
        </p>
      </div>
      
      <ResponsiveTester defaultUrl="/" />
    </div>
  );
}
