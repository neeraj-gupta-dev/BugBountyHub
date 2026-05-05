import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import ReportBug from './pages/ReportBug';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import BugHistory from './pages/BugHistory';
import MyProjects from './pages/MyProjects';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 w-full lg:ml-64 transition-all duration-300">
        <TopHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const RoleRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/bug-history" element={<BugHistory />} />
          
          <Route path="/my-projects" element={
            <RoleRoute roles={['Developer', 'Admin']}>
              <MyProjects />
            </RoleRoute>
          } />
          
          <Route path="/create-project" element={
            <RoleRoute roles={['Developer', 'Admin']}>
              <CreateProject />
            </RoleRoute>
          } />
          
          <Route path="/report-bug/:projectId" element={
            <RoleRoute roles={['Tester', 'Admin']}>
              <ReportBug />
            </RoleRoute>
          } />

          <Route path="/admin" element={
            <RoleRoute roles={['Admin']}>
              <AdminDashboard />
            </RoleRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
