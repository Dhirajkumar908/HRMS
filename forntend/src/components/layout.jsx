import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

function Layout() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* top header bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-800">HRMS Portal</h1>
        </header>

        {/* dynamic page content  */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;