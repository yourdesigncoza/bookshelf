'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Laptop, Smartphone, Tablet, Monitor, X } from 'lucide-react';

// Define common device sizes
const DEVICE_SIZES = {
  mobile: {
    width: 375,
    height: 667,
    icon: Smartphone,
    label: 'Mobile'
  },
  mobileL: {
    width: 425,
    height: 812,
    icon: Smartphone,
    label: 'Mobile L'
  },
  tablet: {
    width: 768,
    height: 1024,
    icon: Tablet,
    label: 'Tablet'
  },
  laptop: {
    width: 1024,
    height: 768,
    icon: Laptop,
    label: 'Laptop'
  },
  desktop: {
    width: 1440,
    height: 900,
    icon: Monitor,
    label: 'Desktop'
  }
};

interface ResponsiveTesterProps {
  defaultUrl?: string;
}

export function ResponsiveTester({ defaultUrl = '/books' }: ResponsiveTesterProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [isOpen, setIsOpen] = useState(false);
  const [activeDevice, setActiveDevice] = useState<keyof typeof DEVICE_SIZES>('mobile');
  const [customWidth, setCustomWidth] = useState(375);
  const [customHeight, setCustomHeight] = useState(667);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleDeviceChange = (device: keyof typeof DEVICE_SIZES) => {
    setActiveDevice(device);
    setCustomWidth(DEVICE_SIZES[device].width);
    setCustomHeight(DEVICE_SIZES[device].height);
  };

  const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomWidth(parseInt(e.target.value) || 375);
  };

  const handleCustomHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomHeight(parseInt(e.target.value) || 667);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 p-0 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Smartphone className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Responsive Tester</CardTitle>
                <CardDescription>Test your application on different screen sizes</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="url" className="text-sm font-medium mb-2 block">URL to test</label>
                  <input
                    id="url"
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    className="w-full px-3 py-2 border rounded-md h-10"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={() => window.open(url, '_blank')}>
                    Open in New Tab
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="devices" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="devices">Preset Devices</TabsTrigger>
                  <TabsTrigger value="custom">Custom Size</TabsTrigger>
                </TabsList>
                <TabsContent value="devices" className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                    {Object.entries(DEVICE_SIZES).map(([key, device]) => {
                      const DeviceIcon = device.icon;
                      return (
                        <Button
                          key={key}
                          variant={activeDevice === key ? 'default' : 'outline'}
                          className="flex flex-col h-auto py-3 gap-2"
                          onClick={() => handleDeviceChange(key as keyof typeof DEVICE_SIZES)}
                        >
                          <DeviceIcon className="h-5 w-5" />
                          <span className="text-xs">{device.label}</span>
                          <span className="text-xs text-muted-foreground">{device.width}x{device.height}</span>
                        </Button>
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="custom" className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label htmlFor="width" className="text-sm font-medium mb-2 block">Width (px)</label>
                      <input
                        id="width"
                        type="number"
                        value={customWidth}
                        onChange={handleCustomWidthChange}
                        className="w-full px-3 py-2 border rounded-md h-10"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="height" className="text-sm font-medium mb-2 block">Height (px)</label>
                      <input
                        id="height"
                        type="number"
                        value={customHeight}
                        onChange={handleCustomHeightChange}
                        className="w-full px-3 py-2 border rounded-md h-10"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator />

              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground mb-2">
                  Preview: {customWidth}x{customHeight}px
                </div>
                <div 
                  className="border rounded-md overflow-hidden bg-muted/30 flex items-center justify-center"
                  style={{ 
                    width: '100%',
                    maxWidth: '100%',
                    height: '500px',
                    maxHeight: '500px',
                    position: 'relative'
                  }}
                >
                  <div 
                    className="border-2 border-primary rounded-md overflow-hidden bg-white"
                    style={{ 
                      width: `${Math.min(customWidth, 1200)}px`,
                      height: `${Math.min(customHeight, 480)}px`,
                      transform: customWidth > 1200 || customHeight > 480 ? 'scale(0.8)' : 'none',
                      transformOrigin: 'center',
                      position: 'relative'
                    }}
                  >
                    <iframe 
                      src={url} 
                      style={{ 
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      title="Responsive Preview"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
