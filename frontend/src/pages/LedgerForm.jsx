import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../https/axios';

// Sub-components
import LedgerFormHeader from '../components/ledgerForm/LedgerFormHeader';
import LedgerFormFields from '../components/ledgerForm/LedgerFormFields';

export default function LedgerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const companyId = localStorage.getItem('activeCompanyId');

  const [formData, setFormData] = useState({
    name: '',
    type: 'CUSTOMER',
    mobile: '',
    gstNo: '',
    address: '',
    openingBalance: 0
  });
  const [loading, setLoading] = useState(false);

  // Fetch ledger data if editing
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
    <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>

      <LedgerFormHeader
        isEdit={isEdit}
        onBack={() => navigate('/ledgers')}
      />

      <form onSubmit={handleSubmit} className="p-6">
        <LedgerFormFields
          formData={formData}
          isEdit={isEdit}
          onChange={handleChange}
          loading={loading}
        />
      </form>
    </div>
  );
}