import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Leaderboard = () => {
  const [testers, setTesters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get('/users/leaderboard');
        setTesters(res.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading leaderboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
        <span className="text-4xl">🏆</span> Top Bug Hunters
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Rank</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Name</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-600">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testers.map((tester, index) => (
                <tr key={tester._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-slate-200 text-slate-700' : 
                        index === 2 ? 'bg-orange-100 text-orange-800' : 'text-slate-500'}`}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-800">{tester.name}</div>
                    <div className="text-sm text-slate-500">{tester.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm">
                      ✨ {tester.points}
                    </span>
                  </td>
                </tr>
              ))}
              {testers.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-slate-500">No testers found on the leaderboard yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
