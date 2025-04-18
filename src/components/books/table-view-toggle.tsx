'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface TableViewToggleProps {
  onToggle: (useVirtualized: boolean) => void;
  initialValue?: boolean;
}

export function TableViewToggle({ onToggle, initialValue = false }: TableViewToggleProps) {
  const [useVirtualized, setUseVirtualized] = useState(initialValue);
  
  // Load preference from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('useVirtualizedTable');
    if (savedPreference !== null) {
      const parsedValue = savedPreference === 'true';
      setUseVirtualized(parsedValue);
      onToggle(parsedValue);
    }
  }, [onToggle]);
  
  const handleToggle = (checked: boolean) => {
    setUseVirtualized(checked);
    localStorage.setItem('useVirtualizedTable', String(checked));
    onToggle(checked);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="virtualized-mode"
        checked={useVirtualized}
        onCheckedChange={handleToggle}
        aria-label="Toggle virtualized table mode"
      />
      <Label htmlFor="virtualized-mode" className="text-sm">
        Virtualized Mode
      </Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Info className="h-4 w-4" />
              <span className="sr-only">About virtualized mode</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              Virtualized mode improves performance with large datasets by only rendering visible rows.
              Recommended for collections with more than 100 books.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
