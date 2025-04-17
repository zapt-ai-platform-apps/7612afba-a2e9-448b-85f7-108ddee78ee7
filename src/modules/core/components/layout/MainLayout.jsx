import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50">
          <div className="container-app">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}