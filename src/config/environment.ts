/**
 * Environment configuration with fallbacks
 * This ensures the app works even if environment variables are not set
 */

export const environment = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAfb7gQUInf_Ax8nkWjPnjbSvHECG8DvOQ",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "permitdraftpro.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "permitdraftpro",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "permitdraftpro.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "814185624643",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:814185624643:web:7c4bc80a538428a8ec10f6",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-4KHXPL1804"
  },
  adminEmails: (import.meta.env.VITE_ADMIN_EMAILS || 'admin@permitdraftpro.com')
    .split(',')
    .map(email => email.trim()),
  app: {
    name: import.meta.env.VITE_APP_NAME || 'PermitDraftPro',
    url: import.meta.env.VITE_APP_URL || window.location.origin,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD
  }
};

// Validate required environment variables in production
if (environment.app.isProduction) {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    throw new Error('Missing required environment variables. Check your .env.local file.');
  }
}