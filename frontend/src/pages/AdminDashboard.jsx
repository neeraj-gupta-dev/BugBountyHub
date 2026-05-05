import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Users, Database, Bug, ShieldBan, ShieldCheck, CheckCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ usersCount: 0, projectsCount: 0, bugsCount: 0, acceptedBugsCount: 0, totalBountyPaid: 0 });
  const [usersList, setUsersList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, usersRes, projsRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/users'),
          API.get('/projects') // Admin can see all projects
        ]);
        setStats(statsRes.data);
        setUsersList(usersRes.data);
        setProjectsList(projsRes.data);
      } catch (error) {
        console.error('Error fetching admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleBlockUser = async (id, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`)) return;
    try {
      const res = await API.put(`/admin/users/${id}/toggle-block`);
      setUsersList(usersList.map(u => u._id === id ? { ...u, isBlocked: res.data.user.isBlocked } : u));
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
        Loading Admin Panel...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
        <ShieldCheck className="text-purple-600" size={32} />
        Admin Control Center
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {['Dashboard', 'Projects', 'Users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'text-purple-700 border-b-2 border-purple-700 bg-purple-50/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'Dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
                <div className="p-4 rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform"><Users size={28} /></div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Total Users</h3>
                  <p className="text-3xl font-bold text-slate-800">{stats.usersCount}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
                <div className="p-4 rounded-full bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform"><Database size={28} /></div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Total Projects</h3>
                  <p className="text-3xl font-bold text-slate-800">{stats.projectsCount}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
                <div className="p-4 rounded-full bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform"><Bug size={28} /></div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Total Bugs Reported</h3>
                  <p className="text-3xl font-bold text-slate-800">{stats.bugsCount}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
                <div className="p-4 rounded-full bg-teal-100 text-teal-600 group-hover:scale-110 transition-transform"><CheckCircle size={28} /></div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Total Accepted Bugs</h3>
                  <p className="text-3xl font-bold text-slate-800">{stats.acceptedBugsCount}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 text-white hover:-translate-y-1 hover:shadow-lg transition-all group md:col-span-2 lg:col-span-2">
                <div className="p-4 rounded-full bg-white/20 group-hover:scale-110 transition-transform"><Award size={32} /></div>
                <div>
                  <h3 className="text-sm font-medium text-purple-100">Total Bounty Paid</h3>
                  <p className="text-4xl font-extrabold">{stats.totalBountyPaid} <span className="text-lg font-medium opacity-80">pts</span></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Projects' && (
            <div className="overflow-x-auto">
              {projectsList.length === 0 ? (
                <div className="text-center p-8 text-slate-500">No projects found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-4 px-6 text-sm font-semibold text-slate-600">Project Title</th>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-600">Developer</th>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-600">Date Posted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projectsList.map(p => (
                      <tr key={p._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-4 px-6 font-medium text-slate-800">
                          <Link to={`/projects/${p._id}`} className="hover:text-blue-600 transition-colors">
                            {p.title}
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-slate-600 text-sm">{p.developer?.name || 'Unknown'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-bold uppercase ${p.status === 'Active' ? 'text-emerald-700 bg-emerald-100' : ''}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'Users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 text-sm font-semibold text-slate-600">Name</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-600">Email</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-600">Role</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-600">Points</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                    <th className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-800">{u.name}</td>
                      <td className="py-4 px-6 text-slate-600">{u.email}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                          u.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'Developer' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-700">{u.points || 0}</td>
                      <td className="py-4 px-6">
                        {u.isBlocked ? (
                          <span className="flex items-center gap-1 text-red-600 text-sm font-semibold"><ShieldBan size={16}/> Blocked</span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-600 text-sm font-semibold"><ShieldCheck size={16}/> Active</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u.role !== 'Admin' && (
                          <button 
                            onClick={() => toggleBlockUser(u._id, u.isBlocked)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border ${u.isBlocked ? 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50' : 'bg-white border-red-200 text-red-700 hover:bg-red-50'}`}
                          >
                            {u.isBlocked ? 'Unblock User' : 'Block User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
