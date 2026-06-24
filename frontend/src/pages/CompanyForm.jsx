import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Building, Calendar, Hash, ArrowLeft } from 'lucide-react';
import api from '../https/axios';

const CompanyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({ name: '', gstNo: '', financialYear: '2023-24' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEdit) {
            const fetchCompany = async () => {
                try {
                    const response = await api.get(`/company/${id}`);
                    setFormData({
                        name: response.data.company.name,
                        gstNo: response.data.company.gstNo || '',
                        financialYear: response.data.company.financialYear
                    });
                } catch (error) {
                    toast.error('Failed to load company details');
                    navigate('/companies');
                }
            };
            fetchCompany();
        }
    }, [id, isEdit, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/company/${id}`, formData);
                toast.success('Company updated successfully');
            } else {
                await api.post('/company', formData);
                toast.success('Company created successfully');
            }
            navigate('/companies');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <button onClick={() => navigate('/companies')} className="text-gray-500 hover:text-slate-800 mb-6 flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Companies
                </button>

                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    {isEdit ? 'Edit Company' : 'Create New Company'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="pl-10 w-full p-2.5 border rounded-md focus:ring-2 focus:ring-slate-800 outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                className="pl-10 w-full p-2.5 border rounded-md focus:ring-2 focus:ring-slate-800 outline-none"
                                value={formData.gstNo}
                                onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year *</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <select
                                required
                                className="pl-10 w-full p-2.5 border rounded-md focus:ring-2 focus:ring-slate-800 outline-none bg-white"
                                value={formData.financialYear}
                                onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
                            >
                                <option value="2023-24">2023-24</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2025-26">2025-26</option>
                                <option value="2026-27">2026-27</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-800 text-white p-2.5 rounded-md hover:bg-slate-700 transition disabled:opacity-70 mt-4"
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Update Company' : 'Create Company')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompanyForm;