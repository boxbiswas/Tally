import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../https/axios';

export default function LedgerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const companyId = localStorage.getItem('activeCompanyId');

  const [formData, setFormData] = useState({
    name: '',
    type: 'CUSTOMER', // Default type
    mobile: '',
    gstNo: '',
    address: '',
    openingBalance: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchLedger = async () => {
        try {
          const response = await api.get(`/company/${companyId}/ledger/${id}`);
          const ledger = response.data.ledger;
          setFormData({
            name: ledger.name,
            type: ledger.type,
            mobile: ledger.mobile || '',
            gstNo: ledger.gstNo || '',
            address: ledger.address || '',
            openingBalance: ledger.openingBalance
          });
        } catch (error) {
          toast.error('Failed to load ledger details');
          navigate('/ledgers');
        }
      };
      fetchLedger();
    }
  }, [id, isEdit, companyId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'openingBalance' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/company/${companyId}/ledger/${id}`, formData);
        toast.success('Ledger updated successfully');
      } else {
        await api.post(`/company/${companyId}/ledger`, formData);
        toast.success('Ledger created successfully');
      }
      navigate('/ledgers');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/ledgers')} className="text-gray-500 hover:text-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800">
            {isEdit ? 'Alter Ledger' : 'Ledger Creation'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Rahul Traders"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Under Group *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="CUSTOMER">Sundry Debtors (Customer)</option>
              <option value="SUPPLIER">Sundry Creditors (Supplier)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance (₹)</label>
            <input
              type="number"
              name="openingBalance"
              step="0.01"
              value={formData.openingBalance}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-2 border-t pt-6 mt-2">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Mailing Details</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="+91..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN / UIN</label>
            <input
              type="text"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none uppercase"
              placeholder="22AAAAA0000A1Z5"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Full billing address..."
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Accept & Save'}
          </button>
        </div>
      </form>
    </div>
  );
}