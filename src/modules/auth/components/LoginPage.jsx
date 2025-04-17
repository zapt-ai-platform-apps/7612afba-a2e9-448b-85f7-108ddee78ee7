import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/">
            <img
              src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=128&height=128"
              alt="Click & Collectible Logo"
              className="mx-auto h-32 w-32"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Click & Collectible</h2>
          <p className="mt-2 text-gray-600">
            Manage your collections and connect with fellow collectors
          </p>
        </div>
        
        <div className="card">
          <div className="card-body">
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-gray-900">Sign in with ZAPT</h3>
              <p className="mt-1 text-sm text-gray-500">
                ZAPT powers all our apps - 
                <a 
                  href="https://www.zapt.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500 ml-1"
                >
                  Learn more
                </a>
              </p>
            </div>
            
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#4F46E5',
                      brandAccent: '#4338CA',
                    },
                    borderWidths: {
                      buttonBorderWidth: '1px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '0.375rem',
                      buttonBorderRadius: '0.375rem',
                      inputBorderRadius: '0.375rem',
                    },
                  },
                },
                className: {
                  button: 'btn-primary',
                  input: 'form-input',
                  label: 'form-label',
                },
              }}
              theme="light"
              providers={['google', 'facebook', 'apple']}
              magicLink={true}
              view="magic_link"
            />
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}