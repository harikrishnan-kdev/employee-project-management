import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const fetchProject = () => {
    api.get(`/projects/${id}`).then(res => setProject(res.data));
  };

  useEffect(() => {
    fetchProject();
    api.get('/employees?limit=100').then(res => setAllEmployees(res.data.data));
  }, [id]);

  const handleAssign = async () => {
    if (!selectedEmployee) return;
    await api.post(`/projects/${id}/employees/${selectedEmployee}`);
    setSelectedEmployee('');
    fetchProject();
  };

  const handleRemove = async (empId: number) => {
    await api.delete(`/projects/${id}/employees/${empId}`);
    fetchProject();
  };

  if (!project) return <div>Loading...</div>;

  const unassignedEmployees = allEmployees.filter((emp: any) => !project.employees?.find((e: any) => e.id === emp.id));

  return (
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{project.name}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{project.description}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{project.status}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Start Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{project.startDate}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Assigned Employees</h3>
          <div className="flex w-full sm:w-auto gap-2">
            <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className="border rounded p-2 flex-grow sm:flex-grow-0">
              <option value="">Select Employee</option>
              {unassignedEmployees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
              ))}
            </select>
            <button onClick={handleAssign} className="bg-green-600 text-white px-4 py-2 rounded">Assign</button>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {project.employees?.map((emp: any) => (
            <li key={emp.id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                <p className="text-sm text-gray-500">{emp.email}</p>
              </div>
              <button onClick={() => handleRemove(emp.id)} className="text-red-600 hover:text-red-900">Remove</button>
            </li>
          ))}
          {(!project.employees || project.employees.length === 0) && (
            <li className="px-4 py-4 sm:px-6 text-gray-500">No employees assigned yet.</li>
          )}
        </ul>
      </div>
    </div>
  );}