import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', startDate: '', endDate: '', status: 'Active' });
  const [editId, setEditId] = useState(null);

  const fetchProjects = () => {
    api.get(`/projects${statusFilter ? `?status=${statusFilter}` : ''}`).then(res => setProjects(res.data));
  };

  useEffect(() => { fetchProjects(); }, [statusFilter]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (editId) {
      await api.patch(`/projects/${editId}`, formData);
    } else {
      await api.post('/projects', formData);
    }
    setIsModalOpen(false);
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    if(confirm('Are you sure?')) {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-2 rounded">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <button onClick={() => { setEditId(null); setFormData({ name: '', description: '', startDate: '', endDate: '', status: 'Active' }); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">Add Project</button>
        </div>
      </div>

      <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((proj: any) => (
              <tr key={proj.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline">
                  <Link to={`/projects/${proj.id}`}>{proj.name}</Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proj.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{proj.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/projects/${proj.id}`} className="text-green-600 hover:text-green-900 mr-4">Manage Staff</Link>
                  <button onClick={() => { setEditId(proj.id); setFormData(proj); setIsModalOpen(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(proj.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editId ? 'Edit' : 'Add'} Project</h3>
            <form onSubmit={handleSubmit}>
              <input required type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mb-3 p-2 border rounded"/>
              <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mb-3 p-2 border rounded"></textarea>
              <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full mb-3 p-2 border rounded"/>
              <input type="date" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full mb-3 p-2 border rounded"/>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full mb-4 p-2 border rounded">
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );}