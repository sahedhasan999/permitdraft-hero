import DOMPurify from 'dompurify';

/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
};

/**
 * Sanitize plain text to prevent injection attacks
 */
export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .trim()
    .substring(0, 1000); // Limit length
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Enhanced file validation with security checks
 */
export const validateFileSecure = (file: File, allowedTypes: string[] = [], maxSizeMB: number = 10): { valid: boolean; message?: string } => {
  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      message: `File is too large. Maximum size is ${maxSizeMB}MB.`
    };
  }

  // Check for potentially dangerous file extensions
  const dangerousExtensions = ['exe', 'bat', 'cmd', 'scr', 'pif', 'vbs', 'js', 'jar', 'php', 'asp', 'jsp'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (fileExtension && dangerousExtensions.includes(fileExtension)) {
    return {
      valid: false,
      message: 'File type not allowed for security reasons.'
    };
  }

  // Check MIME type matches extension
  const mimeTypeMap: Record<string, string[]> = {
    'pdf': ['application/pdf'],
    'jpg': ['image/jpeg'],
    'jpeg': ['image/jpeg'],
    'png': ['image/png'],
    'gif': ['image/gif'],
    'webp': ['image/webp'],
    'doc': ['application/msword'],
    'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    'txt': ['text/plain'],
    'zip': ['application/zip']
  };

  if (fileExtension && mimeTypeMap[fileExtension]) {
    if (!mimeTypeMap[fileExtension].includes(file.type)) {
      return {
        valid: false,
        message: 'File content does not match file extension.'
      };
    }
  }

  // If no file type restrictions, return valid
  if (!allowedTypes.length) {
    return { valid: true };
  }

  // Check file type
  if (fileExtension && !allowedTypes.includes(fileExtension)) {
    return {
      valid: false,
      message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Secure console logging that filters sensitive data
 */
export const secureLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    // Filter out sensitive data patterns
    const sensitivePatterns = ['password', 'token', 'secret', 'key', 'auth'];
    
    if (typeof data === 'object' && data !== null) {
      const filteredData = { ...data };
      Object.keys(filteredData).forEach(key => {
        if (sensitivePatterns.some(pattern => key.toLowerCase().includes(pattern))) {
          filteredData[key] = '[REDACTED]';
        }
      });
      console.log(message, filteredData);
    } else {
      console.log(message, data);
    }
  }
};

/**
 * Rate limiting helper for client-side
 */
export class ClientRateLimit {
  private attempts: Map<string, number[]> = new Map();
  
  isRateLimited(key: string, maxAttempts: number = 5, windowMs: number = 300000): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Clean old attempts outside the window
    const validAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return true;
    }
    
    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return false;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const authRateLimit = new ClientRateLimit();