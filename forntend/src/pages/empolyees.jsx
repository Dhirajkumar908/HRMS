import React, { useState, useEffect } from 'react';
import api from '../APImanager/axiosInctance';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const [formData, setFormData] = useState({
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    designation: '',
    department: ''
  });

  const fetchData = async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        api.get('employees/'),
        api.get('departments/')
      ]);

      setEmployees(Array.isArray(empRes.data) ? empRes.data : empRes.data?.results || []);
      setDepartments(Array.isArray(deptRes.data) ? deptRes.data : deptRes.data?.results || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setEmployees([]);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleOpenModal = (emp = null) => {
    if (emp) {
      setFormData({
        id: emp.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        designation: emp.designation,
        department: emp.department || ''
      });
    } else {
      setFormData({
        id: null,
        first_name: '',
        last_name: '',
        email: '',
        designation: '',
        department: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        
        await api.patch(`employees/${formData.id}/`, formData);
      } else {
        
        await api.post('employees/', formData);
      }
      
      fetchData(); 
      setIsModalOpen(false); 
    } catch (error) {
      alert("Error saving employee details.");
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`employees/${id}/`);
        fetchData(); 
      } catch (error) {
        console.error("Error deleting employee:", error.response?.data || error.message);
      }
    }
  };

  const getDepartmentName = (deptId) => {
    if (!Array.isArray(departments)) return 'N/A';
    const dept = departments.find(d => d.id == deptId);
    return dept ? dept.name : 'Unassigned';
  };

  return (
    <div className="p-6">
      
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Employee Directory</h2>
          <p className="text-gray-500 text-sm mt-1">Manage staff details and roles</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
          Add Employee
        </button>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 text-sm text-gray-500">
          {employees.length} employees found
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 font-semibold">Employee</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Department</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {employees.map(emp => (
              <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm uppercase">
                    {emp.first_name.charAt(0)}{emp.last_name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 block">{emp.first_name} {emp.last_name}</span>
                    <span className="text-xs text-blue-500 font-medium block mt-0.5">Emp-{emp.id.toString().padStart(3, '0')}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-600">{emp.email}</td>
                <td className="p-4 text-gray-800 font-medium">{emp.designation}</td>
                <td className="p-4 text-gray-600">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium">
                    {getDepartmentName(emp.department)}
                  </span>
                </td>
                <td className="p-4 text-center space-x-3">
                  <button onClick={() => handleOpenModal(emp)} className="text-gray-400 hover:text-blue-600">
                    <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button onClick={() => handleDelete(emp.id)} className="text-gray-400 hover:text-red-600">
                    <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                {formData.id ? 'Edit Employee' : 'New Employee'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">First Name</label>
                  <input required type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Last Name</label>
                  <input required type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Designation</label>
                  <input required type="text" name="designation" value={formData.designation} onChange={handleInputChange} placeholder="e.g. Developer" className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Department</label>
                  <select required name="department" value={formData.department} onChange={handleInputChange} className="p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">
                    <option value="">Select Dept...</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  {formData.id ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Employees;