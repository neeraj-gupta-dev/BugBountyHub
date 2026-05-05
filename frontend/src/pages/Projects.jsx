import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');
        setProjects(res.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading projects...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Available Projects</h1>
        {user?.role === 'Developer' && (
          <button 
            onClick={() => navigate('/create-project')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-lg">No projects available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{project.title}</h2>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-slate-600 mb-6 flex-grow line-clamp-3">{project.description}</p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  By <span className="font-medium text-slate-700">{project.developer?.name || 'Unknown'}</span>
                </div>
                {user?.role === 'Tester' && project.status === 'Active' && (
                  <button 
                    onClick={() => navigate(`/report-bug/${project._id}`)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Report Bug →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
