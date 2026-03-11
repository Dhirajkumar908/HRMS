import React, { useState, useEffect } from 'react';
import api from '../APImanager/axiosInctance'; 

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

 const fetchDepartments = async () => {
    try {
      const res = await api.get('departments/');
      
      
      if (Array.isArray(res.data)) {
        setDepartments(res.data);
      } 
      
      else if (res.data && Array.isArray(res.data.results)) {
        setDepartments(res.data.results);
      } 
      
      else {
        console.error("Unexpected API response format:", res.data);
        setDepartments([]);
      }
      
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!departmentName.trim()) return; 

    try {
      
      await api.post('departments/', { name: departmentName }); 
      
      fetchDepartments();
      setDepartmentName(''); 
      setIsFormVisible(false);
    } catch (error) {
      alert("Error adding department.");
      console.error(error);
    }
  };

  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? Deleting this might affect employees assigned to it.")) {
      try {
        await api.delete(`departments/${id}/`);
        fetchDepartments(); 
      } catch (error) {
        console.error("Error deleting department:", error.response?.data || error.message);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Departments</h2>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isFormVisible ? 'Cancel' : '+ Add Department'}
        </button>
      </div>

      {isFormVisible && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold mb-4">New Department</h3>
          <form onSubmit={handleSubmit} className="flex gap-4 items-center">
            <input required type="text" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} placeholder="e.g. Engineering..." className="flex-1 p-2 border rounded" />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition whitespace-nowrap">Save</button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 border-b border-gray-200">
              <th className="p-3 w-24">ID</th>
              <th className="p-3">Department Name</th>
              <th className="p-3 text-center w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr><td colSpan="3" className="p-4 text-center text-gray-500">No departments found.</td></tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-500">#{dept.id}</td>
                  <td className="p-3 font-medium text-gray-800">{dept.name}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDelete(dept.id)} className="text-red-500 hover:text-red-700 font-medium text-sm bg-red-50 px-3 py-1 rounded-md">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Departments;