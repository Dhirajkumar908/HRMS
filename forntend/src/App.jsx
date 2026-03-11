import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout'
import Dashboard from './pages/dashboard';
import Employees from './pages/empolyees';
import Attendance from './pages/attendence';
import LeaveRequest from './pages/leaveRequest';
import Departments from './pages/departments';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Layout />}>
          
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leaves" element={<LeaveRequest />} />
          <Route path='departments' element={<Departments/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;