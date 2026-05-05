import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, Trophy, Bell, ShieldAlert, LogOut, PlusSquare, ShieldCheck } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            BugBountyHub
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </NavLink>
          <NavLink to="/projects" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <FolderKanban size={20} />
            <span className="font-medium">Projects</span>
          </NavLink>
          <NavLink to="/leaderboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Trophy size={20} />
            <span className="font-medium">Leaderboard</span>
          </NavLink>
          <NavLink to="/notifications" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Bell size={20} />
            <span className="font-medium">Notifications</span>
          </NavLink>

          {user.role === 'Developer' && (
            <div className="mt-6">
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Developer Tools</p>
              <NavLink to="/create-project" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <PlusSquare size={20} />
                <span className="font-medium">Create Project</span>
              </NavLink>
            </div>
          )}

          {user.role === 'Admin' && (
            <div className="mt-6">
              <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Admin Tools</p>
              <NavLink to="/admin" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <ShieldCheck size={20} />
                <span className="font-medium">Admin Panel</span>
              </NavLink>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
