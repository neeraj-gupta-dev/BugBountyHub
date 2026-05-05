import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const TopHeader = ({ toggleSidebar }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden focus:outline-none"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">
          Welcome back, {user.name}
        </h2>
      </div>
      <div className="flex items-center gap-6">
        <NotificationBell />
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-700">{user.name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
              ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                user.role === 'Developer' ? 'bg-emerald-100 text-emerald-700' : 
                'bg-blue-100 text-blue-700'}`}
            >
              {user.role}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
