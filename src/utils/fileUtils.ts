
/**
 * Utility functions for file handling
 */

/**
 * Format file size in a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get appropriate icon for a file type
 */
export const getFileTypeFromName = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || 'unknown';
};

/**
 * Validate file based on allowed types and max size
 * @deprecated Use validateFileSecure from security.ts for enhanced security
 */
export const validateFile = (file: File, allowedTypes: string[] = [], maxSizeMB: number = 10): { valid: boolean; message?: string } => {
  // Import the secure validation
  const { validateFileSecure } = require('@/utils/security');
  return validateFileSecure(file, allowedTypes, maxSizeMB);
};
