import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Bug, Trophy } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bug className="text-emerald-400" size={32} />
          <span className="text-2xl font-bold tracking-tight">BugBountyHub</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">Log In</Link>
          <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium transition-colors">Sign Up</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
            Secure code. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Earn bounties.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed">
            The premier platform connecting forward-thinking developers with elite testers. Discover vulnerabilities before they reach production.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/50">
              Start Hunting Bugs
            </Link>
            <Link to="/register" className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-700">
              Post a Project
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
            <ShieldCheck className="text-blue-400 mb-6" size={48} />
            <h3 className="text-xl font-bold mb-4">Secure Ecosystem</h3>
            <p className="text-slate-400">Leverage crowdsourced security testing to harden your applications against real-world threats.</p>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
            <Bug className="text-emerald-400 mb-6" size={48} />
            <h3 className="text-xl font-bold mb-4">Streamlined Reporting</h3>
            <p className="text-slate-400">Intuitive bug submission flows with automated severity scoring and media attachments.</p>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
            <Trophy className="text-amber-400 mb-6" size={48} />
            <h3 className="text-xl font-bold mb-4">Competitive Bounties</h3>
            <p className="text-slate-400">Climb the global leaderboard and earn points by finding critical flaws before malicious actors do.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
