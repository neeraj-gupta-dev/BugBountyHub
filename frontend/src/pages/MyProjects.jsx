import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FolderKanban, PlusSquare, ArrowRight } from 'lucide-react';

const MyProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const res = await API.get('/projects');
        // Filter locally or could add a query param ?developer=me
        const myProjs = res.data.filter(p => p.developer._id === user._id);
        setProjects(myProjs);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, [user]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        Loading your projects...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <FolderKanban className="text-blue-500" size={32} />
          My Projects
        </h1>
        <Link 
          to="/create-project" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <PlusSquare size={20} /> Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center text-slate-500 flex flex-col items-center">
          <FolderKanban size={48} className="text-slate-200 mb-4" />
          <p className="text-lg font-medium text-slate-600 mb-2">No projects yet</p>
          <p className="mb-6">You haven't created any bug bounty projects.</p>
          <Link 
            to="/create-project" 
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Start your first project &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project._id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-6 group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{project.title}</h3>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                {project.description}
              </p>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center mt-auto">
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <Link 
                  to={`/projects/${project._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Manage <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
