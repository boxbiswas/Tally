import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../https/axios';

export default function ItemForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const companyId = localStorage.getItem('activeCompanyId');

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        unit: 'PCS', // Standard default
        purchasePrice: 0,
        sellingPrice: 0,
        openingQty: 0,
        gstRate: 0
    });
    const [loading, setLoading] = useState(false);

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
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}>
            
            {/* Header */}
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/inventory')}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150"
                        style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {isEdit ? 'Alter Stock Item' : 'Stock Item Creation'}
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* General Details */}
                    <div className="space-y-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest pb-2.5" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>General Details</h3>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Item Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="input-glass"
                                placeholder="e.g. Wireless Mouse"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>SKU Code *</label>
                                <input
                                    type="text"
                                    name="sku"
                                    required
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="input-glass uppercase font-mono"
                                    placeholder="MOU-001"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Unit of Measure *</label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="select-glass uppercase"
                                >
                                    <option value="PCS">Pieces (PCS)</option>
                                    <option value="KG">Kilograms (KG)</option>
                                    <option value="BOX">Boxes (BOX)</option>
                                    <option value="LTR">Liters (LTR)</option>
                                    <option value="PACK">Packs (PACK)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>GST Percentage (%)</label>
                            <select
                                name="gstRate"
                                value={formData.gstRate}
                                onChange={handleChange}
                                className="select-glass"
                            >
                                <option value={0}>0% - Exempt</option>
                                <option value={5}>5%</option>
                                <option value={12}>12%</option>
                                <option value={18}>18%</option>
                                <option value={28}>28%</option>
                            </select>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="space-y-5">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest pb-2.5" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Pricing &amp; Inventory</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Purchase Rate (₹)</label>
                                <input
                                    type="number"
                                    name="purchasePrice"
                                    step="0.01"
                                    min="0"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    className="input-glass"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Selling Rate (₹)</label>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    step="0.01"
                                    min="0"
                                    value={formData.sellingPrice}
                                    onChange={handleChange}
                                    className="input-glass"
                                />
                            </div>
                        </div>

                        {/* Opening Balance Info Box */}
                        <div className="p-4 rounded-xl mt-2" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#a5b4fc' }}>Opening Balance (Quantity)</label>
                            <p className="text-xs mb-3 font-medium" style={{ color: 'var(--text-muted)' }}>Set this only if you already have stock on hand.</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    name="openingQty"
                                    step="0.01"
                                    min="0"
                                    disabled={isEdit} // Standard ERP rule: opening balance shouldn't easily change after creation
                                    value={formData.openingQty}
                                    onChange={handleChange}
                                    className={`input-glass flex-1 ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={isEdit ? { background: 'rgba(255,255,255,0.02)' } : {}}
                                />
                                <span className="text-xs font-bold uppercase px-3 py-2.5 rounded-lg shrink-0"
                                    style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {formData.unit}
                                </span>
                            </div>
                        </div>
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