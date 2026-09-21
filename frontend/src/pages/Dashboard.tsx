import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Employees</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalEmployees}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Active Employees</dt>
          <dd className="mt-1 text-3xl font-semibold text-blue-500">{stats.activeEmployees}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalProjects}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-500">{stats.activeProjects}</dd>
        </div>
      </div>
    </div>
  );}