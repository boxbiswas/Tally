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
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
      
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Title */}
        <h2 className="text-lg font-bold flex items-center gap-2.5 shrink-0" style={{ color: 'var(--text-primary)' }}>
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          Ledgers Master
        </h2>

        {/* Search + CTA — always right-aligned, never wraps */}
        <div className="flex items-center gap-3">
          <div className="relative w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none z-10" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search ledgers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-search"
            />
          </div>
          <button
            onClick={() => navigate('/ledgers/create')}
            className="btn-primary text-sm shrink-0"
          >
            <Plus className="h-4 w-4" /> Create Ledger (Alt+L)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Ledger Name','Group/Type','Contact','GST No.','Closing Bal.','Actions'].map((h, i) => (
                <th key={h} className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${i === 4 ? 'text-right' : i === 5 ? 'text-center' : ''}`} style={{ color: 'var(--text-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="px-5 py-12 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : ledgers.length === 0 ? (
              <tr><td colSpan="6" className="px-5 py-12 text-center text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No ledgers found.</td></tr>
            ) : (
              ledgers.map((ledger, idx) => (
                <tr
                  key={ledger.id}
                  className="table-row-hover"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}
                >
                  <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{ledger.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={ledger.type === 'CUSTOMER' ? 'badge-blue' : 'badge-purple'}>
                      {ledger.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{ledger.mobile || '—'}</td>
                  <td className="px-5 py-3.5 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{ledger.gstNo || '—'}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>₹{ledger.balance.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/ledgers/edit/${ledger.id}`)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                        style={{ color: '#60a5fa', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; }}
                        title="Alter Ledger"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ledger.id)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                        style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                        title="Delete Ledger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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