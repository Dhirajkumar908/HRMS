import React, { useState, useEffect } from 'react';
import api from '../APImanager/axiosInctance'; 

function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    employee: '',
    date: new Date().toISOString().split('T')[0], 
    status: 'Present'
  });

  const fetchData = async () => {
    try {
      const [attRes, empRes] = await Promise.all([
        api.get('attendance/'),
        api.get('employees/')
      ]);

      setAttendanceRecords(Array.isArray(attRes.data) ? attRes.data : attRes.data?.results || []);
      setEmployees(Array.isArray(empRes.data) ? empRes.data : empRes.data?.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (record = null) => {
    if (record) {
      setFormData({
        id: record.id,
        employee: record.employee,
        date: record.date,
        status: record.status
      });
    } else {
      setFormData({
        id: null,
        employee: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.patch(`attendance/${formData.id}/`, formData);
      } else {
        await api.post('attendance/', formData);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      alert("Error saving attendance.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this attendance record?")) {
      try {
        await api.delete(`attendance/${id}/`);
        fetchData();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const getEmployeeDetails = (empId) => {
    return employees.find(e => e.id == empId) || { first_name: 'Unknown', last_name: '', id: empId };
  };

  
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="p-6">
      
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
          <p className="text-gray-500 text-sm mt-1">Daily attendance tracking</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          Mark Attendance
        </button>
      </div>

      
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 w-48 bg-white outline-none">
          <option>All Employees</option>
        </select>
        <input type="date" className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 bg-white outline-none" />
        <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 w-40 bg-white outline-none">
          <option>All Statuses</option>
        </select>
        <button className="text-blue-500 text-sm hover:underline">Clear filters</button>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 text-sm text-gray-500">
          {attendanceRecords.length} records found
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 font-semibold">Employee</th>
              <th className="p-4 font-semibold">Emp ID</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {attendanceRecords.map(record => {
              const emp = getEmployeeDetails(record.employee);
              const isPresent = record.status === 'Present';
              return (
                <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                      {emp.first_name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">{emp.first_name} {emp.last_name}</span>
                  </td>
                  <td className="p-4 text-blue-500 font-medium">Emp-{emp.id.toString().padStart(3, '0')}</td>
                  <td className="p-4 text-gray-600">{formatDate(record.date)}</td>
                  <td className="p-4">
                    
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isPresent ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isPresent ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-3">
                    
                    <button onClick={() => handleOpenModal(record)} className="text-gray-400 hover:text-blue-600">
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button onClick={() => handleDelete(record.id)} className="text-gray-400 hover:text-red-600">
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Mark Attendance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Employee</label>
                <select required name="employee" value={formData.employee} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
                  <option value="">Select an employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>Emp-{emp.id.toString().padStart(3, '0')} — {emp.first_name} {emp.last_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</label>
                <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500" />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
                <select required name="status" value={formData.status} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Mark Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Attendance;