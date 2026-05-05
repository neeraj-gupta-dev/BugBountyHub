import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Bug as BugIcon, CheckCircle, Clock, XCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const BugHistory = () => {
  const { user } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        setLoading(true);
        // If developer, fetch their project bugs; if tester, fetch their submitted bugs
        const endpoint = user.role === 'Developer' 
          ? `/bugs?developer=${user._id}` 
          : `/bugs?tester=${user._id}`;
          
        const res = await API.get(endpoint);
        setBugs(res.data);
      } catch (error) {
        console.error('Failed to fetch bugs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBugs();
  }, [user]);

  const tabs = user.role === 'Tester' 
    ? ['All', 'Pending', 'Accepted', 'Rejected', 'Earnings']
    : ['All', 'Pending', 'Accepted', 'Rejected'];

  const getFilteredBugs = () => {
    if (activeTab === 'All') return bugs;
    if (activeTab === 'Pending') return bugs.filter(b => b.status === 'submitted' || b.status === 'under_review');
    if (activeTab === 'Accepted' || activeTab === 'Earnings') return bugs.filter(b => b.status === 'accepted' || b.status === 'fixed');
    if (activeTab === 'Rejected') return bugs.filter(b => b.status === 'closed' || b.status === 'rejected');
    return bugs;
  };

  const filteredBugs = getFilteredBugs();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <BugIcon className="text-emerald-500" size={32} />
          {user.role === 'Developer' ? 'Bugs on My Projects' : 'My Bug Submissions'}
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            Loading history...
          </div>
        ) : filteredBugs.length === 0 ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <BugIcon size={48} className="text-slate-200 mb-4" />
            <p className="text-lg font-medium text-slate-600 mb-1">No bugs found</p>
            <p className="text-sm">There are no bugs matching the '{activeTab}' filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-sm font-semibold text-slate-600">Bug Title</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-600">Project</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-600">Severity</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-slate-600">Date</th>
                  {activeTab === 'Earnings' && (
                    <th className="py-4 px-6 text-sm font-semibold text-emerald-600 text-right">Points</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBugs.map(bug => (
                  <tr key={bug._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 font-medium text-slate-800">
                      <Link to={`/projects/${bug.project?._id}`} className="hover:text-blue-600 transition-colors">
                        {bug.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-sm">
                      {bug.project?.title || 'Unknown Project'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        bug.severity === 'Critical' ? 'text-red-600' : 
                        bug.severity === 'High' ? 'text-orange-500' : 
                        bug.severity === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {bug.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {bug.status === 'accepted' || bug.status === 'fixed' ? <CheckCircle size={14} className="text-emerald-500"/> :
                         bug.status === 'submitted' || bug.status === 'under_review' ? <Clock size={14} className="text-amber-500"/> :
                         <XCircle size={14} className="text-slate-400"/>}
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          bug.status === 'accepted' || bug.status === 'fixed' ? 'bg-emerald-100 text-emerald-700' : 
                          bug.status === 'under_review' ? 'bg-amber-100 text-amber-700' : 
                          bug.status === 'closed' ? 'bg-slate-100 text-slate-700' : 
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {bug.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">
                      {new Date(bug.createdAt).toLocaleDateString()}
                    </td>
                    {activeTab === 'Earnings' && (
                      <td className="py-4 px-6 text-right font-bold text-emerald-600">
                        {bug.pointsAwarded > 0 ? `+${bug.pointsAwarded}` : '-'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BugHistory;
