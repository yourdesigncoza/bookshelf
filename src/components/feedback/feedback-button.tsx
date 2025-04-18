'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FeedbackDialog } from './feedback-dialog';
import { BugReportButton } from './bug-report-button';
import { MessageSquare, AlertTriangle, ChevronDown } from 'lucide-react';

export function FeedbackButton() {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [bugReportDialogOpen, setBugReportDialogOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFeedbackDialogOpen(true)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Send Feedback</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setBugReportDialogOpen(true)}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>Report Bug</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex md:hidden">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setFeedbackDialogOpen(true)}
        >
          <MessageSquare className="h-4 w-4" />
          Feedback
        </Button>
      </div>

      {/* Feedback Dialog */}
      {feedbackDialogOpen && (
        <FeedbackDialog
          open={feedbackDialogOpen}
          onOpenChange={setFeedbackDialogOpen}
        />
      )}

      {/* Bug Report Dialog */}
      {bugReportDialogOpen && (
        <BugReportButton
          open={bugReportDialogOpen}
          onOpenChange={setBugReportDialogOpen}
        />
      )}
    </>
  );
}
