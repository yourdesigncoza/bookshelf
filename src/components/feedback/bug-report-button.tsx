'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/monitoring';
import { AlertTriangle } from 'lucide-react';

// Define the form schema
const bugReportSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters',
  }).max(100, {
    message: 'Title must not exceed 100 characters',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters',
  }).max(1000, {
    message: 'Description must not exceed 1000 characters',
  }),
  steps: z.string().min(10, {
    message: 'Steps to reproduce must be at least 10 characters',
  }).max(1000, {
    message: 'Steps to reproduce must not exceed 1000 characters',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }).optional().or(z.literal('')),
});

type BugReportValues = z.infer<typeof bugReportSchema>;

interface BugReportButtonProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BugReportButton({ open: controlledOpen, onOpenChange }: BugReportButtonProps = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<BugReportValues>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      title: '',
      description: '',
      steps: '',
      email: '',
    },
  });

  // Handle form submission
  async function onSubmit(data: BugReportValues) {
    setIsSubmitting(true);

    try {
      // Capture the bug report in Sentry
      Sentry.captureMessage(`Bug Report: ${data.title}`, {
        level: 'error',
        tags: { reportType: 'user_bug_report' },
        extra: {
          description: data.description,
          stepsToReproduce: data.steps,
          userEmail: data.email || 'Not provided',
        },
      });

      // Track the bug report event
      trackEvent('bug_report_submitted', {
        hasEmail: !!data.email,
      });

      // In a real application, you would send this data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      toast.success('Bug report submitted', {
        description: 'Thank you for helping us improve the application!',
      });

      // Reset the form and close the dialog
      form.reset();
      setOpen(false);
    } catch (error) {
      // Show error message
      toast.error('Failed to submit bug report', {
        description: 'Please try again later or contact support directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          Report Bug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
          <DialogDescription>
            Help us improve by reporting any issues you encounter. Please provide as much detail as possible.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bug Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of the issue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bug Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe what happened and what you expected to happen"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Steps to Reproduce</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please list the steps to reproduce the bug"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Example: 1. Go to the books page, 2. Click on add book, 3. Fill out the form, 4. Click submit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide your email if you'd like us to follow up with you about this bug.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
