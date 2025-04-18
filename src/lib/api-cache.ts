/**
 * API Cache Utility
 * 
 * This utility provides caching for API calls to reduce redundant network requests
 * and improve performance.
 */

// Cache storage
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

interface CacheOptions {
  /** Cache expiration time in milliseconds (default: 5 minutes) */
  expirationTime?: number;
  /** Force refresh the cache */
  forceRefresh?: boolean;
  /** Cache key prefix */
  prefix?: string;
}

// In-memory cache storage
const memoryCache = new Map<string, CacheEntry<any>>();

// Default cache options
const defaultOptions: CacheOptions = {
  expirationTime: 5 * 60 * 1000, // 5 minutes
  forceRefresh: false,
  prefix: 'api-cache',
};

/**
 * Generates a cache key from the URL and any parameters
 */
export function generateCacheKey(url: string, params?: Record<string, any>): string {
  if (!params) return url;
  
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);
  
  return `${url}:${JSON.stringify(sortedParams)}`;
}

/**
 * Checks if a cache entry is expired
 */
function isCacheExpired<T>(entry: CacheEntry<T>, expirationTime: number): boolean {
  return Date.now() - entry.timestamp > expirationTime;
}

/**
 * Gets data from cache if available and not expired
 */
export function getFromCache<T>(key: string, options: CacheOptions = {}): T | null {
  const opts = { ...defaultOptions, ...options };
  const cacheKey = `${opts.prefix}:${key}`;
  
  // Check memory cache
  if (memoryCache.has(cacheKey)) {
    const entry = memoryCache.get(cacheKey) as CacheEntry<T>;
    
    // Return null if force refresh is requested
    if (opts.forceRefresh) return null;
    
    // Check if cache is expired
    if (isCacheExpired(entry, opts.expirationTime!)) {
      memoryCache.delete(cacheKey);
      return null;
    }
    
    return entry.data;
  }
  
  return null;
}

/**
 * Saves data to cache
 */
export function saveToCache<T>(key: string, data: T, options: CacheOptions = {}): void {
  const opts = { ...defaultOptions, ...options };
  const cacheKey = `${opts.prefix}:${key}`;
  
  // Save to memory cache
  memoryCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Clears a specific cache entry
 */
export function clearCacheEntry(key: string, options: CacheOptions = {}): void {
  const opts = { ...defaultOptions, ...options };
  const cacheKey = `${opts.prefix}:${key}`;
  
  // Clear from memory cache
  memoryCache.delete(cacheKey);
}

/**
 * Clears all cache entries with a specific prefix
 */
export function clearCacheByPrefix(prefix: string): void {
  // Clear from memory cache
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
}

/**
 * Clears all cache entries
 */
export function clearAllCache(): void {
  // Clear memory cache
  memoryCache.clear();
}

/**
 * Cached fetch function
 */
export async function cachedFetch<T>(
  url: string,
  options: RequestInit & CacheOptions = {}
): Promise<T> {
  const { expirationTime, forceRefresh, prefix, ...fetchOptions } = options;
  const cacheOptions = { expirationTime, forceRefresh, prefix };
  
  // Generate cache key
  const cacheKey = generateCacheKey(url, fetchOptions.body ? JSON.parse(fetchOptions.body as string) : undefined);
  
  // Try to get from cache
  if (!forceRefresh) {
    const cachedData = getFromCache<T>(cacheKey, cacheOptions);
    if (cachedData) {
      return cachedData;
    }
  }
  
  // Fetch data
  const response = await fetch(url, fetchOptions);
  
  // Handle error responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`);
  }
  
  // Parse response
  const data = await response.json();
  
  // Save to cache
  saveToCache(cacheKey, data, cacheOptions);
  
  return data;
}
