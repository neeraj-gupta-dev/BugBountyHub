import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const ReportBug = () => {
  const { projectId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('severity', severity);
    formData.append('project', projectId);
    if (file) {
      formData.append('screenshot', file);
    }

    try {
      await API.post('/bugs', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to submit bug', error);
      alert('Failed to submit bug.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Report a Bug</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bug Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Login button is unresponsive on mobile"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea 
              rows="5"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Steps to reproduce, expected behavior, actual behavior..."
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Severity</label>
              <select 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Screenshot (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 mt-8"
          >
            {loading ? 'Submitting...' : 'Submit Bug Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportBug;
