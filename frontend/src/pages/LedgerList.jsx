import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../https/axios';

import LedgerListHeader from '../components/ledgerList/LedgerListHeader';
import LedgerTable from '../components/ledgerList/LedgerTable';


export default function LedgerList() {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const companyId = localStorage.getItem('activeCompanyId');

  /**
   * Fetch ledgers with optional search
   */
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

  // Initial data load
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

  /**
   * Delete ledger with confirmation
   */
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
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.4)'
      }}>

      {/* Header Section */}
      <LedgerListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreate={() => navigate('/ledgers/create')}
      />

      {/* Table Section */}
      <LedgerTable
        ledgers={ledgers}
        loading={loading}
        onEdit={(id) => navigate(`/ledgers/edit/${id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
}