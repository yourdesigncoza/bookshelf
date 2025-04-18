'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { FormError } from '@/components/ui/form-error';
import { FormSuccess } from '@/components/ui/form-success';

import { BOOK_GENRES } from '@/lib/types';
import { createBook } from '@/lib/api';

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().optional(),
  dateCompleted: z.date({
    required_error: 'Date completed is required',
  }),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  coverUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  pageCount: z.number().positive('Page count must be positive').optional().or(z.literal('')),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

export function BookForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: undefined,
      dateCompleted: new Date(),
      rating: undefined,
      notes: '',
      coverUrl: '',
      pageCount: undefined,
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(undefined);
    setSuccess(undefined);

    try {
      // Format the date to ISO string
      const formattedData = {
        ...data,
        dateCompleted: data.dateCompleted.toISOString(),
      };

      // Submit the data to the API
      await createBook(formattedData);

      // Set success state
      setIsSuccess(true);
      setSuccess('Book added successfully!');

      toast.success('Book added successfully!');

      // Reset the form
      form.reset();

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      // Redirect to the books list after a short delay
      setTimeout(() => {
        router.push('/books');
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);

      if (error instanceof AxiosError) {
        setError(error.response?.data?.error || 'Failed to add book. Please try again.');
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to add book. Please try again.');
      }

      toast.error(error instanceof Error ? error.message : 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" role="region" aria-labelledby="book-form-title">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl" id="book-form-title">Add New Book</CardTitle>
        <CardDescription className="text-sm">
          Enter the details of the book you've read.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-labelledby="book-form-title">
            <FormError message={error} />
            <FormSuccess message={success} />
            {/* Title field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm" htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input id="title" placeholder="Enter book title" className="h-10 sm:h-9" {...field} required aria-required="true" />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    The title of the book you've read.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author field */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm" htmlFor="author">Author</FormLabel>
                  <FormControl>
                    <Input id="author" placeholder="Enter author name" className="h-10 sm:h-9" {...field} required aria-required="true" />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    The author of the book.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Genre field */}
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm" htmlFor="genre">Genre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-9" id="genre">
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BOOK_GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs sm:text-sm">
                    The genre of the book (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Completed field */}
            <FormField
              control={form.control}
              name="dateCompleted"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm" htmlFor="dateCompleted">Date Completed</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={"w-full pl-3 text-left font-normal h-10 sm:h-9"}
                          aria-label="Select date completed"
                          id="dateCompleted"
                          aria-required="true"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-xs sm:text-sm">
                    The date you completed reading the book.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating field */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm" htmlFor="rating">Rating</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 sm:h-9" id="rating">
                        <SelectValue placeholder="Rate the book" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} {rating === 1 ? 'Star' : 'Stars'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs sm:text-sm">
                    Your rating of the book (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover URL field */}
            <FormField
              control={form.control}
              name="coverUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm" htmlFor="coverUrl">Cover URL</FormLabel>
                  <FormControl>
                    <Input id="coverUrl" placeholder="Enter cover image URL" className="h-10 sm:h-9" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    URL to the book's cover image (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Page Count field */}
            <FormField
              control={form.control}
              name="pageCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm" htmlFor="pageCount">Page Count</FormLabel>
                  <FormControl>
                    <Input
                      id="pageCount"
                      type="number"
                      placeholder="Enter page count"
                      className="h-10 sm:h-9"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? '' : parseInt(value));
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Number of pages in the book (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes field */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm" htmlFor="notes">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      id="notes"
                      placeholder="Enter your thoughts about the book"
                      className="min-h-[120px] text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs sm:text-sm">
                    Your thoughts, reflections, or favorite quotes from the book (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
                className="w-full sm:w-auto h-10 sm:h-9"
                aria-label="Reset form"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full sm:w-auto h-10 sm:h-9"
                aria-label={isSubmitting ? 'Adding book...' : isSuccess ? 'Book added successfully' : 'Add book'}
              >
                {isSubmitting ? 'Adding...' : isSuccess ? 'Added Successfully!' : 'Add Book'}
                {isSuccess && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 animate-bounce"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 px-4 sm:px-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/books')}
          className="w-full sm:w-auto h-10 sm:h-9"
          aria-label="View all books"
        >
          View All Books
        </Button>
        {isSuccess && (
          <div className="text-sm text-green-600 font-medium flex items-center justify-center sm:justify-start w-full sm:w-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Book added successfully!
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
