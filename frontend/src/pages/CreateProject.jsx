import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/projects', { title, description });
      navigate('/projects');
    } catch (error) {
      console.error('Failed to create project', error);
      alert('Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Create New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Main Web Application"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea 
              rows="5"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project, technologies used, and areas to test..."
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Post Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
