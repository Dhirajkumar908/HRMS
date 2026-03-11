import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Departments', path: '/departments' }, 
    { name: 'Employees', path: '/employees' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Leave Requests', path: '/leaves' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-lg">
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <span className="text-2xl font-bold text-blue-400">HRMS</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;