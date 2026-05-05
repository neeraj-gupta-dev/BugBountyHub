import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Bug as BugIcon, CheckCircle, Award } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/users/dashboard-stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

  const devChartData = [
    { name: 'Projects', value: stats?.totalProjects || 0 },
    { name: 'Bugs Reported', value: stats?.totalBugsReported || 0 },
    { name: 'Pending Review', value: stats?.bugsWaitingReview || 0 },
  ];

  const testerChartData = [
    { name: 'Submitted', value: stats?.totalBugsSubmitted || 0 },
    { name: 'Accepted', value: stats?.acceptedBugsCount || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard Overview</h1>
      
      {user.role === 'Developer' && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/my-projects" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
              <div className="p-4 rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform"><Briefcase size={28} /></div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Projects Created</h3>
                <p className="text-3xl font-bold text-slate-800">{stats.totalProjects}</p>
              </div>
            </Link>
            <Link to="/bug-history" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
              <div className="p-4 rounded-full bg-amber-100 text-amber-600 group-hover:scale-110 transition-transform"><BugIcon size={28} /></div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Bugs Reported</h3>
                <p className="text-3xl font-bold text-slate-800">{stats.totalBugsReported}</p>
              </div>
            </Link>
            <Link to="/bug-history" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
              <div className="p-4 rounded-full bg-red-100 text-red-600 group-hover:scale-110 transition-transform"><CheckCircle size={28} /></div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Pending Review</h3>
                <p className="text-3xl font-bold text-slate-800">{stats.bugsWaitingReview}</p>
              </div>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-96 hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Overview</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={devChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {user.role === 'Tester' && stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/bug-history" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
              <div className="p-4 rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform"><BugIcon size={28} /></div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Bugs Submitted</h3>
                <p className="text-3xl font-bold text-slate-800">{stats.totalBugsSubmitted}</p>
              </div>
            </Link>
            <Link to="/bug-history" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all group">
              <div className="p-4 rounded-full bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform"><CheckCircle size={28} /></div>
              <div>
                <h3 className="text-sm font-medium text-slate-500">Accepted Bugs</h3>
                <p className="text-3xl font-bold text-slate-800">{stats.acceptedBugsCount}</p>
              </div>
            </Link>
            <Link to="/bug-history" className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-sm p-6 flex items-center gap-4 text-white hover:-translate-y-1 hover:shadow-lg transition-all group">
              <div className="p-4 rounded-full bg-white/20 group-hover:scale-110 transition-transform"><Award size={28} /></div>
              <div>
                <h3 className="text-sm font-medium text-emerald-100">Total Points Earned</h3>
                <p className="text-3xl font-bold">{stats.totalPointsEarned}</p>
              </div>
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center h-96 hover:shadow-md transition-all">
            <h3 className="text-lg font-bold text-slate-800 mb-6 self-start">Submission Success Rate</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={testerChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {testerChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {user.role === 'Admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to Admin Control</h2>
          <p className="text-slate-600 mb-6">Manage users and oversee platform health from the Admin Panel.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
