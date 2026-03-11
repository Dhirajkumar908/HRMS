import React, { useState, useEffect } from 'react';
import api from '../APImanager/axiosInctance'; 

function LeaveRequest() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    employee: '',
    start_date: '',
    end_date: '',
    reason: '',
    status: 'Pending'
  });

  const fetchData = async () => {
    try {
      const [leaveRes, empRes] = await Promise.all([
        api.get('leaves/'),
        api.get('employees/')
      ]);

      setLeaves(Array.isArray(leaveRes.data) ? leaveRes.data : leaveRes.data?.results || []);
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
        start_date: record.start_date,
        end_date: record.end_date,
        reason: record.reason,
        status: record.status
      });
    } else {
      setFormData({
        id: null,
        employee: '',
        start_date: '',
        end_date: '',
        reason: '',
        status: 'Pending'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.patch(`leaves/${formData.id}/`, formData);
      } else {
        await api.post('leaves/', formData);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      alert("Error saving leave request.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this leave request?")) {
      try {
        await api.delete(`leaves/${id}/`);
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
    if (!dateString) return 'N/A';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  
  const renderStatusBadge = (status) => {
    let colors = '';
    let dot = '';
    
    if (status === 'Approved') {
      colors = 'bg-green-50 text-green-700 border-green-200';
      dot = 'bg-green-500';
    } else if (status === 'Rejected') {
      colors = 'bg-red-50 text-red-700 border-red-200';
      dot = 'bg-red-500';
    } else {
      
      colors = 'bg-yellow-50 text-yellow-700 border-yellow-200';
      dot = 'bg-yellow-500';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leave Requests</h2>
          <p className="text-gray-500 text-sm mt-1">Manage employee time off</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Request Leave
        </button>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 text-sm text-gray-500">
          {leaves.length} requests found
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 font-semibold">Employee</th>
              <th className="p-4 font-semibold">Dates</th>
              <th className="p-4 font-semibold">Reason</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {leaves.map(record => {
              const emp = getEmployeeDetails(record.employee);
              return (
                <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                      {emp.first_name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 block">{emp.first_name} {emp.last_name}</span>
                      <span className="text-xs text-blue-500 font-medium block mt-0.5">Emp-{emp.id.toString().padStart(3, '0')}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="whitespace-nowrap">{formatDate(record.start_date)}</div>
                    <div className="text-xs text-gray-400">to {formatDate(record.end_date)}</div>
                  </td>
                  <td className="p-4 text-gray-600 max-w-xs truncate" title={record.reason}>
                    {record.reason}
                  </td>
                  <td className="p-4">
                    {renderStatusBadge(record.status)}
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
              <h3 className="text-lg font-bold text-gray-800">
                {formData.id ? 'Edit Leave Request' : 'New Leave Request'}
              </h3>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Start Date</label>
                  <input required type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">End Date</label>
                  <input required type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reason</label>
                <textarea required name="reason" value={formData.reason} onChange={handleInputChange} rows="3" placeholder="Reason for time off..." className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500 resize-none"></textarea>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
                <select required name="status" value={formData.status} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  Save Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default LeaveRequest;