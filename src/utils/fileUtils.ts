
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
 */
export const validateFile = (file: File, allowedTypes: string[] = [], maxSizeMB: number = 10): { valid: boolean; message?: string } => {
  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      message: `File is too large. Maximum size is ${maxSizeMB}MB.`
    };
  }

  // If no file type restrictions, return valid
  if (!allowedTypes.length) {
    return { valid: true };
  }

  // Check file type
  const fileType = getFileTypeFromName(file.name);
  if (!allowedTypes.includes(fileType)) {
    return {
      valid: false,
      message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
};
