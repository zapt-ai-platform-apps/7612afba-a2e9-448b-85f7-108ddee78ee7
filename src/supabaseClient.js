import { initializeZapt } from '@zapt/zapt-js';

// Check for required environment variables
const appId = import.meta.env.VITE_PUBLIC_APP_ID;
if (!appId) {
  console.error('VITE_PUBLIC_APP_ID environment variable is missing');
}

// Initialize Supabase client with better error handling
let supabase = null;
let recordLogin = async () => {
  console.warn('recordLogin function not initialized');
};

try {
  const zapt = initializeZapt(appId);
  supabase = zapt.supabase;
  recordLogin = zapt.recordLogin;
  
  if (!supabase) {
    throw new Error('Supabase client initialization failed');
  }
  
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

export { supabase, recordLogin };