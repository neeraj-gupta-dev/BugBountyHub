import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Bug as BugIcon, ArrowLeft, AlertCircle } from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [projectRes, bugsRes] = await Promise.all([
          API.get(`/projects/${id}`),
          API.get(`/bugs?project=${id}`)
        ]);
        setProject(projectRes.data);
        setBugs(bugsRes.data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading project details...</div>;
  if (!project) return <div className="p-8 text-center text-red-500">Project not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/projects" className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors group">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Projects
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 hover:shadow-md transition-shadow">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{project.title}</h1>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
              {project.status}
            </span>
          </div>
          <p className="text-slate-600 mb-8 text-lg whitespace-pre-wrap leading-relaxed">{project.description}</p>
          
          <div className="flex flex-wrap items-center bg-slate-50 p-6 rounded-xl border border-slate-100 gap-8">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Developer</span>
              <span className="font-semibold text-slate-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">
                  {project.developer?.name?.charAt(0).toUpperCase()}
                </div>
                {project.developer?.name}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Date Posted</span>
              <span className="font-semibold text-slate-800">{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            {user?.role === 'Tester' && project.status === 'Active' && (
              <div className="ml-auto w-full sm:w-auto mt-4 sm:mt-0">
                <Link 
                  to={`/report-bug/${project._id}`}
                  className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <BugIcon size={20} className="mr-2" /> Report Vulnerability
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <AlertCircle size={24} className="text-amber-500" /> 
        Reported Bugs ({bugs.length})
      </h2>

      {bugs.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          No bugs have been reported for this project yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bugs.map(bug => (
            <div key={bug._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{bug.title}</h3>
                <div className="text-sm text-slate-500 mt-1">
                  Reported by <span className="font-medium text-slate-700">{bug.tester?.name}</span> • 
                  Severity: <span className={`font-semibold ${bug.severity === 'Critical' ? 'text-red-600' : bug.severity === 'High' ? 'text-orange-500' : bug.severity === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>{bug.severity}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${bug.status === 'accepted' || bug.status === 'fixed' ? 'bg-emerald-100 text-emerald-700' : 
                    bug.status === 'under_review' ? 'bg-amber-100 text-amber-700' : 
                    bug.status === 'closed' ? 'bg-slate-100 text-slate-700' : 
                    'bg-blue-100 text-blue-700'}`}
                >
                  {bug.status.replace('_', ' ')}
                </span>
                {bug.pointsAwarded > 0 && (
                  <span className="text-xs font-bold text-emerald-600">+{bug.pointsAwarded} pts</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
