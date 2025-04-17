import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 hidden md:block">
      <div className="container-app">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <img 
                src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=24&height=24" 
                alt="Click & Collectible"
                className="h-6 w-6 mr-2" 
              />
              <span className="text-gray-700 font-medium">Click & Collectible</span>
            </Link>
          </div>
          
          <div className="text-center md:text-right">
            <a
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="zapt-badge"
            >
              Made on ZAPT
            </a>
            <p className="text-sm text-gray-500 mt-2">
              © {new Date().getFullYear()} Click & Collectible. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}