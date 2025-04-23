import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import * as Sentry from '@sentry/browser';
import { AuthProvider } from '@/modules/auth/ui/AuthProvider';
import { checkRequiredEnvVars } from '@/modules/core/utils/envChecker';

// Check environment variables and log results
const { missing } = checkRequiredEnvVars();

// Only initialize Sentry if we have the required environment variables
if (missing.includes('VITE_PUBLIC_SENTRY_DSN')) {
  console.error('Sentry initialization skipped due to missing DSN');
} else {
  Sentry.init({
    dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
    environment: import.meta.env.VITE_PUBLIC_APP_ENV || 'development',
    initialScope: {
      tags: {
        type: 'frontend',
        projectId: import.meta.env.VITE_PUBLIC_APP_ID || 'unknown',
      },
    },
  });
  console.log('Sentry initialized');
}

// Add PWA support
if (import.meta.env.VITE_PUBLIC_APP_ID) {
  window.progressierAppRuntimeSettings = {
    uid: import.meta.env.VITE_PUBLIC_APP_ID,
    icon512: "https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=512&height=512",
    name: "Click & Collectible",
    shortName: "Click & Coll"
  };
  let progressierScript = document.createElement('script');
  progressierScript.setAttribute('src', 'https://progressier.app/z8yY3IKmfpDIw3mSncPh/script.js');
  progressierScript.setAttribute('defer', 'true');
  document.querySelector('head').appendChild(progressierScript);
} else {
  console.warn('PWA support disabled due to missing APP_ID');
}

// Umami Analytics
if (import.meta.env.VITE_PUBLIC_APP_ENV !== 'development' && import.meta.env.VITE_PUBLIC_UMAMI_WEBSITE_ID) {
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://cloud.umami.is/script.js';
  script.setAttribute('data-website-id', import.meta.env.VITE_PUBLIC_UMAMI_WEBSITE_ID);
  document.head.appendChild(script);
  console.log('Umami analytics initialized');
} else {
  console.log('Umami analytics disabled in development or missing website ID');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);