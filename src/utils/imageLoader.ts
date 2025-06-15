
/**
 * Creates an array of image URLs from a base path and count
 * @param basePath The base path for the images
 * @param count Number of images to generate
 * @param extension File extension (default: 'jpg')
 * @returns Array of image URLs
 */
export const generateImageUrls = (basePath: string, count: number, extension: string = 'jpg'): string[] => {
  return Array.from({ length: count }, (_, i) => `${basePath}${i + 1}.${extension}`);
};

/**
 * Cache for preloaded images
 */
const imageCache = new Map<string, HTMLImageElement>();

/**
 * Preloads images to improve user experience with caching
 * @param urls Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded
 */
export const preloadImages = (urls: string[]): Promise<void[]> => {
  const promises = urls.map(url => {
    // Return cached image if already loaded
    if (imageCache.has(url)) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(url, img);
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to preload image: ${url}`);
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });
  });

  return Promise.all(promises);
};

/**
 * Check if an image is already cached
 * @param url Image URL to check
 * @returns boolean indicating if image is cached
 */
export const isImageCached = (url: string): boolean => {
  return imageCache.has(url);
};

/**
 * Clear the image cache
 */
export const clearImageCache = (): void => {
  imageCache.clear();
};

/**
 * Get cache size
 */
export const getCacheSize = (): number => {
  return imageCache.size;
};
