import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', department: '', designation: '', status: 'Active' });
  const [editId, setEditId] = useState(null);

  const fetchEmployees = () => {
    api.get(`/employees?page=${page}&search=${search}`).then(res => {
      setEmployees(res.data.data);
      setTotal(res.data.total);
    });
  };

  useEffect(() => { fetchEmployees(); }, [page, search]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (editId) {
      await api.patch(`/employees/${editId}`, formData);
    } else {
      await api.post('/employees', formData);
    }
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', department: '', designation: '', status: 'Active' });
    setEditId(null);
    fetchEmployees();
  };

  const handleDelete = async (id: number) => {
    if(confirm('Are you sure?')) {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    }
  };

  const openEdit = (emp: any) => {
    setEditId(emp.id);
    setFormData(emp);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button onClick={() => { setEditId(null); setFormData({ name: '', email: '', phone: '', department: '', designation: '', status: 'Active' }); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">Add Employee</button>
      </div>

      <div className="mb-4">
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded w-full max-w-sm" />
      </div>

      <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((emp: any) => (
              <tr key={emp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEdit(emp)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded">Previous</button>
        <span>Page {page}</span>
        <button disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded">Next</button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{editId ? 'Edit' : 'Add'} Employee</h3>
            <form onSubmit={handleSubmit}>
              <input required type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mb-3 p-2 border rounded"/>
              <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full mb-3 p-2 border rounded"/>
              <input required type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full mb-3 p-2 border rounded"/>
              <input required type="text" placeholder="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full mb-3 p-2 border rounded"/>
              <input required type="text" placeholder="Designation" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full mb-3 p-2 border rounded"/>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full mb-4 p-2 border rounded">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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