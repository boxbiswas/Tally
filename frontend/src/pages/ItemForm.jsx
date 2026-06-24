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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/inventory')} className="text-gray-500 hover:text-slate-800">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEdit ? 'Alter Stock Item' : 'Stock Item Creation'}
                    </h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* General Details */}
                    <div className="space-y-5">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">General Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Wireless Mouse"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU Code *</label>
                                <input
                                    type="text"
                                    name="sku"
                                    required
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                                    placeholder="MOU-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure *</label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white uppercase"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">GST Percentage (%)</label>
                            <select
                                name="gstRate"
                                value={formData.gstRate}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2">Pricing & Inventory</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Rate (₹)</label>
                                <input
                                    type="number"
                                    name="purchasePrice"
                                    step="0.01"
                                    min="0"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Rate (₹)</label>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    step="0.01"
                                    min="0"
                                    value={formData.sellingPrice}
                                    onChange={handleChange}
                                    className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mt-4">
                            <label className="block text-sm font-bold text-slate-800 mb-1">Opening Balance (Quantity)</label>
                            <p className="text-xs text-slate-500 mb-3">Set this only if you already have stock on hand.</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    name="openingQty"
                                    step="0.01"
                                    min="0"
                                    disabled={isEdit} // Standard ERP rule: opening balance shouldn't easily change after creation
                                    value={formData.openingQty}
                                    onChange={handleChange}
                                    className={`w-full p-2.5 border rounded-md outline-none ${isEdit ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'}`}
                                />
                                <span className="text-sm font-semibold text-slate-600 bg-white px-3 py-2.5 border rounded-md uppercase">
                                    {formData.unit}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
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