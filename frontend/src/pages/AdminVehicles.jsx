import React, { useEffect, useState } from 'react';
import { getAllVehicles } from '../services/vehicleService';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllVehicles()
      .then(setVehicles)
      .catch(() => setError('Failed to fetch vehicles'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = vehicles.filter(v => {
    const q = search.toLowerCase();
    return (
      (v.plateNumber || v.id || '').toLowerCase().includes(q) ||
      (v.driverName || '').toLowerCase().includes(q) ||
      (v.vehicleType || '').toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    const headers = [
      'Plate Number', 'Type', 'Driver', 'Entry Time', 'Exit Time', 'Status', 'Payment'
    ];
    const rows = filtered.map(v => [
      v.plateNumber || v.id,
      v.vehicleType,
      v.driverName,
      v.entryTime ? new Date(v.entryTime).toLocaleString() : '-',
      v.exitTime ? new Date(v.exitTime).toLocaleString() : '-',
      v.status,
      v.paymentStatus || 'unpaid',
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(x => `"${(x ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicles_report_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">All Vehicles</h1>
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <input
            type="text"
            placeholder="Search by plate, driver, or type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={exportCSV}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow"
          >
            Export as CSV
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-8">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plate Number</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Entry Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Exit Time</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">No vehicles found.</td></tr>
                ) : filtered.map(v => (
                  <tr key={v.id || v.plateNumber} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono">{v.plateNumber || v.id}</td>
                    <td className="px-4 py-2">{v.vehicleType}</td>
                    <td className="px-4 py-2">{v.driverName}</td>
                    <td className="px-4 py-2">{v.entryTime ? new Date(v.entryTime).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2">{v.exitTime ? new Date(v.exitTime).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${v.status === 'entered' ? 'bg-green-100 text-green-700' : v.status === 'exited' ? 'bg-gray-200 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>{v.status}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${v.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{v.paymentStatus || 'unpaid'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVehicles; 