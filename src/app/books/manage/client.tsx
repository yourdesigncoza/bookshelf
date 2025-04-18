'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Download,
  Upload,
  Save,
  FileJson,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { exportBooks, backupBooks, getBackups } from '@/lib/api';
import {
  DynamicExportDataSection,
  DynamicImportDataSection,
  DynamicBackupDataSection
} from '@/lib/dynamic-import';

export function DataManagementClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('export');

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Manage Data</h1>
        <Button variant="outline" asChild>
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="export" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <DynamicExportDataSection />
        </TabsContent>

        <TabsContent value="import">
          <DynamicImportDataSection />
        </TabsContent>

        <TabsContent value="backup">
          <DynamicBackupDataSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
