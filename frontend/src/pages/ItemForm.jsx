import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../https/axios';

// Sub-components
import ItemFormHeader from '../components/itemForm/ItemFormHeader';
import ItemFormFields from '../components/itemForm/ItemFormFields';

export default function ItemForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const companyId = localStorage.getItem('activeCompanyId');

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        unit: 'PCS',
        purchasePrice: 0,
        sellingPrice: 0,
        openingQty: 0,
        gstRate: 0
    });
    const [loading, setLoading] = useState(false);

    // Load existing item data in edit mode
    useEffect(() => {
        if (isEdit) {
            const fetchItem = async () => {
                try {
                    const response = await api.get(`/company/${companyId}/item/${id}`);
                    const item = response.data.item;
                    setFormData({
                        name: item.name,
                        sku: item.sku,
                        unit: item.unit,
                        purchasePrice: item.purchasePrice,
                        sellingPrice: item.sellingPrice,
                        openingQty: item.openingQty,
                        gstRate: item.gstRate
                    });
                } catch (error) {
                    toast.error('Failed to load item details');
                    navigate('/inventory');
                }
            };
            fetchItem();
        }
    }, [id, isEdit, companyId, navigate]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/company/${companyId}/item/${id}`, formData);
                toast.success('Item updated successfully');
            } else {
                await api.post(`/company/${companyId}/item`, formData);
                toast.success('Item created successfully');
            }
            navigate('/inventory');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>

            <ItemFormHeader
                isEdit={isEdit}
                onBack={() => navigate('/inventory')}
            />

            <form onSubmit={handleSubmit} className="p-6">
                <ItemFormFields
                    formData={formData}
                    isEdit={isEdit}
                    onChange={handleChange}
                    loading={loading}
                />
            </form>
        </div>
    );
}