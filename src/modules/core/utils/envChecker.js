export function checkRequiredEnvVars() {
  const requiredVars = [
    'VITE_PUBLIC_APP_ID',
    'VITE_PUBLIC_APP_ENV',
    'VITE_PUBLIC_SENTRY_DSN',
  ];
  
  const missing = [];
  const present = [];
  
  requiredVars.forEach(varName => {
    if (!import.meta.env[varName]) {
      missing.push(varName);
    } else {
      present.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
  } else {
    console.log('All required environment variables are present');
  }
  
  return { missing, present };
}