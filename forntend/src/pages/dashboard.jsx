import React, { useState, useEffect } from 'react';
import api from '../APImanager/axiosInctance'; 

function Dashboard() {
  const [stats, setStats] = useState({
    total_employees: 0,
    total_departments: 0,
    total_leaves: 0,
    pending_leaves: 0,
    present_today: 0,
    absent_today: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await api.get('dashboard-stats/');
      setStats(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1"></p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Employees</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : stats.total_employees}
            </h3>
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 8h5"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Departments</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : stats.total_departments}
            </h3>
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Present Today</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : stats.present_today}
            </h3>
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Absent Today</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : stats.absent_today}
            </h3>
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Leaves</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : stats.pending_leaves}
            </h3>
          </div>
        </div>

        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Leave Requests</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {isLoading ? '...' : stats.total_leaves}
            </h3>
          </div>
        </div>

      </div>

      
      <div className="mt-8 bg-blue-600 rounded-xl p-8 text-white shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold mb-2">Welcome back to the HRMS Portal</h3>
          <p className="text-blue-100">You have {stats.pending_leaves} leave requests waiting for your approval today.</p>
        </div>
        <div className="hidden md:block">
           <svg className="w-16 h-16 text-blue-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;