'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/lib/types';
import { calculateAllStatistics } from '@/lib/statistics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Star,
  BookText,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface StatisticsDashboardProps {
  books: Book[];
}

export function StatisticsDashboard({ books }: StatisticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<ReturnType<typeof calculateAllStatistics> | null>(null);

  // Calculate statistics when books change
  useEffect(() => {
    setStats(calculateAllStatistics(books));
  }, [books]);

  if (!stats) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex flex-col w-full space-y-4">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render rating stars
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="statistics-heading">
      <h2 className="text-2xl font-bold text-center" id="statistics-heading">Reading Statistics</h2>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0" aria-label="Statistics categories">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="genres">Genres</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Total Books */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Books
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBooks}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalPagesRead > 0 && `${stats.totalPagesRead} pages read`}
                </p>
              </CardContent>
            </Card>

            {/* Average Rating */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageRating}</div>
                <div className="mt-1">
                  {renderRatingStars(stats.averageRating)}
                </div>
              </CardContent>
            </Card>

            {/* Most Read Genre */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Most Read Genre
                </CardTitle>
                <BookText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {stats.mostReadGenre ? stats.mostReadGenre.genre : 'None'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.mostReadGenre ? `${stats.mostReadGenre.count} books` : 'No genres specified'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>
                Number of books by rating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.ratingDistribution)
                  .sort(([ratingA], [ratingB]) => parseInt(ratingB) - parseInt(ratingA))
                  .map(([rating, count]) => (
                    <div key={rating} className="flex items-center">
                      <div className="w-12 text-right mr-2 sm:mr-4">
                        {rating} <Star className="inline-block h-3 w-3 fill-yellow-500 text-yellow-500" aria-hidden="true" />
                      </div>
                      <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-primary h-4 rounded-full"
                          style={{
                            width: `${stats.totalBooks > 0 ? (count / stats.totalBooks) * 100 : 0}%`
                          }}
                          role="progressbar"
                          aria-valuenow={count}
                          aria-valuemin={0}
                          aria-valuemax={stats.totalBooks}
                          aria-label={`${rating} stars: ${count} books (${stats.totalBooks > 0 ? Math.round((count / stats.totalBooks) * 100) : 0}%)`}
                        ></div>
                      </div>
                      <div className="w-8 sm:w-12 text-right ml-2 sm:ml-4">{count}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Genres Tab */}
        <TabsContent value="genres" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Genre Distribution</CardTitle>
              <CardDescription>
                Number of books by genre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.genreDistribution).length > 0 ? (
                  Object.entries(stats.genreDistribution).map(([genre, count]) => (
                    <div key={genre} className="flex items-center">
                      <div className="w-16 sm:w-24 truncate mr-2 sm:mr-4 capitalize">{genre}</div>
                      <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-primary h-4 rounded-full"
                          style={{
                            width: `${stats.totalBooks > 0 ? (count / stats.totalBooks) * 100 : 0}%`
                          }}
                          role="progressbar"
                          aria-valuenow={count}
                          aria-valuemin={0}
                          aria-valuemax={stats.totalBooks}
                          aria-label={`${genre}: ${count} books (${stats.totalBooks > 0 ? Math.round((count / stats.totalBooks) * 100) : 0}%)`}
                        ></div>
                      </div>
                      <div className="w-8 sm:w-12 text-right ml-2 sm:ml-4">{count}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No genre data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          {/* Books per Year */}
          <Card>
            <CardHeader>
              <CardTitle>Books per Year</CardTitle>
              <CardDescription>
                Number of books read each year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.booksPerYear).length > 0 ? (
                  Object.entries(stats.booksPerYear).map(([year, count]) => (
                    <div key={year} className="flex items-center">
                      <div className="w-12 sm:w-16 mr-2 sm:mr-4">{year}</div>
                      <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-primary h-4 rounded-full"
                          style={{
                            width: `${Math.max(
                              ...Object.values(stats.booksPerYear)
                            ) > 0
                              ? (count / Math.max(...Object.values(stats.booksPerYear))) * 100
                              : 0}%`
                          }}
                          role="progressbar"
                          aria-valuenow={count}
                          aria-valuemin={0}
                          aria-valuemax={Math.max(...Object.values(stats.booksPerYear))}
                          aria-label={`${year}: ${count} books`}
                        ></div>
                      </div>
                      <div className="w-8 sm:w-12 text-right ml-2 sm:ml-4">{count}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No timeline data available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Books per Month (Current Year) */}
          <Card>
            <CardHeader>
              <CardTitle>Books per Month (Current Year)</CardTitle>
              <CardDescription>
                Number of books read each month this year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.values(stats.booksPerMonth).some(count => count > 0) ? (
                  Object.entries(stats.booksPerMonth).map(([month, count]) => (
                    <div key={month} className="flex items-center">
                      <div className="w-16 sm:w-24 mr-2 sm:mr-4">{month}</div>
                      <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-primary h-4 rounded-full"
                          style={{
                            width: `${Math.max(
                              ...Object.values(stats.booksPerMonth)
                            ) > 0
                              ? (count / Math.max(...Object.values(stats.booksPerMonth))) * 100
                              : 0}%`
                          }}
                          role="progressbar"
                          aria-valuenow={count}
                          aria-valuemin={0}
                          aria-valuemax={Math.max(...Object.values(stats.booksPerMonth))}
                          aria-label={`${month}: ${count} books`}
                        ></div>
                      </div>
                      <div className="w-8 sm:w-12 text-right ml-2 sm:ml-4">{count}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No books read this year
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
