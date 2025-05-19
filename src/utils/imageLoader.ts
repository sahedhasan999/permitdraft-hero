
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
 * Preloads images to improve user experience
 * @param urls Array of image URLs to preload
 */
export const preloadImages = (urls: string[]): void => {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};
