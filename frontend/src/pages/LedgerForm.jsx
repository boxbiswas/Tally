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
    <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
      
      {/* Header */}
      <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/ledgers')}
            className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Alter Ledger' : 'Ledger Creation'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Ledger Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Ledger Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-glass"
              placeholder="e.g. Rahul Traders"
            />
          </div>

          {/* Under Group */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Under Group *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="select-glass"
            >
              <option value="CUSTOMER">Sundry Debtors (Customer)</option>
              <option value="SUPPLIER">Sundry Creditors (Supplier)</option>
            </select>
          </div>

          {/* Opening Balance */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Opening Balance (₹)</label>
            <input
              type="number"
              name="openingBalance"
              step="0.01"
              value={formData.openingBalance}
              onChange={handleChange}
              className="input-glass"
            />
          </div>

          {/* Section Divider: Mailing Details */}
          <div className="md:col-span-2 pt-3 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Mailing Details</h3>
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="input-glass"
              placeholder="+91..."
            />
          </div>

          {/* GST */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>GSTIN / UIN</label>
            <input
              type="text"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleChange}
              className="input-glass uppercase"
              placeholder="22AAAAA0000A1Z5"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Address</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="input-glass resize-none"
              placeholder="Full billing address..."
            />
          </div>

        </div>

        {/* Footer */}
        <div className="mt-7 flex justify-end pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Accept & Save'}
          </button>
        </div>
      </form>
    </div>
  );
}