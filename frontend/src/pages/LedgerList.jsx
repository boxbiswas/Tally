import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';

export default function LedgerList() {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const companyId = localStorage.getItem('activeCompanyId');

  const fetchLedgers = async (search = '') => {
    try {
      setLoading(true);
      const url = search
        ? `/company/${companyId}/ledger?search=${search}`
        : `/company/${companyId}/ledger`;
      const response = await api.get(url);
      setLedgers(response.data.ledgers);
    } catch (error) {
      toast.error('Failed to fetch ledgers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, [companyId]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLedgers(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ledger?')) return;
    try {
      await api.delete(`/company/${companyId}/ledger/${id}`);
      toast.success('Ledger deleted successfully');
      setLedgers(ledgers.filter(ledger => ledger.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete ledger');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          Ledgers Master
        </h2>

        <div className="flex w-full sm:w-auto items-center gap-4">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ledgers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
          <button
            onClick={() => navigate('/ledgers/create')}
            className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Create Ledger (Alt+L)
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 border-b">
            <tr>
              <th className="p-4 font-semibold">Ledger Name</th>
              <th className="p-4 font-semibold">Group/Type</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">GST No.</th>
              <th className="p-4 font-semibold text-right">Closing Bal.</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
            ) : ledgers.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No ledgers found.</td></tr>
            ) : (
              ledgers.map((ledger) => (
                <tr key={ledger.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-slate-800">{ledger.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${ledger.type === 'CUSTOMER' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                      {ledger.type}
                    </span>
                  </td>
                  <td className="p-4">{ledger.mobile || '-'}</td>
                  <td className="p-4">{ledger.gstNo || '-'}</td>
                  <td className="p-4 text-right font-medium">₹{ledger.balance.toFixed(2)}</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() => navigate(`/ledgers/edit/${ledger.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Alter Ledger"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ledger.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Ledger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}