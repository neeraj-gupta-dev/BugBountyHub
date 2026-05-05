import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                BugBountyHub
              </span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/dashboard" className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/projects" className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Projects
                </Link>
                <Link to="/leaderboard" className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Leaderboard
                </Link>
                {user.role === 'Developer' && (
                  <Link to="/create-project" className="text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-emerald-500/30">
                    Create Project
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm hidden sm:block">
              Welcome, <span className="font-semibold text-white">{user.name}</span> ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
